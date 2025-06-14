
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartnerSignUpSchema, type PartnerSignUpFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, LogIn, UserPlus, Mail, Loader2 } from 'lucide-react'; // Added Loader2
import type { SetPageView } from '@/app/page';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { partnerSignUpAction } from '@/app/actions/authActions';

interface PartnerLoginOptionsPageProps {
  setCurrentPage: SetPageView;
}

const GmailIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 5.889V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v.889l9.293 9.293.142.139L12 15.889l.565-.568.142-.139L22 5.889zM2 7.111V19c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7.111l-9.435 9.435-.142.139L12 17.253l-.423-.422-.142-.139L2 7.111z"/>
  </svg>
);


export function PartnerLoginOptionsPage({ setCurrentPage }: PartnerLoginOptionsPageProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PartnerSignUpFormData>({
    resolver: zodResolver(PartnerSignUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSignUpSubmit(data: PartnerSignUpFormData) {
    setIsSubmitting(true);
    try {
      const result = await partnerSignUpAction(data);
      if (result.success) {
        toast({
          title: "Sign Up Successful",
          description: result.message,
        });
        form.reset();
        // Potentially navigate to a dashboard or confirmation page
        // setCurrentPage('partnerDashboard'); 
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: result.message || "An unknown error occurred.",
        });
        // Handle field-specific errors if your server action returns them
        if (result.errors) {
           Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            form.setError(fieldName as keyof PartnerSignUpFormData, { // Cast fieldName
              type: 'manual',
              message: (errorMessages as string[]).join(', '),
            });
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign Up Error",
        description: "An unexpected error occurred during sign up.",
      });
      console.error("Partner sign up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGmailLogin = () => {
    toast({
      title: "Gmail Login Coming Soon",
      description: "The functionality for Gmail login will be available shortly.",
    });
    // Later, this would initiate an OAuth flow
    // e.g., window.location.href = '/api/auth/google';
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
        <div className="max-w-lg mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <LogIn className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Partner Account Access</h2>
            <p className="text-muted-foreground mt-1">
              Join our network or access your existing partner account.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-center mb-1 text-card-foreground flex items-center justify-center">
              <UserPlus className="w-6 h-6 mr-2 text-primary"/> Partner Sign-Up Form (Manual)
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">Create a new partner account.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSignUpSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email ID</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="10-digit mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Create Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a strong password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full cta-button" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing Up...</> : 'Sign Up Now'}
                </Button>
              </form>
            </Form>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              📝 You will receive a confirmation email/SMS after approval.
            </p>
          </div>

          <Separator className="my-8" />

          <div>
            <h3 className="text-xl font-semibold text-center mb-1 text-card-foreground flex items-center justify-center">
              <Mail className="w-6 h-6 mr-2 text-primary"/> Option 2: Direct Gmail Login (OAuth)
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Use this if you want users to log in quickly using their Google account.
            </p>
            <Button 
              variant="outline" 
              onClick={handleGmailLogin} 
              className="w-full cta-button border-primary text-primary hover:bg-primary/10 hover:text-primary"
            >
              <GmailIcon />
              Login with Gmail
            </Button>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              (Gmail Login Button Integration placeholder)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
