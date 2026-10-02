import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = 'max-h-[88vh]',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Fecha no ESC e bloqueia scroll do body
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content Container */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
        className={`relative z-10 w-full md:max-w-lg bg-zinc-900 border-t md:border border-zinc-800 rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col ${maxHeight} pb-safe animate-in slide-in-from-bottom duration-250`}
      >
        {/* Drag handle visual indicador no mobile */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-zinc-700/80 active:bg-zinc-500 transition-colors" />
        </div>

        {/* Header com título e botão fechar com touch target de 48px */}
        {(title || subtitle) && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80">
            <div>
              {title && (
                <h3 id="bottom-sheet-title" className="text-lg font-bold text-zinc-100 leading-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar gaveta"
              className="touch-target p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-full transition-colors active:scale-95 flex items-center justify-center -mr-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scrollable Children Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
