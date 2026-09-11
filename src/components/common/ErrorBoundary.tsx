import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-surface dark:bg-canvas flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/30 dark:border-card-border rounded-2xl shadow-xl p-8 max-w-md w-full text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-error-container text-error flex items-center justify-center mb-4 shadow-sm">
              <span className="material-symbols-outlined text-[28px]">error</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface dark:text-text-high font-headline-sm">
              Something went wrong
            </h2>
            <p className="text-sm text-on-surface-variant dark:text-text-medium mt-2 leading-relaxed">
              An unexpected display glitch occurred. Your data in Firebase is safe.
            </p>
            {this.state.error?.message && (
              <div className="mt-3 p-2.5 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-xs font-mono text-outline dark:text-text-muted text-left w-full overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-primary dark:bg-brand-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary-container shadow-md transition-all"
              type="button"
            >
              Refresh & Continue
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
