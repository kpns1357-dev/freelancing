import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Client, Project, Invoice, ActivityItem, ToastNotification, NavPath, InvoiceStatus } from '../types';
import { storage } from '../services/storage';
import { initialClients, initialProjects, initialInvoices, initialActivities } from '../services/mockData';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firestore';

interface AppContextType {
  // Navigation & Viewport State
  currentRoute: NavPath;
  setCurrentRoute: (route: NavPath) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Clients
  clients: Client[];
  addClient: (data: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => { success: boolean; message?: string };
  selectedClientIdForDrawer: string | null;
  isClientDrawerOpen: boolean;
  openClientDrawer: (clientId?: string | null) => void;
  closeClientDrawer: () => void;

  // Projects
  projects: Project[];
  addProject: (data: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  isProjectModalOpen: boolean;
  editingProjectId: string | null;
  openProjectModal: (projectId?: string | null) => void;
  closeProjectModal: () => void;

  // Invoices
  invoices: Invoice[];
  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  toggleInvoicePaid: (id: string) => void;
  isInvoiceDrawerOpen: boolean;
  editingInvoiceId: string | null;
  preselectedClientIdForInvoice: string | null;
  openInvoiceDrawer: (invoiceId?: string | null, preselectedClientId?: string | null) => void;
  closeInvoiceDrawer: () => void;

  // Invoice Preview
  previewInvoiceId: string | null;
  openInvoicePreview: (invoiceId: string) => void;
  closeInvoicePreview: () => void;

  // Activities & Feed
  activities: ActivityItem[];
  addActivity: (item: Omit<ActivityItem, 'id' | 'timestamp' | 'timeAgo'>) => void;

  // Computed Metrics
  metrics: {
    totalClients: number;
    activeClients: number;
    onboardingClients: number;
    archivedClients: number;
    activeProjects: number;
    projectsNearingDeadline: number;
    totalInFlightValue: number;
    pendingInvoicesTotal: number;
    overdueInvoicesTotal: number;
    totalRevenueYTD: number;
    realizedInflowMonth: number;
    overdueInvoicesCount: number;
    pendingInvoicesCount: number;
    paidThisMonthCount: number;
    draftInvoicesCount: number;
  };

  // Toast Notifications
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Reset demo data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<NavPath>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => storage.getDarkMode());

  // Entity State with Persistence
  const [clients, setClients] = useState<Client[]>(() => storage.getClients());
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [invoices, setInvoices] = useState<Invoice[]>(() => storage.getInvoices());
  const [activities, setActivities] = useState<ActivityItem[]>(() => storage.getActivities());

  // UI Modal / Drawer state
  const [selectedClientIdForDrawer, setSelectedClientIdForDrawer] = useState<string | null>(null);
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [preselectedClientIdForInvoice, setPreselectedClientIdForInvoice] = useState<string | null>(null);

  const [previewInvoiceId, setPreviewInvoiceId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Real-time Firestore sync when authenticated
  useEffect(() => {
    if (!user) return;

    const unsubClients = firestoreService.subscribeClients(user.uid, data => {
      setClients(data);
    });
    const unsubProjects = firestoreService.subscribeProjects(user.uid, data => {
      setProjects(data);
    });
    const unsubInvoices = firestoreService.subscribeInvoices(user.uid, data => {
      setInvoices(data);
    });
    const unsubActivities = firestoreService.subscribeActivities(user.uid, data => {
      setActivities(data);
    });
    const unsubSettings = firestoreService.subscribeUserSettings(user.uid, settings => {
      if (settings && typeof settings.darkMode === 'boolean') {
        setDarkMode(settings.darkMode);
      }
    });

    return () => {
      unsubClients();
      unsubProjects();
      unsubInvoices();
      unsubActivities();
      unsubSettings();
    };
  }, [user]);

  // Apply dark mode class to root HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.saveDarkMode(darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (user) {
        firestoreService.saveUserSettingsDoc(user.uid, { darkMode: next }).catch(err => {
          console.error('Failed to sync dark mode to Firestore:', err);
        });
      }
      return next;
    });
  };

  // Sync state to LocalStorage
  useEffect(() => {
    storage.saveClients(clients);
  }, [clients]);

  useEffect(() => {
    storage.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    storage.saveInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    storage.saveActivities(activities);
  }, [activities]);

  // Toast Helpers
  const showToast = (toastData: Omit<ToastNotification, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast: ToastNotification = { ...toastData, id };
    setToasts(prev => [newToast, ...prev].slice(0, 4)); // Keep up to 4 toasts
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Activity Logger Helper
  const addActivity = (item: Omit<ActivityItem, 'id' | 'timestamp' | 'timeAgo'>) => {
    const newActivity: ActivityItem = {
      ...item,
      id: 'act-' + Date.now(),
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now'
    };
    setActivities(prev => [newActivity, ...prev]);
    if (user) {
      firestoreService.addActivityDoc(user.uid, item, newActivity.id).catch(err => {
        console.error('Firestore addActivity error:', err);
      });
    }
  };

  // ----------------------------------------------------
  // CLIENT ACTIONS
  // ----------------------------------------------------
  const openClientDrawer = (clientId?: string | null) => {
    setSelectedClientIdForDrawer(clientId || null);
    setIsClientDrawerOpen(true);
  };

  const closeClientDrawer = () => {
    setIsClientDrawerOpen(false);
    setSelectedClientIdForDrawer(null);
  };

  const addClient = (data: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...data,
      id: 'cli-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [newClient, ...prev]);
    if (user) {
      firestoreService.addClientDoc(user.uid, data, newClient.id).catch(err => {
        console.error('Firestore addClientDoc error:', err);
      });
    }
    addActivity({
      type: 'client',
      title: `Client onboarded: ${newClient.name}`,
      description: `${newClient.company || 'New account'} added to system directory.`,
      highlightText: newClient.name,
      statusTag: newClient.status
    });
    showToast({
      type: 'success',
      title: 'Client Created',
      message: `${newClient.name} successfully added.`,
      liveTag: 'Live'
    });
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(cli => {
        if (cli.id === id) {
          const updated = { ...cli, ...updates };
          return updated;
        }
        return cli;
      })
    );
    if (user) {
      firestoreService.updateClientDoc(user.uid, id, updates).catch(err => {
        console.error('Firestore updateClientDoc error:', err);
      });
    }
    // Also sync client name / company in linked projects and invoices if changed
    if (updates.name || updates.company) {
      setProjects(prev =>
        prev.map(p => (p.clientId === id ? { ...p, clientName: updates.name ? `${updates.name} (${updates.company || ''})` : p.clientName } : p))
      );
      setInvoices(prev =>
        prev.map(inv => (inv.clientId === id ? { ...inv, clientName: updates.name || inv.clientName, clientCompany: updates.company || inv.clientCompany } : inv))
      );
    }
    showToast({
      type: 'success',
      title: 'Client Updated',
      message: 'Client record changes have been saved.'
    });
  };

  const deleteClient = (id: string): { success: boolean; message?: string } => {
    const clientToDelete = clients.find(c => c.id === id);
    if (!clientToDelete) return { success: false, message: 'Client not found.' };

    // Check if client has active projects
    const activeProjects = projects.filter(p => p.clientId === id && p.status !== 'Completed');
    if (activeProjects.length > 0) {
      showToast({
        type: 'error',
        title: 'Failed to Delete Client',
        message: `Client has ${activeProjects.length} active project(s). Reassign or complete projects first.`,
        liveTag: 'Blocked'
      });
      return {
        success: false,
        message: `Cannot delete client with ${activeProjects.length} active project(s).`
      };
    }

    setClients(prev => prev.filter(c => c.id !== id));
    closeClientDrawer();
    if (user) {
      firestoreService.deleteClientDoc(user.uid, id).catch(err => {
        console.error('Firestore deleteClientDoc error:', err);
      });
    }
    showToast({
      type: 'success',
      title: 'Client Removed',
      message: `${clientToDelete.name} was removed from the directory.`
    });
    return { success: true };
  };

  // ----------------------------------------------------
  // PROJECT ACTIONS
  // ----------------------------------------------------
  const openProjectModal = (projectId?: string | null) => {
    setEditingProjectId(projectId || null);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProjectId(null);
  };

  const addProject = (data: Omit<Project, 'id'>): Project => {
    const newProject: Project = {
      ...data,
      id: 'proj-' + Date.now()
    };
    setProjects(prev => [newProject, ...prev]);
    if (user) {
      firestoreService.addProjectDoc(user.uid, data, newProject.id).catch(err => {
        console.error('Firestore addProjectDoc error:', err);
      });
    }
    addActivity({
      type: 'comment',
      title: `New Project: ${newProject.name}`,
      description: `Target deadline: ${newProject.deadline} • Budget: $${newProject.price.toLocaleString()}`,
      highlightText: newProject.name,
      statusTag: newProject.status
    });
    showToast({
      type: 'success',
      title: 'Project Created',
      message: `Project "${newProject.name}" has been started.`
    });
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          return updated;
        }
        return p;
      })
    );
    if (user) {
      firestoreService.updateProjectDoc(user.uid, id, updates).catch(err => {
        console.error('Firestore updateProjectDoc error:', err);
      });
    }
    showToast({
      type: 'success',
      title: 'Project Updated',
      message: 'Deliverable details and progress updated.'
    });
  };

  const deleteProject = (id: string) => {
    const p = projects.find(item => item.id === id);
    setProjects(prev => prev.filter(item => item.id !== id));
    closeProjectModal();
    if (user) {
      firestoreService.deleteProjectDoc(user.uid, id).catch(err => {
        console.error('Firestore deleteProjectDoc error:', err);
      });
    }
    if (p) {
      showToast({
        type: 'warning',
        title: 'Project Deleted',
        message: `Project "${p.name}" was removed.`
      });
    }
  };

  // ----------------------------------------------------
  // INVOICE ACTIONS
  // ----------------------------------------------------
  const openInvoiceDrawer = (invoiceId?: string | null, preselectedClientId?: string | null) => {
    setEditingInvoiceId(invoiceId || null);
    setPreselectedClientIdForInvoice(preselectedClientId || null);
    setIsInvoiceDrawerOpen(true);
  };

  const closeInvoiceDrawer = () => {
    setIsInvoiceDrawerOpen(false);
    setEditingInvoiceId(null);
    setPreselectedClientIdForInvoice(null);
  };

  const openInvoicePreview = (invoiceId: string) => {
    setPreviewInvoiceId(invoiceId);
  };

  const closeInvoicePreview = () => {
    setPreviewInvoiceId(null);
  };

  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>): Invoice => {
    // Generate next invoice number based on existing count
    const nextSeq = (invoices.length + 49).toString().padStart(3, '0');
    const invoiceNumber = `#INV-2024-${nextSeq}`;

    const newInvoice: Invoice = {
      ...data,
      id: 'inv-' + Date.now(),
      invoiceNumber,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInvoices(prev => [newInvoice, ...prev]);
    if (user) {
      firestoreService.addInvoiceDoc(user.uid, data, invoiceNumber, newInvoice.id).catch(err => {
        console.error('Firestore addInvoiceDoc error:', err);
      });
    }

    addActivity({
      type: 'invoice',
      title: `Invoice ${invoiceNumber} issued to ${newInvoice.clientName}`,
      description: `Amount: $${newInvoice.totalAmount.toLocaleString()} • Due: ${newInvoice.dueDate}`,
      highlightText: newInvoice.clientName,
      statusTag: newInvoice.status.toUpperCase()
    });

    showToast({
      type: 'success',
      title: 'Invoice Generated',
      message: `${invoiceNumber} created for ${newInvoice.clientName}.`,
      liveTag: 'Live'
    });

    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          return { ...inv, ...updates };
        }
        return inv;
      })
    );
    if (user) {
      firestoreService.updateInvoiceDoc(user.uid, id, updates).catch(err => {
        console.error('Firestore updateInvoiceDoc error:', err);
      });
    }
    showToast({
      type: 'success',
      title: 'Invoice Saved',
      message: 'Invoice adjustments recorded successfully.'
    });
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    setInvoices(prev => prev.filter(i => i.id !== id));
    if (previewInvoiceId === id) closeInvoicePreview();
    if (editingInvoiceId === id) closeInvoiceDrawer();
    if (user) {
      firestoreService.deleteInvoiceDoc(user.uid, id).catch(err => {
        console.error('Firestore deleteInvoiceDoc error:', err);
      });
    }
    if (inv) {
      showToast({
        type: 'warning',
        title: 'Invoice Deleted',
        message: `${inv.invoiceNumber} was removed from the ledger.`
      });
    }
  };

  const toggleInvoicePaid = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    const isCurrentlyPaid = inv.status === 'paid';
    const newStatus: InvoiceStatus = isCurrentlyPaid ? 'pending' : 'paid';
    const newPaidAmount = isCurrentlyPaid ? 0 : inv.totalAmount;

    setInvoices(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            paidAmount: newPaidAmount
          };
        }
        return item;
      })
    );

    if (user) {
      firestoreService.updateInvoiceDoc(user.uid, id, {
        status: newStatus,
        paidAmount: newPaidAmount
      }).catch(err => {
        console.error('Firestore toggleInvoicePaid error:', err);
      });
    }

    addActivity({
      type: 'payment',
      title: isCurrentlyPaid
        ? `Invoice ${inv.invoiceNumber} marked as Unpaid`
        : `${inv.clientCompany || inv.clientName} paid Invoice ${inv.invoiceNumber}`,
      description: `$${inv.totalAmount.toLocaleString()} payment status updated.`,
      highlightText: inv.clientCompany || inv.clientName,
      statusTag: isCurrentlyPaid ? 'Unsettled' : 'Payment settled'
    });

    showToast({
      type: 'success',
      title: isCurrentlyPaid ? 'Invoice Marked Pending' : 'Payment Settled',
      message: `${inv.invoiceNumber} ($${inv.totalAmount.toLocaleString()}) status updated to ${newStatus}.`,
      liveTag: 'Updated'
    });
  };

  // ----------------------------------------------------
  // COMPUTED METRICS
  // ----------------------------------------------------
  const metrics = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'Active').length;
    const onboardingClients = clients.filter(c => c.status === 'Onboarding').length;
    const archivedClients = clients.filter(c => c.status === 'Archived').length;

    const activeProjects = projects.filter(p => p.status !== 'Completed').length;
    const totalInFlightValue = projects
      .filter(p => p.status !== 'Completed')
      .reduce((acc, p) => acc + (p.price || 0), 0);

    // Projects nearing deadline (within 5 days or overdue)
    const today = new Date();
    const projectsNearingDeadline = projects.filter(p => {
      if (p.status === 'Completed') return false;
      const deadline = new Date(p.deadline);
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 5;
    }).length;

    // Invoices calculations
    let pendingInvoicesTotal = 0;
    let overdueInvoicesTotal = 0;
    let totalRevenueYTD = 0;
    let realizedInflowMonth = 0;

    let overdueInvoicesCount = 0;
    let pendingInvoicesCount = 0;
    let paidThisMonthCount = 0;
    let draftInvoicesCount = 0;

    invoices.forEach(inv => {
      const remaining = Math.max(0, inv.totalAmount - (inv.paidAmount || 0));

      if (inv.status === 'paid') {
        totalRevenueYTD += inv.totalAmount;
        realizedInflowMonth += inv.totalAmount;
        paidThisMonthCount++;
      } else if (inv.status === 'overdue') {
        overdueInvoicesTotal += remaining;
        pendingInvoicesTotal += remaining;
        overdueInvoicesCount++;
        if (inv.paidAmount > 0) totalRevenueYTD += inv.paidAmount;
      } else if (inv.status === 'pending') {
        pendingInvoicesTotal += remaining;
        pendingInvoicesCount++;
        if (inv.paidAmount > 0) totalRevenueYTD += inv.paidAmount;
      } else if (inv.status === 'draft') {
        draftInvoicesCount++;
      }
    });

    return {
      totalClients,
      activeClients,
      onboardingClients,
      archivedClients,
      activeProjects,
      projectsNearingDeadline,
      totalInFlightValue,
      pendingInvoicesTotal,
      overdueInvoicesTotal,
      totalRevenueYTD,
      realizedInflowMonth,
      overdueInvoicesCount,
      pendingInvoicesCount,
      paidThisMonthCount,
      draftInvoicesCount
    };
  }, [clients, projects, invoices]);

  const resetDemoData = () => {
    if (user) {
      firestoreService
        .seedInitialUserData(user.uid)
        .then(() => {
          showToast({
            type: 'warning',
            title: 'Workspace Reset',
            message: 'Starter showcase data has been reloaded into your account.'
          });
        })
        .catch(err => {
          console.error('Failed to reset user data in Firestore:', err);
        });
      return;
    }

    storage.resetAll();
    setClients(initialClients);
    setProjects(initialProjects);
    setInvoices(initialInvoices);
    setActivities(initialActivities);
    showToast({
      type: 'warning',
      title: 'Demo Data Reset',
      message: 'All clients, projects, and invoices have been restored to initial state.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        darkMode,
        toggleDarkMode,

        clients,
        addClient,
        updateClient,
        deleteClient,
        selectedClientIdForDrawer,
        isClientDrawerOpen,
        openClientDrawer,
        closeClientDrawer,

        projects,
        addProject,
        updateProject,
        deleteProject,
        isProjectModalOpen,
        editingProjectId,
        openProjectModal,
        closeProjectModal,

        invoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        toggleInvoicePaid,
        isInvoiceDrawerOpen,
        editingInvoiceId,
        preselectedClientIdForInvoice,
        openInvoiceDrawer,
        closeInvoiceDrawer,

        previewInvoiceId,
        openInvoicePreview,
        closeInvoicePreview,

        activities,
        addActivity,

        metrics,

        toasts,
        showToast,
        dismissToast,

        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
