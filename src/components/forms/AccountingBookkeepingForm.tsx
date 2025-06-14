
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccountingBookkeepingFormSchema, type AccountingBookkeepingFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpenCheck, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';

interface AccountingBookkeepingFormProps {
  setCurrentPage: SetPageView;
}

const businessTypeOptions = [
  { value: "proprietorship", label: "Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "pvt_ltd", label: "Pvt Ltd" },
  { value: "llp", label: "LLP" },
  { value: "other", label: "Other" }
];

const servicesRequiredOptions = [
  { name: "servicesRequired.bookkeeping", label: "Bookkeeping (Monthly/Quarterly)" },
  { name: "servicesRequired.ledgerMaintenance", label: "Ledger & Journal Maintenance" },
  { name: "servicesRequired.financialStatementPreparation", label: "Profit & Loss, Balance Sheet Preparation" },
  { name: "servicesRequired.tdsFiling", label: "TDS Calculation & Filing" },
  { name: "servicesRequired.gstReconciliationFiling", label: "GST Reconciliation & Filing" },
  { name: "servicesRequired.payrollServices", label: "Payroll Services" },
  { name: "servicesRequired.otherAccountingService", label: "Other" },
] as const;


const documentFields = [
    { name: "documentUploads.panCardBusinessOwner", label: "PAN Card of Business/Owner" },
    { name: "documentUploads.gstCertificate", label: "GST Certificate (if available)" },
    { name: "documentUploads.previousYearFinancials", label: "Previous Year Financial Statements" },
    { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6–12 Months)" },
    { name: "documentUploads.invoices", label: "Invoices (Sales & Purchase - PDF/Excel)" },
    { name: "documentUploads.payrollData", label: "Payroll Data (if applicable)" },
    { name: "documentUploads.tdsTaxDetails", label: "TDS & Tax Details (if any)" },
    { name: "documentUploads.otherSupportingDocuments", label: "Any Other Supporting Documents" },
];

export function AccountingBookkeepingForm({ setCurrentPage }: AccountingBookkeepingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: AccountingBookkeepingFormData = {
    applicantDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      businessName: '',
      businessType: undefined,
      otherBusinessTypeDetail: '',
      natureOfBusiness: '',
      cityAndState: '',
    },
    servicesRequired: {
      bookkeeping: false,
      ledgerMaintenance: false,
      financialStatementPreparation: false,
      tdsFiling: false,
      gstReconciliationFiling: false,
      payrollServices: false,
      otherAccountingService: false,
      otherAccountingServiceDetail: '',
    },
    documentUploads: {
        panCardBusinessOwner: '',
        gstCertificate: '',
        previousYearFinancials: '',
        bankStatement: '',
        invoices: '',
        payrollData: '',
        tdsTaxDetails: '',
        otherSupportingDocuments: '',
    }
  };

  const form = useForm<AccountingBookkeepingFormData>({
    resolver: zodResolver(AccountingBookkeepingFormSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch } = form;

  const watchBusinessType = watch("applicantDetails.businessType");
  const watchOtherService = watch("servicesRequired.otherAccountingService");

  async function onSubmit(data: AccountingBookkeepingFormData) {
    setIsSubmitting(true);
    console.log("Accounting & Bookkeeping Service Application Data:", data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Service Application Submitted!",
      description: "Your application for Accounting & Bookkeeping services has been successfully submitted. We will contact you shortly.",
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
            <BookOpenCheck className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Accounting & Bookkeeping Service Application</h2>
            <p className="text-muted-foreground mt-1">Please provide the details below to avail our services.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <FormSection title="Applicant Details">
                <FormField control={control} name="applicantDetails.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.emailId" render={({ field }) => (<FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="example@mail.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.businessName" render={({ field }) => (<FormItem><FormLabel>Business Name</FormLabel><FormControl><Input placeholder="Your Company Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.businessType" render={({ field }) => (
                    <FormItem><FormLabel>Business Type</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {businessTypeOptions.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
                {watchBusinessType === "other" && (
                  <FormField control={control} name="applicantDetails.otherBusinessTypeDetail" render={({ field }) => (<FormItem><FormLabel>Specify Other Business Type</FormLabel><FormControl><Input placeholder="Specify type" {...field} /></FormControl><FormMessage /></FormItem>)} />
                )}
                <FormField control={control} name="applicantDetails.natureOfBusiness" render={({ field }) => (<FormItem><FormLabel>Nature of Business</FormLabel><FormControl><Input placeholder="e.g., Manufacturing, Retail, Service" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.cityAndState" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>City & State</FormLabel><FormControl><Input placeholder="e.g., Mumbai, Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </FormSection>

              <FormSection title="Services Required" subtitle="Select all that apply">
                <FormFieldWrapper className="md:col-span-2">
                    <div className="space-y-3">
                        {servicesRequiredOptions.map(service => (
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
                        {watchOtherService && (
                            <FormField
                                control={control}
                                name="servicesRequired.otherAccountingServiceDetail"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormLabel>Specify Other Service</FormLabel>
                                        <FormControl><Input placeholder="Details for other service" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormMessage>{form.formState.errors.servicesRequired?.root?.message}</FormMessage>
                    </div>
                </FormFieldWrapper>
              </FormSection>

              <FormSection title="Upload Required Documents" subtitle="Accepted File Types: PDF, Excel, JPG, PNG. Max File Size: 5 MB per document.">
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
