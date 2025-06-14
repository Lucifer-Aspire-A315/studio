
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Store, Handshake, UserCog } from 'lucide-react'; 
import type { PageView, SetPageView } from '@/app/page';
import { useToast } from "@/hooks/use-toast";

interface PartnerLoginOptionsPageProps {
  setCurrentPage: SetPageView;
}

const loginOptions = [
  {
    id: "merchant",
    title: "Merchant Login",
    icon: <Store className="w-10 h-10 text-primary" />,
    description: "For vendors and service providers associated with RN Fintech."
  },
  {
    id: "partner_dsa",
    title: "Partner Login (DSA)",
    icon: <Handshake className="w-10 h-10 text-primary" />,
    description: "For Direct Selling Agents (DSAs) and channel partners."
  },
  {
    id: "manager",
    title: "Manager Login",
    icon: <UserCog className="w-10 h-10 text-primary" />,
    description: "For administrative staff and internal team members."
  }
];

export function PartnerLoginOptionsPage({ setCurrentPage }: PartnerLoginOptionsPageProps) {
  const { toast } = useToast();

  const handleLoginTypeClick = (loginType: string, title: string) => {
    toast({
      title: `${title} Form Coming Soon`,
      description: `The login functionality for "${title}" will be available shortly.`,
    });
    // Later, this could navigate to a specific login form:
    // setCurrentPage(`${loginType}LoginForm` as PageView); 
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Partner Login Options</h2>
            <p className="text-muted-foreground mt-2">
              Please select your login type to proceed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {loginOptions.map((option) => (
              <Card key={option.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4 pb-3">
                  {option.icon}
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground mb-6">{option.description}</CardDescription>
                  <Button
                    onClick={() => handleLoginTypeClick(option.id, option.title)}
                    className="w-full cta-button"
                  >
                    Login as {option.title.replace(" Login", "")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

           <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              If you are unsure about your login type, please contact support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
