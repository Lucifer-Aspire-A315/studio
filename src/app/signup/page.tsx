
"use client";

import React from 'react';
import { UserSignUpForm } from '@/components/forms/UserSignUpForm';
import { Header } from '@/components/layout/Header'; // Assuming Header is needed for layout
import { Footer } from '@/components/layout/Footer'; // Assuming Footer is needed for layout
import type { SetPageView } from '@/app/page'; // Dummy for Header prop
import { useAuth } from '@/contexts/AuthContext';

export default function UserSignUpPage() {
  const { isLoading } = useAuth(); // To potentially show loading state if context is initializing

  // Dummy setCurrentPage for Header, actual navigation is handled by Next Router
  const mockSetCurrentPage: SetPageView = () => {};

  if (isLoading) {
    // Optional: Show a loading spinner for the whole page if AuthContext is busy
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header setCurrentPage={mockSetCurrentPage} />
      <main className="flex-grow">
        <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-128px)] flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <UserSignUpForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
