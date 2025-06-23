
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp }  from 'firebase/firestore';
import { cookies } from 'next/headers';

interface ServerActionResponse {
  success: boolean;
  message: string; 
  applicationId?: string;
  errors?: Record<string, string[]>; // For Zod validation errors
}

export async function submitLoanApplicationAction<T extends Record<string, any>>(
  data: T,
  loanType: string // This will now be applicationType
): Promise<ServerActionResponse> {
  console.log(`[Server Action - Loan] Received application for type "${loanType}".`);

  try {
    await cookies().get('priming-cookie-loan'); // Priming read
    const submitterUserId = cookies().get('user_id')?.value;
    const submitterUserName = cookies().get('user_name')?.value;
    const submitterUserEmail = cookies().get('user_email')?.value;
    const submitterUserType = cookies().get('user_type')?.value as 'normal' | 'partner' | undefined;

    if (!submitterUserId || !submitterUserName || !submitterUserEmail || !submitterUserType) {
      console.error(`[Server Action - Loan] Critical user information missing from cookies for loan type "${loanType}".`);
      return {
        success: false,
        message: 'User authentication details are missing. Please log in again.',
      };
    }

    // Get applicant info from the form data. All loan schemas use `applicantDetails`.
    const applicantDataFromForm = data.applicantDetails;
    if (!applicantDataFromForm) {
      return { success: false, message: 'Applicant details are missing from the form submission.' };
    }

    const partnerId = submitterUserType === 'partner' ? submitterUserId : null;

    const applicationData = {
      applicantDetails: {
        // A client of a partner may not have a userId yet. This is captured in submittedBy.
        userId: null, 
        fullName: applicantDataFromForm.name, // Loan schemas use 'name'
        email: applicantDataFromForm.email,   // Loan schemas use 'email'
      },
      submittedBy: {
        userId: submitterUserId,
        userName: submitterUserName,
        userEmail: submitterUserEmail,
        userType: submitterUserType,
      },
      partnerId: partnerId,
      applicationType: loanType, // Renamed from loanType for consistency
      serviceCategory: 'loan', // Added for broader categorization
      formData: data, 
      status: 'submitted', 
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    console.log(`[Server Action - Loan] Attempting to save to Firestore for type "${loanType}". Data to be serialized (next log check):`);
    try {
      const serializableCheck = JSON.parse(JSON.stringify(applicationData));
      console.log(`[Server Action - Loan] Successfully serialized applicationData for Firestore:`, JSON.stringify(serializableCheck, null, 2).substring(0, 1000) + "...");
    } catch (serializationError: any) {
      console.error(`[Server Action - Loan] FAILED TO SERIALIZE applicationData for Firestore write:`, serializationError.message);
      console.log(`[Server Action - Loan] Raw applicationData structure (pre-serialization attempt):`, applicationData);
      
      if (applicationData.formData && typeof applicationData.formData === 'object') {
        console.error(`[Server Action - Loan] Checking individual fields within formData for serialization issues:`);
        for (const key in applicationData.formData) {
          try {
            if (typeof (applicationData.formData as Record<string, any>)[key] === 'object' && (applicationData.formData as Record<string, any>)[key] instanceof File) {
                 console.error(`[Server Action - Loan] Non-serializable File object found in formData -> "${key}": Value type: File`);
            } else {
                JSON.stringify((applicationData.formData as Record<string, any>)[key]);
            }
          } catch (fieldError: any) {
            console.error(`[Server Action - Loan] Non-serializable field in formData -> "${key}": Value type: ${typeof (applicationData.formData as Record<string, any>)[key]}, Error: ${fieldError.message}`);
          }
        }
      }
      return {
          success: false,
          message: `Data for ${loanType} is not serializable and cannot be saved. Check server logs for details.`,
      };
    }

    const docRef = await addDoc(collection(db, 'loanApplications'), applicationData);
    
    console.log(`[Server Action - Loan] Application stored in 'loanApplications' with ID: ${docRef.id}`);

    return {
      success: true,
      message: `${loanType} application submitted successfully! Your application ID is ${docRef.id}. We will review your application and get back to you.`,
      applicationId: docRef.id,
    };

  } catch (error: any) {
    console.error(`[Server Action - Loan] Error submitting application for type "${loanType}" to Firestore:`);
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
    
