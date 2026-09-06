import React from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { AuthView } from './components/auth/AuthView';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { ClientsView } from './components/clients/ClientsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { InvoicesView } from './components/invoices/InvoicesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { ClientDrawer } from './components/clients/ClientDrawer';
import { InvoiceDrawer } from './components/invoices/InvoiceDrawer';
import { ProjectModal } from './components/projects/ProjectModal';
import { InvoicePreviewModal } from './components/preview/InvoicePreviewModal';
import { ToastContainer } from './components/common/Toast';

export const App: React.FC = () => {
  const { currentRoute } = useApp();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            Loading ClientFlow...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthView />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-canvas font-body-md text-on-surface dark:text-text-high antialiased flex flex-col selection:bg-primary/20">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar />

      {/* Main Container Area offset by 240px on md+ */}
      <div className="md:pl-[240px] flex flex-col flex-1 min-h-screen">
        <Header />

        <main className="relative pt-16 bg-surface dark:bg-canvas w-full min-h-screen px-3 sm:px-space-md md:px-space-lg py-space-md pb-24 md:pb-8">
          {currentRoute === 'dashboard' && <DashboardView />}
          {currentRoute === 'clients' && <ClientsView />}
          {currentRoute === 'projects' && <ProjectsView />}
          {currentRoute === 'invoices' && <InvoicesView />}
          {currentRoute === 'analytics' && <AnalyticsView />}
          {currentRoute === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Sticky Navigation Dock & FAB */}
      <MobileNav />

      {/* Global Interactive Overlays */}
      <ClientDrawer />
      <InvoiceDrawer />
      <ProjectModal />
      <InvoicePreviewModal />
      <ToastContainer />
    </div>
  );
};
