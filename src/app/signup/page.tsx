
"use client";

import React from 'react';
import { UserSignUpForm } from '@/components/forms/UserSignUpForm';
import { Header } from '@/components/layout/Header'; // Assuming Header is needed for layout
import { useAuth } from '@/contexts/AuthContext';

export default function UserSignUpPage() {
  const { isLoading } = useAuth(); // To potentially show a loading state if context is initializing

  if (isLoading) {
    // Optional: Show a loading spinner for the whole page if AuthContext is busy
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-64px)] flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <UserSignUpForm />
          </div>
        </section>
      </main>
    </div>
  );
}
