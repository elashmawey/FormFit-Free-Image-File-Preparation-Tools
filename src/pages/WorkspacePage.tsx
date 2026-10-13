import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import {
  ToolType,
  WorkspacePreset,
  WorkspaceStorageSchema,
} from '../types/workspace';
import {
  getWorkspaceData,
  getSavedPresets,
  getDefaultPreset,
  setDefaultPreset,
  createPreset,
  renamePreset,
  duplicatePreset,
  deletePreset,
  resetToolSettings,
  clearAllWorkspaceSettings,
  exportWorkspaceData,
  importWorkspaceData,
  isLocalStorageAvailable,
  INITIAL_APPLICATION_DEFAULTS,
} from '../utils/workspaceStorage';
import {
  Bookmark,
  Sparkles,
  Sliders,
  Star,
  Copy,
  Edit2,
  Trash2,
  ArrowRight,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Minimize2,
  Scaling,
  RefreshCw,
  PenTool,
  Files,
  Plus,
  Check,
  AlertTriangle,
  Info,
  Clock,
  X,
  Layers,
} from 'lucide-react';

export const WorkspacePage: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active filter tab
  const filterParam = searchParams.get('tool') as ToolType | 'all' | null;
  const [selectedToolFilter, setSelectedToolFilter] = useState<ToolType | 'all'>(
    filterParam && ['compress', 'resize', 'convert', 'signature', 'batch', 'all'].includes(filterParam)
      ? filterParam
      : 'all'
  );

  const [workspaceData, setWorkspaceData] = useState<WorkspaceStorageSchema>(getWorkspaceData());
  const [presets, setPresets] = useState<WorkspacePreset[]>(getSavedPresets());

  // Modal states
  const [renameTarget, setRenameTarget] = useState<WorkspacePreset | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<WorkspacePreset | null>(null);

  const [createToolType, setCreateToolType] = useState<ToolType | null>(null);
  const [createNameInput, setCreateNameInput] = useState('');

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetToolConfirm, setShowResetToolConfirm] = useState<ToolType | null>(null);

  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state from storage
  const reloadData = () => {
    const data = getWorkspaceData();
    setWorkspaceData(data);
    setPresets(getSavedPresets());
  };

  useEffect(() => {
    reloadData();

    const handleStorageUpdate = () => {
      reloadData();
    };

    window.addEventListener('formfit-workspace-change', handleStorageUpdate);
    return () => {
      window.removeEventListener('formfit-workspace-change', handleStorageUpdate);
    };
  }, []);

  // Update query param when tab changes
  const handleTabChange = (tool: ToolType | 'all') => {
    setSelectedToolFilter(tool);
    if (tool === 'all') {
      searchParams.delete('tool');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tool });
    }
  };

  const showNotice = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(null), 3500);
  };

  // Tools Metadata
  const toolsInfo: Record<
    ToolType,
    { label: string; path: string; icon: React.ElementType; desc: string }
  > = {
    compress: {
      label: isAr ? 'ضغط الصور' : 'Image Compression',
      path: '/compress-image',
      icon: Minimize2,
      desc: isAr
        ? 'تحكم بحجم الملف الأقصى (ك.ب)، الجودة، والصيغة.'
        : 'Control maximum KB file size, quality, and output format.',
    },
    resize: {
      label: isAr ? 'تغيير أبعاد الصور' : 'Image Resizer',
      path: '/resize-image',
      icon: Scaling,
      desc: isAr
        ? 'الأبعاد الدقيقة بالبكسل، قفل النسبة، وأنماط القص والملاءمة.'
        : 'Exact pixel dimensions, aspect ratio locking, and crop/fit modes.',
    },
    convert: {
      label: isAr ? 'تحويل صيغ الصور' : 'Format Converter',
      path: '/convert-image',
      icon: RefreshCw,
      desc: isAr
        ? 'التحويل بين JPG و PNG و WebP مع ضبط الجودة.'
        : 'Convert between JPG, PNG, and WebP with fine quality tuning.',
    },
    signature: {
      label: isAr ? 'تجهيز التوقيعات' : 'Signature Resizer',
      path: '/signature-resizer',
      icon: PenTool,
      desc: isAr
        ? 'أبعاد التوقيع الورقي الممسوح وتغميق الحبر وتنظيف الخلفية.'
        : 'Scanned signature dimensions, ink darkening, and contrast cleanup.',
    },
    batch: {
      label: isAr ? 'المعالجة الجماعية' : 'Batch Processor',
      path: '/batch-compress',
      icon: Files,
      desc: isAr
        ? 'الإعدادات الموحدة لمعالجة حتى ١٠ صور دفعة واحدة وتنزيل ZIP.'
        : 'Unified target size and dimensions for up to 10 images in a ZIP.',
    },
  };

  // Filtered Presets list
  const filteredPresets = selectedToolFilter === 'all'
    ? presets
    : presets.filter((p) => p.toolId === selectedToolFilter);

  const customPresetsCount = presets.filter((p) => !p.isBuiltIn).length;

  // Actions
  const handleApplyPreset = (preset: WorkspacePreset) => {
    // Navigate to tool route with preset active
    const toolMeta = toolsInfo[preset.toolId];
    navigate(`${toolMeta.path}?preset=${preset.id}`);
  };

  const handleSetDefault = (toolId: ToolType, presetId: string) => {
    setDefaultPreset(toolId, presetId);
    reloadData();
    showNotice(isAr ? 'تم تعيين النموذج كافتراضي للأداة' : 'Set as tool default profile');
  };

  const handleDuplicate = (preset: WorkspacePreset) => {
    const copy = duplicatePreset(preset.toolId, preset.id);
    if (copy) {
      reloadData();
      showNotice(
        isAr ? `تم نسخ النموذج: "${copy.name}"` : `Duplicated profile: "${copy.name}"`
      );
    }
  };

  const handleOpenRename = (preset: WorkspacePreset) => {
    setRenameTarget(preset);
    setRenameInput(preset.name);
  };

  const handleConfirmRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget) return;
    const clean = renameInput.trim();
    if (!clean) return;

    renamePreset(renameTarget.toolId, renameTarget.id, clean);
    setRenameTarget(null);
    reloadData();
    showNotice(isAr ? 'تم تعديل اسم النموذج بنجاح' : 'Profile renamed successfully');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deletePreset(deleteTarget.toolId, deleteTarget.id);
    setDeleteTarget(null);
    reloadData();
    showNotice(isAr ? 'تم حذف النموذج' : 'Profile deleted');
  };

  const handleCreateNewPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createToolType) return;
    const clean = createNameInput.trim();
    if (!clean) return;

    // Use current last-used settings or factory defaults
    const currentSettings = workspaceData.lastUsedSettings[createToolType] || INITIAL_APPLICATION_DEFAULTS[createToolType];
    createPreset(createToolType, clean, currentSettings);
    setCreateToolType(null);
    setCreateNameInput('');
    reloadData();
    showNotice(isAr ? `تم إنشاء النموذج: "${clean}"` : `Created profile: "${clean}"`);
  };

  const handleExport = () => {
    const json = exportWorkspaceData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formfit_workspace_settings_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotice(isAr ? 'تم تصدير ملف الإعدادات بنجاح' : 'Exported workspace settings file');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importWorkspaceData(content, 'merge_rename');
      if (res.success) {
        setImportStatus({
          success: true,
          message: isAr
            ? `تم استيراد ${res.importedCount} نموذج إعدادات بنجاح!`
            : `Successfully imported ${res.importedCount} profile(s)!`,
        });
        reloadData();
      } else {
        setImportStatus({
          success: false,
          message: res.error || (isAr ? 'فشل استيراد الملف' : 'Failed to import file'),
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetTool = (toolId: ToolType) => {
    resetToolSettings(toolId);
    setShowResetToolConfirm(null);
    reloadData();
    showNotice(
      isAr
        ? `تمت استعادة إعدادات أداة ${toolsInfo[toolId].label} الأولية`
        : `Reset ${toolsInfo[toolId].label} to defaults`
    );
  };

  const handleClearAll = () => {
    clearAllWorkspaceSettings();
    setShowClearConfirm(false);
    reloadData();
    showNotice(
      isAr
        ? 'تم مسح جميع الإعدادات المخصصة واستعادة ضبط المصنع'
        : 'All custom settings cleared. Factory defaults restored.'
    );
  };

  // Helper summary of a preset
  const renderSettingPills = (preset: WorkspacePreset) => {
    const s = preset.settings as unknown as Record<string, unknown>;
    const pills: string[] = [];

    if (s.targetSizeKB) pills.push(`Max ${s.targetSizeKB} KB`);
    if (s.width && s.height) pills.push(`${s.width}×${s.height} px`);
    if (s.targetWidth && s.targetHeight) pills.push(`${s.targetWidth}×${s.targetHeight} px`);
    if (s.format) pills.push(String(s.format).replace('image/', '').toUpperCase());
    if (s.quality !== undefined && s.quality !== null) pills.push(`Q: ${Math.round(Number(s.quality) * 100)}%`);
    if (s.mode) pills.push(`Mode: ${s.mode}`);
    if (s.autoDownscale) pills.push('Auto-scale');

    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {pills.map((pill, idx) => (
          <span
            key={idx}
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-700"
          >
            {pill}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="My Workspace — Your Tools, Your Settings | FormFit"
        description="Manage your personal image preparation profiles, restore last-used configurations, and backup your workspace settings. 100% private in your browser."
      />

      {/* Hero Header */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-white via-slate-50/40 to-slate-50/80 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-3 shadow-2xs">
                <Bookmark className="h-3.5 w-3.5 text-blue-600" />
                <span>{isAr ? 'مساحة العمل الشخصية' : 'Personal Workspace'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                {isAr ? 'مساحتي — أدواتك وإعداداتك الخاصة' : 'My Workspace — Your Tools, Your Settings'}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                {isAr
                  ? 'اضبط إعداداتك مرة واحدة، واحفظ نماذجك المفضلة، وعد في أي وقت لتجد كل شيء جاهزاً كما تركته.'
                  : 'Configure once, save your favorite profiles, and return anytime. FormFit automatically remembers your preferences.'}
              </p>
            </div>

            {/* Quick backup / export buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
                title={isAr ? 'تنزيل ملف نسخة احتياطية' : 'Export backup JSON file'}
              >
                <Download className="h-4 w-4 text-blue-600" />
                <span>{isAr ? 'تصدير الإعدادات' : 'Export Settings'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
                title={isAr ? 'استيراد إعدادات من ملف' : 'Import settings from file'}
              >
                <Upload className="h-4 w-4 text-blue-600" />
                <span>{isAr ? 'استيراد' : 'Import'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportFile}
              />

              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:border-red-200 transition-colors shadow-2xs"
                title={isAr ? 'استعادة ضبط المصنع' : 'Restore Factory Defaults'}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isAr ? 'ضبط المصنع' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Privacy Guarantee Banner (Mandatory requirement Section 8) */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-900 shadow-2xs">
            <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                {isAr
                  ? 'إعداداتك محفوظة محليًا على هذا المتصفح والجهاز. صورك نفسها لا يتم حفظها ضمن مساحة الإعدادات.'
                  : 'Your saved settings are stored in this browser on this device. Your images are not saved as workspace presets.'}
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {isAr
                  ? 'لا يتطلب حساباً أو تسجيلاً. يتم الحفظ داخل متصفحك عبر localStorage. في حال مسح بيانات التصفح، يمكنك استخدام زر "تصدير الإعدادات" للاحتفاظ بنسخة احتياطية على جهازك.'
                  : 'No account or registration required. All preferences persist in your browser’s localStorage. If you clear browser cache, export a backup file anytime.'}
              </p>
            </div>
          </div>

          {/* Storage limitation warning if localStorage is unavailable */}
          {!isLocalStorageAvailable() && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <p>
                {isAr
                  ? 'تنبيه: التخزين الدائم غير متاح في متصفحك (ربما بسبب التصفح الخفي الصارم). تعمل مساحة العمل بالذاكرة المؤقتة للجلسة الحالية فقط.'
                  : 'Notice: Persistent browser storage is disabled (e.g. strict private mode). Workspace settings will work during this session only.'}
              </p>
            </div>
          )}

          {/* Notification toast */}
          {bannerNotice && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>{bannerNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setBannerNotice(null)}
                className="text-emerald-700 hover:text-emerald-900"
              >
                ✕
              </button>
            </div>
          )}

          {/* Import result notice */}
          {importStatus && (
            <div
              className={`mt-4 flex items-center justify-between rounded-xl border p-4 text-xs font-semibold ${
                importStatus.success
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              <span>{importStatus.message}</span>
              <button
                type="button"
                onClick={() => setImportStatus(null)}
                className="font-bold underline"
              >
                {isAr ? 'إغلاق' : 'Dismiss'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-10">
        {/* Section 1: Recently Used Tools & Quick Launcher */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                {isAr ? 'الأدوات وإعداداتها الحالية' : 'Tools & Active Defaults'}
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {isAr ? 'انقر على أي أداة لبدء العمل بها مباشرة' : 'Click any tool to launch with your saved settings'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {(['compress', 'resize', 'convert', 'signature', 'batch'] as ToolType[]).map((tid) => {
              const meta = toolsInfo[tid];
              const Icon = meta.icon;
              const def = getDefaultPreset(tid);
              const lastUsed = workspaceData.lastUsedSettings[tid];

              return (
                <div
                  key={tid}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowResetToolConfirm(tid)}
                        className="text-[10px] text-slate-400 hover:text-red-600 transition-colors"
                        title={isAr ? 'استعادة إعدادات الأداة الأولية' : 'Reset to tool defaults'}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {meta.label}
                    </h3>

                    {/* Active Default Tag */}
                    <div className="mt-2 text-[11px] text-slate-500">
                      <span className="block font-medium text-slate-400 text-[10px] uppercase">
                        {isAr ? 'النموذج الافتراضي:' : 'Default Profile:'}
                      </span>
                      <span className="font-semibold text-blue-700 truncate block">
                        {def?.name || (isAr ? 'الإعدادات الأولية' : 'App Default')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setCreateToolType(tid);
                        setCreateNameInput('');
                      }}
                      className="text-[11px] font-semibold text-slate-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{isAr ? 'نموذج جديد' : 'New Preset'}</span>
                    </button>

                    <Link
                      to={meta.path}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <span>{isAr ? 'فتح الأداة' : 'Launch'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Saved Profiles Management */}
        <section>
          {/* Header & Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  {isAr ? 'إدارة نماذج الإعدادات المحفوظة' : 'Manage Saved Profiles'}
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {isAr
                  ? `إجمالي النماذج: ${presets.length} (${customPresetsCount} مخصص من قبلك)`
                  : `Total profiles: ${presets.length} (${customPresetsCount} custom created)`}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold shadow-2xs max-w-full">
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
                  selectedToolFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isAr ? 'الكل' : 'All'} ({presets.length})
              </button>
              {(['compress', 'resize', 'convert', 'signature', 'batch'] as ToolType[]).map((tid) => {
                const count = presets.filter((p) => p.toolId === tid).length;
                return (
                  <button
                    key={tid}
                    type="button"
                    onClick={() => handleTabChange(tid)}
                    className={`rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
                      selectedToolFilter === tid
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {toolsInfo[tid].label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Presets Grid */}
          {filteredPresets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Bookmark className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">
                {isAr ? 'لا توجد نماذج محفوظة في هذا القسم' : 'No profiles found in this category'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                {isAr
                  ? 'يمكنك حفظ إعداداتك كنموذج مخصص مباشرة من شريط الأداة أو بالضغط على زر "إضافة نموذج جديد".'
                  : 'You can save your settings as a custom profile directly from any tool’s settings bar.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map((preset) => {
                const toolMeta = toolsInfo[preset.toolId];
                const Icon = toolMeta.icon;
                const isDefault = workspaceData.defaultPresetIds?.[preset.toolId] === preset.id;

                return (
                  <div
                    key={preset.id}
                    className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-2xs transition-all ${
                      isDefault
                        ? 'border-blue-300 ring-1 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Top status badges */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <Icon className="h-4 w-4 text-blue-600" />
                          <span>{toolMeta.label}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {preset.isBuiltIn ? (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                              {isAr ? 'مدمج في فورم فيت' : 'Built-in'}
                            </span>
                          ) : (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                              {isAr ? 'نموذج مخصص' : 'Custom'}
                            </span>
                          )}

                          {isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                              {isAr ? 'افتراضي' : 'Default'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {preset.name}
                      </h3>
                      {preset.description && (
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                          {preset.description}
                        </p>
                      )}

                      {/* Settings pills */}
                      {renderSettingPills(preset)}
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {/* Set default button */}
                        {!isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(preset.toolId, preset.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title={isAr ? 'تعيين كنموذج افتراضي للأداة' : 'Set as default for this tool'}
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        )}

                        {/* Duplicate button */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(preset)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title={isAr ? 'نسخ النموذج' : 'Duplicate profile'}
                        >
                          <Copy className="h-4 w-4" />
                        </button>

                        {/* Rename button (custom only) */}
                        {!preset.isBuiltIn && (
                          <button
                            type="button"
                            onClick={() => handleOpenRename(preset)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title={isAr ? 'تعديل اسم النموذج' : 'Rename profile'}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}

                        {/* Delete button (custom only) */}
                        {!preset.isBuiltIn && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(preset)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title={isAr ? 'حذف النموذج' : 'Delete profile'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Apply button */}
                      <button
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition-colors"
                      >
                        <span>{isAr ? 'تطبيق النموذج' : 'Apply'}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* MODAL: Rename Preset */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl animate-scaleIn">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              {isAr ? 'تعديل اسم النموذج' : 'Rename Profile'}
            </h3>
            <form onSubmit={handleConfirmRename} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!renameInput.trim()}
                  className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAr ? 'حفظ' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Preset Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl animate-scaleIn">
            <div className="flex items-center gap-2.5 text-red-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? 'تأكيد حذف النموذج' : 'Delete Profile'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {isAr
                ? `هل أنت متأكد من رغبتك في حذف نموذج "${deleteTarget.name}"؟ لا يمكن التراجع عن هذه الخطوة.`
                : `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-2xs"
              >
                {isAr ? 'نعم، احذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Preset for Tool */}
      {createToolType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl animate-scaleIn">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {isAr ? `إضافة نموذج جديد لأداة ${toolsInfo[createToolType].label}` : `Add Profile for ${toolsInfo[createToolType].label}`}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {isAr
                ? 'سيتم حفظ الإعدادات المستخدمة حالياً في هذه الأداة كنموذج جاهز.'
                : 'Current settings from this tool will be saved into the new profile.'}
            </p>
            <form onSubmit={handleCreateNewPreset} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                placeholder={isAr ? 'اسم النموذج الجديد...' : 'Profile name...'}
                value={createNameInput}
                onChange={(e) => setCreateNameInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateToolType(null)}
                  className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!createNameInput.trim()}
                  className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAr ? 'إنشاء وحفظ' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Clear All Settings Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl animate-scaleIn">
            <div className="flex items-center gap-2.5 text-red-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? 'استعادة ضبط المصنع بالكامل' : 'Reset All Settings'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {isAr
                ? 'سيتم حذف جميع النماذج المخصصة واستعادة الإعدادات الأولية الأصلية لجميع الأدوات. هل تود المتابعة؟'
                : 'This will remove all custom profiles and restore factory defaults across all tools. Continue?'}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-2xs"
              >
                {isAr ? 'نعم، استعد الضبط' : 'Reset Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Reset Single Tool Confirmation */}
      {showResetToolConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl animate-scaleIn">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              {isAr
                ? `استعادة إعدادات ${toolsInfo[showResetToolConfirm].label}`
                : `Reset ${toolsInfo[showResetToolConfirm].label}`}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {isAr
                ? 'ستتم استعادة إعدادات هذه الأداة فقط إلى قيم المصنع الأولية دون المساس بباقي الأدوات.'
                : 'This tool will be restored to original factory defaults without affecting your other tools.'}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetToolConfirm(null)}
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleResetTool(showResetToolConfirm)}
                className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                {isAr ? 'استعادة' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
