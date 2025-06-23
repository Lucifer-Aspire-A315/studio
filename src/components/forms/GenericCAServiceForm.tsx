
"use client";

import React, { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType, ZodTypeDef } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView, PageView } from '@/app/page';
import { processFileUploads } from '@/lib/form-helpers';

// Field and Section Configuration Types
interface FieldConfig {
  name: string;
  label: React.ReactNode;
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'radio' | 'checkbox' | 'textarea' | 'file';
  placeholder?: string;
  options?: { value: string; label: string }[];
  prefix?: string;
  colSpan?: 1 | 2;
  accept?: string;
  dependsOn?: { field: string; value: any };
  rows?: number;
}

interface SectionConfig {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
}

// Reusable File Input Component
interface FormFileInputProps {
  fieldLabel: React.ReactNode;
  rhfName: string;
  rhfRef: React.Ref<HTMLInputElement>;
  rhfOnBlur: () => void;
  rhfOnChange: (file: File | null) => void;
  selectedFile: File | null | undefined;
  accept?: string;
}

const FormFileInput: React.FC<FormFileInputProps> = ({ fieldLabel, rhfRef, rhfName, rhfOnBlur, rhfOnChange, selectedFile, accept }) => {
  const { formItemId } = useFormField();
  return (
    <FormItem>
      <FormLabel htmlFor={formItemId} className="flex items-center">
        <UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" /> {fieldLabel}
      </FormLabel>
      <Input id={formItemId} type="file" ref={rhfRef} name={rhfName} onBlur={rhfOnBlur}
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


interface GenericCAServiceFormProps<T extends Record<string, any>> {
  setCurrentPage: (page: PageView | null) => void;
  backPage?: PageView;
  formTitle: string;
  formSubtitle: string;
  formIcon: React.ReactNode;
  schema: ZodType<T, ZodTypeDef, T>;
  defaultValues: T;
  sections: SectionConfig[];
  submitAction: (data: T) => Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }>;
}

export function GenericCAServiceForm<TData extends Record<string, any>>({
  setCurrentPage,
  backPage,
  formTitle,
  formSubtitle,
  formIcon,
  schema,
  defaultValues,
  sections,
  submitAction,
}: GenericCAServiceFormProps<TData>) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const { currentUser } = useAuth();

  const form = useForm<TData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  const { control, handleSubmit, reset, watch, setValue, getValues, setError } = form;

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

    const dataToSubmit = JSON.parse(JSON.stringify(data));

    try {
      const documentUploadsKey = getFirstDocumentUploadsKey();
      if (documentUploadsKey && data[documentUploadsKey]) {
        const uploadedUrls = await processFileUploads(data[documentUploadsKey], toast);
        Object.assign(dataToSubmit[documentUploadsKey], uploadedUrls);
      }
      
      const result = await submitAction(dataToSubmit);
      if (result.success) {
        toast({ title: "Application Submitted!", description: result.message });
        reset();
        setSelectedFiles({});
      } else {
        toast({ variant: "destructive", title: "Application Failed", description: result.message || "An unknown error occurred.", duration: 9000 });
        if (result.errors) {
            Object.entries(result.errors).forEach(([fieldName, messages]) => {
                setError(fieldName as any, { type: 'manual', message: (messages as string[]).join(', ') });
            });
        }
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Error", description: error.message || "An unexpected error occurred.", duration: 9000 });
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderField = (fieldConfig: FieldConfig, form: UseFormReturn<TData>) => {
    return (
      <FormField key={fieldConfig.name} control={control} name={fieldConfig.name as any}
        render={({ field }) => {
          switch (fieldConfig.type) {
            case 'file':
              return (
                <FormFileInput
                  fieldLabel={fieldConfig.label}
                  rhfRef={field.ref}
                  rhfName={field.name}
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
            case 'checkbox':
                 return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <FormLabel className="font-normal leading-snug">{fieldConfig.label}</FormLabel>
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
                  <FormLabel>{fieldConfig.label}</FormLabel>
                  <Input type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field} value={field.value ?? ''} />
                  <FormMessage />
                </FormItem>
              );
          }
        }}
      />
    );
  };

  const handleBackClick = () => {
    // If backPage is provided, use it. Otherwise, signal to go back to the menu (null).
    setCurrentPage(backPage || null);
  };

  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={handleBackClick} className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            {formIcon}
            <h2 className="text-3xl font-bold text-card-foreground">{formTitle}</h2>
            <p className="text-muted-foreground mt-1">{formSubtitle}</p>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {sections.map((section, idx) => (
                <FormSection key={idx} title={section.title} subtitle={section.subtitle}>
                  {section.fields.map(fieldConfig => {
                    if (fieldConfig.dependsOn) {
                      const watchedValue = getNestedValue(watch(), fieldConfig.dependsOn.field);
                      if (watchedValue !== fieldConfig.dependsOn.value) return null;
                    }
                    return (
                      <FormFieldWrapper key={fieldConfig.name} className={fieldConfig.colSpan === 2 ? 'md:col-span-2' : ''}>
                        {renderField(fieldConfig, form)}
                      </FormFieldWrapper>
                    );
                  })}
                </FormSection>
              ))}
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
