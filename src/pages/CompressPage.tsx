import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { CompressTool } from '../components/CompressTool';
import { AdSlot } from '../components/AdSlot';
import { ADSENSE_CONFIG } from '../config/adsConfig';
import {
  FileCheck2,
  CheckCircle,
  HelpCircle,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CompressPageProps {
  presetTargetKB?: number;
}

export const CompressPage: React.FC<CompressPageProps> = ({ presetTargetKB }) => {
  const { t, isRTL } = useLanguage();

  // Page specific details
  let title = `${t.navCompress} — FormFit`;
  let desc =
    'Compress JPG, PNG, and WebP images to exact file sizes. 100% private, free, and fast local browser processing.';
  let heading = t.toolCompressTitle;
  let subtitle = t.toolCompressSubtitle;

  if (presetTargetKB === 20) {
    title = 'Compress Image to 20 KB — Free & Fast | FormFit';
    desc =
      'Reduce image file size to strictly under 20 KB for online forms, exams, government applications, and passports. Free and runs in your browser.';
    heading = t.preset20Title;
    subtitle = t.preset20Subtitle;
  } else if (presetTargetKB === 50) {
    title = 'Compress Image to 50 KB — Free Online Tool | FormFit';
    desc =
      'Compress your image to under 50 KB without losing sharpness. Ideal for job applications, colleges, and portal uploads.';
    heading = t.preset50Title;
    subtitle = t.preset50Subtitle;
  } else if (presetTargetKB === 100) {
    title = 'Compress Image to 100 KB — Free & Private | FormFit';
    desc =
      'Fast browser compression to reduce images under 100 KB. Safe, private, and no software installation required.';
    heading = t.preset100Title;
    subtitle = t.preset100Subtitle;
  }

  const relatedTools = [
    { label: t.preset20Title, to: '/compress-image-to-20kb' },
    { label: t.preset50Title, to: '/compress-image-to-50kb' },
    { label: t.preset100Title, to: '/compress-image-to-100kb' },
    { label: t.navResize, to: '/resize-image' },
    { label: t.navConvert, to: '/convert-image' },
    { label: t.navSignature, to: '/signature-resizer' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead title={title} description={desc} />

      {/* Header Banner */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs mb-4">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>100% Local Browser Compression</span>
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
          <CompressTool initialTargetKB={presetTargetKB} standalone={true} />
        </div>

        {/* AdSense slot */}
        <AdSlot unit={ADSENSE_CONFIG.SLOTS.BELOW_TOOL} />

        {/* Instructions & Guidelines */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            How to Prepare Images Under {presetTargetKB ? `${presetTargetKB} KB` : 'Target Size'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">Step 1</span>
              <h3 className="font-bold text-slate-800">Upload your source photo</h3>
              <p className="leading-relaxed text-slate-500">
                Select your photo from your phone or computer. The file is validated locally and
                never uploaded to a remote server.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">Step 2</span>
              <h3 className="font-bold text-slate-800">Automatic iterative compression</h3>
              <p className="leading-relaxed text-slate-500">
                FormFit searches for the optimal quality level using Canvas encoding. If the photo
                has very high pixel resolution, enable auto-downscaling to guarantee the target size
                is reached.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">Step 3</span>
              <h3 className="font-bold text-slate-800">Review & Download</h3>
              <p className="leading-relaxed text-slate-500">
                Compare the original and optimized result side by side, verify the exact byte size,
                and download the file immediately.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
            <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
            <p>
              Requirements vary across portals. FormFit does not fabricate compliance claims. Always
              consult the destination portal or examination board rules for dimensions and
              background colors.
            </p>
          </div>
        </div>

        {/* Related Tools Internal Navigation */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            Related Image Preparation Tools
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {relatedTools.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-2xs"
              >
                <span>{tool.label}</span>
                <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
