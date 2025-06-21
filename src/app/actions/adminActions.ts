
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, doc, updateDoc } from 'firebase/firestore';
import type { UserApplication, PartnerData } from '@/lib/types';
import type { DocumentData } from 'firebase/firestore';
import { checkSessionAction } from './authActions';

// Helper function to ensure only admins can execute these actions
async function verifyAdmin() {
  const user = await checkSessionAction();
  if (!user?.isAdmin) {
    throw new Error('Unauthorized: You do not have permission to perform this action.');
  }
  return user;
}


function formatApplication(doc: DocumentData, defaultCategory: UserApplication['serviceCategory']): UserApplication {
    const data = doc.data();
    const createdAtTimestamp = data.createdAt as Timestamp;

    let applicationTypeDisplay = data.applicationType;
    if (defaultCategory === 'governmentScheme' && data.schemeNameForDisplay) {
        applicationTypeDisplay = data.schemeNameForDisplay;
    }
    
    // Fallback to submittedBy if applicantDetails is not present
    const applicantInfo = data.applicantDetails || data.submittedBy;
    const applicantFullName = applicantInfo?.fullName || applicantInfo?.userName || 'N/A';
    const applicantEmail = applicantInfo?.email || applicantInfo?.userEmail || 'N/A';
    const applicantUserId = applicantInfo?.userId || 'N/A';

    return {
        id: doc.id,
        applicantDetails: {
            userId: applicantUserId,
            fullName: applicantFullName,
            email: applicantEmail,
        },
        serviceCategory: data.serviceCategory || defaultCategory,
        applicationType: applicationTypeDisplay,
        createdAt: createdAtTimestamp?.toDate().toISOString() || new Date().toISOString(),
        status: data.status || 'Unknown',
    };
}


export async function getAllApplications(): Promise<UserApplication[]> {
  await verifyAdmin();
  console.log('[AdminActions] Fetching all user applications...');

  try {
    const loanApplicationsRef = collection(db, 'loanApplications');
    const caServiceApplicationsRef = collection(db, 'caServiceApplications');
    const governmentSchemeApplicationsRef = collection(db, 'governmentSchemeApplications');

    const [loanSnapshot, caSnapshot, govSnapshot] = await Promise.all([
      getDocs(loanApplicationsRef),
      getDocs(caServiceApplicationsRef),
      getDocs(governmentSchemeApplicationsRef),
    ]);
    
    console.log(`[AdminActions] Found ${loanSnapshot.size} loan, ${caSnapshot.size} CA, and ${govSnapshot.size} gov scheme applications.`);

    const loanApplications = loanSnapshot.docs.map(doc => formatApplication(doc, 'loan'));
    const caApplications = caSnapshot.docs.map(doc => formatApplication(doc, 'caService'));
    const govApplications = govSnapshot.docs.map(doc => formatApplication(doc, 'governmentScheme'));

    const allApplications = [...loanApplications, ...caApplications, ...govApplications];
    allApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`[AdminActions] Successfully fetched and merged ${allApplications.length} applications.`);
    return allApplications;

  } catch (error: any) {
    console.error('[AdminActions] Error fetching all applications from Firestore:', error.message, error.stack);
    return [];
  }
}

export async function getPendingPartners(): Promise<PartnerData[]> {
    await verifyAdmin();
    console.log('[AdminActions] Fetching pending partners...');

    try {
        const partnersRef = collection(db, 'partners');
        const q = query(partnersRef, where('isApproved', '==', false));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('[AdminActions] No pending partners found.');
            return [];
        }

        const pendingPartners = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAtTimestamp = data.createdAt as Timestamp;
            return {
                id: doc.id,
                fullName: data.fullName,
                email: data.email,
                mobileNumber: data.mobileNumber,
                createdAt: createdAtTimestamp?.toDate().toISOString() || new Date().toISOString(),
                isApproved: data.isApproved,
            };
        });

        console.log(`[AdminActions] Found ${pendingPartners.length} pending partners.`);
        return pendingPartners;

    } catch (error: any) {
        console.error('[AdminActions] Error fetching pending partners:', error.message, error.stack);
        return [];
    }
}

export async function approvePartner(partnerId: string): Promise<{ success: boolean; message: string }> {
    await verifyAdmin();
    console.log(`[AdminActions] Attempting to approve partner with ID: ${partnerId}`);

    try {
        const partnerRef = doc(db, 'partners', partnerId);
        await updateDoc(partnerRef, {
            isApproved: true
        });
        
        console.log(`[AdminActions] Successfully approved partner: ${partnerId}`);
        revalidatePath('/admin/dashboard'); // Revalidate the dashboard to show updated list
        return { success: true, message: 'Partner approved successfully.' };
    } catch (error: any) {
        console.error(`[AdminActions] Error approving partner ${partnerId}:`, error.message, error.stack);
        return { success: false, message: 'Failed to approve partner.' };
    }
}
