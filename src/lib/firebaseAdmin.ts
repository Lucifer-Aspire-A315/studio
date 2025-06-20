
import admin from 'firebase-admin';

// Ensure that NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is available.
const storageBucketEnv = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const gaeCredentialsPathEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccountKeyJsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;

console.log('--------------------------------------------------------------------');
console.log('[FirebaseAdmin] Initializing Firebase Admin SDK...');
console.log(`[FirebaseAdmin] Current NODE_ENV: ${process.env.NODE_ENV}`);

if (gaeCredentialsPathEnv) {
  console.log(`[FirebaseAdmin] Found GOOGLE_APPLICATION_CREDENTIALS (path): '${gaeCredentialsPathEnv}'`);
  console.log(`[FirebaseAdmin] Ensure this path is ABSOLUTE, uses forward slashes (e.g., "C:/path/to/key.json" or "/path/to/key.json"), and the file is accessible and valid.`);
} else if (serviceAccountKeyJsonEnv) {
  console.log('[FirebaseAdmin] Found FIREBASE_SERVICE_ACCOUNT_KEY_JSON (direct JSON content). This will be used if path-based init fails or is not set.');
} else {
  console.error('[FirebaseAdmin] CRITICAL FAILURE: NEITHER GOOGLE_APPLICATION_CREDENTIALS (file path) NOR FIREBASE_SERVICE_ACCOUNT_KEY_JSON (direct JSON content) environment variable is set.');
  console.error('[FirebaseAdmin] The Admin SDK needs one of these to authenticate.');
}

if (!storageBucketEnv) {
  console.warn(
    '[FirebaseAdmin] WARNING: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set in environment variables. ' +
    'This is required for the Admin SDK to know which storage bucket to use. ' +
    'Please set it in your .env.local file (e.g., NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com). Without it, Admin Storage might fail.'
  );
} else {
  console.log(`[FirebaseAdmin] Found NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${storageBucketEnv}`);
  if (!storageBucketEnv.endsWith('.appspot.com')) {
    console.warn(`[FirebaseAdmin] WARNING: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET value "${storageBucketEnv}" does not look like a standard Firebase bucket name (expected format: your-project-id.appspot.com). Please verify.`);
  }
}

let adminApp: admin.app.App | undefined = undefined;
let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

if (admin.apps.length === 0) {
  console.log('[FirebaseAdmin] No Firebase Admin app initialized yet. Attempting initialization...');
  if ((gaeCredentialsPathEnv || serviceAccountKeyJsonEnv) && storageBucketEnv) {
    try {
      let credential;
      if (gaeCredentialsPathEnv) {
        console.log('[FirebaseAdmin] Attempting initialization with GOOGLE_APPLICATION_CREDENTIALS (file path).');
        credential = admin.credential.applicationDefault(); // Tries to load from GOOGLE_APPLICATION_CREDENTIALS path
      } else if (serviceAccountKeyJsonEnv) {
        console.log('[FirebaseAdmin] GOOGLE_APPLICATION_CREDENTIALS (file path) not found or invalid, attempting initialization with FIREBASE_SERVICE_ACCOUNT_KEY_JSON (direct JSON content).');
        try {
          const serviceAccount = JSON.parse(serviceAccountKeyJsonEnv);
          credential = admin.credential.cert(serviceAccount);
        } catch (e: any) {
          console.error('[FirebaseAdmin] CRITICAL ERROR parsing FIREBASE_SERVICE_ACCOUNT_KEY_JSON:', e.message);
          throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY_JSON: ${e.message}`);
        }
      }

      if (credential) {
        adminApp = admin.initializeApp({
          credential,
          storageBucket: storageBucketEnv,
        });
        console.log('[FirebaseAdmin] SUCCESS: Firebase Admin SDK initialized successfully via admin.initializeApp().');
      } else {
         // This case should ideally be caught by the top-level check for gaeCredentialsPathEnv or serviceAccountKeyJsonEnv
        console.error('[FirebaseAdmin] CRITICAL FAILURE: No valid credential method found (neither path nor direct JSON).');
      }

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
        `1. GOOGLE_APPLICATION_CREDENTIALS (file path): If used, is the path '${gaeCredentialsPathEnv || 'not set'}' correct? Does the file exist? Is it a valid JSON key file?\n` +
        `   - For Windows, use forward slashes in .env.local: "C:/path/to/your/key.json".\n` +
        `2. FIREBASE_SERVICE_ACCOUNT_KEY_JSON (direct content): If used, is the JSON content valid? Is it properly set in the environment variable?\n`+
        `3. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Is '${storageBucketEnv || 'not set'}' the correct bucket name (format: your-project-id.appspot.com)?\n` +
        '4. Have you restarted your Next.js development server (npm run dev) after changing .env.local or environment variables?\n' +
        '5. Is the service account key JSON file itself valid and not corrupted (whether used via path or direct content)?'
      );
      console.error('--------------------------------------------------------------------');
    }
  } else {
    let missingVars = [];
    if (!gaeCredentialsPathEnv && !serviceAccountKeyJsonEnv) missingVars.push("GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_KEY_JSON");
    if (!storageBucketEnv) missingVars.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    console.error(`[FirebaseAdmin] SKIPPING INITIALIZATION: Missing required environment variable(s): ${missingVars.join(', ')}. Please check your .env.local file or environment settings.`);
  }
} else {
  console.log('[FirebaseAdmin] Firebase Admin SDK app was already initialized. Using existing app.');
  adminApp = admin.apps[0];
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

    