
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Info, Banknote, Factory, Users, MoreHorizontal } from 'lucide-react';
import type { SetPageView } from '@/app/page';

interface GovernmentSchemesPageProps {
  setCurrentPage: SetPageView;
}

const schemeOptions = [
  {
    id: "pmmy",
    label: "PM Mudra Yojana",
    icon: <Banknote className="w-5 h-5 mr-2 text-primary" />,
    description: "Loans up to ₹10 lakh for non-corporate, non-farm small/micro enterprises."
  },
  {
    id: "pmegp",
    label: "PMEGP (Khadi Board)",
    icon: <Factory className="w-5 h-5 mr-2 text-primary" />,
    description: "Credit-linked subsidy for new self-employment ventures in the non-farm sector."
  },
  {
    id: "standup",
    label: "Stand-Up India",
    icon: <Users className="w-5 h-5 mr-2 text-primary" />,
    description: "Loans between ₹10 lakh and ₹1 Crore for SC/ST and women entrepreneurs."
  },
  {
    id: "other",
    label: "Other",
    icon: <MoreHorizontal className="w-5 h-5 mr-2 text-primary" />,
    description: "Specify other government loan scheme."
  }
];

export function GovernmentSchemesPage({ setCurrentPage }: GovernmentSchemesPageProps) {
  const [selectedScheme, setSelectedScheme] = useState<string | undefined>();
  const [otherSchemeName, setOtherSchemeName] = useState<string>("");

  const handleProceed = () => {
    // Placeholder for future navigation or action
    console.log("Selected Scheme:", selectedScheme);
    if (selectedScheme === "other") {
      console.log("Other Scheme Name:", otherSchemeName);
    }
    // For now, it could navigate back or to a generic next step
    // setCurrentPage('someNextStep'); 
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
            <Info className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Government Scheme Loan Application</h2>
            <p className="text-muted-foreground mt-1">
              Select the scheme you wish to apply for.
            </p>
          </div>

          <div className="space-y-6">
            <Label className="text-lg font-semibold text-gray-900 dark:text-gray-100">Loan Scheme Applying For:</Label>
            <RadioGroup 
              value={selectedScheme} 
              onValueChange={setSelectedScheme}
              className="space-y-3"
            >
              {schemeOptions.map((scheme) => (
                <div key={scheme.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={scheme.id} id={scheme.id} />
                  <Label htmlFor={scheme.id} className="flex items-center cursor-pointer w-full">
                    {scheme.icon}
                    <div className="ml-2">
                        <span className="font-medium">{scheme.label}</span>
                        <p className="text-xs text-muted-foreground">{scheme.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedScheme === "other" && (
              <div className="mt-4">
                <Label htmlFor="otherSchemeName" className="font-medium">Specify Other Scheme Name</Label>
                <Input 
                  id="otherSchemeName" 
                  value={otherSchemeName} 
                  onChange={(e) => setOtherSchemeName(e.target.value)} 
                  placeholder="Enter scheme name"
                  className="mt-1"
                />
              </div>
            )}
          </div>
          
          <div className="mt-10 pt-6 border-t border-border">
            <Button 
              onClick={handleProceed} 
              className="w-full cta-button" 
              size="lg"
              disabled={!selectedScheme || (selectedScheme === "other" && !otherSchemeName.trim())}
            >
              Proceed
            </Button>
          </div>

           <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              For detailed information about these schemes, please visit the respective official government portals. 
              Eligibility criteria and application processes may vary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
