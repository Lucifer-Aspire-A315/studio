"use client";

import { Button } from '@/components/ui/button';
import type { SetPageView } from '@/app/page';
import { NewsTicker } from '@/components/shared/NewsTicker';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

export function HeroSection({ setCurrentPage }: HeroSectionProps) {
  return (
    <section id="home" className="hero-bg py-20 lg:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          <span className="text-primary">Quick & Easy</span> Financial Solutions
        </h1>
        
        <NewsTicker />

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
            className="cta-button bg-background hover:bg-secondary text-primary font-bold py-3 px-8 border-primary/30 w-full sm:w-auto"
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
