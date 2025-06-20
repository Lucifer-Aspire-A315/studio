
import admin from 'firebase-admin';

// Ensure that NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is available.
const storageBucketEnv = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const gaeCredentialsEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;

console.log('--------------------------------------------------------------------');
console.log('[FirebaseAdmin] Initializing Firebase Admin SDK...');
console.log(`[FirebaseAdmin] Current NODE_ENV: ${process.env.NODE_ENV}`);

if (gaeCredentialsEnv) {
  console.log(`[FirebaseAdmin] Found GOOGLE_APPLICATION_CREDENTIALS: '${gaeCredentialsEnv}'`);
  console.log(`[FirebaseAdmin] Ensure this path is ABSOLUTE, uses forward slashes (e.g., "C:/path/to/key.json"), and the file is accessible and valid.`);
} else {
  console.error('[FirebaseAdmin] CRITICAL FAILURE: GOOGLE_APPLICATION_CREDENTIALS environment variable is NOT SET.');
  console.error('[FirebaseAdmin] The Admin SDK needs this to authenticate, especially for local development or non-Google Cloud environments.');
  console.error('[FirebaseAdmin] Please set it in your .env.local file.');
}

if (!storageBucketEnv) {
  console.warn(
    '[FirebaseAdmin] WARNING: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set in environment variables. ' +
    'This is required for the Admin SDK to know which storage bucket to use. ' +
    'Please set it in your .env.local file (e.g., NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com).'
  );
} else {
  console.log(`[FirebaseAdmin] Found NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${storageBucketEnv}`);
}

let adminApp: admin.app.App | undefined = undefined;
let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

if (admin.apps.length === 0) {
  console.log('[FirebaseAdmin] No Firebase Admin app initialized yet. Attempting initialization...');
  if (gaeCredentialsEnv && storageBucketEnv) {
    try {
      adminApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(), // This will use GOOGLE_APPLICATION_CREDENTIALS
        storageBucket: storageBucketEnv,
      });
      console.log('[FirebaseAdmin] SUCCESS: Firebase Admin SDK initialized successfully via admin.initializeApp().');
    } catch (error: any) {
      console.error('--------------------------------------------------------------------');
      console.error('[FirebaseAdmin] CRITICAL ERROR during admin.initializeApp():');
      console.error('Error Message:', error.message);
      if (error.code) {
        console.error('Error Code:', error.code);
      }
      console.error("Error Stack (full):", error.stack);
      console.error(
        '[FirebaseAdmin] TROUBLESHOOTING TIPS:\n' +
        `1. GOOGLE_APPLICATION_CREDENTIALS: Is the path '${gaeCredentialsEnv}' correct? Does the file exist? Is it a valid JSON key file?\n` +
        `2. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Is '${storageBucketEnv}' the correct bucket name?\n` +
        '3. Have you restarted your Next.js development server (npm run dev) after changing .env.local?\n' +
        '4. If on Windows, ensure paths use forward slashes (e.g., "C:/path/to/key.json").'
      );
      console.error('--------------------------------------------------------------------');
    }
  } else {
    console.error('[FirebaseAdmin] SKIPPING INITIALIZATION: Missing GOOGLE_APPLICATION_CREDENTIALS or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.');
  }
} else {
  console.log('[FirebaseAdmin] Firebase Admin SDK app was already initialized. Using existing app.');
  adminApp = admin.apps[0]; // Use the first initialized app
}

if (adminApp) {
  try {
    adminDb = admin.firestore(adminApp);
    adminStorage = admin.storage(adminApp);
    if (adminDb && adminStorage) {
        console.log('[FirebaseAdmin] Firestore and Storage instances obtained successfully from the initialized app.');
    } else {
        if (!adminDb) console.error('[FirebaseAdmin] FAILED to obtain Firestore instance from app.');
        if (!adminStorage) console.error('[FirebaseAdmin] FAILED to obtain Storage instance from app.');
    }
  } catch (error: any) {
    console.error('[FirebaseAdmin] Error obtaining Firestore/Storage instance from an initialized app:', error.message, error.stack);
  }
} else {
    console.error('[FirebaseAdmin] CRITICAL: No active Firebase Admin app available. Firestore and Storage instances will be null.');
}
console.log('--------------------------------------------------------------------');

export { admin, adminDb, adminStorage };
