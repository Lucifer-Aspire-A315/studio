
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';
import type { PageView, SetPageView } from '@/app/page';
import { useToast } from "@/hooks/use-toast";

interface ItrFilingPageProps {
  setCurrentPage: SetPageView;
}

export function ItrFilingPage({ setCurrentPage }: ItrFilingPageProps) {
  const { toast } = useToast();

  const handleApplyItr = () => {
    toast({
      title: "Coming Soon!",
      description: "The ITR Filing application form will be available shortly.",
    });
    // Later, this will navigate to the ITR form: setCurrentPage('itrFilingForm');
  };

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
        <div className="max-w-2xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Income Tax Services</h2>
            <p className="text-muted-foreground mt-1">
              File your Income Tax Returns easily and accurately with our expert assistance.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <Button
              onClick={handleApplyItr}
              className="w-full cta-button"
              size="lg"
            >
              Apply for ITR Filing
            </Button>
          </div>

           <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Ensure timely and compliant ITR filing. Contact us for more details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
