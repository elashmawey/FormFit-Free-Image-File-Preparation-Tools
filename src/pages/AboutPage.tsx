import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { Cpu, Lock, ArrowRight, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="About FormFit — Free, Fast & Private Image Tools"
        description="Learn about FormFit mission: delivering completely free, private client-side image compression, resizing, and format conversion without server uploads."
      />

      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {t.aboutHeading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.aboutMission}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 w-full space-y-12">
        {/* Core Principles */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{t.aboutP1Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.aboutP1Text}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{t.aboutP2Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.aboutP2Text}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-4">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{t.aboutP3Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.aboutP3Text}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-2xs space-y-4 text-sm leading-relaxed text-slate-700">
          <h2 className="text-xl font-bold text-slate-900">{t.aboutStoryTitle}</h2>
          <p>{t.aboutStoryP1}</p>
          <p>{t.aboutStoryP2}</p>
          <p>{t.aboutStoryP3}</p>

          <div className="pt-4 flex items-center gap-3">
            <Link
              to="/compress-image"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <span>{t.btnExploreTools}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
