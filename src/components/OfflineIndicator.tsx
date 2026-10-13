import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../i18n/LanguageContext';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { lang } = useLanguage();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md animate-bounce"
    >
      <WifiOff className="h-4 w-4" />
      <span>
        {lang === 'ar'
          ? 'وضع غير متصل بالإنترنت — المعالجة المحلية مستمرة بشكل طبيعي'
          : 'Offline Mode — Local in-browser processing continues normally'}
      </span>
    </div>
  );
};
