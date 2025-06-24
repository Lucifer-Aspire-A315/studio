
"use client";

import React from 'react';
import { PartnerSignUpForm } from '@/components/forms/PartnerSignUpForm';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';

export default function PartnerSignUpPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-64px)] flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <PartnerSignUpForm />
          </div>
        </section>
      </main>
    </div>
  );
}
