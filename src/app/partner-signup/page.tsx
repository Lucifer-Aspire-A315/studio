
"use client";

import React from 'react';
import { PartnerSignUpForm } from '@/components/forms/PartnerSignUpForm';
// No longer need mockSetCurrentUser or SetCurrentUser type from app/page

export default function PartnerSignUpPage() {
  return (
    <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-128px)] flex items-center"> {/* Adjust min-h based on header/footer */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* PartnerSignUpForm will now use AuthContext for setCurrentUser */}
        <PartnerSignUpForm />
      </div>
    </section>
  );
}
