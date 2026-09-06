import React from 'react';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { metrics, invoices, projects, clients } = useApp();

  return (
    <div className="flex flex-col w-full pb-space-3xl gap-space-xl">
      <div className="flex flex-col">
        <div className="flex items-center gap-space-xs">
          <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-text-high tracking-tight font-bold">
            Analytics & Performance
          </h1>
          <span className="bg-primary/10 dark:bg-brand-primary/20 text-primary dark:text-brand-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
            Fiscal Health
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-text-medium mt-1">
          Deep-dive fiscal metrics, project margin realization, and client aging velocity.
        </p>
      </div>

      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg flex flex-col justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
            Average Project Value
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high">
              $
              {projects.length > 0
                ? Math.round(
                    projects.reduce((acc, p) => acc + p.price, 0) / projects.length
                  ).toLocaleString()
                : '0'}
            </span>
            <span className="text-secondary dark:text-status-emerald-text font-label-sm text-label-sm font-semibold">
              Across {projects.length} deliverables
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg flex flex-col justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
            Revenue Realization Velocity
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high">
              {invoices.length > 0 ? '14.0 days' : '0.0 days'}
            </span>
            <span className="text-secondary dark:text-status-emerald-text font-label-sm text-label-sm font-semibold">
              {invoices.length > 0 ? 'Net 15 standard' : 'Awaiting records'}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg flex flex-col justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
            Active Accounts Retainer Ratio
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high">
              {metrics.totalClients > 0
                ? Math.round((metrics.activeClients / metrics.totalClients) * 100)
                : 0}
              %
            </span>
            <span className="text-primary dark:text-brand-primary font-label-sm text-label-sm font-semibold">
              {metrics.activeClients} Active / {metrics.totalClients} Total
            </span>
          </div>
        </div>
      </div>

      {/* Client Revenue Breakdown */}
      <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm">
        <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high font-bold mb-space-md">
          Client Revenue Attribution
        </h3>
        {clients.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-outline dark:text-text-muted text-[28px] mb-2">bar_chart</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
              No clients onboarded yet. Once you add clients and issue invoices, revenue attribution breakdown will display here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-space-sm">
            {clients.slice(0, 6).map(cli => {
              const cliInvoices = invoices.filter(i => i.clientId === cli.id);
              const total = cliInvoices.reduce((acc, i) => acc + i.totalAmount, 0);
              const percent = metrics.totalRevenueYTD > 0 ? Math.round((total / metrics.totalRevenueYTD) * 100) : 0;

              return (
                <div key={cli.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between font-body-sm text-body-sm">
                    <span className="font-semibold text-on-surface dark:text-text-high">
                      {cli.name} ({cli.company})
                    </span>
                    <span className="font-numeric-md font-bold text-on-surface dark:text-text-high">
                      ${total.toLocaleString()} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary dark:bg-brand-primary h-full rounded-full"
                      style={{ width: `${Math.min(100, percent)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
