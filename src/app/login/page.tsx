
"use client";

import React from 'react';
import { UserLoginForm } from '@/components/forms/UserLoginForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { SetPageView } from '@/app/page';
import { useAuth } from '@/contexts/AuthContext';


export default function UserLoginPage() {
  const { isLoading } = useAuth();
  const mockSetCurrentPage: SetPageView = () => {};

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header setCurrentPage={mockSetCurrentPage} />
      <main className="flex-grow">
        <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-128px)] flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <UserLoginForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
