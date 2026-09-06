// Type declarations for modular Firebase v11 imports

declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: Record<string, any>;
  }
  export function initializeApp(options: Record<string, any>, name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(name?: string): FirebaseApp;
}

declare module 'firebase/auth' {
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    [key: string]: any;
  }

  export interface UserCredential {
    user: User;
    providerId: string | null;
    operationType: string;
  }

  export interface Auth {
    currentUser: User | null;
    app: any;
    [key: string]: any;
  }

  export function getAuth(app?: any): Auth;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function signOut(auth: Auth): Promise<void>;
  export function updateProfile(user: User, profile: { displayName?: string | null; photoURL?: string | null }): Promise<void>;
  export function onAuthStateChanged(auth: Auth, nextOrObserver: (user: User | null) => void): () => void;
}

declare module 'firebase/firestore' {
  export interface Firestore {
    app: any;
    type: string;
  }

  export type Unsubscribe = () => void;

  export interface DocumentData {
    [field: string]: any;
  }

  export interface DocumentReference<T = DocumentData> {
    id: string;
    path: string;
    parent: any;
  }

  export interface CollectionReference<T = DocumentData> {
    id: string;
    path: string;
  }

  export interface Query<T = DocumentData> {
    type: string;
  }

  export interface DocumentSnapshot<T = DocumentData> {
    id: string;
    exists(): boolean;
    data(): T | undefined;
  }

  export interface QueryDocumentSnapshot<T = DocumentData> extends DocumentSnapshot<T> {
    data(): T;
  }

  export interface QuerySnapshot<T = DocumentData> {
    docs: QueryDocumentSnapshot<T>[];
    size: number;
    empty: boolean;
    forEach(callback: (result: QueryDocumentSnapshot<T>) => void): void;
  }

  export interface WriteBatch {
    set(documentRef: DocumentReference, data: any, options?: any): WriteBatch;
    update(documentRef: DocumentReference, data: any): WriteBatch;
    delete(documentRef: DocumentReference): WriteBatch;
    commit(): Promise<void>;
  }

  export function getFirestore(app?: any): Firestore;
  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference;
  export function collection(reference: CollectionReference | DocumentReference, path: string, ...pathSegments: string[]): CollectionReference;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference;
  export function doc(reference: CollectionReference, path?: string): DocumentReference;
  export function setDoc(reference: DocumentReference, data: any, options?: any): Promise<void>;
  export function updateDoc(reference: DocumentReference, data: any): Promise<void>;
  export function deleteDoc(reference: DocumentReference): Promise<void>;
  export function getDocs(query: Query | CollectionReference): Promise<QuerySnapshot>;
  export function onSnapshot(
    reference: DocumentReference,
    onNext: (snapshot: DocumentSnapshot) => void,
    onError?: (error: any) => void
  ): Unsubscribe;
  export function onSnapshot(
    query: Query | CollectionReference,
    onNext: (snapshot: QuerySnapshot) => void,
    onError?: (error: any) => void
  ): Unsubscribe;
  export function query(collection: CollectionReference, ...queryConstraints: any[]): Query;
  export function orderBy(fieldPath: string, directionStr?: 'asc' | 'desc'): any;
  export function serverTimestamp(): any;
  export function writeBatch(firestore: Firestore): WriteBatch;
}
