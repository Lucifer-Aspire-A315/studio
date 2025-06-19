
import admin from 'firebase-admin';

// Ensure that NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is available.
// It's good practice to have this in your .env file.
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!storageBucket) {
  console.warn(
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set in environment variables. ' +
    'Firebase Admin SDK Storage operations might require it to be explicitly set during initialization ' +
    'if not automatically inferred by the environment (e.g., outside Google Cloud).'
  );
}

if (!admin.apps.length) {
  try {
    // If GOOGLE_APPLICATION_CREDENTIALS environment variable is set (pointing to your service account key JSON),
    // or if running in a Google Cloud environment (like App Engine, Cloud Functions, Cloud Run)
    // with a default service account that has appropriate permissions,
    // initializeApp() will use them automatically.
    admin.initializeApp({
      storageBucket: storageBucket, // Explicitly providing it can be helpful
    });
    console.log('[FirebaseAdmin] Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('[FirebaseAdmin] Error initializing Firebase Admin SDK:', error.message);
    console.error(
      '[FirebaseAdmin] Ensure your environment is configured with service account credentials. ' +
      'For local development, set the GOOGLE_APPLICATION_CREDENTIALS environment variable. ' +
      'On deployed environments, ensure the service account has necessary permissions.'
    );
  }
}

let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

try {
  if (admin.apps.length > 0) {
    adminDb = admin.firestore();
    adminStorage = admin.storage(); // This gets the default bucket.
  }
} catch (error: any) {
    console.error('[FirebaseAdmin] Error getting Firestore/Storage instance from initialized app:', error.message);
}


export { admin, adminDb, adminStorage };
