import { SupportedMimeType, ResizeMode } from './index';

export type ToolType = 'compress' | 'resize' | 'convert' | 'signature' | 'batch';

export interface CompressSettings {
  targetSizeKB?: number;
  format: SupportedMimeType;
  quality: number;
  autoDownscale: boolean;
  preserveTransparency: boolean;
}

export interface ResizeSettings {
  width: number;
  height: number;
  lockAspectRatio: boolean;
  mode: ResizeMode;
  format: SupportedMimeType;
  quality: number;
  targetSizeKB?: number;
}

export interface ConvertSettings {
  format: SupportedMimeType;
  quality: number;
}

export interface SignatureSettings {
  targetWidth: number;
  targetHeight: number;
  format: SupportedMimeType;
  targetSizeKB?: number;
  enhanceContrast: boolean;
}

export interface BatchSettings {
  targetSizeKB: number;
  targetWidth?: number;
  targetHeight?: number;
  format: SupportedMimeType;
  autoDownscale: boolean;
}

export type ToolSettingsMap = {
  compress: CompressSettings;
  resize: ResizeSettings;
  convert: ConvertSettings;
  signature: SignatureSettings;
  batch: BatchSettings;
};

export interface WorkspacePreset<T extends ToolType = ToolType> {
  id: string;
  toolId: T;
  name: string;
  settings: ToolSettingsMap[T];
  isDefault?: boolean;
  isBuiltIn?: boolean;
  createdAt: number;
  updatedAt: number;
  description?: string;
}

export interface RecentlyUsedTool {
  toolId: ToolType;
  lastUsed: number;
}

export interface WorkspaceStorageSchema {
  version: number;
  lastUsedSettings: {
    compress: CompressSettings;
    resize: ResizeSettings;
    convert: ConvertSettings;
    signature: SignatureSettings;
    batch: BatchSettings;
  };
  defaultPresetIds: Partial<Record<ToolType, string>>;
  presets: WorkspacePreset[];
  recentlyUsed: RecentlyUsedTool[];
  lastUpdated: number;
}
