
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GovernmentSchemeLoanApplicationSchema, type GovernmentSchemeLoanApplicationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea'; 
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';

interface GovernmentSchemeLoanApplicationFormProps {
  setCurrentPage: SetPageView;
  selectedScheme: string;
  otherSchemeName?: string;
}

const schemeDisplayNames: Record<string, string> = {
  pmmy: "PM Mudra Yojana",
  pmegp: "PMEGP (Khadi Board)",
  standup: "Stand-Up India",
  other: "Other",
};

export function GovernmentSchemeLoanApplicationForm({ setCurrentPage, selectedScheme, otherSchemeName }: GovernmentSchemeLoanApplicationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: GovernmentSchemeLoanApplicationFormData = {
    applicantDetailsGov: {
      fullName: '',
      fatherSpouseName: '',
      dob: '',
      mobileNumber: '',
      emailId: '',
      gender: undefined,
      category: undefined,
      maritalStatus: undefined,
    },
    addressInformationGov: {
      residentialAddress: '',
      state: '',
      district: '',
      pincode: '',
    },
    businessInformationGov: {
      businessName: '',
      businessType: undefined,
      otherBusinessType: '',
      businessLocation: '',
      yearsInBusiness: undefined,
      sector: undefined,
      loanPurpose: undefined,
    },
    loanDetailsGov: {
      selectedScheme: schemeDisplayNames[selectedScheme] || selectedScheme,
      otherSchemeName: selectedScheme === 'other' ? otherSchemeName : undefined,
      loanAmountRequired: undefined,
      loanTenure: undefined,
    },
    documentUploadsGov: {
      aadhaarCard: '',
      panCard: '',
      passportSizePhoto: '',
      businessProof: '',
      bankStatement: '',
      casteCertificate: '',
      incomeCertificate: '',
      projectReport: '',
      existingLoanStatement: '',
    }
  };

  const form = useForm<GovernmentSchemeLoanApplicationFormData>({
    resolver: zodResolver(GovernmentSchemeLoanApplicationSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch } = form;

  const businessType = watch("businessInformationGov.businessType");

  async function onSubmit(data: GovernmentSchemeLoanApplicationFormData) {
    setIsSubmitting(true);
    console.log("Government Scheme Loan Data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Application Submitted!",
      description: "Your Government Scheme Loan application has been successfully submitted. We will contact you shortly.",
    });
    setIsSubmitting(false);
  }

  const documentFields = [
    { name: "documentUploadsGov.aadhaarCard", label: "Aadhaar Card" },
    { name: "documentUploadsGov.panCard", label: "PAN Card" },
    { name: "documentUploadsGov.passportSizePhoto", label: "Passport Size Photo" },
    { name: "documentUploadsGov.businessProof", label: "Business Proof (Udyam / Registration)" },
    { name: "documentUploadsGov.bankStatement", label: "Bank Statement (Last 6 Months)" },
    { name: "documentUploadsGov.casteCertificate", label: "Caste Certificate (if applicable)" },
    { name: "documentUploadsGov.incomeCertificate", label: "Income Certificate" },
    { name: "documentUploadsGov.projectReport", label: "Project Report / Business Plan" },
    { name: "documentUploadsGov.existingLoanStatement", label: "Existing Loan Statement (if any)" },
  ];

  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => setCurrentPage('governmentSchemes')} className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Scheme Selection
        </Button>
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <FileText className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Government Scheme Loan Application Form</h2>
            <p className="text-muted-foreground mt-1">Please fill in the details below to apply for the selected government scheme.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <FormSection title="Applicant Details">
                <FormField control={control} name="applicantDetailsGov.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.fatherSpouseName" render={({ field }) => (<FormItem><FormLabel>Father’s / Spouse’s Name</FormLabel><FormControl><Input placeholder="Father's / Spouse's Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.emailId" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="example@mail.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">Other</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="general" /></FormControl><FormLabel className="font-normal">General</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="sc" /></FormControl><FormLabel className="font-normal">SC</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="st" /></FormControl><FormLabel className="font-normal">ST</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="obc" /></FormControl><FormLabel className="font-normal">OBC</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
                 <FormField control={control} name="applicantDetailsGov.maritalStatus" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Marital Status</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="single" /></FormControl><FormLabel className="font-normal">Single</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="married" /></FormControl><FormLabel className="font-normal">Married</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
              </FormSection>

              <FormSection title="Address Information">
                <FormFieldWrapper className="md:col-span-2">
                  <FormField control={control} name="addressInformationGov.residentialAddress" render={({ field }) => (<FormItem><FormLabel>Residential Address</FormLabel><FormControl><Textarea placeholder="Full Residential Address" {...field} rows={3}/></FormControl><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
                <FormField control={control} name="addressInformationGov.state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="State" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="addressInformationGov.district" render={({ field }) => (<FormItem><FormLabel>District</FormLabel><FormControl><Input placeholder="District" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="addressInformationGov.pincode" render={({ field }) => (<FormItem><FormLabel>Pincode</FormLabel><FormControl><Input placeholder="6-digit Pincode" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </FormSection>

              <FormSection title="Business Information">
                <FormField control={control} name="businessInformationGov.businessName" render={({ field }) => (<FormItem><FormLabel>Business Name (if any)</FormLabel><FormControl><Input placeholder="Your Business Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="businessInformationGov.businessType" render={({ field }) => (
                    <FormItem><FormLabel>Type of Business</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="proprietorship" /></FormControl><FormLabel className="font-normal">Proprietorship</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="partnership" /></FormControl><FormLabel className="font-normal">Partnership</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">Other</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
                {businessType === "other" && (
                  <FormField control={control} name="businessInformationGov.otherBusinessType" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Specify Other Business Type</FormLabel><FormControl><Input placeholder="Specify type" {...field} /></FormControl><FormMessage /></FormItem>)} />
                )}
                <FormField control={control} name="businessInformationGov.businessLocation" render={({ field }) => (<FormItem><FormLabel>Business Location</FormLabel><FormControl><Input placeholder="Location of business" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="businessInformationGov.yearsInBusiness" render={({ field }) => (<FormItem><FormLabel>Years in Business</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="businessInformationGov.sector" render={({ field }) => (
                    <FormItem><FormLabel>Sector</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="manufacturing" /></FormControl><FormLabel className="font-normal">Manufacturing</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="service" /></FormControl><FormLabel className="font-normal">Service</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="trading" /></FormControl><FormLabel className="font-normal">Trading</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
                <FormField control={control} name="businessInformationGov.loanPurpose" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Loan Purpose</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="new_setup" /></FormControl><FormLabel className="font-normal">New Setup</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="expansion" /></FormControl><FormLabel className="font-normal">Expansion</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="working_capital" /></FormControl><FormLabel className="font-normal">Working Capital</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
              </FormSection>

              <FormSection title="Loan Details">
                 <FormFieldWrapper>
                    <FormItem>
                        <FormLabel>Loan Scheme Applying For</FormLabel>
                        <FormControl>
                            <Input 
                                value={schemeDisplayNames[selectedScheme] || selectedScheme} 
                                readOnly 
                                disabled 
                                className="bg-slate-100 dark:bg-slate-800"
                            />
                        </FormControl>
                    </FormItem>
                 </FormFieldWrapper>
                 {selectedScheme === 'other' && otherSchemeName && (
                    <FormFieldWrapper>
                        <FormItem>
                            <FormLabel>Other Scheme Name</FormLabel>
                            <FormControl>
                                <Input 
                                    value={otherSchemeName} 
                                    readOnly 
                                    disabled 
                                    className="bg-slate-100 dark:bg-slate-800"
                                />
                            </FormControl>
                        </FormItem>
                    </FormFieldWrapper>
                 )}
                 <FormField control={control} name="loanDetailsGov.loanAmountRequired" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Loan Amount Required (₹)</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span>
                                <Input type="number" placeholder="e.g., 500000" className="pl-7" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)} 
                />
                <FormField control={control} name="loanDetailsGov.loanTenure" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Loan Tenure (in Years)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>)} 
                />
              </FormSection>

              <FormSection title="Upload Required Documents" subtitle="File types allowed: PDF, JPG, PNG. Max size: 5 MB per document.">
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
