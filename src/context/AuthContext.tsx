import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { firestoreService } from '../services/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase configuration is missing or invalid. Please check your .env file.');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const createdUser = userCredential.user;

    if (displayName && createdUser) {
      await updateProfile(createdUser, { displayName });
    }

    // Initialize user's Firestore data with starter showcase data
    try {
      await firestoreService.seedInitialUserData(createdUser.uid);
    } catch (seedErr) {
      console.warn('Failed to seed initial user data:', seedErr);
    }
  };

  const logIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase configuration is missing or invalid. Please check your .env file.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    if (!isFirebaseConfigured) return;
    await signOut(auth);
  };

  const updateDisplayName = async (name: string) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name });
    setUser({ ...auth.currentUser });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isFirebaseConfigured,
        signUp,
        logIn,
        logOut,
        updateDisplayName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
