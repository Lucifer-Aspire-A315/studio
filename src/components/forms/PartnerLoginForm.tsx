
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartnerLoginSchema, type PartnerLoginFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from 'lucide-react';
import { partnerLoginAction } from '@/app/actions/authActions';
import Link from 'next/link';
import type { UserData } from '@/app/page'; // Assuming UserData type will be in page.tsx or a shared types file
import { useRouter } from 'next/navigation';


interface PartnerLoginFormProps {
  setCurrentUser: (user: UserData | null) => void;
}

export function PartnerLoginForm({ setCurrentUser }: PartnerLoginFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PartnerLoginFormData>({
    resolver: zodResolver(PartnerLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: PartnerLoginFormData) {
    setIsSubmitting(true);
    try {
      const result = await partnerLoginAction(data);
      if (result.success && result.user) {
        toast({
          title: "Login Successful",
          description: result.message || "Welcome back!",
        });
        setCurrentUser(result.user); // Update client-side state
        form.reset();
        router.push('/'); // Redirect to home page after successful login
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.message || "An unknown error occurred.",
        });
        if (result.errors) {
           Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            form.setError(fieldName as keyof PartnerLoginFormData, {
              type: 'manual',
              message: (errorMessages as string[]).join(', '),
            });
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred during login.",
      });
      console.error("Partner login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-card p-8 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <LogIn className="w-12 h-12 mx-auto text-primary mb-2" />
        <h2 className="text-2xl font-bold text-card-foreground">Partner Login</h2>
        <p className="text-muted-foreground mt-1">
          Access your partner account.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cta-button" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging In...</> : 'Login'}
          </Button>
        </form>
      </Form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Don&apos;t have an account?{' '}
        <Link href="/partner-signup" className="font-medium text-primary hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}

    