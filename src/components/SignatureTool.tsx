import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ImageFile,
  ProcessedResult,
  SignatureCropRect,
  SupportedMimeType,
} from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { DropZone } from './DropZone';
import { ImageComparison } from './ImageComparison';
import { PresetBar } from './PresetBar';
import {
  loadImageFromFile,
  processSignature,
  autoDetectSignatureBounds,
  revokeObjectUrl,
} from '../utils/imageProcessor';
import {
  getLastUsedSettings,
  saveLastUsedSettings,
  getDefaultPreset,
  getSavedPresets,
  INITIAL_APPLICATION_DEFAULTS,
} from '../utils/workspaceStorage';
import { SignatureSettings, WorkspacePreset } from '../types/workspace';
import {
  PenTool,
  Sparkles,
  AlertCircle,
  Crop,
  Scan,
  Info,
} from 'lucide-react';

export const SignatureTool: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  // Workspace initialization
  const presetQueryId = searchParams.get('preset');
  const matchedQueryPreset = presetQueryId
    ? getSavedPresets('signature').find((p) => p.id === presetQueryId)
    : null;
  const toolDefaultPreset = getDefaultPreset('signature');
  const toolLastUsed = getLastUsedSettings('signature');

  const baseSettings: SignatureSettings = matchedQueryPreset
    ? matchedQueryPreset.settings
    : toolDefaultPreset?.settings || toolLastUsed || INITIAL_APPLICATION_DEFAULTS.signature;

  const [activePresetId, setActivePresetId] = useState<string | null>(
    matchedQueryPreset?.id || toolDefaultPreset?.id || null
  );

  const [imageFile, setImageFile] = useState<ImageFile | null>(null);

  // Sliders for crop bounds (percentages of original dimensions 0-100)
  const [cropLeftPct, setCropLeftPct] = useState<number>(0);
  const [cropTopPct, setCropTopPct] = useState<number>(0);
  const [cropRightPct, setCropRightPct] = useState<number>(100);
  const [cropBottomPct, setCropBottomPct] = useState<number>(100);

  const [targetWidth, setTargetWidth] = useState<number>(baseSettings.targetWidth || 400);
  const [targetHeight, setTargetHeight] = useState<number>(baseSettings.targetHeight || 150);
  const [format, setFormat] = useState<SupportedMimeType>(baseSettings.format || 'image/jpeg');
  const [targetSizeKB, setTargetSizeKB] = useState<string>(
    baseSettings.targetSizeKB ? String(baseSettings.targetSizeKB) : '50'
  );
  const [enhanceContrast, setEnhanceContrast] = useState<boolean>(baseSettings.enhanceContrast ?? true);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedResult, setProcessedResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentSignatureSettings: SignatureSettings = {
    targetWidth,
    targetHeight,
    format,
    targetSizeKB: targetSizeKB.trim() !== '' && !isNaN(Number(targetSizeKB)) ? Number(targetSizeKB) : undefined,
    enhanceContrast,
  };

  // Auto-save changes to last used settings
  useEffect(() => {
    saveLastUsedSettings('signature', currentSignatureSettings);
  }, [targetWidth, targetHeight, format, targetSizeKB, enhanceContrast]);

  const handleApplyWorkspacePreset = (preset: WorkspacePreset<'signature'>) => {
    setActivePresetId(preset.id);
    const s = preset.settings;
    setTargetWidth(s.targetWidth);
    setTargetHeight(s.targetHeight);
    setFormat(s.format);
    setTargetSizeKB(s.targetSizeKB ? String(s.targetSizeKB) : '');
    setEnhanceContrast(s.enhanceContrast);
    saveLastUsedSettings('signature', s);

    if (imageFile) {
      runReProcessSignature(imageFile, s);
    }
  };

  const handleResetToDefaults = () => {
    setActivePresetId(null);
    const def = INITIAL_APPLICATION_DEFAULTS.signature;
    setTargetWidth(def.targetWidth);
    setTargetHeight(def.targetHeight);
    setFormat(def.format);
    setTargetSizeKB('50');
    setEnhanceContrast(def.enhanceContrast);
    saveLastUsedSettings('signature', def);

    if (imageFile) {
      runReProcessSignature(imageFile, def);
    }
  };

  const runReProcessSignature = async (targetImage: ImageFile, s: SignatureSettings) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (processedResult) revokeObjectUrl(processedResult.objectUrl);
      const res = await processSignature(targetImage, {
        cropRect: {
          x: cropLeftPct,
          y: cropTopPct,
          width: cropRightPct - cropLeftPct,
          height: cropBottomPct - cropTopPct,
        },
        targetWidth: s.targetWidth,
        targetHeight: s.targetHeight,
        format: s.format,
        targetSizeKB: s.targetSizeKB,
        enhanceContrast: s.enhanceContrast,
      });
      setProcessedResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signature processing failed.');
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

      // Default crop: full image
      setCropLeftPct(0);
      setCropTopPct(0);
      setCropRightPct(100);
      setCropBottomPct(100);

      // Process initial pass
      const result = await processSignature(loaded, {
        targetWidth: 400,
        targetHeight: 150,
        format: 'image/jpeg',
        targetSizeKB: 50,
        enhanceContrast: true,
      });
      setProcessedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading signature.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoDetect = () => {
    if (!imageFile) return;

    const img = new Image();
    img.onload = () => {
      const bounds = autoDetectSignatureBounds(img);
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      const left = Math.round((bounds.x / w) * 100);
      const top = Math.round((bounds.y / h) * 100);
      const right = Math.min(100, Math.round(((bounds.x + bounds.width) / w) * 100));
      const bottom = Math.min(100, Math.round(((bounds.y + bounds.height) / h) * 100));

      setCropLeftPct(left);
      setCropTopPct(top);
      setCropRightPct(right);
      setCropBottomPct(bottom);
    };
    img.src = imageFile.objectUrl;
  };

  const handleResetCrop = () => {
    if (!imageFile) return;
    setCropLeftPct(0);
    setCropTopPct(0);
    setCropRightPct(100);
    setCropBottomPct(100);
  };

  const calculateCurrentCropRect = (): SignatureCropRect | undefined => {
    if (!imageFile) return undefined;
    const origW = imageFile.width;
    const origH = imageFile.height;

    const x = Math.round((cropLeftPct / 100) * origW);
    const y = Math.round((cropTopPct / 100) * origH);
    const w = Math.max(10, Math.round(((cropRightPct - cropLeftPct) / 100) * origW));
    const h = Math.max(10, Math.round(((cropBottomPct - cropTopPct) / 100) * origH));

    return { x, y, width: w, height: h };
  };

  const handleRunProcessing = async () => {
    if (!imageFile) return;

    setError(null);
    setIsProcessing(true);
    try {
      if (processedResult) {
        revokeObjectUrl(processedResult.objectUrl);
      }

      const activeCrop = calculateCurrentCropRect();
      const parsedKB =
        targetSizeKB.trim() !== '' && !isNaN(Number(targetSizeKB))
          ? Number(targetSizeKB)
          : undefined;

      const result = await processSignature(imageFile, {
        cropRect: activeCrop,
        targetWidth,
        targetHeight,
        format,
        targetSizeKB: parsedKB,
        enhanceContrast,
      });
      setProcessedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signature processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePresetDimensions = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
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
            toolId="signature"
            currentSettings={currentSignatureSettings}
            activePresetId={activePresetId}
            onApplyPreset={handleApplyWorkspacePreset}
            onResetToDefaults={handleResetToDefaults}
          />
          <DropZone onFileSelected={handleFileSelected} isLoading={isProcessing} />
        </div>
      ) : (
        <div className="space-y-6">
          <PresetBar
            toolId="signature"
            currentSettings={currentSignatureSettings}
            activePresetId={activePresetId}
            onApplyPreset={handleApplyWorkspacePreset}
            onResetToDefaults={handleResetToDefaults}
          />
          {/* Controls Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">{t.toolSignatureTitle}</h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
              >
                {t.btnReset}
              </button>
            </div>

            {/* Portal Requirements Advisory */}
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 text-xs text-blue-900">
              <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
              <p className="leading-relaxed">{t.sigPortalAdvisory}</p>
            </div>

            {/* Cropping Section */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Crop className="h-4 w-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-800">{t.sigCropTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoDetect}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <Scan className="h-3.5 w-3.5" />
                    <span>{t.btnAutoDetectBounds}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCrop}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    {t.btnResetCrop}
                  </button>
                </div>
              </div>

              {/* Visual Crop Box Preview */}
              <div className="relative mx-auto flex items-center justify-center rounded-lg border border-slate-300 bg-white p-3 max-h-[220px] overflow-hidden">
                <img
                  src={imageFile.objectUrl}
                  alt="Signature Source"
                  className="max-h-[190px] max-w-full object-contain"
                />
                {/* Crop Overlay rectangle representation */}
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/15 pointer-events-none rounded transition-all"
                  style={{
                    left: `${cropLeftPct}%`,
                    top: `${cropTopPct}%`,
                    width: `${Math.max(5, cropRightPct - cropLeftPct)}%`,
                    height: `${Math.max(5, cropBottomPct - cropTopPct)}%`,
                  }}
                />
              </div>

              {/* Sliders for margin trim */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <label className="text-[11px] font-medium text-slate-600">
                    {t.sigCropLeft} ({cropLeftPct}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, cropRightPct - 5)}
                    value={cropLeftPct}
                    onChange={(e) => setCropLeftPct(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600">
                    {t.sigCropRight} ({cropRightPct}%)
                  </label>
                  <input
                    type="range"
                    min={Math.min(100, cropLeftPct + 5)}
                    max="100"
                    value={cropRightPct}
                    onChange={(e) => setCropRightPct(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600">
                    {t.sigCropTop} ({cropTopPct}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, cropBottomPct - 5)}
                    value={cropTopPct}
                    onChange={(e) => setCropTopPct(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600">
                    {t.sigCropBottom} ({cropBottomPct}%)
                  </label>
                  <input
                    type="range"
                    min={Math.min(100, cropTopPct + 5)}
                    max="100"
                    value={cropBottomPct}
                    onChange={(e) => setCropBottomPct(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Dimension Presets & Target Output */}
            <div className="mt-5">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.sigPresetsLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetDimensions(300, 100)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {t.sigPresetSmall}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDimensions(400, 150)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {t.sigPresetMedium}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDimensions(600, 200)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {t.sigPresetLarge}
                </button>
              </div>
            </div>

            {/* Dimension, Format, Size */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.widthLabel}
                </label>
                <input
                  type="number"
                  min="50"
                  max="4000"
                  value={targetWidth}
                  onChange={(e) => setTargetWidth(Math.max(10, Number(e.target.value)))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.heightLabel}
                </label>
                <input
                  type="number"
                  min="20"
                  max="2000"
                  value={targetHeight}
                  onChange={(e) => setTargetHeight(Math.max(10, Number(e.target.value)))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.outputFormatLabel}
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as SupportedMimeType)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="image/jpeg">{t.sigFormatJpegNote}</option>
                  <option value="image/png">{t.sigFormatPngNote}</option>
                  <option value="image/webp">{t.sigFormatWebpNote}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.targetSizeLabel}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    placeholder="e.g. 50"
                    value={targetSizeKB}
                    onChange={(e) => setTargetSizeKB(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400">
                    KB
                  </span>
                </div>
              </div>
            </div>

            {/* Contrast enhancement toggle & transparency explanation */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enhanceContrast}
                  onChange={(e) => setEnhanceContrast(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {t.enhanceContrastLabel}
                </span>
              </label>
              <p className="text-[11px] text-slate-400 leading-normal">
                {t.sigAiBgNote}
              </p>
            </div>

            {/* Submit */}
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleRunProcessing}
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

          {/* Results */}
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
