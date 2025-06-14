
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GstServiceApplicationSchema, type GstServiceApplicationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ReceiptText, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';
import { submitGstServiceApplicationAction } from '@/app/actions/caServiceActions';

interface GstServiceApplicationFormProps {
  setCurrentPage: SetPageView;
}

const businessTypeOptions = [
  { value: "proprietorship", label: "Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "pvt_ltd", label: "Pvt Ltd" },
  { value: "other", label: "Other" }
];

const gstServiceOptions = [
  { name: "gstServiceRequired.newGstRegistration", label: "New GST Registration" },
  { name: "gstServiceRequired.gstReturnFiling", label: "GST Return Filing (Monthly/Quarterly)" },
  { name: "gstServiceRequired.gstCancellationAmendment", label: "GST Cancellation / Amendment" },
  { name: "gstServiceRequired.gstAudit", label: "GST Audit" },
  { name: "gstServiceRequired.gstNoticeHandling", label: "GST Notice Handling" },
  { name: "gstServiceRequired.otherGstService", label: "Other" },
] as const;


const documentFields = [
    { name: "documentUploads.panCard", label: "PAN Card of Applicant/Business" },
    { name: "documentUploads.aadhaarCard", label: "Aadhaar Card of Proprietor/Director" },
    { name: "documentUploads.passportPhoto", label: "Passport Size Photo (JPG/PNG)" },
    { name: "documentUploads.businessProof", label: "Business Proof (e.g., Shop Act/License)" },
    { name: "documentUploads.addressProof", label: "Electricity Bill / Rent Agreement (Address Proof)" },
    { name: "documentUploads.bankDetails", label: "Cancelled Cheque or Bank Passbook (1st page)" },
    { name: "documentUploads.digitalSignature", label: "Digital Signature (If available)" },
];

export function GstServiceApplicationForm({ setCurrentPage }: GstServiceApplicationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: GstServiceApplicationFormData = {
    applicantDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      businessName: '',
      businessType: undefined,
      otherBusinessTypeDetail: '',
      natureOfBusiness: '',
      stateAndCity: '',
    },
    gstServiceRequired: {
      newGstRegistration: false,
      gstReturnFiling: false,
      gstCancellationAmendment: false,
      gstAudit: false,
      gstNoticeHandling: false,
      otherGstService: false,
      otherGstServiceDetail: '',
    },
    documentUploads: {
        panCard: '',
        aadhaarCard: '',
        passportPhoto: '',
        businessProof: '',
        addressProof: '',
        bankDetails: '',
        digitalSignature: '',
    }
  };

  const form = useForm<GstServiceApplicationFormData>({
    resolver: zodResolver(GstServiceApplicationSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch, reset, setError: setFormError } = form;

  const watchBusinessType = watch("applicantDetails.businessType");
  const watchOtherGstService = watch("gstServiceRequired.otherGstService");

  async function onSubmit(data: GstServiceApplicationFormData) {
    setIsSubmitting(true);
    try {
      const result = await submitGstServiceApplicationAction(data, GstServiceApplicationSchema);
      if (result.success) {
        toast({
          title: "GST Service Application Submitted!",
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
        description: "An error occurred while submitting the GST Service application.",
      });
      console.error("Error submitting GST Service application:", error);
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
            <ReceiptText className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">GST Service Application Form</h2>
            <p className="text-muted-foreground mt-1">Please fill in the details below to apply for GST related services.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <FormSection title="Applicant Details">
                <FormField control={control} name="applicantDetails.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.emailId" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="example@mail.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.businessName" render={({ field }) => (<FormItem><FormLabel>Business Name (if any)</FormLabel><FormControl><Input placeholder="Your Company Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                <FormField control={control} name="applicantDetails.natureOfBusiness" render={({ field }) => (<FormItem><FormLabel>Nature of Business</FormLabel><FormControl><Input placeholder="e.g., Manufacturing, Retail" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.stateAndCity" render={({ field }) => (<FormItem><FormLabel>State & City</FormLabel><FormControl><Input placeholder="e.g., Maharashtra, Mumbai" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </FormSection>

              <FormSection title="GST Service Required">
                <FormFieldWrapper className="md:col-span-2">
                    <div className="space-y-3">
                        {gstServiceOptions.map(service => (
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
                        {watchOtherGstService && (
                            <FormField
                                control={control}
                                name="gstServiceRequired.otherGstServiceDetail"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormLabel>Specify Other GST Service</FormLabel>
                                        <FormControl><Input placeholder="Details for other service" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormMessage>{form.formState.errors.gstServiceRequired?.root?.message}</FormMessage>
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
