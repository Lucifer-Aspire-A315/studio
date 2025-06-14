"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ItrFilingConsultationFormSchema, type ItrFilingConsultationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileSpreadsheet, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';
import { Textarea } from '@/components/ui/textarea';
import { submitItrFilingConsultationAction } from '@/app/actions/caServiceActions';

interface ItrFilingConsultationFormProps {
  setCurrentPage: SetPageView;
}

const incomeSourceOptions = [
  { name: "incomeSourceType.salariedEmployee", label: "Salaried Employee" },
  { name: "incomeSourceType.businessIncome", label: "Business Income" },
  { name: "incomeSourceType.freelanceProfessional", label: "Freelance / Professional" },
  { name: "incomeSourceType.capitalGains", label: "Capital Gains (Stocks, Property)" },
  { name: "incomeSourceType.housePropertyIncome", label: "House Property Income" },
  { name: "incomeSourceType.otherIncomeSource", label: "Other" },
] as const;


const documentFields = [
    { name: "documentUploads.panCard", label: "PAN Card" },
    { name: "documentUploads.aadhaarCard", label: "Aadhaar Card" },
    { name: "documentUploads.form16", label: "Form 16 (if Salaried)" },
    { name: "documentUploads.salarySlips", label: "Salary Slips (if applicable)" },
    { name: "documentUploads.bankStatement", label: "Bank Statement (Full FY)" },
    { name: "documentUploads.investmentProofs", label: "Investment Proofs (LIC, PPF, 80C, etc.)" },
    { name: "documentUploads.rentReceipts", label: "Rent Receipts / HRA Proofs" },
    { name: "documentUploads.capitalGainStatement", label: "Capital Gain Statement (if any)" },
    { name: "documentUploads.businessIncomeProof", label: "Business Income Proof / ITR of Previous Year" },
];

export function ItrFilingConsultationForm({ setCurrentPage }: ItrFilingConsultationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: ItrFilingConsultationFormData = {
    applicantDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      dob: '',
      panNumber: '',
      aadhaarNumber: '',
      address: '',
      cityAndState: '',
    },
    incomeSourceType: {
      salariedEmployee: false,
      businessIncome: false,
      freelanceProfessional: false,
      capitalGains: false,
      housePropertyIncome: false,
      otherIncomeSource: false,
      otherIncomeSourceDetail: '',
    },
    documentUploads: {
        panCard: '',
        aadhaarCard: '',
        form16: '',
        salarySlips: '',
        bankStatement: '',
        investmentProofs: '',
        rentReceipts: '',
        capitalGainStatement: '',
        businessIncomeProof: '',
    }
  };

  const form = useForm<ItrFilingConsultationFormData>({
    resolver: zodResolver(ItrFilingConsultationFormSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch, reset, setError: setFormError } = form;

  const watchOtherIncomeSource = watch("incomeSourceType.otherIncomeSource");

  async function onSubmit(data: ItrFilingConsultationFormData) {
    setIsSubmitting(true);
    try {
      const result = await submitItrFilingConsultationAction(data, ItrFilingConsultationFormSchema);
      if (result.success) {
        toast({
          title: "ITR Service Application Submitted!",
          description: result.message,
        });
        reset(); 
      } else {
        toast({
          variant: "destructive",
          title: "Application Failed",
          description: result.message || "An unknown error occurred.",
        });
        if (result.errors) {
          Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            setFormError(fieldName as any, {
              type: 'manual',
              message: (errorMessages as string[]).join(', '),
            });
          });
        }
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Submission Error",
        description: "An error occurred while submitting the ITR Filing & Consultation application.",
      });
      console.error("Error submitting ITR Filing & Consultation application:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            <FileSpreadsheet className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Income Tax Filing &amp; Consultation Application</h2>
            <p className="text-muted-foreground mt-1">Please provide the following details for ITR filing and consultation services.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <FormSection title="Applicant Details">
                <FormField control={control} name="applicantDetails.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.emailId" render={({ field }) => (<FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="example@mail.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.panNumber" render={({ field }) => (<FormItem><FormLabel>PAN Number</FormLabel><FormControl><Input placeholder="ABCDE1234F" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.aadhaarNumber" render={({ field }) => (<FormItem><FormLabel>Aadhaar Number</FormLabel><FormControl><Input placeholder="123456789012" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormFieldWrapper className="md:col-span-2">
                  <FormField control={control} name="applicantDetails.address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Textarea placeholder="Your full address" {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
                <FormField control={control} name="applicantDetails.cityAndState" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>City & State</FormLabel><FormControl><Input placeholder="e.g., Mumbai, Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </FormSection>

              <FormSection title="Income Source Type" subtitle="Select all that apply">
                <FormFieldWrapper className="md:col-span-2">
                    <div className="space-y-3">
                        {incomeSourceOptions.map(source => (
                            <FormField
                                key={source.name}
                                control={control}
                                name={source.name}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal leading-snug">
                                            {source.label}
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        ))}
                        {watchOtherIncomeSource && (
                            <FormField
                                control={control}
                                name="incomeSourceType.otherIncomeSourceDetail"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormLabel>Specify Other Income Source</FormLabel>
                                        <FormControl><Input placeholder="Details for other income source" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormMessage>{form.formState.errors.incomeSourceType?.root?.message}</FormMessage>
                    </div>
                </FormFieldWrapper>
              </FormSection>

              <FormSection title="Upload Required Documents" subtitle="Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.">
                {documentFields.map(docField => (
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

