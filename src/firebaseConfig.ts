// Firebase initialization and exports for the app
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

// Prefer environment variables (Vite) and fall back to the existing hard-coded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB1zqye8_phrbT-a_KEHj04pbYKE2N3vDc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sistema-seguridad-a2d26.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sistema-seguridad-a2d26',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sistema-seguridad-a2d26.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '6830682101',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:6830682101:web:a013da0efc5a7d2e027abc',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-2MM21KWTP3',
};

// Initialize or reuse the app (avoids multiple initializations during HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics is only available in browser runtime; guard to avoid SSR issues
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    // analytics will fail in some environments (e.g., private mode, blocked cookies); ignore
    // console.warn('Firebase analytics not available', err);
  }
}

// Auth export
const auth = getAuth(app);
// Prefer persistent login in browser localStorage
setPersistence(auth, browserLocalPersistence).catch(() => {
  // ignore persistence errors (e.g. if the environment does not allow localStorage)
});

export { app, analytics, auth, firebaseConfig };