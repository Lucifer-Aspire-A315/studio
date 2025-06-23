
"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartnerSignUpSchema, type PartnerSignUpFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { uploadFileAction } from '@/app/actions/fileUploadActions';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, UserPlus, Handshake, Store, Users, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import { partnerSignUpAction } from '@/app/actions/authActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Reusable File Input Component
interface FormFileInputProps {
  fieldLabel: React.ReactNode;
  form: ReturnType<typeof useForm<PartnerSignUpFormData>>;
  fieldName: any; // Allow any nested path
  accept?: string;
}

const FormFileInput: React.FC<FormFileInputProps> = ({ fieldLabel, form, fieldName, accept }) => {
  const { control, setValue, watch } = form;
  const selectedFile = watch(fieldName);
  const { formItemId } = useFormField();

  return (
    <FormItem>
      <FormLabel htmlFor={formItemId} className="flex items-center">
        <UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" /> {fieldLabel}
      </FormLabel>
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { onChange, onBlur, name, ref } }) => (
          <Input
            id={formItemId}
            type="file"
            ref={ref}
            name={name}
            onBlur={onBlur}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onChange(file);
              setValue(fieldName, file, { shouldValidate: true, shouldDirty: true });
            }}
            accept={accept || ".pdf,.jpg,.jpeg,.png"}
            className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
          />
        )}
      />
      {selectedFile instanceof File && (
        <p className="text-xs text-muted-foreground mt-1">
          Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
        </p>
      )}
      <FormMessage />
    </FormItem>
  );
};


export function PartnerSignUpForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const form = useForm<PartnerSignUpFormData>({
    resolver: zodResolver(PartnerSignUpSchema),
    defaultValues: {
      businessModel: 'referral',
      fullName: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const { control, handleSubmit, watch, formState: { errors }, setValue, setError } = form;
  const businessModel = watch('businessModel');

  async function onSubmit(data: PartnerSignUpFormData) {
    setIsSubmitting(true);
    let dataToSubmit = JSON.parse(JSON.stringify(data));

    try {
        // Handle file uploads for DSA
        if (data.businessModel === 'dsa' && data.dsaDocumentUploads) {
            for (const [key, file] of Object.entries(data.dsaDocumentUploads)) {
                if (file instanceof File) {
                    toast({ title: `Uploading ${key}...`, description: "Please wait." });
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('fileName', file.name);
                    const uploadResult = await uploadFileAction(formData);
                    if (!uploadResult.success || !uploadResult.url) {
                        throw new Error(`Failed to upload ${key}: ${uploadResult.error}`);
                    }
                    dataToSubmit.dsaDocumentUploads[key] = uploadResult.url;
                }
            }
        }
        // Handle file uploads for Merchant
        if (data.businessModel === 'merchant' && data.merchantDocumentUploads) {
            for (const [key, file] of Object.entries(data.merchantDocumentUploads)) {
                if (file instanceof File) {
                    toast({ title: `Uploading ${key}...`, description: "Please wait." });
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('fileName', file.name);
                    const uploadResult = await uploadFileAction(formData);
                    if (!uploadResult.success || !uploadResult.url) {
                        throw new Error(`Failed to upload ${key}: ${uploadResult.error}`);
                    }
                    dataToSubmit.merchantDocumentUploads[key] = uploadResult.url;
                }
            }
        }

      const result = await partnerSignUpAction(dataToSubmit);
      if (result.success && result.user) {
        toast({
          title: "Sign Up Successful",
          description: result.message || "Your account has been created and is pending approval.",
        });
        login(result.user);
        form.reset();
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: result.message || "An unknown error occurred.",
        });
        if (result.errors) {
          Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            setError(fieldName as any, { type: 'manual', message: (errorMessages as string[]).join(', ') });
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "An unexpected error occurred during sign up.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <Handshake className="w-12 h-12 mx-auto text-primary mb-2" />
        <h2 className="text-3xl font-bold text-card-foreground">Partner Registration</h2>
        <p className="text-muted-foreground mt-1">
          Join our network. Choose the partner type that best suits you.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <FormSection title="1. Select Your Business Model" subtitle="Choose how you'd like to partner with us.">
            <FormField
              control={control}
              name="businessModel"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2"
                >
                  <FormItem>
                    <FormControl>
                        <RadioGroupItem value="referral" id="referral" className="sr-only" />
                    </FormControl>
                    <Label htmlFor="referral" className={`flex flex-col items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer transition-all ${field.value === 'referral' ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}`}>
                      <Users className="w-8 h-8 mb-2" />
                      <span className="font-bold">Referral Partner</span>
                      <span className="text-xs text-muted-foreground">Refer clients and earn.</span>
                    </Label>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                        <RadioGroupItem value="dsa" id="dsa" className="sr-only" />
                    </FormControl>
                    <Label htmlFor="dsa" className={`flex flex-col items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer transition-all ${field.value === 'dsa' ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}`}>
                      <UserPlus className="w-8 h-8 mb-2" />
                      <span className="font-bold">DSA Partner</span>
                       <span className="text-xs text-muted-foreground">Direct selling agent.</span>
                    </Label>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                       <RadioGroupItem value="merchant" id="merchant" className="sr-only" />
                    </FormControl>
                    <Label htmlFor="merchant" className={`flex flex-col items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer transition-all ${field.value === 'merchant' ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}`}>
                      <Store className="w-8 h-8 mb-2" />
                      <span className="font-bold">Merchant Partner</span>
                       <span className="text-xs text-muted-foreground">Offer loans at your business.</span>
                    </Label>
                  </FormItem>
                </RadioGroup>
              )}
            />
          </FormSection>

          <FormSection title="2. Basic Information" subtitle="This information is required for all partner types.">
            <FormField control={control} name="fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Full Name" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={control} name="mobileNumber" render={({ field }) => ( <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile number" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={control} name="password" render={({ field }) => ( <FormItem><FormLabel>Create Password</FormLabel><FormControl><Input type="password" placeholder="Create a strong password" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={control} name="confirmPassword" render={({ field }) => ( <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="Confirm your password" {...field} /></FormControl><FormMessage /></FormItem> )} />
          </FormSection>
          
          {businessModel === 'dsa' && (
            <>
                <FormSection title="DSA: Personal Details" subtitle="Provide your verifiable personal information.">
                    <FormField control={control} name="personalDetails.fatherOrHusbandName" render={({ field }) => ( <FormItem><FormLabel>Father's / Husband's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="personalDetails.dob" render={({ field }) => ( <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="personalDetails.gender" render={({ field }) => ( <FormItem><FormLabel>Gender</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">Other</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                    <FormField control={control} name="personalDetails.panNumber" render={({ field }) => ( <FormItem><FormLabel>PAN Number</FormLabel><FormControl><Input placeholder="ABCDE1234F" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="personalDetails.aadhaarNumber" render={({ field }) => ( <FormItem><FormLabel>Aadhaar Number</FormLabel><FormControl><Input placeholder="12-digit number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormFieldWrapper className="md:col-span-2">
                        <FormField control={control} name="personalDetails.currentAddress" render={({ field }) => ( <FormItem><FormLabel>Current Address</FormLabel><FormControl><Textarea placeholder="Your current full address" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </FormFieldWrapper>
                    <FormField control={control} name="personalDetails.isPermanentAddressSame" render={({ field }) => ( <FormItem><FormLabel>Is Permanent Address same as Current?</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                    {watch('personalDetails.isPermanentAddressSame') === 'no' && (
                        <FormFieldWrapper className="md:col-span-2">
                          <FormField control={control} name="personalDetails.permanentAddress" render={({ field }) => ( <FormItem><FormLabel>Permanent Address</FormLabel><FormControl><Textarea placeholder="Your permanent full address" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </FormFieldWrapper>
                    )}
                </FormSection>

                <FormSection title="DSA: Professional & Financial Background">
                    <FormField control={control} name="professionalFinancial.highestQualification" render={({ field }) => ( <FormItem><FormLabel>Highest Qualification</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="professionalFinancial.presentOccupation" render={({ field }) => ( <FormItem><FormLabel>Present Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="professionalFinancial.yearsInOccupation" render={({ field }) => ( <FormItem><FormLabel>Years in Occupation</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="professionalFinancial.annualIncome" render={({ field }) => ( <FormItem><FormLabel>Annual Income (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="professionalFinancial.bankName" render={({ field }) => ( <FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="professionalFinancial.bankAccountNumber" render={({ field }) => ( <FormItem><FormLabel>Bank Account Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="professionalFinancial.bankIfscCode" render={({ field }) => ( <FormItem><FormLabel>Bank IFSC Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </FormSection>

                <FormSection title="DSA: Business Scope">
                     <FormField control={control} name="businessScope.constitution" render={({ field }) => ( <FormItem><FormLabel>Constitution</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="individual" /></FormControl><FormLabel className="font-normal">Individual</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="proprietorship" /></FormControl><FormLabel className="font-normal">Proprietorship</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="partnership" /></FormControl><FormLabel className="font-normal">Partnership</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                     <FormField control={control} name="businessScope.operatingLocation" render={({ field }) => ( <FormItem><FormLabel>Preferred Operating Location</FormLabel><FormControl><Input placeholder="e.g., Pune" {...field} /></FormControl><FormMessage /></FormItem> )} />
                     <FormFieldWrapper className="md:col-span-2">
                        <FormItem>
                            <FormLabel>Loan Products of Interest</FormLabel>
                             <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                                <FormField control={control} name="businessScope.productsOfInterest.homeLoan" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Home Loan</FormLabel></FormItem> )} />
                                <FormField control={control} name="businessScope.productsOfInterest.personalLoan" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Personal Loan</FormLabel></FormItem> )} />
                                <FormField control={control} name="businessScope.productsOfInterest.businessLoan" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Business Loan</FormLabel></FormItem> )} />
                                <FormField control={control} name="businessScope.productsOfInterest.creditCard" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Credit Card</FormLabel></FormItem> )} />
                             </div>
                             <FormMessage>{errors.businessScope?.productsOfInterest?.message}</FormMessage>
                        </FormItem>
                    </FormFieldWrapper>
                </FormSection>
                
                <FormSection title="DSA: Document Uploads" subtitle="Please upload clear copies of the following documents.">
                    <FormField control={control} name="dsaDocumentUploads.panCardCopy" render={() => <FormFileInput fieldLabel="PAN Card Copy" form={form} fieldName="dsaDocumentUploads.panCardCopy" />} />
                    <FormField control={control} name="dsaDocumentUploads.aadhaarCardCopy" render={() => <FormFileInput fieldLabel="Aadhaar Card Copy" form={form} fieldName="dsaDocumentUploads.aadhaarCardCopy" />} />
                    <FormField control={control} name="dsaDocumentUploads.photograph" render={() => <FormFileInput fieldLabel="Recent Photograph" form={form} fieldName="dsaDocumentUploads.photograph" accept="image/*" />} />
                    <FormField control={control} name="dsaDocumentUploads.bankStatement" render={() => <FormFileInput fieldLabel="Bank Statement (Last 6 Months)" form={form} fieldName="dsaDocumentUploads.bankStatement" />} />
                </FormSection>

                 <FormField
                    control={control}
                    name="declaration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm md:col-span-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Declaration and Undertaking</FormLabel>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            I hereby declare that the details and documents submitted are true and correct. I authorize RN Fintech to process this application.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
            </>
          )}

          {businessModel === 'merchant' && (
            <>
                <FormSection title="Merchant: Business Information">
                    <FormField control={control} name="businessInformation.legalBusinessName" render={({ field }) => ( <FormItem><FormLabel>Legal Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="businessInformation.businessType" render={({ field }) => ( <FormItem><FormLabel>Business Type</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="proprietorship" /></FormControl><FormLabel className="font-normal">Proprietorship</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="partnership" /></FormControl><FormLabel className="font-normal">Partnership</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="pvt_ltd" /></FormControl><FormLabel className="font-normal">Pvt. Ltd.</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                    <FormField control={control} name="businessInformation.industry" render={({ field }) => ( <FormItem><FormLabel>Industry / Nature of Business</FormLabel><FormControl><Input placeholder="e.g., Electronics Retail" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="businessInformation.gstNumber" render={({ field }) => ( <FormItem><FormLabel>GST Number</FormLabel><FormControl><Input placeholder="Your business GSTIN" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormFieldWrapper className="md:col-span-2">
                      <FormField control={control} name="businessInformation.businessAddress" render={({ field }) => ( <FormItem><FormLabel>Full Business Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </FormFieldWrapper>
                </FormSection>
                 <FormSection title="Merchant: Document Uploads" subtitle="Please upload business verification documents.">
                    <FormField control={control} name="merchantDocumentUploads.gstCertificate" render={() => <FormFileInput fieldLabel="GST Certificate" form={form} fieldName="merchantDocumentUploads.gstCertificate" />} />
                    <FormField control={control} name="merchantDocumentUploads.businessRegistration" render={() => <FormFileInput fieldLabel="Business Registration Proof" form={form} fieldName="merchantDocumentUploads.businessRegistration" />} />
                    <FormField control={control} name="merchantDocumentUploads.ownerPanCard" render={() => <FormFileInput fieldLabel="Owner's PAN Card" form={form} fieldName="merchantDocumentUploads.ownerPanCard" />} />
                </FormSection>
            </>
          )}

          <div className="mt-10 pt-6 border-t">
            <Button type="submit" className="w-full cta-button" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Application...</> : 'Complete Registration'}
            </Button>
             <p className="text-sm text-muted-foreground mt-6 text-center">
                Already have an account?{' '}
                <Link href="/partner-login" className="font-medium text-primary hover:underline">
                Login here
                </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
