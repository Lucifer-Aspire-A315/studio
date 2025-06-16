
// This file will be very simple, primarily for routing and client-side rendering of the form.
// The actual form logic will be in PartnerLoginForm.tsx
"use client";

import React from 'react';
// We'll need to import setCurrentUser from the main page or context later
// For now, we'll assume it will be passed or handled via context.
// import type { SetCurrentUser } from '@/app/page'; // Placeholder
import { PartnerLoginForm } from '@/components/forms/PartnerLoginForm';

// This is a placeholder for how setCurrentUser might be obtained.
// In a real app, this would likely come from React Context or be passed from a higher-order component.
const mockSetCurrentUser = (user: any | null) => {
  console.log("setCurrentUser called in mock (partner-login):", user);
};


export default function PartnerLoginPage() {
  return (
    <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-128px)] flex items-center"> {/* Adjust min-h based on header/footer */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Pass the actual setCurrentUser function here */}
        <PartnerLoginForm setCurrentUser={mockSetCurrentUser} />
      </div>
    </section>
  );
}

    