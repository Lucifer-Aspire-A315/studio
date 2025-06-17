
'use server';

import { cookies } from 'next/headers';
import type { PartnerSignUpFormData, PartnerLoginFormData, UserSignUpFormData, UserLoginFormData } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  type: 'partner' | 'normal';
}

interface AuthServerActionResponse {
  success: boolean;
  message?: string;
  user?: UserData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Record<string, any>;
}

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds
const SALT_ROUNDS = 10; // For bcrypt

async function setSessionCookies(userData: UserData) {
  // Ensure the cookie store is accessed in an async manner first.
  // The cookie 'any-placeholder-cookie' doesn't need to exist.
  // This call helps Next.js correctly handle the dynamic nature of cookies.
  await cookies().get('any-placeholder-cookie');

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DURATION,
    path: '/',
    sameSite: 'lax' as const,
  };

  const sessionToken = `mock-secure-session-token-${userData.id}-${Date.now()}`; // Replace with real secure token generation
  cookies().set('session_token', sessionToken, cookieOptions);
  cookies().set('user_id', userData.id, cookieOptions);
  cookies().set('user_name', userData.fullName, cookieOptions);
  cookies().set('user_email', userData.email, cookieOptions);
  cookies().set('user_type', userData.type, cookieOptions);
}

async function clearSessionCookies() {
  // Ensure the cookie store is accessed in an async manner first.
  await cookies().get('any-placeholder-cookie');

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
        message: 'This email address is already registered as a partner.',
        errors: { email: ['Email already in use.'] },
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const partnerDataToSave = {
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      password: hashedPassword,
      createdAt: Timestamp.fromDate(new Date()),
      isApproved: false,
      type: 'partner',
    };

    const docRef = await addDoc(partnersRef, partnerDataToSave);
    
    const newUser: UserData = {
      id: docRef.id,
      fullName: data.fullName,
      email: data.email,
      type: 'partner',
    };

    // Partners are pending approval, so don't set session cookies immediately.
    // Session will be set upon login after approval.

    return {
      success: true,
      message: 'Partner sign-up successful! Your account is pending approval.',
      user: newUser, // Still return user data for context, but not logged in yet
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
        errors: { email: ['No partner account found with this email.'] },
      };
    }

    const partnerDoc = querySnapshot.docs[0];
    const partnerData = partnerDoc.data();

    const passwordIsValid = await bcrypt.compare(data.password, partnerData.password);

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
            message: 'Your partner account is pending approval. Please contact support.',
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
      message: 'Partner login successful!',
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

export async function userSignUpAction(
  data: UserSignUpFormData
): Promise<AuthServerActionResponse> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: 'This email address is already registered.',
        errors: { email: ['Email already in use.'] },
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const userDataToSave = {
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      password: hashedPassword,
      createdAt: Timestamp.fromDate(new Date()),
      type: 'normal',
    };

    const docRef = await addDoc(usersRef, userDataToSave);
    
    const newUser: UserData = {
      id: docRef.id,
      fullName: data.fullName,
      email: data.email,
      type: 'normal',
    };

    await setSessionCookies(newUser);

    return {
      success: true,
      message: 'Sign-up successful! Welcome to FinSol RN.',
      user: newUser,
    };
  } catch (error: any) {
    console.error('Error during user sign-up:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during sign-up. Please try again.',
      errors: { serverError: [error.message || 'Server error occurred'] },
    };
  }
}

export async function userLoginAction(
  data: UserLoginFormData
): Promise<AuthServerActionResponse> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Invalid email or password.',
        errors: { email: ['No account found with this email.'] },
      };
    }

    const userDoc = querySnapshot.docs[0];
    const userDataFromDb = userDoc.data(); // Renamed to avoid conflict with UserData interface

    const passwordIsValid = await bcrypt.compare(data.password, userDataFromDb.password);

    if (!passwordIsValid) {
      return {
        success: false,
        message: 'Invalid email or password.',
        errors: { password: ['Incorrect password.'] },
      };
    }

    const loggedInUser: UserData = {
      id: userDoc.id,
      fullName: userDataFromDb.fullName,
      email: userDataFromDb.email,
      type: 'normal',
    };

    await setSessionCookies(loggedInUser);

    return {
      success: true,
      message: 'Login successful!',
      user: loggedInUser,
    };
  } catch (error: any) {
    console.error('Error during user login:', error);
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
      // In a real app, validate the sessionToken against a session store or decode/verify a JWT
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

    