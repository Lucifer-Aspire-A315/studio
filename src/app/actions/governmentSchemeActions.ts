
'use server';

import type { ZodType, ZodTypeDef } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { cookies } from 'next/headers';
import type { GovernmentSchemeLoanApplicationFormData } from '@/lib/schemas';


interface ServerActionResponse {
  success: boolean;
  message: string; 
  applicationId?: string;
}

export async function submitGovernmentSchemeLoanApplicationAction(
  data: GovernmentSchemeLoanApplicationFormData,
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
    const userTypeCookie = cookies().get('user_type')?.value;
    const userType = userTypeCookie === 'partner' || userTypeCookie === 'normal' ? userTypeCookie : null;


    const applicationData = {
      userId: userId || null,
      userEmail: userEmail || null,
      userFullName: userFullName || null,
      userType: userType,
      schemeName,
      formData: data, 
      status: 'submitted',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log(`[Server Action - Gov Scheme] Attempting to save to Firestore for scheme "${schemeName}".`);

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
    
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
        ? error.message
        : `There was an error submitting your application for "${schemeName}". Please check server logs for details.`;
    
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

    
