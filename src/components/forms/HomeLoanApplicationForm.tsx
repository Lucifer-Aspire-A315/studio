
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HomeLoanApplicationSchema, type HomeLoanApplicationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import { validateIdentificationDetails, type ValidateIdentificationDetailsOutput } from '@/ai/flows/validate-identification-details';
import { ArrowLeft, Home as HomeIcon, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';
import { uploadFileAction } from '@/app/actions/fileUploadActions';


interface HomeLoanApplicationFormProps {
  setCurrentPage: SetPageView;
}

interface _FormFileInputProps {
  fieldLabel: React.ReactNode;
  rhfName: string;
  rhfRef: React.Ref<HTMLInputElement>;
  rhfOnBlur: () => void;
  rhfOnChange: (file: File | null) => void;
  selectedFile: File | null | undefined;
  accept?: string;
}

const _FormFileInput: React.FC<_FormFileInputProps> = ({
  fieldLabel,
  rhfRef,
  rhfName,
  rhfOnBlur,
  rhfOnChange,
  selectedFile,
  accept,
}) => {
  const { formItemId } = useFormField();
  return (
    <FormItem>
      <FormLabel htmlFor={formItemId} className="flex items-center">
        <UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" /> {fieldLabel}
      </FormLabel>
      <Input
        id={formItemId}
        type="file"
        ref={rhfRef}
        name={rhfName}
        onBlur={rhfOnBlur}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          rhfOnChange(file);
        }}
        accept={accept}
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
      />
      {selectedFile && (
        <p className="text-xs text-muted-foreground mt-1">
          Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
        </p>
      )}
      <FormMessage />
    </FormItem>
  );
};


export function HomeLoanApplicationForm({ setCurrentPage }: HomeLoanApplicationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingPAN, setIsVerifyingPAN] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});


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
      },
      isPermanentAddressDifferent: false,
      permanentAddress: { 
        fullAddress: '',
      },
      employmentIncome: {
        employmentType: undefined, 
        occupation: '', 
        companyName: '',
        monthlyIncome: undefined,
        yearsInCurrentJobOrBusiness: undefined,
      },
      loanPropertyDetails: {
        loanAmountRequired: undefined,
        loanTenureRequired: undefined,
        purposeOfLoan: undefined,
        propertyLocation: '',
        estimatedPropertyValue: undefined, 
        propertyType: undefined,
      },
      hasExistingLoans: undefined,
      existingLoans: {
        bankName: '',
        outstandingAmount: undefined, 
        emiAmount: undefined,
      },
      documentUploads: {
        panCard: undefined,
        aadhaarCard: undefined,
        photograph: undefined,
        incomeProof: undefined,
        bankStatement: undefined,
        propertyDocs: undefined,
        allotmentLetter: undefined,
        employmentProof: undefined,
        existingLoanStatement: undefined,
      }
    },
  });

  const { control, handleSubmit, getValues, setError, clearErrors, watch, setValue } = form;

  const isPermanentAddressDifferent = watch("isPermanentAddressDifferent");
  const hasExistingLoans = watch("hasExistingLoans");

  async function onSubmit(data: HomeLoanApplicationFormData) {
    setIsSubmitting(true);
    const dataToSubmit = { ...data };

    try {
      const documentUploadPromises = Object.entries(data.documentUploads || {})
        .filter(([, file]) => file instanceof File)
        .map(async ([key, file]) => {
          if (file instanceof File) {
            toast({ title: `Uploading ${key}...`, description: "Please wait." });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', file.name);
            formData.append('fileType', file.type);
            const uploadResult = await uploadFileAction(formData);
            if (uploadResult.success && uploadResult.url) {
              toast({ title: `${key} uploaded!`, description: `URL: ${uploadResult.url}` });
              return { key, url: uploadResult.url };
            } else {
              throw new Error(`Failed to upload ${key}: ${uploadResult.error}`);
            }
          }
          return null;
        });

      const uploadedDocuments = await Promise.all(documentUploadPromises);
      
      const updatedDocumentUploads = { ...dataToSubmit.documentUploads };
      uploadedDocuments.forEach(doc => {
        if (doc) {
          (updatedDocumentUploads as Record<string, string | undefined | File | null>)[doc.key] = doc.url;
        }
      });
      dataToSubmit.documentUploads = updatedDocumentUploads as any; // Cast after processing

      console.log("Home Loan Data to be sent to server action:", dataToSubmit);
      // Simulate server action for now
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      toast({
        title: "Application Submitted!",
        description: "Your home loan application has been successfully submitted. We will contact you shortly.",
      });
      form.reset();
      setSelectedFiles({});
    } catch (error: any) {
      console.error("Error during submission:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An error occurred during submission.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleIDValidation = async (field: 'pan' | 'aadhaar') => {
    const panNumber = getValues("applicantDetails.pan");
    const aadhaarNumber = getValues("applicantDetails.aadhaar");

    if (field === 'pan' && panNumber.match(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/)) {
      setIsVerifyingPAN(true);
    } else if (field === 'aadhaar' && aadhaarNumber.match(/^\d{12}$/)) {
      setIsVerifyingAadhaar(true);
    } else {
      return; 
    }
    
    try {
      if (!panNumber.match(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/) || !aadhaarNumber.match(/^\d{12}$/)) {
         if (field === 'pan') setIsVerifyingPAN(false);
         if (field === 'aadhaar') setIsVerifyingAadhaar(false);
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

  const documentFieldsConfig = [
    { name: "documentUploads.panCard", label: "PAN Card" },
    { name: "documentUploads.aadhaarCard", label: "Aadhaar Card" },
    { name: "documentUploads.photograph", label: "Passport Size Photograph" },
    { name: "documentUploads.incomeProof", label: "Income Proof (Salary Slip / ITR)" },
    { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6 Months)" },
    { name: "documentUploads.propertyDocs", label: "Property Documents / Sale Agreement" },
    { name: "documentUploads.allotmentLetter", label: "Allotment Letter (if any)" },
    { name: "documentUploads.employmentProof", label: "Employment/Business Proof" },
    { name: "documentUploads.existingLoanStatement", label: "Existing Loan Statement (if applicable)" },
  ];

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
            <h2 className="text-3xl font-bold text-card-foreground">Home Loan Application Form</h2>
            <p className="text-muted-foreground mt-1">Simple & Fast Home Loan Process. Transparent Terms, Minimum Documentation. 100% Digital & Safe.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <FormSection title="Applicant Information">
                <FormField control={control} name="applicantDetails.name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><Input placeholder="Full Name" {...field} /><FormMessage /></FormItem> )} />
                <FormField control={control} name="applicantDetails.dob" render={({ field }) => ( <FormItem><FormLabel>Date of Birth</FormLabel><Input type="date" {...field} /><FormMessage /></FormItem> )} />
                <FormField control={control} name="applicantDetails.mobile" render={({ field }) => ( <FormItem><FormLabel>Mobile Number</FormLabel><Input type="tel" placeholder="10-digit mobile" {...field} /><FormMessage /></FormItem> )} />
                <FormField control={control} name="applicantDetails.email" render={({ field }) => ( <FormItem><FormLabel>Email ID</FormLabel><Input type="email" placeholder="example@mail.com" {...field} /><FormMessage /></FormItem> )} />
                <FormFieldWrapper className="md:col-span-2">
                    <FormField control={control} name="residentialAddress.fullAddress" render={({ field }) => ( <FormItem><FormLabel>Current Residential Address</FormLabel><Textarea placeholder="Enter your current full address" {...field} rows={3} /><FormMessage /></FormItem> )} />
                </FormFieldWrapper>
                <FormFieldWrapper className="md:col-span-2">
                     <FormField control={control} name="isPermanentAddressDifferent" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow"><Checkbox checked={field.value} onCheckedChange={field.onChange} /><div className="space-y-1 leading-none"><FormLabel>Permanent address is different from current address</FormLabel></div></FormItem> )} />
                </FormFieldWrapper>
                {isPermanentAddressDifferent && (
                    <FormFieldWrapper className="md:col-span-2">
                        <FormField control={control} name="permanentAddress.fullAddress" render={({ field }) => ( <FormItem><FormLabel>Permanent Address</FormLabel><Textarea placeholder="Enter your permanent full address" {...field} rows={3} /><FormMessage /></FormItem> )} />
                    </FormFieldWrapper>
                )}
                <FormField control={control} name="applicantDetails.pan" render={({ field }) => ( <FormItem><FormLabel className="flex items-center">PAN Number {isVerifyingPAN && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}</FormLabel><Input placeholder="ABCDE1234F" {...field} onBlur={() => handleIDValidation('pan')} /><FormMessage /></FormItem> )} />
                <FormField control={control} name="applicantDetails.aadhaar" render={({ field }) => ( <FormItem><FormLabel className="flex items-center">Aadhaar Number {isVerifyingAadhaar && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}</FormLabel><Input placeholder="123456789012" {...field} onBlur={() => handleIDValidation('aadhaar')} /><FormMessage /></FormItem> )} />
              </FormSection>

              <FormSection title="Loan Details">
                <FormField control={control} name="loanPropertyDetails.loanAmountRequired" render={({ field }) => ( <FormItem><FormLabel>Loan Amount Required (₹)</FormLabel><div className="relative"><span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span><Input type="number" placeholder="e.g., 2500000" className="pl-7" {...field} value={field.value ?? ''} /></div><FormMessage /></FormItem> )} />
                <FormField control={control} name="loanPropertyDetails.purposeOfLoan" render={({ field }) => ( <FormItem className="space-y-3 md:col-span-2"><FormLabel>Purpose of Loan</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-x-4 gap-y-2">{[{ value: "purchase", label: "Home Purchase" }, { value: "construction", label: "Construction" }, { value: "renovation", label: "Home Renovation" }, { value: "transfer", label: "Balance Transfer" }].map(purpose => ( <FormItem key={purpose.value} className="flex items-center space-x-3 space-y-0"><RadioGroupItem value={purpose.value} /><FormLabel className="font-normal text-sm">{purpose.label}</FormLabel></FormItem> ))}</RadioGroup><FormMessage /></FormItem> )} />
                <FormField control={control} name="loanPropertyDetails.propertyLocation" render={({ field }) => ( <FormItem><FormLabel>Property Location (City/Area)</FormLabel><Input placeholder="Location of property" {...field} /><FormMessage /></FormItem> )} />
                <FormField control={control} name="loanPropertyDetails.propertyType" render={({ field }) => ( <FormItem className="space-y-3"><FormLabel>Property Type</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">{[{ value: "apartment", label: "Apartment" },{ value: "independent_house", label: "Independent House" },{ value: "plot_construction", label: "Plot + Construction" }].map(type => ( <FormItem key={type.value} className="flex items-center space-x-3 space-y-0"><RadioGroupItem value={type.value} /><FormLabel className="font-normal text-sm">{type.label}</FormLabel></FormItem> ))}</RadioGroup><FormMessage /></FormItem> )} />
                <FormField control={control} name="loanPropertyDetails.loanTenureRequired" render={({ field }) => ( <FormItem><FormLabel>Loan Tenure (in Years)</FormLabel><Input type="number" placeholder="e.g., 20" {...field} value={field.value ?? ''} /><FormMessage /></FormItem> )} />
                <FormField control={control} name="hasExistingLoans" render={({ field }) => ( <FormItem className="space-y-3 md:col-span-2"><FormLabel>Are you currently paying any loans?</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4"><FormItem className="flex items-center space-x-3 space-y-0"><RadioGroupItem value="yes" /><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><RadioGroupItem value="no" /><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                {hasExistingLoans === "yes" && ( <> <FormField control={control} name="existingLoans.emiAmount" render={({ field }) => ( <FormItem><FormLabel>EMI (₹)</FormLabel><div className="relative"><span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span><Input type="number" placeholder="Current EMI" className="pl-7" {...field} value={field.value ?? ''} /></div><FormMessage /></FormItem> )} /> <FormField control={control} name="existingLoans.bankName" render={({ field }) => ( <FormItem><FormLabel>Bank Name</FormLabel><Input placeholder="Bank Name" {...field} /><FormMessage /></FormItem> )} /> </> )}
              </FormSection>

              <FormSection title="Employment / Income Details">
                <FormField control={control} name="employmentIncome.employmentType" render={({ field }) => ( <FormItem className="space-y-3 md:col-span-2"><FormLabel>Occupation Type</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"><FormItem className="flex items-center space-x-3 space-y-0"><RadioGroupItem value="salaried" /><FormLabel className="font-normal">Salaried</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><RadioGroupItem value="self-employed" /><FormLabel className="font-normal">Self-Employed / Business</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                <FormField control={control} name="employmentIncome.companyName" render={({ field }) => ( <FormItem><FormLabel>Company / Business Name</FormLabel><Input placeholder="Company Name" {...field} /><FormMessage /></FormItem> )} />
                <FormField control={control} name="employmentIncome.monthlyIncome" render={({ field }) => ( <FormItem><FormLabel>Monthly Income (Net Take Home) (₹)</FormLabel><div className="relative"><span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span><Input type="number" placeholder="e.g., 50000" className="pl-7" {...field} value={field.value ?? ''}/></div><FormMessage /></FormItem> )} />
                <FormField control={control} name="employmentIncome.yearsInCurrentJobOrBusiness" render={({ field }) => ( <FormItem><FormLabel>Years in Current Job/Business</FormLabel><Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} /><FormMessage /></FormItem> )} />
              </FormSection>
              
              <FormSection title="Upload Required Documents" subtitle="Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per file.">
                {documentFieldsConfig.map(docField => (
                  <FormFieldWrapper key={docField.name} className="md:col-span-2">
                    <FormField
                      control={control}
                      name={docField.name as keyof HomeLoanApplicationFormData['documentUploads']}
                      render={({ field: { ref, name, onBlur, onChange: rhfOnChange } }) => (
                         <_FormFileInput
                            fieldLabel={docField.label}
                            rhfName={name}
                            rhfRef={ref}
                            rhfOnBlur={onBlur}
                            rhfOnChange={(file) => {
                                rhfOnChange(file);
                                setSelectedFiles(prev => ({ ...prev, [name]: file }));
                                setValue(name as any, file, { shouldValidate: true, shouldDirty: true });
                            }}
                            selectedFile={selectedFiles[name]}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
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
