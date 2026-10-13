import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';

export const TermsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Terms of Service — FormFit"
        description="FormFit Terms of Service: Guidelines, service availability, and user responsibilities when using our free image preparation tools."
      />

      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {t.termsHeading}
          </h1>
          <p className="mt-2 text-xs font-medium text-slate-500">{t.termsLastUpdated}</p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 w-full space-y-8 text-sm leading-relaxed text-slate-700">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>{t.termsSection1Title}</span>
            </h2>
            <p className="text-slate-600">{t.termsSection1Text}</p>
            <p className="text-slate-600">{t.termsSection1Details}</p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>{t.termsSection2Title}</span>
            </h2>
            <p className="text-slate-600">{t.termsSection2Text}</p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>{t.termsSection3Title}</span>
            </h2>
            <p className="text-slate-600">{t.termsSection3Text}</p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>{t.termsSection4Title}</span>
            </h2>
            <p className="text-slate-600">{t.termsSection4Text}</p>
          </section>
        </div>
      </main>
    </div>
  );
};
