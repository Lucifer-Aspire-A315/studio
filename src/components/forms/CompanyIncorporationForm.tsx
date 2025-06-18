
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
import { Form, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';
import { submitCompanyIncorporationAction } from '@/app/actions/caServiceActions';
import { uploadFileAction } from '@/app/actions/fileUploadActions';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface CompanyIncorporationFormProps {
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

const documentFieldsConfig = [
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
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const { currentUser } = useAuth(); // Get currentUser


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
        directorPanCard: undefined,
        directorAadhaarCard: undefined,
        directorPhoto: undefined,
        businessAddressProof: undefined,
        directorBankStatement: undefined,
        dsc: undefined,
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

  const { control, handleSubmit, watch, reset, setError: setFormError, setValue } = form;

  const watchOccupation = watch("applicantFounderDetails.occupation");
  const watchCompanyType = watch("companyDetails.companyType");

  async function onSubmit(data: CompanyIncorporationFormData) {
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


      const result = await submitCompanyIncorporationAction(dataToSubmit);
      if (result.success) {
        toast({
          title: "Incorporation Application Submitted!",
          description: result.message,
        });
        reset(); 
        setSelectedFiles({});
      } else {
        toast({
          variant: "destructive",
          title: "Application Failed",
          description: result.message || "An unknown error occurred.",
          duration: 9000,
        });
      }
    } catch (error: any) {
       let description = error.message || "An error occurred while submitting the Company Incorporation application.";
       if (error.message && typeof error.message === 'string' && error.message.includes("Permission denied by Firebase Storage")) {
           description = "File upload failed: Permission denied by Firebase Storage. Please check your Firebase Storage rules in the Firebase Console. Ensure rules allow writes to user-specific paths (e.g., /uploads/{userId}/filename) when 'request.auth' might be null for server-side client SDK uploads. Consider using Firebase Admin SDK for server uploads for more robust security. Original error: " + error.message;
       }
       toast({
        variant: "destructive",
        title: "Submission Error",
        description: description,
        duration: 9000, // Longer duration for important error messages
      });
      console.error("Error submitting Company Incorporation application:", error);
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
            <Building2 className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold text-card-foreground">Company Incorporation Application Form</h2>
            <p className="text-muted-foreground mt-1">Please provide the details below to start your company registration process.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <FormSection title="Applicant / Founder Details">
                <FormField control={control} name="applicantFounderDetails.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><Input placeholder="Full Name" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantFounderDetails.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><Input type="tel" placeholder="10-digit mobile" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantFounderDetails.emailId" render={({ field }) => (<FormItem><FormLabel>Email ID</FormLabel><Input type="email" placeholder="example@mail.com" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantFounderDetails.dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><Input type="date" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantFounderDetails.occupation" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Occupation</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {occupationOptions.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value} />
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
                {watchOccupation === "other" && (
                  <FormField control={control} name="applicantFounderDetails.otherOccupationDetail" render={({ field }) => (<FormItem><FormLabel>Specify Other Occupation</FormLabel><Input placeholder="Specify occupation" {...field} /><FormMessage /></FormItem>)} />
                )}
                <FormFieldWrapper className="md:col-span-2">
                    <FormField control={control} name="applicantFounderDetails.residentialAddress" render={({ field }) => (<FormItem><FormLabel>Residential Address</FormLabel><Textarea placeholder="Your full residential address" {...field} rows={3} /><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
                <FormField control={control} name="applicantFounderDetails.cityAndState" render={({ field }) => (<FormItem><FormLabel>City & State</FormLabel><Input placeholder="e.g., Mumbai, Maharashtra" {...field} /><FormMessage /></FormItem>)} />
              </FormSection>

              <FormSection title="Company Details">
                <FormField control={control} name="companyDetails.companyType" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Type of Company to Incorporate</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {companyTypeOptions.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value} />
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
                {watchCompanyType === "other" && (
                  <FormField control={control} name="companyDetails.otherCompanyTypeDetail" render={({ field }) => (<FormItem><FormLabel>Specify Other Company Type</FormLabel><Input placeholder="Specify type" {...field} /><FormMessage /></FormItem>)} />
                )}
                <FormField control={control} name="companyDetails.proposedCompanyName1" render={({ field }) => (<FormItem><FormLabel>Proposed Company Name 1</FormLabel><Input placeholder="Name preference 1" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="companyDetails.proposedCompanyName2" render={({ field }) => (<FormItem><FormLabel>Proposed Company Name 2 (Optional)</FormLabel><Input placeholder="Name preference 2" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="companyDetails.proposedCompanyName3" render={({ field }) => (<FormItem><FormLabel>Proposed Company Name 3 (Optional)</FormLabel><Input placeholder="Name preference 3" {...field} /><FormMessage /></FormItem>)} />
                
                <FormFieldWrapper className="md:col-span-2">
                    <FormField control={control} name="companyDetails.businessActivity" render={({ field }) => (<FormItem><FormLabel>Business Activity / Nature of Work</FormLabel><Textarea placeholder="Describe your business activities" {...field} rows={3} /><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
                 <FormFieldWrapper className="md:col-span-2">
                    <FormField control={control} name="companyDetails.proposedBusinessAddress" render={({ field }) => (<FormItem><FormLabel>Proposed Business Address</FormLabel><Textarea placeholder="Full proposed business address" {...field} rows={3} /><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
              </FormSection>

               <FormSection title="Number of Directors / Partners">
                  <FormField control={control} name="directorsPartners.numberOfDirectorsPartners" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Select Number</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            {numDirectorsOptions.map(opt => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value} />
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup><FormMessage />
                         <p className="text-xs text-muted-foreground mt-2">Each director/partner must provide separate documents.</p>
                    </FormItem>)} />
              </FormSection>


              <FormSection title="Upload Required Documents" subtitle="For Each Director/Partner. Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.">
                {documentFieldsConfig.map(docField => (
                  <FormFieldWrapper key={docField.name} className="md:col-span-2">
                    <FormField
                      control={control}
                      name={docField.name as keyof CompanyIncorporationFormData['documentUploads']}
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
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="declaration-checkbox" />
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
