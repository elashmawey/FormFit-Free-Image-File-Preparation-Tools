import { SupportedMimeType } from '../types';

export interface ParsedRequirements {
  rawText: string;
  maxSizeKB?: number;
  width?: number;
  height?: number;
  format?: SupportedMimeType;
  aspectRatio?: string;
  detectedFields: {
    maxSize: boolean;
    dimensions: boolean;
    format: boolean;
    aspectRatio: boolean;
  };
  summary: string;
}

export function parseUploadRequirements(text: string, lang: 'en' | 'ar' = 'en'): ParsedRequirements | null {
  if (!text || text.trim().length < 5) {
    return null;
  }

  const clean = text.toLowerCase();
  let maxSizeKB: number | undefined;
  let width: number | undefined;
  let height: number | undefined;
  let format: SupportedMimeType | undefined;
  let aspectRatio: string | undefined;

  // 1. Detect Maximum File Size (KB or MB)
  // Check MB first
  const mbRegex = /(\d+(?:\.\d+)?)\s*(?:mb|mega\s*bytes?|ميجابايت|م\.ب)/i;
  const mbMatch = clean.match(mbRegex);
  if (mbMatch) {
    const mbVal = parseFloat(mbMatch[1]);
    if (!isNaN(mbVal) && mbVal > 0) {
      maxSizeKB = Math.round(mbVal * 1024);
    }
  }

  // If no MB, check KB
  if (!maxSizeKB) {
    const kbRegex = /(\d+(?:\.\d+)?)\s*(?:kb|kilo\s*bytes?|كيلوبايت|ك\.ب|ك\s*ب)/i;
    const kbMatch = clean.match(kbRegex);
    if (kbMatch) {
      const kbVal = parseFloat(kbMatch[1]);
      if (!isNaN(kbVal) && kbVal > 0) {
        maxSizeKB = Math.round(kbVal);
      }
    }
  }

  // Secondary check for patterns like "less than 50", "under 100", "حد أقصى 50" without explicit unit if within plausible range
  if (!maxSizeKB) {
    const contextSizeRegex = /(?:max|maximum|under|less than|below|أقصى|الحد الأقصى|أقل من|لا يتجاوز)\s*(\d{2,4})\s*(?:k\b)?/i;
    const match = clean.match(contextSizeRegex);
    if (match) {
      const val = parseInt(match[1], 10);
      if (val >= 10 && val <= 5000) {
        maxSizeKB = val;
      }
    }
  }

  // 2. Detect Width & Height in Pixels
  // Pattern: "200 x 230", "600 × 600", "400*500", "200 by 230"
  const dimRegex = /(\d{2,5})\s*(?:x|×|by|في|\*)\s*(\d{2,5})\s*(?:px|pixels?|بكسل)?/i;
  const dimMatch = clean.match(dimRegex);
  if (dimMatch) {
    const w = parseInt(dimMatch[1], 10);
    const h = parseInt(dimMatch[2], 10);
    if (w > 0 && h > 0) {
      width = w;
      height = h;
    }
  }

  // Explicit width / height labels: "width: 300, height: 400" or "العرض 300 والارتفاع 400"
  if (!width || !height) {
    const wMatch = clean.match(/(?:width|العرض|عرض)\s*[:=]?\s*(\d{2,5})/i);
    const hMatch = clean.match(/(?:height|الارتفاع|ارتفاع)\s*[:=]?\s*(\d{2,5})/i);
    if (wMatch && hMatch) {
      width = parseInt(wMatch[1], 10);
      height = parseInt(hMatch[1], 10);
    }
  }

  // 3. Detect Accepted Format
  if (/webp/i.test(clean)) {
    format = 'image/webp';
  } else if (/png/i.test(clean) && !/jpg|jpeg/i.test(clean)) {
    format = 'image/png';
  } else if (/jpg|jpeg|جي بي جي/i.test(clean)) {
    format = 'image/jpeg';
  }

  // 4. Detect Aspect Ratio
  if (/square|مربع/i.test(clean) || (width && height && width === height)) {
    aspectRatio = '1:1';
  } else if (/4:3|4\s*:\s*3/i.test(clean)) {
    aspectRatio = '4:3';
  } else if (/3:4|3\s*:\s*4/i.test(clean)) {
    aspectRatio = '3:4';
  } else if (/16:9|16\s*:\s*9/i.test(clean)) {
    aspectRatio = '16:9';
  }

  const detectedFields = {
    maxSize: maxSizeKB !== undefined,
    dimensions: width !== undefined && height !== undefined,
    format: format !== undefined,
    aspectRatio: aspectRatio !== undefined,
  };

  const detectedCount = Object.values(detectedFields).filter(Boolean).length;
  if (detectedCount === 0) {
    return null;
  }

  // Construct brief natural language summary
  const summaryParts: string[] = [];
  if (maxSizeKB) {
    summaryParts.push(lang === 'ar' ? `الحد الأقصى ${maxSizeKB} ك.ب` : `Max size ${maxSizeKB} KB`);
  }
  if (width && height) {
    summaryParts.push(
      lang === 'ar' ? `الأبعاد ${width}×${height} بكسل` : `Dimensions ${width}×${height}px`
    );
  }
  if (format) {
    summaryParts.push(
      lang === 'ar'
        ? `الصيغة ${format.replace('image/', '').toUpperCase()}`
        : `Format ${format.replace('image/', '').toUpperCase()}`
    );
  }
  if (aspectRatio) {
    summaryParts.push(lang === 'ar' ? `النسبة ${aspectRatio}` : `Ratio ${aspectRatio}`);
  }

  return {
    rawText: text,
    maxSizeKB,
    width,
    height,
    format: format || 'image/jpeg',
    aspectRatio,
    detectedFields,
    summary: summaryParts.join(' • '),
  };
}
