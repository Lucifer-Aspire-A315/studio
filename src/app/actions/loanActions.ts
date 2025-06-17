
'use server';

import type { ZodType, ZodTypeDef } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp }  from 'firebase/firestore';
import { cookies } from 'next/headers';

interface ServerActionResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Record<string, any>;
  applicationId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitLoanApplicationAction<T extends Record<string, any>>(
  data: T,
  loanType: string
  // schema parameter removed as it was unused
): Promise<ServerActionResponse> {
  console.log(`[Server Action - ${loanType}] Received application.`);

  try {
    const userId = cookies().get('user_id')?.value;
    const userEmail = cookies().get('user_email')?.value;
    const userFullName = cookies().get('user_name')?.value;
    const userType = cookies().get('user_type')?.value as 'partner' | 'normal' | undefined;

    const applicationData = {
      userId: userId || null,
      userEmail: userEmail || null,
      userFullName: userFullName || null,
      userType: userType || null,
      loanType,
      formData: data, 
      status: 'submitted', 
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    console.log(`[Server Action - ${loanType}] Attempting to save to Firestore. Data to be serialized (next log):`);
    try {
      // This will attempt to serialize the entire applicationData object.
      // If it fails, the catch block below will try to identify the problematic field.
      const serializedDataForLog = JSON.stringify(applicationData, null, 2);
      console.log(`[Server Action - ${loanType}] Successfully serialized applicationData for logging:`, serializedDataForLog.substring(0, 500) + (serializedDataForLog.length > 500 ? "..." : ""));
    } catch (serializationError: any) {
      console.error(`[Server Action - ${loanType}] FAILED TO SERIALIZE applicationData for logging before Firestore write:`, serializationError.message);
      console.log(`[Server Action - ${loanType}] Raw applicationData structure (pre-serialization attempt):`, applicationData);
      
      // Attempt to identify non-serializable parts more granularly, especially within formData
      if (applicationData.formData && typeof applicationData.formData === 'object') {
        console.error(`[Server Action - ${loanType}] Checking individual fields within formData for serialization issues:`);
        for (const key in applicationData.formData) {
          try {
            // Check if the value is a File object, which is non-serializable
            if (typeof (applicationData.formData as Record<string, any>)[key] === 'object' && (applicationData.formData as Record<string, any>)[key] instanceof File) {
                 console.error(`[Server Action - ${loanType}] Non-serializable File object found in formData -> "${key}": Value type: File`);
            } else {
                JSON.stringify((applicationData.formData as Record<string, any>)[key]);
            }
          } catch (fieldError: any) {
            console.error(`[Server Action - ${loanType}] Non-serializable field in formData -> "${key}": Value type: ${typeof (applicationData.formData as Record<string, any>)[key]}, Error: ${fieldError.message}`);
          }
        }
      }
      // Return a serializable error response
      return {
          success: false,
          message: `Data for ${loanType} is not serializable. Client-side forms should convert File objects to URLs before submission. Check server logs for details.`,
          errors: { serverError: [`Data for ${loanType} is not serializable. Check server logs for details on problematic fields.`] }
      };
    }

    const docRef = await addDoc(collection(db, 'loanApplications'), applicationData);
    
    console.log(`[Server Action - ${loanType}] Application stored in 'loanApplications' with ID: ${docRef.id}`);

    return {
      success: true,
      message: `${loanType} application submitted successfully! Your application ID is ${docRef.id}. We will review your application and get back to you.`,
      applicationId: docRef.id,
    };

  } catch (error: any) {
    console.error(`[Server Action - ${loanType}] Error submitting application to Firestore:`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message); // Log the direct error message
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
    // Ensure the message sent to the client is a simple string.
    const clientErrorMessage = typeof error.message === 'string' ? error.message : `An internal server error occurred while submitting your ${loanType} application.`;
    
    return {
      success: false,
      message: clientErrorMessage, // Send a simpler message to the client
      errors: { serverError: [clientErrorMessage] },
    };
  }
}
    