# Google AdSense Readiness & Setup Guide

This document explains how to activate Google AdSense on FormFit once your site has been reviewed and officially approved by Google AdSense.

## Default State
By default, all advertising is **disabled** (`ENABLED: false` in `src/config/adsConfig.ts`).
- No external ad scripts are downloaded.
- No fake ads or placeholder clickbait is displayed.
- The entire application is completely functional and clutter-free.

## How to Enable AdSense After Approval

1. **Verify Your Site in Google AdSense:**
   - Add your custom domain to your Google AdSense account console.
   - Complete Google's domain verification steps.

2. **Update the Configuration in `src/config/adsConfig.ts`:**
   ```typescript
   export const ADSENSE_CONFIG = {
     ENABLED: true,
     CLIENT_ID: "ca-pub-XXXXXXXXXXXXXXXX", // Your verified publisher ID
     TEST_MODE: false,
     SLOTS: {
       BELOW_TOOL: {
         slotId: "1234567890", // Your approved ad unit slot ID
         format: "horizontal",
         minHeight: 100,
       },
       CONTENT_FOOTER: {
         slotId: "0987654321",
         format: "auto",
         minHeight: 250,
       },
     },
   };
   ```

3. **Include the AdSense Script in `index.html`:**
   Uncomment or insert the official script tag inside `<head>` in `index.html`:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossorigin="anonymous"></script>
   ```

## Ad Placement Safety & Policy Compliance
FormFit strictly adheres to Google AdSense Quality & Policy guidelines:
- **No Deceptive Placement:** Ad slots are clearly separated from download, upload, and processing buttons.
- **No Layout Shifts:** Ad units use fixed `minHeight` reservations to maintain a Cumulative Layout Shift (CLS) near zero.
- **Never Overlap Content:** Ad units will never float over or obstruct image editing controls or output previews.
