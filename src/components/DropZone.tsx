import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { UploadCloud, AlertCircle, FileImage, ShieldCheck } from 'lucide-react';
import { MAX_FILE_SIZE_BYTES, formatFileSize } from '../utils/imageProcessor';

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelected, isLoading = false }) => {
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for global "formfit-start-new" event from Header
  useEffect(() => {
    const handleStartNew = () => {
      if (!isLoading && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    window.addEventListener('formfit-start-new', handleStartNew);
    return () => {
      window.removeEventListener('formfit-start-new', handleStartNew);
    };
  }, [isLoading]);

  const validateAndHandleFile = (file: File) => {
    setErrorMessage(null);

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(t.dropZoneInvalidType);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `${t.dropZoneOversized} (${formatFileSize(file.size)} > 20 MB)`
      );
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const handleBoxClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={handleBoxClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-100 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/60 shadow-md scale-[1.005]'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/50 shadow-sm'
        } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleInputChange}
          aria-label={t.dropZoneTitle}
        />

        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 group-hover:bg-blue-100">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-800">
          {t.dropZoneTitle}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {t.dropZoneSubtitle}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            <FileImage className="h-3.5 w-3.5 text-slate-500" />
            <span>{t.dropZoneHint}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>{t.dropZoneNeverUploaded}</span>
          </span>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
