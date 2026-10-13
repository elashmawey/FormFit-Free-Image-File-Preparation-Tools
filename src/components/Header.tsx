import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Globe, Menu, X, UploadCloud, Files, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, setLang, t, isRTL } = useLanguage();
  const isAr = lang === 'ar';
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t.navHome },
    { to: '/workspace', label: isAr ? 'مساحتي' : 'My Workspace' },
    { to: '/compress-image', label: t.navCompress },
    { to: '/batch-compress', label: isAr ? 'معالجة جماعية' : 'Batch Tools' },
    { to: '/resize-image', label: t.navResize },
    { to: '/convert-image', label: t.navConvert },
    { to: '/signature-resizer', label: t.navSignature },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleStartNewClick = () => {
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('formfit-start-new'));

    if (['/about', '/privacy', '/terms', '/contact'].includes(location.pathname)) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm text-white">
            <svg
              className="h-6 w-6"
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
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              {t.brandName}
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                {t.badgeLocal}
              </span>
            </span>
            <span className="hidden sm:inline text-[11px] font-medium text-slate-500">
              {t.brandTagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${
                isActive(link.to)
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* In-App PWA Install Button */}
          <PWAInstallButton />

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select Language"
              aria-expanded={langMenuOpen}
            >
              <Globe className="h-4 w-4 text-slate-500" />
              <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
            </button>

            {langMenuOpen && (
              <div
                className={`absolute ${
                  isRTL ? 'left-0' : 'right-0'
                } mt-1 w-32 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLang('en');
                    setLangMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-left ${
                    lang === 'en'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>English</span>
                  {lang === 'en' && <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang('ar');
                    setLangMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-right ${
                    lang === 'ar'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>العربية</span>
                  {lang === 'ar' && <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>}
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleStartNewClick}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>{t.btnNewImage}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-base font-medium ${
                isActive(link.to)
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <PWAInstallButton variant="banner" />
            <button
              type="button"
              onClick={handleStartNewClick}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <UploadCloud className="h-4 w-4" />
              <span>{t.btnNewImage}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
