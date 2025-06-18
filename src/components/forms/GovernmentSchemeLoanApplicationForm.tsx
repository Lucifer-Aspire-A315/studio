
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GovernmentSchemeLoanApplicationSchema, type GovernmentSchemeLoanApplicationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea'; 
import { Form, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';
import { submitGovernmentSchemeLoanApplicationAction } from '@/app/actions/governmentSchemeActions';
import { uploadFileAction } from '@/app/actions/fileUploadActions';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface GovernmentSchemeLoanApplicationFormProps {
  setCurrentPage: SetPageView;
  selectedScheme: string;
  otherSchemeName?: string;
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


const schemeDisplayNames: Record<string, string> = {
  pmmy: "PM Mudra Yojana",
  pmegp: "PMEGP (Khadi Board)",
  standup: "Stand-Up India",
  other: "Other",
};

export function GovernmentSchemeLoanApplicationForm({ setCurrentPage, selectedScheme, otherSchemeName }: GovernmentSchemeLoanApplicationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const { currentUser } = useAuth(); // Get currentUser

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
      aadhaarCard: undefined,
      panCard: undefined,
      passportSizePhoto: undefined,
      businessProof: undefined,
      bankStatement: undefined,
      casteCertificate: undefined,
      incomeCertificate: undefined,
      projectReport: undefined,
      existingLoanStatement: undefined,
    }
  };

  const form = useForm<GovernmentSchemeLoanApplicationFormData>({
    resolver: zodResolver(GovernmentSchemeLoanApplicationSchema),
    defaultValues,
  });

  const { control, handleSubmit, watch, reset, setError, setValue } = form;

  const businessType = watch("businessInformationGov.businessType");

  async function onSubmit(data: GovernmentSchemeLoanApplicationFormData) {
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
       const documentUploadPromises = Object.entries(data.documentUploadsGov || {})
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
      
      const updatedDocumentUploads = { ...dataToSubmit.documentUploadsGov };
      uploadedDocuments.forEach(doc => {
        if (doc) {
          (updatedDocumentUploads as Record<string, string | undefined | File | null>)[doc.key] = doc.url;
        }
      });
      dataToSubmit.documentUploadsGov = updatedDocumentUploads as any;


      const result = await submitGovernmentSchemeLoanApplicationAction(dataToSubmit);
      if (result.success) {
        toast({
          title: "Application Submitted!",
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
        if (result.errors) {
          Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            setError(fieldName as any, { 
              type: 'manual',
              message: (errorMessages as string[]).join(', '),
            });
          });
        }
      }
    } catch (error: any) {
       let description = error.message || "An error occurred while submitting the application.";
       if (error.message && typeof error.message === 'string' && error.message.includes("Permission denied by Firebase Storage")) {
           description = "File upload failed: Permission denied by Firebase Storage. Please check your Firebase Storage rules in the Firebase Console. Ensure rules allow writes to user-specific paths (e.g., /uploads/{userId}/filename) when 'request.auth' might be null for server-side client SDK uploads. Consider using Firebase Admin SDK for server uploads for more robust security. Original error: " + error.message;
       }
       toast({
        variant: "destructive",
        title: "Submission Error",
        description: description,
        duration: 9000, // Longer duration for important error messages
      });
      console.error("Error submitting Government Scheme Loan application:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const documentFieldsConfig = [
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
                <FormField control={control} name="applicantDetailsGov.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><Input placeholder="Full Name" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.fatherSpouseName" render={({ field }) => (<FormItem><FormLabel>Father’s / Spouse’s Name</FormLabel><Input placeholder="Father's / Spouse's Name" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><Input type="date" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><Input type="tel" placeholder="10-digit mobile" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.emailId" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Email ID</FormLabel><Input type="email" placeholder="example@mail.com" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="male" /><FormLabel className="font-normal">Male</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="female" /><FormLabel className="font-normal">Female</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="other" /><FormLabel className="font-normal">Other</FormLabel></FormItem>
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
                <FormField control={control} name="applicantDetailsGov.category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="general" /><FormLabel className="font-normal">General</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="sc" /><FormLabel className="font-normal">SC</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="st" /><FormLabel className="font-normal">ST</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="obc" /><FormLabel className="font-normal">OBC</FormLabel></FormItem>
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
                 <FormField control={control} name="applicantDetailsGov.maritalStatus" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Marital Status</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="single" /><FormLabel className="font-normal">Single</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="married" /><FormLabel className="font-normal">Married</FormLabel></FormItem>
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
              </FormSection>

              <FormSection title="Address Information">
                <FormFieldWrapper className="md:col-span-2">
                  <FormField control={control} name="addressInformationGov.residentialAddress" render={({ field }) => (<FormItem><FormLabel>Residential Address</FormLabel><Textarea placeholder="Full Residential Address" {...field} rows={3}/><FormMessage /></FormItem>)} />
                </FormFieldWrapper>
                <FormField control={control} name="addressInformationGov.state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><Input placeholder="State" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="addressInformationGov.district" render={({ field }) => (<FormItem><FormLabel>District</FormLabel><Input placeholder="District" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="addressInformationGov.pincode" render={({ field }) => (<FormItem><FormLabel>Pincode</FormLabel><Input placeholder="6-digit Pincode" {...field} /><FormMessage /></FormItem>)} />
              </FormSection>

              <FormSection title="Business Information">
                <FormField control={control} name="businessInformationGov.businessName" render={({ field }) => (<FormItem><FormLabel>Business Name (if any)</FormLabel><Input placeholder="Your Business Name" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="businessInformationGov.businessType" render={({ field }) => (
                    <FormItem><FormLabel>Type of Business</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="proprietorship" /><FormLabel className="font-normal">Proprietorship</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="partnership" /><FormLabel className="font-normal">Partnership</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="other" /><FormLabel className="font-normal">Other</FormLabel></FormItem>
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
                {businessType === "other" && (
                  <FormField control={control} name="businessInformationGov.otherBusinessType" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Specify Other Business Type</FormLabel><Input placeholder="Specify type" {...field} /><FormMessage /></FormItem>)} />
                )}
                <FormField control={control} name="businessInformationGov.businessLocation" render={({ field }) => (<FormItem><FormLabel>Business Location</FormLabel><Input placeholder="Location of business" {...field} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="businessInformationGov.yearsInBusiness" render={({ field }) => (<FormItem><FormLabel>Years in Business</FormLabel><Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} /><FormMessage /></FormItem>)} />
                <FormField control={control} name="businessInformationGov.sector" render={({ field }) => (
                    <FormItem><FormLabel>Sector</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="manufacturing" /><FormLabel className="font-normal">Manufacturing</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="service" /><FormLabel className="font-normal">Service</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="trading" /><FormLabel className="font-normal">Trading</FormLabel></FormItem>
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
                <FormField control={control} name="businessInformationGov.loanPurpose" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Loan Purpose</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="new_setup" /><FormLabel className="font-normal">New Setup</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="expansion" /><FormLabel className="font-normal">Expansion</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="working_capital" /><FormLabel className="font-normal">Working Capital</FormLabel></FormItem>
                        </RadioGroup><FormMessage />
                    </FormItem>)} />
              </FormSection>

              <FormSection title="Loan Details">
                 <FormFieldWrapper>
                    <FormItem>
                        <FormLabel>Loan Scheme Applying For</FormLabel>
                        <Input 
                            value={schemeDisplayNames[selectedScheme] || selectedScheme} 
                            readOnly 
                            disabled 
                            className="bg-slate-100 dark:bg-slate-800"
                        />
                    </FormItem>
                 </FormFieldWrapper>
                 {selectedScheme === 'other' && otherSchemeName && (
                    <FormFieldWrapper>
                        <FormItem>
                            <FormLabel>Other Scheme Name</FormLabel>
                            <Input 
                                value={otherSchemeName} 
                                readOnly 
                                disabled 
                                className="bg-slate-100 dark:bg-slate-800"
                            />
                        </FormItem>
                    </FormFieldWrapper>
                 )}
                 <FormField control={control} name="loanDetailsGov.loanAmountRequired" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Loan Amount Required (₹)</FormLabel>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">₹</span>
                                <Input type="number" placeholder="e.g., 500000" className="pl-7" {...field} value={field.value ?? ''} />
                            </div>
                        <FormMessage />
                    </FormItem>)} 
                />
                <FormField control={control} name="loanDetailsGov.loanTenure" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Loan Tenure (in Years)</FormLabel><Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} /><FormMessage />
                    </FormItem>)} 
                />
              </FormSection>

              <FormSection title="Upload Required Documents" subtitle="File types allowed: PDF, JPG, PNG. Max size: 5 MB per document.">
                {documentFieldsConfig.map(docField => (
                  <FormFieldWrapper key={docField.name} className="md:col-span-2">
                    <FormField
                      control={control}
                      name={docField.name as keyof GovernmentSchemeLoanApplicationFormData['documentUploadsGov']}
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
