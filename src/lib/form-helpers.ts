
import { uploadFileAction } from '@/app/actions/fileUploadActions';
import type { useToast } from "@/hooks/use-toast";

type ToastFn = ReturnType<typeof useToast>['toast'];

/**
 * Processes and uploads a dictionary of files using a server action.
 * @param documentUploadsData A record where keys are field names and values are File objects or other data.
 * @param toast A function to display toast notifications for progress and errors.
 * @returns A promise that resolves to a record of field keys to their uploaded URLs.
 * @throws An error if any file upload fails, to be caught by the calling function.
 */
export async function processFileUploads(
  documentUploadsData: Record<string, any>,
  toast: ToastFn
): Promise<Record<string, string>> {
  
  const uploadedFileUrls: Record<string, string> = {};

  const filesToUpload = Object.entries(documentUploadsData)
    .filter(([, file]) => file instanceof File);
  
  if (filesToUpload.length === 0) {
    return {};
  }

  const uploadPromises = filesToUpload.map(async ([key, file]) => {
    if (file instanceof File) {
      toast({ title: `Uploading ${key}...`, description: `Uploading ${file.name}. Please wait.` });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      
      const uploadResult = await uploadFileAction(formData);
      
      if (uploadResult.success && uploadResult.url) {
        return { key, url: uploadResult.url };
      } else {
        // Reject the promise for this file to stop Promise.all
        throw new Error(`Upload failed for ${file.name}: ${uploadResult.error || 'Unknown error'}`);
      }
    }
    return null;
  });

  try {
    const results = await Promise.all(uploadPromises);
    results.forEach(result => {
      if (result) {
        uploadedFileUrls[result.key] = result.url;
      }
    });
    return uploadedFileUrls;
  } catch (error) {
    // Re-throw the error to be caught by the calling function's try-catch block
    throw error;
  }
}
