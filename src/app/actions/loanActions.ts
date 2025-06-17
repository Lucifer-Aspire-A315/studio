
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
  loanType: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  schema: ZodType<T, ZodTypeDef, T> 
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
      const serializedDataForLog = JSON.stringify(applicationData, null, 2);
      console.log(`[Server Action - ${loanType}] Successfully serialized applicationData for logging:`, serializedDataForLog);
    } catch (serializationError: any) {
      console.error(`[Server Action - ${loanType}] FAILED TO SERIALIZE applicationData for logging before Firestore write:`, serializationError.message);
      console.log(`[Server Action - ${loanType}] Raw applicationData structure (pre-serialization attempt):`, applicationData);
      // Iterate over formData fields if serialization fails to find potential non-serializable parts
      if (applicationData.formData && typeof applicationData.formData === 'object') {
        for (const key in applicationData.formData) {
          try {
            JSON.stringify((applicationData.formData as Record<string, any>)[key]);
          } catch (fieldError: any) {
            console.error(`[Server Action - ${loanType}] Non-serializable field in formData "${key}":`, (applicationData.formData as Record<string, any>)[key], fieldError.message);
          }
        }
      }
      throw new Error(`Data for ${loanType} is not serializable. Check server logs for details.`); // Re-throw to be caught by outer catch
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
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
    let errorMessage = `There was an error submitting your ${loanType} application. Please try again.`;
    
    return {
      success: false,
      message: errorMessage,
      errors: { serverError: [error.message || 'Failed to save application to database due to an internal error.'] },
    };
  }
}
