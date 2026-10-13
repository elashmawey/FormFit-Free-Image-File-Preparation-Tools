import {
  SupportedMimeType,
  ImageFile,
  ProcessedResult,
  CompressionOptions,
  ResizeOptions,
  ConversionOptions,
  SignatureOptions,
  SignatureCropRect,
} from '../types';

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export const SUPPORTED_MIME_TYPES: SupportedMimeType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function revokeObjectUrl(url: string | null): void {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore revocation errors
    }
  }
}

export function downloadBlob(blob: Blob, suggestedFilename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = suggestedFilename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export async function loadImageFromFile(file: File): Promise<ImageFile> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size (${formatFileSize(file.size)}) exceeds the maximum limit of 20 MB.`
    );
  }

  const isTypeSupported =
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg' ||
    file.type === 'image/png' ||
    file.type === 'image/webp';

  if (!isTypeSupported) {
    throw new Error(
      `Unsupported file format (${file.type || 'unknown'}). Supported formats are JPEG, PNG, and WebP.`
    );
  }

  const normalizedType: SupportedMimeType =
    file.type === 'image/jpg' ? 'image/jpeg' : (file.type as SupportedMimeType);

  const objectUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Check transparency for PNG and WebP
      let hasTransparency = false;
      if (normalizedType === 'image/png' || normalizedType === 'image/webp') {
        try {
          const sampleCanvas = document.createElement('canvas');
          const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
          if (sampleCtx) {
            const w = Math.min(img.naturalWidth, 120);
            const h = Math.min(img.naturalHeight, 120);
            sampleCanvas.width = w;
            sampleCanvas.height = h;
            sampleCtx.drawImage(img, 0, 0, w, h);
            const imgData = sampleCtx.getImageData(0, 0, w, h);
            for (let i = 3; i < imgData.data.length; i += 4) {
              if (imgData.data[i] < 250) {
                hasTransparency = true;
                break;
              }
            }
          }
        } catch {
          hasTransparency = false;
        }
      }

      resolve({
        file,
        name: file.name,
        size: file.size,
        type: normalizedType,
        width: img.naturalWidth,
        height: img.naturalHeight,
        objectUrl,
        hasTransparency,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image. The file may be corrupted or invalid.'));
    };
    img.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: SupportedMimeType,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas encoding failed to produce a valid image file.'));
        }
      },
      format,
      quality !== undefined ? Math.max(0.01, Math.min(1.0, quality)) : undefined
    );
  });
}

function drawImageOnCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  format: SupportedMimeType,
  preserveTransparency: boolean,
  cropArea?: { sx: number; sy: number; sw: number; sh: number }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context could not be initialized.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // If format is JPEG, it cannot store alpha transparency. Fill with pure clean white.
  if (format === 'image/jpeg' || !preserveTransparency) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  if (cropArea) {
    ctx.drawImage(
      img,
      cropArea.sx,
      cropArea.sy,
      cropArea.sw,
      cropArea.sh,
      0,
      0,
      canvas.width,
      canvas.height
    );
  } else {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  return canvas;
}

export async function compressImage(
  imageFile: ImageFile,
  options: CompressionOptions
): Promise<ProcessedResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        const targetFormat = options.format;
        const originalSize = imageFile.size;

        let warning: string | undefined;
        if (imageFile.hasTransparency && targetFormat === 'image/jpeg') {
          warning =
            'Transparent areas were filled with a clean white background because JPEG does not support transparency.';
        }

        // Case 1: Target file size in KB specified
        if (options.targetSizeKB && options.targetSizeKB > 0) {
          const targetBytes = options.targetSizeKB * 1024;
          let currentScale = 1.0;
          let bestBlob: Blob | null = null;
          let bestQuality = 0.8;
          let bestWidth = originalWidth;
          let bestHeight = originalHeight;

          // Progressive scale steps if quality alone cannot achieve target size
          const scaleSteps = options.autoDownscale
            ? [1.0, 0.85, 0.72, 0.58, 0.45, 0.35, 0.25, 0.18, 0.12]
            : [1.0];

          for (const scale of scaleSteps) {
            currentScale = scale;
            const testW = Math.max(16, Math.round(originalWidth * scale));
            const testH = Math.max(16, Math.round(originalHeight * scale));

            const canvas = drawImageOnCanvas(
              img,
              testW,
              testH,
              targetFormat,
              options.preserveTransparency
            );

            if (targetFormat === 'image/png') {
              // PNG is lossless in HTML5 canvas; quality param is ignored by browsers
              const testBlob = await canvasToBlob(canvas, 'image/png');
              if (testBlob.size <= targetBytes) {
                bestBlob = testBlob;
                bestWidth = testW;
                bestHeight = testH;
                break;
              }
              // If last scale step, use best available
              if (scale === scaleSteps[scaleSteps.length - 1] || !options.autoDownscale) {
                bestBlob = testBlob;
                bestWidth = testW;
                bestHeight = testH;
                break;
              }
            } else {
              // Lossy formats: JPEG or WebP -> bounded continuous binary search
              const minQ = 0.02;
              const maxQ = 0.98;

              // Check if minimum quality can reach target at this scale
              const minBlob = await canvasToBlob(canvas, targetFormat, minQ);
              if (minBlob.size > targetBytes) {
                // Cannot fit at this dimension even at 2% quality
                if (scale === scaleSteps[scaleSteps.length - 1] || !options.autoDownscale) {
                  bestBlob = minBlob;
                  bestQuality = minQ;
                  bestWidth = testW;
                  bestHeight = testH;
                  break;
                }
                // Continue to next smaller scale step
                continue;
              }

              // Check if maximum quality already fits under target
              const maxBlob = await canvasToBlob(canvas, targetFormat, maxQ);
              if (maxBlob.size <= targetBytes) {
                bestBlob = maxBlob;
                bestQuality = maxQ;
                bestWidth = testW;
                bestHeight = testH;
                break;
              }

              // Binary search between minQ and maxQ to find highest quality that stays <= targetBytes
              let low = minQ;
              let high = maxQ;
              let candidateBlob = minBlob;
              let candidateQ = minQ;

              for (let iter = 0; iter < 9; iter++) {
                const mid = (low + high) / 2;
                const testBlob = await canvasToBlob(canvas, targetFormat, mid);
                if (testBlob.size <= targetBytes) {
                  candidateBlob = testBlob;
                  candidateQ = mid;
                  low = mid; // test higher quality to maximize visual clarity
                } else {
                  high = mid; // too large, lower quality
                }
              }

              bestBlob = candidateBlob;
              bestQuality = candidateQ;
              bestWidth = testW;
              bestHeight = testH;
              break;
            }
          }

          if (!bestBlob) {
            // Absolute fallback
            const canvas = drawImageOnCanvas(
              img,
              originalWidth,
              originalHeight,
              targetFormat,
              options.preserveTransparency
            );
            bestBlob = await canvasToBlob(canvas, targetFormat, 0.1);
          }

          const finalSize = bestBlob.size;
          const isTargetAchieved = finalSize <= targetBytes;

          if (!isTargetAchieved) {
            if (!options.autoDownscale) {
              warning = `Could not reach ${options.targetSizeKB} KB at original dimensions (${originalWidth}×${originalHeight}px). Enable "Auto-reduce dimensions" or select a larger target size.`;
            } else {
              warning = `Target size ${options.targetSizeKB} KB could not be achieved even after scaling down to ${bestWidth}×${bestHeight}px. Achieved size is ${formatFileSize(finalSize)}.`;
            }
          } else if (currentScale < 1.0) {
            warning = `Dimensions were automatically scaled to ${bestWidth}×${bestHeight}px (${Math.round(currentScale * 100)}%) to strictly meet the ${options.targetSizeKB} KB target.`;
          }

          const reductionBytes = originalSize - finalSize;
          const reductionPercentage =
            originalSize > 0
              ? Math.round((reductionBytes / originalSize) * 1000) / 10
              : 0;

          const objectUrl = URL.createObjectURL(bestBlob);

          resolve({
            blob: bestBlob,
            objectUrl,
            width: bestWidth,
            height: bestHeight,
            size: finalSize,
            format: targetFormat,
            reductionBytes,
            reductionPercentage,
            qualityUsed: targetFormat !== 'image/png' ? bestQuality : undefined,
            scaleUsed: currentScale,
            success: isTargetAchieved,
            warning,
            isLargerThanOriginal: finalSize > originalSize,
          });
        } else {
          // Case 2: Quality slider / manual quality compression
          const quality = options.quality ?? 0.8;
          const canvas = drawImageOnCanvas(
            img,
            originalWidth,
            originalHeight,
            targetFormat,
            options.preserveTransparency
          );

          const blob = await canvasToBlob(canvas, targetFormat, quality);
          const finalSize = blob.size;
          const reductionBytes = originalSize - finalSize;
          const reductionPercentage =
            originalSize > 0
              ? Math.round((reductionBytes / originalSize) * 1000) / 10
              : 0;

          if (finalSize > originalSize) {
            warning =
              'The compressed file is slightly larger than the original. The original image may already be heavily compressed.';
          }

          const objectUrl = URL.createObjectURL(blob);

          resolve({
            blob,
            objectUrl,
            width: originalWidth,
            height: originalHeight,
            size: finalSize,
            format: targetFormat,
            reductionBytes,
            reductionPercentage,
            qualityUsed: quality,
            scaleUsed: 1.0,
            success: true,
            warning,
            isLargerThanOriginal: finalSize > originalSize,
          });
        }
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Compression failed.'));
      }
    };
    img.onerror = () => reject(new Error('Failed to render image for compression.'));
    img.src = imageFile.objectUrl;
  });
}

export async function resizeImage(
  imageFile: ImageFile,
  options: ResizeOptions
): Promise<ProcessedResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const origW = img.naturalWidth;
        const origH = img.naturalHeight;
        const reqW = Math.max(1, Math.round(options.width));
        const reqH = Math.max(1, Math.round(options.height));

        let warning: string | undefined;
        if (imageFile.hasTransparency && options.format === 'image/jpeg') {
          warning =
            'Transparent areas were filled with a clean white background because JPEG does not support transparency.';
        }

        let canvas: HTMLCanvasElement;

        switch (options.mode) {
          case 'crop': {
            // Center crop to fill target aspect ratio
            const targetRatio = reqW / reqH;
            const origRatio = origW / origH;
            let sx = 0;
            let sy = 0;
            let sw = origW;
            let sh = origH;

            if (origRatio > targetRatio) {
              // Image is wider than target: crop left & right
              sw = origH * targetRatio;
              sx = (origW - sw) / 2;
            } else {
              // Image is taller than target: crop top & bottom
              sh = origW / targetRatio;
              sy = (origH - sh) / 2;
            }

            canvas = drawImageOnCanvas(
              img,
              reqW,
              reqH,
              options.format,
              options.preserveTransparency,
              { sx, sy, sw, sh }
            );
            break;
          }

          case 'fit': {
            // Fit within target dimensions, maintain aspect ratio with canvas padding
            canvas = document.createElement('canvas');
            canvas.width = reqW;
            canvas.height = reqH;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context could not be created');

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            if (options.format === 'image/jpeg' || !options.preserveTransparency) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, reqW, reqH);
            } else {
              ctx.clearRect(0, 0, reqW, reqH);
            }

            const scale = Math.min(reqW / origW, reqH / origH);
            const drawW = origW * scale;
            const drawH = origH * scale;
            const dx = (reqW - drawW) / 2;
            const dy = (reqH - drawH) / 2;

            ctx.drawImage(img, dx, dy, drawW, drawH);
            break;
          }

          case 'preserve': {
            // Proportional resize: ensure exact aspect ratio is preserved without stretching
            const scale = Math.min(reqW / origW, reqH / origH);
            const proportionalW = Math.max(1, Math.round(origW * scale));
            const proportionalH = Math.max(1, Math.round(origH * scale));

            canvas = drawImageOnCanvas(
              img,
              proportionalW,
              proportionalH,
              options.format,
              options.preserveTransparency
            );
            break;
          }

          case 'stretch':
          default: {
            // Exact stretch to specified dimensions
            canvas = drawImageOnCanvas(
              img,
              reqW,
              reqH,
              options.format,
              options.preserveTransparency
            );
            break;
          }
        }

        // Quality and optional target file size in KB
        let blob: Blob;
        let qualityUsed = options.quality ?? 0.88;

        if (options.targetSizeKB && options.targetSizeKB > 0 && options.format !== 'image/png') {
          const targetBytes = options.targetSizeKB * 1024;
          let low = 0.05;
          let high = 0.95;
          let candidateBlob: Blob | null = null;

          for (let it = 0; it < 8; it++) {
            const mid = (low + high) / 2;
            const b = await canvasToBlob(canvas, options.format, mid);
            if (b.size <= targetBytes) {
              candidateBlob = b;
              qualityUsed = mid;
              low = mid;
            } else {
              high = mid;
            }
          }

          blob = candidateBlob || (await canvasToBlob(canvas, options.format, 0.05));
          if (blob.size > targetBytes) {
            warning = `Target size ${options.targetSizeKB} KB could not be achieved for ${canvas.width}×${canvas.height}px. Output is ${formatFileSize(blob.size)}.`;
          }
        } else {
          blob = await canvasToBlob(canvas, options.format, qualityUsed);
        }

        const finalSize = blob.size;
        const originalSize = imageFile.size;
        const reductionBytes = originalSize - finalSize;
        const reductionPercentage =
          originalSize > 0
            ? Math.round((reductionBytes / originalSize) * 1000) / 10
            : 0;

        const objectUrl = URL.createObjectURL(blob);

        resolve({
          blob,
          objectUrl,
          width: canvas.width,
          height: canvas.height,
          size: finalSize,
          format: options.format,
          reductionBytes,
          reductionPercentage,
          qualityUsed,
          success: true,
          warning,
          isLargerThanOriginal: finalSize > originalSize,
        });
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Image resizing failed.'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for resizing.'));
    img.src = imageFile.objectUrl;
  });
}

export async function convertImage(
  imageFile: ImageFile,
  options: ConversionOptions
): Promise<ProcessedResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        let warning: string | undefined;

        if (imageFile.hasTransparency && options.format === 'image/jpeg') {
          warning =
            'Transparent areas were filled with a clean white background because JPEG does not support transparency.';
        }

        const canvas = drawImageOnCanvas(
          img,
          w,
          h,
          options.format,
          options.preserveTransparency
        );

        const quality = options.quality ?? 0.92;
        const blob = await canvasToBlob(canvas, options.format, quality);

        const originalSize = imageFile.size;
        const finalSize = blob.size;
        const reductionBytes = originalSize - finalSize;
        const reductionPercentage =
          originalSize > 0
            ? Math.round((reductionBytes / originalSize) * 1000) / 10
            : 0;

        const objectUrl = URL.createObjectURL(blob);

        resolve({
          blob,
          objectUrl,
          width: w,
          height: h,
          size: finalSize,
          format: options.format,
          reductionBytes,
          reductionPercentage,
          qualityUsed: options.format !== 'image/png' ? quality : undefined,
          success: true,
          warning,
          isLargerThanOriginal: finalSize > originalSize,
        });
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Format conversion failed.'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for conversion.'));
    img.src = imageFile.objectUrl;
  });
}

export function autoDetectSignatureBounds(img: HTMLImageElement): SignatureCropRect {
  const canvas = document.createElement('canvas');
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    return { x: 0, y: 0, width: w, height: h };
  }

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  let foundDarkPixel = false;

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      if (a < 50) continue; // transparent pixel

      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      if (brightness < 220) {
        foundDarkPixel = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!foundDarkPixel || maxX <= minX || maxY <= minY) {
    return { x: 0, y: 0, width: w, height: h };
  }

  const padX = Math.round((maxX - minX) * 0.08);
  const padY = Math.round((maxY - minY) * 0.08);

  const boundedX = Math.max(0, minX - padX);
  const boundedY = Math.max(0, minY - padY);
  const boundedW = Math.min(w - boundedX, maxX - minX + padX * 2);
  const boundedH = Math.min(h - boundedY, maxY - minY + padY * 2);

  return {
    x: boundedX,
    y: boundedY,
    width: Math.max(20, boundedW),
    height: Math.max(20, boundedH),
  };
}

export async function processSignature(
  imageFile: ImageFile,
  options: SignatureOptions
): Promise<ProcessedResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const origW = img.naturalWidth;
        const origH = img.naturalHeight;

        // Crop area calculation
        const crop = options.cropRect || { x: 0, y: 0, width: origW, height: origH };
        const sx = Math.max(0, Math.min(origW - 1, crop.x));
        const sy = Math.max(0, Math.min(origH - 1, crop.y));
        const sw = Math.max(1, Math.min(origW - sx, crop.width));
        const sh = Math.max(1, Math.min(origH - sy, crop.height));

        const targetW = options.targetWidth || sw;
        const targetH = options.targetHeight || sh;

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(targetW);
        canvas.height = Math.round(targetH);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Canvas 2D context could not be created');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Background handling
        const isJpeg = options.format === 'image/jpeg';
        if (isJpeg) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Draw cropped signature
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

        // Optional contrast enhancement / ink darkening
        if (options.enhanceContrast) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const threshold = options.whiteThreshold || 215;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a < 20) continue;

            const brightness = (r * 299 + g * 587 + b * 114) / 1000;

            if (brightness > threshold) {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
            } else {
              data[i] = Math.round(r * 0.75);
              data[i + 1] = Math.round(g * 0.75);
              data[i + 2] = Math.round(b * 0.75);
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        // Encoding & target size check
        let quality = 0.9;
        let blob: Blob;
        let warning: string | undefined;

        if (options.targetSizeKB && options.targetSizeKB > 0 && options.format !== 'image/png') {
          const targetBytes = options.targetSizeKB * 1024;
          let low = 0.05;
          let high = 0.95;
          let candidateBlob: Blob | null = null;

          for (let it = 0; it < 8; it++) {
            const mid = (low + high) / 2;
            const b = await canvasToBlob(canvas, options.format, mid);
            if (b.size <= targetBytes) {
              candidateBlob = b;
              quality = mid;
              low = mid;
            } else {
              high = mid;
            }
          }

          blob = candidateBlob || (await canvasToBlob(canvas, options.format, 0.05));
          if (blob.size > targetBytes) {
            warning = `Signature size (${formatFileSize(blob.size)}) exceeds ${options.targetSizeKB} KB target. Consider smaller dimensions.`;
          }
        } else {
          blob = await canvasToBlob(canvas, options.format, quality);
        }

        const originalSize = imageFile.size;
        const finalSize = blob.size;
        const reductionBytes = originalSize - finalSize;
        const reductionPercentage =
          originalSize > 0
            ? Math.round((reductionBytes / originalSize) * 1000) / 10
            : 0;

        const objectUrl = URL.createObjectURL(blob);

        resolve({
          blob,
          objectUrl,
          width: canvas.width,
          height: canvas.height,
          size: finalSize,
          format: options.format,
          reductionBytes,
          reductionPercentage,
          qualityUsed: options.format !== 'image/png' ? quality : undefined,
          success: true,
          warning,
          isLargerThanOriginal: finalSize > originalSize,
        });
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Signature processing failed.'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for signature processing.'));
    img.src = imageFile.objectUrl;
  });
}
