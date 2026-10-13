import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { SignatureTool } from '../components/SignatureTool';
import { AdSlot } from '../components/AdSlot';
import { ADSENSE_CONFIG } from '../config/adsConfig';
import {
  PenTool,
  Lock,
  ArrowRight,
  Info,
  CheckCircle,
  FileCheck,
} from 'lucide-react';

export const SignaturePage: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Signature Resizer & Cropper for Online Forms — Free | FormFit"
        description="Crop, resize, and optimize scanned handwritten signatures for online forms, exams, and job portals. 100% private in-browser processing."
      />

      {/* Header Banner */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs mb-4">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>100% Confidential In-Browser Processing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            {t.toolSignatureTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            {t.toolSignatureSubtitle}
          </p>
        </div>
      </section>

      {/* Main Tool Area */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-white p-2 sm:p-4 shadow-xs">
          <SignatureTool />
        </div>

        {/* AdSlot */}
        <AdSlot unit={ADSENSE_CONFIG.SLOTS.BELOW_TOOL} />

        {/* Best Practices for Signature Uploads */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Tips for Preparing Scanned or Photographed Signatures
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">Tip 1</span>
              <h3 className="font-bold text-slate-800">Use clean white unlined paper</h3>
              <p className="leading-relaxed text-slate-500">
                Sign using a black or dark blue ink pen on plain white paper. Avoid lined or ruled
                paper as lines interfere with document OCR scanners.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">Tip 2</span>
              <h3 className="font-bold text-slate-800">Ensure good lighting without shadows</h3>
              <p className="leading-relaxed text-slate-500">
                If photographing your signature with a smartphone, take the photo in bright daylight
                to prevent mobile camera shadows from falling across the signature.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-blue-600 text-base">Tip 3</span>
              <h3 className="font-bold text-slate-800">Crop excess space and check limits</h3>
              <p className="leading-relaxed text-slate-500">
                Use our Auto-Detect bounds or manual crop sliders to trim empty borders. Most
                portals enforce limits like 400×150 px and under 50 KB.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
            <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
            <p>
              Requirements differ significantly between banks, government agencies, and visa
              authorities. Always check your destination portal's specific dimensions, background
              color, and file size limits before submitting.
            </p>
          </div>
        </div>

        {/* Related Tools Internal Navigation */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            Related Tools
          </h3>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/compress-image"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{t.navCompress}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/resize-image"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{t.navResize}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/convert-image"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{t.navConvert}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
