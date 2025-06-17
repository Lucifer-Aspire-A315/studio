
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp }  from 'firebase/firestore';
import { cookies } from 'next/headers';

interface ServerActionResponse {
  success: boolean;
  message: string; 
  applicationId?: string;
}

export async function submitLoanApplicationAction<T extends Record<string, any>>(
  data: T,
  loanType: string
): Promise<ServerActionResponse> {
  console.log(`[Server Action - ${loanType}] Received application.`);

  try {
    const userId = cookies().get('user_id')?.value;
    const userEmail = cookies().get('user_email')?.value;
    const userFullName = cookies().get('user_name')?.value;
    const userTypeCookie = cookies().get('user_type')?.value;
    const userType = userTypeCookie === 'partner' || userTypeCookie === 'normal' ? userTypeCookie : null;


    const applicationData = {
      userId: userId || null,
      userEmail: userEmail || null,
      userFullName: userFullName || null,
      userType: userType,
      loanType,
      formData: data, 
      status: 'submitted', 
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    console.log(`[Server Action - ${loanType}] Attempting to save to Firestore. Data to be serialized (next log check):`);
    try {
      const serializableCheck = JSON.parse(JSON.stringify(applicationData));
      console.log(`[Server Action - ${loanType}] Successfully serialized applicationData for Firestore:`, JSON.stringify(serializableCheck, null, 2).substring(0, 1000) + "...");
    } catch (serializationError: any) {
      console.error(`[Server Action - ${loanType}] FAILED TO SERIALIZE applicationData for Firestore write:`, serializationError.message);
      console.log(`[Server Action - ${loanType}] Raw applicationData structure (pre-serialization attempt):`, applicationData);
      
      if (applicationData.formData && typeof applicationData.formData === 'object') {
        console.error(`[Server Action - ${loanType}] Checking individual fields within formData for serialization issues:`);
        for (const key in applicationData.formData) {
          try {
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
      return {
          success: false,
          message: `Data for ${loanType} is not serializable and cannot be saved. Check server logs for details.`,
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
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
    const safeErrorMessage = (typeof error.message === 'string' && error.message) 
      ? error.message 
      : `An internal server error occurred while submitting your ${loanType} application. Please check server logs for details.`;
    
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}
    
