
'use server';

import { cookies } from 'next/headers';
import type { PartnerSignUpFormData, PartnerLoginFormData } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
// Consider using a password hashing library like bcrypt or argon2
// import bcrypt from 'bcryptjs'; // Example

interface UserData {
  id: string;
  fullName: string;
  email: string;
  type: 'partner' | 'normal'; // Add other types if needed
}

interface AuthServerActionResponse {
  success: boolean;
  message?: string;
  user?: UserData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Record<string, any>;
}

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

async function setSessionCookies(userData: UserData) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DURATION,
    path: '/',
    sameSite: 'lax' as const,
  };

  // Simulate a session token; in production, use a secure random string or JWT
  const sessionToken = `mock-session-token-${userData.id}-${Date.now()}`;
  cookies().set('session_token', sessionToken, cookieOptions);
  cookies().set('user_id', userData.id, cookieOptions);
  cookies().set('user_name', userData.fullName, cookieOptions);
  cookies().set('user_email', userData.email, cookieOptions);
  cookies().set('user_type', userData.type, cookieOptions);
}

async function clearSessionCookies() {
  const cookieNames = ['session_token', 'user_id', 'user_name', 'user_email', 'user_type'];
  cookieNames.forEach(name => {
    cookies().set(name, '', { expires: new Date(0), path: '/' });
  });
}

export async function partnerSignUpAction(
  data: PartnerSignUpFormData
): Promise<AuthServerActionResponse> {
  try {
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

    // IMPORTANT: Hash the password before saving in a real application!
    // const hashedPassword = await bcrypt.hash(data.password, 10); // Example with bcrypt
    const hashedPassword = data.password; // Current: plain text

    const partnerDataToSave = {
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      password: hashedPassword, // Store hashed password
      createdAt: Timestamp.fromDate(new Date()),
      isApproved: false, // Partners might need approval
    };

    const docRef = await addDoc(partnersRef, partnerDataToSave);
    
    const newUser: UserData = {
      id: docRef.id,
      fullName: data.fullName,
      email: data.email,
      type: 'partner',
    };

    await setSessionCookies(newUser);

    return {
      success: true,
      message: 'Partner sign-up successful! Your account is pending approval.',
      user: newUser,
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

export async function partnerLoginAction(
  data: PartnerLoginFormData
): Promise<AuthServerActionResponse> {
  try {
    const partnersRef = collection(db, 'partners');
    const q = query(partnersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Invalid email or password.',
        errors: { email: ['No account found with this email.'] },
      };
    }

    const partnerDoc = querySnapshot.docs[0];
    const partnerData = partnerDoc.data();

    // IMPORTANT: Compare hashed password in a real application!
    // const passwordIsValid = await bcrypt.compare(data.password, partnerData.password); // Example
    const passwordIsValid = data.password === partnerData.password; // Current: plain text comparison

    if (!passwordIsValid) {
      return {
        success: false,
        message: 'Invalid email or password.',
        errors: { password: ['Incorrect password.'] },
      };
    }

    if (!partnerData.isApproved) {
        return {
            success: false,
            message: 'Your account is pending approval. Please contact support.',
            errors: { form: ['Account not approved.'] },
        }
    }

    const loggedInUser: UserData = {
      id: partnerDoc.id,
      fullName: partnerData.fullName,
      email: partnerData.email,
      type: 'partner',
    };

    await setSessionCookies(loggedInUser);

    return {
      success: true,
      message: 'Login successful!',
      user: loggedInUser,
    };
  } catch (error: any) {
    console.error('Error during partner login:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during login. Please try again.',
      errors: { serverError: [error.message || 'Server error occurred'] },
    };
  }
}

export async function logoutAction(): Promise<AuthServerActionResponse> {
  try {
    await clearSessionCookies();
    return { success: true, message: "Logged out successfully." };
  } catch (error: any) {
    console.error('Error during logout:', error);
    return { 
        success: false, 
        message: 'Logout failed.',
        errors: { serverError: [error.message || 'Server error occurred during logout'] },
    };
  }
}

export async function checkSessionAction(): Promise<UserData | null> {
  try {
    const userId = cookies().get('user_id')?.value;
    const userName = cookies().get('user_name')?.value;
    const userEmail = cookies().get('user_email')?.value;
    const userType = cookies().get('user_type')?.value as UserData['type'] | undefined;
    const sessionToken = cookies().get('session_token')?.value;

    if (userId && userName && userEmail && userType && sessionToken) {
      // In a real app, you might want to validate the sessionToken further
      // For example, check against a session store or decode a JWT
      return {
        id: userId,
        fullName: userName,
        email: userEmail,
        type: userType,
      };
    }
    return null;
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
}
