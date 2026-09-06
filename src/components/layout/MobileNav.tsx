import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavPath } from '../../types';

export const MobileNav: React.FC = () => {
  const { currentRoute, setCurrentRoute, openInvoiceDrawer, metrics } = useApp();

  const mobileTabs: { path: NavPath; label: string; icon: string; badgeCount?: number }[] = [
    { path: 'dashboard', label: 'Home', icon: 'dashboard' },
    { path: 'clients', label: 'Clients', icon: 'group' },
    { path: 'projects', label: 'Projects', icon: 'folder_open' },
    { path: 'invoices', label: 'Invoices', icon: 'receipt_long', badgeCount: metrics.overdueInvoicesCount },
    { path: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <div className="md:hidden">
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => openInvoiceDrawer()}
        aria-label="Create New Invoice"
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary dark:bg-brand-primary text-on-primary shadow-lg flex items-center justify-center hover:bg-primary-container dark:hover:bg-brand-primary-hover active:scale-95 transition-all z-40"
        type="button"
        title="Quick Invoice"
      >
        <span className="material-symbols-outlined text-[24px]">add</span>
      </button>

      {/* Sticky Mobile Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/95 dark:bg-canvas-card/95 backdrop-blur-lg px-2 flex items-center justify-around shadow-lg z-40 border-t border-outline-variant/30 dark:border-card-border pb-safe">
        {mobileTabs.map(tab => {
          const isActive = currentRoute === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => setCurrentRoute(tab.path)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-colors relative ${
                isActive
                  ? 'text-primary dark:text-brand-primary font-bold'
                  : 'text-on-surface-variant dark:text-text-medium hover:text-primary dark:hover:text-brand-primary'
              }`}
              type="button"
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
                {tab.badgeCount && tab.badgeCount > 0 ? (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-error animate-pulse"></span>
                ) : null}
              </div>
              <span className="font-label-sm text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
