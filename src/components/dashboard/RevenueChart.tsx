import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const RevenueChart: React.FC = () => {
  const { metrics, invoices } = useApp();
  const [activeTab, setActiveTab] = useState<'cashflow' | 'comparison'>('cashflow');

  // Compute collection rate from actual data
  const totalBilled = metrics.totalRevenueYTD + metrics.pendingInvoicesTotal;
  const collectionRate = totalBilled > 0 ? Math.round((metrics.totalRevenueYTD / totalBilled) * 1000) / 10 : 0;
  const hasTransactions = invoices.length > 0;

  return (
    <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high font-bold">
            Revenue & Invoice Health
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
            Cash realization vs billed volumes
          </span>
        </div>
        <div className="flex items-center bg-surface-container-low dark:bg-canvas-card-elevated p-1 rounded-xl shrink-0 border border-outline-variant/30 dark:border-card-border">
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`px-space-sm py-1 rounded-lg font-label-md text-label-md transition-all ${
              activeTab === 'cashflow'
                ? 'bg-surface-container-lowest dark:bg-canvas-card text-primary dark:text-brand-primary shadow-sm font-semibold'
                : 'text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high'
            }`}
            type="button"
          >
            Cash Flow
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-space-sm py-1 rounded-lg font-label-md text-label-md transition-all ${
              activeTab === 'comparison'
                ? 'bg-surface-container-lowest dark:bg-canvas-card text-primary dark:text-brand-primary shadow-sm font-semibold'
                : 'text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high'
            }`}
            type="button"
          >
            Invoiced vs Collected
          </button>
        </div>
      </div>

      {/* Metric Callout Row */}
      <div className="grid grid-cols-3 gap-space-sm p-space-sm bg-surface-container-low dark:bg-canvas-card-elevated rounded-xl mb-space-md border border-outline-variant/20 dark:border-card-border/50">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant dark:text-text-muted font-medium">
            Realized Inflow
          </span>
          <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high">
            ${metrics.realizedInflowMonth.toLocaleString()}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted flex items-center gap-0.5">
            {hasTransactions ? '+0.0% vs target' : 'New cycle'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant dark:text-text-muted font-medium">
            Avg. Days to Pay
          </span>
          <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high">
            {hasTransactions ? '14.0d' : '0.0d'}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted flex items-center gap-0.5">
            {hasTransactions ? 'Standard' : 'No records'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant dark:text-text-muted font-medium">
            Collection Rate
          </span>
          <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high">
            {collectionRate}%
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
            {hasTransactions ? 'Healthy' : 'Zero balance'}
          </span>
        </div>
      </div>

      {/* Dynamic SVG Visualization Chart or Zero-Data Empty State */}
      {!hasTransactions ? (
        <div className="w-full h-56 flex flex-col items-center justify-center text-center p-space-md bg-surface-container-low/40 dark:bg-canvas-card-elevated/30 rounded-xl border border-dashed border-outline-variant/30 dark:border-card-border/60">
          <div className="w-12 h-12 rounded-xl bg-surface-container dark:bg-canvas-card flex items-center justify-center text-outline dark:text-text-muted mb-2">
            <span className="material-symbols-outlined text-[24px]">show_chart</span>
          </div>
          <p className="font-title-md text-title-md text-on-surface dark:text-text-high font-semibold">
            Ledger Ready for Transactions
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-1 max-w-sm">
            Create your first invoice to begin tracking cash realization, payment velocity, and revenue projections.
          </p>
        </div>
      ) : (
        <div className="relative w-full h-56 pt-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 540 180">
            <defs>
              <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#004ac6" stopOpacity="0.28"></stop>
                <stop offset="100%" stopColor="#004ac6" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>

            <line opacity="0.3" stroke="#c3c6d7" strokeDasharray="3 3" x1="0" x2="540" y1="30" y2="30"></line>
            <line opacity="0.3" stroke="#c3c6d7" strokeDasharray="3 3" x1="0" x2="540" y1="75" y2="75"></line>
            <line opacity="0.3" stroke="#c3c6d7" strokeDasharray="3 3" x1="0" x2="540" y1="120" y2="120"></line>
            <line opacity="0.5" stroke="#c3c6d7" x1="0" x2="540" y1="160" y2="160"></line>

            <path d="M 33 160 L 513 160" fill="none" className="stroke-primary dark:stroke-brand-primary" strokeWidth="2"></path>
          </svg>
        </div>
      )}

      <div className="flex items-center justify-center gap-space-lg mt-space-md pt-space-xs">
        <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant dark:text-text-medium">
          <span className="w-3 h-3 rounded-sm bg-surface-container-high dark:bg-slate-800"></span>
          <span>Total Invoiced</span>
        </div>
        <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant dark:text-text-medium">
          <span className="w-3 h-1 bg-primary dark:bg-brand-primary rounded-full"></span>
          <span>Collected Cash</span>
        </div>
        <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary dark:text-status-emerald-text font-medium">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>Clean Slate Active</span>
        </div>
      </div>
    </div>
  );
};
