"use client";

import React, { useState } from 'react';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HomeLoanApplicationSchema, type HomeLoanApplicationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { validateIdentificationDetails, type ValidateIdentificationDetailsOutput } from '@/ai/flows/validate-identification-details';
import { ArrowLeft, Home as HomeIcon, Loader2 } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';


interface HomeLoanApplicationFormProps {
  setCurrentPage: SetPageView;
}


export function HomeLoanApplicationForm({ setCurrentPage }: HomeLoanApplicationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingPAN, setIsVerifyingPAN] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);

  const form = useForm<HomeLoanApplicationFormData>({
    resolver: zodResolver(HomeLoanApplicationSchema),
    defaultValues: {
      applicantDetails: {
        name: '',
        dob: '',
        mobile: '',
        email: '',
        pan: '',
        aadhaar: '',
      },
      residentialAddress: {
        fullAddress: '',
        city: '',
        state: '',
        pincode: '',
      },
      employmentIncome: {
        // employmentType: undefined, // Let zod handle default if not set
        occupation: '',
        companyName: '',
        monthlyIncome: undefined,
      },
      loanPropertyDetails: {
        loanAmountRequired: undefined,
        loanTenureRequired: undefined,
        // purposeOfLoan: undefined,
        propertyLocation: '',
        estimatedPropertyValue: undefined,
      },
      existingLoans: {
        bankName: '',
        outstandingAmount: undefined,
        emiAmount: undefined,
      },
    },
  });

  const { control, handleSubmit, getValues, setError, clearErrors } = form;

  async function onSubmit(data: HomeLoanApplicationFormData) {
    setIsSubmitting(true);
    console.log(data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Application Submitted!",
      description: "Your home loan application has been successfully submitted. We will contact you shortly.",
    });
    setIsSubmitting(false);
    // setCurrentPage('main'); // Optionally navigate away
  }

  const handleIDValidation = async (field: 'pan' | 'aadhaar') => {
    const panNumber = getValues("applicantDetails.pan");
    const aadhaarNumber = getValues("applicantDetails.aadhaar");

    if (field === 'pan' && panNumber.match(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/)) {
      setIsVerifyingPAN(true);
    } else if (field === 'aadhaar' && aadhaarNumber.match(/^\d{12}$/)) {
      setIsVerifyingAadhaar(true);
    } else {
      return; // Invalid format, zod will catch it
    }
    
    try {
      // For demonstration, we always validate both if one is triggered and valid.
      // In a real app, you might only validate the blurred field or if both are filled.
      if (!panNumber.match(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/) || !aadhaarNumber.match(/^\d{12}$/)) {
         if (field === 'pan') setIsVerifyingPAN(false);
         if (field === 'aadhaar') setIsVerifyingAadhaar(false);
        // Don't call AI if formats are wrong
        return;
      }

      const result: ValidateIdentificationDetailsOutput = await validateIdentificationDetails({ panNumber, aadhaarNumber });
      
      if (result.isValid) {
        toast({
          title: "ID Verification Success",
          description: result.validationDetails,
        });
        clearErrors("applicantDetails.pan");
        clearErrors("applicantDetails.aadhaar");
      } else {
        setError("applicantDetails.pan", { type: "manual", message: "PAN/Aadhaar validation failed." });
        setError("applicantDetails.aadhaar", { type: "manual", message: result.validationDetails });
        toast({
          variant: "destructive",
          title: "ID Verification Failed",
          description: result.validationDetails,
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Could not validate ID details. Please try again.",
      });
       setError("applicantDetails.pan", { type: "manual", message: "AI validation failed." });
       setError("applicantDetails.aadhaar", { type: "manual", message: "AI validation failed." });
    } finally {
      if (field === 'pan') setIsVerifyingPAN(false);
      if (field === 'aadhaar') setIsVerifyingAadhaar(false);
    }
  };

  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => setCurrentPage('main')} className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <HomeIcon className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Home Loan Application</h2>
            <p className="text-muted-foreground">गृह ऋण आवेदन फॉर्म</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <FormSection title="1. Applicant Details" subtitle="आवेदक की जानकारी">
                <FormField
                  control={control}
                  name="applicantDetails.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (नाम)</FormLabel>
                      <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="applicantDetails.dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth (जन्म तिथि)</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="applicantDetails.mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number (मोबाइल नंबर)</FormLabel>
                      <FormControl><Input type="tel" placeholder="10-digit mobile" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="applicantDetails.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email ID (ईमेल आईडी)</FormLabel>
                      <FormControl><Input type="email" placeholder="example@mail.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="applicantDetails.pan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        PAN Number (पैन नंबर)
                        {isVerifyingPAN && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      </FormLabel>
                      <FormControl><Input placeholder="ABCDE1234F" {...field} onBlur={() => handleIDValidation('pan')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="applicantDetails.aadhaar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Aadhaar Number (आधार नंबर)
                        {isVerifyingAadhaar && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      </FormLabel>
                      <FormControl><Input placeholder="123456789012" {...field} onBlur={() => handleIDValidation('aadhaar')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="2. Residential Address" subtitle="निवासी पता">
                 <FormFieldWrapper className="md:col-span-2">
                    <FormField
                    control={control}
                    name="residentialAddress.fullAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Address (पूरा पता)</FormLabel>
                        <FormControl><Textarea placeholder="Enter your full address" {...field} rows={3} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </FormFieldWrapper>
                <FormField
                  control={control}
                  name="residentialAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City (शहर)</FormLabel>
                      <FormControl><Input placeholder="City" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="residentialAddress.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State (राज्य)</FormLabel>
                      <FormControl><Input placeholder="State" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="residentialAddress.pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode (पिन कोड)</FormLabel>
                      <FormControl><Input placeholder="6-digit Pincode" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="3. Employment & Income Details" subtitle="रोजगार और आय की जानकारी">
                <FormField
                  control={control}
                  name="employmentIncome.employmentType"
                  render={({ field }) => (
                    <FormItem className="space-y-3 md:col-span-2">
                      <FormLabel>Employment Type (रोजगार का प्रकार)</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="salaried" /></FormControl>
                            <FormLabel className="font-normal">Salaried (वेतनभोगी)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="self-employed" /></FormControl>
                            <FormLabel className="font-normal">Self-Employed (स्व-नियोजित)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="employmentIncome.occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation/Designation (पद)</FormLabel>
                      <FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="employmentIncome.companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name (कंपनी का नाम)</FormLabel>
                      <FormControl><Input placeholder="Company Name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={control}
                    name="employmentIncome.monthlyIncome"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Monthly Income (मासिक आय)</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span>
                            <Input type="number" placeholder="e.g., 50000" className="pl-7" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </FormSection>

              <FormSection title="4. Loan & Property Details" subtitle="ऋण और संपत्ति की जानकारी">
                <FormField
                    control={control}
                    name="loanPropertyDetails.loanAmountRequired"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Loan Amount Required (आवश्यक ऋण राशि)</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span>
                            <Input type="number" placeholder="e.g., 2500000" className="pl-7" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="loanPropertyDetails.loanTenureRequired"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Loan Tenure (ऋण अवधि)</FormLabel>
                        <FormControl>
                           <Input type="number" placeholder="Years, e.g., 20" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={control}
                  name="loanPropertyDetails.purposeOfLoan"
                  render={({ field }) => (
                    <FormItem className="space-y-3 md:col-span-2">
                      <FormLabel>Purpose of Loan (ऋण का उद्देश्य)</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-x-4 gap-y-2"
                        >
                          {[
                            { value: "purchase", label: "New House Purchase" },
                            { value: "construction", label: "House Construction" },
                            { value: "renovation", label: "Home Renovation" },
                            { value: "transfer", label: "Balance Transfer" }
                          ].map(purpose => (
                            <FormItem key={purpose.value} className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value={purpose.value} /></FormControl>
                              <FormLabel className="font-normal text-sm">{purpose.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="loanPropertyDetails.propertyLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Location (संपत्ति का स्थान)</FormLabel>
                      <FormControl><Input placeholder="Location of property" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={control}
                    name="loanPropertyDetails.estimatedPropertyValue"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Estimated Property Value (अनुमानित मूल्य)</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span>
                            <Input type="number" placeholder="e.g., 5000000" className="pl-7" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </FormSection>

              <FormSection title="5. Existing Loans (Optional)" subtitle="यदि कोई वर्तमान ऋण हो">
                <FormField
                  control={control}
                  name="existingLoans.bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name (बैंक का नाम)</FormLabel>
                      <FormControl><Input placeholder="Bank Name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={control}
                    name="existingLoans.outstandingAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Outstanding Amount (बकाया राशि)</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span>
                            <Input type="number" placeholder="Outstanding amount" className="pl-7" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="existingLoans.emiAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>EMI Amount (ईएमआई)</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span>
                            <Input type="number" placeholder="Current EMI" className="pl-7" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </FormSection>
              
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button type="submit" className="w-full cta-button" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Application'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
