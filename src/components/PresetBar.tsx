import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import {
  ToolType,
  ToolSettingsMap,
  WorkspacePreset,
} from '../types/workspace';
import {
  getSavedPresets,
  getDefaultPreset,
  createPreset,
  updatePreset,
  setDefaultPreset,
} from '../utils/workspaceStorage';
import {
  Bookmark,
  SlidersHorizontal,
  Plus,
  Check,
  Star,
  ExternalLink,
  Save,
  Sparkles,
  X,
  RotateCcw,
} from 'lucide-react';

interface PresetBarProps<T extends ToolType> {
  toolId: T;
  currentSettings: ToolSettingsMap[T];
  activePresetId?: string | null;
  onApplyPreset: (preset: WorkspacePreset<T>) => void;
  onResetToDefaults: () => void;
}

export function PresetBar<T extends ToolType>({
  toolId,
  currentSettings,
  activePresetId,
  onApplyPreset,
  onResetToDefaults,
}: PresetBarProps<T>) {
  const { lang, isRTL } = useLanguage();
  const isAr = lang === 'ar';

  const [presets, setPresets] = useState<WorkspacePreset<T>[]>([]);
  const [defaultPreset, setLocalDefaultPreset] = useState<WorkspacePreset<T> | null>(null);
  const [showSelectorModal, setShowSelectorModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [setAsDefaultOnSave, setSetAsDefaultOnSave] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Load presets and listen to workspace updates
  const refreshPresets = () => {
    const list = getSavedPresets(toolId);
    setPresets(list);
    const def = getDefaultPreset(toolId);
    setLocalDefaultPreset(def);
  };

  useEffect(() => {
    refreshPresets();

    const handleWorkspaceChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ toolId?: ToolType }>;
      if (!customEvent.detail?.toolId || customEvent.detail.toolId === toolId) {
        refreshPresets();
      }
    };

    window.addEventListener('formfit-workspace-change', handleWorkspaceChange);
    return () => {
      window.removeEventListener('formfit-workspace-change', handleWorkspaceChange);
    };
  }, [toolId]);

  const activePreset = presets.find((p) => p.id === activePresetId);

  // Check if current settings differ from active preset settings
  const isModifiedFromActive = () => {
    if (!activePreset) return false;
    try {
      const activeKeys = Object.keys(activePreset.settings) as Array<keyof ToolSettingsMap[T]>;
      return activeKeys.some((k) => activePreset.settings[k] !== currentSettings[k]);
    } catch {
      return false;
    }
  };

  const hasModifications = isModifiedFromActive();

  const handleSaveNewPreset = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPresetName.trim();
    if (!trimmed) return;

    try {
      const created = createPreset(
        toolId,
        trimmed,
        currentSettings,
        setAsDefaultOnSave
      );
      setNewPresetName('');
      setShowSaveModal(false);
      onApplyPreset(created);

      setSaveSuccessMsg(
        isAr ? `تم حفظ النموذج: "${trimmed}"` : `Saved profile: "${trimmed}"`
      );
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving preset');
    }
  };

  const handleUpdateCurrentPreset = () => {
    if (!activePreset || activePreset.isBuiltIn) return;
    try {
      const updated = updatePreset(toolId, activePreset.id, currentSettings);
      if (updated) {
        onApplyPreset(updated);
        setSaveSuccessMsg(
          isAr
            ? `تم تحديث النموذج: "${updated.name}"`
            : `Updated profile: "${updated.name}"`
        );
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      }
    } catch {
      // Ignore
    }
  };

  const handleSetDefault = (presetId: string) => {
    setDefaultPreset(toolId, presetId);
    setSaveSuccessMsg(
      isAr ? 'تم تعيين النموذج كافتراضي للأداة' : 'Set as default profile for this tool'
    );
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Helper summary of settings for a preset
  const formatPresetSummary = (preset: WorkspacePreset<T>): string => {
    const s = preset.settings as unknown as Record<string, unknown>;
    const parts: string[] = [];
    if (s.targetSizeKB) parts.push(`${s.targetSizeKB} KB`);
    if (s.width && s.height) parts.push(`${s.width}×${s.height} px`);
    if (s.targetWidth && s.targetHeight) parts.push(`${s.targetWidth}×${s.targetHeight} px`);
    if (s.format) parts.push(String(s.format).replace('image/', '').toUpperCase());
    return parts.join(' • ');
  };

  const userCustomPresets = presets.filter((p) => !p.isBuiltIn);
  const builtInPresets = presets.filter((p) => p.isBuiltIn);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:p-3.5 mb-4 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Active preset badge / state */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Bookmark className="h-4 w-4 text-blue-600" />
            <span>{isAr ? 'النموذج النشط:' : 'Active Profile:'}</span>
          </div>

          {activePreset ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 shadow-2xs">
              <span>{activePreset.name}</span>
              {defaultPreset?.id === activePreset.id && (
                <span className="flex items-center text-[10px] font-semibold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                  <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                  {isAr ? 'افتراضي' : 'Default'}
                </span>
              )}
              {hasModifications && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                  {isAr ? 'معدل' : 'Modified'}
                </span>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
              {isAr ? 'إعدادات مخصصة / آخر استخدام' : 'Custom / Last Used'}
            </span>
          )}

          {hasModifications && activePreset && !activePreset.isBuiltIn && (
            <button
              type="button"
              onClick={handleUpdateCurrentPreset}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white border border-blue-200 hover:bg-blue-50 px-2 py-0.5 rounded shadow-2xs transition-colors"
            >
              <Save className="h-3 w-3" />
              <span>{isAr ? 'حفظ التعديلات على النموذج' : 'Update Preset'}</span>
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Apply Saved Preset Button */}
          <button
            type="button"
            onClick={() => setShowSelectorModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" />
            <span>{isAr ? 'نماذج الإعدادات' : 'Saved Profiles'}</span>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
              {presets.length}
            </span>
          </button>

          {/* Save Current Settings Button */}
          <button
            type="button"
            onClick={() => {
              setNewPresetName('');
              setSetAsDefaultOnSave(false);
              setShowSaveModal(true);
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isAr ? 'حفظ كنموذج جديد' : 'Save As Preset'}</span>
          </button>

          {/* Manage in Workspace Link */}
          <Link
            to={`/workspace?tool=${toolId}`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 transition-colors shadow-2xs"
            title={isAr ? 'إدارة في مساحة العمل' : 'Manage in Workspace'}
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">{isAr ? 'المساحة' : 'Workspace'}</span>
          </Link>
        </div>
      </div>

      {/* Confirmation banner */}
      {saveSuccessMsg && (
        <div className="mt-2.5 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* MODAL 1: Choose & Apply Preset */}
      {showSelectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl animate-scaleIn max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {isAr ? 'اختيار وتطبيق نموذج إعدادات' : 'Select Tool Profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSelectorModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-5">
              {/* User Custom Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isAr ? 'نماذجك المحفوظة' : 'Your Custom Profiles'}
                  </span>
                  <span className="text-xs text-slate-400">({userCustomPresets.length})</span>
                </div>

                {userCustomPresets.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                    {isAr
                      ? 'لم تقم بحفظ أي نماذج مخصصة لهذه الأداة بعد. يمكنك حفظ إعداداتك الحالية بزر "حفظ كنموذج جديد".'
                      : 'You haven’t saved any custom profiles for this tool yet. Save your current settings with "Save As Preset".'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userCustomPresets.map((preset) => {
                      const isDefault = defaultPreset?.id === preset.id;
                      const isActive = activePresetId === preset.id;

                      return (
                        <div
                          key={preset.id}
                          className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                            isActive
                              ? 'border-blue-400 bg-blue-50/50 shadow-2xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {preset.name}
                              </span>
                              {isDefault && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                                  <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                                  {isAr ? 'افتراضي' : 'Default'}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[11px] text-slate-500 font-mono">
                              {formatPresetSummary(preset)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefault(preset.id)}
                                className="rounded-lg p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                title={isAr ? 'تعيين كافتراضي' : 'Set as default'}
                              >
                                <Star className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                onApplyPreset(preset);
                                setShowSelectorModal(false);
                              }}
                              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                isActive
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white'
                              }`}
                            >
                              {isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'تطبيق' : 'Apply')}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Built-in Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isAr ? 'نماذج فورم فيت الجاهزة' : 'FormFit Built-In Profiles'}
                  </span>
                  <span className="text-xs text-slate-400">({builtInPresets.length})</span>
                </div>

                <div className="space-y-2">
                  {builtInPresets.map((preset) => {
                    const isDefault = defaultPreset?.id === preset.id;
                    const isActive = activePresetId === preset.id;

                    return (
                      <div
                        key={preset.id}
                        className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                          isActive
                            ? 'border-blue-400 bg-blue-50/50 shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              {preset.name}
                            </span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600 uppercase">
                              {isAr ? 'جاهز' : 'Built-in'}
                            </span>
                            {isDefault && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                                <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                                {isAr ? 'افتراضي' : 'Default'}
                              </span>
                            )}
                          </div>
                          {preset.description && (
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {preset.description}
                            </p>
                          )}
                          <p className="mt-0.5 text-[10px] text-slate-400 font-mono">
                            {formatPresetSummary(preset)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {!isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(preset.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title={isAr ? 'تعيين كافتراضي' : 'Set as default'}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              onApplyPreset(preset);
                              setShowSelectorModal(false);
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                            {isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'تطبيق' : 'Apply')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  onResetToDefaults();
                  setShowSelectorModal(false);
                }}
                className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-red-600 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{isAr ? 'استعادة إعدادات الأداة الأولية' : 'Reset to App Defaults'}</span>
              </button>

              <Link
                to={`/workspace?tool=${toolId}`}
                onClick={() => setShowSelectorModal(false)}
                className="font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>{isAr ? 'فتح مساحة العمل الكاملة' : 'Open Workspace'}</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Save As New Preset */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {isAr ? 'حفظ الإعدادات كنموذج مخصص' : 'Save as Custom Profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPreset} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'اسم النموذج:' : 'Profile Name:'}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={
                    isAr
                      ? 'مثال: صورة التقديم على الوظيفة، صورة الجواز...'
                      : 'e.g. Job Application Photo, Passport Photo...'
                  }
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Setting summary to be saved */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs text-slate-600">
                <span className="font-semibold text-slate-700 block mb-0.5">
                  {isAr ? 'الإعدادات التي سيتم حفظها:' : 'Settings to be saved:'}
                </span>
                <span className="font-mono text-[11px] text-blue-700">
                  {Object.entries(currentSettings)
                    .map(([k, v]) => `${k}: ${v !== undefined ? v : 'auto'}`)
                    .join(' • ')}
                </span>
              </div>

              {/* Set as default checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsDefaultOnSave}
                  onChange={(e) => setSetAsDefaultOnSave(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  {isAr
                    ? 'تعيين هذا النموذج كافتراضي تلقائي لهذه الأداة'
                    : 'Set as the automatic default profile for this tool'}
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!newPresetName.trim()}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isAr ? 'حفظ النموذج' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
