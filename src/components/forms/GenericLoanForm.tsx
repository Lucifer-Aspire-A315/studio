
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType, ZodTypeDef } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { validateIdentificationDetails, type ValidateIdentificationDetailsOutput } from '@/ai/flows/validate-identification-details';
import { submitLoanApplicationAction } from '@/app/actions/loanActions';
import { ArrowLeft, Loader2, Info, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';
import { uploadFileAction } from '@/app/actions/fileUploadActions';

interface FieldConfig {
  name: string;
  label: React.ReactNode; // Can be string or JSX. For file inputs, this will be string.
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'radio' | 'file';
  placeholder?: string;
  options?: { value: string; label: string }[];
  isPAN?: boolean;
  isAadhaar?: boolean;
  prefix?: string; 
  colSpan?: 1 | 2;
  accept?: string; 
}

interface SectionConfig {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
}

// Local Presentational Component for File Input
interface FormFileInputPresentationProps {
  fieldLabel: string; // Expecting string now
  rhfName: string; 
  rhfRef: React.Ref<HTMLInputElement>;
  rhfOnBlur: () => void;
  rhfOnChange: (file: File | null) => void; 
  selectedFile: File | null | undefined;
  accept?: string;
}

const FormFileInputPresentation: React.FC<FormFileInputPresentationProps> = ({
  fieldLabel, // Now a string
  rhfRef,
  rhfName,
  rhfOnBlur,
  rhfOnChange,
  selectedFile,
  accept,
}) => {
  const { formItemId } = useFormField(); // Get formItemId from context
  return (
    <FormItem>
      <FormLabel htmlFor={formItemId} className="flex items-center"> {/* Link label to input */}
        <UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" /> {fieldLabel}
      </FormLabel>
      <Input
        id={formItemId} // Set id on input
        type="file"
        ref={rhfRef}
        name={rhfName}
        onBlur={rhfOnBlur}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          rhfOnChange(file); // This calls the onChange passed from FormField render prop
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


interface GenericLoanFormProps<T extends Record<string, any>> {
  setCurrentPage: SetPageView;
  formTitle: string;
  formSubtitle?: string;
  formIcon?: React.ReactNode;
  schema: ZodType<T, ZodTypeDef, T>;
  defaultValues: T;
  sections: SectionConfig[];
  loanType: string; 
}

export function GenericLoanForm<TData extends Record<string, any>>({ 
  setCurrentPage, 
  formTitle, 
  formSubtitle, 
  formIcon,
  schema, 
  defaultValues, 
  sections,
  loanType,
}: GenericLoanFormProps<TData>) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingPAN, setIsVerifyingPAN] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});


  const form = useForm<TData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit, getValues, setError, clearErrors, trigger, reset, setValue } = form;

  async function onSubmit(data: TData) {
    setIsSubmitting(true);
    const dataToSubmit = { ...data };

    try {
      const documentUploadsKey = 'documentUploads' in data ? 'documentUploads' : ('documentUploadDetails' in data ? 'documentUploadDetails' : null);

      if (documentUploadsKey && dataToSubmit[documentUploadsKey] && typeof dataToSubmit[documentUploadsKey] === 'object') {
        const currentDocumentUploads = dataToSubmit[documentUploadsKey] as Record<string, any>;
        const documentUploadPromises = Object.entries(currentDocumentUploads)
          .filter(([, file]) => file instanceof File) // Only process actual File objects
          .map(async ([key, file]) => {
            if (file instanceof File) { // Double check, should always be true here
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
        
        const updatedDocumentUploads = { ...currentDocumentUploads };
        uploadedDocuments.forEach(doc => {
          if (doc) {
            (updatedDocumentUploads as Record<string, string | undefined | File | null>)[doc.key] = doc.url;
          }
        });
        dataToSubmit[documentUploadsKey] = updatedDocumentUploads as any; // Cast after processing
      }


      const result = await submitLoanApplicationAction(dataToSubmit, loanType, schema);
      if (result.success) {
        toast({
          title: `${loanType} Application Submitted!`,
          description: result.message,
        });
        reset(); 
        setSelectedFiles({});
      } else {
        toast({
          variant: "destructive",
          title: `${loanType} Application Failed`,
          description: result.message || "An unknown error occurred.",
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
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || `An error occurred while submitting the ${loanType.toLowerCase()} application.`,
      });
      console.error(`Error submitting ${loanType} application:`, error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleIDValidation = async (fieldName: string) => {
    const fieldConfig = sections.flatMap(s => s.fields).find(f => f.name === fieldName);
    if (!fieldConfig || (!fieldConfig.isPAN && !fieldConfig.isAadhaar)) return;
  
    const isValidFormat = await trigger(fieldName as any);
    if (!isValidFormat) return;

    const panField = sections.flatMap(s => s.fields).find(f => f.isPAN);
    const aadhaarField = sections.flatMap(s => s.fields).find(f => f.isAadhaar);

    const panNumber = panField ? getValues(panField.name as any) : "";
    const aadhaarNumber = aadhaarField ? getValues(aadhaarField.name as any) : "";

    if (fieldConfig.isPAN) setIsVerifyingPAN(true);
    if (fieldConfig.isAadhaar) setIsVerifyingAadhaar(true);

    try {
      if (!panNumber || !aadhaarNumber || !panNumber.match(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/) || !aadhaarNumber.match(/^\d{12}$/)) {
        if (panField) clearErrors(panField.name as any); 
        if (aadhaarField) clearErrors(aadhaarField.name as any);
        return;
      }

      const result: ValidateIdentificationDetailsOutput = await validateIdentificationDetails({ panNumber, aadhaarNumber });
      
      if (result.isValid) {
        toast({ title: "ID Verification Success", description: result.validationDetails });
        if (panField) clearErrors(panField.name as any);
        if (aadhaarField) clearErrors(aadhaarField.name as any);
      } else {
        if (panField) setError(panField.name as any, { type: "manual", message: "PAN/Aadhaar validation failed." });
        if (aadhaarField) setError(aadhaarField.name as any, { type: "manual", message: result.validationDetails });
        toast({ variant: "destructive", title: "ID Verification Failed", description: result.validationDetails });
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast({ variant: "destructive", title: "Validation Error", description: "Could not validate ID details." });
      if (panField) setError(panField.name as any, { type: "manual", message: "AI validation failed." });
      if (aadhaarField) setError(aadhaarField.name as any, { type: "manual", message: "AI validation failed." });
    } finally {
      if (fieldConfig.isPAN) setIsVerifyingPAN(false);
      if (fieldConfig.isAadhaar) setIsVerifyingAadhaar(false);
    }
  };


  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => setCurrentPage('main')} className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            {formIcon || <Info className="w-12 h-12 mx-auto text-primary mb-2" />}
            <h2 className="text-3xl font-bold text-card-foreground">{formTitle}</h2>
            {formSubtitle && <p className="text-muted-foreground mt-1">{formSubtitle}</p>}
          </div>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {sections.map((section, sectionIdx) => (
                <FormSection key={sectionIdx} title={section.title} subtitle={section.subtitle}>
                  {section.fields.map((fieldConfig) => (
                    <FormFieldWrapper key={fieldConfig.name} className={fieldConfig.colSpan === 2 ? 'md:col-span-2' : ''}>
                      <FormField
                        control={control}
                        name={fieldConfig.name as any}
                        render={({ field: { ref, name, onBlur, onChange: rhfNativeOnChange, value } }) => {
                          if (fieldConfig.type === 'file') {
                            return (
                              <FormFileInputPresentation
                                fieldLabel={fieldConfig.label as string} // Asserting label is string for file inputs
                                rhfName={name}
                                rhfRef={ref}
                                rhfOnBlur={onBlur}
                                rhfOnChange={(file: File | null) => {
                                  rhfNativeOnChange(file); 
                                  setSelectedFiles(prev => ({ ...prev, [name]: file }));
                                  setValue(name as any, file, { shouldValidate: true, shouldDirty: true });
                                }}
                                selectedFile={selectedFiles[name]}
                                accept={fieldConfig.accept || ".pdf,.jpg,.jpeg,.png"}
                              />
                            );
                          }
                          return (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                {fieldConfig.label} {/* Original label (can be JSX for non-file types) */}
                                {fieldConfig.isPAN && isVerifyingPAN && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                {fieldConfig.isAadhaar && isVerifyingAadhaar && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                              </FormLabel>
                              {fieldConfig.type === 'radio' ? (
                                <RadioGroup
                                  onValueChange={rhfNativeOnChange}
                                  defaultValue={value}
                                  className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"
                                >
                                  {fieldConfig.options?.map(option => (
                                    <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                      <RadioGroupItem value={option.value} />
                                      <FormLabel className="font-normal">{option.label}</FormLabel>
                                    </FormItem>
                                  ))}
                                </RadioGroup>
                              ) : fieldConfig.prefix ? (
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">{fieldConfig.prefix}</span>
                                  <Input 
                                    type={fieldConfig.type} 
                                    placeholder={fieldConfig.placeholder} 
                                    ref={ref}
                                    name={name}
                                    value={value ?? ''}
                                    onBlur={() => { onBlur(); if (fieldConfig.isPAN || fieldConfig.isAadhaar) handleIDValidation(fieldConfig.name); }}
                                    onChange={rhfNativeOnChange}
                                    className="pl-7"
                                  />
                                </div>
                              ) : (
                                <Input 
                                  type={fieldConfig.type} 
                                  placeholder={fieldConfig.placeholder} 
                                  ref={ref}
                                  name={name}
                                  value={value ?? ''}
                                  onBlur={() => { onBlur(); if (fieldConfig.isPAN || fieldConfig.isAadhaar) handleIDValidation(fieldConfig.name); }}
                                  onChange={rhfNativeOnChange}
                                />
                              )}
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </FormFieldWrapper>
                  ))}
                </FormSection>
              ))}
              
              <p className="text-xs text-muted-foreground mt-6 px-1">
                🔐 All information and documents submitted will remain confidential and will be used solely for loan processing purposes.
              </p>
              <p className="text-xs text-muted-foreground mt-2 mb-4 px-1">
                📝 I hereby declare that all the information and documents provided above are true and correct to the best of my knowledge.
              </p>

              <div className="mt-8 pt-6 border-t border-border">
                <Button type="submit" className="w-full cta-button" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : `Submit ${loanType} Application`}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
