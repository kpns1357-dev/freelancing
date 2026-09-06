import React from 'react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-surface-container-lowest dark:bg-canvas-card rounded-xl p-space-md shadow-2xl flex items-start justify-between gap-space-sm border transition-all duration-300 transform translate-y-0 opacity-100 ${
              isSuccess
                ? 'bg-gradient-to-r from-secondary/10 via-transparent to-transparent border-secondary/30'
                : isWarning
                ? 'bg-gradient-to-r from-tertiary/10 via-transparent to-transparent border-tertiary/30'
                : isError
                ? 'bg-gradient-to-r from-error/10 via-transparent to-transparent border-error/30'
                : 'bg-gradient-to-r from-primary/10 via-transparent to-transparent border-primary/30'
            }`}
          >
            <div className="flex items-start gap-space-sm min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isSuccess
                    ? 'bg-secondary-container/50 text-secondary'
                    : isWarning
                    ? 'bg-tertiary-fixed/60 text-tertiary'
                    : isError
                    ? 'bg-error-container text-error'
                    : 'bg-primary/15 text-primary dark:text-brand-primary-light'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isSuccess ? 'check_circle' : isWarning ? 'warning' : isError ? 'error' : 'info'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-title-md text-title-md text-on-surface dark:text-text-high font-bold truncate">
                    {toast.title}
                  </span>
                  {toast.liveTag && (
                    <span
                      className={`font-label-sm text-label-sm px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                        isSuccess
                          ? 'bg-secondary-container/40 text-on-secondary-container'
                          : isWarning
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {toast.liveTag}
                    </span>
                  )}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium mt-0.5">
                  {toast.message}
                </p>
                {toast.undoAction && (
                  <div className="flex items-center gap-space-sm mt-2">
                    <button
                      onClick={toast.undoAction}
                      className="font-label-sm text-label-sm text-primary dark:text-brand-primary hover:underline font-bold flex items-center gap-1"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">undo</span> Undo
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-on-surface-variant dark:text-text-muted hover:text-on-surface dark:hover:text-text-high p-1 rounded-lg hover:bg-surface-container dark:hover:bg-canvas-card-elevated shrink-0 transition-colors"
              type="button"
              title="Dismiss"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
