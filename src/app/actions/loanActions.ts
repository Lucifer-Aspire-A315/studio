
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
  schema: ZodType<T, ZodTypeDef, T> // Schema can be used for server-side validation if needed
): Promise<ServerActionResponse> {
  console.log(`[Server Action - ${loanType}] Received application.`);
  // Be cautious logging full data in production if it contains sensitive info
  // For debugging, you might log: console.log(`[Server Action - ${loanType}] Data:`, JSON.stringify(data, null, 2));

  try {
    const userId = cookies().get('user_id')?.value;
    const userEmail = cookies().get('user_email')?.value;
    const userFullName = cookies().get('user_name')?.value;
    const userType = cookies().get('user_type')?.value as 'partner' | 'normal' | undefined;

    // Ensure formData is serializable (File objects should already be URLs)
    const applicationData = {
      userId: userId || null,
      userEmail: userEmail || null,
      userFullName: userFullName || null,
      userType: userType || null,
      loanType,
      formData: data, // This should contain URLs, not File objects
      status: 'submitted', 
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    // For debugging, you might log what's about to be saved:
    // console.log(`[Server Action - ${loanType}] Attempting to save to Firestore:`, JSON.stringify(applicationData, null, 2));

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
    if (error.code) console.error("Error Code:", error.code); // Firestore errors often have a code
    if (error.details) console.error("Error Details:", error.details);
    
    let errorMessage = `There was an error submitting your ${loanType} application. Please try again.`;
    // Avoid exposing raw error.message to client in production for security.
    // errorMessage += ` Server error: ${error.message || 'Internal server error.'}`;

    return {
      success: false,
      message: errorMessage,
      errors: { serverError: [error.message || 'Failed to save application to database due to an internal error.'] },
    };
  }
}

    
