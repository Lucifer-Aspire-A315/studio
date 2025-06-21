
'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, collectionGroup, Timestamp } from 'firebase/firestore';
import type { UserApplication } from '@/lib/types';
import type { DocumentData } from 'firebase/firestore';


function formatApplication(doc: DocumentData, defaultCategory: UserApplication['serviceCategory']): UserApplication {
    const data = doc.data();
    const createdAtTimestamp = data.createdAt as Timestamp;

    // Determine the application type for display
    let applicationTypeDisplay = data.applicationType;
    if (defaultCategory === 'governmentScheme' && data.schemeNameForDisplay) {
        applicationTypeDisplay = data.schemeNameForDisplay;
    }


    return {
        id: doc.id,
        serviceCategory: data.serviceCategory || defaultCategory,
        applicationType: applicationTypeDisplay,
        createdAt: createdAtTimestamp?.toDate().toISOString() || new Date().toISOString(),
        status: data.status || 'Unknown',
    };
}


export async function getUserApplications(): Promise<UserApplication[]> {
  console.log('[DashboardActions] Fetching user applications...');
  const userId = cookies().get('user_id')?.value;

  if (!userId) {
    console.warn('[DashboardActions] No user ID found in cookies. Returning empty array.');
    return [];
  }
  
  console.log(`[DashboardActions] Found user ID: ${userId}. Querying collections...`);

  try {
    const loanApplicationsRef = collection(db, 'loanApplications');
    const caServiceApplicationsRef = collection(db, 'caServiceApplications');
    const governmentSchemeApplicationsRef = collection(db, 'governmentSchemeApplications');

    const qLoan = query(loanApplicationsRef, where('submittedBy.userId', '==', userId), orderBy('createdAt', 'desc'));
    const qCa = query(caServiceApplicationsRef, where('submittedBy.userId', '==', userId'), orderBy('createdAt', 'desc'));
    const qGov = query(governmentSchemeApplicationsRef, where('submittedBy.userId', '==', userId), orderBy('createdAt', 'desc'));

    const [loanSnapshot, caSnapshot, govSnapshot] = await Promise.all([
      getDocs(qLoan),
      getDocs(qCa),
      getDocs(qGov),
    ]);
    
    console.log(`[DashboardActions] Found ${loanSnapshot.size} loan, ${caSnapshot.size} CA, and ${govSnapshot.size} gov scheme applications.`);


    const loanApplications = loanSnapshot.docs.map(doc => formatApplication(doc, 'loan'));
    const caApplications = caSnapshot.docs.map(doc => formatApplication(doc, 'caService'));
    const govApplications = govSnapshot.docs.map(doc => formatApplication(doc, 'governmentScheme'));

    const allApplications = [...loanApplications, ...caApplications, ...govApplications];

    // Sort all applications by date, descending
    allApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`[DashboardActions] Successfully fetched and merged ${allApplications.length} applications.`);
    return allApplications;

  } catch (error: any) {
    console.error('[DashboardActions] Error fetching user applications from Firestore:', error.message, error.stack);
    // In case of error, return an empty array to prevent the page from crashing.
    return [];
  }
}
