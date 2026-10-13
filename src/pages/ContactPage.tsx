import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { Mail, MessageSquare, Send, Info } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const supportEmail = 'support@formfit.app';

  const handleOpenEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(
      subject || 'Feedback for FormFit'
    )}&body=${encodeURIComponent(
      `Name: ${name}\n\nMessage:\n${message}\n\nSent from FormFit web utility`
    )}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Contact FormFit — Support & Feedback"
        description="Get in touch with the FormFit team. Have feedback, suggestions for new image tools, or need help? Reach out to support@formfit.app."
      />

      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {t.contactHeading}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-slate-600">
            {t.contactSubheading}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 w-full space-y-8">
        {/* Direct Email Card */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 sm:p-8 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t.contactEmailNote}
              </h2>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-2 inline-block font-mono text-base sm:text-lg font-bold text-blue-700 hover:underline"
              >
                {supportEmail}
              </a>
              <p className="mt-2 text-[11px] text-slate-500">
                Typical response window: 1-2 business days for tool requests and technical queries.
              </p>
            </div>
          </div>
        </div>

        {/* Message Drafting Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">{t.contactFormTitle}</h2>
          </div>

          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-200">
            <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
            <p>{t.contactFormNotice}</p>
          </div>

          <form onSubmit={handleOpenEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.contactNameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.contactSubjectLabel}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Feedback"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.contactMessageLabel}
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-y"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <Send className="h-4 w-4" />
                <span>{t.contactSendBtn}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
