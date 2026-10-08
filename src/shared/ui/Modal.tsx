import React, { useEffect, useCallback } from 'react';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  taxonomyCode?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  taxonomyCode,
  description,
  children,
  size = 'md',
  className,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          'w-full rounded border border-border bg-surface shadow-elevation transition-transform duration-200',
          sizes[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted/40">
          <div>
            {taxonomyCode && (
              <span className="taxonomy-label block mb-0.5">{taxonomyCode}</span>
            )}
            <h3 id="modal-title" className="font-serif text-lg font-bold text-foreground">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-ink-muted mt-0.5 font-sans">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-ink-muted hover:border-ink hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-burnt transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
