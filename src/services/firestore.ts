import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { Client, Project, Invoice, ActivityItem } from '../types';
import { initialClients, initialProjects, initialInvoices, initialActivities } from './mockData';

export const firestoreService = {
  // ----------------------------------------------------
  // REAL-TIME SUBSCRIPTIONS
  // ----------------------------------------------------
  subscribeClients: (uid: string, onUpdate: (clients: Client[]) => void): Unsubscribe => {
    const clientsRef = collection(db, 'users', uid, 'clients');
    const q = query(clientsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      snapshot => {
        const clients: Client[] = [];
        snapshot.forEach(docSnap => {
          clients.push({ id: docSnap.id, ...docSnap.data() } as Client);
        });
        onUpdate(clients);
      },
      error => {
        console.error('Firestore subscribeClients error:', error);
      }
    );
  },

  subscribeProjects: (uid: string, onUpdate: (projects: Project[]) => void): Unsubscribe => {
    const projectsRef = collection(db, 'users', uid, 'projects');
    const q = query(projectsRef, orderBy('deadline', 'asc'));
    return onSnapshot(
      q,
      snapshot => {
        const projects: Project[] = [];
        snapshot.forEach(docSnap => {
          projects.push({ id: docSnap.id, ...docSnap.data() } as Project);
        });
        onUpdate(projects);
      },
      error => {
        console.error('Firestore subscribeProjects error:', error);
      }
    );
  },

  subscribeInvoices: (uid: string, onUpdate: (invoices: Invoice[]) => void): Unsubscribe => {
    const invoicesRef = collection(db, 'users', uid, 'invoices');
    const q = query(invoicesRef, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      snapshot => {
        const invoices: Invoice[] = [];
        snapshot.forEach(docSnap => {
          invoices.push({ id: docSnap.id, ...docSnap.data() } as Invoice);
        });
        onUpdate(invoices);
      },
      error => {
        console.error('Firestore subscribeInvoices error:', error);
      }
    );
  },

  subscribeActivities: (uid: string, onUpdate: (activities: ActivityItem[]) => void): Unsubscribe => {
    const activitiesRef = collection(db, 'users', uid, 'activities');
    const q = query(activitiesRef, orderBy('timestamp', 'desc'));
    return onSnapshot(
      q,
      snapshot => {
        const activities: ActivityItem[] = [];
        snapshot.forEach(docSnap => {
          activities.push({ id: docSnap.id, ...docSnap.data() } as ActivityItem);
        });
        onUpdate(activities);
      },
      error => {
        console.error('Firestore subscribeActivities error:', error);
      }
    );
  },

  subscribeUserSettings: (uid: string, onUpdate: (settings: any) => void): Unsubscribe => {
    const userDocRef = doc(db, 'users', uid);
    return onSnapshot(
      userDocRef,
      snapshot => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data());
        }
      },
      error => {
        console.error('Firestore subscribeUserSettings error:', error);
      }
    );
  },

  // ----------------------------------------------------
  // CLIENT CRUD
  // ----------------------------------------------------
  addClientDoc: async (uid: string, data: Omit<Client, 'id' | 'createdAt'>, customId?: string): Promise<string> => {
    const clientsRef = collection(db, 'users', uid, 'clients');
    const newDoc = customId ? doc(clientsRef, customId) : doc(clientsRef);
    const clientData = {
      ...data,
      id: newDoc.id,
      createdAt: new Date().toISOString()
    };
    await setDoc(newDoc, clientData);
    return newDoc.id;
  },

  updateClientDoc: async (uid: string, clientId: string, updates: Partial<Client>): Promise<void> => {
    const clientDocRef = doc(db, 'users', uid, 'clients', clientId);
    await updateDoc(clientDocRef, { ...updates, updatedAt: serverTimestamp() });
  },

  deleteClientDoc: async (uid: string, clientId: string): Promise<void> => {
    const clientDocRef = doc(db, 'users', uid, 'clients', clientId);
    await deleteDoc(clientDocRef);
  },

  // ----------------------------------------------------
  // PROJECT CRUD
  // ----------------------------------------------------
  addProjectDoc: async (uid: string, data: Omit<Project, 'id'>, customId?: string): Promise<string> => {
    const projectsRef = collection(db, 'users', uid, 'projects');
    const newDoc = customId ? doc(projectsRef, customId) : doc(projectsRef);
    const projectData = {
      ...data,
      id: newDoc.id,
      createdAt: new Date().toISOString()
    };
    await setDoc(newDoc, projectData);
    return newDoc.id;
  },

  updateProjectDoc: async (uid: string, projectId: string, updates: Partial<Project>): Promise<void> => {
    const projectDocRef = doc(db, 'users', uid, 'projects', projectId);
    await updateDoc(projectDocRef, { ...updates, updatedAt: serverTimestamp() });
  },

  deleteProjectDoc: async (uid: string, projectId: string): Promise<void> => {
    const projectDocRef = doc(db, 'users', uid, 'projects', projectId);
    await deleteDoc(projectDocRef);
  },

  // ----------------------------------------------------
  // INVOICE CRUD
  // ----------------------------------------------------
  addInvoiceDoc: async (
    uid: string,
    data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>,
    invoiceNumber: string,
    customId?: string
  ): Promise<string> => {
    const invoicesRef = collection(db, 'users', uid, 'invoices');
    const newDoc = customId ? doc(invoicesRef, customId) : doc(invoicesRef);
    const invoiceData = {
      ...data,
      id: newDoc.id,
      invoiceNumber,
      createdAt: new Date().toISOString()
    };
    await setDoc(newDoc, invoiceData);
    return newDoc.id;
  },

  updateInvoiceDoc: async (uid: string, invoiceId: string, updates: Partial<Invoice>): Promise<void> => {
    const invoiceDocRef = doc(db, 'users', uid, 'invoices', invoiceId);
    await updateDoc(invoiceDocRef, { ...updates, updatedAt: serverTimestamp() });
  },

  deleteInvoiceDoc: async (uid: string, invoiceId: string): Promise<void> => {
    const invoiceDocRef = doc(db, 'users', uid, 'invoices', invoiceId);
    await deleteDoc(invoiceDocRef);
  },

  // ----------------------------------------------------
  // ACTIVITY & SETTINGS
  // ----------------------------------------------------
  addActivityDoc: async (
    uid: string,
    item: Omit<ActivityItem, 'id' | 'timestamp' | 'timeAgo'>,
    customId?: string
  ): Promise<void> => {
    const activitiesRef = collection(db, 'users', uid, 'activities');
    const newDoc = customId ? doc(activitiesRef, customId) : doc(activitiesRef);
    const activityData = {
      ...item,
      id: newDoc.id,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now'
    };
    await setDoc(newDoc, activityData);
  },

  saveUserSettingsDoc: async (uid: string, settings: any): Promise<void> => {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
  },

  // ----------------------------------------------------
  // USER WORKSPACE MANAGEMENT
  // ----------------------------------------------------
  seedInitialUserData: async (uid: string): Promise<void> => {
    // Only initialize the user settings document, keep collections clean and empty for real work
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        darkMode: false,
        currency: 'USD',
        initializedAt: serverTimestamp()
      },
      { merge: true }
    );
  },

  clearAllUserData: async (uid: string): Promise<void> => {
    const collections = ['clients', 'projects', 'invoices', 'activities'];
    const batch = writeBatch(db);
    for (const col of collections) {
      const colRef = collection(db, 'users', uid, col);
      const snap = await getDocs(colRef);
      snap.forEach(docSnap => {
        batch.delete(docSnap.ref);
      });
    }
    await batch.commit();
  }
};
