
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuditAndAssuranceFormSchema, type AuditAndAssuranceFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ClipboardCheck, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';
import { submitAuditAndAssuranceAction } from '@/app/actions/caServiceActions';
import { uploadFileAction } from '@/app/actions/fileUploadActions';
import { useAuth } from '@/contexts/AuthContext';

interface AuditAndAssuranceFormProps {
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


const businessTypeOptions = [
  { value: "proprietorship", label: "Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "pvt_ltd", label: "Pvt Ltd" },
  { value: "llp", label: "LLP" },
  { value: "other", label: "Other" }
];

const servicesRequiredOptions = [
  { name: "servicesRequired.statutoryAudit", label: "Statutory Audit (under Companies Act)" },
  { name: "servicesRequired.taxAudit", label: "Tax Audit (under Income Tax Act)" },
  { name: "servicesRequired.internalAudit", label: "Internal Audit" },
  { name: "servicesRequired.managementAudit", label: "Management Audit" },
  { name: "servicesRequired.stockAudit", label: "Stock Audit" },
  { name: "servicesRequired.dueDiligence", label: "Due Diligence" },
  { name: "servicesRequired.otherAuditService", label: "Other" },
] as const;


const documentFieldsConfig = [
    { name: "documentUploads.panCardBusiness", label: "PAN Card of Business/Promoter" },
    { name: "documentUploads.gstCertificate", label: "GST Certificate (if available)" },
    { name: "documentUploads.lastFinancials", label: "Last 2 Years Financial Statements" },
    { name: "documentUploads.bankStatement", label: "Bank Statement (Last 1 Year)" },
    { name: "documentUploads.existingAuditorDetails", label: "Details of Existing Auditors (if any)" },
    { name: "documentUploads.otherSupportingDocs", label: "Any Other Supporting Documents" },
];

export function AuditAndAssuranceForm({ setCurrentPage }: AuditAndAssuranceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const { currentUser } = useAuth();


  const defaultValues: AuditAndAssuranceFormData = {
    applicantDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      businessName: '',
      businessType: undefined,
      otherBusinessTypeDetail: '',
      annualTurnover: undefined,
    },
    servicesRequired: {
        statutoryAudit: false,
        taxAudit: false,
        internalAudit: false,
        managementAudit: false,
        stockAudit: false,
        dueDiligence: false,
        otherAuditService: false,
        otherAuditServiceDetail: '',
    },
    documentUploads: {
        panCardBusiness: undefined,
        gstCertificate: undefined,
        lastFinancials: undefined,
        bankStatement: undefined,
        existingAuditorDetails: undefined,
        otherSupportingDocs: undefined,
    }
  };

  const form = useForm<AuditAndAssuranceFormData>({
    resolver: zodResolver(AuditAndAssuranceFormSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch, reset, setError: setFormError, setValue } = form;

  const watchBusinessType = watch("applicantDetails.businessType");
  const watchOtherService = watch("servicesRequired.otherAuditService");

  async function onSubmit(data: AuditAndAssuranceFormData) {
    setIsSubmitting(true);

    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to submit your application.",
      });
      setIsSubmitting(false);
      return;
    }

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

      const result = await submitAuditAndAssuranceAction(dataToSubmit); 
      if (result.success) {
        toast({
          title: "Service Application Submitted!",
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
        description: error.message || "An error occurred while submitting the application.",
        duration: 9000,
      });
      console.error("Error submitting Audit & Assurance application:", error);
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
            <ClipboardCheck className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Audit and Assurance Service Application</h2>
            <p className="text-muted-foreground mt-1">Please provide the details below to avail our services.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <FormSection title="Applicant Details">
                <FormField control={control} name="applicantDetails.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name of Contact Person</FormLabel><Input placeholder="Full Name" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><Input type="tel" placeholder="10-digit mobile" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.emailId" render={({ field }) => (<FormItem><FormLabel>Email ID</FormLabel><Input type="email" placeholder="example@mail.com" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.businessName" render={({ field }) => (<FormItem><FormLabel>Business Name</FormLabel><Input placeholder="Your Company Name" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.businessType" render={({ field }) => (
                    <FormItem><FormLabel>Business Type</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {businessTypeOptions.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value} />
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
                {watchBusinessType === "other" && (
                  <FormField control={control} name="applicantDetails.otherBusinessTypeDetail" render={({ field }) => (<FormItem><FormLabel>Specify Other Business Type</FormLabel><Input placeholder="Specify type" {...field} /><FormMessage /></FormItem>)} />
                )}
                 <FormField control={control} name="applicantDetails.annualTurnover" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Last Year's Annual Turnover (₹)</FormLabel>
                     <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span>
                        <Input type="number" placeholder="e.g., 5000000" className="pl-7" {...field} value={field.value ?? ''} />
                    </div>
                    <FormMessage />
                </FormItem>)} />
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
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                                name="servicesRequired.otherAuditServiceDetail"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormLabel>Specify Other Service</FormLabel><Input placeholder="Details for other service" {...field} /><FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormMessage>{form.formState.errors.servicesRequired?.root?.message}</FormMessage>
                    </div>
                </FormFieldWrapper>
              </FormSection>

              <FormSection title="Upload Required Documents" subtitle="Accepted File Types: PDF, Excel, JPG, PNG. Max File Size: 5 MB per document.">
                {documentFieldsConfig.map(docField => (
                  <FormFieldWrapper key={docField.name} className="md:col-span-2">
                    <FormField
                      control={control}
                      name={docField.name as keyof AuditAndAssuranceFormData['documentUploads']}
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
                          accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png"
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
