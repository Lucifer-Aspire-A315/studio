
"use client";

// This page is being deprecated in favor of separate /partner-login and /partner-signup pages.
// Its content can be removed or it can be deleted if no longer linked.
// For now, let's clear its content to avoid confusion.

import React from 'react';
import type { SetPageView } from '@/app/page';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PartnerLoginOptionsPageProps {
  setCurrentPage: SetPageView;
}

export function PartnerLoginOptionsPage({ setCurrentPage }: PartnerLoginOptionsPageProps) {
  return (
     <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('main')}
          className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
        <div className="max-w-lg mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Partner Area</h2>
                <p className="text-muted-foreground mt-2">
                    Please use the new dedicated pages for Partner Login or Partner Sign-up, accessible via the header.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
}

    