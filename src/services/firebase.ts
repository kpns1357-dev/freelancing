import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA3XB_k2vEX9BxM_ko4UQiNqbdYrAeZwts',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'freelancing-b4361.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'freelancing-b4361',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'freelancing-b4361.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '936981480994',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:936981480994:web:c569eea92a21cbd6366c7b',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your_firebase_api_key_here'
);

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
