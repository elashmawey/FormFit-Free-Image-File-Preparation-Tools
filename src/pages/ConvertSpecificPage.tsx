import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { ConvertTool } from '../components/ConvertTool';
import { AdSlot } from '../components/AdSlot';
import { ADSENSE_CONFIG } from '../config/adsConfig';
import { Lock, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface ConvertSpecificPageProps {
  fromFormat: 'png' | 'jpg';
  toFormat: 'jpg' | 'webp';
}

export const ConvertSpecificPage: React.FC<ConvertSpecificPageProps> = ({
  fromFormat,
  toFormat,
}) => {
  const { lang, isRTL } = useLanguage();
  const isAr = lang === 'ar';

  const isPngToJpg = fromFormat === 'png' && toFormat === 'jpg';

  const pageTitle = isPngToJpg
    ? isAr
      ? 'تحويل PNG إلى JPG أونلاين مجاناً وبدون خادم — فورم فيت'
      : 'Convert PNG to JPG Online — Free & Clean White Background | FormFit'
    : isAr
    ? 'تحويل JPG إلى WebP أونلاين لتقليل الحجم بنسبة ٣٠٪ — فورم فيت'
    : 'Convert JPG to WebP Online — Reduce Image Size by 30% | FormFit';

  const metaDesc = isPngToJpg
    ? isAr
      ? 'حول صور PNG إلى صيغة JPG أو JPEG عالية الجودة مع خلفية بيضاء نقية للمساحات الشفافة وبدون رفع لسيرفر.'
      : 'Convert PNG images to standard JPG/JPEG with clean white background for transparent areas. 100% private in-browser conversion.'
    : isAr
    ? 'حول صور JPG إلى صيغة WebP الحديثة للحصول على ملفات أصغر حجماً وأسرع تحميلاً مع الحفاظ الكامل على الجودة.'
    : 'Convert JPG photos to modern WebP format for 25-35% smaller file sizes without visible quality loss. Free and runs in your browser.';

  const heading = isPngToJpg
    ? isAr
      ? 'تحويل صور PNG إلى JPG'
      : 'Convert PNG to JPG'
    : isAr
    ? 'تحويل صور JPG إلى WebP'
    : 'Convert JPG to WebP';

  const subtitle = isPngToJpg
    ? isAr
      ? 'تحويل فوري في المتصفح مع معالجة الشفافية بخلفية بيضاء للمواقع والبوابات الحكومية.'
      : 'Instant browser conversion preserving crisp details with clean white background handling for upload portals.'
    : isAr
    ? 'احصل على صور خفيفة وسريعة التحميل للويب والتطبيقات مع توفير كبير في البايتات.'
    : 'Modern next-gen image conversion for faster web performance and significant byte savings.';

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead title={pageTitle} description={metaDesc} />

      {/* Header Banner */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs mb-4">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>{isAr ? 'تحويل محلي آمن في المتصفح' : '100% Client-Side Conversion'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            {heading}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Tool Area */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-white p-2 sm:p-4 shadow-xs">
          <ConvertTool />
        </div>

        <AdSlot unit={ADSENSE_CONFIG.SLOTS.BELOW_TOOL} />

        {/* Informational Guidance */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {isPngToJpg
              ? isAr
                ? 'لماذا تحول من PNG إلى JPG؟'
                : 'Why Convert from PNG to JPG?'
              : isAr
              ? 'مميزات التحويل إلى صيغة WebP الحديثة'
              : 'Benefits of Converting to Modern WebP'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600">
            {isPngToJpg ? (
              <>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                  <h3 className="font-bold text-slate-800">
                    {isAr ? 'تقليل هائل في حجم الملف' : 'Significant File Size Reduction'}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {isAr
                      ? 'صور PNG غير مضغوطة تكون كبيرة جداً وتصل لعدة ميجابايتات. صيغة JPG توفر ضغطاً ذكياً يقلل الحجم بنسبة تصل إلى ٨٠٪ مع الحفاظ على وضوح الصورة.'
                      : 'Uncompressed PNGs are often several megabytes. JPG uses perceptual compression to reduce file sizes by up to 80% with minimal loss in clarity.'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                  <h3 className="font-bold text-slate-800">
                    {isAr ? 'معالجة الخلفية الشفافة' : 'Handling Transparency'}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {isAr
                      ? 'معيار JPG لا يدعم الشفافية. يقوم فورم فيت بملء المساحات الشفافة بخلفية بيضاء نظيفة لمنع تحولها للون الأسود المزعج في بوابات التقديم.'
                      : 'The JPEG standard has no alpha channel. FormFit fills transparent areas with clean pure white instead of letting pixels turn dark or black.'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                  <h3 className="font-bold text-slate-800">
                    {isAr ? 'حجم أصغر بنسبة ٣٠٪' : '25-35% Smaller Than JPEG'}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {isAr
                      ? 'تم تطوير WebP بواسطة جوجل لتقديم ضغط متفوق مقارنة بـ JPG، مما يؤدي إلى تسريع تحميل المواقع بنسبة كبيرة وتوفير مساحة التخزين.'
                      : 'Developed by Google, WebP provides superior compression compared to standard JPEGs, dramatically improving site load speeds and bandwidth.'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                  <h3 className="font-bold text-slate-800">
                    {isAr ? 'دعم الشفافية وجودة عالية' : 'Full Transparency & Wide Compatibility'}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {isAr
                      ? 'تتميز WebP بدعمها للشفافية وتوافقها التام مع جميع المتصفحات الحديثة (Chrome، Safari، Edge، Firefox).'
                      : 'WebP combines lossy compression with alpha transparency and is natively supported across all modern mobile and desktop browsers.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Related Tools Internal Navigation */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            {isAr ? 'أدوات أخرى مقترحة' : 'Related Tools'}
          </h3>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/compress-image"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{isAr ? 'ضغط الصور' : 'Compress Image'}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/batch-compress"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{isAr ? 'معالجة عدة صور' : 'Batch Processor'}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
