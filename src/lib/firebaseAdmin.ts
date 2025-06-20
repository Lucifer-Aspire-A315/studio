
import admin from 'firebase-admin';

// Ensure that NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is available.
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
let serviceAccountPath: string | undefined = undefined;

console.log('[FirebaseAdmin] Reading environment variables for Admin SDK initialization...');
console.log(`[FirebaseAdmin] NODE_ENV: ${process.env.NODE_ENV}`);

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  console.log(`[FirebaseAdmin] Found GOOGLE_APPLICATION_CREDENTIALS: '${serviceAccountPath}' (ensure this path is correct and the file is accessible).`);
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
    console.log('[FirebaseAdmin] SUCCESS: Firebase Admin SDK initialized successfully. Active apps:', admin.apps.length);
  } catch (error: any) {
    console.error('--------------------------------------------------------------------');
    console.error('[FirebaseAdmin] CRITICAL ERROR initializing Firebase Admin SDK:');
    console.error('Error Message:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    console.error("Error Stack (full):", error.stack); // Log the full stack trace
    console.error(
      '[FirebaseAdmin] PLEASE CHECK THE FOLLOWING:\n' +
      `1. GOOGLE_APPLICATION_CREDENTIALS: Is it set in your .env.local file? Current value read by server: '${process.env.GOOGLE_APPLICATION_CREDENTIALS || 'NOT SET'}'\n` +
      '   - Does this path point to your service account key JSON file? (Use forward slashes for paths, e.g., "C:/path/to/key.json")\n' +
      '   - Does the JSON file actually exist at that path and is it readable by the Node.js process?\n' +
      '   - Is the JSON file itself valid (not corrupted)?\n' +
      `2. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Is it set in your .env.local? Current value: '${storageBucket || 'NOT SET'}' (e.g., 'your-project-id.appspot.com')\n` +
      '3. Restart your Next.js development server (npm run dev) after making any changes to .env.local.\n' +
      '4. If deploying, ensure these environment variables are set correctly in your hosting provider\'s settings.'
    );
    if (error.message && error.message.includes('Could not load the default credentials')) {
        console.error('[FirebaseAdmin] Specific Hint: The SDK could not load default credentials. This usually means GOOGLE_APPLICATION_CREDENTIALS is not set, the path is wrong, or the file is invalid.');
    }
    if (error.message && error.message.includes('The "credential" argument must be a Credential object')) {
        console.error('[FirebaseAdmin] Specific Hint: This might happen if GOOGLE_APPLICATION_CREDENTIALS points to an invalid file or is not set, and the SDK cannot find other suitable credentials.');
    }
     if (error.message && error.message.includes('ENOENT')) { // Error NO ENTity or Error NO ENTry
        console.error(`[FirebaseAdmin] Specific Hint: 'ENOENT' often means the file path specified in GOOGLE_APPLICATION_CREDENTIALS ('${serviceAccountPath || 'path not read' }') was not found or is not accessible. Double-check the path and file permissions.`);
    }
    console.error('--------------------------------------------------------------------');
  }
} else {
  console.log('[FirebaseAdmin] Firebase Admin SDK app was already initialized. Found active apps:', admin.apps.length);
}

let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

if (admin.apps.length > 0 && admin.apps[0]) {
  try {
    adminDb = admin.firestore(admin.apps[0]); // Get firestore from the specific app
    adminStorage = admin.storage(admin.apps[0]); // Get storage from the specific app
    if (adminDb && adminStorage) {
        console.log('[FirebaseAdmin] Firestore and Storage instances obtained successfully from the initialized app.');
    } else {
        if (!adminDb) console.error('[FirebaseAdmin] FAILED to obtain Firestore instance.');
        if (!adminStorage) console.error('[FirebaseAdmin] FAILED to obtain Storage instance.');
    }
  } catch (error: any) {
    console.error('[FirebaseAdmin] Error getting Firestore/Storage instance from an initialized app:', error.message, error.stack);
  }
} else {
    console.error('[FirebaseAdmin] CRITICAL: No active Firebase Admin app found after initialization attempt. Firestore and Storage instances will be null.');
}


export { admin, adminDb, adminStorage };
