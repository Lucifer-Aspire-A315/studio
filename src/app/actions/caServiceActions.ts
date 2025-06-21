
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { cookies } from 'next/headers';
import type { 
  GstServiceApplicationFormData,
  ItrFilingConsultationFormData,
  AccountingBookkeepingFormData,
  CompanyIncorporationFormData,
  FinancialAdvisoryFormData,
  AuditAndAssuranceFormData
} from '@/lib/schemas';

interface ServerActionResponse {
  success: boolean;
  message: string; 
  applicationId?: string;
}

async function submitCAServiceApplication<T extends Record<string, any>>(
  data: T,
  serviceName: string // This will now be applicationType
): Promise<ServerActionResponse> {
  console.log(`[Server Action - CA Service] Received application for service "${serviceName}".`);

  try {
    await cookies().get('priming-cookie-ca'); // Priming read
    const submitterUserId = cookies().get('user_id')?.value;
    const submitterUserName = cookies().get('user_name')?.value;
    const submitterUserEmail = cookies().get('user_email')?.value;
    const submitterUserType = cookies().get('user_type')?.value as 'normal' | 'partner' | undefined;

    if (!submitterUserId || !submitterUserName || !submitterUserEmail || !submitterUserType) {
      console.error(`[Server Action - CA Service] Critical user information missing from cookies for service "${serviceName}".`);
      return {
        success: false,
        message: 'User authentication details are missing. Please log in again.',
      };
    }

    // For now, assume the applicant is the submitter.
    const applicantUserId = submitterUserId;
    const applicantFullName = submitterUserName;
    const applicantEmail = submitterUserEmail;
    
    const partnerId = submitterUserType === 'partner' ? submitterUserId : null;

    const applicationData = {
      applicantDetails: {
        userId: applicantUserId,
        fullName: applicantFullName,
        email: applicantEmail,
      },
      submittedBy: {
        userId: submitterUserId,
        userName: submitterUserName,
        userEmail: submitterUserEmail,
        userType: submitterUserType,
      },
      partnerId: partnerId,
      applicationType: serviceName, // Using a consistent field name
      serviceCategory: 'caService', // Added for broader categorization
      formData: data, 
      status: 'submitted', 
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log(`[Server Action - CA Service] Attempting to save to Firestore for service "${serviceName}".`);

    const docRef = await addDoc(collection(db, 'caServiceApplications'), applicationData);
    
    console.log(`[Server Action - CA Service] Application for "${serviceName}" stored with ID: ${docRef.id}`);

    return {
      success: true,
      message: `${serviceName} application submitted successfully! Your application ID is ${docRef.id}.`,
      applicationId: docRef.id,
    };

  } catch (error: any) {
    console.error(`[Server Action - CA Service] Error submitting "${serviceName}" application to Firestore:`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);

    const safeErrorMessage = (typeof error.message === 'string' && error.message)
        ? error.message
        : `There was an error submitting your ${serviceName} application. Please check server logs for details.`;
    
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}


export async function submitGstServiceApplicationAction(
  data: GstServiceApplicationFormData
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "GST Service Application");
}

export async function submitItrFilingConsultationAction(
  data: ItrFilingConsultationFormData
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "ITR Filing & Consultation");
}

export async function submitAccountingBookkeepingAction(
  data: AccountingBookkeepingFormData
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "Accounting & Bookkeeping Service");
}

export async function submitCompanyIncorporationAction(
  data: CompanyIncorporationFormData
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "Company Incorporation");
}

export async function submitFinancialAdvisoryAction(
  data: FinancialAdvisoryFormData
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "Financial Advisory Service");
}

export async function submitAuditAndAssuranceAction(
    data: AuditAndAssuranceFormData
): Promise<ServerActionResponse> {
    return submitCAServiceApplication(data, "Audit and Assurance Service");
}
    
