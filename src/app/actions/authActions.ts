
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
  errors?: Record<string, string[]>; // For Zod validation errors if needed from server
}

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds
const SALT_ROUNDS = 10; // For bcrypt

async function setSessionCookies(userData: UserData) {
  await cookies().get('any-placeholder-cookie-for-set'); 

  const cookieOptions = {
    httpOnly: true,
    secure: true, // Set to true as Cloud Workstations is HTTPS
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
  await cookies().get('any-placeholder-cookie-for-clear'); 

  const cookieNames = ['session_token', 'user_id', 'user_name', 'user_email', 'user_type'];
  cookieNames.forEach(name => {
    cookies().set(name, '', { secure: true, httpOnly: true, sameSite: 'lax', path:'/', expires: new Date(0) });
  });
}

export async function partnerSignUpAction(
  data: PartnerSignUpFormData
): Promise<AuthServerActionResponse> {
  try {
    await cookies().get('priming-cookie-partner-signup');
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
      isApproved: false, // Partners need approval
      type: 'partner',
    };

    const docRef = await addDoc(partnersRef, partnerDataToSave);
    
    const newUser: UserData = {
      id: docRef.id, // Using Firestore doc ID as partner's main ID
      fullName: data.fullName,
      email: data.email,
      type: 'partner',
    };

    // Partners are not automatically logged in; they need approval first.
    // So, we don't call setSessionCookies here.
    return {
      success: true,
      message: 'Partner sign-up successful! Your account is pending approval from the admin.',
      user: newUser, 
    };
  } catch (error: any) {
    console.error('Error during partner sign-up:');
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
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
  try {
    await cookies().get('priming-cookie-partner-login');
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
      id: partnerDoc.id, // Using Firestore doc ID
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
    console.error('Error during partner login:');
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);

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
  try {
    await cookies().get('priming-cookie-user-signup');
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
      type: 'normal', // Default user type
    };

    const docRef = await addDoc(usersRef, userDataToSave);
    
    const newUser: UserData = {
      id: docRef.id, // Using Firestore doc ID as user's main ID
      fullName: data.fullName,
      email: data.email,
      type: 'normal',
    };

    await setSessionCookies(newUser); // Log in the user immediately after sign-up

    return {
      success: true,
      message: 'Sign-up successful! Welcome to FinSol RN.',
      user: newUser,
    };
  } catch (error: any) {
    console.error('Error during user sign-up:');
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
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
  try {
    await cookies().get('priming-cookie-user-login');
    const usersRef = collection(db, 'users'); // Query 'users' collection
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

    // Ensure the user type from DB is one of the expected types
    const userType = (userDataFromDb.type === 'partner' || userDataFromDb.type === 'normal') 
                     ? userDataFromDb.type 
                     : 'normal'; // Default to 'normal' if type is missing or invalid

    const loggedInUser: UserData = {
      id: userDoc.id, // Using Firestore doc ID
      fullName: userDataFromDb.fullName,
      email: userDataFromDb.email,
      type: userType,
    };

    await setSessionCookies(loggedInUser);

    return {
      success: true,
      message: 'Login successful!',
      user: loggedInUser,
    };
  } catch (error: any) {
    console.error('Error during user login:');
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
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
  try {
    await clearSessionCookies();
    return { success: true, message: "Logged out successfully." };
  } catch (error: any) {
    console.error('Error during logout:');
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
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
    // Prime the cookie jar by attempting a read first
    await cookies().get('any-placeholder-cookie-for-check');

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
    

