
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType, ZodTypeDef } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { validateIdentificationDetails, type ValidateIdentificationDetailsOutput } from '@/ai/flows/validate-identification-details';
import { ArrowLeft, Loader2, Info } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import type { SetPageView } from '@/app/page';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'radio';
  placeholder?: string;
  options?: { value: string; label: string }[];
  isPAN?: boolean;
  isAadhaar?: boolean;
  prefix?: string; // For currency etc.
  colSpan?: 1 | 2;
}

interface SectionConfig {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
}

interface GenericLoanFormProps<T extends Record<string, any>> {
  setCurrentPage: SetPageView;
  formTitle: string;
  formSubtitle?: string;
  formIcon?: React.ReactNode;
  schema: ZodType<T, ZodTypeDef, T>;
  defaultValues: T;
  sections: SectionConfig[];
  loanType: string; // e.g., "Personal Loan", "Business Loan"
}

export function GenericLoanForm<T extends Record<string, any>>({ 
  setCurrentPage, 
  formTitle, 
  formSubtitle, 
  formIcon,
  schema, 
  defaultValues, 
  sections,
  loanType,
}: GenericLoanFormProps<T>) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingPAN, setIsVerifyingPAN] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit, getValues, setError, clearErrors, trigger } = form;

  async function onSubmit(data: T) {
    setIsSubmitting(true);
    console.log(`Submitting ${loanType} application:`, data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: `${loanType} Application Submitted!`,
      description: `Your ${loanType.toLowerCase()} application has been successfully submitted. We will contact you shortly.`,
    });
    setIsSubmitting(false);
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              {fieldConfig.label}
                              {fieldConfig.isPAN && isVerifyingPAN && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                              {fieldConfig.isAadhaar && isVerifyingAadhaar && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            </FormLabel>
                            <FormControl>
                              {fieldConfig.type === 'radio' ? (
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"
                                >
                                  {fieldConfig.options?.map(option => (
                                    <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value={option.value} /></FormControl>
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
                                    {...field}
                                    onBlur={() => {
                                      field.onBlur(); 
                                      if (fieldConfig.isPAN || fieldConfig.isAadhaar) handleIDValidation(fieldConfig.name);
                                    }}
                                    className="pl-7"
                                  />
                                </div>
                              ) : (
                                <Input 
                                  type={fieldConfig.type} 
                                  placeholder={fieldConfig.placeholder} 
                                  {...field} 
                                  onBlur={() => {
                                    field.onBlur(); 
                                    if (fieldConfig.isPAN || fieldConfig.isAadhaar) handleIDValidation(fieldConfig.name);
                                  }}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
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
