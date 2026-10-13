import {
  ToolType,
  ToolSettingsMap,
  CompressSettings,
  ResizeSettings,
  ConvertSettings,
  SignatureSettings,
  BatchSettings,
  WorkspacePreset,
  WorkspaceStorageSchema,
} from '../types/workspace';

const WORKSPACE_STORAGE_KEY = 'formfit_workspace_v1';
const CURRENT_SCHEMA_VERSION = 1;

// Built-in Application Default Settings
export const INITIAL_APPLICATION_DEFAULTS: {
  compress: CompressSettings;
  resize: ResizeSettings;
  convert: ConvertSettings;
  signature: SignatureSettings;
  batch: BatchSettings;
} = {
  compress: {
    targetSizeKB: 100,
    format: 'image/jpeg',
    quality: 0.82,
    autoDownscale: true,
    preserveTransparency: true,
  },
  resize: {
    width: 800,
    height: 600,
    lockAspectRatio: true,
    mode: 'preserve',
    format: 'image/jpeg',
    quality: 0.88,
    targetSizeKB: undefined,
  },
  convert: {
    format: 'image/webp',
    quality: 0.92,
  },
  signature: {
    targetWidth: 400,
    targetHeight: 150,
    format: 'image/jpeg',
    targetSizeKB: 50,
    enhanceContrast: true,
  },
  batch: {
    targetSizeKB: 100,
    targetWidth: undefined,
    targetHeight: undefined,
    format: 'image/jpeg',
    autoDownscale: true,
  },
};

// Built-in FormFit Presets (Read-only originals, clearly labeled)
export const BUILT_IN_PRESETS: WorkspacePreset[] = [
  // Compression Presets
  {
    id: 'builtin-compress-balanced',
    toolId: 'compress',
    name: 'Balanced Web Photo (100 KB)',
    description: 'Optimal for general websites, profiles, and fast loading.',
    settings: {
      targetSizeKB: 100,
      format: 'image/jpeg',
      quality: 0.82,
      autoDownscale: true,
      preserveTransparency: true,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'builtin-compress-strict-portal',
    toolId: 'compress',
    name: 'Strict Document Portal (50 KB)',
    description: 'Designed for strict university, visa, and civil service portals.',
    settings: {
      targetSizeKB: 50,
      format: 'image/jpeg',
      quality: 0.75,
      autoDownscale: true,
      preserveTransparency: true,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'builtin-compress-ultra-small',
    toolId: 'compress',
    name: 'Ultra-Small Avatar (20 KB)',
    description: 'Extreme size compression for legacy badges and strict forms.',
    settings: {
      targetSizeKB: 20,
      format: 'image/jpeg',
      quality: 0.7,
      autoDownscale: true,
      preserveTransparency: true,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'builtin-compress-webp-hq',
    toolId: 'compress',
    name: 'High-Quality WebP (150 KB)',
    description: 'Modern lightweight next-gen web optimization.',
    settings: {
      targetSizeKB: 150,
      format: 'image/webp',
      quality: 0.88,
      autoDownscale: true,
      preserveTransparency: true,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },

  // Resizing Presets
  {
    id: 'builtin-resize-id-photo',
    toolId: 'resize',
    name: 'Job Application / ID Photo (600×600 px)',
    description: 'Square cropped portrait for official applications.',
    settings: {
      width: 600,
      height: 600,
      lockAspectRatio: true,
      mode: 'crop',
      format: 'image/jpeg',
      quality: 0.9,
      targetSizeKB: 240,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'builtin-resize-standard-doc',
    toolId: 'resize',
    name: 'Standard Document (800×600 px)',
    description: 'Proportional resize for document attachments and scan receipts.',
    settings: {
      width: 800,
      height: 600,
      lockAspectRatio: true,
      mode: 'preserve',
      format: 'image/jpeg',
      quality: 0.88,
      targetSizeKB: undefined,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'builtin-resize-fhd',
    toolId: 'resize',
    name: 'Full HD Landscape (1920×1080 px)',
    description: 'Standard 16:9 widescreen presentation or display resolution.',
    settings: {
      width: 1920,
      height: 1080,
      lockAspectRatio: true,
      mode: 'preserve',
      format: 'image/jpeg',
      quality: 0.88,
      targetSizeKB: undefined,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },

  // Format Conversion Presets
  {
    id: 'builtin-convert-modern-webp',
    toolId: 'convert',
    name: 'Modern WebP Format',
    description: 'High compression efficiency with full browser support.',
    settings: {
      format: 'image/webp',
      quality: 0.92,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'builtin-convert-universal-jpg',
    toolId: 'convert',
    name: 'Universal JPG Format',
    description: 'Standard compatibility for any online submission portal.',
    settings: {
      format: 'image/jpeg',
      quality: 0.92,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'builtin-convert-lossless-png',
    toolId: 'convert',
    name: 'Crisp PNG Format',
    description: 'Lossless graphics and transparent backgrounds.',
    settings: {
      format: 'image/png',
      quality: 1.0,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },

  // Signature Presets
  {
    id: 'builtin-signature-official-form',
    toolId: 'signature',
    name: 'Official Form Signature (400×150 px)',
    description: 'Standard dimensions for electronic signatures with enhanced contrast.',
    settings: {
      targetWidth: 400,
      targetHeight: 150,
      format: 'image/jpeg',
      targetSizeKB: 50,
      enhanceContrast: true,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'builtin-signature-compact',
    toolId: 'signature',
    name: 'Compact Signature (300×100 px, 30 KB)',
    description: 'Ultra-light signature for strict government portals.',
    settings: {
      targetWidth: 300,
      targetHeight: 100,
      format: 'image/jpeg',
      targetSizeKB: 30,
      enhanceContrast: true,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },

  // Batch Presets
  {
    id: 'builtin-batch-web',
    toolId: 'batch',
    name: 'Standard Batch Compression (100 KB)',
    description: 'Apply 100 KB limit across all selected images with automatic downscale.',
    settings: {
      targetSizeKB: 100,
      targetWidth: undefined,
      targetHeight: undefined,
      format: 'image/jpeg',
      autoDownscale: true,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'builtin-batch-id-photos',
    toolId: 'batch',
    name: 'Batch ID Photos (600×600 px, 50 KB)',
    description: 'Uniform dimensions and strict file size for photo batches.',
    settings: {
      targetSizeKB: 50,
      targetWidth: 600,
      targetHeight: 600,
      format: 'image/jpeg',
      autoDownscale: true,
    },
    isBuiltIn: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
];

// In-Memory Fallback State if localStorage is blocked/unavailable
let inMemoryWorkspace: WorkspaceStorageSchema = createDefaultWorkspaceSchema();

function createDefaultWorkspaceSchema(): WorkspaceStorageSchema {
  return {
    version: CURRENT_SCHEMA_VERSION,
    lastUsedSettings: {
      compress: { ...INITIAL_APPLICATION_DEFAULTS.compress },
      resize: { ...INITIAL_APPLICATION_DEFAULTS.resize },
      convert: { ...INITIAL_APPLICATION_DEFAULTS.convert },
      signature: { ...INITIAL_APPLICATION_DEFAULTS.signature },
      batch: { ...INITIAL_APPLICATION_DEFAULTS.batch },
    },
    defaultPresetIds: {
      compress: 'builtin-compress-balanced',
      resize: 'builtin-resize-id-photo',
      convert: 'builtin-convert-modern-webp',
      signature: 'builtin-signature-official-form',
      batch: 'builtin-batch-web',
    },
    presets: [...BUILT_IN_PRESETS],
    recentlyUsed: [
      { toolId: 'compress', lastUsed: Date.now() },
    ],
    lastUpdated: Date.now(),
  };
}

// Check localStorage availability safely
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__formfit_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Broadcast workspace changes to active components
function notifyWorkspaceChange(toolId?: ToolType): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('formfit-workspace-change', { detail: { toolId } })
    );
  }
}

// Load workspace from localStorage or in-memory
export function getWorkspaceData(): WorkspaceStorageSchema {
  if (!isLocalStorageAvailable()) {
    return inMemoryWorkspace;
  }

  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) {
      const initial = createDefaultWorkspaceSchema();
      saveWorkspaceData(initial);
      return initial;
    }

    const parsed = JSON.parse(raw) as WorkspaceStorageSchema;

    // Schema validation and migration safety
    if (!parsed || typeof parsed !== 'object' || !parsed.version) {
      const fresh = createDefaultWorkspaceSchema();
      saveWorkspaceData(fresh);
      return fresh;
    }

    // Ensure all tools have lastUsedSettings defined
    parsed.lastUsedSettings = {
      compress: { ...INITIAL_APPLICATION_DEFAULTS.compress, ...parsed.lastUsedSettings?.compress },
      resize: { ...INITIAL_APPLICATION_DEFAULTS.resize, ...parsed.lastUsedSettings?.resize },
      convert: { ...INITIAL_APPLICATION_DEFAULTS.convert, ...parsed.lastUsedSettings?.convert },
      signature: { ...INITIAL_APPLICATION_DEFAULTS.signature, ...parsed.lastUsedSettings?.signature },
      batch: { ...INITIAL_APPLICATION_DEFAULTS.batch, ...parsed.lastUsedSettings?.batch },
    };

    // Ensure built-in presets are always present and up-to-date
    const userCustomPresets = (parsed.presets || []).filter((p) => !p.isBuiltIn);
    parsed.presets = [...BUILT_IN_PRESETS, ...userCustomPresets];

    if (!parsed.defaultPresetIds) {
      parsed.defaultPresetIds = { ...createDefaultWorkspaceSchema().defaultPresetIds };
    }

    if (!Array.isArray(parsed.recentlyUsed)) {
      parsed.recentlyUsed = [];
    }

    return parsed;
  } catch {
    return inMemoryWorkspace;
  }
}

// Save workspace to localStorage or in-memory
export function saveWorkspaceData(data: WorkspaceStorageSchema): void {
  data.lastUpdated = Date.now();
  inMemoryWorkspace = data;

  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // QuotaExceeded or Private Browsing limitation
    }
  }
}

// Get Last-Used Settings for a tool
export function getLastUsedSettings<T extends ToolType>(toolId: T): ToolSettingsMap[T] {
  const data = getWorkspaceData();
  return (data.lastUsedSettings[toolId] || INITIAL_APPLICATION_DEFAULTS[toolId]) as ToolSettingsMap[T];
}

// Save Last-Used Settings for a tool
export function saveLastUsedSettings<T extends ToolType>(
  toolId: T,
  settings: Partial<ToolSettingsMap[T]>
): void {
  const data = getWorkspaceData();
  const current = (data.lastUsedSettings[toolId] || INITIAL_APPLICATION_DEFAULTS[toolId]) as unknown as Record<string, unknown>;

  data.lastUsedSettings[toolId] = {
    ...current,
    ...settings,
  } as unknown as ToolSettingsMap[T];

  // Update recently used tool timestamp
  recordToolOpened(toolId);

  saveWorkspaceData(data);
  notifyWorkspaceChange(toolId);
}

// Record Tool Opened
export function recordToolOpened(toolId: ToolType): void {
  const data = getWorkspaceData();
  const filtered = (data.recentlyUsed || []).filter((r) => r.toolId !== toolId);
  data.recentlyUsed = [{ toolId, lastUsed: Date.now() }, ...filtered].slice(0, 5);
  saveWorkspaceData(data);
}

// Get all presets (optionally filtered by tool)
export function getSavedPresets<T extends ToolType = ToolType>(toolId?: T): WorkspacePreset<T>[] {
  const data = getWorkspaceData();
  const presets = data.presets || [];
  if (!toolId) {
    return presets as WorkspacePreset<T>[];
  }
  return presets.filter((p) => p.toolId === toolId) as WorkspacePreset<T>[];
}

// Get Default Preset for a tool
export function getDefaultPreset<T extends ToolType>(toolId: T): WorkspacePreset<T> | null {
  const data = getWorkspaceData();
  const defaultId = data.defaultPresetIds?.[toolId];
  if (defaultId) {
    const found = data.presets.find((p) => p.id === defaultId && p.toolId === toolId);
    if (found) return found as WorkspacePreset<T>;
  }
  // Fallback to first preset of this tool
  const toolPresets = getSavedPresets(toolId);
  return toolPresets[0] || null;
}

// Set a Preset as Default for its tool
export function setDefaultPreset(toolId: ToolType, presetId: string): boolean {
  const data = getWorkspaceData();
  const preset = data.presets.find((p) => p.id === presetId && p.toolId === toolId);
  if (!preset) return false;

  data.defaultPresetIds = {
    ...data.defaultPresetIds,
    [toolId]: presetId,
  };

  saveWorkspaceData(data);
  notifyWorkspaceChange(toolId);
  return true;
}

// Create a new user-defined preset
export function createPreset<T extends ToolType>(
  toolId: T,
  name: string,
  settings: ToolSettingsMap[T],
  isDefault = false
): WorkspacePreset<T> {
  const cleanName = name.trim();
  if (!cleanName) {
    throw new Error('Preset name cannot be empty');
  }

  const data = getWorkspaceData();
  const now = Date.now();
  const newId = `custom-${toolId}-${now}-${Math.random().toString(36).substring(2, 6)}`;

  const newPreset: WorkspacePreset<T> = {
    id: newId,
    toolId,
    name: cleanName,
    settings: { ...settings },
    isBuiltIn: false,
    createdAt: now,
    updatedAt: now,
  };

  data.presets.push(newPreset as WorkspacePreset);

  if (isDefault) {
    data.defaultPresetIds[toolId] = newId;
  }

  saveWorkspaceData(data);
  notifyWorkspaceChange(toolId);
  return newPreset;
}

// Update existing preset settings (custom presets only)
export function updatePreset<T extends ToolType>(
  toolId: T,
  presetId: string,
  settings: ToolSettingsMap[T]
): WorkspacePreset<T> | null {
  const data = getWorkspaceData();
  const index = data.presets.findIndex((p) => p.id === presetId && p.toolId === toolId);
  if (index === -1) return null;

  const target = data.presets[index];
  if (target.isBuiltIn) {
    throw new Error('Built-in presets cannot be overwritten. Duplicate as a custom preset instead.');
  }

  const updated: WorkspacePreset<T> = {
    ...target,
    settings: { ...settings },
    updatedAt: Date.now(),
  } as WorkspacePreset<T>;

  data.presets[index] = updated as WorkspacePreset;
  saveWorkspaceData(data);
  notifyWorkspaceChange(toolId);
  return updated;
}

// Rename a custom preset
export function renamePreset(toolId: ToolType, presetId: string, newName: string): boolean {
  const clean = newName.trim();
  if (!clean) return false;

  const data = getWorkspaceData();
  const index = data.presets.findIndex((p) => p.id === presetId && p.toolId === toolId);
  if (index === -1) return false;

  const target = data.presets[index];
  if (target.isBuiltIn) return false;

  target.name = clean;
  target.updatedAt = Date.now();

  saveWorkspaceData(data);
  notifyWorkspaceChange(toolId);
  return true;
}

// Duplicate a preset (works for both built-in and custom presets)
export function duplicatePreset(
  toolId: ToolType,
  presetId: string,
  newName?: string
): WorkspacePreset | null {
  const data = getWorkspaceData();
  const original = data.presets.find((p) => p.id === presetId && p.toolId === toolId);
  if (!original) return null;

  const now = Date.now();
  const copyName = newName?.trim() || `${original.name} (Copy)`;
  const newId = `custom-${toolId}-${now}-${Math.random().toString(36).substring(2, 6)}`;

  const duplicated: WorkspacePreset = {
    ...original,
    id: newId,
    name: copyName,
    isBuiltIn: false,
    createdAt: now,
    updatedAt: now,
  };

  data.presets.push(duplicated);
  saveWorkspaceData(data);
  notifyWorkspaceChange(toolId);
  return duplicated;
}

// Delete a custom preset
export function deletePreset(toolId: ToolType, presetId: string): boolean {
  const data = getWorkspaceData();
  const target = data.presets.find((p) => p.id === presetId && p.toolId === toolId);
  if (!target || target.isBuiltIn) return false;

  data.presets = data.presets.filter((p) => p.id !== presetId);

  // If the deleted preset was default, reset default to a built-in preset
  if (data.defaultPresetIds?.[toolId] === presetId) {
    const fallback = data.presets.find((p) => p.toolId === toolId);
    if (fallback) {
      data.defaultPresetIds[toolId] = fallback.id;
    } else {
      delete data.defaultPresetIds[toolId];
    }
  }

  saveWorkspaceData(data);
  notifyWorkspaceChange(toolId);
  return true;
}

// Reset tool settings to factory defaults
export function resetToolSettings(toolId: ToolType): void {
  const data = getWorkspaceData();
  data.lastUsedSettings[toolId] = { ...INITIAL_APPLICATION_DEFAULTS[toolId] } as any;

  // Restore default preset ID to factory built-in
  const factoryDefault = BUILT_IN_PRESETS.find((p) => p.toolId === toolId);
  if (factoryDefault) {
    data.defaultPresetIds[toolId] = factoryDefault.id;
  }

  saveWorkspaceData(data);
  notifyWorkspaceChange(toolId);
}

// Clear all custom workspace settings and return to factory state
export function clearAllWorkspaceSettings(): void {
  const factory = createDefaultWorkspaceSchema();
  saveWorkspaceData(factory);
  notifyWorkspaceChange();
}

// Export workspace configuration as a clean JSON string
export function exportWorkspaceData(): string {
  const data = getWorkspaceData();
  const exportPayload = {
    app: 'FormFit',
    version: CURRENT_SCHEMA_VERSION,
    exportDate: new Date().toISOString(),
    lastUsedSettings: data.lastUsedSettings,
    defaultPresetIds: data.defaultPresetIds,
    customPresets: (data.presets || []).filter((p) => !p.isBuiltIn),
  };
  return JSON.stringify(exportPayload, null, 2);
}

// Import workspace configuration from JSON string with validation & conflict options
export function importWorkspaceData(
  jsonString: string,
  strategy: 'replace' | 'merge_rename' = 'merge_rename'
): { success: boolean; importedCount: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, importedCount: 0, error: 'Invalid JSON format' };
    }

    if (parsed.app !== 'FormFit' && !parsed.lastUsedSettings && !parsed.customPresets) {
      return { success: false, importedCount: 0, error: 'File does not contain valid FormFit workspace settings.' };
    }

    const current = getWorkspaceData();
    let importedPresets: WorkspacePreset[] = [];

    if (Array.isArray(parsed.customPresets)) {
      for (const item of parsed.customPresets) {
        if (!item.name || !item.toolId || !item.settings) continue;
        if (!['compress', 'resize', 'convert', 'signature', 'batch'].includes(item.toolId)) continue;

        let presetName = String(item.name).trim();
        if (strategy === 'merge_rename') {
          const exists = current.presets.some(
            (p) => p.toolId === item.toolId && p.name.toLowerCase() === presetName.toLowerCase()
          );
          if (exists) {
            presetName = `${presetName} (Imported)`;
          }
        }

        importedPresets.push({
          id: `imported-${item.toolId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          toolId: item.toolId,
          name: presetName,
          settings: item.settings,
          isBuiltIn: false,
          createdAt: item.createdAt || Date.now(),
          updatedAt: Date.now(),
          description: item.description,
        });
      }
    }

    if (strategy === 'replace') {
      current.presets = [...BUILT_IN_PRESETS, ...importedPresets];
      if (parsed.lastUsedSettings) {
        current.lastUsedSettings = {
          ...INITIAL_APPLICATION_DEFAULTS,
          ...parsed.lastUsedSettings,
        };
      }
    } else {
      // Merge
      current.presets = [...current.presets, ...importedPresets];
      if (parsed.lastUsedSettings) {
        current.lastUsedSettings = {
          ...current.lastUsedSettings,
          ...parsed.lastUsedSettings,
        };
      }
    }

    saveWorkspaceData(current);
    notifyWorkspaceChange();
    return { success: true, importedCount: importedPresets.length };
  } catch (err) {
    return {
      success: false,
      importedCount: 0,
      error: err instanceof Error ? err.message : 'Failed to parse JSON file.',
    };
  }
}
