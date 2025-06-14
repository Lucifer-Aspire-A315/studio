
'use server';

import type { PartnerSignUpFormData } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface AuthServerActionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, any>;
}

export async function partnerSignUpAction(
  data: PartnerSignUpFormData
): Promise<AuthServerActionResponse> {
  console.log('Received Partner Sign Up data on the server:');
  console.log(JSON.stringify(data, null, 2));

  try {
    // 1. Check if email already exists
    const partnersRef = collection(db, 'partners');
    const q = query(partnersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: 'This email address is already registered.',
        errors: { email: ['Email already in use.'] },
      };
    }

    // 2. IMPORTANT: Hash the password before saving in a real application!
    //    For now, we are saving the plain text password. THIS IS NOT SECURE FOR PRODUCTION.
    //    You should use a library like bcrypt or argon2 to hash passwords.
    //    Example: const hashedPassword = await hashPasswordFunction(data.password);

    // 3. Store the new partner user in Firestore
    const partnerDataToSave = {
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      password: data.password, // In production, store the HASHED password
      createdAt: Timestamp.fromDate(new Date()),
    };

    const docRef = await addDoc(partnersRef, partnerDataToSave);
    console.log("Partner document written with ID: ", docRef.id);

    // 4. Optionally, send a verification email (implement later)

    return {
      success: true,
      message: 'Partner sign-up successful! Data saved to Firestore.',
    };
  } catch (error: any) {
    console.error('Error during partner sign-up:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during sign-up. Please try again.',
      errors: { serverError: [error.message || 'Server error occurred'] },
    };
  }
}
