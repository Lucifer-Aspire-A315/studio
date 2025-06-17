
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
  message?: string; // Keep message optional for success cases where it might not be needed
  user?: UserData;
  // errors field removed to simplify error responses and rely on server logs
}

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds
const SALT_ROUNDS = 10; // For bcrypt

async function setSessionCookies(userData: UserData) {
  await cookies().get('any-placeholder-cookie'); // "Warm up" cookie store

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DURATION,
    path: '/',
    sameSite: 'lax' as const,
  };

  const sessionToken = `mock-secure-session-token-${userData.id}-${Date.now()}`; 
  cookies().set('session_token', sessionToken, cookieOptions);
  cookies().set('user_id', userData.id, cookieOptions);
  cookies().set('user_name', userData.fullName, cookieOptions);
  cookies().set('user_email', userData.email, cookieOptions);
  cookies().set('user_type', userData.type, cookieOptions);
}

async function clearSessionCookies() {
  await cookies().get('any-placeholder-cookie'); // "Warm up" cookie store

  const cookieNames = ['session_token', 'user_id', 'user_name', 'user_email', 'user_type'];
  cookieNames.forEach(name => {
    cookies().set(name, '', { expires: new Date(0), path: '/' });
  });
}

export async function partnerSignUpAction(
  data: PartnerSignUpFormData
): Promise<AuthServerActionResponse> {
  try {
    await cookies().get('any-placeholder-cookie');
    const partnersRef = collection(db, 'partners');
    const q = query(partnersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: 'This email address is already registered as a partner.',
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

    return {
      success: true,
      message: 'Partner sign-up successful! Your account is pending approval.',
      user: newUser, 
    };
  } catch (error: any) {
    console.error('Error during partner sign-up:', error);
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'An unexpected error occurred during sign-up. Please try again.';
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function partnerLoginAction(
  data: PartnerLoginFormData
): Promise<AuthServerActionResponse> {
  try {
    await cookies().get('any-placeholder-cookie');
    const partnersRef = collection(db, 'partners');
    const q = query(partnersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    const partnerDoc = querySnapshot.docs[0];
    const partnerData = partnerDoc.data();

    const passwordIsValid = await bcrypt.compare(data.password, partnerData.password);

    if (!passwordIsValid) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    if (!partnerData.isApproved) {
        return {
            success: false,
            message: 'Your partner account is pending approval. Please contact support.',
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
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'An unexpected error occurred during login. Please try again.';
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function userSignUpAction(
  data: UserSignUpFormData
): Promise<AuthServerActionResponse> {
  try {
    await cookies().get('any-placeholder-cookie');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: 'This email address is already registered.',
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
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'An unexpected error occurred during sign-up. Please try again.';
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function userLoginAction(
  data: UserLoginFormData
): Promise<AuthServerActionResponse> {
  try {
    await cookies().get('any-placeholder-cookie');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    const userDoc = querySnapshot.docs[0];
    const userDataFromDb = userDoc.data(); 

    const passwordIsValid = await bcrypt.compare(data.password, userDataFromDb.password);

    if (!passwordIsValid) {
      return {
        success: false,
        message: 'Invalid email or password.',
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
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'An unexpected error occurred during login. Please try again.';
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function logoutAction(): Promise<AuthServerActionResponse> {
  try {
    await clearSessionCookies();
    return { success: true, message: "Logged out successfully." };
  } catch (error: any) {
    console.error('Error during logout:', error);
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'Logout failed due to a server error.';
    return { 
        success: false, 
        message: safeErrorMessage,
    };
  }
}

export async function checkSessionAction(): Promise<UserData | null> {
  try {
    const userId = cookies().get('user_id')?.value;
    const userName = cookies().get('user_name')?.value;
    const userEmail = cookies().get('user_email')?.value;
    const userTypeCookie = cookies().get('user_type')?.value;
    const userType = (userTypeCookie === 'partner' || userTypeCookie === 'normal') ? userTypeCookie : undefined;
    const sessionToken = cookies().get('session_token')?.value;


    if (userId && userName && userEmail && userType && sessionToken) {
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
    
