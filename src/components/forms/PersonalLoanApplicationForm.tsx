
"use client";

import React from 'react';
import { User } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { PersonalLoanApplicationSchema, type PersonalLoanApplicationFormData } from '@/lib/schemas';
import type { SetPageView } from '@/app/page';
import { submitLoanApplicationAction } from '@/app/actions/loanActions';

interface PersonalLoanApplicationFormProps {
  setCurrentPage: SetPageView;
}

const personalLoanSections = [
  {
    title: "Applicant Information",
    subtitle: "व्यक्तिगत जानकारी",
    fields: [
      { name: "applicantDetails.name", label: "Full Name", type: "text", placeholder: "Full Name" },
      { name: "applicantDetails.dob", label: "Date of Birth", type: "date" },
      { name: "applicantDetails.mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "applicantDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
      { name: "applicantDetails.residentialAddress", label: "Current Address", type: "textarea", placeholder: "Enter your current full address", colSpan: 2 },
      { name: "applicantDetails.pan", label: "PAN Number", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "applicantDetails.aadhaar", label: "Aadhaar Number", type: "text", placeholder: "123456789012", isAadhaar: true },
    ]
  },
  {
    title: "Employment / Income Details",
    subtitle: "रोजगार और आय की जानकारी",
    fields: [
      { name: "employmentIncome.employmentType", label: "Occupation Type", type: "radio", options: [{value: "salaried", label: "Salaried"}, {value: "self-employed", label: "Self-Employed / Business"}], colSpan: 2},
      { name: "employmentIncome.companyName", label: "Company / Business Name", type: "text", placeholder: "Company Name" },
      { name: "employmentIncome.monthlyIncome", label: "Monthly Income (₹)", type: "number", placeholder: "e.g., 50000", prefix: "₹" },
      { name: "employmentIncome.yearsInCurrentJobOrBusiness", label: "Job/Business Duration (Years)", type: "number", placeholder: "e.g., 3" },
    ]
  },
   {
    title: "Loan Details",
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
      { name: "loanDetails.otherPurposeOfLoan", label: "If Other, specify purpose", type: "text", placeholder: "Specify other purpose", dependsOn: { field: "loanDetails.purposeOfLoan", value: "other" } },
      { name: "loanDetails.loanTenureRequired", label: "Preferred Loan Tenure (in Months)", type: "number", placeholder: "e.g., 36" },
      { name: "loanDetails.hasExistingLoans", label: "Any Existing Loans?", type: "radio", options: [{value: "yes", label: "Yes"}, {value: "no", label: "No"}], colSpan: 2 },
    ]
  },
   {
    title: "Existing Loan Details",
    subtitle: "मौजूदा ऋण की जानकारी",
    fields: [
      { name: "existingLoans.emiAmount", label: "If Yes, Total Current EMI (कुल वर्तमान ईएमआई)", type: "number", placeholder: "Total EMI amount", prefix: "₹", dependsOn: { field: "loanDetails.hasExistingLoans", value: "yes" } },
      { name: "existingLoans.bankName", label: "If Yes, Bank Name(s) (बैंक का नाम)", type: "text", placeholder: "Bank Name(s)", dependsOn: { field: "loanDetails.hasExistingLoans", value: "yes" } },
      { name: "existingLoans.outstandingAmount", label: "If Yes, Total Outstanding Amount (कुल बकाया राशि)", type: "number", placeholder: "Total outstanding amount", prefix: "₹", dependsOn: { field: "loanDetails.hasExistingLoans", value: "yes" } },
    ]
  },
  {
    title: "Upload Required Documents",
    subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.",
    fields: [
      { name: "documentUploads.panCard", label: "PAN Card", type: "file", colSpan: 2 },
      { name: "documentUploads.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
      { name: "documentUploads.photograph", label: "Passport Size Photograph", type: "file", colSpan: 2 },
      { name: "documentUploads.incomeProof", label: "Income Proof (Salary Slip / ITR)", type: "file", colSpan: 2 },
      { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6 Months)", type: "file", colSpan: 2 },
      { name: "documentUploads.employmentProof", label: "Employment/Business Proof", type: "file", colSpan: 2 },
      { name: "documentUploads.existingLoanStatement", label: "Existing Loan Statement (if any)", type: "file", colSpan: 2 },
    ]
  }
];


export function PersonalLoanApplicationForm({ setCurrentPage }: PersonalLoanApplicationFormProps) {
  const defaultValues: PersonalLoanApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '', residentialAddress: '' },
    employmentIncome: { 
      employmentType: undefined,
      companyName: '', 
      monthlyIncome: undefined,
      yearsInCurrentJobOrBusiness: undefined 
    },
    loanDetails: {
      loanAmountRequired: undefined,
      purposeOfLoan: undefined,
      otherPurposeOfLoan: '',
      loanTenureRequired: undefined,
      hasExistingLoans: "no",
    },
    existingLoans: {
      emiAmount: undefined,
      bankName: '',
      outstandingAmount: undefined,
    },
    documentUploads: {
      panCard: undefined,
      aadhaarCard: undefined,
      photograph: undefined,
      incomeProof: undefined,
      bankStatement: undefined,
      employmentProof: undefined,
      existingLoanStatement: undefined,
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
      submitAction={(data) => submitLoanApplicationAction(data, 'Personal Loan')}
      submitButtonText="Submit Personal Loan Application"
    />
  );
}
