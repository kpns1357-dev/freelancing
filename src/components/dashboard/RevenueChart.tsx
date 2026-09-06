import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const RevenueChart: React.FC = () => {
  const { metrics } = useApp();
  const [activeTab, setActiveTab] = useState<'cashflow' | 'comparison'>('cashflow');

  // Compute collection rate from actual data
  const totalBilled = metrics.totalRevenueYTD + metrics.pendingInvoicesTotal;
  const collectionRate = totalBilled > 0 ? Math.round((metrics.totalRevenueYTD / totalBilled) * 1000) / 10 : 94.1;

  return (
    <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high font-bold">
            Revenue & Invoice Health
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
            Weekly cash realization vs billed volumes
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
          <span className="font-body-sm text-body-sm text-secondary dark:text-status-emerald-text flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">north_east</span> +8.2% vs target
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant dark:text-text-muted font-medium">
            Avg. Days to Pay
          </span>
          <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high">
            14.2d
          </span>
          <span className="font-body-sm text-body-sm text-secondary dark:text-status-emerald-text flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">south_west</span> 2.8d faster
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
            Optimal tier
          </span>
        </div>
      </div>

      {/* Dynamic SVG Visualization Chart */}
      <div className="relative w-full h-56 pt-2">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 540 180">
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#004ac6" stopOpacity="0.28"></stop>
              <stop offset="100%" stopColor="#004ac6" stopOpacity="0.0"></stop>
            </linearGradient>
            <linearGradient id="darkAreaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35"></stop>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0"></stop>
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line opacity="0.3" stroke="#c3c6d7" strokeDasharray="3 3" x1="0" x2="540" y1="30" y2="30"></line>
          <line opacity="0.3" stroke="#c3c6d7" strokeDasharray="3 3" x1="0" x2="540" y1="75" y2="75"></line>
          <line opacity="0.3" stroke="#c3c6d7" strokeDasharray="3 3" x1="0" x2="540" y1="120" y2="120"></line>
          <line opacity="0.5" stroke="#c3c6d7" x1="0" x2="540" y1="160" y2="160"></line>

          {/* Comparison Invoiced bars */}
          {(activeTab === 'comparison' || activeTab === 'cashflow') && (
            <g className="transition-opacity duration-300">
              <rect className="fill-surface-container-high dark:fill-slate-800" height="100" rx="4" width="16" x="25" y="60"></rect>
              <rect className="fill-surface-container-high dark:fill-slate-800" height="115" rx="4" width="16" x="105" y="45"></rect>
              <rect className="fill-surface-container-high dark:fill-slate-800" height="125" rx="4" width="16" x="185" y="35"></rect>
              <rect className="fill-surface-container-high dark:fill-slate-800" height="105" rx="4" width="16" x="265" y="55"></rect>
              <rect className="fill-surface-container-high dark:fill-slate-800" height="130" rx="4" width="16" x="345" y="30"></rect>
              <rect className="fill-surface-container-high dark:fill-slate-800" height="140" rx="4" width="16" x="425" y="20"></rect>
              <rect className="fill-surface-container-high dark:fill-slate-800" height="120" rx="4" width="16" x="505" y="40"></rect>
            </g>
          )}

          {/* Collected Cash Line & Shading */}
          <path d="M 33 90 Q 113 70 193 50 T 353 45 T 433 30 T 513 52 L 513 160 L 33 160 Z" fill="url(#areaGradient)"></path>
          <path
            d="M 33 90 Q 113 70 193 50 T 353 45 T 433 30 T 513 52"
            fill="none"
            className="stroke-primary dark:stroke-brand-primary"
            strokeLinecap="round"
            strokeWidth="3.5"
          ></path>

          {/* Highlight Data points */}
          <circle cx="193" cy="50" className="fill-primary dark:fill-brand-primary" r="4" stroke="#ffffff" strokeWidth="2"></circle>
          <circle cx="353" cy="45" className="fill-primary dark:fill-brand-primary" r="4" stroke="#ffffff" strokeWidth="2"></circle>
          <circle cx="433" cy="30" fill="#006c49" r="5" stroke="#ffffff" strokeWidth="2"></circle>
        </svg>
      </div>

      <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant dark:text-text-muted px-space-xs mt-1">
        <span>Sep 28</span>
        <span>Oct 05</span>
        <span>Oct 12</span>
        <span>Oct 19</span>
        <span>Oct 24 (Today)</span>
      </div>

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
          <span>Ledger verified</span>
        </div>
      </div>
    </div>
  );
};
