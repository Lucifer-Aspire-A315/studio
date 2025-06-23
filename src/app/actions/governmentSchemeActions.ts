
'use server';

import type { ZodType, ZodTypeDef } from 'zod'; // Keep ZodType for schema validation if used locally, though not for DB submission here
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { cookies } from 'next/headers';
import type { GovernmentSchemeLoanApplicationFormData } from '@/lib/schemas';


interface ServerActionResponse {
  success: boolean;
  message: string; 
  applicationId?: string;
  errors?: Record<string, string[]>; 
}

export async function submitGovernmentSchemeLoanApplicationAction(
  data: GovernmentSchemeLoanApplicationFormData,
  // schema: ZodType<GovernmentSchemeLoanApplicationFormData, ZodTypeDef, GovernmentSchemeLoanApplicationFormData> // Schema param can be removed if validation is purely client-side for this action
): Promise<ServerActionResponse> {
  const applicationTypeDisplay = data.loanDetailsGov.selectedScheme === 'Other' && data.loanDetailsGov.otherSchemeName
    ? data.loanDetailsGov.otherSchemeName
    : data.loanDetailsGov.selectedScheme;
  
  // For consistency, let's use a more generic internal applicationType
  const internalApplicationType = data.loanDetailsGov.selectedScheme;


  console.log(`[Server Action - Gov Scheme] Received application for "${applicationTypeDisplay}".`);

  try {
    await cookies().get('priming-cookie-gov'); // Priming read
    const submitterUserId = cookies().get('user_id')?.value;
    const submitterUserName = cookies().get('user_name')?.value;
    const submitterUserEmail = cookies().get('user_email')?.value;
    const submitterUserType = cookies().get('user_type')?.value as 'normal' | 'partner' | undefined;

    if (!submitterUserId || !submitterUserName || !submitterUserEmail || !submitterUserType) {
      console.error(`[Server Action - Gov Scheme] Critical user information missing from cookies for scheme "${applicationTypeDisplay}".`);
      return {
        success: false,
        message: 'User authentication details are missing. Please log in again.',
      };
    }
    
    // Get applicant info from the form data. This schema uses `applicantDetailsGov`.
    const applicantDataFromForm = data.applicantDetailsGov;
    if (!applicantDataFromForm) {
      return { success: false, message: 'Applicant details are missing from the form submission.' };
    }

    const partnerId = submitterUserType === 'partner' ? submitterUserId : null;

    const applicationData = {
      applicantDetails: {
        userId: null,
        fullName: applicantDataFromForm.fullName,
        email: applicantDataFromForm.emailId, // Schema uses emailId
      },
      submittedBy: {
        userId: submitterUserId,
        userName: submitterUserName,
        userEmail: submitterUserEmail,
        userType: submitterUserType,
      },
      partnerId: partnerId,
      applicationType: internalApplicationType, // e.g. "pmmy", "other"
      schemeNameForDisplay: applicationTypeDisplay, // e.g. "PM Mudra Yojana", or the custom name if "other"
      serviceCategory: 'governmentScheme', // Added for broader categorization
      formData: data, 
      status: 'submitted',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log(`[Server Action - Gov Scheme] Attempting to save to Firestore for scheme "${applicationTypeDisplay}".`);

    const docRef = await addDoc(collection(db, 'governmentSchemeApplications'), applicationData);
    
    console.log(`[Server Action - Gov Scheme] Application for "${applicationTypeDisplay}" stored with ID: ${docRef.id}`);

    return {
      success: true,
      message: `Government Scheme Loan application for "${applicationTypeDisplay}" submitted successfully! Your application ID is ${docRef.id}.`,
      applicationId: docRef.id,
    };

  } catch (error: any) {
    console.error(`[Server Action - Gov Scheme] Error submitting application for "${applicationTypeDisplay}" to Firestore:`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
        ? error.message
        : `There was an error submitting your application for "${applicationTypeDisplay}". Please check server logs for details.`;
    
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}
    
