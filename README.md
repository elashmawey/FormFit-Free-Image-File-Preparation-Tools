# FormFit — Free Image & File Preparation Tools
### أداة إعداد وضغط وتجهيز الصور والملفات مجاناً ومحلياً 100%

<p align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="FormFit Logo" />
</p>

<p align="center">
  <strong>Fast, 100% private in-browser image optimization, resizing, conversion, and signature preparation.</strong><br>
  سريع، آمن، ويعمل بالكامل داخل المتصفح بدون رفع أي ملفات إلى خوادم خارجية.
</p>

---

## 🌟 Key Features | المميزات الرئيسية

- ⚡ **Exact Target Size Compression (ضغط لحجم محدد):** Compress images down to exact targets like 20KB, 50KB, 100KB using smart binary-search canvas algorithms.
- 📐 **Pixel-Perfect Resizing (تغيير الأبعاد بدقة):** Resize dimensions while preserving aspect ratios, cropping to fit, or stretching to strict application requirements.
- 🔄 **Format Conversion (تحويل الصيغ):** Convert between JPEG, PNG, and WebP with full transparency support and white-matte fallbacks.
- ✍️ **Signature Cropper & Enhancer (معالجة التوقيع والأختام):** Auto-detect signature bounds, crop, boost contrast, and whiten faint backgrounds for official forms.
- 📦 **Batch Processing & ZIP (معالجة جماعية وتنزيل كـ ZIP):** Process multiple images simultaneously and download them in a single ZIP file.
- 🧠 **Smart Requirements Parser (مستخرج الشروط الذكي):** Paste arbitrary form requirements (e.g. *"Photo must be under 50KB and 600x600 px"* in English or Arabic) and auto-apply them.
- 🔒 **100% Client-Side Privacy (خصوصية مطلقة):** Zero uploads to any server. All processing runs in HTML5 Canvas inside the user's browser.
- 📱 **PWA & Offline Ready (تطبيق ويب تقدمي):** Works completely offline once loaded, installable on mobile and desktop.

---

## 🛠️ Tech Stack | التقنيات المستخدمة

- **Framework:** [React 19](https://react.dev/) + [React Router v7](https://reactrouter.com/)
- **Bundler:** [Vite 8](https://vite.dev/) (with Rolldown & native ESM)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **PWA:** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **Icons:** [lucide-react](https://lucide.dev/)
- **Archive:** [JSZip](https://stuk.github.io/jszip/)
- **Language:** TypeScript

---

## 🚀 Getting Started Locally | التشغيل محلياً

### Prerequisites | المتطلبات
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm`

### Installation & Run | التثبيت والتشغيل

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🌐 Deploy to Vercel | النشر على موقع Vercel

The project is fully pre-configured for **Vercel** with `vercel.json` for seamless Single Page Application (SPA) routing, asset caching, and security headers.

### Option 1: Via Vercel Web Dashboard (Recommended)
1. Push your repository to **GitHub** (see steps below).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Import your GitHub repository (`formfit`).
5. Vercel will automatically detect:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **Deploy**. Your app will be live with a secure HTTPS URL in seconds!

### Option 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🐙 Push to GitHub | الرفع على GitHub

To initialize Git and push the project to your GitHub account:

```bash
# 1. Initialize git repository
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "Initial commit: FormFit Image & File Preparation Tools"

# 4. Rename default branch to main
git branch -M main

# 5. Link your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/formfit.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 📁 Project Structure | هيكل المشروع

```
├── public/                 # Static assets, PWA icons, manifest, robots.txt, sitemap
├── src/
│   ├── components/         # Reusable UI tools (Compress, Resize, Convert, Signature, Batch, etc.)
│   ├── config/             # App configs & AdSense placeholders
│   ├── hooks/              # Custom hooks (PWA install, Online status)
│   ├── i18n/               # Arabic and English translations & context
│   ├── pages/              # Route pages (Home, Tools, Workspace, Legal)
│   ├── types/              # TypeScript definitions & schemas
│   ├── utils/              # Canvas image processor, parser, local storage
│   ├── App.tsx             # Routes & layout wrapper
│   ├── index.css           # Tailwind CSS directives & custom fonts
│   └── main.tsx            # React application entry point
├── .github/workflows/      # Automated CI build & type check workflow
├── vercel.json             # Vercel SPA rewrites and caching headers
├── vite.config.ts          # Vite build config, PWA plugin, chunk splitting
└── package.json            # Dependencies and scripts
```

---

## 📄 License

MIT License. Free for personal and commercial use.
