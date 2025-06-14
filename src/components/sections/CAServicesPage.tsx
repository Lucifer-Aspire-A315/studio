
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react'; 
import type { PageView, SetPageView } from '@/app/page';
import { useToast } from "@/hooks/use-toast";

interface CAServicesPageProps {
  setCurrentPage: SetPageView;
}

const caServicesList = [
  {
    id: "accounting",
    title: "Accounting & Bookkeeping",
    description: "Accurate accounting and bookkeeping services to keep your finances in order."
  },
  {
    id: "gst-registration",
    title: "GST Registration and Filing",
    description: "Complete GST solutions, from registration to timely return filing."
  },
  {
    id: "incorporation",
    title: "Company Incorporation",
    description: "Hassle-free company registration and compliance services."
  },
  {
    id: "audit",
    title: "Audit and Assurance",
    description: "Reliable audit services to ensure financial accuracy and compliance."
  },
  {
    id: "itr",
    title: "Income Tax Filing and Consultation",
    description: "Expert ITR filing and tax planning for individuals and businesses."
  },
  {
    id: "advisory",
    title: "Financial Advisory",
    description: "Strategic financial advice and management consultancy to grow your business."
  }
];

export function CAServicesPage({ setCurrentPage }: CAServicesPageProps) {
  const { toast } = useToast();

  const handleApplyService = (serviceId: string, serviceTitle: string) => {
    if (serviceId === 'gst-registration') {
      setCurrentPage('gstServiceForm');
    } else {
      toast({
        title: "Application Coming Soon",
        description: `The application form for "${serviceTitle}" will be available shortly.`,
      });
    }
  };

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('main')}
          className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Chartered Accountant Services</h2>
            <p className="text-muted-foreground mt-2">
              Expert financial and compliance services to meet your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caServicesList.map((service) => (
              <Card key={service.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <Button
                    onClick={() => handleApplyService(service.id, service.title)}
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
