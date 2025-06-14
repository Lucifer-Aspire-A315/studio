
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Calculator, MailWarning } from 'lucide-react'; 
import type { PageView, SetPageView } from '@/app/page';
import { useToast } from "@/hooks/use-toast";

interface ItrServiceOptionsPageProps {
  setCurrentPage: SetPageView;
}

const itrServices = [
  {
    id: "filing",
    title: "Filing of Income Tax Returns (ITR)",
    icon: <FileText className="w-8 h-8 text-primary" />,
    description: "Comprehensive ITR filing for individuals and businesses."
  },
  {
    id: "planning",
    title: "Tax Calculation and Planning",
    icon: <Calculator className="w-8 h-8 text-primary" />,
    description: "Optimize your tax liabilities with expert planning and calculation."
  },
  {
    id: "notices",
    title: "Handling Income Tax Notices",
    icon: <MailWarning className="w-8 h-8 text-primary" />,
    description: "Assistance with responding to and managing income tax notices and assessments."
  }
];

export function ItrServiceOptionsPage({ setCurrentPage }: ItrServiceOptionsPageProps) {
  const { toast } = useToast();

  const handleApplyService = (serviceTitle: string) => {
    toast({
      title: "Application Coming Soon",
      description: `The application form for "${serviceTitle}" will be available shortly.`,
    });
    // Later, this could navigate to a specific form: setCurrentPage('itrFilingFormFor_' + serviceId);
  };

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('itrFiling')}
          className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to ITR Overview
        </Button>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Our ITR Services</h2>
            <p className="text-muted-foreground mt-2">
              Choose the Income Tax service you need assistance with.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {itrServices.map((service) => (
              <Card key={service.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  {service.icon}
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <Button
                    onClick={() => handleApplyService(service.title)}
                    className="w-full cta-button"
                  >
                    Apply for this Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

           <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              For any queries or custom requirements, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
