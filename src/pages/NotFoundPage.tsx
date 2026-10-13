import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { FileQuestion, Home, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-20 px-4 text-center">
      <SEOHead
        title="Page Not Found (404) — FormFit"
        description="The page you requested could not be found. Return to FormFit's free image preparation tools."
      />

      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 mb-6 border border-blue-100">
        <FileQuestion className="h-10 w-10" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
        {t.notFoundHeading}
      </h1>

      <p className="max-w-md text-sm text-slate-500 mb-8 leading-relaxed">
        {t.notFoundText}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>{t.btnBackHome}</span>
        </Link>
        <Link
          to="/compress-image"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span>{t.navCompress}</span>
          <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </div>
  );
};
