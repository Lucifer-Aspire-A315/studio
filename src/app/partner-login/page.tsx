
"use client";

import React from 'react';
import { PartnerLoginForm } from '@/components/forms/PartnerLoginForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function PartnerLoginPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-128px)] flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <PartnerLoginForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
