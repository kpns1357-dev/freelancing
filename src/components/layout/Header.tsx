import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { darkMode, toggleDarkMode, openInvoiceDrawer, openClientDrawer, openProjectModal, setCurrentRoute } = useApp();
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Navigate to clients or invoices based on context
      setCurrentRoute('clients');
    }
  };

  return (
    <header className="fixed top-0 left-0 md:left-[240px] right-0 h-16 bg-surface/80 dark:bg-canvas/80 backdrop-blur-xl border-b border-outline-variant/30 dark:border-card-border/50 z-40 px-space-md md:px-space-lg flex items-center justify-between">
      {/* Mobile Brand Title or Search input on desktop */}
      <div className="flex items-center gap-space-md flex-1 max-w-md">
        <div className="flex items-center gap-space-xs w-full bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/50 dark:border-card-border rounded-xl px-space-sm py-1.5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] focus-within:border-primary dark:focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
          <span className="material-symbols-outlined text-outline dark:text-text-muted text-[18px]">search</span>
          <input
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface dark:text-text-high placeholder:text-outline dark:placeholder:text-text-muted focus:outline-none"
            placeholder="Search clients, invoices..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <kbd className="hidden sm:inline-block font-label-sm text-label-sm bg-surface-container dark:bg-canvas-card-elevated px-1.5 py-0.5 rounded text-on-surface-variant dark:text-text-medium border border-outline-variant/40 dark:border-card-border/80 shrink-0">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-xs sm:gap-space-md">
        {/* Today's Date */}
        <div className="hidden lg:flex items-center gap-space-2xs text-on-surface-variant dark:text-text-medium font-numeric-md text-numeric-md">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>Today, {todayFormatted}</span>
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container-high dark:hover:bg-canvas-card-elevated rounded-xl transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Icon with Counter */}
        <div className="relative">
          <button
            className="p-2 text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container-high dark:hover:bg-canvas-card-elevated rounded-xl transition-colors relative"
            type="button"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[10px] font-bold shadow-sm">
              3
            </span>
          </button>
        </div>

        {/* "+ New" Action Menu */}
        <div className="relative">
          <button
            onClick={() => setIsNewMenuOpen(prev => !prev)}
            className="flex items-center gap-1.5 bg-primary dark:bg-brand-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover text-on-primary px-space-sm py-1.5 rounded-xl font-label-md text-label-md shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[0_0_12px_rgba(59,130,246,0.35)] transition-colors font-medium"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New</span>
          </button>

          {isNewMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border rounded-xl shadow-xl z-50 p-1.5 flex flex-col gap-1"
              onMouseLeave={() => setIsNewMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  openInvoiceDrawer();
                }}
                className="flex items-center gap-2 px-space-sm py-2 rounded-lg text-left text-on-surface dark:text-text-high hover:bg-surface-container-high dark:hover:bg-slate-700/60 font-body-sm text-body-sm transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-primary dark:text-brand-primary">receipt</span>
                <span>Create Invoice</span>
              </button>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  openClientDrawer();
                }}
                className="flex items-center gap-2 px-space-sm py-2 rounded-lg text-left text-on-surface dark:text-text-high hover:bg-surface-container-high dark:hover:bg-slate-700/60 font-body-sm text-body-sm transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">person_add</span>
                <span>Add Client</span>
              </button>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  openProjectModal();
                }}
                className="flex items-center gap-2 px-space-sm py-2 rounded-lg text-left text-on-surface dark:text-text-high hover:bg-surface-container-high dark:hover:bg-slate-700/60 font-body-sm text-body-sm transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-surface-tint">folder_open</span>
                <span>New Project</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
