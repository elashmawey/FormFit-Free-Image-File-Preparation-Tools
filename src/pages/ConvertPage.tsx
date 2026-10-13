import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { ConvertTool } from '../components/ConvertTool';
import { AdSlot } from '../components/AdSlot';
import { ADSENSE_CONFIG } from '../config/adsConfig';
import {
  RefreshCw,
  Lock,
  ArrowRight,
  Info,
  CheckCircle,
} from 'lucide-react';

export const ConvertPage: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Convert Image Format: JPG, PNG, WebP — Free & Private | FormFit"
        description="Convert images between JPG, PNG, and WebP in seconds. 100% private in-browser conversion with transparency support. No file upload required."
      />

      {/* Header Banner */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs mb-4">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>100% Client-Side Conversion</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            {t.toolConvertTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            {t.toolConvertSubtitle}
          </p>
        </div>
      </section>

      {/* Main Tool Area */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-white p-2 sm:p-4 shadow-xs">
          <ConvertTool />
        </div>

        {/* AdSlot */}
        <AdSlot unit={ADSENSE_CONFIG.SLOTS.BELOW_TOOL} />

        {/* Format Comparison Information */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            When to Use Each Image Format
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
              <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                JPG / JPEG
              </span>
              <h3 className="font-bold text-slate-800">Standard Photos & Portals</h3>
              <p className="leading-relaxed text-slate-500 text-xs">
                The most universally accepted format across government, visa, university, and job
                submission portals. Does not support transparent backgrounds.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
              <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                PNG
              </span>
              <h3 className="font-bold text-slate-800">Graphics, Text & Transparency</h3>
              <p className="leading-relaxed text-slate-500 text-xs">
                Lossless encoding preserving pixel-perfect sharpness. Excellent for logos,
                scanned signatures, and transparent graphics. Resulting file size is typically larger.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
              <span className="inline-block rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">
                WebP
              </span>
              <h3 className="font-bold text-slate-800">Modern Web Performance</h3>
              <p className="leading-relaxed text-slate-500 text-xs">
                Combines high lossy compression with alpha transparency support. Produces 25-35%
                smaller files than comparable JPEGs.
              </p>
            </div>
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
