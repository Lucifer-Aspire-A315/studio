
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartnerSignUpSchema, type PartnerSignUpFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from 'lucide-react';
import { partnerSignUpAction } from '@/app/actions/authActions';
import Link from 'next/link';
import type { UserData } from '@/app/page'; // Assuming UserData type will be in page.tsx or a shared types file

interface PartnerSignUpFormProps {
  setCurrentUser: (user: UserData | null) => void;
  // Consider adding a prop to navigate to login page or dashboard after signup
  // onSignUpSuccess?: () => void; 
}

export function PartnerSignUpForm({ setCurrentUser }: PartnerSignUpFormProps) {
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

  async function onSubmit(data: PartnerSignUpFormData) {
    setIsSubmitting(true);
    try {
      const result = await partnerSignUpAction(data);
      if (result.success && result.user) {
        toast({
          title: "Sign Up Successful",
          description: result.message || "Your account has been created and is pending approval.",
        });
        setCurrentUser(result.user); // Update client-side state
        form.reset();
        // Potentially navigate: onSignUpSuccess?.();
        // Or redirect using next/navigation if not on main page
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: result.message || "An unknown error occurred.",
        });
        if (result.errors) {
           Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            form.setError(fieldName as keyof PartnerSignUpFormData, {
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

  return (
    <div className="max-w-md mx-auto bg-card p-8 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <UserPlus className="w-12 h-12 mx-auto text-primary mb-2" />
        <h2 className="text-2xl font-bold text-card-foreground">Partner Sign Up</h2>
        <p className="text-muted-foreground mt-1">
          Create your partner account to get started.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already have an account?{' '}
        <Link href="/partner-login" className="font-medium text-primary hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}

    