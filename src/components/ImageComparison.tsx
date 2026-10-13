import React, { useState } from 'react';
import { ImageFile, ProcessedResult } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { formatFileSize, downloadBlob } from '../utils/imageProcessor';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Share2,
} from 'lucide-react';
import { ShareResultModal } from './ShareResultModal';

interface ImageComparisonProps {
  original: ImageFile;
  processed: ProcessedResult;
  onReset: () => void;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  original,
  processed,
  onReset,
}) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'both' | 'optimized' | 'original'>('both');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const getCleanDownloadName = () => {
    const baseName = original.name.replace(/\.[^/.]+$/, '');
    let ext = '.jpg';
    if (processed.format === 'image/png') ext = '.png';
    if (processed.format === 'image/webp') ext = '.webp';
    return `${baseName}_formfit${ext}`;
  };

  const handleDownload = () => {
    downloadBlob(processed.blob, getCleanDownloadName());
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.resultsTitle}</h3>
            <p className="text-xs text-slate-500">
              {original.name} → {getCleanDownloadName()}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (mobile-friendly) */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
              activeTab === 'both' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.viewSideBySide}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('optimized')}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
              activeTab === 'optimized' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.optimizedImage}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('original')}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
              activeTab === 'original' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.originalImage}
          </button>
        </div>
      </div>

      {/* Warning / Informational Notice */}
      {processed.warning && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <p className="leading-relaxed">{processed.warning}</p>
        </div>
      )}

      {/* Metrics Summary Strip */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {t.originalImage} {t.fileSize}
          </span>
          <p className="mt-0.5 text-sm sm:text-base font-bold text-slate-700">
            {formatFileSize(original.size)}
          </p>
          <span className="text-[11px] text-slate-500">
            {original.width} × {original.height} px
          </span>
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {t.optimizedImage} {t.fileSize}
          </span>
          <p className="mt-0.5 text-sm sm:text-base font-bold text-blue-600">
            {formatFileSize(processed.size)}
          </p>
          <span className="text-[11px] text-slate-500">
            {processed.width} × {processed.height} px
          </span>
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {t.sizeReduction}
          </span>
          <p
            className={`mt-0.5 text-sm sm:text-base font-bold ${
              processed.reductionPercentage >= 0 ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {processed.reductionPercentage >= 0
              ? `-${processed.reductionPercentage}%`
              : `+${Math.abs(processed.reductionPercentage)}%`}
          </p>
          <span className="text-[11px] text-slate-500">
            {processed.reductionBytes >= 0
              ? `${formatFileSize(processed.reductionBytes)} ${t.bytesSaved}`
              : t.fileExpanded}
          </span>
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {t.format}
          </span>
          <p className="mt-0.5 text-sm sm:text-base font-bold text-slate-800 uppercase">
            {processed.format.replace('image/', '')}
          </p>
          <span className="text-[11px] text-slate-500">
            {processed.qualityUsed !== undefined
              ? `${t.qualityPrefix}: ${Math.round(processed.qualityUsed * 100)}%`
              : t.losslessLabel}
          </span>
        </div>
      </div>

      {/* Visual Image Comparison Container */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Original Preview */}
        {(activeTab === 'both' || activeTab === 'original') && (
          <div className="flex flex-col rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700">
              <span>{t.originalImage}</span>
              <span className="text-slate-400 font-mono">
                {original.width}×{original.height} • {formatFileSize(original.size)}
              </span>
            </div>
            <div className="relative flex flex-1 items-center justify-center p-4 min-h-[240px] max-h-[420px] overflow-hidden">
              <img
                src={original.objectUrl}
                alt={t.originalImage}
                className="max-h-[360px] max-w-full object-contain rounded shadow-xs"
              />
            </div>
          </div>
        )}

        {/* Optimized Preview */}
        {(activeTab === 'both' || activeTab === 'optimized') && (
          <div className="flex flex-col rounded-xl border border-blue-200 overflow-hidden bg-slate-100 ring-1 ring-blue-500/20">
            <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/70 px-3.5 py-2 text-xs font-semibold text-blue-900">
              <span className="flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>{t.optimizedImage}</span>
              </span>
              <span className="text-blue-700 font-mono font-bold">
                {processed.width}×{processed.height} • {formatFileSize(processed.size)}
              </span>
            </div>
            <div className="relative flex flex-1 items-center justify-center p-4 min-h-[240px] max-h-[420px] overflow-hidden">
              <img
                src={processed.objectUrl}
                alt={t.optimizedImage}
                className="max-h-[360px] max-w-full object-contain rounded shadow-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RotateCcw className="h-4 w-4 text-slate-500" />
          <span>{t.btnProcessAnother}</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Share verified result stats"
          >
            <Share2 className="h-4 w-4 text-blue-600" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'مشاركة النتيجة' : 'Share Result'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <Download className="h-4 w-4" />
            <span>{t.btnDownload}</span>
          </button>
        </div>
      </div>

      {showShareModal && (
        <ShareResultModal
          original={original}
          processed={processed}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
