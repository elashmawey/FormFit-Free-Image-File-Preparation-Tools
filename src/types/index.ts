export type SupportedMimeType = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ImageFile {
  file: File;
  name: string;
  size: number;
  type: SupportedMimeType | string;
  width: number;
  height: number;
  objectUrl: string;
  hasTransparency: boolean;
}

export interface ProcessedResult {
  blob: Blob;
  objectUrl: string;
  width: number;
  height: number;
  size: number;
  format: SupportedMimeType;
  reductionBytes: number;
  reductionPercentage: number;
  qualityUsed?: number;
  scaleUsed?: number;
  success: boolean;
  warning?: string;
  isLargerThanOriginal: boolean;
}

export interface CompressionOptions {
  targetSizeKB?: number;
  quality?: number; // 0.05 to 1.0
  format: SupportedMimeType;
  autoDownscale: boolean;
  preserveTransparency: boolean;
}

export type ResizeMode = 'preserve' | 'crop' | 'fit' | 'stretch';

export interface ResizeOptions {
  width: number;
  height: number;
  mode: ResizeMode;
  format: SupportedMimeType;
  quality?: number;
  targetSizeKB?: number;
  preserveTransparency: boolean;
}

export interface ConversionOptions {
  format: SupportedMimeType;
  quality?: number;
  preserveTransparency: boolean;
}

export interface SignatureCropRect {
  x: number; // percentage 0-100 or absolute
  y: number;
  width: number;
  height: number;
}

export interface SignatureOptions {
  cropRect?: SignatureCropRect;
  targetWidth?: number;
  targetHeight?: number;
  format: SupportedMimeType;
  targetSizeKB?: number;
  enhanceContrast?: boolean;
  whiteThreshold?: number; // for cleaning faint paper background
}

export type Language = 'en' | 'ar';

export * from './workspace';
