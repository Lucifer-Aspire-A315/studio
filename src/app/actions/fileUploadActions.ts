
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
  const file = formData.get('file') as File | null;
  const fileName = formData.get('fileName') as string | null;
  // const fileType = formData.get('fileType') as string | null; // Available if needed

  if (!file || !fileName) {
    return { success: false, error: 'No file or filename provided.' };
  }
  
  let userId: string | undefined;
  try {
    await cookies().get('priming-cookie-upload'); // Priming read
    userId = cookies().get('user_id')?.value;
  } catch (e) {
    console.error("[FileUploadAction] Error reading cookies:", e);
    return { success: false, error: 'Could not verify authentication status for file upload.' };
  }


  if (!userId) {
    console.warn(`[FileUploadAction] User not authenticated for file upload. Cookie 'user_id' not found.`);
    return { success: false, error: 'User not authenticated for file upload.' };
  }

  console.log(`[FileUploadAction] User ${userId} attempting to upload file: ${fileName} (Size: ${file.size} bytes)`);

  try {
    // Create a unique path for the file in Firebase Storage
    // e.g., uploads/user_abc123/timestamp-originalfilename.pdf
    const uniqueFileName = `${Date.now()}-${encodeURIComponent(fileName)}`;
    const filePath = `uploads/${userId}/${uniqueFileName}`;
    
    const fileStorageRef = storageRef(storage, filePath);

    // Convert File to ArrayBuffer for uploadBytesResumable
    const arrayBuffer = await file.arrayBuffer();

    const uploadTask = uploadBytesResumable(fileStorageRef, arrayBuffer, {
      contentType: file.type, // Pass content type for better handling in Storage
    });

    // Wait for the upload to complete
    await uploadTask;

    // Get the download URL
    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    
    console.log(`[FileUploadAction] File uploaded successfully for user ${userId}. Storage Path: ${filePath}, Download URL: ${downloadUrl}`);
    
    return {
      success: true,
      url: downloadUrl,
    };

  } catch (error: any) {
    console.error(`[FileUploadAction] Error uploading file for user ${userId}:`, error);
    let errorMessage = 'Failed to upload file due to a server error.';
    if (error.code) {
      switch (error.code) {
        case 'storage/unauthorized':
          errorMessage = "Permission denied. You're not authorized to upload to this location. Check Firebase Storage rules.";
          break;
        case 'storage/canceled':
          errorMessage = 'Upload was canceled.';
          break;
        case 'storage/unknown':
          errorMessage = 'An unknown error occurred during upload.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
