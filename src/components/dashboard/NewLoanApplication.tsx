
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, User, Briefcase, CreditCardIcon } from 'lucide-react';
import { HomeLoanApplicationForm } from '@/components/forms/HomeLoanApplicationForm';
import { PersonalLoanApplicationForm } from '@/components/forms/PersonalLoanApplicationForm';
import { BusinessLoanApplicationForm } from '@/components/forms/BusinessLoanApplicationForm';
import { CreditCardApplicationForm } from '@/components/forms/CreditCardApplicationForm';

type FormType = 'home' | 'personal' | 'business' | 'creditCard';

export function PartnerLoanApplication() {
    const [activeForm, setActiveForm] = useState<FormType | null>(null);

    const handleBackToMenu = () => {
        setActiveForm(null);
    };

    if (activeForm === 'home') {
        return <HomeLoanApplicationForm onBack={handleBackToMenu} backButtonText="Back to Application Menu" />;
    }
    if (activeForm === 'personal') {
        return <PersonalLoanApplicationForm onBack={handleBackToMenu} backButtonText="Back to Application Menu" />;
    }
    if (activeForm === 'business') {
        return <BusinessLoanApplicationForm onBack={handleBackToMenu} backButtonText="Back to Application Menu" />;
    }
    if (activeForm === 'creditCard') {
        return <CreditCardApplicationForm onBack={handleBackToMenu} backButtonText="Back to Application Menu" />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => setActiveForm('home')} size="lg" variant="outline" className="justify-start h-auto py-4">
                <Home className="mr-4 h-6 w-6" />
                <div>
                    <p className="font-semibold">Home Loan</p>
                    <p className="font-normal text-muted-foreground text-sm">For property purchase or construction</p>
                </div>
            </Button>
            <Button onClick={() => setActiveForm('personal')} size="lg" variant="outline" className="justify-start h-auto py-4">
                <User className="mr-4 h-6 w-6" />
                 <div>
                    <p className="font-semibold">Personal Loan</p>
                    <p className="font-normal text-muted-foreground text-sm">For personal needs like weddings, travel</p>
                </div>
            </Button>
            <Button onClick={() => setActiveForm('business')} size="lg" variant="outline" className="justify-start h-auto py-4">
                <Briefcase className="mr-4 h-6 w-6" />
                 <div>
                    <p className="font-semibold">Business Loan</p>
                    <p className="font-normal text-muted-foreground text-sm">For business expansion or working capital</p>
                </div>
            </Button>
            <Button onClick={() => setActiveForm('creditCard')} size="lg" variant="outline" className="justify-start h-auto py-4">
                <CreditCardIcon className="mr-4 h-6 w-6" />
                 <div>
                    <p className="font-semibold">Credit Card</p>
                    <p className="font-normal text-muted-foreground text-sm">Apply for a new credit card</p>
                </div>
            </Button>
        </div>
    );
}
