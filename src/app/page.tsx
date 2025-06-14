"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { EMICalculatorSection } from '@/components/sections/EMICalculatorSection';
import { HomeLoanApplicationForm } from '@/components/forms/HomeLoanApplicationForm';
import { PersonalLoanApplicationForm } from '@/components/forms/PersonalLoanApplicationForm';
import { BusinessLoanApplicationForm } from '@/components/forms/BusinessLoanApplicationForm';
import { CreditCardApplicationForm } from '@/components/forms/CreditCardApplicationForm';
import { ITRFilingForm } from '@/components/forms/ITRFilingForm';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

export type PageView = 'main' | 'homeLoan' | 'personalLoan' | 'businessLoan' | 'creditCard' | 'itrFiling';
export type SetPageView = React.Dispatch<React.SetStateAction<PageView>>;

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>('main');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Handle hash changes for navigation (e.g. if user uses back/forward browser buttons after hash nav)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#home' || hash === '#services' || hash === '#calculator' || hash === '#about') {
        if(currentPage !== 'main') setCurrentPage('main');
        // Smooth scroll if on main page
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    // Initial check
    if (window.location.hash && (window.location.hash === '#home' || window.location.hash === '#services' || window.location.hash === '#calculator' || window.location.hash === '#about')) {
       setCurrentPage('main');
       // Ensure scrolling happens after main page is set and rendered
       setTimeout(() => {
        const element = document.getElementById(window.location.hash.substring(1));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
       }, 100);
    }


    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, [currentPage]);


  useEffect(() => {
    if (currentPage !== 'main') {
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <Skeleton className="h-16 w-full" /> {/* Header placeholder */}
        <main className="flex-grow container mx-auto px-6 py-8 space-y-8">
          <Skeleton className="h-64 w-full" /> {/* Hero placeholder */}
          <Skeleton className="h-48 w-full" /> {/* Services placeholder */}
          <Skeleton className="h-48 w-full" /> {/* EMI Calc placeholder */}
        </main>
        <Skeleton className="h-32 w-full" /> {/* Footer placeholder */}
      </div>
    );
  }
  
  const renderPageContent = () => {
    switch (currentPage) {
      case 'main':
        return (
          <>
            <HeroSection setCurrentPage={setCurrentPage} />
            <ServicesSection setCurrentPage={setCurrentPage} />
            <EMICalculatorSection />
            {/* Placeholder for About Us if it becomes a distinct section */}
            <section id="about" className="py-16 md:py-20 bg-background hidden"> {/* Hidden for now, can be fleshed out */}
              <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">About Us</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  RN Fintech is committed to providing transparent, quick, and easy financial solutions. 
                  We leverage technology to simplify the loan application process and offer competitive rates.
                  Our mission is to empower individuals and businesses to achieve their financial aspirations.
                </p>
              </div>
            </section>
             <section id="contact" className="py-16 md:py-20 bg-secondary hidden"> {/* Hidden for now */}
              <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Contact Us</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                    Have questions? We're here to help. Reach out to us via email or visit our office.
                </p>
                 <p className="mt-2 text-primary font-semibold">contact@rnfintech.com</p>
                 <p className="mt-1 text-muted-foreground">123 Loan Street, Finance City, India</p>
              </div>
            </section>
          </>
        );
      case 'homeLoan':
        return <HomeLoanApplicationForm setCurrentPage={setCurrentPage} />;
      case 'personalLoan':
        return <PersonalLoanApplicationForm setCurrentPage={setCurrentPage} />;
      case 'businessLoan':
        return <BusinessLoanApplicationForm setCurrentPage={setCurrentPage} />;
      case 'creditCard':
        return <CreditCardApplicationForm setCurrentPage={setCurrentPage} />;
      case 'itrFiling':
        return <ITRFilingForm setCurrentPage={setCurrentPage} />;
      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderPageContent()}
      </main>
      <Footer />
    </div>
  );
}
