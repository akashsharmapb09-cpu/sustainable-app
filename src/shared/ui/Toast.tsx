import { useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext, type ToastItem, type ToastType } from './toastContextDef';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      title,
      description,
      type = 'info',
      duration = 4000,
    }: {
      title: string;
      description?: string;
      type?: ToastType;
      duration?: number;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Viewport */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded border p-4 shadow-elevation transition-all duration-200 ${
              t.type === 'success'
                ? 'border-moss bg-surface text-foreground'
                : t.type === 'error'
                ? 'border-burnt bg-surface text-foreground'
                : t.type === 'warning'
                ? 'border-clay bg-surface text-foreground'
                : 'border-border bg-surface text-foreground'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="h-4 w-4 text-moss" />}
              {t.type === 'error' && <AlertCircle className="h-4 w-4 text-burnt" />}
              {t.type === 'warning' && <AlertCircle className="h-4 w-4 text-clay" />}
              {t.type === 'info' && <Info className="h-4 w-4 text-ink-muted" />}
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-xs font-mono font-semibold">{t.title}</p>
              {t.description && <p className="text-xs text-ink-muted font-sans">{t.description}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-ink-muted hover:text-foreground p-0.5"
              aria-label="Dismiss toast"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
