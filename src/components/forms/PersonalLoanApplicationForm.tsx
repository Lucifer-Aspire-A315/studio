
"use client";

import React from 'react';
import { User, UploadCloud } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { PersonalLoanApplicationSchema, type PersonalLoanApplicationFormData } from '@/lib/schemas';
import type { SetPageView } from '@/app/page';

interface PersonalLoanApplicationFormProps {
  setCurrentPage: SetPageView;
}

const personalLoanSections = [
  {
    title: "1. Applicant Information",
    subtitle: "व्यक्तिगत जानकारी",
    fields: [
      { name: "applicantDetails.name", label: "Full Name", type: "text", placeholder: "Full Name" },
      { name: "applicantDetails.dob", label: "Date of Birth", type: "date" },
      { name: "applicantDetails.mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "applicantDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
      { name: "residentialAddress.fullAddress", label: "Current Address", type: "text", placeholder: "Enter your current full address", colSpan: 2 },
      { name: "applicantDetails.pan", label: "PAN Number", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "applicantDetails.aadhaar", label: "Aadhaar Number", type: "text", placeholder: "123456789012", isAadhaar: true },
    ]
  },
  {
    title: "2. Employment / Income Details",
    subtitle: "रोजगार और आय की जानकारी",
    fields: [
      { name: "employmentIncome.employmentType", label: "Occupation Type", type: "radio", options: [{value: "salaried", label: "Salaried"}, {value: "self-employed", label: "Self-Employed / Business"}], colSpan: 2},
      { name: "employmentIncome.companyName", label: "Company / Business Name", type: "text", placeholder: "Company Name" },
      { name: "employmentIncome.monthlyIncome", label: "Monthly Income (₹)", type: "number", placeholder: "e.g., 50000", prefix: "₹" },
      { name: "employmentIncome.yearsInCurrentJobOrBusiness", label: "Job/Business Duration (Years)", type: "number", placeholder: "e.g., 3" },
    ]
  },
   {
    title: "3. Loan Details",
    subtitle: "ऋण की जानकारी",
    fields: [
      { name: "loanDetails.loanAmountRequired", label: "Loan Amount Required (₹)", type: "number", placeholder: "e.g., 200000", prefix: "₹" },
      { name: "loanDetails.purposeOfLoan", label: "Purpose of Loan", type: "radio", options: [
          {value: "medical_emergency", label: "Medical Emergency"},
          {value: "travel", label: "Travel"},
          {value: "education", label: "Education"},
          {value: "wedding", label: "Wedding"},
          {value: "home_renovation", label: "Home Renovation"},
          {value: "other", label: "Other"}
        ], colSpan: 2 },
      { name: "loanDetails.otherPurposeOfLoan", label: "If Other, specify purpose", type: "text", placeholder: "Specify other purpose" },
      { name: "loanDetails.loanTenureRequired", label: "Preferred Loan Tenure (in Months)", type: "number", placeholder: "e.g., 36" },
      { name: "loanDetails.hasExistingLoans", label: "Any Existing Loans?", type: "radio", options: [{value: "yes", label: "Yes"}, {value: "no", label: "No"}], colSpan: 2 },
      { name: "existingLoans.emiAmount", label: "If Yes, EMI (₹)", type: "number", placeholder: "EMI amount", prefix: "₹" },
      { name: "existingLoans.bankName", label: "If Yes, Bank Name", type: "text", placeholder: "Bank Name" },
    ]
  },
  {
    title: "4. Upload Required Documents",
    subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.",
    fields: [
      { name: "documentUploads.panCard", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />PAN Card</>, type: "text", placeholder: "Click to upload (filename placeholder)", colSpan: 2 },
      { name: "documentUploads.aadhaarCard", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Aadhaar Card</>, type: "text", placeholder: "Click to upload (filename placeholder)", colSpan: 2 },
      { name: "documentUploads.photograph", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Passport Size Photograph</>, type: "text", placeholder: "Click to upload (filename placeholder)", colSpan: 2 },
      { name: "documentUploads.incomeProof", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Income Proof (Salary Slip / ITR)</>, type: "text", placeholder: "Click to upload (filename placeholder)", colSpan: 2 },
      { name: "documentUploads.bankStatement", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Bank Statement (Last 6 Months)</>, type: "text", placeholder: "Click to upload (filename placeholder)", colSpan: 2 },
      { name: "documentUploads.employmentProof", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Employment/Business Proof</>, type: "text", placeholder: "Click to upload (filename placeholder)", colSpan: 2 },
      { name: "documentUploads.existingLoanStatement", label: <><UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />Existing Loan Statement (if any)</>, type: "text", placeholder: "Click to upload (filename placeholder)", colSpan: 2 },
    ]
  }
];


export function PersonalLoanApplicationForm({ setCurrentPage }: PersonalLoanApplicationFormProps) {
  const defaultValues: PersonalLoanApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '' },
    residentialAddress: { fullAddress: '' },
    employmentIncome: { 
      employmentType: undefined,
      // occupation: '', // Removed as per new form structure and schema update
      companyName: '', 
      monthlyIncome: undefined,
      yearsInCurrentJobOrBusiness: undefined 
    },
    loanDetails: {
      loanAmountRequired: undefined,
      purposeOfLoan: undefined,
      otherPurposeOfLoan: '',
      loanTenureRequired: undefined,
      hasExistingLoans: undefined,
    },
    existingLoans: {
      emiAmount: undefined,
      bankName: '',
    },
    documentUploads: {
      panCard: '',
      aadhaarCard: '',
      photograph: '',
      incomeProof: '',
      bankStatement: '',
      employmentProof: '',
      existingLoanStatement: '',
    }
  };


  return (
    <GenericLoanForm
      setCurrentPage={setCurrentPage}
      formTitle="Personal Loan Application Form"
      formSubtitle="Instant Loan for Your Personal Needs • Easy Process • Fast Disbursal • Minimum Documents • 100% Secure & Confidential"
      formIcon={<User className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={PersonalLoanApplicationSchema}
      defaultValues={defaultValues}
      sections={personalLoanSections}
      loanType="Personal Loan"
    />
  );
}

