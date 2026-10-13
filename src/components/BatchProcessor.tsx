import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import JSZip from 'jszip';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedMimeType, ImageFile, ProcessedResult } from '../types';
import { PresetBar } from './PresetBar';
import {
  loadImageFromFile,
  compressImage,
  resizeImage,
  formatFileSize,
  downloadBlob,
  revokeObjectUrl,
  MAX_FILE_SIZE_BYTES,
} from '../utils/imageProcessor';
import {
  getLastUsedSettings,
  saveLastUsedSettings,
  getDefaultPreset,
  getSavedPresets,
  INITIAL_APPLICATION_DEFAULTS,
} from '../utils/workspaceStorage';
import { BatchSettings, WorkspacePreset } from '../types/workspace';
import {
  Files,
  Upload,
  Download,
  Archive,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Sliders,
  Layers,
  Trash2,
  Eye,
  Check,
} from 'lucide-react';

interface BatchItem {
  id: string;
  file: File;
  imageFile?: ImageFile;
  status: 'pending' | 'processing' | 'done' | 'failed';
  result?: ProcessedResult;
  error?: string;
}

export const BatchProcessor: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const isAr = lang === 'ar';
  const [searchParams] = useSearchParams();

  // Workspace initialization
  const presetQueryId = searchParams.get('preset');
  const matchedQueryPreset = presetQueryId
    ? getSavedPresets('batch').find((p) => p.id === presetQueryId)
    : null;
  const toolDefaultPreset = getDefaultPreset('batch');
  const toolLastUsed = getLastUsedSettings('batch');

  const baseSettings: BatchSettings = matchedQueryPreset
    ? matchedQueryPreset.settings
    : toolDefaultPreset?.settings || toolLastUsed || INITIAL_APPLICATION_DEFAULTS.batch;

  const [activePresetId, setActivePresetId] = useState<string | null>(
    matchedQueryPreset?.id || toolDefaultPreset?.id || null
  );

  const [items, setItems] = useState<BatchItem[]>([]);
  const [targetSizeKB, setTargetSizeKB] = useState<string>(String(baseSettings.targetSizeKB || 100));
  const [targetWidth, setTargetWidth] = useState<string>(
    baseSettings.targetWidth ? String(baseSettings.targetWidth) : ''
  );
  const [targetHeight, setTargetHeight] = useState<string>(
    baseSettings.targetHeight ? String(baseSettings.targetHeight) : ''
  );
  const [format, setFormat] = useState<SupportedMimeType>(baseSettings.format || 'image/jpeg');
  const [autoDownscale, setAutoDownscale] = useState<boolean>(baseSettings.autoDownscale ?? true);
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<BatchItem | null>(null);

  const currentBatchSettings: BatchSettings = {
    targetSizeKB: targetSizeKB.trim() !== '' && !isNaN(Number(targetSizeKB)) ? Number(targetSizeKB) : 100,
    targetWidth: targetWidth.trim() !== '' && !isNaN(Number(targetWidth)) ? Number(targetWidth) : undefined,
    targetHeight: targetHeight.trim() !== '' && !isNaN(Number(targetHeight)) ? Number(targetHeight) : undefined,
    format,
    autoDownscale,
  };

  // Auto-save changes to last used settings
  useEffect(() => {
    saveLastUsedSettings('batch', currentBatchSettings);
  }, [targetSizeKB, targetWidth, targetHeight, format, autoDownscale]);

  const handleApplyWorkspacePreset = (preset: WorkspacePreset<'batch'>) => {
    setActivePresetId(preset.id);
    const s = preset.settings;
    setTargetSizeKB(String(s.targetSizeKB || 100));
    setTargetWidth(s.targetWidth ? String(s.targetWidth) : '');
    setTargetHeight(s.targetHeight ? String(s.targetHeight) : '');
    setFormat(s.format);
    setAutoDownscale(s.autoDownscale);
    saveLastUsedSettings('batch', s);
  };

  const handleResetToDefaults = () => {
    setActivePresetId(null);
    const def = INITIAL_APPLICATION_DEFAULTS.batch;
    setTargetSizeKB(String(def.targetSizeKB));
    setTargetWidth('');
    setTargetHeight('');
    setFormat(def.format);
    setAutoDownscale(def.autoDownscale);
    saveLastUsedSettings('batch', def);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newItems: BatchItem[] = [];

    for (const file of fileArray) {
      if (items.length + newItems.length >= 10) {
        break; // enforce limit of 10 images
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        continue; // skip files > 20 MB
      }

      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      newItems.push({
        id,
        file,
        status: 'pending',
      });
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.result) revokeObjectUrl(target.result.objectUrl);
      if (target?.imageFile) revokeObjectUrl(target.imageFile.objectUrl);
      return prev.filter((i) => i.id !== id);
    });
    if (selectedPreview?.id === id) {
      setSelectedPreview(null);
    }
  };

  const clearAll = () => {
    items.forEach((item) => {
      if (item.result) revokeObjectUrl(item.result.objectUrl);
      if (item.imageFile) revokeObjectUrl(item.imageFile.objectUrl);
    });
    setItems([]);
    setSelectedPreview(null);
  };

  const processSingleItem = async (item: BatchItem): Promise<BatchItem> => {
    try {
      let loaded = item.imageFile;
      if (!loaded) {
        loaded = await loadImageFromFile(item.file);
      }

      const parsedKB = targetSizeKB.trim() ? Number(targetSizeKB) : undefined;
      const parsedW = targetWidth.trim() ? Number(targetWidth) : undefined;
      const parsedH = targetHeight.trim() ? Number(targetHeight) : undefined;

      let result: ProcessedResult;

      if (parsedW && parsedH) {
        // Run resize pass with optional size limit
        result = await resizeImage(loaded, {
          width: parsedW,
          height: parsedH,
          mode: 'preserve',
          format,
          targetSizeKB: parsedKB,
          preserveTransparency: true,
        });
      } else {
        // Run compression pass
        result = await compressImage(loaded, {
          targetSizeKB: parsedKB,
          format,
          autoDownscale,
          preserveTransparency: true,
        });
      }

      return {
        ...item,
        imageFile: loaded,
        status: 'done',
        result,
        error: undefined,
      };
    } catch (err) {
      return {
        ...item,
        status: 'failed',
        error: err instanceof Error ? err.message : 'Processing failed',
      };
    }
  };

  const handleProcessAll = async () => {
    setIsProcessingAll(true);

    const updated = [...items];
    for (let i = 0; i < updated.length; i++) {
      const current = updated[i];
      if (current.status === 'done') continue;

      updated[i] = { ...current, status: 'processing' };
      setItems([...updated]);

      const processed = await processSingleItem(current);
      updated[i] = processed;
      setItems([...updated]);
    }

    setIsProcessingAll(false);
  };

  const handleRetryItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'processing', error: undefined } : i))
    );

    const processed = await processSingleItem(item);
    setItems((prev) => prev.map((i) => (i.id === id ? processed : i)));
  };

  const handleDownloadAllZip = async () => {
    const completedItems = items.filter((i) => i.status === 'done' && i.result);
    if (completedItems.length === 0) return;

    setIsZipping(true);
    setZipError(null);
    try {
      const zip = new JSZip();
      const ext = format === 'image/png' ? '.png' : format === 'image/webp' ? '.webp' : '.jpg';

      completedItems.forEach((item, index) => {
        if (item.result) {
          const originalBaseName = item.file.name.replace(/\.[^/.]+$/, '');
          const filename = `${originalBaseName}_formfit_${index + 1}${ext}`;
          zip.file(filename, item.result.blob);
        }
      });

      const content = await zip.generateAsync({ type: 'blob' });
      downloadBlob(content, `formfit_batch_${Date.now()}.zip`);
    } catch {
      setZipError(
        isAr
          ? 'تعذر إنشاء ملف ZIP. يرجى تنزيل الصور المجهزة بشكل منفرد.'
          : 'Failed to generate ZIP file. Please download images individually.'
      );
    } finally {
      setIsZipping(false);
    }
  };

  const completedCount = items.filter((i) => i.status === 'done').length;

  return (
    <div className="w-full space-y-8">
      {/* Configuration Strip */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'إعدادات المعالجة الجماعية الموحدة' : 'Batch Processing Configuration'}
            </h3>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isAr ? 'مسح الكل' : 'Clear All'}</span>
            </button>
          )}
        </div>

        {/* Inputs */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'الحد الأقصى لكل صورة (ك.ب)' : 'Target Size Per Image (KB)'}
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                max="5000"
                value={targetSizeKB}
                onChange={(e) => setTargetSizeKB(e.target.value)}
                placeholder="e.g. 100"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400">
                KB
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'العرض الأقصى (اختياري)' : 'Target Width (px - Optional)'}
            </label>
            <input
              type="number"
              min="50"
              max="5000"
              value={targetWidth}
              onChange={(e) => setTargetWidth(e.target.value)}
              placeholder={isAr ? 'الحفاظ على الأصل' : 'Keep original'}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'الارتفاع الأقصى (اختياري)' : 'Target Height (px - Optional)'}
            </label>
            <input
              type="number"
              min="50"
              max="5000"
              value={targetHeight}
              onChange={(e) => setTargetHeight(e.target.value)}
              placeholder={isAr ? 'الحفاظ على الأصل' : 'Keep original'}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'الصيغة الناتجة الموحدة' : 'Unified Output Format'}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as SupportedMimeType)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="image/jpeg">JPG / JPEG</option>
              <option value="image/webp">WebP</option>
              <option value="image/png">PNG</option>
            </select>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoDownscale}
              onChange={(e) => setAutoDownscale(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-slate-700">
              {isAr
                ? 'تقليل الأبعاد تلقائياً إذا لزم لبلوغ الحجم المطلوب'
                : 'Auto-reduce dimensions if needed to reach target size'}
            </span>
          </label>

          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
              >
                <Archive className="h-4 w-4" />
                <span>
                  {isZipping
                    ? isAr ? 'جارٍ ضغط الأرشيف...' : 'Creating ZIP...'
                    : isAr
                    ? `تحميل الكل كـ ZIP (${completedCount})`
                    : `Download All as ZIP (${completedCount})`}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleProcessAll}
              disabled={items.length === 0 || isProcessingAll}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {isProcessingAll ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{isAr ? 'جارٍ المعالجة...' : 'Processing Batch...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{isAr ? 'معالجة جميع الصور' : 'Process All Images'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {zipError && (
          <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{zipError}</span>
            </div>
            <button
              type="button"
              onClick={() => setZipError(null)}
              className="text-xs text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Multi-file Dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all shadow-2xs"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) handleFilesAdded(e.target.files);
          }}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
          <Files className="h-7 w-7" />
        </div>
        <h4 className="text-base font-bold text-slate-800">
          {isAr
            ? 'انقر أو اسحب لاختيار عدة صور دفعة واحدة'
            : 'Click or drag to add multiple images at once'}
        </h4>
        <p className="mt-1 text-xs text-slate-500">
          {isAr
            ? 'يدعم حتى ١٠ صور في الدفعة الواحدة (بحد أقصى ٢٠ ميجابايت للصورة)'
            : 'Supports up to 10 images per batch (max 20 MB per file)'}
        </p>
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h4 className="text-sm font-bold text-slate-800">
              {isAr ? `قائمة الملفات (${items.length} / 10)` : `Batch Files (${items.length} / 10)`}
            </h4>
            <span className="text-xs font-semibold text-blue-600">
              {completedCount} / {items.length} {isAr ? 'مكتمل' : 'Completed'}
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:bg-slate-50"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 truncate max-w-[180px] sm:max-w-xs">
                      {item.file.name}
                    </h5>
                    <span className="text-[11px] text-slate-500">
                      {formatFileSize(item.file.size)}
                    </span>
                  </div>
                </div>

                {/* Status / Results */}
                <div className="flex items-center gap-3">
                  {item.status === 'pending' && (
                    <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {isAr ? 'في الانتظار' : 'Pending'}
                    </span>
                  )}
                  {item.status === 'processing' && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <span>{isAr ? 'جارٍ المعالجة...' : 'Processing...'}</span>
                    </span>
                  )}
                  {item.status === 'done' && item.result && (
                    <div className="flex items-center gap-2">
                      <div className="text-right rtl:text-left text-xs">
                        <span className="font-bold text-emerald-600">
                          {formatFileSize(item.result.size)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          -{item.result.reductionPercentage}%
                        </span>
                      </div>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    </div>
                  )}
                  {item.status === 'failed' && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <button
                        type="button"
                        onClick={() => handleRetryItem(item.id)}
                        className="font-bold underline hover:text-red-700"
                      >
                        {isAr ? 'إعادة المحاولة' : 'Retry'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {item.result && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedPreview(item)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-blue-600 shadow-2xs"
                        title={isAr ? 'معاينة' : 'Preview'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const baseName = item.file.name.replace(/\.[^/.]+$/, '');
                          const ext = format === 'image/png' ? '.png' : format === 'image/webp' ? '.webp' : '.jpg';
                          downloadBlob(item.result!.blob, `${baseName}_formfit${ext}`);
                        }}
                        className="rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700 shadow-2xs"
                        title={isAr ? 'تحميل' : 'Download'}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                    title={isAr ? 'حذف' : 'Remove'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Preview Modal */}
      {selectedPreview && selectedPreview.result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
            <button
              type="button"
              onClick={() => setSelectedPreview(null)}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600"
            >
              <AlertCircle className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-2 truncate">
              {selectedPreview.file.name}
            </h3>

            <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 max-h-72 overflow-hidden flex items-center justify-center">
              <img
                src={selectedPreview.result.objectUrl}
                alt="Optimized Preview"
                className="max-h-64 object-contain rounded"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="text-slate-400 block">{isAr ? 'الحجم الأصلي' : 'Original Size'}</span>
                <span className="font-bold text-slate-800">
                  {formatFileSize(selectedPreview.file.size)}
                </span>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <span className="text-emerald-700 block">{isAr ? 'الحجم الناتج' : 'Final Size'}</span>
                <span className="font-bold text-emerald-800">
                  {formatFileSize(selectedPreview.result.size)} (-{selectedPreview.result.reductionPercentage}%)
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const baseName = selectedPreview.file.name.replace(/\.[^/.]+$/, '');
                  const ext = format === 'image/png' ? '.png' : format === 'image/webp' ? '.webp' : '.jpg';
                  downloadBlob(selectedPreview.result!.blob, `${baseName}_formfit${ext}`);
                }}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                {isAr ? 'تحميل هذا الملف' : 'Download This File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
