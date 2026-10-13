# Privacy-Friendly Product Analytics Documentation

This document describes the privacy-conscious analytics architecture in FormFit.

## Default State
By default, all analytics tracking is **strictly disabled** (`ENABLED: false` in `src/utils/analytics.ts`). No remote calls are made, no cookies are stored, and no user tracking scripts are loaded.

## Event Schema (When Enabled)
The following events may be recorded in aggregate:

1. `tool_opened`: Fired when a tool page is loaded (e.g., `tool: 'compress' | 'resize' | 'convert' | 'signature' | 'batch'`).
2. `smart_requirements_parsed`: Fired when the rule-based requirements parser extracts values (records only boolean success, never user text).
3. `processing_started`: Fired when a local processing task begins.
4. `processing_succeeded`: Fired when compression or resizing completes successfully (records duration and percentage reduction; never filenames or image contents).
5. `processing_failed`: Fired when a format or constraint error occurs.
6. `download_completed`: Fired when the user clicks download for their file.
7. `batch_download_zip`: Fired when a batch ZIP archive is generated.
8. `preset_link_copied`: Fired when a shareable preset URL is copied.
9. `share_action_invoked`: Fired when Web Share or Result Card is exported.
10. `pwa_install_prompt_invoked`: Fired when PWA install button is clicked.

## Strict Data Prohibitions
- **NO Image Bytes**: Pixels, binary blobs, and file data are never inspected or transmitted.
- **NO Filenames**: User file names and personal document titles are never transmitted.
- **NO Pasted Text**: Text pasted into the Smart Requirements parser is never transmitted.
- **NO Personal Data**: No IP addresses, device identifiers, or email addresses are captured.
