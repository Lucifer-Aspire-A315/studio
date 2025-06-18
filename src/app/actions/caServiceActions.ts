
'use server';

// Removed ZodType import as schema parameter is no longer used
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { cookies } from 'next/headers';
import type { 
  GstServiceApplicationFormData,
  ItrFilingConsultationFormData,
  AccountingBookkeepingFormData,
  CompanyIncorporationFormData,
  FinancialAdvisoryFormData
} from '@/lib/schemas';

interface ServerActionResponse {
  success: boolean;
  message: string; 
  applicationId?: string;
}

async function submitCAServiceApplication<T extends Record<string, any>>(
  data: T,
  serviceType: string
  // schema parameter removed
): Promise<ServerActionResponse> {
  console.log(`[Server Action - CA Service] Received application for "${serviceType}".`);

  try {
    await cookies().get('priming-cookie'); // Priming read
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
      serviceType,
      formData: data, 
      status: 'submitted', 
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log(`[Server Action - CA Service] Attempting to save to Firestore for service "${serviceType}".`);

    const docRef = await addDoc(collection(db, 'caServiceApplications'), applicationData);
    
    console.log(`[Server Action - CA Service] Application for "${serviceType}" stored with ID: ${docRef.id}`);

    return {
      success: true,
      message: `${serviceType} application submitted successfully! Your application ID is ${docRef.id}.`,
      applicationId: docRef.id,
    };

  } catch (error: any) {
    console.error(`[Server Action - CA Service] Error submitting "${serviceType}" application to Firestore:`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);

    const safeErrorMessage = (typeof error.message === 'string' && error.message)
        ? error.message
        : `There was an error submitting your ${serviceType} application. Please check server logs for details.`;
    
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}


export async function submitGstServiceApplicationAction(
  data: GstServiceApplicationFormData
  // schema parameter removed
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "GST Service Application");
}

export async function submitItrFilingConsultationAction(
  data: ItrFilingConsultationFormData
  // schema parameter removed
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "ITR Filing & Consultation");
}

export async function submitAccountingBookkeepingAction(
  data: AccountingBookkeepingFormData
  // schema parameter removed
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "Accounting & Bookkeeping Service");
}

export async function submitCompanyIncorporationAction(
  data: CompanyIncorporationFormData
  // schema parameter removed
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "Company Incorporation");
}

export async function submitFinancialAdvisoryAction(
  data: FinancialAdvisoryFormData
  // schema parameter removed
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "Financial Advisory Service");
}

    
