import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { CompressTool } from '../components/CompressTool';
import { SmartRequirementsSection } from '../components/SmartRequirementsSection';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { AdSlot } from '../components/AdSlot';
import { ADSENSE_CONFIG } from '../config/adsConfig';
import { SupportedMimeType } from '../types';
import {
  Minimize2,
  Scaling,
  RefreshCw,
  PenTool,
  ArrowRight,
  HelpCircle,
  Lock,
  Upload,
  ShieldCheck,
  Files,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, lang, isRTL } = useLanguage();
  const isAr = lang === 'ar';
  const toolSectionRef = useRef<HTMLDivElement>(null);

  const [appliedPreset, setAppliedPreset] = useState<{
    targetSizeKB?: number;
    width?: number;
    height?: number;
    format: SupportedMimeType;
  } | null>(null);

  const scrollToTool = () => {
    toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplySmartRequirements = (settings: {
    targetSizeKB?: number;
    width?: number;
    height?: number;
    format: SupportedMimeType;
  }) => {
    setAppliedPreset(settings);
    scrollToTool();
  };

  const tools = [
    {
      title: t.navCompress,
      desc: t.toolCardCompressDesc,
      icon: Minimize2,
      to: '/compress-image',
      badge: t.badgePopular,
    },
    {
      title: isAr ? 'المعالجة الجماعية لعدة صور' : 'Batch Image Processor',
      desc: isAr
        ? 'طبق نفس الحجم والأبعاد على حتى ١٠ صور دفعة واحدة وحملها في أرشيف ZIP.'
        : 'Compress up to 10 images at once and download all prepared outputs in a single ZIP.',
      icon: Files,
      to: '/batch-compress',
      badge: isAr ? 'ميزة جديدة' : 'New Feature',
    },
    {
      title: t.navResize,
      desc: t.toolCardResizeDesc,
      icon: Scaling,
      to: '/resize-image',
      badge: t.badgeExactPixels,
    },
    {
      title: t.navConvert,
      desc: t.toolCardConvertDesc,
      icon: RefreshCw,
      to: '/convert-image',
      badge: t.badgeJpgPngWebp,
    },
    {
      title: t.navSignature,
      desc: t.toolCardSignatureDesc,
      icon: PenTool,
      to: '/signature-resizer',
      badge: t.badgeFormsId,
    },
    {
      title: isAr ? 'مستخرج الشروط الذكي' : 'Smart Requirements Parser',
      desc: isAr
        ? 'الصق تعليمات البوابة وسيقوم الكود باستخراج الحجم والأبعاد المطلوبة فوراً.'
        : 'Paste portal instructions to auto-detect maximum file size and pixel dimensions.',
      icon: Sparkles,
      to: '/smart-requirements',
      badge: isAr ? 'ذكي' : 'Smart',
    },
  ];

  const presets = [
    { label: '20 KB', to: '/compress-image-to-20kb' },
    { label: '50 KB', to: '/compress-image-to-50kb' },
    { label: '100 KB', to: '/compress-image-to-100kb' },
    { label: isAr ? 'دفعة صور (ZIP)' : 'Batch (ZIP)', to: '/batch-compress' },
    { label: 'PNG → JPG', to: '/convert-png-to-jpg' },
    { label: 'JPG → WebP', to: '/convert-jpg-to-webp' },
  ];

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="FormFit — Free Image & File Preparation Tools"
        description="Compress images to 20KB, 50KB, 100KB, batch process photos, resize dimensions, and parse upload requirements. 100% private, free, and runs in your browser."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Privacy Pill & Install Prompt */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
              <Lock className="h-3.5 w-3.5 text-blue-600" />
              <span>{t.heroPrivacyPill}</span>
            </div>
            <PWAInstallButton />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {t.heroHeadline}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.heroSubheadline}
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={scrollToTool}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <Upload className="h-4 w-4" />
              <span>{t.btnChooseImage}</span>
            </button>
            <Link
              to="/batch-compress"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Files className="h-4 w-4 text-blue-600" />
              <span>{isAr ? 'معالجة عدة صور' : 'Batch Processor'}</span>
            </Link>
          </div>

          {/* Quick preset links under hero */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{t.presetsLabel}</span>
            {presets.map((p) => (
              <Link
                key={p.label}
                to={p.to}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-semibold text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 1: Prominent Smart Requirements Parser Section */}
      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8 w-full">
        <SmartRequirementsSection onApplySettings={handleApplySmartRequirements} />
      </section>

      {/* Main Interactive Tool Workspace */}
      <section ref={toolSectionRef} className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-white p-2 sm:p-4 shadow-xs">
          {appliedPreset && (
            <div className="mb-4 rounded-xl bg-blue-50/70 p-3 text-xs text-blue-900 border border-blue-200 flex items-center justify-between">
              <span>
                {isAr
                  ? `تم ضبط الأداة وفق المتطلبات: ${appliedPreset.targetSizeKB ? `${appliedPreset.targetSizeKB} ك.ب` : ''} ${appliedPreset.width ? `• ${appliedPreset.width}×${appliedPreset.height} px` : ''} • ${appliedPreset.format.replace('image/', '').toUpperCase()}`
                  : `Configured to parsed requirements: ${appliedPreset.targetSizeKB ? `${appliedPreset.targetSizeKB} KB` : ''} ${appliedPreset.width ? `• ${appliedPreset.width}×${appliedPreset.height} px` : ''} • ${appliedPreset.format.replace('image/', '').toUpperCase()}`}
              </span>
              <button
                type="button"
                onClick={() => setAppliedPreset(null)}
                className="font-bold underline text-blue-700 hover:text-blue-800"
              >
                {isAr ? 'إلغاء' : 'Clear'}
              </button>
            </div>
          )}
          <CompressTool appliedPreset={appliedPreset} />
        </div>

        {/* AdSense Placement */}
        <AdSlot unit={ADSENSE_CONFIG.SLOTS.BELOW_TOOL} />
      </section>

      {/* Tools Directory Cards */}
      <section id="tools-directory" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
            <span>{isAr ? 'اختيارات فريق التحرير' : 'Editorial Selection'}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t.toolsGridHeading}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t.toolsGridSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-600">
                  <span>{t.btnOpenTool}</span>
                  <ArrowRight
                    className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${
                      isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3-Step Explanation */}
      <section className="border-y border-slate-200/80 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t.stepsHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.step1Title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{t.step1Desc}</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.step2Title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{t.step2Desc}</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.step3Title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee Banner */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 p-8 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.privacyGuaranteeHeading}
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                {t.privacyGuaranteeP1}
              </p>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                {t.privacyGuaranteeP2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t.faqHeading}</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2.5">
                <HelpCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 pl-7 rtl:pr-7 rtl:pl-0">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Ad Placement */}
      <div className="mx-auto max-w-5xl px-4 w-full">
        <AdSlot unit={ADSENSE_CONFIG.SLOTS.CONTENT_FOOTER} />
      </div>
    </div>
  );
};
