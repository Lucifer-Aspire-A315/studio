
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ItrFilingConsultationFormSchema, type ItrFilingConsultationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileSpreadsheet, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';
import { Textarea } from '@/components/ui/textarea';
import { submitItrFilingConsultationAction } from '@/app/actions/caServiceActions';
import { uploadFileAction } from '@/app/actions/fileUploadActions';

interface ItrFilingConsultationFormProps {
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


const incomeSourceOptions = [
  { name: "incomeSourceType.salariedEmployee", label: "Salaried Employee" },
  { name: "incomeSourceType.businessIncome", label: "Business Income" },
  { name: "incomeSourceType.freelanceProfessional", label: "Freelance / Professional" },
  { name: "incomeSourceType.capitalGains", label: "Capital Gains (Stocks, Property)" },
  { name: "incomeSourceType.housePropertyIncome", label: "House Property Income" },
  { name: "incomeSourceType.otherIncomeSource", label: "Other" },
] as const;


const documentFieldsConfig = [
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
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});


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
        panCard: undefined,
        aadhaarCard: undefined,
        form16: undefined,
        salarySlips: undefined,
        bankStatement: undefined,
        investmentProofs: undefined,
        rentReceipts: undefined,
        capitalGainStatement: undefined,
        businessIncomeProof: undefined,
    }
  };

  const form = useForm<ItrFilingConsultationFormData>({
    resolver: zodResolver(ItrFilingConsultationFormSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch, reset, setError: setFormError, setValue } = form;

  const watchOtherIncomeSource = watch("incomeSourceType.otherIncomeSource");

  async function onSubmit(data: ItrFilingConsultationFormData) {
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
      dataToSubmit.documentUploads = updatedDocumentUploads as any;

      const result = await submitItrFilingConsultationAction(dataToSubmit); // Removed schema argument
      if (result.success) {
        toast({
          title: "ITR Service Application Submitted!",
          description: result.message,
        });
        reset(); 
        setSelectedFiles({});
      } else {
        toast({
          variant: "destructive",
          title: "Application Failed",
          description: result.message || "An unknown error occurred.",
        });
      }
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "An error occurred while submitting the ITR Filing & Consultation application.",
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
                <FormField control={control} name="applicantDetails.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><Input placeholder="Full Name" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><Input type="tel" placeholder="10-digit mobile" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.emailId" render={({ field }) => (<FormItem><FormLabel>Email ID</FormLabel><Input type="email" placeholder="example@mail.com" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><Input type="date" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.panNumber" render={({ field }) => (<FormItem><FormLabel>PAN Number</FormLabel><Input placeholder="ABCDE1234F" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.aadhaarNumber" render={({ field }) => (<FormItem><FormLabel>Aadhaar Number</FormLabel><Input placeholder="123456789012" {...field} /><FormMessage /></FormItem>)} />
                <FormFieldWrapper className="md:col-span-2">
                  <FormField control={control} name="applicantDetails.address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><Textarea placeholder="Your full address" {...field} rows={3} /><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
                <FormField control={control} name="applicantDetails.cityAndState" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>City & State</FormLabel><Input placeholder="e.g., Mumbai, Maharashtra" {...field} /><FormMessage /></FormItem>)} />
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
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                                        <FormLabel>Specify Other Income Source</FormLabel><Input placeholder="Details for other income source" {...field} /><FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormMessage>{form.formState.errors.incomeSourceType?.root?.message}</FormMessage>
                    </div>
                </FormFieldWrapper>
              </FormSection>

              <FormSection title="Upload Required Documents" subtitle="Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.">
                {documentFieldsConfig.map(docField => (
                  <FormFieldWrapper key={docField.name} className="md:col-span-2">
                    <FormField
                      control={control}
                      name={docField.name as keyof ItrFilingConsultationFormData['documentUploads']}
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
