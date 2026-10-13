import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Privacy Policy — FormFit"
        description="FormFit Privacy Policy: Discover how our 100% browser-side processing protects your personal images, IDs, certificates, and signatures."
      />

      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs mb-4">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>{t.privacyBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {t.privacyHeading}
          </h1>
          <p className="mt-2 text-xs font-medium text-slate-500">{t.privacyLastUpdated}</p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 w-full space-y-8 text-sm leading-relaxed text-slate-700">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>{t.privacySection1Title}</span>
            </h2>
            <p className="text-slate-600">{t.privacySection1Text}</p>
            <p className="text-slate-600">{t.privacySection1Details}</p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>{t.privacySection2Title}</span>
            </h2>
            <p className="text-slate-600">{t.privacySection2Text}</p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 pl-2">
              <li>{t.privacyItem1}</li>
              <li>{t.privacyItem2}</li>
              <li>{t.privacyItem3}</li>
              <li>{t.privacyItem4}</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>{t.privacySection3Title}</span>
            </h2>
            <p className="text-slate-600">{t.privacySection3Text}</p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>{t.privacySection4Title}</span>
            </h2>
            <p className="text-slate-600">{t.privacySection4Text}</p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>{t.privacySection5Title}</span>
            </h2>
            <p className="text-slate-600">{t.privacySection5Text}</p>
          </section>
        </div>
      </main>
    </div>
  );
};
