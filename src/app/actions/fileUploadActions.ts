
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

  console.log(`[FileUploadAction - AdminSDK] Attempted to read 'user_id' cookie. Found: ${userIdCookie ? "Cookie object exists" : "Cookie object MISSING"}, Value: ${userId || "Not Found/Empty"}`);

  if (!userId) {
    console.warn(`[FileUploadAction - AdminSDK] Authentication check failed: 'user_id' cookie was not found or has no value.`);
    try {
        const allCookies = cookies().getAll();
        console.log("[FileUploadAction - AdminSDK] All available cookies at time of auth failure:", allCookies.map(c => ({name: c.name, value: c.value ? `present (length: ${c.value.length})` : 'empty/null', path: c.path, domain: c.domain })));
    } catch (e: any) {
        console.error("[FileUploadAction - AdminSDK] Could not log all cookies:", e.message);
    }
    return { success: false, error: 'User not authenticated for file upload. Session details missing.' };
  }
  
  if (!adminStorage) {
    console.error("[FileUploadAction - AdminSDK] Firebase Admin Storage is not initialized. Check 'src/lib/firebaseAdmin.ts' and server logs for initialization errors.");
    return { success: false, error: 'Firebase Admin Storage not initialized. Cannot upload file.' };
  }

  console.log(`[FileUploadAction - AdminSDK] User ${userId} attempting to upload file: ${fileName} (Size: ${file.size} bytes, Type: ${file.type})`);

  try {
    const uniqueFileName = `${Date.now()}-${encodeURIComponent(fileName)}`;
    const filePath = `uploads/${userId}/${uniqueFileName}`; // Path includes userId
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = adminStorage.bucket(); // Uses the default bucket specified during admin.initializeApp
    const fileUpload = bucket.file(filePath);

    console.log(`[FileUploadAction - AdminSDK] Uploading to Firebase Storage path: ${filePath} using Admin SDK.`);
    
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
        // You can add more metadata here if needed
        // customMetadata: {
        //   uploadedBy: userId 
        // }
      },
      // You might want to make it public if direct URLs are needed without signing
      // public: true, 
      // Or resumable: false if you encounter issues with resumable uploads for smaller files
    });

    console.log(`[FileUploadAction - AdminSDK] File uploaded successfully for user ${userId} to path: ${filePath}.`);

    // Get a signed URL for the file - valid for a long time.
    // Note: Signed URLs are good for controlled access. If files are meant to be public,
    // you can make the object public during upload or set public bucket/folder permissions.
    const [downloadUrl] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // A far future date for a "permanent" URL
    });

    console.log(`[FileUploadAction - AdminSDK] Generated signed URL for ${filePath}: ${downloadUrl}`);

    return {
      success: true,
      url: downloadUrl,
    };

  } catch (error: any) {
    console.error(`[FileUploadAction - AdminSDK] Firebase Admin SDK Storage upload error for user ${userId}, file ${fileName}:`, error.message, error.stack);
    let errorMessage = 'Failed to upload file using Admin SDK due to a server error.';
    
    if (error.code) { // Firebase Admin SDK errors often have a code
        errorMessage = `Admin SDK Storage error (${error.code}): ${error.message}` || errorMessage;
    } else if (error.message) {
        errorMessage = error.message;
    }
    
    if (error.message && error.message.includes('Could not load the default credentials')) {
        errorMessage += ' This indicates an issue with Firebase Admin SDK initialization - service account credentials might be missing or incorrectly configured in your server environment.';
    }
    if (error.message && error.message.includes('storageBucket is required')) {
        errorMessage += ' The storageBucket might not be configured for the Admin SDK. Ensure NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set and used in firebaseAdmin.ts.';
    }


    return { success: false, error: errorMessage };
  }
}
