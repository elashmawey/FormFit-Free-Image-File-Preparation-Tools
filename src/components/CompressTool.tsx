import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ImageFile, ProcessedResult, SupportedMimeType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { DropZone } from './DropZone';
import { ImageComparison } from './ImageComparison';
import {
  loadImageFromFile,
  compressImage,
  revokeObjectUrl,
} from '../utils/imageProcessor';
import {
  getUserPreferences,
  saveUserPreferences,
  addRecentPreset,
  resetAllUserPreferences,
} from '../utils/preferences';
import { trackEvent } from '../utils/analytics';
import { PresetBar } from './PresetBar';
import {
  getLastUsedSettings,
  saveLastUsedSettings,
  getDefaultPreset,
  getSavedPresets,
  INITIAL_APPLICATION_DEFAULTS,
} from '../utils/workspaceStorage';
import { CompressSettings, WorkspacePreset } from '../types/workspace';
import {
  Sliders,
  AlertCircle,
  Sparkles,
  Info,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface CompressToolProps {
  initialTargetKB?: number;
  standalone?: boolean;
  appliedPreset?: {
    targetSizeKB?: number;
    width?: number;
    height?: number;
    format: SupportedMimeType;
  } | null;
}

export const CompressTool: React.FC<CompressToolProps> = ({
  initialTargetKB,
  appliedPreset,
}) => {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';
  const [searchParams] = useSearchParams();

  // Priority for initialization: 1. query preset 2. default preset 3. last used settings
  const presetQueryId = searchParams.get('preset');
  const matchedQueryPreset = presetQueryId
    ? getSavedPresets('compress').find((p) => p.id === presetQueryId)
    : null;
  const toolDefaultPreset = getDefaultPreset('compress');
  const toolLastUsed = getLastUsedSettings('compress');

  const baseSettings: CompressSettings = matchedQueryPreset
    ? matchedQueryPreset.settings
    : toolDefaultPreset?.settings || toolLastUsed || INITIAL_APPLICATION_DEFAULTS.compress;

  const [activePresetId, setActivePresetId] = useState<string | null>(
    matchedQueryPreset?.id || toolDefaultPreset?.id || null
  );

  const getInitialTargetFromURL = (): number | undefined => {
    const qTarget = searchParams.get('targetKb');
    if (qTarget && !isNaN(Number(qTarget)) && Number(qTarget) > 0) {
      return Number(qTarget);
    }
    if (initialTargetKB !== undefined) return initialTargetKB;
    return baseSettings.targetSizeKB;
  };

  const getInitialFormatFromURL = (): SupportedMimeType => {
    const qFormat = searchParams.get('format')?.toLowerCase();
    if (qFormat === 'webp') return 'image/webp';
    if (qFormat === 'png') return 'image/png';
    if (qFormat === 'jpg' || qFormat === 'jpeg') return 'image/jpeg';
    return baseSettings.format || 'image/jpeg';
  };

  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [targetSizeKB, setTargetSizeKB] = useState<number | undefined>(getInitialTargetFromURL());
  const [customKBInput, setCustomKBInput] = useState<string>(
    getInitialTargetFromURL() ? String(getInitialTargetFromURL()) : ''
  );
  const [quality, setQuality] = useState<number>(baseSettings.quality ?? 0.82);
  const [format, setFormat] = useState<SupportedMimeType>(getInitialFormatFromURL());
  const [autoDownscale, setAutoDownscale] = useState<boolean>(
    searchParams.get('downscale') === '0' || searchParams.get('downscale') === 'false'
      ? false
      : (baseSettings.autoDownscale ?? true)
  );
  const [preserveTransparency, setPreserveTransparency] = useState<boolean>(
    baseSettings.preserveTransparency ?? true
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedResult, setProcessedResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentPresets, setRecentPresets] = useState(getUserPreferences().recentPresets);

  // Current settings object for PresetBar
  const currentCompressSettings: CompressSettings = {
    targetSizeKB,
    quality,
    format,
    autoDownscale,
    preserveTransparency,
  };

  // Automatically remember settings in workspace localStorage
  useEffect(() => {
    saveLastUsedSettings('compress', {
      targetSizeKB,
      quality,
      format,
      autoDownscale,
      preserveTransparency,
    });
  }, [targetSizeKB, quality, format, autoDownscale, preserveTransparency]);

  // Sync if initialTargetKB changes from route props
  useEffect(() => {
    if (initialTargetKB !== undefined) {
      setTargetSizeKB(initialTargetKB);
      setCustomKBInput(String(initialTargetKB));
    }
  }, [initialTargetKB]);

  // Sync if appliedPreset comes from Smart Requirements Parser
  useEffect(() => {
    if (appliedPreset) {
      if (appliedPreset.targetSizeKB !== undefined) {
        setTargetSizeKB(appliedPreset.targetSizeKB);
        setCustomKBInput(String(appliedPreset.targetSizeKB));
      }
      if (appliedPreset.format) {
        setFormat(appliedPreset.format);
      }
    }
  }, [appliedPreset]);

  // Apply a workspace preset
  const handleApplyWorkspacePreset = (preset: WorkspacePreset<'compress'>) => {
    setActivePresetId(preset.id);
    const s = preset.settings;
    setTargetSizeKB(s.targetSizeKB);
    setCustomKBInput(s.targetSizeKB ? String(s.targetSizeKB) : '');
    setFormat(s.format);
    setQuality(s.quality);
    setAutoDownscale(s.autoDownscale);
    setPreserveTransparency(s.preserveTransparency);
    saveLastUsedSettings('compress', s);

    if (imageFile) {
      runRecompressionWithSettings(imageFile, s);
    }
  };

  // Reset to original application defaults
  const handleResetToDefaults = () => {
    setActivePresetId(null);
    const def = INITIAL_APPLICATION_DEFAULTS.compress;
    setTargetSizeKB(def.targetSizeKB);
    setCustomKBInput(def.targetSizeKB ? String(def.targetSizeKB) : '');
    setFormat(def.format);
    setQuality(def.quality);
    setAutoDownscale(def.autoDownscale);
    setPreserveTransparency(def.preserveTransparency);
    saveLastUsedSettings('compress', def);

    if (imageFile) {
      runRecompressionWithSettings(imageFile, def);
    }
  };

  const runRecompressionWithSettings = async (
    targetImage: ImageFile,
    overrideSettings: CompressSettings
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (processedResult) revokeObjectUrl(processedResult.objectUrl);
      const res = await compressImage(targetImage, overrideSettings);
      setProcessedResult(res);
      if (overrideSettings.targetSizeKB) {
        addRecentPreset({ targetKb: overrideSettings.targetSizeKB, format: overrideSettings.format });
        setRecentPresets(getUserPreferences().recentPresets);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Listen for global "formfit-start-new" event from Header
  useEffect(() => {
    const handleStartNew = () => {
      handleReset();
    };

    window.addEventListener('formfit-start-new', handleStartNew);
    return () => {
      window.removeEventListener('formfit-start-new', handleStartNew);
    };
  }, [imageFile, processedResult]);

  const handleFileSelected = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    trackEvent('processing_started', { tool: 'compress' });

    try {
      if (imageFile) {
        revokeObjectUrl(imageFile.objectUrl);
      }
      if (processedResult) {
        revokeObjectUrl(processedResult.objectUrl);
        setProcessedResult(null);
      }

      const loaded = await loadImageFromFile(file);
      setImageFile(loaded);

      // Default format heuristic if not overridden
      const chosenFormat: SupportedMimeType = format
        ? format
        : loaded.type === 'image/png' && loaded.hasTransparency
        ? 'image/png'
        : loaded.type === 'image/webp'
        ? 'image/webp'
        : 'image/jpeg';
      setFormat(chosenFormat);

      // Automatically run first pass compression with chosen settings
      const result = await compressImage(loaded, {
        targetSizeKB,
        quality,
        format: chosenFormat,
        autoDownscale,
        preserveTransparency,
      });
      setProcessedResult(result);

      // Save to recent presets and track analytics
      if (targetSizeKB) {
        addRecentPreset({ targetKb: targetSizeKB, format: chosenFormat });
        setRecentPresets(getUserPreferences().recentPresets);
      }
      trackEvent('processing_succeeded', {
        tool: 'compress',
        reduction: result.reductionPercentage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing image.');
      trackEvent('processing_failed', { tool: 'compress' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunCompression = async () => {
    if (!imageFile) return;
    setError(null);
    setIsProcessing(true);
    trackEvent('processing_started', { tool: 'compress' });

    try {
      if (processedResult) {
        revokeObjectUrl(processedResult.objectUrl);
      }

      const parsedTarget =
        customKBInput.trim() !== '' && !isNaN(Number(customKBInput))
          ? Number(customKBInput)
          : undefined;

      const result = await compressImage(imageFile, {
        targetSizeKB: parsedTarget,
        quality,
        format,
        autoDownscale,
        preserveTransparency,
      });
      setProcessedResult(result);

      if (parsedTarget) {
        addRecentPreset({ targetKb: parsedTarget, format });
        setRecentPresets(getUserPreferences().recentPresets);
      }
      trackEvent('processing_succeeded', {
        tool: 'compress',
        reduction: result.reductionPercentage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed.');
      trackEvent('processing_failed', { tool: 'compress' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePresetClick = (kb?: number) => {
    setTargetSizeKB(kb);
    setCustomKBInput(kb ? String(kb) : '');
  };

  const handleReset = () => {
    if (imageFile) revokeObjectUrl(imageFile.objectUrl);
    if (processedResult) revokeObjectUrl(processedResult.objectUrl);
    setImageFile(null);
    setProcessedResult(null);
    setError(null);
  };

  const handleClearPreferences = () => {
    resetAllUserPreferences();
    setRecentPresets([]);
  };

  const presets = [
    { label: '20 KB', value: 20 },
    { label: '50 KB', value: 50 },
    { label: '100 KB', value: 100 },
    { label: '200 KB', value: 200 },
    { label: t.presetCustom, value: undefined },
  ];

  return (
    <div className="w-full">
      {!imageFile ? (
        <div className="space-y-6">
          <PresetBar
            toolId="compress"
            currentSettings={currentCompressSettings}
            activePresetId={activePresetId}
            onApplyPreset={handleApplyWorkspacePreset}
            onResetToDefaults={handleResetToDefaults}
          />
          <DropZone onFileSelected={handleFileSelected} isLoading={isProcessing} />

          {/* Preset Buttons preview before uploading */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.presetsLabel}
              </span>
              <span className="text-[11px] text-slate-500">{t.noTargetNote}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => {
                const isSelected = targetSizeKB === preset.value;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetClick(preset.value)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Retention: Recent Presets (Feature 6) */}
            {recentPresets.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>{isAr ? 'الإعدادات المستخدمة مؤخراً:' : 'Recent settings:'}</span>
                  {recentPresets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (p.targetKb) handlePresetClick(p.targetKb);
                        if (p.format) setFormat(p.format as SupportedMimeType);
                      }}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleClearPreferences}
                  className="text-[10px] text-slate-400 hover:text-red-500 underline"
                >
                  {isAr ? 'مسح التفضيلات' : 'Reset preferences'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <PresetBar
            toolId="compress"
            currentSettings={currentCompressSettings}
            activePresetId={activePresetId}
            onApplyPreset={handleApplyWorkspacePreset}
            onResetToDefaults={handleResetToDefaults}
          />
          {/* Controls Bar & Configuration Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {t.toolCompressTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
              >
                {t.btnReset}
              </button>
            </div>

            {/* Target Size Presets */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.presetsLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => {
                  const isSelected = targetSizeKB === preset.value;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePresetClick(preset.value)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom KB Input & Output Format */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.targetSizeLabel}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    placeholder="e.g. 50"
                    value={customKBInput}
                    onChange={(e) => {
                      setCustomKBInput(e.target.value);
                      const num = Number(e.target.value);
                      setTargetSizeKB(!isNaN(num) && num > 0 ? num : undefined);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400">
                    KB
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.outputFormatLabel}
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as SupportedMimeType)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="image/jpeg">{t.formatJpegDesc}</option>
                  <option value="image/webp">{t.formatWebpDesc}</option>
                  <option value="image/png">{t.formatPngDesc}</option>
                </select>
              </div>

              {/* Quality slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">{t.qualityLabel}</label>
                  <span className="text-xs font-bold text-blue-600">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.02"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={Boolean(targetSizeKB && targetSizeKB > 0 && format !== 'image/png')}
                  className="w-full accent-blue-600 disabled:opacity-40"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {targetSizeKB ? t.optimizedForTargetNote : t.qualityHint}
                </span>
              </div>
            </div>

            {/* Auto-downscale and Transparency Toggles */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDownscale}
                  onChange={(e) => setAutoDownscale(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    {t.autoDownscaleLabel}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {t.autoDownscaleHelp}
                  </p>
                </div>
              </label>

              {imageFile.hasTransparency && format === 'image/jpeg' && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200">
                  <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <p>{t.jpegTransparencyWarning}</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-5 flex items-center justify-end">
              <button
                type="button"
                onClick={handleRunCompression}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{t.btnProcessing}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{t.btnProcessImage}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Results Comparison */}
          {processedResult && (
            <ImageComparison
              original={imageFile}
              processed={processedResult}
              onReset={handleReset}
            />
          )}
        </div>
      )}
    </div>
  );
};
