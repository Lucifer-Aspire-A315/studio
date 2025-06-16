
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FinancialAdvisoryFormSchema, type FinancialAdvisoryFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PiggyBank, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';
import { submitFinancialAdvisoryAction } from '@/app/actions/caServiceActions';
import { uploadFileAction } from '@/app/actions/fileUploadActions';

interface FinancialAdvisoryFormProps {
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


const documentFieldsConfig = [
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
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});


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
        panCard: undefined,
        aadhaarCard: undefined,
        salarySlipsIncomeProof: undefined,
        lastYearItrForm16: undefined,
        bankStatement: undefined,
        investmentProofs: undefined,
        existingLoanEmiDetails: undefined,
    }
  };

  const form = useForm<FinancialAdvisoryFormData>({
    resolver: zodResolver(FinancialAdvisoryFormSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch, reset, setError: setFormError, setValue } = form;

  const watchOccupation = watch("applicantDetails.occupation");
  const watchOtherAdvisoryService = watch("advisoryServicesRequired.otherAdvisoryService");

  async function onSubmit(data: FinancialAdvisoryFormData) {
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


      const result = await submitFinancialAdvisoryAction(dataToSubmit, FinancialAdvisoryFormSchema);
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
        if (result.errors) {
          Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            setFormError(fieldName as any, {
              type: 'manual',
              message: (errorMessages as string[]).join(', '),
            });
          });
        }
      }
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "An error occurred while submitting the Financial Advisory application.",
      });
      console.error("Error submitting Financial Advisory application:", error);
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
            <PiggyBank className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Financial Advisory Service Application</h2>
            <p className="text-muted-foreground mt-1">Please provide the details below to help us understand your financial needs.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <FormSection title="Applicant Details">
                <FormField control={control} name="applicantDetails.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><Input placeholder="Full Name" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><Input type="tel" placeholder="10-digit mobile" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.emailId" render={({ field }) => (<FormItem><FormLabel>Email ID</FormLabel><Input type="email" placeholder="example@mail.com" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><Input type="date" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.occupation" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Occupation</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {occupationOptionsFA.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value} />
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
                {watchOccupation === "other" && (
                  <FormField control={control} name="applicantDetails.otherOccupationDetail" render={({ field }) => (<FormItem><FormLabel>Specify Other Occupation</FormLabel><Input placeholder="Specify occupation" {...field} /><FormMessage /></FormItem>)} />
                )}
                <FormField control={control} name="applicantDetails.cityAndState" render={({ field }) => (<FormItem><FormLabel>City & State</FormLabel><Input placeholder="e.g., Mumbai, Maharashtra" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.maritalStatus" render={({ field }) => (
                    <FormItem><FormLabel>Marital Status</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="single" /><FormLabel className="font-normal">Single</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="married" /><FormLabel className="font-normal">Married</FormLabel></FormItem>
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
                <FormField control={control} name="applicantDetails.dependentMembersAdults" render={({ field }) => (<FormItem><FormLabel>Dependent Adults</FormLabel><Input type="number" placeholder="e.g., 2" {...field} value={field.value ?? ''} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetails.dependentMembersChildren" render={({ field }) => (<FormItem><FormLabel>Dependent Children</FormLabel><Input type="number" placeholder="e.g., 1" {...field} value={field.value ?? ''} /><FormMessage /></FormItem>)} />
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
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                                        <FormLabel>Specify Other Service</FormLabel><Input placeholder="Details for other service" {...field} /><FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormMessage>{form.formState.errors.advisoryServicesRequired?.root?.message}</FormMessage>
                    </div>
                </FormFieldWrapper>
              </FormSection>
              
              <FormSection title="Current Financial Overview">
                <FormField control={control} name="currentFinancialOverview.annualIncome" render={({ field }) => (<FormItem><FormLabel>Annual Income (approx) (₹)</FormLabel><Input type="number" placeholder="e.g., 1200000" {...field} value={field.value ?? ''} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="currentFinancialOverview.monthlySavings" render={({ field }) => (<FormItem><FormLabel>Monthly Savings (avg) (₹)</FormLabel><Input type="number" placeholder="e.g., 25000" {...field} value={field.value ?? ''} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="currentFinancialOverview.currentInvestmentsAmount" render={({ field }) => (<FormItem><FormLabel>Current Investments (approx) (₹)</FormLabel><Input type="number" placeholder="e.g., 500000" {...field} value={field.value ?? ''} /><FormMessage /></FormItem>)} />
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
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                {documentFieldsConfig.map(docField => (
                  <FormFieldWrapper key={docField.name} className="md:col-span-2">
                    <FormField
                      control={control}
                      name={docField.name as keyof FinancialAdvisoryFormData['documentUploads']}
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
