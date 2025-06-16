
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UserData } from '@/app/page'; // Assuming UserData is defined here or in a shared types file
import { logoutAction as performLogoutAction, checkSessionAction } from '@/app/actions/authActions';

interface AuthContextType {
  currentUser: UserData | null;
  login: (userData: UserData) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // To handle initial session check
  const router = useRouter();

  const login = useCallback((userData: UserData) => {
    setCurrentUser(userData);
  }, []);

  const logout = useCallback(async () => {
    const result = await performLogoutAction();
    if (result.success) {
      setCurrentUser(null);
      router.push('/'); // Redirect to home after logout
    } else {
      // Handle logout error, e.g., show a toast
      console.error("Logout failed:", result.message);
    }
  }, [router]);

  useEffect(() => {
    const verifySession = async () => {
      setIsLoading(true);
      try {
        const sessionUser = await checkSessionAction();
        if (sessionUser) {
          setCurrentUser(sessionUser);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
