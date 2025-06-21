
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
import { ArrowLeft, Loader2, Info, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { PageView, SetPageView } from '@/app/page';
import { uploadFileAction } from '@/app/actions/fileUploadActions';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '../ui/textarea';

// --- TYPE DEFINITIONS ---

interface FieldConfig {
  name: string;
  label: React.ReactNode; 
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'radio' | 'file' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  isPAN?: boolean;
  isAadhaar?: boolean;
  prefix?: string; 
  colSpan?: 1 | 2;
  accept?: string;
  dependsOn?: { field: string; value: any };
  rows?: number;
  disabled?: boolean;
}

interface SectionConfig {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
}

interface ServerActionResponse {
  success: boolean;
  message: string; 
  applicationId?: string;
  errors?: Record<string, string[]>;
}

interface GenericLoanFormProps<T extends Record<string, any>> {
  setCurrentPage: SetPageView;
  backPage?: PageView;
  formTitle: string;
  formSubtitle?: string;
  formIcon?: React.ReactNode;
  schema: ZodType<T, ZodTypeDef, T>;
  defaultValues: T;
  sections: SectionConfig[];
  submitAction: (data: T) => Promise<ServerActionResponse>;
  submitButtonText?: string;
}

// --- FILE INPUT COMPONENT ---

interface FormFileInputPresentationProps {
  fieldLabel: React.ReactNode;
  rhfName: string; 
  rhfRef: React.Ref<HTMLInputElement>;
  rhfOnBlur: () => void;
  rhfOnChange: (file: File | null) => void;
  selectedFile: File | null | undefined;
  accept?: string;
}

const FormFileInputPresentation: React.FC<FormFileInputPresentationProps> = ({
  fieldLabel, rhfName, rhfRef, rhfOnBlur, rhfOnChange, selectedFile, accept
}) => {
  const { formItemId } = useFormField(); 
  return (
    <FormItem>
      <FormLabel htmlFor={formItemId} className="flex items-center">
        <UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" /> {fieldLabel}
      </FormLabel>
      <Input
        id={formItemId} type="file" ref={rhfRef} name={rhfName}
        onBlur={rhfOnBlur}
        onChange={(e) => rhfOnChange(e.target.files?.[0] ?? null)}
        accept={accept || ".pdf,.jpg,.jpeg,.png"}
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


// --- GENERIC FORM COMPONENT ---

export function GenericLoanForm<TData extends Record<string, any>>({ 
  setCurrentPage, 
  backPage = 'main',
  formTitle, 
  formSubtitle, 
  formIcon,
  schema, 
  defaultValues, 
  sections,
  submitAction,
  submitButtonText = "Submit Application"
}: GenericLoanFormProps<TData>) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingPAN, setIsVerifyingPAN] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const { currentUser } = useAuth();

  const form = useForm<TData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  const { control, handleSubmit, getValues, setError, clearErrors, trigger, reset, setValue, watch } = form;
  
  const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
  
  const getFirstDocumentUploadsKey = (): string | null => {
    for (const section of sections) {
        for (const field of section.fields) {
            if (field.type === 'file') {
                return field.name.split('.')[0];
            }
        }
    }
    return null;
  };


  async function onSubmit(data: TData) {
    setIsSubmitting(true);

    if (!currentUser) {
      toast({ variant: "destructive", title: "Authentication Required", description: "Please log in to submit your application." });
      setIsSubmitting(false);
      return;
    }

    const payloadForServer = JSON.parse(JSON.stringify(data));

    try {
      const documentUploadsKey = getFirstDocumentUploadsKey();
      
      if (documentUploadsKey && payloadForServer[documentUploadsKey] && typeof payloadForServer[documentUploadsKey] === 'object') {
        const uploadPromises = Object.entries(data[documentUploadsKey] as Record<string, any>)
          .filter(([, file]) => file instanceof File)
          .map(async ([key, file]) => {
            if (file instanceof File) {
              toast({ title: `Uploading ${key}...`, description: "Please wait." });
              const formData = new FormData();
              formData.append('file', file);
              formData.append('fileName', file.name);
              const uploadResult = await uploadFileAction(formData);
              if (uploadResult.success && uploadResult.url) {
                return { key, url: uploadResult.url };
              }
              throw new Error(`Failed to upload ${key}: ${uploadResult.error}`);
            }
            return null;
          });
        
        const uploadedDocuments = await Promise.all(uploadPromises);
        
        uploadedDocuments.forEach(doc => {
            if (doc) {
                payloadForServer[documentUploadsKey][doc.key] = doc.url;
            }
        });
      }
      
      const result = await submitAction(payloadForServer);

      if (result.success) {
        toast({ title: "Application Submitted!", description: result.message });
        reset(); 
        setSelectedFiles({});
      } else {
        toast({ variant: "destructive", title: "Application Failed", description: result.message || "An unknown error occurred.", duration: 9000 });
        if (result.errors) {
          Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            setError(fieldName as any, { type: 'manual', message: (errorMessages as string[]).join(', ') });
          });
        }
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Error", description: error.message || "An unexpected error occurred.", duration: 9000 });
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
        toast({ variant: "destructive", title: "ID Verification Failed", description: result.validationDetails, duration: 9000 });
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast({ variant: "destructive", title: "Validation Error", description: "Could not validate ID details.", duration: 9000 });
      if (panField) setError(panField.name as any, { type: "manual", message: "AI validation failed." });
      if (aadhaarField) setError(aadhaarField.name as any, { type: "manual", message: "AI validation failed." });
    } finally {
      if (fieldConfig.isPAN) setIsVerifyingPAN(false);
      if (fieldConfig.isAadhaar) setIsVerifyingAadhaar(false);
    }
  };

  const renderField = (fieldConfig: FieldConfig) => {
    return (
      <FormField key={fieldConfig.name} control={control} name={fieldConfig.name as any}
        render={({ field }) => {
          switch (fieldConfig.type) {
            case 'file':
              return (
                <FormFileInputPresentation
                  fieldLabel={fieldConfig.label}
                  rhfName={field.name}
                  rhfRef={field.ref}
                  rhfOnBlur={field.onBlur}
                  rhfOnChange={(file: File | null) => {
                    setValue(field.name as any, file, { shouldValidate: true, shouldDirty: true });
                    setSelectedFiles(prev => ({ ...prev, [field.name]: file }));
                  }}
                  selectedFile={selectedFiles[field.name]}
                  accept={fieldConfig.accept}
                />
              );
            case 'radio':
              return (
                <FormItem>
                  <FormLabel>{fieldConfig.label}</FormLabel>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                    {fieldConfig.options?.map(opt => (
                      <FormItem key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} />
                        <FormLabel className="font-normal">{opt.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              );
            case 'textarea':
                return (
                    <FormItem>
                        <FormLabel>{fieldConfig.label}</FormLabel>
                        <Textarea placeholder={fieldConfig.placeholder} {...field} rows={fieldConfig.rows || 3} />
                        <FormMessage />
                    </FormItem>
                );
            default:
              return (
                <FormItem>
                  <FormLabel className="flex items-center">
                      {fieldConfig.label}
                      {fieldConfig.isPAN && isVerifyingPAN && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      {fieldConfig.isAadhaar && isVerifyingAadhaar && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  </FormLabel>
                   {fieldConfig.prefix ? (
                      <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">{fieldConfig.prefix}</span>
                      <Input 
                          type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field}
                          value={field.value ?? ''}
                          onBlur={() => { field.onBlur(); if (fieldConfig.isPAN || fieldConfig.isAadhaar) handleIDValidation(fieldConfig.name); }}
                          className="pl-7"
                          disabled={fieldConfig.disabled}
                      />
                      </div>
                  ) : (
                      <Input 
                        type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field}
                        value={field.value ?? ''} 
                        onBlur={() => { field.onBlur(); if (fieldConfig.isPAN || fieldConfig.isAadhaar) handleIDValidation(fieldConfig.name); }}
                        disabled={fieldConfig.disabled}
                      />
                  )}
                  <FormMessage />
                </FormItem>
              );
          }
        }}
      />
    );
  };

  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => setCurrentPage(backPage)} className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary">
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
              {(() => {
                let visibleSectionCounter = 0;
                return sections.map((section, sectionIdx) => {
                  const isSectionVisible = section.fields.some(field => {
                    if (!field.dependsOn) return true;
                    const watchedValue = getNestedValue(watch(), field.dependsOn.field);
                    return watchedValue === field.dependsOn.value;
                  });

                  if (!isSectionVisible) return null;

                  visibleSectionCounter++;
                  const sectionTitle = `${section.title}`;

                  return (
                    <FormSection key={sectionIdx} title={sectionTitle} subtitle={section.subtitle}>
                      {section.fields.map(fieldConfig => {
                        if (fieldConfig.dependsOn) {
                          const watchedValue = getNestedValue(watch(), fieldConfig.dependsOn.field);
                          if (watchedValue !== fieldConfig.dependsOn.value) return null;
                        }
                        return (
                          <FormFieldWrapper key={fieldConfig.name} className={fieldConfig.colSpan === 2 ? 'md:col-span-2' : ''}>
                            {renderField(fieldConfig)}
                          </FormFieldWrapper>
                        );
                      })}
                    </FormSection>
                  );
                });
              })()}
              
              <p className="text-xs text-muted-foreground mt-6 px-1">
                🔐 All information and documents submitted will remain confidential and will be used solely for loan processing purposes.
              </p>
              <p className="text-xs text-muted-foreground mt-2 mb-4 px-1">
                📝 I hereby declare that all the information and documents provided above are true and correct to the best of my knowledge.
              </p>

              <div className="mt-8 pt-6 border-t border-border">
                <Button type="submit" className="w-full cta-button" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : submitButtonText}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
