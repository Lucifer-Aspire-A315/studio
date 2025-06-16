
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
  console.log(`Received ${loanType} application on the server:`);
  console.log(JSON.stringify(data, null, 2));

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

    const docRef = await addDoc(collection(db, 'loanApplications'), applicationData);
    
    console.log(`Loan application stored with ID: ${docRef.id}`);

    return {
      success: true,
      message: `${loanType} application submitted successfully! Your application ID is ${docRef.id}.`,
      applicationId: docRef.id,
    };

  } catch (error: any) {
    console.error(`Error submitting ${loanType} application to Firestore:`, error);
    return {
      success: false,
      message: `There was an error submitting your ${loanType} application. Please try again.`,
      errors: { serverError: [error.message || 'Failed to save application to database.'] },
    };
  }
}

