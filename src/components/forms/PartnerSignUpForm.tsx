
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
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from '@/contexts/AuthContext';
import { FormSection, FormFieldWrapper } from './FormSection';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';


export function PartnerSignUpForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<PartnerSignUpFormData>({
    resolver: zodResolver(PartnerSignUpSchema),
    defaultValues: {
      businessModel: undefined,
      fullName: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
      personalDetails: {
          fathersHusbandsName: '',
          dob: '',
          gender: undefined,
          pan: '',
          aadhaar: '',
          currentAddress: '',
          isPermanentAddressSame: true,
          permanentAddress: '',
      },
      professionalBackground: {
          highestQualification: '',
          presentOccupation: '',
          yearsInOccupation: undefined,
          previousEmployment: '',
      },
      financialDetails: {
          bankAccountNumber: '',
          ifscCode: '',
          bankName: '',
          bankBranch: '',
          annualIncome: undefined,
          hasExistingLoans: false,
          existingLoanDetails: '',
      },
      constitution: undefined,
      businessScope: {
          operatingCity: '',
          interestedProducts: '',
      },
      declaration: false,
    },
  });

  const businessModel = form.watch('businessModel');
  const isPermanentAddressSame = form.watch('personalDetails.isPermanentAddressSame');
  const hasExistingLoans = form.watch('financialDetails.hasExistingLoans');

  async function onSubmit(data: PartnerSignUpFormData) {
    setIsSubmitting(true);
    try {
      const result = await partnerSignUpAction(data);
      if (result.success && result.user) {
        toast({
          title: "Sign Up Successful",
          description: result.message || "Your account has been created and is pending approval.",
        });
        login(result.user);
        form.reset();
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: result.message || "An unknown error occurred.",
        });
        if (result.errors) {
           Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            form.setError(fieldName as any, { // Using 'as any' due to complexity of nested paths
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
    <div className="max-w-2xl mx-auto bg-card p-8 rounded-2xl shadow-xl">
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
              name="businessModel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Business Model *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="dsa" /></FormControl>
                        <FormLabel className="font-normal">DSA (Direct Selling Agent)</FormLabel>
                      </FormItem>
                       <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="franchise" /></FormControl>
                        <FormLabel className="font-normal">Franchise</FormLabel>
                      </FormItem>
                       <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="referral" /></FormControl>
                        <FormLabel className="font-normal">Referral Partner</FormLabel>
                      </FormItem>
                       <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="manchar" /></FormControl>
                        <FormLabel className="font-normal">Manchar Partner</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          {businessModel === 'dsa' ? (
             <>
                <FormSection title="Personal Details">
                  <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel>Full Name (as per ID proof) *</FormLabel> <FormControl> <Input placeholder="Your Full Name" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="personalDetails.fathersHusbandsName" render={({ field }) => ( <FormItem> <FormLabel>Father's/Husband's Name *</FormLabel> <FormControl> <Input placeholder="Father's or Husband's Name" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="personalDetails.dob" render={({ field }) => ( <FormItem> <FormLabel>Date of Birth *</FormLabel> <FormControl> <Input type="date" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  
                  <FormField
                    control={form.control}
                    name="personalDetails.gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gender *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row gap-4">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="male" /></FormControl>
                              <FormLabel className="font-normal">Male</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="female" /></FormControl>
                              <FormLabel className="font-normal">Female</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="other" /></FormControl>
                              <FormLabel className="font-normal">Other</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField control={form.control} name="personalDetails.pan" render={({ field }) => ( <FormItem> <FormLabel>PAN Card Number *</FormLabel> <FormControl> <Input placeholder="ABCDE1234F" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="personalDetails.aadhaar" render={({ field }) => ( <FormItem> <FormLabel>Aadhaar Card Number *</FormLabel> <FormControl> <Input placeholder="123456789012" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="mobileNumber" render={({ field }) => ( <FormItem> <FormLabel>Mobile Number *</FormLabel> <FormControl> <Input type="tel" placeholder="10-digit mobile number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email ID *</FormLabel> <FormControl> <Input type="email" placeholder="your.email@example.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormFieldWrapper className="md:col-span-2"> <FormField control={form.control} name="personalDetails.currentAddress" render={({ field }) => ( <FormItem> <FormLabel>Current Residential Address *</FormLabel> <FormControl> <Textarea placeholder="Full current address" {...field} /> </FormControl> <FormMessage /> </FormItem> )} /> </FormFieldWrapper>
                  
                  <FormFieldWrapper className="md:col-span-2"> 
                    <FormField
                      control={form.control}
                      name="personalDetails.isPermanentAddressSame"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Is permanent address same as current? *</FormLabel>
                           <FormControl>
                            <RadioGroup onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)} className="flex flex-row gap-4">
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="true" /></FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="false" /></FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormFieldWrapper>

                  {!isPermanentAddressSame && ( <FormFieldWrapper className="md:col-span-2"> <FormField control={form.control} name="personalDetails.permanentAddress" render={({ field }) => ( <FormItem> <FormLabel>Permanent Address *</FormLabel> <FormControl> <Textarea placeholder="Full permanent address" {...field} /> </FormControl> <FormMessage /> </FormItem> )} /> </FormFieldWrapper> )}
                </FormSection>

                <FormSection title="Educational & Professional Background">
                    <FormField control={form.control} name="professionalBackground.highestQualification" render={({ field }) => ( <FormItem> <FormLabel>Highest Educational Qualification *</FormLabel> <FormControl> <Input placeholder="e.g., B.Com, MBA" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="professionalBackground.presentOccupation" render={({ field }) => ( <FormItem> <FormLabel>Present Occupation *</FormLabel> <FormControl> <Input placeholder="e.g., Salaried, Business Owner" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="professionalBackground.yearsInOccupation" render={({ field }) => ( <FormItem> <FormLabel>Years in Current Employment/Business *</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 5" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormFieldWrapper className="md:col-span-2"> <FormField control={form.control} name="professionalBackground.previousEmployment" render={({ field }) => ( <FormItem> <FormLabel>Previous Employment History (if applicable)</FormLabel> <FormControl> <Textarea placeholder="Mention previous company and role" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/> </FormFieldWrapper>
                </FormSection>

                <FormSection title="Financial Details">
                  <FormField control={form.control} name="financialDetails.bankAccountNumber" render={({ field }) => ( <FormItem> <FormLabel>Bank Account Number *</FormLabel> <FormControl> <Input placeholder="Your bank account number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="financialDetails.ifscCode" render={({ field }) => ( <FormItem> <FormLabel>IFSC Code *</FormLabel> <FormControl> <Input placeholder="Your bank's IFSC code" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="financialDetails.bankName" render={({ field }) => ( <FormItem> <FormLabel>Bank Name *</FormLabel> <FormControl> <Input placeholder="Your bank's name" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="financialDetails.bankBranch" render={({ field }) => ( <FormItem> <FormLabel>Bank Branch *</FormLabel> <FormControl> <Input placeholder="Your bank's branch" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormFieldWrapper className="md:col-span-2"><FormField control={form.control} name="financialDetails.annualIncome" render={({ field }) => ( <FormItem> <FormLabel>Annual Income (from IT Returns/Form 16) *</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 500000" {...field} /> </FormControl> <FormMessage /> </FormItem> )} /></FormFieldWrapper>
                  
                  <FormFieldWrapper className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="financialDetails.hasExistingLoans"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Any existing loans or liabilities? *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => field.onChange(value === 'true')}
                              defaultValue={String(field.value)}
                              className="flex flex-row gap-4"
                            >
                               <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="false" /></FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                              </FormItem>
                               <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="true" /></FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormFieldWrapper>

                  {hasExistingLoans && ( <FormFieldWrapper className="md:col-span-2"> <FormField control={form.control} name="financialDetails.existingLoanDetails" render={({ field }) => ( <FormItem> <FormLabel>Details of Existing Loans *</FormLabel> <FormControl> <Textarea placeholder="Mention loan type, bank, and outstanding amount" {...field} /> </FormControl> <FormMessage /> </FormItem> )} /> </FormFieldWrapper> )}
                </FormSection>

                <FormSection title="Constitution & Business Scope">
                     <FormField
                      control={form.control}
                      name="constitution"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Constitution *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="individual" /></FormControl>
                                <FormLabel className="font-normal">Individual</FormLabel>
                              </FormItem>
                               <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="firm" /></FormControl>
                                <FormLabel className="font-normal">Firm</FormLabel>
                              </FormItem>
                               <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="company" /></FormControl>
                                <FormLabel className="font-normal">Company</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="businessScope.operatingCity" render={({ field }) => ( <FormItem> <FormLabel>Preferred Operating City/Region *</FormLabel> <FormControl> <Input placeholder="e.g., Pune" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormFieldWrapper className="md:col-span-2"> <FormField control={form.control} name="businessScope.interestedProducts" render={({ field }) => ( <FormItem> <FormLabel>Loan Products Interested In Sourcing *</FormLabel> <FormControl> <Textarea placeholder="e.g., Home Loans, Personal Loans, Business Loans" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/> </FormFieldWrapper>
                </FormSection>
             </>
          ) : (
            <>
                <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel>Full Name *</FormLabel> <FormControl> <Input placeholder="Your Full Name" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email ID *</FormLabel> <FormControl> <Input type="email" placeholder="your.email@example.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="mobileNumber" render={({ field }) => ( <FormItem> <FormLabel>Mobile Number *</FormLabel> <FormControl> <Input type="tel" placeholder="10-digit mobile number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </>
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Create Password *</FormLabel>
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
                <FormLabel>Confirm Password *</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {businessModel === 'dsa' && (
            <FormField
                control={form.control}
                name="declaration"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                        Declaration and Undertaking *
                        </FormLabel>
                        <FormMessage />
                         <p className="text-xs text-muted-foreground">
                         I hereby declare that all information provided is true and correct, and that no criminal proceedings are pending against me. I undertake to abide by the terms and conditions of the DSA agreement.
                        </p>
                    </div>
                    </FormItem>
                )}
            />
          )}

          <Button type="submit" className="w-full cta-button" disabled={isSubmitting || !businessModel}>
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
