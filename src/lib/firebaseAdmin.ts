
import admin from 'firebase-admin';

// Ensure that NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is available.
// It's good practice to have this in your .env file.
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
let serviceAccountPath: string | undefined = undefined;

console.log('[FirebaseAdmin] Reading environment variables for Admin SDK initialization...');

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  console.log(`[FirebaseAdmin] Found GOOGLE_APPLICATION_CREDENTIALS: ${serviceAccountPath}`);
} else {
  console.error('[FirebaseAdmin] CRITICAL FAILURE: GOOGLE_APPLICATION_CREDENTIALS environment variable is NOT SET. Firebase Admin SDK cannot initialize without it for most environments.');
}

if (!storageBucket) {
  console.warn(
    '[FirebaseAdmin] WARNING: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set in environment variables. ' +
    'Firebase Admin SDK Storage operations might require it to be explicitly set during initialization ' +
    'if not automatically inferred by the environment (e.g., outside Google Cloud). ' +
    'Please set it in your .env.local file (e.g., NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com).'
  );
} else {
  console.log(`[FirebaseAdmin] Found NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${storageBucket}`);
}

if (!admin.apps.length) {
  console.log('[FirebaseAdmin] No Firebase Admin app initialized yet. Attempting initialization...');
  try {
    const appOptions: admin.AppOptions = {};
    if (storageBucket) {
      appOptions.storageBucket = storageBucket;
    }

    // The Firebase Admin SDK will automatically look for GOOGLE_APPLICATION_CREDENTIALS
    // if no credential option is explicitly passed to initializeApp.
    // If GOOGLE_APPLICATION_CREDENTIALS is not set or points to an invalid file,
    // this initializeApp call will likely throw an error.
    admin.initializeApp(appOptions);
    console.log('[FirebaseAdmin] SUCCESS: Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('--------------------------------------------------------------------');
    console.error('[FirebaseAdmin] CRITICAL ERROR initializing Firebase Admin SDK:');
    console.error('Error Message:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    console.error("Error Stack:", error.stack); // Log the full stack trace
    console.error(
      '[FirebaseAdmin] Ensure your environment is correctly configured with service account credentials. ' +
      '1. The GOOGLE_APPLICATION_CREDENTIALS environment variable must be set to the ABSOLUTE path of your service account key JSON file. ' +
      '   Check for typos in the path and ensure the file exists and is readable. ' +
      '   For Windows paths in .env files, use forward slashes (e.g., "C:/path/to/key.json") or double backslashes (e.g., "C:\\\\path\\\\to\\\\key.json"). ' +
      '2. The service account key JSON file itself must be valid and not corrupted. ' +
      '3. Ensure NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set in your .env file if the Admin SDK cannot infer it (e.g., your-project-id.appspot.com). ' +
      '4. If deploying, ensure the runtime environment has these variables set and the service account has necessary IAM permissions (like "Storage Object Admin").'
    );
    if (error.message && error.message.includes('Could not load the default credentials')) {
        console.error('[FirebaseAdmin] Specific Hint: The SDK could not load default credentials. This usually means GOOGLE_APPLICATION_CREDENTIALS is not set, the path is wrong, or the file is invalid.');
    }
    if (error.message && error.message.includes('The "credential" argument must be a Credential object')) {
        console.error('[FirebaseAdmin] Specific Hint: This might happen if GOOGLE_APPLICATION_CREDENTIALS points to an invalid file or is not set, and the SDK cannot find other suitable credentials.');
    }
     if (error.message && error.message.includes('ENOENT')) {
        console.error(`[FirebaseAdmin] Specific Hint: 'ENOENT' (Error NO ENTry or Error NO ENTity) often means the file path specified in GOOGLE_APPLICATION_CREDENTIALS ('${serviceAccountPath}') was not found. Double-check the path.`);
    }
    console.error('--------------------------------------------------------------------');
  }
} else {
  console.log('[FirebaseAdmin] Firebase Admin SDK app was already initialized. Found active apps:', admin.apps.length);
}

let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

if (admin.apps.length > 0 && admin.apps[0]) { // Check if the first app exists
  try {
    adminDb = admin.firestore(admin.apps[0]); // Get firestore from the specific app
    adminStorage = admin.storage(admin.apps[0]); // Get storage from the specific app
    if (adminDb && adminStorage) {
        console.log('[FirebaseAdmin] Firestore and Storage instances obtained successfully from the initialized app.');
    } else {
        console.error('[FirebaseAdmin] FAILED to obtain Firestore and/or Storage instances even though an admin app exists. adminDb:', adminDb, 'adminStorage:', adminStorage);
    }
  } catch (error: any) {
    console.error('[FirebaseAdmin] Error getting Firestore/Storage instance from an initialized app:', error.message, error.stack);
  }
} else {
    console.error('[FirebaseAdmin] CRITICAL: No active Firebase Admin app found after initialization attempt. Firestore and Storage instances will be null.');
}


export { admin, adminDb, adminStorage };
