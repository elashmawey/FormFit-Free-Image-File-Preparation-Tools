import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { trackEvent } from './utils/analytics';

// Pages
import { HomePage } from './pages/HomePage';
import { CompressPage } from './pages/CompressPage';
import { BatchPage } from './pages/BatchPage';
import { SmartRequirementsPage } from './pages/SmartRequirementsPage';
import { ResizePage } from './pages/ResizePage';
import { ConvertPage } from './pages/ConvertPage';
import { ConvertSpecificPage } from './pages/ConvertSpecificPage';
import { SignaturePage } from './pages/SignaturePage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top & analytics pageview helper
const NavigationObserver: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    trackEvent('tool_opened', { route: pathname });
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <NavigationObserver />
        <OfflineIndicator />
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
          <Header />
          <div className="flex-1">
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Personal Workspace */}
              <Route path="/workspace" element={<WorkspacePage />} />

              {/* Smart Requirements Parser */}
              <Route path="/smart-requirements" element={<SmartRequirementsPage />} />

              {/* Batch Processing */}
              <Route path="/batch-compress" element={<BatchPage />} />

              {/* Dedicated Compression Routes */}
              <Route path="/compress-image" element={<CompressPage />} />
              <Route
                path="/compress-image-to-20kb"
                element={<CompressPage presetTargetKB={20} />}
              />
              <Route
                path="/compress-image-to-50kb"
                element={<CompressPage presetTargetKB={50} />}
              />
              <Route
                path="/compress-image-to-100kb"
                element={<CompressPage presetTargetKB={100} />}
              />

              {/* Specialized Tool Routes */}
              <Route path="/resize-image" element={<ResizePage />} />
              <Route path="/convert-image" element={<ConvertPage />} />
              <Route
                path="/convert-png-to-jpg"
                element={<ConvertSpecificPage fromFormat="png" toFormat="jpg" />}
              />
              <Route
                path="/convert-jpg-to-webp"
                element={<ConvertSpecificPage fromFormat="jpg" toFormat="webp" />}
              />
              <Route path="/signature-resizer" element={<SignaturePage />} />

              {/* Trust & Policy Routes */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
