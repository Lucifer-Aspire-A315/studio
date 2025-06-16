
import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // For Firebase Auth later

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  // Initialize Firestore with experimentalForceLongPolling or memoryLocalCache if needed for specific environments like StackBlitz/WebContainers
  // initializeFirestore(app, { experimentalForceLongPolling: true });
  // Using memoryLocalCache for environments where indexedDB might be restricted or to avoid persistence warnings.
  initializeFirestore(app, { localCache: memoryLocalCache() });
} else {
  app = getApp();
}

const db = getFirestore(app);
// const auth = getAuth(app); // For Firebase Auth later, if needed

export { db };

