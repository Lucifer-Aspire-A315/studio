
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GstServiceApplicationForm } from '@/components/forms/GstServiceApplicationForm';
import { ItrFilingConsultationForm } from '@/components/forms/ItrFilingConsultationForm';
import { AccountingBookkeepingForm } from '@/components/forms/AccountingBookkeepingForm';
import { CompanyIncorporationForm } from '@/components/forms/CompanyIncorporationForm';
import { FinancialAdvisoryForm } from '@/components/forms/FinancialAdvisoryForm';
import { AuditAndAssuranceForm } from '@/components/forms/AuditAndAssuranceForm';
import type { PageView } from '@/app/page';

type FormType = 'gst' | 'itr' | 'accounting' | 'incorporation' | 'advisory' | 'audit';

// This is a simplified SetPageView for internal state management.
type SetPageViewForPartner = React.Dispatch<React.SetStateAction<PageView | null>>;


const caServicesList = [
  { id: "accounting", title: "Accounting & Bookkeeping", description: "Manage finances and keep records.", formType: "accounting" as FormType },
  { id: "gst-registration", title: "GST Registration and Filing", description: "Complete GST solutions.", formType: "gst" as FormType },
  { id: "incorporation", title: "Company Incorporation", description: "Register your company.", formType: "incorporation" as FormType },
  { id: "audit", title: "Audit and Assurance", description: "Ensure financial accuracy.", formType: "audit" as FormType },
  { id: "itr", title: "Income Tax Filing & Consultation", description: "Expert ITR filing and planning.", formType: "itr" as FormType },
  { id: "advisory", title: "Financial Advisory", description: "Strategic advice to grow.", formType: "advisory" as FormType },
];

const FormComponentWrapper = ({ children, onBack }: { children: React.ReactNode, onBack: () => void }) => {
    // This wrapper injects `setCurrentPage` as a prop to the form components
    // which they expect from the main page, but here we just need to handle the back action.
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { setCurrentPage: onBack } as any);
        }
        return child;
    });

    return <>{childrenWithProps}</>;
};

export function PartnerCAServiceApplication() {
    const [activeForm, setActiveForm] = useState<FormType | null>(null);

    const handleBackToMenu = () => {
        setActiveForm(null);
    };

    if (activeForm) {
        let FormComponent;
        switch (activeForm) {
            case 'gst': FormComponent = <GstServiceApplicationForm setCurrentPage={() => {}} />; break;
            case 'itr': FormComponent = <ItrFilingConsultationForm setCurrentPage={() => {}} />; break;
            case 'accounting': FormComponent = <AccountingBookkeepingForm setCurrentPage={() => {}} />; break;
            case 'incorporation': FormComponent = <CompanyIncorporationForm setCurrentPage={() => {}} />; break;
            case 'advisory': FormComponent = <FinancialAdvisoryForm setCurrentPage={() => {}} />; break;
            case 'audit': FormComponent = <AuditAndAssuranceForm setCurrentPage={() => {}} />; break;
            default: return null;
        }
        return <FormComponentWrapper onBack={handleBackToMenu}>{FormComponent}</FormComponentWrapper>;
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caServicesList.map(service => (
                 <Button key={service.id} onClick={() => setActiveForm(service.formType)} size="lg" variant="outline" className="justify-start h-auto py-4 text-left">
                    <div>
                        <p className="font-semibold">{service.title}</p>
                        <p className="font-normal text-muted-foreground text-sm">{service.description}</p>
                    </div>
                </Button>
            ))}
        </div>
    );
}
