
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanyIncorporationFormSchema, type CompanyIncorporationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';

interface CompanyIncorporationFormProps {
  setCurrentPage: SetPageView;
}

const occupationOptions = [
  { value: "business", label: "Business" },
  { value: "job", label: "Job" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" }
];

const companyTypeOptions = [
  { value: "pvt_ltd", label: "Private Limited (Pvt Ltd)" },
  { value: "llp", label: "Limited Liability Partnership (LLP)" },
  { value: "opc", label: "One Person Company (OPC)" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "other", label: "Other" }
];

const numDirectorsOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4+", label: "4+" }
];

const documentFields = [
    { name: "documentUploads.directorPanCard", label: "PAN Card" },
    { name: "documentUploads.directorAadhaarCard", label: "Aadhaar Card" },
    { name: "documentUploads.directorPhoto", label: "Passport Size Photo (JPG/PNG)" },
    { name: "documentUploads.businessAddressProof", label: "Electricity Bill / Rent Agreement (Business Address Proof)" },
    { name: "documentUploads.directorBankStatement", label: "Bank Statement (Last 1 month)" },
    { name: "documentUploads.dsc", label: "Digital Signature Certificate (DSC, if available)" },
];

const optionalServicesOptions = [
  { name: "optionalServices.gstRegistration", label: "GST Registration" },
  { name: "optionalServices.msmeRegistration", label: "MSME Registration" },
  { name: "optionalServices.trademarkFiling", label: "Trademark Filing" },
  { name: "optionalServices.openBusinessBankAccount", label: "Opening Business Bank Account" },
  { name: "optionalServices.accountingTaxSetup", label: "Accounting & Tax Filing Setup" },
] as const;


export function CompanyIncorporationForm({ setCurrentPage }: CompanyIncorporationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: CompanyIncorporationFormData = {
    applicantFounderDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      dob: '',
      occupation: undefined,
      otherOccupationDetail: '',
      residentialAddress: '',
      cityAndState: '',
    },
    companyDetails: {
      companyType: undefined,
      otherCompanyTypeDetail: '',
      proposedCompanyName1: '',
      proposedCompanyName2: '',
      proposedCompanyName3: '',
      businessActivity: '',
      proposedBusinessAddress: '',
    },
    directorsPartners: {
      numberOfDirectorsPartners: undefined,
    },
    documentUploads: {
        directorPanCard: '',
        directorAadhaarCard: '',
        directorPhoto: '',
        businessAddressProof: '',
        directorBankStatement: '',
        dsc: '',
    },
    optionalServices: {
        gstRegistration: false,
        msmeRegistration: false,
        trademarkFiling: false,
        openBusinessBankAccount: false,
        accountingTaxSetup: false,
    },
    declaration: false,
  };

  const form = useForm<CompanyIncorporationFormData>({
    resolver: zodResolver(CompanyIncorporationFormSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch } = form;

  const watchOccupation = watch("applicantFounderDetails.occupation");
  const watchCompanyType = watch("companyDetails.companyType");

  async function onSubmit(data: CompanyIncorporationFormData) {
    setIsSubmitting(true);
    console.log("Company Incorporation Application Data:", data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Incorporation Application Submitted!",
      description: "Your application for Company Incorporation has been successfully submitted. We will contact you shortly.",
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
            <Building2 className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Company Incorporation Application Form</h2>
            <p className="text-muted-foreground mt-1">Please provide the details below to start your company registration process.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <FormSection title="Applicant / Founder Details">
                <FormField control={control} name="applicantFounderDetails.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantFounderDetails.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantFounderDetails.emailId" render={({ field }) => (<FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="example@mail.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantFounderDetails.dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantFounderDetails.occupation" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Occupation</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {occupationOptions.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
                {watchOccupation === "other" && (
                  <FormField control={control} name="applicantFounderDetails.otherOccupationDetail" render={({ field }) => (<FormItem><FormLabel>Specify Other Occupation</FormLabel><FormControl><Input placeholder="Specify occupation" {...field} /></FormControl><FormMessage /></FormItem>)} />
                )}
                <FormFieldWrapper className="md:col-span-2">
                    <FormField control={control} name="applicantFounderDetails.residentialAddress" render={({ field }) => (<FormItem><FormLabel>Residential Address</FormLabel><FormControl><Textarea placeholder="Your full residential address" {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
                <FormField control={control} name="applicantFounderDetails.cityAndState" render={({ field }) => (<FormItem><FormLabel>City & State</FormLabel><FormControl><Input placeholder="e.g., Mumbai, Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </FormSection>

              <FormSection title="Company Details">
                <FormField control={control} name="companyDetails.companyType" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Type of Company to Incorporate</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {companyTypeOptions.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>)} />
                {watchCompanyType === "other" && (
                  <FormField control={control} name="companyDetails.otherCompanyTypeDetail" render={({ field }) => (<FormItem><FormLabel>Specify Other Company Type</FormLabel><FormControl><Input placeholder="Specify type" {...field} /></FormControl><FormMessage /></FormItem>)} />
                )}
                <FormField control={control} name="companyDetails.proposedCompanyName1" render={({ field }) => (<FormItem><FormLabel>Proposed Company Name 1</FormLabel><FormControl><Input placeholder="Name preference 1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="companyDetails.proposedCompanyName2" render={({ field }) => (<FormItem><FormLabel>Proposed Company Name 2 (Optional)</FormLabel><FormControl><Input placeholder="Name preference 2" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="companyDetails.proposedCompanyName3" render={({ field }) => (<FormItem><FormLabel>Proposed Company Name 3 (Optional)</FormLabel><FormControl><Input placeholder="Name preference 3" {...field} /></FormControl><FormMessage /></FormItem>)} />
                
                <FormFieldWrapper className="md:col-span-2">
                    <FormField control={control} name="companyDetails.businessActivity" render={({ field }) => (<FormItem><FormLabel>Business Activity / Nature of Work</FormLabel><FormControl><Textarea placeholder="Describe your business activities" {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
                 <FormFieldWrapper className="md:col-span-2">
                    <FormField control={control} name="companyDetails.proposedBusinessAddress" render={({ field }) => (<FormItem><FormLabel>Proposed Business Address</FormLabel><FormControl><Textarea placeholder="Full proposed business address" {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
              </FormSection>

               <FormSection title="Number of Directors / Partners">
                  <FormField control={control} name="directorsPartners.numberOfDirectorsPartners" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Select Number</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {numDirectorsOptions.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup></FormControl><FormMessage />
                         <p className="text-xs text-muted-foreground mt-2">Each director/partner must provide separate documents.</p>
                    </FormItem>)} />
              </FormSection>


              <FormSection title="Upload Required Documents" subtitle="For Each Director/Partner. Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.">
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

              <FormSection title="Optional Services" subtitle="Select if Needed">
                 <FormFieldWrapper className="md:col-span-2">
                    <div className="space-y-3">
                        {optionalServicesOptions.map(service => (
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
                    </div>
                </FormFieldWrapper>
              </FormSection>

              <FormSection title="Declaration">
                 <FormFieldWrapper className="md:col-span-2">
                    <FormField
                        control={control}
                        name="declaration"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="declaration-checkbox"
                            />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel htmlFor="declaration-checkbox" className="font-normal">
                                I hereby declare that the details and documents submitted are true and correct. I authorize RN Fintech to initiate the company registration process on my behalf.
                            </FormLabel>
                            <FormMessage />
                            </div>
                        </FormItem>
                        )}
                    />
                </FormFieldWrapper>
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
