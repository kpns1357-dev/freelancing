import React from 'react';

interface EmptyStateProps {
  type: 'no-data' | 'no-results';
  title: string;
  description: string;
  tag?: string;
  query?: string;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  tag,
  query,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction
}) => {
  return (
    <div className="bg-surface-container-lowest dark:bg-canvas-card rounded-xl p-space-xl shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden my-4 border border-outline-variant/30 dark:border-card-border">
      {/* Dynamic ambient backdrops */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary-fixed/20 dark:bg-brand-primary/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-surface-container-high/40 dark:bg-slate-800/40 rounded-full blur-2xl pointer-events-none"></div>

      {type === 'no-data' ? (
        <div className="relative w-36 h-36 mb-space-md flex items-center justify-center">
          <svg className="w-32 h-32" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <rect className="fill-surface-container-low dark:fill-slate-800" height="90" rx="8" width="70" x="25" y="15"></rect>
            <path className="fill-surface-container-high dark:fill-slate-700" d="M25 23C25 18.5817 28.5817 15 33 15H77L95 33V97C95 101.418 91.4183 105 87 105H33C28.5817 105 25 101.418 25 97V23Z"></path>
            <path className="fill-surface-variant dark:fill-slate-600" d="M77 15V31C77 32.1046 77.8954 33 79 33H95"></path>
            <rect className="fill-primary/70 dark:fill-brand-primary/70" height="5" rx="2.5" width="46" x="37" y="44"></rect>
            <rect className="fill-outline-variant dark:fill-slate-600" height="4" rx="2" width="30" x="37" y="55"></rect>
            <rect className="fill-outline-variant dark:fill-slate-600" height="4" rx="2" width="38" x="37" y="65"></rect>
            <rect className="fill-outline-variant dark:fill-slate-600" height="4" rx="2" width="22" x="37" y="75"></rect>
            <circle className="fill-primary dark:fill-brand-primary" cx="85" cy="85" r="18"></circle>
            <path d="M85 77V93M77 85H93" stroke="white" strokeLinecap="round" strokeWidth="2.5"></path>
          </svg>
          <div className="absolute inset-0 bg-primary/5 rounded-full filter blur-xl -z-10"></div>
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full bg-surface-container-high dark:bg-canvas-card-elevated flex items-center justify-center mb-space-md relative">
          <span className="material-symbols-outlined text-[48px] text-outline dark:text-text-muted">search_off</span>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </div>
        </div>
      )}

      {tag && (
        <span className="font-label-sm text-label-sm text-primary dark:text-brand-primary uppercase font-bold tracking-wider mb-1">
          {tag}
        </span>
      )}

      {query && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-medium font-numeric-md text-numeric-md mb-space-xs">
          <span className="material-symbols-outlined text-[16px]">filter_alt</span>
          <span>Query: “{query}”</span>
        </div>
      )}

      <h3 className="font-headline-md text-headline-md text-on-surface dark:text-text-high font-bold tracking-tight mb-space-xs">
        {title}
      </h3>
      <p className="font-body-md text-body-md text-on-surface-variant dark:text-text-medium max-w-sm mb-space-lg leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-space-sm">
        {primaryActionText && onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            className="flex items-center gap-1.5 bg-primary dark:bg-brand-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover text-on-primary px-space-md py-2.5 rounded-xl font-label-md text-label-md shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>{primaryActionText}</span>
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="flex items-center gap-1.5 bg-surface-container dark:bg-canvas-card-elevated hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface dark:text-text-high px-space-md py-2.5 rounded-xl font-label-md text-label-md transition-all active:scale-[0.98]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
            <span>{secondaryActionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};
