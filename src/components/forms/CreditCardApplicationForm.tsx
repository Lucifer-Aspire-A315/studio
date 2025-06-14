
"use client";

import React from 'react';
import { CreditCardIcon, UploadCloud } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { CreditCardApplicationSchema, type CreditCardApplicationFormData } from '@/lib/schemas';
import type { SetPageView } from '@/app/page';

interface CreditCardApplicationFormProps {
  setCurrentPage: SetPageView;
}

const creditCardSections = [
  {
    title: "1. Applicant Information",
    subtitle: "व्यक्तिगत जानकारी",
    fields: [
      { name: "applicantDetails.name", label: "Full Name", type: "text", placeholder: "Full Name" },
      { name: "applicantDetails.dob", label: "Date of Birth", type: "date" },
      { name: "applicantDetails.mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "applicantDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
      { name: "applicantDetails.pan", label: "PAN Number", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "applicantDetails.aadhaar", label: "Aadhaar Number", type: "text", placeholder: "123456789012", isAadhaar: true },
      { name: "residentialAddress.fullAddress", label: "Residential Address", type: "text", placeholder: "Full residential address", colSpan: 2 },
      { name: "residentialAddress.city", label: "City", type: "text", placeholder: "City" },
      { name: "residentialAddress.pincode", label: "Pincode", type: "text", placeholder: "6-digit Pincode" },
    ]
  },
  {
    title: "2. Employment / Income Details",
    subtitle: "रोजगार और आय की जानकारी",
    fields: [
      { name: "employmentIncome.employmentType", label: "Occupation Type", type: "radio", options: [{value: "salaried", label: "Salaried"}, {value: "self-employed", label: "Self-Employed / Business"}], colSpan: 2},
      { name: "employmentIncome.companyName", label: "Company / Business Name", type: "text", placeholder: "Company Name" },
      { name: "employmentIncome.monthlyIncome", label: "Monthly Income (₹)", type: "number", placeholder: "e.g., 50000", prefix: "₹" },
      { name: "employmentIncome.yearsInCurrentJobOrBusiness", label: "Employment Duration (Years)", type: "number", placeholder: "e.g., 3" },
    ]
  },
  {
    title: "3. Credit Card Preferences",
    subtitle: "क्रेडिट कार्ड प्राथमिकताएं",
    fields: [
      { name: "creditCardPreferences.preferredCardType", label: "Preferred Card Type", type: "radio", options: [
          {value: "basic", label: "Basic Credit Card"},
          {value: "rewards", label: "Rewards / Cashback Card"},
          {value: "travel", label: "Travel Card"},
          {value: "business", label: "Business Credit Card"},
          {value: "other", label: "Other"}
        ], colSpan: 2 },
      { name: "creditCardPreferences.otherPreferredCardType", label: "If Other, specify type", type: "text", placeholder: "Specify other card type" },
      { name: "creditCardPreferences.hasExistingCreditCard", label: "Existing Credit Card?", type: "radio", options: [{value: "yes", label: "Yes"}, {value: "no", label: "No"}], colSpan: 2 },
      { name: "creditCardPreferences.existingCreditCardIssuer", label: "If Yes, Issuer", type: "text", placeholder: "Card Issuer Name" },
      { name: "creditCardPreferences.existingCreditCardLimit", label: "If Yes, Limit (₹)", type: "number", placeholder: "e.g., 50000", prefix: "₹" },
    ]
  },
  {
    title: "4. Upload Required Documents",
    subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.",
    fields: [
      { name: "documentUploads.panCard", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />PAN Card</>, type: "text", placeholder: "Click to upload", colSpan: 2 },
      { name: "documentUploads.aadhaarCard", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Aadhaar Card</>, type: "text", placeholder: "Click to upload", colSpan: 2 },
      { name: "documentUploads.photograph", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Passport Size Photo</>, type: "text", placeholder: "Click to upload", colSpan: 2 },
      { name: "documentUploads.incomeProof", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Income Proof (Salary Slip / ITR)</>, type: "text", placeholder: "Click to upload", colSpan: 2 },
      { name: "documentUploads.bankStatement", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Bank Statement (Last 3–6 Months)</>, type: "text", placeholder: "Click to upload", colSpan: 2 },
      { name: "documentUploads.employmentProof", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Employment/Business Proof</>, type: "text", placeholder: "Click to upload", colSpan: 2 },
      { name: "documentUploads.existingCreditCardStatement", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Existing Credit Card Statement (if any)</>, type: "text", placeholder: "Click to upload", colSpan: 2 },
    ]
  }
];

export function CreditCardApplicationForm({ setCurrentPage }: CreditCardApplicationFormProps) {
  const defaultValues: CreditCardApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '' },
    residentialAddress: { fullAddress: '', city: '', pincode: '' },
    employmentIncome: { 
      employmentType: undefined, 
      companyName: '', 
      monthlyIncome: undefined, 
      yearsInCurrentJobOrBusiness: undefined 
    },
    creditCardPreferences: {
      preferredCardType: undefined,
      otherPreferredCardType: '',
      hasExistingCreditCard: undefined,
      existingCreditCardIssuer: '',
      existingCreditCardLimit: undefined,
    },
    documentUploads: {
      panCard: '',
      aadhaarCard: '',
      photograph: '',
      incomeProof: '',
      bankStatement: '',
      employmentProof: '',
      existingCreditCardStatement: '',
    }
  };

  return (
    <GenericLoanForm
      setCurrentPage={setCurrentPage}
      formTitle="Credit Card Application Form"
      formSubtitle="Apply for Your Credit Card Easily • Quick Approval • Minimal Documents • 100% Digital & Secure Process"
      formIcon={<CreditCardIcon className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={CreditCardApplicationSchema}
      defaultValues={defaultValues}
      sections={creditCardSections}
      loanType="Credit Card"
    />
  );
}
