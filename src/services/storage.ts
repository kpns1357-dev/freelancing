import { Client, Project, Invoice, ActivityItem } from '../types';

const CLIENTS_KEY = 'clientflow_clients_v1';
const PROJECTS_KEY = 'clientflow_projects_v1';
const INVOICES_KEY = 'clientflow_invoices_v1';
const ACTIVITIES_KEY = 'clientflow_activities_v1';
const DARK_MODE_KEY = 'clientflow_dark_mode_v1';

export const storage = {
  getClients: (): Client[] => {
    try {
      const data = localStorage.getItem(CLIENTS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load clients from localStorage', e);
    }
    return [];
  },

  saveClients: (clients: Client[]): void => {
    try {
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error('Failed to save clients to localStorage', e);
    }
  },

  getProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(PROJECTS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    return [];
  },

  saveProjects: (projects: Project[]): void => {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  },

  getInvoices: (): Invoice[] => {
    try {
      const data = localStorage.getItem(INVOICES_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load invoices from localStorage', e);
    }
    return [];
  },

  saveInvoices: (invoices: Invoice[]): void => {
    try {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to save invoices to localStorage', e);
    }
  },

  getActivities: (): ActivityItem[] => {
    try {
      const data = localStorage.getItem(ACTIVITIES_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load activities from localStorage', e);
    }
    return [];
  },

  saveActivities: (activities: ActivityItem[]): void => {
    try {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities to localStorage', e);
    }
  },

  getDarkMode: (): boolean => {
    try {
      const data = localStorage.getItem(DARK_MODE_KEY);
      if (data !== null) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load dark mode setting', e);
    }
    return false; // default light mode
  },

  saveDarkMode: (isDark: boolean): void => {
    try {
      localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDark));
    } catch (e) {
      console.error('Failed to save dark mode setting', e);
    }
  },

  resetAll: () => {
    localStorage.removeItem(CLIENTS_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    localStorage.removeItem(INVOICES_KEY);
    localStorage.removeItem(ACTIVITIES_KEY);
    localStorage.removeItem(DARK_MODE_KEY);
  }
};
