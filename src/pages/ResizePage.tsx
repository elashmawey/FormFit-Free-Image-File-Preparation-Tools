import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { ResizeTool } from '../components/ResizeTool';
import { AdSlot } from '../components/AdSlot';
import { ADSENSE_CONFIG } from '../config/adsConfig';
import {
  Scaling,
  Lock,
  ArrowRight,
  Info,
  CheckCircle,
} from 'lucide-react';

export const ResizePage: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Resize Image to Exact Pixels & Dimensions — Free | FormFit"
        description="Resize images to exact pixel widths and heights with aspect ratio preservation, center cropping, and file size limits. Free, fast, and 100% private."
      />

      {/* Header Banner */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs mb-4">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>100% Local Browser Resizing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            {t.toolResizeTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            {t.toolResizeSubtitle}
          </p>
        </div>
      </section>

      {/* Main Tool Area */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-white p-2 sm:p-4 shadow-xs">
          <ResizeTool />
        </div>

        {/* AdSlot */}
        <AdSlot unit={ADSENSE_CONFIG.SLOTS.BELOW_TOOL} />

        {/* Resizing Mode Guide */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Understanding Image Resizing Modes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs text-slate-600">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <h3 className="font-bold text-slate-800 text-sm">{t.modePreserve}</h3>
              <p className="leading-relaxed text-slate-500">
                Scales the image proportionally without distortion. Adjusting either the width or
                height automatically updates the other dimension.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <h3 className="font-bold text-slate-800 text-sm">{t.modeCrop}</h3>
              <p className="leading-relaxed text-slate-500">
                Fills the exact requested dimensions by cropping edges evenly from the center.
                Ideal for passport and profile portraits.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <h3 className="font-bold text-slate-800 text-sm">{t.modeFit}</h3>
              <p className="leading-relaxed text-slate-500">
                Maintains full image visibility by adding clean padding inside the target canvas
                box. No part of the image is cropped.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <h3 className="font-bold text-slate-800 text-sm">{t.modeStretch}</h3>
              <p className="leading-relaxed text-slate-500">
                Forces the image into exact pixel bounds. Useful when strict coordinates are
                required, though aspect ratio may change.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
            <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
            <p>
              Dimension requirements vary by agency and application. Please check your recipient
              portal instructions to ensure exact compliance.
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
              to="/convert-image"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{t.navConvert}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/signature-resizer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <span>{t.navSignature}</span>
              <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
