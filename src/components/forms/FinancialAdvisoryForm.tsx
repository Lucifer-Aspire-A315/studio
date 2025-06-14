
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FinancialAdvisoryFormSchema, type FinancialAdvisoryFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PiggyBank, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';

interface FinancialAdvisoryFormProps {
  setCurrentPage: SetPageView;
}

const occupationOptionsFA = [
  { value: "salaried", label: "Salaried" },
  { value: "business", label: "Business" },
  { value: "professional", label: "Professional" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" }
];

const advisoryServicesOptions = [
  { name: "advisoryServicesRequired.taxSavingPlan", label: "Tax Saving Plan (under 80C, 80D, etc.)" },
  { name: "advisoryServicesRequired.investmentPlanning", label: "Investment Planning (Mutual Funds, FD, PPF)" },
  { name: "advisoryServicesRequired.retirementPlanning", label: "Retirement Planning" },
  { name: "advisoryServicesRequired.insuranceAdvisory", label: "Insurance Advisory (Term / Health / Life)" },
  { name: "advisoryServicesRequired.wealthManagement", label: "Wealth Management" },
  { name: "advisoryServicesRequired.childEducationPlanning", label: "Child Education Planning" },
  { name: "advisoryServicesRequired.nriFinancialAdvisory", label: "NRI Financial Advisory" },
  { name: "advisoryServicesRequired.otherAdvisoryService", label: "Other" },
] as const;

const currentInvestmentTypeOptions = [
    { name: "currentFinancialOverview.currentInvestmentsTypes.licInsurance", label: "LIC / Insurance" },
    { name: "currentFinancialOverview.currentInvestmentsTypes.ppfEpf", label: "PPF / EPF" },
    { name: "currentFinancialOverview.currentInvestmentsTypes.mutualFunds", label: "Mutual Funds" },
    { name: "currentFinancialOverview.currentInvestmentsTypes.fdRd", label: "FD / RD" },
    { name: "currentFinancialOverview.currentInvestmentsTypes.realEstate", label: "Real Estate" },
    { name: "currentFinancialOverview.currentInvestmentsTypes.none", label: "None" },
] as const;


const documentFieldsFA = [
    { name: "documentUploads.panCard", label: "PAN Card" },
    { name: "documentUploads.aadhaarCard", label: "Aadhaar Card" },
    { name: "documentUploads.salarySlipsIncomeProof", label: "Salary Slips / Income Proof" },
    { name: "documentUploads.lastYearItrForm16", label: "Last Year’s ITR or Form 16" },
    { name: "documentUploads.bankStatement", label: "Bank Statement (3–6 Months)" },
    { name: "documentUploads.investmentProofs", label: "Investment Proofs (Mutual Funds, LIC, etc.)" },
    { name: "documentUploads.existingLoanEmiDetails", label: "Existing Loan / EMI Details (if any)" },
];

export function FinancialAdvisoryForm({ setCurrentPage }: FinancialAdvisoryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: FinancialAdvisoryFormData = {
    applicantDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      dob: '',
      occupation: undefined,
      otherOccupationDetail: '',
      cityAndState: '',
      maritalStatus: undefined,
      dependentMembersAdults: undefined,
      dependentMembersChildren: undefined,
    },
    advisoryServicesRequired: {
      taxSavingPlan: false,
      investmentPlanning: false,
      retirementPlanning: false,
      insuranceAdvisory: false,
      wealthManagement: false,
      childEducationPlanning: false,
      nriFinancialAdvisory: false,
      otherAdvisoryService: false,
      otherAdvisoryServiceDetail: '',
    },
    currentFinancialOverview: {
      annualIncome: undefined,
      monthlySavings: undefined,
      currentInvestmentsAmount: undefined,
      currentInvestmentsTypes: {
        licInsurance: false,
        ppfEpf: false,
        mutualFunds: false,
        fdRd: false,
        realEstate: false,
        none: false,
      },
    },
    documentUploads: {
        panCard: '',
        aadhaarCard: '',
        salarySlipsIncomeProof: '',
        lastYearItrForm16: '',
        bankStatement: '',
        investmentProofs: '',
        existingLoanEmiDetails: '',
    }
  };

  const form = useForm<FinancialAdvisoryFormData>({
    resolver: zodResolver(FinancialAdvisoryFormSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch } = form;

  const watchOccupation = watch("applicantDetails.occupation");
  const watchOtherAdvisoryService = watch("advisoryServicesRequired.otherAdvisoryService");

  async function onSubmit(data: FinancialAdvisoryFormData) {
    setIsSubmitting(true);
    console.log("Financial Advisory Service Application Data:", data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Service Application Submitted!",
      description: "Your application for Financial Advisory services has been successfully submitted. We will contact you shortly.",
    });
    setIsSubmitting(false);
  }

  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => setCurrentPage('caServices')} className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to CA Services
        </Button>
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <PiggyBank className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Financial Advisory Service Application</h2>
            <p className="text-muted-foreground mt-1">Please provide the details below to help us understand your financial needs.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <FormSection title="Applicant Details">
                <FormField control={control} name="applicantDetails.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.emailId" render={({ field }) => (<FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="example@mail.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.occupation" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Occupation</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {occupationOptionsFA.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
                {watchOccupation === "other" && (
                  <FormField control={control} name="applicantDetails.otherOccupationDetail" render={({ field }) => (<FormItem><FormLabel>Specify Other Occupation</FormLabel><FormControl><Input placeholder="Specify occupation" {...field} /></FormControl><FormMessage /></FormItem>)} />
                )}
                <FormField control={control} name="applicantDetails.cityAndState" render={({ field }) => (<FormItem><FormLabel>City & State</FormLabel><FormControl><Input placeholder="e.g., Mumbai, Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.maritalStatus" render={({ field }) => (
                    <FormItem><FormLabel>Marital Status</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="single" /></FormControl><FormLabel className="font-normal">Single</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="married" /></FormControl><FormLabel className="font-normal">Married</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
                <FormField control={control} name="applicantDetails.dependentMembersAdults" render={({ field }) => (<FormItem><FormLabel>Dependent Adults</FormLabel><FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.dependentMembersChildren" render={({ field }) => (<FormItem><FormLabel>Dependent Children</FormLabel><FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </FormSection>

              <FormSection title="Advisory Services Required" subtitle="Select all that apply">
                <FormFieldWrapper className="md:col-span-2">
                    <div className="space-y-3">
                        {advisoryServicesOptions.map(service => (
                            <FormField
                                key={service.name}
                                control={control}
                                name={service.name}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal leading-snug">
                                            {service.label}
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        ))}
                        {watchOtherAdvisoryService && (
                            <FormField
                                control={control}
                                name="advisoryServicesRequired.otherAdvisoryServiceDetail"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormLabel>Specify Other Service</FormLabel>
                                        <FormControl><Input placeholder="Details for other service" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormMessage>{form.formState.errors.advisoryServicesRequired?.root?.message}</FormMessage>
                    </div>
                </FormFieldWrapper>
              </FormSection>
              
              <FormSection title="Current Financial Overview">
                <FormField control={control} name="currentFinancialOverview.annualIncome" render={({ field }) => (<FormItem><FormLabel>Annual Income (approx) (₹)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1200000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="currentFinancialOverview.monthlySavings" render={({ field }) => (<FormItem><FormLabel>Monthly Savings (avg) (₹)</FormLabel><FormControl><Input type="number" placeholder="e.g., 25000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="currentFinancialOverview.currentInvestmentsAmount" render={({ field }) => (<FormItem><FormLabel>Current Investments (approx) (₹)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormFieldWrapper className="md:col-span-2">
                    <FormLabel>Current Investment Types</FormLabel>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        {currentInvestmentTypeOptions.map(invType => (
                            <FormField
                                key={invType.name}
                                control={control}
                                name={invType.name}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md shadow-sm">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal text-sm">
                                            {invType.label}
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                    <FormMessage>{form.formState.errors.currentFinancialOverview?.currentInvestmentsTypes?.root?.message}</FormMessage>
                </FormFieldWrapper>
              </FormSection>

              <FormSection title="Upload Required Documents" subtitle="Optional but Recommended. Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.">
                {documentFieldsFA.map(docField => (
                  <FormFieldWrapper key={docField.name} className="md:col-span-2">
                    <FormField
                      control={control}
                      name={docField.name as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" /> {docField.label}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
                              placeholder="Click to upload (filename placeholder)" 
                              {...field} 
                              readOnly 
                              onClick={() => toast({title: "File Upload", description: "Actual file upload functionality is not yet implemented. This is a placeholder."})}
                              className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormFieldWrapper>
                ))}
              </FormSection>
              
              <div className="mt-10 pt-6 border-t border-border dark:border-gray-700">
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
