import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';
import { ShieldCheck, Lock, Zap, Download } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5 lg:gap-10">
          {/* Brand & Privacy Statement */}
          <div className="sm:col-span-2 md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">{t.brandName}</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">{t.footerTagline}</p>
            <div className="flex items-center gap-2 pt-2 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 w-fit">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{t.footerPrivacyBadge}</span>
            </div>
            <div className="pt-2">
              <PWAInstallButton variant="banner" />
            </div>
          </div>

          {/* Core Tools Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footerToolsTitle}
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/workspace" className="hover:text-blue-600 transition-colors font-bold text-blue-700">
                  {isAr ? 'مساحتي (نماذج الإعدادات)' : 'My Workspace (Profiles)'}
                </Link>
              </li>
              <li>
                <Link to="/compress-image" className="hover:text-blue-600 transition-colors">
                  {t.navCompress}
                </Link>
              </li>
              <li>
                <Link to="/batch-compress" className="hover:text-blue-600 transition-colors font-semibold text-blue-700">
                  {isAr ? 'المعالجة الجماعية (ZIP)' : 'Batch Processor (ZIP)'}
                </Link>
              </li>
              <li>
                <Link to="/smart-requirements" className="hover:text-blue-600 transition-colors text-blue-700">
                  {isAr ? 'مستخرج الشروط الذكي' : 'Smart Requirements Tool'}
                </Link>
              </li>
              <li>
                <Link to="/resize-image" className="hover:text-blue-600 transition-colors">
                  {t.navResize}
                </Link>
              </li>
              <li>
                <Link to="/signature-resizer" className="hover:text-blue-600 transition-colors">
                  {t.navSignature}
                </Link>
              </li>
            </ul>
          </div>

          {/* Size Presets */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footerPresetsTitle}
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link
                  to="/compress-image-to-20kb"
                  className="hover:text-blue-600 transition-colors"
                >
                  {t.preset20Title}
                </Link>
              </li>
              <li>
                <Link
                  to="/compress-image-to-50kb"
                  className="hover:text-blue-600 transition-colors"
                >
                  {t.preset50Title}
                </Link>
              </li>
              <li>
                <Link
                  to="/compress-image-to-100kb"
                  className="hover:text-blue-600 transition-colors"
                >
                  {t.preset100Title}
                </Link>
              </li>
            </ul>
          </div>

          {/* Conversions Directory */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {isAr ? 'تحويل الصيغ' : 'Format Tools'}
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/convert-image" className="hover:text-blue-600 transition-colors">
                  {t.navConvert}
                </Link>
              </li>
              <li>
                <Link to="/convert-png-to-jpg" className="hover:text-blue-600 transition-colors">
                  PNG → JPG
                </Link>
              </li>
              <li>
                <Link to="/convert-jpg-to-webp" className="hover:text-blue-600 transition-colors">
                  JPG → WebP
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footerCompanyTitle}
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  {t.navAbout}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                  {t.navPrivacy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 transition-colors">
                  {t.navTerms}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition-colors">
                  {t.navContact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t.footerCopyright}</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>{t.footerNoServer}</span>
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>{t.footerInstant}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
