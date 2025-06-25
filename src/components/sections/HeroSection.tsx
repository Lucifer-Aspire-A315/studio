
"use client";

import React from 'react';
import type { SetPageView } from '@/app/page';
import { NewsTicker } from '@/components/shared/NewsTicker';
import { Button } from '../ui/button';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

const governmentSchemes = [
  { 
    text: (
      <div>
        <p className="font-medium">Pradhan Mantri Mudra Yojana (PMMY)</p>
        <p className="mt-1">प्रधानमंत्री मुद्रा योजना (PMMY)</p>
      </div>
    ), 
    textColor: "text-primary",
    bgColor: "bg-primary/20"
  },
  { 
    text: (
      <div>
        <p className="font-medium">Stand-Up India Scheme</p>
        <p className="mt-1">स्टैंड-अप इंडिया योजना</p>
      </div>
    ),
    textColor: "text-accent",
    bgColor: "bg-accent/20"
  },
  { 
    text: (
      <div>
        <p className="font-medium">Prime Minister’s Employment Generation Programme (PMEGP)</p>
        <p className="mt-1">प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)</p>
      </div>
    ), 
    textColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/20"
  },
  { 
    text: (
      <div>
        <p className="font-medium">PM SVANidhi Scheme</p>
        <p className="mt-1">पीएम स्वनिधि योजना</p>
      </div>
    ), 
    textColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/20"
  },
  { 
    text: (
      <div>
        <p className="font-medium">PM Vishwakarma Scheme</p>
        <p className="mt-1">पीएम विश्वकर्मा योजना</p>
      </div>
    ), 
    textColor: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-500/20"
  }
];

export function HeroSection({ setCurrentPage }: HeroSectionProps) {
  return (
    <section id="home" className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
          Aapke Sapno Ka Loan, Ab <span className="animated-gradient-text">Aapke Saath</span>
        </h1>

        <div
          className="mt-8 max-w-xl mx-auto cursor-pointer"
          onClick={() => setCurrentPage('governmentSchemes')}
          role="button"
          aria-label="Click to explore Government Scheme Loans"
        >
          <NewsTicker items={governmentSchemes} />
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            size="lg" 
            className="cta-button bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 w-full sm:w-auto"
            onClick={() => setCurrentPage('caServices')} 
            aria-label="Services Offered by a Chartered Accountant (CA)"
          >
            Chartered Accountant Services
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="cta-button bg-card hover:bg-secondary text-primary font-bold py-3 px-8 border-primary/30 w-full sm:w-auto"
            onClick={() => setCurrentPage('governmentSchemes')} 
            aria-label="Explore Government Scheme Loans"
          >
            Government Scheme Loan
          </Button>
        </div>
      </div>
    </section>
  );
}
