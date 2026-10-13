import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { SmartRequirementsSection } from '../components/SmartRequirementsSection';
import { CompressTool } from '../components/CompressTool';
import { AdSlot } from '../components/AdSlot';
import { ADSENSE_CONFIG } from '../config/adsConfig';
import { SupportedMimeType } from '../types';
import { Sparkles, Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const SmartRequirementsPage: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const isAr = lang === 'ar';

  const [appliedPreset, setAppliedPreset] = useState<{
    targetSizeKB?: number;
    width?: number;
    height?: number;
    format: SupportedMimeType;
  } | null>(null);

  const handleApply = (settings: {
    targetSizeKB?: number;
    width?: number;
    height?: number;
    format: SupportedMimeType;
  }) => {
    setAppliedPreset(settings);
    // Smooth scroll down to workspace
    const el = document.getElementById('smart-workspace');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Smart Upload Requirements Parser — Auto Configure Image Tools | FormFit"
        description="Paste instructions from job boards, visa portals, or college forms to automatically extract file size and pixel dimensions. Free, private, and local in your browser."
      />

      {/* Header Banner */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs mb-4">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>{isAr ? 'معالجة محلية داخل المتصفح' : 'Client-Side Parser & Image Engine'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            {isAr ? 'مستخرج متطلبات الرفع التلقائي' : 'Smart Upload Requirements Parser'}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            {isAr
              ? 'انسخ شروط الحجم والأبعاد من موقع التقديم وسيقوم فورم فيت باستخراجها وتجهيز الأداة تلقائياً.'
              : 'Paste upload requirements from any embassy, college, or job portal. FormFit extracts the exact constraints and sets up the tool automatically.'}
          </p>
        </div>
      </section>

      {/* Main Parser & Tool Area */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-10">
        <SmartRequirementsSection onApplySettings={handleApply} />

        <div id="smart-workspace" className="rounded-2xl bg-white p-2 sm:p-4 shadow-xs">
          <div className="mb-4 px-2">
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'مساحة العمل المجهزة' : 'Configured Image Workspace'}
            </h3>
            {appliedPreset && (
              <p className="text-xs text-emerald-700 font-medium">
                {isAr
                  ? `✓ تم تطبيق الإعدادات: ${appliedPreset.targetSizeKB ? `${appliedPreset.targetSizeKB} ك.ب` : ''} ${appliedPreset.width ? `• ${appliedPreset.width}×${appliedPreset.height} px` : ''} • صيغة ${appliedPreset.format.replace('image/', '').toUpperCase()}`
                  : `✓ Applied settings: ${appliedPreset.targetSizeKB ? `${appliedPreset.targetSizeKB} KB` : ''} ${appliedPreset.width ? `• ${appliedPreset.width}×${appliedPreset.height} px` : ''} • Format ${appliedPreset.format.replace('image/', '').toUpperCase()}`}
              </p>
            )}
          </div>
          <CompressTool appliedPreset={appliedPreset} />
        </div>

        <AdSlot unit={ADSENSE_CONFIG.SLOTS.BELOW_TOOL} />

        {/* Guidance and Common Portal Requirements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            {isAr ? 'كيف يعمل مستخرج الشروط؟' : 'How the Smart Parser Works'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">1</span>
              <h3 className="font-bold text-slate-800">
                {isAr ? 'تحليل لغوي محلي' : 'Local Rule Engine'}
              </h3>
              <p className="text-slate-500">
                {isAr
                  ? 'يستخدم الكود تعبيرات نمطية وقواعد نحوية محلية في المتصفح لاستخراج الكيلوبايتات والبكسلات والصيغ دون أي ذكاء اصطناعي خارجي أو إرسال لنصوصك.'
                  : 'Uses client-side regular expressions and keyword parsers to identify KB limits, pixel resolutions, and formats without sending text to any external server.'}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">2</span>
              <h3 className="font-bold text-slate-800">
                {isAr ? 'تأكيد وتحرير' : 'User Review & Edits'}
              </h3>
              <p className="text-slate-500">
                {isAr
                  ? 'يعرض لك القيم المستخرجة في حقول قابلة للتعديل حتى تتأكد من صحتها قبل تطبيقها.'
                  : 'Extracted parameters are shown in editable cards so you have full control to verify or adjust before processing.'}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">3</span>
              <h3 className="font-bold text-slate-800">
                {isAr ? 'تطبيق فوري' : 'Instant Preset Setup'}
              </h3>
              <p className="text-slate-500">
                {isAr
                  ? 'يتم تمرير الإعدادات مباشرة إلى أداة الضغط وتجهيز الصورة لتحميلها فوراً.'
                  : 'Applies the parameters directly to the compression canvas so your image is ready in seconds.'}
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools Internal Navigation */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            {isAr ? 'أدوات مقترحة' : 'Suggested Tools'}
          </h3>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/batch-compress"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{isAr ? 'المعالجة الجماعية لعدة صور' : 'Batch Image Processor'}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/resize-image"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{isAr ? 'تغيير الأبعاد بالبكسل' : 'Resize Image (Exact Pixels)'}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
