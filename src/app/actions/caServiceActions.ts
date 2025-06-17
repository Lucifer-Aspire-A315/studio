
'use server';

import type { ZodType, ZodTypeDef } from 'zod';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Record<string, any>; 
  applicationId?: string;
}

async function submitCAServiceApplication<T extends Record<string, any>>(
  data: T,
  serviceType: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  schema: ZodType<T, ZodTypeDef, T>
): Promise<ServerActionResponse> {
  console.log(`[Server Action - CA Service] Received application for "${serviceType}".`);

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
      serviceType,
      formData: data, // Ensure this contains URLs, not File objects
      status: 'submitted', 
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // console.log(`[Server Action - CA Service] Attempting to save to Firestore:`, JSON.stringify(applicationData, null, 2));

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

    let errorMessage = `There was an error submitting your ${serviceType} application. Please try again.`;
    // errorMessage += ` Server error: ${error.message || 'Internal server error.'}`;
    
    return {
      success: false,
      message: errorMessage,
      errors: { serverError: [error.message || 'Failed to save application to database due to an internal error.'] },
    };
  }
}


export async function submitGstServiceApplicationAction(
  data: GstServiceApplicationFormData,
  schema: ZodType<GstServiceApplicationFormData, ZodTypeDef, GstServiceApplicationFormData>
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "GST Service Application", schema);
}

export async function submitItrFilingConsultationAction(
  data: ItrFilingConsultationFormData,
  schema: ZodType<ItrFilingConsultationFormData, ZodTypeDef, ItrFilingConsultationFormData>
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "ITR Filing & Consultation", schema);
}

export async function submitAccountingBookkeepingAction(
  data: AccountingBookkeepingFormData,
  schema: ZodType<AccountingBookkeepingFormData, ZodTypeDef, AccountingBookkeepingFormData>
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "Accounting & Bookkeeping Service", schema);
}

export async function submitCompanyIncorporationAction(
  data: CompanyIncorporationFormData,
  schema: ZodType<CompanyIncorporationFormData, ZodTypeDef, CompanyIncorporationFormData>
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "Company Incorporation", schema);
}

export async function submitFinancialAdvisoryAction(
  data: FinancialAdvisoryFormData,
  schema: ZodType<FinancialAdvisoryFormData, ZodTypeDef, FinancialAdvisoryFormData>
): Promise<ServerActionResponse> {
  return submitCAServiceApplication(data, "Financial Advisory Service", schema);
}

    
