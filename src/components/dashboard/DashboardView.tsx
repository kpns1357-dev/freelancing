import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from './MetricCard';
import { RevenueChart } from './RevenueChart';
import { PriorityInvoices } from './PriorityInvoices';
import { ActivityFeed } from './ActivityFeed';

export const DashboardView: React.FC = () => {
  const { metrics, openInvoiceDrawer, openClientDrawer, showToast } = useApp();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

  const dateOptions = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter'];
  const userName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Workspace Owner');

  const handleExportSummary = () => {
    showToast({
      type: 'success',
      title: 'Summary Export Generated',
      message: 'Financial summary exported to CSV format.',
      liveTag: 'Ready'
    });
  };

  const handleWhatsAppDirectPing = () => {
    showToast({
      type: 'success',
      title: 'WhatsApp Channel Ready',
      message: 'Client messaging webhook active for billing dispatch.',
      liveTag: 'Active'
    });
  };

  const handleLogTime = () => {
    showToast({
      type: 'warning',
      title: 'Billable Time Tracker',
      message: 'Timer session started for active sprint deliverable.'
    });
  };

  return (
    <div className="flex flex-col w-full pb-space-3xl">
      {/* Executive Greeting & Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md mb-space-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-lg text-headline-lg text-on-surface dark:text-text-high tracking-tight font-bold">
              Executive Dashboard
            </span>
            <span className="bg-secondary-container/60 dark:bg-status-emerald-bg dark:border dark:border-status-emerald/30 text-on-secondary-container dark:text-status-emerald-text px-2.5 py-0.5 rounded-full font-label-sm text-label-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-status-emerald animate-pulse"></span>
              Live Feed
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-text-medium mt-1">
            Welcome back, {userName}! Here is what is happening across your {metrics.totalClients} active accounts today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-xs shrink-0">
          {/* Date Range Dropdown */}
          <div className="relative inline-flex items-center">
            <button
              onClick={() => setIsDateMenuOpen(prev => !prev)}
              className="flex items-center gap-space-xs bg-surface-container-lowest dark:bg-canvas-card hover:bg-surface-container-low dark:hover:bg-canvas-card-elevated text-on-surface dark:text-text-high font-label-md text-label-md px-space-sm py-2 rounded-xl border border-outline-variant/30 dark:border-card-border shadow-sm transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-primary dark:text-brand-primary text-[18px]">
                calendar_month
              </span>
              <span>{dateRange}</span>
              <span className="material-symbols-outlined text-outline dark:text-text-muted text-[18px]">
                expand_more
              </span>
            </button>

            {isDateMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border rounded-xl shadow-xl z-30 p-1.5 flex flex-col gap-1"
                onMouseLeave={() => setIsDateMenuOpen(false)}
              >
                {dateOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDateRange(opt);
                      setIsDateMenuOpen(false);
                    }}
                    className={`text-left px-space-sm py-1.5 rounded-lg font-body-sm text-body-sm transition-colors ${
                      dateRange === opt
                        ? 'bg-surface-container dark:bg-brand-primary text-primary dark:text-white font-semibold'
                        : 'text-on-surface dark:text-text-medium hover:bg-surface-container-high dark:hover:bg-slate-700/60 hover:text-on-surface dark:hover:text-text-high'
                    }`}
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExportSummary}
            className="flex items-center gap-space-xs bg-surface-container-lowest dark:bg-canvas-card hover:bg-surface-container-low dark:hover:bg-canvas-card-elevated text-on-surface dark:text-text-high font-label-md text-label-md px-space-sm py-2 rounded-xl border border-outline-variant/30 dark:border-card-border shadow-sm transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-outline dark:text-text-muted text-[18px]">file_download</span>
            <span>Export Summary</span>
          </button>

          <button
            onClick={() => openInvoiceDrawer()}
            className="flex items-center gap-space-2xs bg-primary dark:bg-brand-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover text-on-primary font-label-md text-label-md px-space-sm py-2 rounded-xl shadow-md dark:shadow-[0_0_15px_rgba(59,130,246,0.35)] hover:shadow transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Quick Invoice</span>
          </button>
        </div>
      </div>

      {/* 4 Top Key KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-xl">
        {/* KPI 1: Total Clients */}
        <MetricCard
          title="Total Clients"
          value={metrics.totalClients.toString()}
          trend={metrics.totalClients > 0 ? `${metrics.activeClients} Active` : 'Clean Slate'}
          trendNeutral={metrics.totalClients === 0}
          trendUp={metrics.totalClients > 0}
          subtextLeft={`${metrics.onboardingClients} onboarding`}
          subtextRight={`Active: ${metrics.activeClients}`}
          icon="group"
          iconColor="text-primary dark:text-brand-primary"
        />

        {/* KPI 2: Active Projects */}
        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects.toString()}
          trend={metrics.activeProjects > 0 ? `${metrics.activeProjects} In Progress` : 'Ready'}
          trendNeutral={true}
          subtextLeft={`${metrics.projectsNearingDeadline} deadline soon`}
          subtextLeftHighlight="tertiary"
          subtextRight={metrics.activeProjects > 0 ? 'In flight' : 'No backlog'}
          icon="business_center"
          iconColor="text-surface-tint dark:text-brand-primary-light"
        />

        {/* KPI 3: Pending Invoices */}
        <MetricCard
          title="Pending Invoices"
          value={`$${metrics.pendingInvoicesTotal.toLocaleString()}`}
          trend={metrics.overdueInvoicesCount > 0 ? `${metrics.overdueInvoicesCount} Overdue` : 'All Clear'}
          trendNegative={metrics.overdueInvoicesCount > 0}
          trendNeutral={metrics.overdueInvoicesCount === 0}
          subtextLeft={`$${metrics.overdueInvoicesTotal.toLocaleString()} overdue`}
          subtextLeftHighlight={metrics.overdueInvoicesCount > 0 ? 'error' : undefined}
          subtextRight={`${metrics.pendingInvoicesCount} due soon`}
          icon="receipt_long"
          iconBgColor={metrics.overdueInvoicesCount > 0 ? "bg-error-container/40 dark:bg-status-red-bg" : "bg-surface-container dark:bg-canvas-card-elevated"}
          iconColor={metrics.overdueInvoicesCount > 0 ? "text-error dark:text-status-red-text" : "text-primary dark:text-brand-primary"}
        />

        {/* KPI 4: Total Revenue (YTD) */}
        <MetricCard
          title="Revenue (YTD)"
          value={`$${metrics.totalRevenueYTD.toLocaleString()}`}
          trend={metrics.totalRevenueYTD > 0 ? `+$${metrics.realizedInflowMonth.toLocaleString()}` : '$0.00'}
          trendUp={metrics.totalRevenueYTD > 0}
          trendNeutral={metrics.totalRevenueYTD === 0}
          subtextLeft={`+$${metrics.realizedInflowMonth.toLocaleString()} this month`}
          subtextLeftHighlight={metrics.totalRevenueYTD > 0 ? "secondary" : undefined}
          subtextRight={`${metrics.paidThisMonthCount} settled`}
          icon="payments"
          iconBgColor="bg-secondary-container/50 dark:bg-status-emerald-bg"
          iconColor="text-secondary dark:text-status-emerald-text"
        />
      </div>

      {/* Main Content Split Grid: 7 Cols Left, 5 Cols Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN (7 COLS) */}
        <div className="xl:col-span-7 flex flex-col gap-space-lg">
          <RevenueChart />
          <PriorityInvoices />
        </div>

        {/* RIGHT COLUMN (5 COLS) */}
        <div className="xl:col-span-5 flex flex-col gap-space-lg">
          {/* Quick Action Shortcuts */}
          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm">
            <span className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high block mb-space-xs font-bold">
              Quick Actions
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium block mb-space-md">
              Frequently dispatched operational flows
            </span>

            <div className="grid grid-cols-2 gap-space-sm">
              <button
                onClick={() => openInvoiceDrawer()}
                className="flex flex-col items-start p-space-sm rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated hover:bg-surface-container dark:hover:bg-slate-700/60 transition-all group text-left border border-outline-variant/10 dark:border-card-border/50"
                type="button"
              >
                <div className="w-9 h-9 rounded-lg bg-primary dark:bg-brand-primary text-on-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">post_add</span>
                </div>
                <span className="font-title-md text-title-md text-on-surface dark:text-text-high font-semibold leading-tight">
                  Send Invoice
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-0.5">
                  Draft and issue
                </span>
              </button>

              <button
                onClick={() => openClientDrawer()}
                className="flex flex-col items-start p-space-sm rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated hover:bg-surface-container dark:hover:bg-slate-700/60 transition-all group text-left border border-outline-variant/10 dark:border-card-border/50"
                type="button"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary text-on-secondary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </div>
                <span className="font-title-md text-title-md text-on-surface dark:text-text-high font-semibold leading-tight">
                  Add Client
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-0.5">
                  Onboard agency
                </span>
              </button>

              <button
                onClick={handleLogTime}
                className="flex flex-col items-start p-space-sm rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated hover:bg-surface-container dark:hover:bg-slate-700/60 transition-all group text-left border border-outline-variant/10 dark:border-card-border/50"
                type="button"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-tint text-on-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <span className="font-title-md text-title-md text-on-surface dark:text-text-high font-semibold leading-tight">
                  Log Billable Time
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-0.5">
                  Track project hrs
                </span>
              </button>

              <button
                onClick={handleWhatsAppDirectPing}
                className="flex flex-col items-start p-space-sm rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated hover:bg-surface-container dark:hover:bg-slate-700/60 transition-all group text-left border border-outline-variant/10 dark:border-card-border/50"
                type="button"
              >
                <div className="w-9 h-9 rounded-lg bg-tertiary text-on-tertiary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">send_to_mobile</span>
                </div>
                <span className="font-title-md text-title-md text-on-surface dark:text-text-high font-semibold leading-tight">
                  WhatsApp Ping
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-0.5">
                  Direct reminder
                </span>
              </button>
            </div>
          </div>

          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};
