
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Info, ExternalLink } from 'lucide-react';
import type { SetPageView } from '@/app/page';

interface GovernmentSchemesPageProps {
  setCurrentPage: SetPageView;
}

const schemes = [
  {
    id: "pmmy",
    title: "Pradhan Mantri Mudra Yojana (PMMY)",
    description: "Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. Loans are categorized as Shishu, Kishore, and Tarun to signify the stage of growth/development and funding needs of the beneficiary micro unit/entrepreneur.",
    eligibilityLink: "#", // Placeholder
    applyLink: "#", // Placeholder
  },
  {
    id: "standup",
    title: "Stand-Up India Scheme",
    description: "Facilitates bank loans between ₹10 lakh and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
    eligibilityLink: "#",
    applyLink: "#",
  },
  {
    id: "svanidhi",
    title: "PM SVANidhi Scheme (PM Street Vendor's AtmaNirbhar Nidhi)",
    description: "A special micro-credit facility for street vendors. It provides collateral-free working capital loans up to ₹10,000, with subsequent loans of ₹20,000 and ₹50,000 with good repayment history.",
    eligibilityLink: "#",
    applyLink: "#",
  },
  {
    id: "pmegp",
    title: "Prime Minister’s Employment Generation Programme (PMEGP)",
    description: "A credit-linked subsidy programme for generating employment opportunities by setting up new self-employment ventures/projects/micro enterprises in the non-farm sector.",
    eligibilityLink: "#",
    applyLink: "#",
  },
  {
    id: "cgtmse",
    title: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    description: "Provides credit guarantee to financial institutions for collateral-free loans extended to Micro and Small Enterprise (MSE) units. This scheme helps new and existing MSEs to get access to finance.",
    eligibilityLink: "#",
    applyLink: "#",
  }
];

export function GovernmentSchemesPage({ setCurrentPage }: GovernmentSchemesPageProps) {
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
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <Info className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Explore Government Loan Schemes</h2>
            <p className="text-muted-foreground mt-1">
              Discover various loan schemes offered by the government to support individuals and businesses.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {schemes.map((scheme) => (
              <AccordionItem value={scheme.id} key={scheme.id} className="bg-background/50 rounded-lg border border-border p-1">
                <AccordionTrigger className="hover:no-underline px-4 py-3 text-lg font-semibold text-primary">
                  {scheme.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4 space-y-3">
                  <p className="text-muted-foreground text-sm">{scheme.description}</p>
                  <div className="flex space-x-3 mt-3">
                    <Button variant="outline" size="sm" onClick={() => window.open(scheme.eligibilityLink, '_blank')} className="text-xs">
                      Eligibility Criteria <ExternalLink className="ml-1.5 h-3 w-3" />
                    </Button>
                    <Button size="sm" onClick={() => window.open(scheme.applyLink, '_blank')} className="text-xs cta-button">
                      Apply Now <ExternalLink className="ml-1.5 h-3 w-3" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

           <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              For detailed information and to apply for these schemes, please visit the respective official government portals. 
              Eligibility criteria and application processes may vary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
