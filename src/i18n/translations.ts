export const translations = {
  en: {
    // Brand & Header
    brandName: 'FormFit',
    brandTagline: 'Free Image & File Preparation Tools',
    badgeLocal: '100% Local',
    navHome: 'Home',
    navCompress: 'Compress Image',
    navResize: 'Resize Image',
    navConvert: 'Convert Image',
    navSignature: 'Signature Resizer',
    navAbout: 'About',
    navPrivacy: 'Privacy',
    navTerms: 'Terms',
    navContact: 'Contact',
    btnNewImage: 'New Image',
    btnChooseImage: 'Choose an Image',
    btnExploreTools: 'Explore All Tools',
    languageName: 'English',

    // Hero
    heroHeadline: 'Make Any Image Ready to Upload',
    heroSubheadline:
      'Compress, resize, and convert images to meet file requirements in seconds. Free, private, and easy to use.',
    heroPrivacyPill: '100% Private — Runs completely in your browser',

    // Drag and Drop
    dropZoneTitle: 'Drag & drop your image here',
    dropZoneSubtitle: 'or click to browse from your device',
    dropZoneHint: 'Supports JPG, PNG, and WebP up to 20 MB',
    dropZoneNeverUploaded: 'Never uploaded to server',
    dropZoneInvalidType: 'Unsupported file type. Please select a JPEG, PNG, or WebP image.',
    dropZoneOversized: 'File exceeds 20 MB limit. Please select a smaller image.',

    // Tool Modes & Titles
    toolCompressTitle: 'Compress Image',
    toolCompressSubtitle: 'Reduce file size to meet exact website and portal requirements.',
    toolResizeTitle: 'Resize Image',
    toolResizeSubtitle: 'Change dimensions to exact pixels or standard aspect ratios.',
    toolConvertTitle: 'Convert Image Format',
    toolConvertSubtitle: 'Switch between JPG, PNG, and WebP while preserving quality.',
    toolSignatureTitle: 'Signature Resizer',
    toolSignatureSubtitle: 'Crop and optimize scanned or photographed signatures for online forms.',

    // Preset Routes Headings
    preset20Title: 'Compress Image to 20 KB',
    preset20Subtitle: 'Instantly prepare photos under 20 KB for government, exam, and job portals.',
    preset50Title: 'Compress Image to 50 KB',
    preset50Subtitle: 'Fast browser compression for online forms requiring files under 50 KB.',
    preset100Title: 'Compress Image to 100 KB',
    preset100Subtitle: 'Reduce your image file size to strictly under 100 KB without server uploads.',

    // Presets & Options
    presetsLabel: 'Popular Size Presets:',
    presetCustom: 'Custom Size',
    targetSizeLabel: 'Target Maximum File Size (KB)',
    targetSizePlaceholder: 'e.g. 50',
    targetSizeOptional: 'Target Maximum File Size (Optional)',
    targetSizeOptionalHint: 'e.g. 50 (leave empty for unconstrained size)',
    noTargetNote: 'Leave empty to compress using quality slider only',
    autoDownscaleLabel: 'Auto-reduce dimensions if quality alone cannot reach target size',
    autoDownscaleHelp:
      'Recommended for small targets (e.g. 20 KB - 50 KB) where high-megapixel photos must be downscaled to fit.',
    optimizedForTargetNote: 'Automatically optimized to reach target KB',

    // Format & Quality Controls
    outputFormatLabel: 'Output Format',
    qualityLabel: 'Image Quality',
    qualityHint: 'Lower quality reduces file size; higher quality preserves fine details.',
    preserveTransparencyLabel: 'Preserve Transparency',
    jpegTransparencyWarning:
      'Note: JPEG format does not support transparency. Transparent areas will be rendered on a clean white background.',
    formatJpegDesc: 'JPG / JPEG (Best for photos & portal uploads)',
    formatWebpDesc: 'WebP (Modern, compact & supports transparency)',
    formatPngDesc: 'PNG (Lossless, sharp graphics & full transparency)',

    // Convert Page Cards
    convertJpgTitle: 'JPG / JPEG',
    convertJpgDesc: 'Universal compatibility, great for real-world photos & forms',
    convertPngTitle: 'PNG',
    convertPngDesc: 'Lossless quality with full transparency support',
    convertWebpTitle: 'WebP',
    convertWebpDesc: 'Modern web standard, up to 30% smaller with transparency',

    // Resize Controls
    widthLabel: 'Width (px)',
    heightLabel: 'Height (px)',
    resizeModeLabel: 'Resize Mode',
    modePreserve: 'Preserve Aspect Ratio (Proportional)',
    modeCrop: 'Crop to Fill (Center Crop)',
    modeFit: 'Fit within Bounds (Pad Canvas)',
    modeStretch: 'Exact Dimensions (Stretch to Fit)',
    dimensionPresetsLabel: 'Common Dimension Presets:',
    presetPassport: 'Square / ID (600 × 600)',
    presetApplication: 'Portrait (400 × 514)',
    presetBanner: 'Landscape (1200 × 630)',
    presetThumbnail: 'Thumbnail (300 × 300)',
    aspectLocked: 'Locked',
    aspectFree: 'Free',

    // Signature Controls
    sigCropTitle: 'Signature Cropping & Margin Trim',
    sigCropHint: 'Trim empty borders and enhance ink contrast for online document upload.',
    btnAutoDetectBounds: 'Auto-Detect Ink Bounds',
    btnResetCrop: 'Reset Crop to Full Image',
    enhanceContrastLabel: 'Enhance Ink Contrast (darken handwriting, clean faint paper noise)',
    sigPresetsLabel: 'Common Signature Dimensions:',
    sigPresetSmall: 'Small (300 × 100 px)',
    sigPresetMedium: 'Standard (400 × 150 px)',
    sigPresetLarge: 'Large (600 × 200 px)',
    sigCropLeft: 'Left Margin',
    sigCropRight: 'Right Margin',
    sigCropTop: 'Top Margin',
    sigCropBottom: 'Bottom Margin',
    sigPortalAdvisory:
      'Signature specifications (dimensions, file size, background color) vary depending on your destination portal. Always verify recipient rules.',
    sigFormatJpegNote: 'JPG / JPEG (Clean white background)',
    sigFormatPngNote: 'PNG (Preserves transparent background if original has transparency)',
    sigFormatWebpNote: 'WebP (Modern compact format)',
    sigAiBgNote: 'Note: AI background removal is not included; paper contrast enhancement is applied locally.',

    // Processing & Actions
    btnProcessImage: 'Process Image',
    btnProcessing: 'Processing in browser...',
    btnDownload: 'Download Ready File',
    btnProcessAnother: 'Process Another File',
    btnReset: 'Reset Workspace',

    // Comparison & Results
    resultsTitle: 'Optimized Image Ready',
    originalImage: 'Original Image',
    optimizedImage: 'Optimized Result',
    viewSideBySide: 'Side by Side',
    fileSize: 'File Size',
    dimensions: 'Dimensions',
    format: 'Format',
    sizeReduction: 'Saved',
    qualityApplied: 'Quality Applied',
    scaleApplied: 'Scale Factor',
    targetMet: 'Target Met',
    bytesSaved: 'saved',
    fileExpanded: 'File expanded slightly',
    losslessLabel: 'Lossless',
    qualityPrefix: 'Q',
    targetExceededWarning:
      'Notice: Output size slightly exceeds target. Try enabling auto-dimension reduction or selecting a slightly higher target.',
    fileLargerWarning:
      'Notice: The output file is larger than the original. The input may already be heavily compressed.',

    // 3-Step Guide
    stepsHeading: 'How FormFit Works in 3 Simple Steps',
    step1Title: '1. Select Your Image',
    step1Desc: 'Drag and drop or select your photo from your phone or computer. Nothing is ever sent to a server.',
    step2Title: '2. Adjust Size & Dimensions',
    step2Desc: 'Pick a file-size target (like 20 KB or 50 KB), enter required pixel dimensions, or select your preferred format.',
    step3Title: '3. Download & Upload',
    step3Desc: 'Preview the crisp result instantly and download it ready to submit to your application or form.',

    // Tools Grid
    toolsGridHeading: 'All Image Preparation Utilities',
    toolsGridSubheading: 'Select a specialized tool tailored for your specific application or upload requirement.',
    toolCardCompressDesc:
      'Iteratively optimize JPEG, PNG, or WebP files to meet strict portal limits like 20 KB, 50 KB, or 100 KB.',
    toolCardResizeDesc:
      'Set exact pixel widths and heights with aspect ratio preservation, center cropping, or containment.',
    toolCardConvertDesc:
      'Instantly change image format between JPG, PNG, and WebP with zero quality degradation and transparency handling.',
    toolCardSignatureDesc:
      'Crop scanned or photographed signatures, remove dirty borders, darken ink, and resize for document signing.',
    btnOpenTool: 'Open Tool',
    badgePopular: 'Popular',
    badgeExactPixels: 'Exact Pixels',
    badgeJpgPngWebp: 'JPG, PNG, WebP',
    badgeFormsId: 'Forms & ID',

    // Privacy Section
    privacyGuaranteeHeading: '100% Client-Side Privacy Guarantee',
    privacyGuaranteeP1:
      'At FormFit, your images never leave your computer or phone. All image compression, pixel resizing, and format conversions execute entirely inside your web browser using HTML5 Canvas APIs.',
    privacyGuaranteeP2:
      'No server uploads. No cloud storage. No data logging. No tracking cookies. Your personal photos, identity cards, certificates, and signatures remain strictly confidential.',

    // FAQ Section
    faqHeading: 'Frequently Asked Questions',
    faqQ1: 'Why do application portals have strict file size limits (like 20 KB or 50 KB)?',
    faqA1:
      'Many government, university, visa, and job portals process millions of submissions. Storing and scanning massive multi-megabyte images strains their servers, so they enforce strict limits like 20 KB, 50 KB, or 100 KB.',
    faqQ2: 'Does FormFit upload my images to any server?',
    faqA2:
      'No. Unlike conventional online converters, FormFit does 100% of the image processing locally inside your web browser using client-side JavaScript and Canvas. Your files are never transmitted across the network.',
    faqQ3: 'What should I do if an image cannot reach 20 KB without looking blurry?',
    faqA3:
      'High-resolution photos from modern smartphones contain millions of pixels. To fit within 20 KB, you must reduce the image dimensions (for example, to 400x500 pixels). FormFit includes an automatic downscaling feature to achieve this automatically.',
    faqQ4: 'Does JPEG support transparent backgrounds?',
    faqA4:
      'No. The JPEG specification does not support an alpha transparency channel. If you convert a transparent PNG to JPEG, FormFit automatically fills the background with a clean white color rather than letting it turn black.',
    faqQ5: 'Can I use FormFit on mobile phones and tablets?',
    faqA5:
      'Yes. FormFit is fully responsive and works smoothly on mobile browsers (iOS Safari, Android Chrome, and others) without installing any mobile application.',

    // Trust & Information Pages
    aboutHeading: 'About FormFit',
    aboutMission:
      'FormFit was built to solve a universal frustration: uploading photos, signatures, and documents to websites that reject files for being a few kilobytes too large or having the wrong dimensions.',
    aboutBuiltWith:
      'Engineered with modern browser APIs, FormFit proves that fast, professional utility tools can exist without collecting user data or charging subscription fees.',
    aboutP1Title: '100% In-Browser Engine',
    aboutP1Text:
      'We leverage HTML5 Canvas, typed arrays, and modern browser blob APIs to perform all transformations directly on your device. Your files never leave your computer or phone.',
    aboutP2Title: 'Zero Tracking or Accounts',
    aboutP2Text:
      'No registration forms, no logins, no credit card prompts, and no telemetry tracking. You open the page, get your image ready, download it, and continue with your day.',
    aboutP3Title: 'Accurate Results',
    aboutP3Text:
      'We never report approximate or simulated file sizes. The measurements displayed are verified from the actual generated output blobs before download.',
    aboutStoryTitle: 'Why We Created FormFit',
    aboutStoryP1:
      'Whether applying for a government job, submitting an immigration passport photo, registering for university entrance exams, or uploading a digital signature for an online contract, users around the world face arbitrary upload barriers.',
    aboutStoryP2:
      'Often, websites require an image to be strictly under 50 KB or 20 KB, while modern smartphones capture images that are 5 MB to 12 MB in size. Many online utility tools either charge fees, upload sensitive personal documents to third-party servers, or distort image proportions.',
    aboutStoryP3:
      'FormFit was created to provide a dependable, fast, and completely confidential solution accessible to anyone across the globe.',

    privacyHeading: 'Privacy Policy',
    privacyLastUpdated: 'Last Updated: October 2026',
    privacyBadge: 'Strict Client-Side Guarantee',
    privacySection1Title: 'Local Browser Processing',
    privacySection1Text:
      'All image processing, including compression, resizing, cropping, and format conversion, is performed strictly on your local device within your browser session. Files are never uploaded to any remote server.',
    privacySection1Details:
      'When you select a photo on FormFit, the file is read directly into your browser local memory using HTML5 FileReader and Canvas APIs. The processing code executes purely on your computer or smartphone. At no point is your image binary uploaded or transferred across the Internet.',
    privacySection2Title: 'Information We Do Not Collect',
    privacySection2Text:
      'We do not require user accounts, passwords, email addresses, or payment details. We do not store, view, or transmit any image files you process.',
    privacyItem1: 'No personal information (names, emails, physical addresses, phone numbers).',
    privacyItem2: 'No images, passport photos, signature scans, or processed files.',
    privacyItem3: 'No payment card details or billing credentials.',
    privacyItem4: 'No behavioral tracking cookies.',
    privacySection3Title: 'Temporary Memory & Resource Management',
    privacySection3Text:
      'Temporary image representations are held in memory as browser Blob URLs while you perform edits. When you reset the tool, upload another image, or close the browser tab, all memory references are revoked and cleared by your browser garbage collector.',
    privacySection4Title: 'Third-Party Services & Potential Future Advertising',
    privacySection4Text:
      'FormFit currently does not run third-party advertising scripts. In the future, if advertising is introduced (such as Google AdSense), standard cookie policies and transparent notice will apply in accordance with Google publisher guidelines.',
    privacySection5Title: 'Contact Regarding Privacy',
    privacySection5Text:
      'If you have any questions or security inquiries about FormFit architecture, you may contact us at privacy@formfit.app.',

    termsHeading: 'Terms of Service',
    termsLastUpdated: 'Last Updated: October 2026',
    termsSection1Title: 'Use of Free Utility Tools',
    termsSection1Text:
      'FormFit is provided free of charge for personal and professional image preparation. Tools are provided on an "as-is" basis.',
    termsSection1Details:
      'FormFit grants you a personal, non-exclusive, non-transferable license to access and utilize our browser-based image preparation utilities for personal, educational, and commercial workflows without charge.',
    termsSection2Title: 'Destination Portal Responsibility',
    termsSection2Text:
      'Application portals, government immigration departments, university admission boards, and examination authorities regularly update their exact submission rules. You are solely responsible for verifying that your generated file complies with all guidelines (such as background color, facial proportion, lighting, dpi, and maximum dimensions) required by your recipient before final submission.',
    termsSection3Title: 'Disclaimer of Warranties',
    termsSection3Text:
      'The services are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. While FormFit strives for accurate pixel processing and byte-level encoding, we do not warrant that the service will be error-free or uninterrupted.',
    termsSection4Title: 'Acceptable Use',
    termsSection4Text:
      'You agree not to use the application to process unlawful materials or attempt to disrupt the service or website infrastructure.',

    contactHeading: 'Contact FormFit',
    contactSubheading:
      'Have questions, feedback, or a tool request? Reach out to our team.',
    contactEmailNote:
      'You can email our engineering and support team directly at:',
    contactDirectEmail: 'support@formfit.app',
    contactFormTitle: 'Send a Message',
    contactNameLabel: 'Your Name',
    contactSubjectLabel: 'Subject',
    contactEmailLabel: 'Your Email',
    contactMessageLabel: 'Message or Feedback',
    contactSendBtn: 'Send Message via Email Client',
    contactFormNotice:
      'FormFit operates 100% locally in your browser without a tracking backend. Clicking "Send Message" will open your email application pre-addressed to support@formfit.app.',

    // AdSense Section
    adPlaceholderTitle: 'Sponsor Advertisement Area',
    adPlaceholderNotice:
      'Advertisements are currently disabled. Clean, non-intrusive ad placements can be configured here once approved.',

    // 404
    notFoundHeading: 'Page Not Found (404)',
    notFoundText: 'The tool or page you requested does not exist or has been moved.',
    btnBackHome: 'Back to FormFit Home',

    // Footer
    footerTagline: 'Free, fast, and private browser-based image preparation tools.',
    footerToolsTitle: 'Image Tools',
    footerPresetsTitle: 'Popular Presets',
    footerCompanyTitle: 'FormFit',
    footerCopyright: '© 2026 FormFit. All rights reserved. 100% client-side privacy.',
    footerPrivacyBadge: '100% Client-Side Privacy Guaranteed',
    footerNoServer: 'Zero Server Transmission',
    footerInstant: 'Instant Processing',
  },

  ar: {
    // Brand & Header
    brandName: 'فورم فيت',
    brandTagline: 'أدوات مجانية لتجهيز وضغط الصور والملفات',
    badgeLocal: 'محلي ١٠٠٪',
    navHome: 'الرئيسية',
    navCompress: 'ضغط الصور',
    navResize: 'تغيير الأبعاد',
    navConvert: 'تحويل الصيغة',
    navSignature: 'تجهيز التوقيع',
    navAbout: 'عن الأداة',
    navPrivacy: 'الخصوصية',
    navTerms: 'الشروط',
    navContact: 'اتصل بنا',
    btnNewImage: 'صورة جديدة',
    btnChooseImage: 'اختر صورة للبدء',
    btnExploreTools: 'استكشف جميع الأدوات',
    languageName: 'العربية',

    // Hero
    heroHeadline: 'جهّز أي صورة للرفع في ثوانٍ',
    heroSubheadline:
      'اضغط، غيّر أبعاد، وحوّل صيغ الصور لتلائم متطلبات المواقع والتقديمات الإلكترونية. مجاني، آمن، وسريع.',
    heroPrivacyPill: 'خصوصية ١٠٠٪ — تتم المعالجة بالكامل داخل متصفحك',

    // Drag and Drop
    dropZoneTitle: 'اسحب وأفلت صورتك هنا',
    dropZoneSubtitle: 'أو انقر للتصفح من جهازك',
    dropZoneHint: 'يدعم صور JPG و PNG و WebP بحجم يصل إلى ٢٠ ميجابايت',
    dropZoneNeverUploaded: 'لا يتم الرفع لأي خادم أبداً',
    dropZoneInvalidType: 'صيغة ملف غير مدعومة. يرجى اختيار صورة بصيغة JPEG أو PNG أو WebP.',
    dropZoneOversized: 'حجم الملف يتجاوز الحد الأقصى (٢٠ ميجابايت). يرجى اختيار صورة أصغر.',

    // Tool Modes & Titles
    toolCompressTitle: 'ضغط الصور بدقة',
    toolCompressSubtitle: 'قلل حجم الملف بالكيلوبايت ليلائم متطلبات البوابات الحكومية والتقديمات.',
    toolResizeTitle: 'تغيير أبعاد الصورة',
    toolResizeSubtitle: 'عدّل العرض والارتفاع بالبكسل بدقة مع الحفاظ على التناسب أو القص.',
    toolConvertTitle: 'تحويل صيغة الصور',
    toolConvertSubtitle: 'تحويل سلس بين JPG و PNG و WebP مع الحفاظ على أعلى جودة.',
    toolSignatureTitle: 'تجهيز وتعديل التوقيع',
    toolSignatureSubtitle: 'قص المساحات الفارغة وتحسين تباين التوقيعات الممسوحة ضوئياً.',

    // Preset Routes Headings
    preset20Title: 'ضغط الصورة حتى ٢٠ كيلوبايت',
    preset20Subtitle: 'جهّز صورك فوراً بحجم أقل من ٢٠ ك.ب للبوابات الحكومية واستمارات الامتحانات.',
    preset50Title: 'ضغط الصورة حتى ٥٠ كيلوبايت',
    preset50Subtitle: 'ضغط فوري في المتصفح للاستمارات التي تشترط حجماً أقل من ٥٠ ك.ب.',
    preset100Title: 'ضغط الصورة حتى ١٠٠ كيلوبايت',
    preset100Subtitle: 'قلل حجم الصورة بدقة لتكون أقل من ١٠٠ ك.ب بأمان تام دون رفع لسيرفر.',

    // Presets & Options
    presetsLabel: 'أحجام شائعة سريعة:',
    presetCustom: 'حجم مخصص',
    targetSizeLabel: 'الحد الأقصى لحجم الملف المستهدف (كيلوبايت)',
    targetSizePlaceholder: 'مثال: 50',
    targetSizeOptional: 'الحد الأقصى لحجم الملف (اختياري)',
    targetSizeOptionalHint: 'مثال: 50 (اتركه فارغاً للحجم الحر)',
    noTargetNote: 'اتركه فارغاً للضغط باستخدام شريط الجودة فقط',
    autoDownscaleLabel: 'تقليل الأبعاد تلقائياً إذا تعذر الوصول للحجم المستهدف بالجودة وحدها',
    autoDownscaleHelp:
      'مستحسن للأحجام الصغيرة جداً (مثل ٢٠ أو ٥٠ ك.ب) حيث تتطلب الصور عالية الدقة تصغير الأبعاد لتلائم الحجم.',
    optimizedForTargetNote: 'تم ضبط الجودة تلقائياً لبلوغ الحجم المستهدف',

    // Format & Quality Controls
    outputFormatLabel: 'صيغة الحفظ الناتجة',
    qualityLabel: 'جودة الصورة',
    qualityHint: 'تقليل الجودة يقلل حجم الملف، ورفع الجودة يحافظ على أدق التفاصيل.',
    preserveTransparencyLabel: 'الحفاظ على الشفافية',
    jpegTransparencyWarning:
      'تنبيه: صيغة JPEG لا تدعم الشفافية. سيتم استبدال المساحات الشفافة بخلفية بيضاء نظيفة.',
    formatJpegDesc: 'JPG / JPEG (الأفضل للصور الشخصية والتقديمات)',
    formatWebpDesc: 'WebP (حديث، خفيف ويدعم الشفافية)',
    formatPngDesc: 'PNG (جودة عديمة الفقد، دقة عالية للرسومات والشفافية)',

    // Convert Page Cards
    convertJpgTitle: 'JPG / JPEG',
    convertJpgDesc: 'توافق شامل، ممتاز للصور الفوتوغرافية واستمارات التقديم',
    convertPngTitle: 'PNG',
    convertPngDesc: 'جودة عديمة الفقد مع دعم كامل للشفافية',
    convertWebpTitle: 'WebP',
    convertWebpDesc: 'معيار ويب حديث، أخف بنسبة ٣٠٪ ويدعم الشفافية',

    // Resize Controls
    widthLabel: 'العرض (بكسل)',
    heightLabel: 'الارتفاع (بكسل)',
    resizeModeLabel: 'طريقة تغيير الحجم',
    modePreserve: 'الحفاظ على التناسب (تناسبي)',
    modeCrop: 'قص للملء (قص الوسط)',
    modeFit: 'احتواء داخل الإطار (حشو الخلفية)',
    modeStretch: 'أبعاد محددة تماماً (تمديد)',
    dimensionPresetsLabel: 'أبعاد شائعة:',
    presetPassport: 'صورة شخصية / جواز (600 × 600)',
    presetApplication: 'استمارة تقديم (400 × 514)',
    presetBanner: 'غلاف عريض (1200 × 630)',
    presetThumbnail: 'صورة مصغرة (300 × 300)',
    aspectLocked: 'مقفل',
    aspectFree: 'حر',

    // Signature Controls
    sigCropTitle: 'قص وتحسين التوقيع',
    sigCropHint: 'قص الحواف الزائدة وتوضيح حبر التوقيع للتقديمات والمستندات الرسمية.',
    btnAutoDetectBounds: 'اكتشاف حدود التوقيع تلقائياً',
    btnResetCrop: 'استعادة الصورة كاملة',
    enhanceContrastLabel: 'تحسين تباين الحبر (تغميق خط اليد وتنظيف خلفية الورقة)',
    sigPresetsLabel: 'أبعاد توقيع شائعة:',
    sigPresetSmall: 'صغير (300 × 100 بكسل)',
    sigPresetMedium: 'قياسي (400 × 150 بكسل)',
    sigPresetLarge: 'كبير (600 × 200 بكسل)',
    sigCropLeft: 'الهامش الأيسر',
    sigCropRight: 'الهامش الأيمن',
    sigCropTop: 'الهامش العلوي',
    sigCropBottom: 'الهامش السفلي',
    sigPortalAdvisory:
      'تختلف متطلبات التوقيع (الأبعاد، الحجم، لون الخلفية) بحسب الجهة المستهدفة. احرص دائماً على مراجعة شروط البوابة.',
    sigFormatJpegNote: 'JPG / JPEG (خلفية بيضاء نظيفة)',
    sigFormatPngNote: 'PNG (يحافظ على الشفافية إن كانت الصورة الأصلية تحتوي عليها)',
    sigFormatWebpNote: 'WebP (صيغة حديثة مضغوطة)',
    sigAiBgNote: 'ملاحظة: إزالة الخلفيات بالذكاء الاصطناعي غير مفعلة، بل يتم تحسين تباين الحبر محلياً.',

    // Processing & Actions
    btnProcessImage: 'معالجة الصورة',
    btnProcessing: 'جارٍ المعالجة في المتصفح...',
    btnDownload: 'تحميل الملف الجاهز',
    btnProcessAnother: 'معالجة ملف آخر',
    btnReset: 'إعادة ضبط مساحة العمل',

    // Comparison & Results
    resultsTitle: 'تم تجهيز الصورة بنجاح',
    originalImage: 'الصورة الأصلية',
    optimizedImage: 'النتيجة المحسّنة',
    viewSideBySide: 'جنباً إلى جنب',
    fileSize: 'حجم الملف',
    dimensions: 'الأبعاد',
    format: 'الصيغة',
    sizeReduction: 'الموفَّر',
    qualityApplied: 'الجودة المطبقة',
    scaleApplied: 'معامل التصغير',
    targetMet: 'الحجم محقق',
    bytesSaved: 'تم توفيرها',
    fileExpanded: 'زاد حجم الملف قليلاً',
    losslessLabel: 'بدون فقد (Lossless)',
    qualityPrefix: 'جودة',
    targetExceededWarning:
      'ملاحظة: حجم النتيجة أعلى قليلاً من المستهدف. فعّل خيار تصغير الأبعاد التلقائي أو اختر حجماً أكبر.',
    fileLargerWarning:
      'ملاحظة: حجم الملف الناتج أكبر من الأصل، قد تكون الصورة الأصلية مضغوطة مسبقاً بشكل كبير.',

    // 3-Step Guide
    stepsHeading: 'كيف يعمل فورم فيت في ٣ خطوات بسيطة',
    step1Title: '١. اختر صورتك',
    step1Desc: 'اسحب صورتك أو اخترها من هاتفك أو حاسوبك. لا يتم إرسال أي صورة إلى أي خادم خارجي.',
    step2Title: '٢. حدد الحجم أو الأبعاد',
    step2Desc: 'اختر الحجم المستهدف (مثل ٢٠ أو ٥٠ ك.ب)، أو حدد الأبعاد بالبكسل، أو اختر الصيغة المرغوبة.',
    step3Title: '٣. معاينة وتحميل فوري',
    step3Desc: 'عاين النتيجة الدقيقة وحمل الصورة فوراً جاهزة للرفع على استمارتك الإلكترونية.',

    // Tools Grid
    toolsGridHeading: 'جميع أدوات تجهيز الصور',
    toolsGridSubheading: 'اختر الأداة المناسبة لمتطلباتك الخاصة للرفع على المواقع.',
    toolCardCompressDesc:
      'تقليل حجم صور JPEG و PNG و WebP للوفاء بشروط المواقع الصارمة مثل ٢٠ أو ٥٠ أو ١٠٠ ك.ب.',
    toolCardResizeDesc:
      'تغيير دقيق لعرض وارتفاع الصور بالبكسل مع خيارات القص الذكي والحفاظ على النسبة.',
    toolCardConvertDesc:
      'تحويل فوري بين صيغ JPG و PNG و WebP محلياً في المتصفح مع معالجة المساحات الشفافة.',
    toolCardSignatureDesc:
      'تجهيز صور التواقيع الورقية، قص الهوامش البيضاء، وتوضيح الحبر للرفع على المعاملات الرسمية.',
    btnOpenTool: 'فتح الأداة',
    badgePopular: 'شائع',
    badgeExactPixels: 'أبعاد دقيقة',
    badgeJpgPngWebp: 'JPG, PNG, WebP',
    badgeFormsId: 'استمارات وهوية',

    // Privacy Section
    privacyGuaranteeHeading: 'ضمان الخصوصية التامة محلياً ١٠٠٪',
    privacyGuaranteeP1:
      'في فورم فيت، صورك لا تغادر جهازك أو هاتفك إطلاقاً. كل عمليات الضغط وتغيير الأبعاد والتحويل تتم حصرياً داخل متصفح الإنترنت الخاص بك عبر تقنيات HTML5 Canvas.',
    privacyGuaranteeP2:
      'لا يوجد رفع لسيرفرات، ولا تخزين سحابي، ولا تسجيل لبياناتك الشخصية. صورك الشخصية، بطاقات الهوية، وشهاداتك وتواقيعك تبقى سرية وخاصة بالكامل.',

    // FAQ Section
    faqHeading: 'الأسئلة الشائعة',
    faqQ1: 'لماذا تطلب المواقع والاستمارات حجماً محدداً مثل ٢٠ أو ٥٠ كيلوبايت؟',
    faqA1:
      'تستقبل البوابات الحكومية والجامعية ملايين الطلبات، وتخزين الصور الكبيرة يثقل خوادمهم؛ لذلك يضعون حدوداً صارمة لحجم الملف كـ ٢٠ أو ٥٠ ك.ب.',
    faqQ2: 'هل يقوم الموقع برفع صوري إلى خوادم خارجية؟',
    faqA2:
      'كلا، على عكس المواقع الأخرى، يقوم فورم فيت بالمعالجة داخل متصفحك مباشرة عبر أكواد جافاسكريبت محلية. لا تخرج أي بيانات عبر الشبكة.',
    faqQ3: 'ماذا أفعل إذا كانت الصورة لا تصل إلى ٢٠ كيلوبايت دون تشويش؟',
    faqA3:
      'كاميرات الهواتف الحديثة تنتج ملايين البكسلات. للوصول لحجم ٢٠ ك.ب يلزم تقليل أبعاد الصورة (مثلاً إلى 400x500 بكسل). نوفر خيار تقليل الأبعاد تلقائياً ليحل المشكلة فوراً.',
    faqQ4: 'هل تدعم صيغة JPEG الخلفية الشفافة؟',
    faqA4:
      'كلا، معيار JPEG لا يدعم الشفافية. عند تحويل صورة شفافة إلى JPEG يقوم فورم فيت بملء الخلفية باللون الأبيض النقي لمنع تحولها إلى اللون الأسود.',
    faqQ5: 'هل يمكنني استخدام الأداة من الهاتف المحمول؟',
    faqA5:
      'نعم، تصميم فورم فيت متجاوب بالكامل ويعمل بسلاسة وسرعة فائقة على هواتف آيفون وأندرويد والأجهزة اللوحية دون الحاجة لتثبيت أي تطبيق.',

    // Trust & Information Pages
    aboutHeading: 'عن فورم فيت',
    aboutMission:
      'تم إنشاء فورم فيت لحل مشكلة شائعة تواجه الجميع: رفض بوابات التقديم لصور شخصية أو تواقيع بسبب زيادة حجم الملف ببضعة كيلوبايت أو عدم مطابقة الأبعاد.',
    aboutBuiltWith:
      'تمت برمجتها باستخدام أحدث واجهات المتصفح الحديثة لتقديم أدوات احترافية سريعة ومجانية بدون تتبع أو تكاليف.',
    aboutP1Title: 'محرك يعمل ١٠٠٪ داخل المتصفح',
    aboutP1Text:
      'نعتمد على تقنيات HTML5 Canvas ومصفوفات البيانات لمعالجة الصور مباشرة على جهازك دون إرسال أي بايت عبر الإنترنت.',
    aboutP2Title: 'لا حسابات ولا تتبع إطلاقاً',
    aboutP2Text:
      'لا تسجيل، لا كلمات مرور، ولا بطاقات ائتمان. تدخل الصفحة، تجهز صورتك، تحملها فوراً وتكمل معاملتك بكل راحة.',
    aboutP3Title: 'نتائج حقيقية وموثوقة',
    aboutP3Text:
      'لا نعرض أرقاماً تقديرية أو وهمية. المقاييس المعروضة محسوبة بدقة من ملفات البايتات الناتجة الفعلية قبل التحميل.',
    aboutStoryTitle: 'لماذا أنشأنا فورم فيت',
    aboutStoryP1:
      'سواء كنت تقدم على وظيفة حكومية، أو استمارة جواز سفر وتأشيرة، أو تسجيل امتحانات جامعية، أو توقيع عقد إلكتروني، يواجه المستخدمون شروط رفع معقدة.',
    aboutStoryP2:
      'غالباً ما تشترط المواقع ألا يزيد حجم الصورة عن ٢٠ أو ٥٠ ك.ب، بينما تلتقط الهواتف الحديثة صوراً بحجم ٥ إلى ١٢ ميجابايت. وأغلب المواقع تطلب مقابلاً أو ترفع المستندات الحساسة لسيرفراتها.',
    aboutStoryP3:
      'تم تطوير فورم فيت ليكون حلاً آمناً، مجانياً، وسريعاً متاحاً للجميع حول العالم مع الحفاظ الكامل على الخصوصية.',

    privacyHeading: 'سياسة الخصوصية',
    privacyLastUpdated: 'آخر تحديث: أكتوبر ٢٠٢٦',
    privacyBadge: 'ضمان المعالجة المحلية الصارمة',
    privacySection1Title: 'المعالجة المحلية داخل المتصفح',
    privacySection1Text:
      'تتم جميع عمليات معالجة الصور وضغطها وتغيير حجمها محلياً على جهازك الخاص. لا يتم إرسال ملفاتك لأي خادم خارجي أبداً.',
    privacySection1Details:
      'عند اختيار الصورة في فورم فيت، تتم قراءتها محلياً في ذاكرة متصفحك عبر واجهات HTML5 Canvas و FileReader. الكود ينفذ بالكامل على هاتفك أو حاسوبك دون نقل أي بيانات عبر الشبكة.',
    privacySection2Title: 'بيانات لا نجمعها',
    privacySection2Text:
      'لا نطلب إنشاء حساب، ولا كلمات مرور، ولا بريداً إلكترونياً، ولا أي وسائل دفع. نحن لا نطلع ولا نخزن أي صور تخصك.',
    privacyItem1: 'لا بيانات شخصية (أسماء، إيميلات، أرقام هواتف، أو عناوين).',
    privacyItem2: 'لا صور ولا مستندات ولا تواقيع ولا ملفات معالجة.',
    privacyItem3: 'لا بيانات بطاقات دفع أو فواتير.',
    privacyItem4: 'لا ملفات تعريف ارتباط (كوكيز) لتتبع السلوك.',
    privacySection3Title: 'إدارة الذاكرة والموارد المؤقتة',
    privacySection3Text:
      'تُحفظ الصور مؤقتاً في ذاكرة المتصفح عبر روابط Blob أثناء المعالجة فقط. وبمجرد إعادة ضبط الأداة أو إغلاق الصفحة، يتم مسح كل الموارد من الذاكرة تلقائياً.',
    privacySection4Title: 'الخدمات الخارجية والإعلانات المستقبلية',
    privacySection4Text:
      'لا يعرض فورم فيت حالياً أي إعلانات خارجية. في حال تفعيل إعلانات مستقبلاً (مثل Google AdSense)، سيتم تطبيق سياسات شفافة وفق معايير جوجل الرسمية دون التأثير على خصوصية صورك.',
    privacySection5Title: 'التواصل بخصوص الخصوصية',
    privacySection5Text:
      'لأي استفسار حول معمارية الأمان والخصوصية في فورم فيت، يمكنك مراسلتنا على privacy@formfit.app.',

    termsHeading: 'شروط الاستخدام',
    termsLastUpdated: 'آخر تحديث: أكتوبر ٢٠٢٦',
    termsSection1Title: 'استخدام الأدوات المجانية',
    termsSection1Text:
      'فورم فيت متاح مجاناً للجميع للاستخدام الشخصي والمهني لتجهيز الصور كما هي دون أي رسوم.',
    termsSection1Details:
      'يمنحك فورم فيت ترخيصاً شخصياً وغير حصري لاستخدام أدوات المعالجة المحلية للاستخدامات الشخصية والتعليمية والتجارية مجاناً.',
    termsSection2Title: 'مسؤولية متطلبات الجهات المستهدفة',
    termsSection2Text:
      'تختلف متطلبات الصور من جهة لأخرى (سفارات، جامعات، جهات توظيف). تقع على عاتق المستخدم مراجعة المتطلبات الخاصة بالبوابة قبل رفع الملف (مثل أبعاد الوجه، لون الخلفية، ودرجة الوضوح).',
    termsSection3Title: 'إخلاء المسؤولية عن الضمانات',
    termsSection3Text:
      'تُقدم الخدمة "كما هي" دون أي ضمانات صريحة أو ضمنية. بالرغم من سعينا لتقديم أعلى دقة في البكسلات والبايتات، إلا أننا لا نضمن خلو الخدمة التام من الانقطاع.',
    termsSection4Title: 'الاستخدام المقبول',
    termsSection4Text:
      'توافق على عدم استخدام التطبيق لمعالجة مواد غير قانونية أو محاولة تعطيل بنية الموقع.',

    contactHeading: 'اتصل بنا',
    contactSubheading:
      'هل لديك استفسار، ملاحظة، أو اقتراح لأداة جديدة؟ يسعدنا تواصلك معنا.',
    contactEmailNote:
      'يمكنك مراسلة فريق التطوير والدعم الفني مباشرة عبر البريد الإلكتروني:',
    contactDirectEmail: 'support@formfit.app',
    contactFormTitle: 'إرسال رسالة',
    contactNameLabel: 'الاسم',
    contactSubjectLabel: 'الموضوع',
    contactEmailLabel: 'البريد الإلكتروني',
    contactMessageLabel: 'الرسالة أو الملاحظة',
    contactSendBtn: 'فتح وإرسال عبر تطبيق البريد',
    contactFormNotice:
      'يعمل فورم فيت محلياً ١٠٠٪ داخل متصفحك دون خادم تتبع. النقر على "إرسال" سيفتح تطبيق بريدك الإلكتروني موجهاً إلى support@formfit.app.',

    // AdSense Section
    adPlaceholderTitle: 'مساحة إعلانية للرعاة',
    adPlaceholderNotice:
      'الإعلانات معطلة حالياً. يمكن تفعيل وحدات إعلانية نظيفة وغير مشتتة هنا بعد الحصول على الموافقة الرسمية.',

    // 404
    notFoundHeading: 'الصفحة غير موجودة (404)',
    notFoundText: 'الأداة أو الصفحة التي طلبتها غير متوفرة أو تم نقلها.',
    btnBackHome: 'العودة للرئيسية',

    // Footer
    footerTagline: 'أدوات مجانية، سريعة، وآمنة تماماً لتجهيز الصور داخل المتصفح.',
    footerToolsTitle: 'أدوات الصور',
    footerPresetsTitle: 'أحجام شائعة',
    footerCompanyTitle: 'فورم فيت',
    footerCopyright: '© ٢٠٢٦ فورم فيت. جميع الحقوق محفوظة. خصوصية تامة داخل المتصفح.',
    footerPrivacyBadge: 'خصوصية مضمونة ١٠٠٪ داخل المتصفح',
    footerNoServer: 'صفر نقل للخوادم',
    footerInstant: 'معالجة فورية',
  },
};
