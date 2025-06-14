
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, UserPlus } from 'lucide-react'; 
import type { PageView, SetPageView } from '@/app/page';
import { useToast } from "@/hooks/use-toast";

interface PartnerLoginOptionsPageProps {
  setCurrentPage: SetPageView;
}

const GmailIcon = () => (
  <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 5.889V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v.889l9.293 9.293.142.139L12 15.889l.565-.568.142-.139L22 5.889zM2 7.111V19c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7.111l-9.435 9.435-.142.139L12 17.253l-.423-.422-.142-.139L2 7.111z"/>
  </svg>
);

const loginOptions = [
  {
    id: "signup",
    title: "Sign Up",
    icon: <UserPlus className="w-10 h-10 text-primary" />,
    description: "Create a new partner account to get started.",
    buttonText: "Sign Up"
  },
  {
    id: "gmail_login",
    title: "Login with Gmail",
    icon: <GmailIcon />,
    description: "Sign in quickly and securely using your Gmail account.",
    buttonText: "Login with Gmail"
  }
];

export function PartnerLoginOptionsPage({ setCurrentPage }: PartnerLoginOptionsPageProps) {
  const { toast } = useToast();

  const handleLoginTypeClick = (loginType: string, title: string) => {
    toast({
      title: `${title} Feature Coming Soon`,
      description: `The functionality for "${title}" will be available shortly.`,
    });
    // Later, this could navigate to a specific login/signup form:
    // setCurrentPage(`${loginType}Form` as PageView); 
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
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Partner Account Access</h2>
            <p className="text-muted-foreground mt-2">
              Sign up or log in to access partner features.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {loginOptions.map((option) => (
              <Card key={option.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center space-y-3 pb-4">
                  {option.icon}
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm text-muted-foreground mb-6 h-10">{option.description}</CardDescription>
                  <Button
                    onClick={() => handleLoginTypeClick(option.id, option.title)}
                    className="w-full cta-button"
                  >
                    {option.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

           <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              If you encounter any issues, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
