
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
import { GovernmentSchemesPage } from '@/components/sections/GovernmentSchemesPage';
import { GovernmentSchemeLoanApplicationForm } from '@/components/forms/GovernmentSchemeLoanApplicationForm';
import { CAServicesPage } from '@/components/sections/CAServicesPage';
import { GstServiceApplicationForm } from '@/components/forms/GstServiceApplicationForm';
import { ItrFilingConsultationForm } from '@/components/forms/ItrFilingConsultationForm';
import { AccountingBookkeepingForm } from '@/components/forms/AccountingBookkeepingForm';
import { CompanyIncorporationForm } from '@/components/forms/CompanyIncorporationForm';
import { FinancialAdvisoryForm } from '@/components/forms/FinancialAdvisoryForm';
// import { PartnerLoginOptionsPage } from '@/components/sections/PartnerLoginOptionsPage'; // Removed
import { Skeleton } from '@/components/ui/skeleton'; 
import { logoutAction } from '@/app/actions/authActions'; // Import logoutAction


export interface UserData {
  id: string;
  fullName: string;
  email: string;
  type: 'partner' | 'normal'; // Add other types as needed
}

export type PageView = 
  'main' | 
  'homeLoan' | 
  'personalLoan' | 
  'businessLoan' | 
  'creditCard' | 
  'governmentSchemes' | 
  'governmentSchemeApplication' | 
  'caServices' | 
  'gstServiceForm' | 
  'itrFilingConsultationForm' | 
  'accountingBookkeepingForm' | 
  'companyIncorporationForm' | 
  'financialAdvisoryForm';
  // 'partnerLoginOptions' removed

export type SetPageView = React.Dispatch<React.SetStateAction<PageView>>;
export type SetSelectedGovernmentScheme = React.Dispatch<React.SetStateAction<string | undefined>>;
export type SetOtherGovernmentSchemeName = React.Dispatch<React.SetStateAction<string | undefined>>;
export type SetCurrentUser = (user: UserData | null) => void;


export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>('main');
  const [isClient, setIsClient] = useState(false);
  const [selectedGovernmentScheme, setSelectedGovernmentScheme] = useState<string | undefined>();
  const [otherGovernmentSchemeName, setOtherGovernmentSchemeName] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);


  useEffect(() => {
    setIsClient(true);
    // Logic to check for existing session on initial load (e.g., from a cookie or API call)
    // This part needs to be robust for session persistence across refreshes.
    // For now, currentUser is only set by login/signup forms.
    // Example:
    // async function checkSession() {
    //   try {
    //     const res = await fetch('/api/auth/session'); // You'd need to create this API route
    //     if (res.ok) {
    //       const data = await res.json();
    //       if (data.user) setCurrentUser(data.user);
    //     }
    //   } catch (error) { console.error("Session check failed", error); }
    // }
    // checkSession();

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#home' || hash === '#services' || hash === '#calculator' || hash === '#about') {
        if(currentPage !== 'main') setCurrentPage('main');
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    if (window.location.hash && (window.location.hash === '#home' || window.location.hash === '#services' || window.location.hash === '#calculator' || window.location.hash === '#about')) {
       setCurrentPage('main');
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

  const handleSetCurrentUser: SetCurrentUser = (user) => {
    setCurrentUser(user);
  };

  // Replace mockSetCurrentUser in PartnerLogin and PartnerSignUp pages with this
  // This requires making these pages components rendered by Home, or using Context.
  // For now, the mock function in those page.tsx files will log to console.
  // A better approach for true SPA behavior would be React Context.
  // For separate pages (/partner-login), they will need their own way to call setCurrentUser,
  // or for Header to get current user from a global context/store.
  // For this iteration, Header receives currentUser from this Home component.
  // If navigating to /partner-login, that page will manage its own form submission
  // and the Header won't immediately update unless we use a global state (Context).
  // The redirect after login from /partner-login to '/' will allow Home to potentially re-fetch session.

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <Skeleton className="h-16 w-full" />
        <main className="flex-grow container mx-auto px-6 py-8 space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </main>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  const renderPageContent = () => {
    // If currentUser changes, this will re-render, and Header will get the new currentUser prop.
    // This works when forms are rendered as part of this Home component's tree.
    // For /partner-login and /partner-signup, they are separate Next.js pages.
    // Their forms will call their own `setCurrentUser` prop.
    // The `setCurrentUser` in `partner-login/page.tsx` and `partner-signup/page.tsx`
    // should be replaced with a mechanism to update a shared state (like React Context)
    // or rely on a redirect back to '/' which would re-evaluate session for the Header.

    switch (currentPage) {
      case 'main':
        return (
          <>
            <HeroSection setCurrentPage={setCurrentPage} />
            <ServicesSection setCurrentPage={setCurrentPage} />
            <EMICalculatorSection />
            <section id="about" className="py-16 md:py-20 bg-background hidden">
              <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">About Us</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  RN Fintech is committed to providing transparent, quick, and easy financial solutions.
                  We leverage technology to simplify the loan application process and offer competitive rates.
                  Our mission is to empower individuals and businesses to achieve their financial aspirations.
                </p>
              </div>
            </section>
             <section id="contact" className="py-16 md:py-20 bg-secondary hidden">
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
      case 'governmentSchemes':
        return <GovernmentSchemesPage
                  setCurrentPage={setCurrentPage}
                  setSelectedGovernmentScheme={setSelectedGovernmentScheme}
                  setOtherGovernmentSchemeName={setOtherGovernmentSchemeName}
                />;
      case 'governmentSchemeApplication':
        if (!selectedGovernmentScheme) {
          setCurrentPage('governmentSchemes'); 
          return <p>Please select a scheme first.</p>;
        }
        return <GovernmentSchemeLoanApplicationForm
                  setCurrentPage={setCurrentPage}
                  selectedScheme={selectedGovernmentScheme}
                  otherSchemeName={otherGovernmentSchemeName}
                />;
      case 'caServices':
        return <CAServicesPage setCurrentPage={setCurrentPage} />;
      case 'gstServiceForm':
        return <GstServiceApplicationForm setCurrentPage={setCurrentPage} />;
      case 'itrFilingConsultationForm':
        return <ItrFilingConsultationForm setCurrentPage={setCurrentPage} />;
      case 'accountingBookkeepingForm':
        return <AccountingBookkeepingForm setCurrentPage={setCurrentPage} />;
      case 'companyIncorporationForm':
        return <CompanyIncorporationForm setCurrentPage={setCurrentPage} />;
      case 'financialAdvisoryForm':
        return <FinancialAdvisoryForm setCurrentPage={setCurrentPage} />;
      // case 'partnerLoginOptions': // Removed
      //   return <PartnerLoginOptionsPage setCurrentPage={setCurrentPage} />;
      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Pass currentUser and setCurrentUser (via handleSetCurrentUser) to Header */}
      <Header 
        setCurrentPage={setCurrentPage} 
        currentUser={currentUser} 
        setCurrentUser={handleSetCurrentUser} 
        logoutAction={logoutAction}
      />
      <main className="flex-grow">
        {renderPageContent()}
      </main>
      <Footer />
    </div>
  );
}

    