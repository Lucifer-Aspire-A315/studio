
'use client';

import React, { useState } from 'react';
import type { SetPageView, PageView, SetSelectedGovernmentScheme, SetOtherGovernmentSchemeName } from '@/app/page';
import { GovernmentSchemesPage } from '@/components/sections/GovernmentSchemesPage';
import { GovernmentSchemeLoanApplicationForm } from '@/components/forms/GovernmentSchemeLoanApplicationForm';

// This component manages the state for the multi-step government scheme application process
// specifically for the partner dashboard.
export function PartnerGovSchemeApplication() {
  const [currentPage, setCurrentPage] = useState<PageView>('governmentSchemes');
  const [selectedScheme, setSelectedScheme] = useState<string | undefined>();
  const [otherSchemeName, setOtherSchemeName] = useState<string | undefined>();

  const handleBackToSchemeSelection = () => {
    setCurrentPage('governmentSchemes');
  };

  if (currentPage === 'governmentSchemeApplication' && selectedScheme) {
    return (
      <GovernmentSchemeLoanApplicationForm
        onBack={handleBackToSchemeSelection}
        selectedScheme={selectedScheme}
        otherSchemeName={otherSchemeName}
      />
    );
  }

  // Default view is the scheme selection page
  return (
    <GovernmentSchemesPage
      setCurrentPage={setCurrentPage as SetPageView}
      setSelectedGovernmentScheme={setSelectedScheme as SetSelectedGovernmentScheme}
      setOtherGovernmentSchemeName={setOtherSchemeName as SetOtherGovernmentSchemeName}
    />
  );
}
