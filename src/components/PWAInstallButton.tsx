import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../i18n/LanguageContext';
import { Download, Smartphone, X, Share } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'footer' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { lang } = useLanguage();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide
  if (isInstalled) {
    return null;
  }

  const isAr = lang === 'ar';

  const labelInstall = isAr ? 'تثبيت التطبيق' : 'Install App';
  const labelInstallIOS = isAr ? 'تثبيت على آيفون' : 'Install on iOS';

  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          type="button"
          onClick={install}
          className={
            variant === 'header'
              ? `inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-100 transition-colors ${className}`
              : `inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all ${className}`
          }
          title={labelInstall}
        >
          <Download className="h-3.5 w-3.5" />
          <span>{labelInstall}</span>
        </button>
      )}

      {isIOS && (
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={
            variant === 'header'
              ? `inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors ${className}`
              : `inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all ${className}`
          }
        >
          <Smartphone className="h-3.5 w-3.5 text-blue-600" />
          <span>{labelInstallIOS}</span>
        </button>
      )}

      {/* iOS Guided Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <Smartphone className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'تثبيت فورم فيت على آيفون / آيباد' : 'Install FormFit on iPhone / iPad'}
            </h3>

            <ol className="mt-3 space-y-2.5 text-xs text-slate-600 leading-relaxed list-decimal list-inside">
              <li>
                {isAr ? (
                  <span>
                    انقر على زر <strong>المشاركة (Share)</strong>{' '}
                    <Share className="inline h-3.5 w-3.5 mx-1 text-blue-600" /> في شريط متصفح سفاري.
                  </span>
                ) : (
                  <span>
                    Tap the <strong>Share</strong> button{' '}
                    <Share className="inline h-3.5 w-3.5 mx-1 text-blue-600" /> in Safari’s toolbar.
                  </span>
                )}
              </li>
              <li>
                {isAr ? (
                  <span>
                    مرر لأسفل وانقر على <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
                  </span>
                ) : (
                  <span>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </span>
                )}
              </li>
              <li>
                {isAr ? (
                  <span>افتح التطبيق من شاشتك الرئيسية للوصول الفوري وبدون إنترنت.</span>
                ) : (
                  <span>Launch directly from your home screen with instant offline access.</span>
                )}
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
            >
              {isAr ? 'حسناً، فهمت' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
