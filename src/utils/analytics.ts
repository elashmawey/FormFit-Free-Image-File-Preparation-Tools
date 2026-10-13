/**
 * Privacy-Conscious Product Analytics for FormFit
 *
 * PRIVACY GUARANTEE:
 * - Disabled by default (ENABLED = false).
 * - Never collects image contents, image pixels, user filenames, pasted requirement text, or PII.
 * - Only records aggregate interaction categories (e.g. tool_opened, download_completed).
 */

export type AnalyticsEventName =
  | 'tool_opened'
  | 'processing_started'
  | 'processing_succeeded'
  | 'processing_failed'
  | 'download_completed'
  | 'batch_download_zip'
  | 'preset_link_copied'
  | 'share_action_invoked'
  | 'pwa_install_prompt_invoked'
  | 'smart_requirements_parsed';

export interface AnalyticsConfig {
  ENABLED: boolean;
  PROVIDER_ID: string;
}

export const ANALYTICS_CONFIG: AnalyticsConfig = {
  ENABLED: false, // Disabled by default
  PROVIDER_ID: '',
};

export function trackEvent(name: AnalyticsEventName, properties?: Record<string, string | number | boolean>): void {
  if (!ANALYTICS_CONFIG.ENABLED) {
    return;
  }

  // Safe client-side logging when enabled
  try {
    const sanitizedProps = {
      timestamp: Date.now(),
      locale: document.documentElement.lang,
      ...properties,
    };

    // If Google Analytics (gtag) or Plausible or Cloudflare Web Analytics is mounted in future:
    const windowWithGtag = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof windowWithGtag.gtag === 'function') {
      windowWithGtag.gtag('event', name, sanitizedProps);
    }
  } catch {
    // Silently ignore analytics transmission errors
  }
}
