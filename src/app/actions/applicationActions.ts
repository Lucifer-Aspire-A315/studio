'use server';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { checkSessionAction } from './authActions';
import type { UserApplication } from '@/lib/types';

function getCollectionName(serviceCategory: UserApplication['serviceCategory']): string {
  switch (serviceCategory) {
    case 'loan': return 'loanApplications';
    case 'caService': return 'caServiceApplications';
    case 'governmentScheme': return 'governmentSchemeApplications';
    default: throw new Error('Invalid service category provided.');
  }
}

export async function getApplicationDetails(
  applicationId: string,
  serviceCategory: UserApplication['serviceCategory']
): Promise<any | null> {
  console.log(`[AppDetailsAction] Fetching details for app ${applicationId} in category ${serviceCategory}`);
  const user = await checkSessionAction();
  if (!user) {
    console.error('[AppDetailsAction] Unauthorized: No user session found.');
    throw new Error('Unauthorized: You must be logged in to view application details.');
  }

  try {
    const collectionName = getCollectionName(serviceCategory);
    const appRef = doc(db, collectionName, applicationId);
    const docSnap = await getDoc(appRef);

    if (!docSnap.exists()) {
      console.warn(`[AppDetailsAction] Application not found: ${applicationId} in ${collectionName}`);
      return null;
    }

    const applicationData = docSnap.data();
    const submitterId = applicationData.submittedBy?.userId;

    // Security check: User must be the one who submitted it OR an admin
    if (user.id !== submitterId && !user.isAdmin) {
      console.error(`[AppDetailsAction] Forbidden: User ${user.id} tried to access application ${applicationId} owned by ${submitterId}.`);
      throw new Error('Forbidden: You do not have permission to view this application.');
    }
    
    console.log(`[AppDetailsAction] Successfully fetched and authorized access for ${applicationId}.`);
    // Convert Timestamps to ISO strings for serialization
    return JSON.parse(JSON.stringify(applicationData, (key, value) => {
        if (value && value.toDate) { // Firestore Timestamp check
            return value.toDate().toISOString();
        }
        return value;
    }));

  } catch (error: any) {
    console.error(`[AppDetailsAction] Error fetching application details for ${applicationId}:`, error.message, error.stack);
    throw new Error('Failed to fetch application details.');
  }
}
