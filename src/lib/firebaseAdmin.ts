
import admin from 'firebase-admin';

// --- Environment Variable Retrieval ---
const storageBucketEnv = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const gaeCredentialsPathEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccountKeyJsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;

// --- Admin SDK Initialization ---
let adminApp: admin.app.App | undefined = undefined;
let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

console.log('--------------------------------------------------------------------');
console.log('[FirebaseAdmin] Initializing Firebase Admin SDK...');

if (admin.apps.length > 0) {
  console.log('[FirebaseAdmin] Firebase Admin SDK app was already initialized. Using existing app.');
  adminApp = admin.apps[0];
} else {
  // --- Log environment state for diagnostics ---
  console.log(`[FirebaseAdmin] Current NODE_ENV: ${process.env.NODE_ENV}`);
  if (gaeCredentialsPathEnv) {
    console.log(`[FirebaseAdmin] Found GOOGLE_APPLICATION_CREDENTIALS (path): '${gaeCredentialsPathEnv}'`);
  } else {
    console.log(`[FirebaseAdmin] GOOGLE_APPLICATION_CREDENTIALS (path) is NOT set.`);
  }
  if (serviceAccountKeyJsonEnv) {
    console.log(`[FirebaseAdmin] Found FIREBASE_SERVICE_ACCOUNT_KEY_JSON (direct JSON content).`);
  } else {
    console.log(`[FirebaseAdmin] FIREBASE_SERVICE_ACCOUNT_KEY_JSON (direct JSON content) is NOT set.`);
  }
  if (storageBucketEnv) {
      if (!storageBucketEnv.endsWith('.appspot.com')) {
        console.warn(`[FirebaseAdmin] WARNING: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET value "${storageBucketEnv}" does not look like a standard Firebase bucket name (expected format: your-project-id.appspot.com). Please verify.`);
      } else {
        console.log(`[FirebaseAdmin] Found NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${storageBucketEnv}`);
      }
  } else {
      console.error('[FirebaseAdmin] CRITICAL PRE-CHECK FAILED: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set. This is required for initialization.');
  }


  // --- Attempt Initialization ---
  let credential;

  // Method 1: Try initializing from direct JSON content first (more common for deployments)
  if (serviceAccountKeyJsonEnv) {
    console.log('[FirebaseAdmin] Attempting initialization with FIREBASE_SERVICE_ACCOUNT_KEY_JSON (direct JSON content)...');
    try {
      const serviceAccount = JSON.parse(serviceAccountKeyJsonEnv);
      credential = admin.credential.cert(serviceAccount);
      console.log('[FirebaseAdmin] Successfully parsed JSON from FIREBASE_SERVICE_ACCOUNT_KEY_JSON.');
    } catch (e: any) {
      console.error('[FirebaseAdmin] CRITICAL ERROR parsing JSON from FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable. The JSON content is likely malformed. Please check your .env.local file. Error:', e.message);
      // Stop further attempts if parsing fails
    }
  }

  // Method 2: If direct JSON failed or wasn't present, try the file path method.
  if (!credential && gaeCredentialsPathEnv) {
    console.log('[FirebaseAdmin] Direct JSON method not used or failed. Attempting initialization with GOOGLE_APPLICATION_CREDENTIALS (file path)...');
    try {
      // This method throws an error if the path is invalid or file is unreadable, which will be caught below.
      credential = admin.credential.applicationDefault();
      console.log('[FirebaseAdmin] Credential object seems to be prepared from file path.');
    } catch (e: any) {
       console.error('[FirebaseAdmin] Could not prepare credentials from file path. Error:', e.message);
    }
  }

  // --- Final Initialization Step ---
  if (credential && storageBucketEnv) {
    try {
      adminApp = admin.initializeApp({
        credential,
        storageBucket: storageBucketEnv,
      });
      console.log('[FirebaseAdmin] SUCCESS: Firebase Admin SDK initialized successfully via admin.initializeApp().');
    } catch (error: any) {
      console.error('--------------------------------------------------------------------');
      console.error('[FirebaseAdmin] CRITICAL ERROR during admin.initializeApp():');
      console.error('Error Message:', error.message);
      if (error.code) console.error('Error Code:', error.code);
      console.error("Error Stack (full):", error.stack);
    }
  } else {
     console.error('[FirebaseAdmin] SKIPPING INITIALIZATION: No valid credential method succeeded or storage bucket is missing.');
  }
}


// --- Export SDK Instances ---
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
