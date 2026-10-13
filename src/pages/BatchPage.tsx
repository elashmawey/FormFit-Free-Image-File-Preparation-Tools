import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { BatchProcessor } from '../components/BatchProcessor';
import { AdSlot } from '../components/AdSlot';
import { ADSENSE_CONFIG } from '../config/adsConfig';
import { Files, Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const BatchPage: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Batch Image Compressor & Resizer (ZIP Download) — FormFit"
        description="Compress and resize up to 10 images at once to exact KB limits. Download all prepared files in one ZIP archive. 100% private in-browser processing."
      />

      {/* Header Banner */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs mb-4">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>{isAr ? 'معالجة جماعية محلية ١٠٠٪ في المتصفح' : '100% In-Browser Batch Engine'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            {isAr ? 'معالجة وضغط عدة صور دفعة واحدة' : 'Batch Image Compressor & Resizer'}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            {isAr
              ? 'طبق حجماً موحداً وأبعاداً محددة على مجموعة صور دفعة واحدة وحملها جميعاً في ملف ZIP واحد.'
              : 'Apply unified target sizes, dimensions, and formats to multiple images at once and download as a single ZIP archive.'}
          </p>
        </div>
      </section>

      {/* Main Batch Area */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <BatchProcessor />

        <AdSlot unit={ADSENSE_CONFIG.SLOTS.BELOW_TOOL} />

        {/* Informational Guidance */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            {isAr ? 'إرشادات المعالجة الجماعية' : 'Batch Processing Guidelines'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">1</span>
              <h3 className="font-bold text-slate-800">
                {isAr ? 'حد الدفعة' : 'Batch Limit'}
              </h3>
              <p className="text-slate-500">
                {isAr
                  ? 'يمكنك معالجة حتى ١٠ صور في المرة الواحدة لضمان أداء مستقر وسريع داخل ذاكرة جهازك.'
                  : 'Process up to 10 images simultaneously to ensure fast memory performance inside your browser.'}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">2</span>
              <h3 className="font-bold text-slate-800">
                {isAr ? 'أرشيف ZIP محلي' : 'Local ZIP Generation'}
              </h3>
              <p className="text-slate-500">
                {isAr
                  ? 'يتم تجميع الأرشيف المضغوط محلياً عبر مكتبات جافاسكريبت دون أي رفع لسيرفر خارجي.'
                  : 'ZIP files are generated directly in local memory. No file is ever transmitted to a remote server.'}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">3</span>
              <h3 className="font-bold text-slate-800">
                {isAr ? 'إعادة المحاولة الفردية' : 'Individual Retries'}
              </h3>
              <p className="text-slate-500">
                {isAr
                  ? 'إذا فشل ملف لأي سبب، يمكنك إعادة محاولته منفرداً أو تحميل الملفات الناجحة فوراً.'
                  : 'If a single file fails, you can retry it individually or download the successful items immediately.'}
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools Internal Navigation */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            {isAr ? 'أدوات ذات صلة' : 'Related Tools'}
          </h3>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/compress-image"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{isAr ? 'ضغط صورة فردية' : 'Single Image Compressor'}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/smart-requirements"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{isAr ? 'مستخرج الشروط الذكي' : 'Smart Requirements Tool'}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/resize-image"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{isAr ? 'تغيير الأبعاد بالبكسل' : 'Resize Image by Pixels'}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
