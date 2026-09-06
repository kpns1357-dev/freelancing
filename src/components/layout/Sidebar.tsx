import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NavPath } from '../../types';

export const Sidebar: React.FC = () => {
  const { currentRoute, setCurrentRoute, metrics, clearWorkspace, showToast } = useApp();
  const { user, logOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
      showToast({
        type: 'info',
        title: 'Signed Out',
        message: 'You have been safely signed out of ClientFlow.'
      });
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const navItems: { path: NavPath; label: string; icon: string }[] = [
    { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: 'clients', label: 'Clients', icon: 'group' },
    { path: 'projects', label: 'Projects', icon: 'folder_open' },
    { path: 'invoices', label: 'Invoices', icon: 'receipt_long' },
    { path: 'analytics', label: 'Analytics', icon: 'bar_chart' },
    { path: 'settings', label: 'Settings', icon: 'settings' }
  ];

  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Alex Morgan');
  const userSubtitle = user?.email || 'Agency Owner';

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] bg-surface-container-low dark:bg-[#0d1527] border-r border-outline-variant/30 dark:border-card-border/60 z-50 flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-md flex items-center gap-space-xs border-b border-outline-variant/20 dark:border-card-border/40">
          <img
            alt="ClientFlow Logo"
            className="h-8 w-auto object-contain dark:brightness-110"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UETwRPRp58A4vVLhzHnN3Nk9ltLwmx7Eof901EVivgdSv4Ik7IM5KjfI_-MGJYaLou0T2YGb0V-1alyQWlElKRx_Um74zTeHWFKCjNnNrfxN8kRsjhZx6PBFVaV8HuZPY21uZX2C78xdsDsySTAGfYsykpX8zOEqolvV7SAQ80khfl1PtDOLWWCZITsveGQhqzJeXgR2MBIN_XDEG5bz0A4ZfqcStr_0i5rPddKouM7QeY-tL3RfU"
          />
          <span className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high tracking-tight font-bold">
            ClientFlow
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 p-space-xs mt-space-xs">
          {navItems.map(item => {
            const isActive = currentRoute === item.path;
            return (
              <button
                key={item.path}
                onClick={() => setCurrentRoute(item.path)}
                className={`w-full flex items-center gap-space-sm px-space-sm py-2 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-primary dark:bg-brand-primary text-on-primary font-title-md shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                    : 'text-on-surface-variant dark:text-text-medium hover:bg-surface-container-high dark:hover:bg-canvas-card-elevated hover:text-on-surface dark:hover:text-text-high font-label-md text-label-md'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Plan Capacity & Profile Section */}
      <div className="flex flex-col p-space-xs gap-space-xs border-t border-outline-variant/20 dark:border-card-border/40 bg-surface-container-low dark:bg-[#0b1120]">
        {/* Agency Plan Card */}
        <div className="bg-surface-container-lowest dark:bg-canvas-card p-space-xs rounded-xl border border-outline-variant/30 dark:border-card-border/70 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-primary dark:text-brand-primary-light font-semibold uppercase tracking-wider">
              Agency Plan
            </span>
            <span className="font-numeric-md text-numeric-md text-on-surface-variant dark:text-text-medium">
              {metrics.activeClients}/50
            </span>
          </div>
          <div className="w-full bg-surface-container-high dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary dark:bg-brand-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (metrics.activeClients / 50) * 100)}%` }}
            ></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
            {metrics.activeClients} Active clients
          </span>
        </div>

        {/* User Profile Bar */}
        <div className="flex items-center justify-between p-space-xs rounded-xl hover:bg-surface-container-high/60 dark:hover:bg-canvas-card-elevated transition-colors">
          <div className="flex items-center gap-space-xs min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold flex items-center justify-center text-xs shrink-0 ring-1 ring-outline-variant/50 dark:ring-card-border">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-md text-title-md text-on-surface dark:text-text-high truncate leading-tight">
                {displayName}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted truncate leading-tight text-[11px]">
                {userSubtitle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => {
                if (window.confirm('Clear all prototype data and start with a fresh, empty workspace?')) {
                  clearWorkspace();
                }
              }}
              className="p-1 text-on-surface-variant dark:text-text-muted hover:text-rose-500 hover:bg-surface-container-high dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Clear Workspace (Start Fresh)"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">delete_sweep</span>
            </button>
            {user && (
              <button
                onClick={handleSignOut}
                className="p-1 text-on-surface-variant dark:text-text-muted hover:text-error hover:bg-surface-container-high dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign Out"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
