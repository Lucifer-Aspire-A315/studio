
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
  errors?: Record<string, string[]>;
}

// Manually defined interface for cookie options to avoid parsing issues with complex types
interface CustomCookieSetOptions {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  priority?: 'low' | 'medium' | 'high';
}

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds
const SALT_ROUNDS = 10; // For bcrypt

async function setSessionCookies(userData: UserData) {
  console.log(`[AuthActions - setSessionCookies] Attempting for user: ${userData.email}. NODE_ENV: ${process.env.NODE_ENV}`);
  try {
    await cookies().get('any-placeholder-cookie-for-set-prime-get');
    const initialCookies = cookies().getAll();
    console.log('[AuthActions - setSessionCookies] Initial cookies readable by server action before set:', initialCookies.map(c => ({ name: c.name, valueLength: c.value?.length })));
  } catch (e: any) {
    console.error('[AuthActions - setSessionCookies] Error during robust priming cookie read:', e.message);
  }

  const cookieOptions: CustomCookieSetOptions = {
    httpOnly: true,
    secure: true, // Required for SameSite=None; Cloud Workstations is HTTPS
    maxAge: SESSION_DURATION,
    path: '/',
    sameSite: 'none' as const, // Set to 'none' as per browser feedback
  };
  console.log('[AuthActions - setSessionCookies] Effective cookie options:', cookieOptions);

  const sessionToken = `mock-secure-session-token-${userData.id}-${Date.now()}`;

  try {
    cookies().set('session_token', sessionToken, cookieOptions);
    console.log('[AuthActions - setSessionCookies] Attempted to set session_token.');
    cookies().set('user_id', userData.id, cookieOptions);
    console.log(`[AuthActions - setSessionCookies] Attempted to set user_id: ${userData.id}`);
    cookies().set('user_name', userData.fullName, cookieOptions);
    console.log(`[AuthActions - setSessionCookies] Attempted to set user_name: ${userData.fullName}`);
    cookies().set('user_email', userData.email, cookieOptions);
    console.log(`[AuthActions - setSessionCookies] Attempted to set user_email: ${userData.email}`);
    cookies().set('user_type', userData.type, cookieOptions);
    console.log(`[AuthActions - setSessionCookies] Attempted to set user_type: ${userData.type}`);
    console.log('[AuthActions - setSessionCookies] All cookie set attempts finished.');

    const finalCookies = cookies().getAll();
    console.log('[AuthActions - setSessionCookies] Cookies readable by server action immediately after set attempts:', finalCookies.map(c => ({ name: c.name, valueLength: c.value?.length, options: c })));

  } catch (error: any) {
    console.error('[AuthActions - setSessionCookies] Error during cookies().set calls:', error.message, error.stack);
  }
}

async function clearSessionCookies() {
  console.log(`[AuthActions - clearSessionCookies] Attempting. NODE_ENV: ${process.env.NODE_ENV}`);
   try {
    await cookies().get('any-placeholder-cookie-for-clear-prime-get');
    const initialCookies = cookies().getAll();
    console.log('[AuthActions - clearSessionCookies] Initial cookies readable by server action before clear:', initialCookies.map(c => ({ name: c.name, valueLength: c.value?.length })));
  } catch (e: any) {
    console.error('[AuthActions - clearSessionCookies] Error during robust priming cookie read:', e.message);
  }

  const cookieNames = ['session_token', 'user_id', 'user_name', 'user_email', 'user_type'];
  const clearOptions: CustomCookieSetOptions = {
    httpOnly: true,
    secure: true, // Required for SameSite=None; Cloud Workstations is HTTPS
    sameSite: 'none' as const, // Set to 'none'
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  };
  console.log('[AuthActions - clearSessionCookies] Effective clear cookie options:', clearOptions);

  try {
    cookieNames.forEach(name => {
      cookies().set(name, '', clearOptions);
      console.log(`[AuthActions - clearSessionCookies] Attempted to clear cookie: ${name}`);
    });
    console.log('[AuthActions - clearSessionCookies] All cookie clear attempts finished.');

    const finalCookies = cookies().getAll();
    console.log('[AuthActions - clearSessionCookies] Cookies readable by server action immediately after clear attempts:', finalCookies.map(c => ({ name: c.name, valueLength: c.value?.length, options: c })));

  } catch (error: any) {
    console.error('[AuthActions - clearSessionCookies] Error during cookies().set for clearing:', error.message, error.stack);
  }
}

export async function partnerSignUpAction(
  data: PartnerSignUpFormData
): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - partnerSignUpAction] Initiated for email:', data.email);
  try {
    await cookies().get('priming-cookie-partner-signup');
    const partnersRef = collection(db, 'partners');
    const q = query(partnersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.warn('[AuthActions - partnerSignUpAction] Email already registered:', data.email);
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
      type: 'partner' as 'partner',
    };

    const docRef = await addDoc(partnersRef, partnerDataToSave);
    console.log('[AuthActions - partnerSignUpAction] Partner document created in Firestore:', docRef.id);

    const newUser: UserData = {
      id: docRef.id,
      fullName: data.fullName,
      email: data.email,
      type: 'partner',
    };

    // Not calling setSessionCookies as partner needs approval.
    console.log('[AuthActions - partnerSignUpAction] Sign-up successful, pending approval for:', newUser.email);
    return {
      success: true,
      message: 'Partner sign-up successful! Your account is pending approval from the admin.',
      user: newUser,
    };
  } catch (error: any) {
    console.error('[AuthActions - partnerSignUpAction] Error:', error.message, error.stack);
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'An unexpected error occurred during sign-up. Please try again. Check server logs for details.';
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function partnerLoginAction(
  data: PartnerLoginFormData
): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - partnerLoginAction] Initiated for email:', data.email);
  try {
    await cookies().get('priming-cookie-partner-login');
    const partnersRef = collection(db, 'partners');
    const q = query(partnersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('[AuthActions - partnerLoginAction] Email not found:', data.email);
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    const partnerDoc = querySnapshot.docs[0];
    const partnerData = partnerDoc.data();

    const passwordIsValid = await bcrypt.compare(data.password, partnerData.password);

    if (!passwordIsValid) {
      console.warn('[AuthActions - partnerLoginAction] Invalid password for email:', data.email);
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    if (!partnerData.isApproved) {
        console.warn('[AuthActions - partnerLoginAction] Partner account not approved:', data.email);
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
    console.log('[AuthActions - partnerLoginAction] Login successful, session cookies set attempt for:', loggedInUser.email);

    return {
      success: true,
      message: 'Partner login successful!',
      user: loggedInUser,
    };
  } catch (error: any) {
    console.error('[AuthActions - partnerLoginAction] Error:', error.message, error.stack);
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'An unexpected error occurred during login. Please try again. Check server logs for details.';
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function userSignUpAction(
  data: UserSignUpFormData
): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - userSignUpAction] Initiated for email:', data.email);
  try {
    await cookies().get('priming-cookie-user-signup');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.warn('[AuthActions - userSignUpAction] Email already registered:', data.email);
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
      type: 'normal' as 'normal',
    };

    const docRef = await addDoc(usersRef, userDataToSave);
    console.log('[AuthActions - userSignUpAction] User document created in Firestore:', docRef.id);

    const newUser: UserData = {
      id: docRef.id,
      fullName: data.fullName,
      email: data.email,
      type: 'normal',
    };

    await setSessionCookies(newUser);
    console.log('[AuthActions - userSignUpAction] Sign-up successful, session cookies set attempt for:', newUser.email);

    return {
      success: true,
      message: 'Sign-up successful! Welcome to FinSol RN.',
      user: newUser,
    };
  } catch (error: any) {
    console.error('[AuthActions - userSignUpAction] Error:', error.message, error.stack);
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'An unexpected error occurred during sign-up. Please try again. Check server logs for details.';
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function userLoginAction(
  data: UserLoginFormData
): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - userLoginAction] Initiated for email:', data.email);
  try {
    await cookies().get('priming-cookie-user-login');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('[AuthActions - userLoginAction] Email not found:', data.email);
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    const userDoc = querySnapshot.docs[0];
    const userDataFromDb = userDoc.data();

    const passwordIsValid = await bcrypt.compare(data.password, userDataFromDb.password);

    if (!passwordIsValid) {
      console.warn('[AuthActions - userLoginAction] Invalid password for email:', data.email);
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    const userType = (userDataFromDb.type === 'partner' || userDataFromDb.type === 'normal')
                     ? userDataFromDb.type
                     : 'normal';

    const loggedInUser: UserData = {
      id: userDoc.id,
      fullName: userDataFromDb.fullName,
      email: userDataFromDb.email,
      type: userType,
    };

    await setSessionCookies(loggedInUser);
    console.log('[AuthActions - userLoginAction] Login successful, session cookies set attempt for:', loggedInUser.email);

    return {
      success: true,
      message: 'Login successful!',
      user: loggedInUser,
    };
  } catch (error: any) {
    console.error('[AuthActions - userLoginAction] Error:', error.message, error.stack);
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'An unexpected error occurred during login. Please try again. Check server logs for details.';
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function logoutAction(): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - logoutAction] Initiated.');
  try {
    await clearSessionCookies();
    console.log('[AuthActions - logoutAction] Session cookies clear attempt finished.');
    return { success: true, message: "Logged out successfully." };
  } catch (error: any) {
    console.error('[AuthActions - logoutAction] Error:', error.message, error.stack);
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : 'Logout failed due to a server error. Please check server logs for details.';
    return {
        success: false,
        message: safeErrorMessage,
    };
  }
}

export async function checkSessionAction(): Promise<UserData | null> {
  try {
    await cookies().get('priming-cookie-for-check-session');

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
  } catch (error: any) {
    console.error('[AuthActions - checkSessionAction] Error checking session:', error.message);
    return null;
  }
}

    

    