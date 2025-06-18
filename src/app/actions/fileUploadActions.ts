
'use server';

import { cookies } from 'next/headers';
import { storage } from '@/lib/firebase'; // Import storage instance
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadFileAction(formData: FormData): Promise<FileUploadResponse> {
  console.log("[FileUploadAction] Action initiated.");
  await cookies().get('priming-cookie-upload'); // Priming read for cookies

  const file = formData.get('file') as File | null;
  const fileName = formData.get('fileName') as string | null;

  if (!file || !fileName) {
    console.error("[FileUploadAction] Critical error: No file or filename provided in FormData.");
    return { success: false, error: 'No file or filename provided.' };
  }

  const userIdCookie = cookies().get('user_id');
  const userId = userIdCookie?.value;

  console.log(`[FileUploadAction] Attempted to read 'user_id' cookie. Found: ${userIdCookie ? "Cookie object exists" : "Cookie object MISSING"}, Value: ${userId || "Not Found/Empty"}`);

  if (!userId) {
    console.warn(`[FileUploadAction] Authentication check failed: 'user_id' cookie was not found or has no value.`);
    try {
        const allCookies = cookies().getAll();
        console.log("[FileUploadAction] All available cookies at time of auth failure:", allCookies.map(c => ({name: c.name, value: c.value ? `present (length: ${c.value.length})` : 'empty/null', path: c.path, domain: c.domain })));
    } catch (e: any) {
        console.error("[FileUploadAction] Could not log all cookies:", e.message);
    }
    return { success: false, error: 'User not authenticated for file upload. Session details missing.' };
  }

  console.log(`[FileUploadAction] User ${userId} attempting to upload file: ${fileName} (Size: ${file.size} bytes, Type: ${file.type})`);

  try {
    const uniqueFileName = `${Date.now()}-${encodeURIComponent(fileName)}`;
    const filePath = `uploads/${userId}/${uniqueFileName}`; // Path includes userId
    const fileStorageRef = storageRef(storage, filePath);
    const arrayBuffer = await file.arrayBuffer();

    console.log(`[FileUploadAction] Uploading to Firebase Storage path: ${filePath}`);
    const uploadTask = uploadBytesResumable(fileStorageRef, arrayBuffer, {
      contentType: file.type,
    });

    await uploadTask; // Wait for upload to complete

    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    console.log(`[FileUploadAction] File uploaded successfully for user ${userId}. URL: ${downloadUrl}`);

    return {
      success: true,
      url: downloadUrl,
    };

  } catch (error: any) {
    console.error(`[FileUploadAction] Firebase Storage upload error for user ${userId}, file ${fileName}:`, error.code, error.message, error.stack);
    let errorMessage = 'Failed to upload file due to a server error.';
    if (error.code) {
      switch (error.code) {
        case 'storage/unauthorized':
          errorMessage = `Permission denied by Firebase Storage for path 'uploads/${userId}/...'. This often happens when the client Firebase SDK is used from a server environment (like this Server Action) because 'request.auth' in your Storage rules will likely be null. If your Storage rules for writes include 'request.auth != null' or 'request.auth.uid == userId', these conditions will fail. Review your Firebase Storage rules. For server-side uploads from trusted code that has already authenticated the user (like this action checking cookies), you might need to adjust your rules to allow writes based on path, or consider using the Firebase Admin SDK for uploads, which bypasses user-facing rules. Ensure the path 'uploads/${userId}/' is writable under your current rules configuration.`;
          break;
        case 'storage/canceled':
          errorMessage = 'Upload was canceled.';
          break;
        case 'storage/unknown':
          errorMessage = 'An unknown error occurred during Firebase Storage upload.';
          break;
        default:
          errorMessage = `Storage error (${error.code}): ${error.message}` || errorMessage;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
