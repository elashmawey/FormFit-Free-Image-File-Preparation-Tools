const PREFERENCES_KEY = 'formfit_user_prefs';

export interface UserPreferences {
  lastFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
  lastTargetKB?: number;
  autoDownscale?: boolean;
  recentPresets: Array<{
    label: string;
    targetKb?: number;
    format?: string;
    width?: number;
    height?: number;
  }>;
}

export function getUserPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // LocalStorage unavailable
  }

  return {
    recentPresets: [],
  };
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  try {
    const current = getUserPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function addRecentPreset(preset: {
  targetKb?: number;
  format?: string;
  width?: number;
  height?: number;
}): void {
  try {
    const current = getUserPreferences();
    const label = preset.targetKb
      ? `${preset.targetKb} KB ${preset.format?.toUpperCase() || ''}`.trim()
      : preset.width && preset.height
      ? `${preset.width}×${preset.height} px`
      : 'Custom';

    // Keep unique list of max 4 recent presets
    const filtered = current.recentPresets.filter(
      (p) =>
        !(
          p.targetKb === preset.targetKb &&
          p.format === preset.format &&
          p.width === preset.width &&
          p.height === preset.height
        )
    );

    const updatedPresets = [{ label, ...preset }, ...filtered].slice(0, 4);
    saveUserPreferences({ recentPresets: updatedPresets });
  } catch {
    // Ignore
  }
}

export function resetAllUserPreferences(): void {
  try {
    localStorage.removeItem(PREFERENCES_KEY);
  } catch {
    // Ignore
  }
}
