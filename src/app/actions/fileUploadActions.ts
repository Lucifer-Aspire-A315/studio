
'use server';

import { cookies } from 'next/headers';
import { adminStorage } from '@/lib/firebaseAdmin'; // Import Admin SDK storage
import { Buffer } from 'buffer'; // Node.js Buffer

interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadFileAction(formData: FormData): Promise<FileUploadResponse> {
  console.log("[FileUploadAction - AdminSDK] Action initiated.");
  
  try {
    await cookies().get('priming-cookie-upload-admin'); 
  } catch (e: any) {
    console.warn("[FileUploadAction - AdminSDK] Priming cookie read failed (this is often benign):", e.message);
  }

  const file = formData.get('file') as File | null;
  const fileName = formData.get('fileName') as string | null;

  if (!file || !fileName) {
    console.error("[FileUploadAction - AdminSDK] Critical error: No file or filename provided in FormData.");
    return { success: false, error: 'No file or filename provided.' };
  }

  const userIdCookie = cookies().get('user_id');
  const userId = userIdCookie?.value;

  if (!userId) {
    console.warn(`[FileUploadAction - AdminSDK] Authentication check failed: 'user_id' cookie was not found or has no value.`);
    // Log all available cookies for debugging
    try {
        const allCookies = cookies().getAll();
        console.log("[FileUploadAction - AdminSDK] All available cookies at time of auth failure:", allCookies.map(c => ({name: c.name, value: c.value ? `present (length: ${c.value.length})` : 'empty/null', path: c.path, domain: c.domain })));
    } catch (e: any) {
        console.error("[FileUploadAction - AdminSDK] Could not log all cookies:", e.message);
    }
    return { success: false, error: 'User not authenticated for file upload. Session details missing.' };
  }
  
  if (!adminStorage) {
    console.error("[FileUploadAction - AdminSDK] CRITICAL ERROR: Firebase Admin Storage is NOT INITIALIZED. Cannot upload file. This usually means the Firebase Admin SDK failed to initialize when the server started. PLEASE CHECK YOUR SERVER LOGS (terminal output from `npm run dev`) for detailed error messages starting with '[FirebaseAdmin]' from the `src/lib/firebaseAdmin.ts` file. Common causes are incorrect GOOGLE_APPLICATION_CREDENTIALS path or missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variables.");
    return { success: false, error: 'SERVER CONFIGURATION ERROR: Firebase Admin Storage not initialized. Check server logs for details.' };
  }

  console.log(`[FileUploadAction - AdminSDK] User ${userId} attempting to upload file: ${fileName} (Size: ${file.size} bytes, Type: ${file.type})`);

  try {
    const uniqueFileName = `${Date.now()}-${encodeURIComponent(fileName)}`;
    const filePath = `uploads/${userId}/${uniqueFileName}`; // Path includes userId
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = adminStorage.bucket(); 
    const fileUpload = bucket.file(filePath);

    console.log(`[FileUploadAction - AdminSDK] Uploading to Firebase Storage path: ${filePath} using Admin SDK.`);
    
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    console.log(`[FileUploadAction - AdminSDK] File uploaded successfully for user ${userId} to path: ${filePath}.`);

    const [downloadUrl] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', 
    });

    console.log(`[FileUploadAction - AdminSDK] Generated signed URL for ${filePath}: ${downloadUrl}`);

    return {
      success: true,
      url: downloadUrl,
    };

  } catch (error: any) {
    console.error(`[FileUploadAction - AdminSDK] Firebase Admin SDK Storage upload error for user ${userId}, file ${fileName}:`, error.message, error.stack);
    let errorMessage = 'Failed to upload file using Admin SDK due to a server error.';
    
    if (error.code) { 
        errorMessage = `Admin SDK Storage error (${error.code}): ${error.message}` || errorMessage;
    } else if (error.message) {
        errorMessage = error.message;
    }
    
    if (error.message && error.message.includes('Could not load the default credentials')) {
        errorMessage += ' This indicates an issue with Firebase Admin SDK initialization - service account credentials might be missing or incorrectly configured in your server environment (GOOGLE_APPLICATION_CREDENTIALS).';
    }
    if (error.message && error.message.includes('storageBucket is required')) {
        errorMessage += ' The storageBucket might not be configured for the Admin SDK. Ensure NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set and used in firebaseAdmin.ts.';
    }
     if (error.message && error.message.includes('Forbidden')) {
        errorMessage += ' "Forbidden" or "Permission denied" from Admin SDK usually points to IAM permission issues for the service account on Google Cloud. Ensure it has "Storage Object Admin" role or equivalent.';
    }

    return { success: false, error: errorMessage };
  }
}
