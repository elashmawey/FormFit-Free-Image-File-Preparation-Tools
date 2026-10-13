import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ImageFile, ProcessedResult } from '../types';
import { formatFileSize } from '../utils/imageProcessor';
import {
  Share2,
  Copy,
  Check,
  Download,
  X,
  Sparkles,
  Link as LinkIcon,
  ShieldCheck,
} from 'lucide-react';

interface ShareResultModalProps {
  original: ImageFile;
  processed: ProcessedResult;
  onClose: () => void;
}

export const ShareResultModal: React.FC<ShareResultModalProps> = ({
  original,
  processed,
  onClose,
}) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate verified shareable text summary
  const summaryText = isAr
    ? `تم تحسين الصورة باستخدام فورم فيت (FormFit):\n` +
      `• الحجم الأصلي: ${formatFileSize(original.size)}\n` +
      `• الحجم بعد الضغط: ${formatFileSize(processed.size)} (توفير ${processed.reductionPercentage}%)\n` +
      `• الأبعاد: ${processed.width}×${processed.height} بكسل\n` +
      `• الصيغة: ${processed.format.replace('image/', '').toUpperCase()}\n` +
      `مجاني وبخصوصية تامة داخل المتصفح: ${window.location.origin}`
    : `Optimized with FormFit (100% private in-browser image tools):\n` +
      `• Original: ${formatFileSize(original.size)}\n` +
      `• Optimized: ${formatFileSize(processed.size)} (${processed.reductionPercentage}% saved)\n` +
      `• Dimensions: ${processed.width}×${processed.height} px\n` +
      `• Format: ${processed.format.replace('image/', '').toUpperCase()}\n` +
      `Free & instant at: ${window.location.origin}`;

  // Generate shareable canvas result card
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 450);
    grad.addColorStop(0, '#1E293B'); // Slate 800
    grad.addColorStop(1, '#0F172A'); // Slate 900
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 450);

    // Decorative blue glowing circle
    ctx.beginPath();
    ctx.arc(700, 60, 180, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
    ctx.fill();

    // Border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, 768, 418);

    // Header Branding
    ctx.fillStyle = '#2563EB';
    ctx.beginPath();
    ctx.roundRect(50, 45, 48, 48, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText('FormFit', 112, 78);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('Verified Image Preparation Card', 112, 102);

    // Metric 1: Savings
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 56px system-ui, sans-serif';
    const reductionLabel = `${processed.reductionPercentage}% SAVED`;
    ctx.fillText(reductionLabel, 50, 195);

    // Metrics grid
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(`${formatFileSize(original.size)}  →  ${formatFileSize(processed.size)}`, 50, 250);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText(`Dimensions: ${processed.width} × ${processed.height} px`, 50, 290);
    ctx.fillText(`Output Format: ${processed.format.replace('image/', '').toUpperCase()}`, 50, 320);

    // Footer privacy guarantee
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('✓ 100% Client-Side Privacy — Never uploaded to any server', 50, 385);

    ctx.fillStyle = '#64748B';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('formfit.app', 680, 385);

    setCardDataUrl(canvas.toDataURL('image/png'));
  }, [original.size, processed]);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // clipboard fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/compress-image?targetKb=${Math.round(
        processed.size / 1024
      )}&format=${processed.format.replace('image/', '')}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // clipboard fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FormFit — Image Preparation',
          text: summaryText,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      handleCopySummary();
    }
  };

  const handleDownloadCard = () => {
    if (!cardDataUrl) return;
    const a = document.createElement('a');
    a.href = cardDataUrl;
    a.download = `formfit_result_card_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'مشاركة النتيجة وإعدادات الأداة' : 'Share Results & Tool Preset'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'شارك النتيجة بأمان دون إرسال صورتك الشخصية'
                : 'Share verified stats privately without revealing image contents'}
            </p>
          </div>
        </div>

        {/* Card Preview */}
        {cardDataUrl && (
          <div className="rounded-xl border border-slate-200 overflow-hidden mb-4 shadow-2xs">
            <img src={cardDataUrl} alt="Result Card" className="w-full h-auto" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {copiedText ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500" />
                <span>{isAr ? 'نسخ ملخص النتيجة' : 'Copy Result Summary'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">{isAr ? 'تم نسخ الرابط!' : 'Link Copied!'}</span>
              </>
            ) : (
              <>
                <LinkIcon className="h-4 w-4 text-slate-500" />
                <span>{isAr ? 'نسخ رابط الإعدادات' : 'Copy Tool Preset Link'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadCard}
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>{isAr ? 'تحميل بطاقة النتيجة (PNG)' : 'Download Result Card'}</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 px-3 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Share2 className="h-4 w-4" />
            <span>{isAr ? 'مشاركة عبر التطبيقات' : 'Share via Device'}</span>
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          {isAr
            ? 'بطاقة النتيجة والروابط لا تحتوي على بيانات شخصية أو بكسلات صورتك.'
            : 'Result cards and links contain only verified size statistics and safe presets.'}
        </p>
      </div>
    </div>
  );
};
