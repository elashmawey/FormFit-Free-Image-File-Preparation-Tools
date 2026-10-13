import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ImageFile, ProcessedResult, ResizeMode, SupportedMimeType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { DropZone } from './DropZone';
import { ImageComparison } from './ImageComparison';
import { PresetBar } from './PresetBar';
import {
  loadImageFromFile,
  resizeImage,
  revokeObjectUrl,
} from '../utils/imageProcessor';
import {
  getLastUsedSettings,
  saveLastUsedSettings,
  getDefaultPreset,
  getSavedPresets,
  INITIAL_APPLICATION_DEFAULTS,
} from '../utils/workspaceStorage';
import { ResizeSettings, WorkspacePreset } from '../types/workspace';
import {
  Scaling,
  Lock,
  Unlock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const ResizeTool: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  // Workspace initialization
  const presetQueryId = searchParams.get('preset');
  const matchedQueryPreset = presetQueryId
    ? getSavedPresets('resize').find((p) => p.id === presetQueryId)
    : null;
  const toolDefaultPreset = getDefaultPreset('resize');
  const toolLastUsed = getLastUsedSettings('resize');

  const baseSettings: ResizeSettings = matchedQueryPreset
    ? matchedQueryPreset.settings
    : toolDefaultPreset?.settings || toolLastUsed || INITIAL_APPLICATION_DEFAULTS.resize;

  const [activePresetId, setActivePresetId] = useState<string | null>(
    matchedQueryPreset?.id || toolDefaultPreset?.id || null
  );

  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [width, setWidth] = useState<number>(baseSettings.width || 800);
  const [height, setHeight] = useState<number>(baseSettings.height || 600);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(baseSettings.lockAspectRatio ?? true);
  const [aspectRatio, setAspectRatio] = useState<number>(
    baseSettings.width && baseSettings.height ? baseSettings.width / baseSettings.height : 4 / 3
  );
  const [mode, setMode] = useState<ResizeMode>(baseSettings.mode || 'preserve');
  const [format, setFormat] = useState<SupportedMimeType>(baseSettings.format || 'image/jpeg');
  const [quality, setQuality] = useState<number>(baseSettings.quality ?? 0.88);
  const [targetSizeKB, setTargetSizeKB] = useState<string>(
    baseSettings.targetSizeKB ? String(baseSettings.targetSizeKB) : ''
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedResult, setProcessedResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentResizeSettings: ResizeSettings = {
    width,
    height,
    lockAspectRatio,
    mode,
    format,
    quality,
    targetSizeKB: targetSizeKB.trim() !== '' && !isNaN(Number(targetSizeKB)) ? Number(targetSizeKB) : undefined,
  };

  // Auto-save changes to last used settings
  useEffect(() => {
    saveLastUsedSettings('resize', currentResizeSettings);
  }, [width, height, lockAspectRatio, mode, format, quality, targetSizeKB]);

  const handleApplyWorkspacePreset = (preset: WorkspacePreset<'resize'>) => {
    setActivePresetId(preset.id);
    const s = preset.settings;
    setWidth(s.width);
    setHeight(s.height);
    setLockAspectRatio(s.lockAspectRatio);
    if (s.width && s.height) setAspectRatio(s.width / s.height);
    setMode(s.mode);
    setFormat(s.format);
    setQuality(s.quality);
    setTargetSizeKB(s.targetSizeKB ? String(s.targetSizeKB) : '');
    saveLastUsedSettings('resize', s);

    if (imageFile) {
      runReResize(imageFile, s);
    }
  };

  const handleResetToDefaults = () => {
    setActivePresetId(null);
    const def = INITIAL_APPLICATION_DEFAULTS.resize;
    setWidth(def.width);
    setHeight(def.height);
    setLockAspectRatio(def.lockAspectRatio);
    setAspectRatio(def.width / def.height);
    setMode(def.mode);
    setFormat(def.format);
    setQuality(def.quality);
    setTargetSizeKB('');
    saveLastUsedSettings('resize', def);

    if (imageFile) {
      runReResize(imageFile, def);
    }
  };

  const runReResize = async (targetImage: ImageFile, s: ResizeSettings) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (processedResult) revokeObjectUrl(processedResult.objectUrl);
      const res = await resizeImage(targetImage, {
        width: s.width,
        height: s.height,
        mode: s.mode,
        format: s.format,
        quality: s.quality,
        targetSizeKB: s.targetSizeKB,
        preserveTransparency: true,
      });
      setProcessedResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resize failed.');
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
    try {
      if (imageFile) revokeObjectUrl(imageFile.objectUrl);
      if (processedResult) {
        revokeObjectUrl(processedResult.objectUrl);
        setProcessedResult(null);
      }

      const loaded = await loadImageFromFile(file);
      setImageFile(loaded);
      setWidth(loaded.width);
      setHeight(loaded.height);
      const ratio = loaded.width / loaded.height;
      setAspectRatio(ratio);

      // Default format heuristic
      const initialFormat: SupportedMimeType =
        loaded.type === 'image/png' && loaded.hasTransparency ? 'image/png' : 'image/jpeg';
      setFormat(initialFormat);

      // Run initial pass
      const result = await resizeImage(loaded, {
        width: loaded.width,
        height: loaded.height,
        mode: 'preserve',
        format: initialFormat,
        quality,
        preserveTransparency: true,
      });
      setProcessedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWidthChange = (val: number) => {
    const validVal = Math.max(1, Math.round(val));
    setWidth(validVal);
    if (lockAspectRatio && aspectRatio > 0) {
      setHeight(Math.max(1, Math.round(validVal / aspectRatio)));
    }
  };

  const handleHeightChange = (val: number) => {
    const validVal = Math.max(1, Math.round(val));
    setHeight(validVal);
    if (lockAspectRatio && aspectRatio > 0) {
      setWidth(Math.max(1, Math.round(validVal * aspectRatio)));
    }
  };

  const handlePresetSelect = (presetW: number, presetH: number) => {
    setWidth(presetW);
    setHeight(presetH);
    if (imageFile) {
      if (Math.abs(presetW / presetH - aspectRatio) > 0.05) {
        setMode('crop');
      }
    }
  };

  const handleRunResize = async () => {
    if (!imageFile) return;

    if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) {
      setError('Please provide valid positive pixel dimensions.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    try {
      if (processedResult) {
        revokeObjectUrl(processedResult.objectUrl);
      }

      const parsedTargetKB =
        targetSizeKB.trim() !== '' && !isNaN(Number(targetSizeKB))
          ? Number(targetSizeKB)
          : undefined;

      const result = await resizeImage(imageFile, {
        width,
        height,
        mode,
        format,
        quality,
        targetSizeKB: parsedTargetKB,
        preserveTransparency: true,
      });
      setProcessedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resize failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (imageFile) revokeObjectUrl(imageFile.objectUrl);
    if (processedResult) revokeObjectUrl(processedResult.objectUrl);
    setImageFile(null);
    setProcessedResult(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {!imageFile ? (
        <div className="space-y-6">
          <PresetBar
            toolId="resize"
            currentSettings={currentResizeSettings}
            activePresetId={activePresetId}
            onApplyPreset={handleApplyWorkspacePreset}
            onResetToDefaults={handleResetToDefaults}
          />
          <DropZone onFileSelected={handleFileSelected} isLoading={isProcessing} />
        </div>
      ) : (
        <div className="space-y-6">
          <PresetBar
            toolId="resize"
            currentSettings={currentResizeSettings}
            activePresetId={activePresetId}
            onApplyPreset={handleApplyWorkspacePreset}
            onResetToDefaults={handleResetToDefaults}
          />
          {/* Controls Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Scaling className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">{t.toolResizeTitle}</h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
              >
                {t.btnReset}
              </button>
            </div>

            {/* Presets */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.dimensionPresetsLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect(600, 600)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {t.presetPassport}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect(400, 514)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {t.presetApplication}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect(1200, 630)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {t.presetBanner}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect(300, 300)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {t.presetThumbnail}
                </button>
              </div>
            </div>

            {/* Width, Height, Lock, Resize Mode */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.widthLabel}
                </label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">{t.heightLabel}</label>
                  <button
                    type="button"
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                    title="Lock/unlock aspect ratio"
                  >
                    {lockAspectRatio ? (
                      <>
                        <Lock className="h-3 w-3" /> {t.aspectLocked}
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3 w-3 text-slate-400" /> {t.aspectFree}
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.resizeModeLabel}
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as ResizeMode)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="preserve">{t.modePreserve}</option>
                  <option value="crop">{t.modeCrop}</option>
                  <option value="fit">{t.modeFit}</option>
                  <option value="stretch">{t.modeStretch}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.outputFormatLabel}
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as SupportedMimeType)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="image/jpeg">JPG / JPEG</option>
                  <option value="image/webp">WebP</option>
                  <option value="image/png">PNG</option>
                </select>
              </div>
            </div>

            {/* Optional Max Size Limit */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.targetSizeOptional}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder={t.targetSizeOptionalHint}
                    value={targetSizeKB}
                    onChange={(e) => setTargetSizeKB(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400">
                    KB
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleRunResize}
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
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Result */}
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
