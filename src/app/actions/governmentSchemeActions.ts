
'use server';

import type { ZodType, ZodTypeDef } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { cookies } from 'next/headers';
import type { GovernmentSchemeLoanApplicationFormData } from '@/lib/schemas';


interface ServerActionResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Record<string, any>;
  applicationId?: string;
}

export async function submitGovernmentSchemeLoanApplicationAction(
  data: GovernmentSchemeLoanApplicationFormData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  schema: ZodType<GovernmentSchemeLoanApplicationFormData, ZodTypeDef, GovernmentSchemeLoanApplicationFormData>
): Promise<ServerActionResponse> {
  const schemeName = data.loanDetailsGov.selectedScheme === 'Other' && data.loanDetailsGov.otherSchemeName
    ? data.loanDetailsGov.otherSchemeName
    : data.loanDetailsGov.selectedScheme;

  console.log(`[Server Action - Gov Scheme] Received application for "${schemeName}".`);

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
      schemeName,
      formData: data, // Ensure this contains URLs, not File objects
      status: 'submitted',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // console.log(`[Server Action - Gov Scheme] Attempting to save to Firestore:`, JSON.stringify(applicationData, null, 2));

    const docRef = await addDoc(collection(db, 'governmentSchemeApplications'), applicationData);
    
    console.log(`[Server Action - Gov Scheme] Application for "${schemeName}" stored with ID: ${docRef.id}`);

    return {
      success: true,
      message: `Government Scheme Loan application for "${schemeName}" submitted successfully! Your application ID is ${docRef.id}.`,
      applicationId: docRef.id,
    };

  } catch (error: any) {
    console.error(`[Server Action - Gov Scheme] Error submitting application for "${schemeName}" to Firestore:`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
    let errorMessage = 'There was an error submitting your application. Please try again.';
    // errorMessage += ` Server error: ${error.message || 'Internal server error.'}`;
    
    return {
      success: false,
      message: errorMessage,
      errors: { serverError: [error.message || 'Failed to save application to database due to an internal error.'] },
    };
  }
}

    
