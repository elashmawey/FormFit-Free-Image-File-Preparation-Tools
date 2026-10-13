import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ImageFile, ProcessedResult, SupportedMimeType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { DropZone } from './DropZone';
import { ImageComparison } from './ImageComparison';
import { PresetBar } from './PresetBar';
import {
  loadImageFromFile,
  convertImage,
  revokeObjectUrl,
} from '../utils/imageProcessor';
import {
  getLastUsedSettings,
  saveLastUsedSettings,
  getDefaultPreset,
  getSavedPresets,
  INITIAL_APPLICATION_DEFAULTS,
} from '../utils/workspaceStorage';
import { ConvertSettings, WorkspacePreset } from '../types/workspace';
import {
  RefreshCw,
  Sparkles,
  AlertCircle,
  Info,
  Check,
} from 'lucide-react';

export const ConvertTool: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  // Workspace initialization
  const presetQueryId = searchParams.get('preset');
  const matchedQueryPreset = presetQueryId
    ? getSavedPresets('convert').find((p) => p.id === presetQueryId)
    : null;
  const toolDefaultPreset = getDefaultPreset('convert');
  const toolLastUsed = getLastUsedSettings('convert');

  const baseSettings: ConvertSettings = matchedQueryPreset
    ? matchedQueryPreset.settings
    : toolDefaultPreset?.settings || toolLastUsed || INITIAL_APPLICATION_DEFAULTS.convert;

  const [activePresetId, setActivePresetId] = useState<string | null>(
    matchedQueryPreset?.id || toolDefaultPreset?.id || null
  );

  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [targetFormat, setTargetFormat] = useState<SupportedMimeType>(baseSettings.format || 'image/webp');
  const [quality, setQuality] = useState<number>(baseSettings.quality ?? 0.92);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedResult, setProcessedResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentConvertSettings: ConvertSettings = {
    format: targetFormat,
    quality,
  };

  // Auto-save changes to last used settings
  useEffect(() => {
    saveLastUsedSettings('convert', currentConvertSettings);
  }, [targetFormat, quality]);

  const handleApplyWorkspacePreset = (preset: WorkspacePreset<'convert'>) => {
    setActivePresetId(preset.id);
    const s = preset.settings;
    setTargetFormat(s.format);
    setQuality(s.quality);
    saveLastUsedSettings('convert', s);

    if (imageFile) {
      runReConvert(imageFile, s);
    }
  };

  const handleResetToDefaults = () => {
    setActivePresetId(null);
    const def = INITIAL_APPLICATION_DEFAULTS.convert;
    setTargetFormat(def.format);
    setQuality(def.quality);
    saveLastUsedSettings('convert', def);

    if (imageFile) {
      runReConvert(imageFile, def);
    }
  };

  const runReConvert = async (targetImage: ImageFile, s: ConvertSettings) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (processedResult) revokeObjectUrl(processedResult.objectUrl);
      const res = await convertImage(targetImage, {
        format: s.format,
        quality: s.quality,
        preserveTransparency: true,
      });
      setProcessedResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
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

      // Pick sensible alternative format
      let initialTarget: SupportedMimeType = 'image/webp';
      if (loaded.type === 'image/webp') {
        initialTarget = 'image/jpeg';
      } else if (loaded.type === 'image/jpeg' || loaded.type === 'image/jpg') {
        initialTarget = 'image/png';
      }
      setTargetFormat(initialTarget);

      // Run initial pass
      const result = await convertImage(loaded, {
        format: initialTarget,
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

  const handleRunConversion = async () => {
    if (!imageFile) return;

    setError(null);
    setIsProcessing(true);
    try {
      if (processedResult) {
        revokeObjectUrl(processedResult.objectUrl);
      }

      const result = await convertImage(imageFile, {
        format: targetFormat,
        quality,
        preserveTransparency: true,
      });
      setProcessedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
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

  const formats: { value: SupportedMimeType; label: string; desc: string }[] = [
    {
      value: 'image/jpeg',
      label: t.convertJpgTitle,
      desc: t.convertJpgDesc,
    },
    {
      value: 'image/png',
      label: t.convertPngTitle,
      desc: t.convertPngDesc,
    },
    {
      value: 'image/webp',
      label: t.convertWebpTitle,
      desc: t.convertWebpDesc,
    },
  ];

  return (
    <div className="w-full">
      {!imageFile ? (
        <div className="space-y-6">
          <PresetBar
            toolId="convert"
            currentSettings={currentConvertSettings}
            activePresetId={activePresetId}
            onApplyPreset={handleApplyWorkspacePreset}
            onResetToDefaults={handleResetToDefaults}
          />
          <DropZone onFileSelected={handleFileSelected} isLoading={isProcessing} />
        </div>
      ) : (
        <div className="space-y-6">
          <PresetBar
            toolId="convert"
            currentSettings={currentConvertSettings}
            activePresetId={activePresetId}
            onApplyPreset={handleApplyWorkspacePreset}
            onResetToDefaults={handleResetToDefaults}
          />
          {/* Controls Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">{t.toolConvertTitle}</h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
              >
                {t.btnReset}
              </button>
            </div>

            {/* Target Format Radio Cards */}
            <div className="mt-5">
              <label className="block text-xs font-semibold text-slate-700 mb-3">
                {t.outputFormatLabel}
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {formats.map((fmt) => {
                  const isSelected = targetFormat === fmt.value;
                  return (
                    <div
                      key={fmt.value}
                      onClick={() => setTargetFormat(fmt.value)}
                      className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-slate-800">{fmt.label}</span>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{fmt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quality Slider for JPEG / WebP */}
            {targetFormat !== 'image/png' && (
              <div className="mt-5 max-w-md">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">{t.qualityLabel}</label>
                  <span className="text-xs font-bold text-blue-600">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.02"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            )}

            {/* Warning if Transparent to JPEG */}
            {imageFile.hasTransparency && targetFormat === 'image/jpeg' && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200">
                <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p>{t.jpegTransparencyWarning}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleRunConversion}
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
