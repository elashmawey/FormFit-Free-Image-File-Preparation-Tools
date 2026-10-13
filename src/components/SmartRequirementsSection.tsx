import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { parseUploadRequirements, ParsedRequirements } from '../utils/requirementsParser';
import { SupportedMimeType } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sliders,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface SmartRequirementsSectionProps {
  onApplySettings: (settings: {
    targetSizeKB?: number;
    width?: number;
    height?: number;
    format: SupportedMimeType;
  }) => void;
}

export const SmartRequirementsSection: React.FC<SmartRequirementsSectionProps> = ({
  onApplySettings,
}) => {
  const { lang, isRTL } = useLanguage();
  const isAr = lang === 'ar';

  const [inputRules, setInputRules] = useState('');
  const [parsed, setParsed] = useState<ParsedRequirements | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Editable parsed values
  const [editMaxKB, setEditMaxKB] = useState<number | undefined>(undefined);
  const [editWidth, setEditWidth] = useState<number | undefined>(undefined);
  const [editHeight, setEditHeight] = useState<number | undefined>(undefined);
  const [editFormat, setEditFormat] = useState<SupportedMimeType>('image/jpeg');

  const samplePrompts = isAr
    ? [
        'الحد الأقصى لحجم الصورة 100 كيلوبايت، والأبعاد 200 × 230 بكسل، والصيغة JPG.',
        'الصورة الشخصية يجب ألا تتجاوز 50 كيلوبايت بأبعاد 600 × 600 بكسل.',
        'حجم الملف أقل من 20 ك.ب بصيغة PNG أو JPG.',
      ]
    : [
        'Maximum file size 100 KB. Dimensions 200 x 230 pixels. Accepted formats: JPG or PNG.',
        'Passport photo must not exceed 240 KB with dimensions 600 x 600 pixels.',
        'File size strictly under 50 KB, portrait ratio 400x514 px in WebP or JPEG.',
      ];

  const handleParse = (text: string) => {
    setHasAttempted(true);
    const result = parseUploadRequirements(text, isAr ? 'ar' : 'en');
    setParsed(result);

    if (result) {
      setEditMaxKB(result.maxSizeKB);
      setEditWidth(result.width);
      setEditHeight(result.height);
      setEditFormat(result.format || 'image/jpeg');
    }
  };

  const handleApply = () => {
    onApplySettings({
      targetSizeKB: editMaxKB,
      width: editWidth,
      height: editHeight,
      format: editFormat,
    });
  };

  return (
    <div className="w-full rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-blue-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                {isAr ? 'مستخرج إعدادات الرفع الذكي' : 'Smart Upload Requirements'}
              </h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                {isAr ? 'ميزة حصرية' : 'Smart Feature'}
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
              {isAr
                ? 'لست متأكداً من الإعدادات المطلوبة؟ الصق شروط موقع التقديم وسيقوم فورم فيت باستخراجها فوراً.'
                : 'Not sure what image size you need? Paste the requirements and let FormFit figure out the settings.'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Textarea & Sample Chips */}
      <div className="mt-5 space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={inputRules}
            onChange={(e) => {
              setInputRules(e.target.value);
              handleParse(e.target.value);
            }}
            placeholder={
              isAr
                ? 'الصق تعليمات البوابة هنا، مثال: "الحد الأقصى لحجم الصورة 100 كيلوبايت، والأبعاد 200 × 230 بكسل، والصيغة JPG"...'
                : 'Paste portal instructions here, e.g. "Maximum file size 100 KB. Dimensions 200 x 230 pixels. Accepted formats: JPG or PNG"...'
            }
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-y"
          />
        </div>

        {/* Quick Example Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-500">
            {isAr ? 'أمثلة جاهزة للتحربة:' : 'Try an example:'}
          </span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInputRules(prompt);
                handleParse(prompt);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition-colors shadow-2xs text-left"
            >
              {prompt.slice(0, 42)}...
            </button>
          ))}
        </div>
      </div>

      {/* Parsed Result & Interactive Editor */}
      {parsed && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 transition-all">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold">
                {isAr ? 'تم استخراج الإعدادات بنجاح — يمكنك تعديلها قبل التطبيق' : 'Settings Detected — Confirm or refine below'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setInputRules('');
                setParsed(null);
                setHasAttempted(false);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{isAr ? 'مسح' : 'Clear'}</span>
            </button>
          </div>

          {/* Extracted Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Target KB */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {isAr ? 'الحد الأقصى (ك.ب)' : 'Max File Size'}
                </span>
                {parsed.detectedFields.maxSize ? (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                    {isAr ? 'مكتشف' : 'Detected'}
                  </span>
                ) : (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                    {isAr ? 'غير محدد' : 'Optional'}
                  </span>
                )}
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  min="5"
                  max="10000"
                  value={editMaxKB ?? ''}
                  placeholder={isAr ? 'اختياري' : 'Optional'}
                  onChange={(e) =>
                    setEditMaxKB(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                />
                <span className="absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 font-semibold">
                  KB
                </span>
              </div>
            </div>

            {/* Width */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {isAr ? 'العرض (بكسل)' : 'Width (px)'}
                </span>
                {parsed.detectedFields.dimensions ? (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                    {isAr ? 'مكتشف' : 'Detected'}
                  </span>
                ) : (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                    {isAr ? 'غير محدد' : 'Not specified'}
                  </span>
                )}
              </div>
              <input
                type="number"
                min="10"
                max="8000"
                value={editWidth ?? ''}
                placeholder={isAr ? 'غير محدد' : 'Unconstrained'}
                onChange={(e) =>
                  setEditWidth(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Height */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {isAr ? 'الارتفاع (بكسل)' : 'Height (px)'}
                </span>
                {parsed.detectedFields.dimensions ? (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                    {isAr ? 'مكتشف' : 'Detected'}
                  </span>
                ) : (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                    {isAr ? 'غير محدد' : 'Not specified'}
                  </span>
                )}
              </div>
              <input
                type="number"
                min="10"
                max="8000"
                value={editHeight ?? ''}
                placeholder={isAr ? 'غير محدد' : 'Unconstrained'}
                onChange={(e) =>
                  setEditHeight(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Format */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {isAr ? 'الصيغة' : 'Format'}
                </span>
                {parsed.detectedFields.format ? (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                    {isAr ? 'مكتشف' : 'Detected'}
                  </span>
                ) : (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                    JPG (Default)
                  </span>
                )}
              </div>
              <select
                value={editFormat}
                onChange={(e) => setEditFormat(e.target.value as SupportedMimeType)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/webp">WebP</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-200/60">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">{isAr ? 'الملخص:' : 'Summary:'}</span>{' '}
              {parsed.summary}
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <span>{isAr ? 'تطبيق هذه الإعدادات واختيار الصورة' : 'Apply Settings & Choose Image'}</span>
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {hasAttempted && inputRules.trim().length >= 5 && !parsed && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
          <HelpCircle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <p>
            {isAr
              ? 'لم يتم العثور على أبعاد أو أحجام واضحة في النص الملصق. يمكنك استخدام أدوات الضغط والتغيير اليدوية أدناه مباشرة.'
              : 'No specific dimensions or file sizes were clearly identified in the pasted text. You can configure target size and dimensions manually using the tool controls below.'}
          </p>
        </div>
      )}
    </div>
  );
};
