
'use server';

import { cookies } from 'next/headers';
import { adminStorage } from '@/lib/firebaseAdmin'; // Import Admin SDK storage
import { Buffer } from 'buffer'; // Node.js Buffer
import { randomUUID } from 'crypto';

interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadFileAction(formData: FormData): Promise<FileUploadResponse> {
  console.log("[FileUploadAction - AdminSDK] Action initiated.");

  if (!adminStorage) {
    const adminInitError = "SERVER CONFIGURATION ERROR: Firebase Admin Storage not initialized. This means the Firebase Admin SDK failed to initialize when the server started. PLEASE CHECK YOUR SERVER LOGS (terminal output from `npm run dev`) for detailed error messages from 'src/lib/firebaseAdmin.ts'. Common causes: incorrect GOOGLE_APPLICATION_CREDENTIALS path, invalid service account key, or missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable. The file cannot be uploaded.";
    console.error("[FileUploadAction - AdminSDK] CRITICAL ERROR:", adminInitError);
    return { success: false, error: adminInitError };
  }
  
  const file = formData.get('file') as File | null;
  const fileName = formData.get('fileName') as string | null;

  if (!file || !fileName) {
    console.error("[FileUploadAction - AdminSDK] Critical error: No file or filename provided in FormData.");
    return { success: false, error: 'No file or filename provided.' };
  }
  
  const cookieStore = cookies();
  const userIdCookie = await cookieStore.get('user_id');
  const userId = userIdCookie?.value;
  
  let uploadPath: string;
  const uniqueFileName = `${Date.now()}-${encodeURIComponent(fileName)}`;

  if (userId) {
    console.log(`[FileUploadAction - AdminSDK] User ${userId} attempting to upload file: ${fileName} (Size: ${file.size} bytes, Type: ${file.type})`);
    uploadPath = `uploads/${userId}/${uniqueFileName}`;
  } else {
    // No user session, this is likely a signup process.
    // Create a temporary, unique path for pending partner applications.
    const tempId = randomUUID();
    uploadPath = `uploads/pending-partners/${tempId}/${uniqueFileName}`;
    console.log(`[FileUploadAction - AdminSDK] No user session found. Uploading to temporary path: ${uploadPath}`);
  }


  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = adminStorage.bucket(); 
    const fileUploadRef = bucket.file(uploadPath);

    console.log(`[FileUploadAction - AdminSDK] Uploading to Firebase Storage path: ${uploadPath} using Admin SDK.`);
    
    await fileUploadRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    console.log(`[FileUploadAction - AdminSDK] File uploaded successfully to path: ${uploadPath}.`);

    const [downloadUrl] = await fileUploadRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    console.log(`[FileUploadAction - AdminSDK] Generated signed URL for ${uploadPath}: ${downloadUrl.substring(0, 100)}...`);

    return {
      success: true,
      url: downloadUrl,
    };

  } catch (error: any)
 {
    console.error(`[FileUploadAction - AdminSDK] Firebase Admin SDK Storage upload error for file ${fileName}:`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code); // Firebase errors often have a code
    console.error("Error Stack:", error.stack);

    let userFriendlyMessage = 'Failed to upload file using Admin SDK due to a server error.';
    
    if (error.code) {
      switch (error.code) {
        case 'storage/unauthenticated':
          userFriendlyMessage = "Admin SDK Storage error: Unauthenticated. This is unexpected with Admin SDK if initialized. Check service account permissions.";
          break;
        case 'storage/unauthorized':
          userFriendlyMessage = `Admin SDK Storage error: Unauthorized for path ${error.customData?.path || 'unknown'}. Ensure the service account has 'Storage Object Admin' or equivalent IAM role in Google Cloud.`;
          break;
        case 'storage/object-not-found':
          userFriendlyMessage = "Admin SDK Storage error: Object not found. This is strange during an upload.";
          break;
        case 'storage/bucket-not-found':
          userFriendlyMessage = `Admin SDK Storage error: Bucket not found. Ensure NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set correctly and the bucket exists.`;
          break;
        default:
          userFriendlyMessage = `Admin SDK Storage error (${error.code}): ${error.message}` || userFriendlyMessage;
      }
    } else if (error.message) {
        userFriendlyMessage = error.message;
    }
    
    // Add more specific hints based on common Admin SDK initialization errors
    if (error.message && error.message.includes('Could not load the default credentials')) {
        userFriendlyMessage += ' This strongly indicates an issue with Firebase Admin SDK initialization - service account credentials (GOOGLE_APPLICATION_CREDENTIALS) might be missing, path incorrect, or file invalid. Check server logs!';
    }
    if (error.message && error.message.includes('storageBucket is required')) {
        userFriendlyMessage += ' The storageBucket might not be configured for the Admin SDK. Ensure NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set and used in firebaseAdmin.ts. Check server logs!';
    }
     if (error.message && error.message.includes('Forbidden') || (error.code && error.code === 403)) {
        userFriendlyMessage += ' "Forbidden" or "Permission denied" from Admin SDK usually points to IAM permission issues for the service account on Google Cloud. Ensure it has "Storage Object Admin" role or equivalent for the target bucket.';
    }


    return { success: false, error: userFriendlyMessage };
  }
}
