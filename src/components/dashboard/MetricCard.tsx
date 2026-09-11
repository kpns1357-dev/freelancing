import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp?: boolean;
  trendNeutral?: boolean;
  trendNegative?: boolean;
  subtextLeft: string;
  subtextRight: string;
  subtextLeftHighlight?: 'secondary' | 'error' | 'tertiary';
  icon: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendUp,
  trendNeutral,
  trendNegative,
  subtextLeft,
  subtextRight,
  subtextLeftHighlight,
  icon,
  iconBgColor = 'bg-surface-container dark:bg-canvas-card-elevated',
  iconColor = 'text-primary dark:text-brand-primary'
}) => {
  return (
    <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-space-xs">
          <div className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center ${iconColor} shrink-0 border border-outline-variant/30 dark:border-card-border/60`}>
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
              {title}
            </span>
            <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high">
              {value}
            </span>
          </div>
        </div>

        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
              trendNegative
                ? 'bg-error-container dark:bg-status-red-bg text-on-error-container dark:text-status-red-text'
                : trendNeutral
                ? 'bg-surface-container-high dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-medium'
                : 'bg-secondary-container/50 dark:bg-status-emerald-bg text-on-secondary-container dark:text-status-emerald-text'
            }`}
          >
            {trendUp && <span className="material-symbols-outlined text-[14px]">arrow_upward</span>}
            {trendNeutral && <span className="material-symbols-outlined text-[14px]">pause_circle</span>}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-space-md flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
        <span
          className={
            subtextLeftHighlight === 'secondary'
              ? 'text-secondary dark:text-status-emerald-text font-semibold'
              : subtextLeftHighlight === 'error'
              ? 'text-error dark:text-status-red-text font-medium'
              : subtextLeftHighlight === 'tertiary'
              ? 'text-tertiary dark:text-status-amber-text font-medium'
              : ''
          }
        >
          {subtextLeft}
        </span>
        <span className="font-label-sm text-label-sm text-outline dark:text-text-muted font-medium">
          {subtextRight}
        </span>
      </div>
    </div>
  );
};
