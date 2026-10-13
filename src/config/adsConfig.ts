/**
 * Google AdSense Configuration for FormFit
 *
 * IMPORTANT:
 * - Advertising is strictly DISABLED by default (ENABLED = false).
 * - Never insert unverified publisher IDs or unauthorized third-party scripts.
 * - To enable advertising after obtaining official approval:
 *   1. Set ENABLED to true.
 *   2. Supply your verified client ID (e.g., 'ca-pub-XXXXXXXXXXXXXXXX').
 *   3. Configure approved responsive ad unit slot IDs.
 *   4. Ad slots are kept cleanly separated below tools to prevent accidental clicks.
 */

export interface AdUnitConfig {
  slotId: string;
  format: 'auto' | 'horizontal' | 'rectangle';
  minHeight: number;
}

export interface AdsenseSettings {
  ENABLED: boolean;
  CLIENT_ID: string;
  TEST_MODE: boolean;
  SLOTS: {
    BELOW_TOOL: AdUnitConfig;
    CONTENT_FOOTER: AdUnitConfig;
  };
}

export const ADSENSE_CONFIG: AdsenseSettings = {
  // Disabled by default
  ENABLED: false,

  // Leave empty until officially approved by Google AdSense
  CLIENT_ID: '',

  // In test mode, displays a clean reserved placeholder frame
  TEST_MODE: false,

  SLOTS: {
    BELOW_TOOL: {
      slotId: '',
      format: 'horizontal',
      minHeight: 100,
    },
    CONTENT_FOOTER: {
      slotId: '',
      format: 'auto',
      minHeight: 250,
    },
  },
};
