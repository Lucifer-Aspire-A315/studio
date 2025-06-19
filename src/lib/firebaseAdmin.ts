
import admin from 'firebase-admin';

// Ensure that NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is available.
// It's good practice to have this in your .env file.
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!storageBucket) {
  console.warn(
    '[FirebaseAdmin] WARNING: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set in environment variables. ' +
    'Firebase Admin SDK Storage operations might require it to be explicitly set during initialization ' +
    'if not automatically inferred by the environment (e.g., outside Google Cloud). ' +
    'Please set it in your .env.local file (e.g., NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com).'
  );
}

if (!admin.apps.length) {
  try {
    // If GOOGLE_APPLICATION_CREDENTIALS environment variable is set (pointing to your service account key JSON),
    // or if running in a Google Cloud environment (like App Engine, Cloud Functions, Cloud Run)
    // with a default service account that has appropriate permissions,
    // initializeApp() will use them automatically.
    console.log('[FirebaseAdmin] Attempting to initialize Firebase Admin SDK...');
    const appOptions: admin.AppOptions = {};
    if (storageBucket) {
      appOptions.storageBucket = storageBucket;
    }
    // The GOOGLE_APPLICATION_CREDENTIALS env var should be automatically picked up if set.
    // If it's not set, or the file is invalid, this will throw an error.
    admin.initializeApp(appOptions);
    console.log('[FirebaseAdmin] Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('--------------------------------------------------------------------');
    console.error('[FirebaseAdmin] CRITICAL ERROR initializing Firebase Admin SDK:');
    console.error('Error Message:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    console.error(
      '[FirebaseAdmin] Ensure your environment is configured with service account credentials. ' +
      'For local development, set the GOOGLE_APPLICATION_CREDENTIALS environment variable ' +
      'to the absolute path of your service account key JSON file. ' +
      'Example: GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json". ' +
      'Also ensure NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set in your .env.local file.'
    );
    if (error.message && error.message.includes('Could not load the default credentials')) {
        console.error('[FirebaseAdmin] Specific Hint: The SDK could not load default credentials. This usually means GOOGLE_APPLICATION_CREDENTIALS is not set, the path is wrong, or the file is invalid.');
    }
    if (error.message && error.message.includes('The "credential" argument must be a Credential object')) {
        console.error('[FirebaseAdmin] Specific Hint: This might happen if GOOGLE_APPLICATION_CREDENTIALS points to an invalid file or is not set, and the SDK cannot find other suitable credentials.');
    }
    console.error('--------------------------------------------------------------------');
  }
}

let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

try {
  if (admin.apps.length > 0) {
    adminDb = admin.firestore();
    adminStorage = admin.storage(); // This gets the default bucket.
    if (adminStorage) {
        console.log('[FirebaseAdmin] Firestore and Storage instances obtained successfully.');
    } else {
        console.error('[FirebaseAdmin] Failed to obtain Storage instance even though admin app exists.');
    }
  } else {
    console.error('[FirebaseAdmin] Admin SDK app not initialized (admin.apps.length is 0). Firestore and Storage instances will be null.');
  }
} catch (error: any) {
    console.error('[FirebaseAdmin] Error getting Firestore/Storage instance from initialized app:', error.message);
}


export { admin, adminDb, adminStorage };

