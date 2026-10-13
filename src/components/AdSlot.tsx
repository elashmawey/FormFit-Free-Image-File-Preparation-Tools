import React, { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG, AdUnitConfig } from '../config/adsConfig';

interface AdSlotProps {
  unit: AdUnitConfig;
  className?: string;
  label?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ unit, className = '', label = 'Advertisement' }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ADSENSE_CONFIG.ENABLED || !unit.slotId || !ADSENSE_CONFIG.CLIENT_ID) {
      return;
    }

    try {
      // Safe push to adsbygoogle array if script is loaded
      const windowWithAds = window as unknown as { adsbygoogle?: unknown[] };
      if (typeof windowWithAds.adsbygoogle !== 'undefined') {
        windowWithAds.adsbygoogle.push({});
      }
    } catch {
      // Silently catch ad-block or network errors
    }
  }, [unit.slotId]);

  // When disabled by default, return nothing to avoid clutter
  if (!ADSENSE_CONFIG.ENABLED) {
    if (ADSENSE_CONFIG.TEST_MODE) {
      return (
        <aside
          aria-label={label}
          className={`w-full my-6 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-100/60 text-center text-xs text-slate-500 ${className}`}
          style={{ minHeight: `${unit.minHeight}px` }}
        >
          <div className="font-medium text-slate-600 mb-1">{label} (Placeholder - Disabled)</div>
          <div>Ad units are non-intrusively reserved and will render when enabled.</div>
        </aside>
      );
    }
    return null;
  }

  return (
    <aside
      aria-label={label}
      className={`w-full my-8 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 text-center text-xs text-slate-400 ${className}`}
      style={{ minHeight: `${unit.minHeight}px` }}
      ref={adRef}
    >
      <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">{label}</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: `${unit.minHeight - 20}px` }}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={unit.slotId}
        data-ad-format={unit.format}
        data-full-width-responsive="true"
      />
    </aside>
  );
};
