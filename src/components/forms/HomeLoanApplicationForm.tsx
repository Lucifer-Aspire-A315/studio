
"use client";

import React from 'react';
import { Home as HomeIcon } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { HomeLoanApplicationSchema, type HomeLoanApplicationFormData } from '@/lib/schemas';
import type { SetPageView } from '@/app/page';

interface HomeLoanApplicationFormProps {
  setCurrentPage: SetPageView;
}

const homeLoanSections = [
  {
    title: "1. Applicant Information",
    subtitle: "व्यक्तिगत जानकारी",
    fields: [
      { name: "applicantDetails.name", label: "Full Name", type: "text" as const, placeholder: "Full Name" },
      { name: "applicantDetails.dob", label: "Date of Birth", type: "date" as const },
      { name: "applicantDetails.mobile", label: "Mobile Number", type: "tel" as const, placeholder: "10-digit mobile" },
      { name: "applicantDetails.email", label: "Email ID", type: "email" as const, placeholder: "example@mail.com" },
      { name: "applicantDetails.pan", label: "PAN Number", type: "text" as const, placeholder: "ABCDE1234F", isPAN: true },
      { name: "applicantDetails.aadhaar", label: "Aadhaar Number", type: "text" as const, placeholder: "123456789012", isAadhaar: true },
    ]
  },
  {
    title: "2. Address Details",
    subtitle: "पते की जानकारी",
    fields: [
      { name: "residentialAddress.fullAddress", label: "Current Residential Address", type: "text" as const, placeholder: "Enter your current full address", colSpan: 2 as const },
      { 
        name: "isPermanentAddressDifferent", 
        label: "Is Permanent Address different from Current Address?", 
        type: "radio" as const, 
        options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}], 
        colSpan: 2 as const 
      },
      { name: "permanentAddress.fullAddress", label: "Permanent Address (if different)", type: "text" as const, placeholder: "Enter your permanent full address", colSpan: 2 as const, dependsOn: { field: "isPermanentAddressDifferent", value: "yes" } },
    ]
  },
  {
    title: "3. Employment / Income Details",
    subtitle: "रोजगार और आय की जानकारी",
    fields: [
      { name: "employmentIncome.employmentType", label: "Occupation Type", type: "radio" as const, options: [{value: "salaried", label: "Salaried"}, {value: "self-employed", label: "Self-Employed / Business"}], colSpan: 2 as const},
      { name: "employmentIncome.companyName", label: "Company / Business Name", type: "text" as const, placeholder: "Company Name" },
      { name: "employmentIncome.monthlyIncome", label: "Monthly Income (₹)", type: "number" as const, placeholder: "e.g., 50000", prefix: "₹" },
      { name: "employmentIncome.yearsInCurrentJobOrBusiness", label: "Job/Business Duration (Years)", type: "number" as const, placeholder: "e.g., 3" },
    ]
  },
  {
    title: "4. Loan & Property Details",
    subtitle: "ऋण और संपत्ति की जानकारी",
    fields: [
      { name: "loanPropertyDetails.loanAmountRequired", label: "Loan Amount Required (₹)", type: "number" as const, placeholder: "e.g., 2500000", prefix: "₹" },
      { name: "loanPropertyDetails.loanTenureRequired", label: "Loan Tenure (in Years)", type: "number" as const, placeholder: "e.g., 20" },
      { name: "loanPropertyDetails.purposeOfLoan", label: "Purpose of Loan", type: "radio" as const, options: [
          {value: "purchase", label: "Home Purchase"},
          {value: "construction", label: "Construction"},
          {value: "renovation", label: "Home Renovation"},
          {value: "transfer", label: "Balance Transfer"}
        ], colSpan: 2 as const },
      { name: "loanPropertyDetails.propertyLocation", label: "Property Location (City/Area)", type: "text" as const, placeholder: "Location of property" },
      { name: "loanPropertyDetails.estimatedPropertyValue", label: "Estimated Property Value (₹)", type: "number" as const, placeholder: "e.g., 5000000", prefix: "₹" },
      { name: "loanPropertyDetails.propertyType", label: "Property Type", type: "radio" as const, options: [
          {value: "apartment", label: "Apartment"},
          {value: "independent_house", label: "Independent House"},
          {value: "plot_construction", label: "Plot + Construction"}
        ], colSpan: 2 as const },
    ]
  },
  {
    title: "5. Existing Loan Details",
    subtitle: "मौजूदा ऋण की जानकारी",
    fields: [
      { name: "hasExistingLoans", label: "Any Existing Loans?", type: "radio" as const, options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}], colSpan: 2 as const },
      { name: "existingLoans.bankName", label: "If Yes, Bank Name", type: "text" as const, placeholder: "Bank Name", dependsOn: { field: "hasExistingLoans", value: "yes" } },
      { name: "existingLoans.outstandingAmount", label: "If Yes, Outstanding Amount (₹)", type: "number" as const, placeholder: "Outstanding amount", prefix: "₹", dependsOn: { field: "hasExistingLoans", value: "yes" } },
      { name: "existingLoans.emiAmount", label: "If Yes, EMI Amount (₹)", type: "number" as const, placeholder: "EMI amount", prefix: "₹", dependsOn: { field: "hasExistingLoans", value: "yes" } },
    ]
  },
  {
    title: "6. Upload Required Documents",
    subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per file.",
    fields: [
      { name: "documentUploads.panCard", label: "PAN Card", type: "file" as const, colSpan: 2 as const },
      { name: "documentUploads.aadhaarCard", label: "Aadhaar Card", type: "file" as const, colSpan: 2 as const },
      { name: "documentUploads.photograph", label: "Passport Size Photograph", type: "file" as const, colSpan: 2 as const },
      { name: "documentUploads.incomeProof", label: "Income Proof (Salary Slip / ITR)", type: "file" as const, colSpan: 2 as const },
      { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6 Months)", type: "file" as const, colSpan: 2 as const },
      { name: "documentUploads.propertyDocs", label: "Property Documents / Sale Agreement", type: "file" as const, colSpan: 2 as const },
      { name: "documentUploads.allotmentLetter", label: "Allotment Letter (if any)", type: "file" as const, colSpan: 2 as const },
      { name: "documentUploads.employmentProof", label: "Employment/Business Proof", type: "file" as const, colSpan: 2 as const },
      { name: "documentUploads.existingLoanStatement", label: "Existing Loan Statement (if applicable)", type: "file" as const, colSpan: 2 as const },
    ]
  }
];

export function HomeLoanApplicationForm({ setCurrentPage }: HomeLoanApplicationFormProps) {
  const defaultValues: HomeLoanApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '' },
    residentialAddress: { fullAddress: '' },
    isPermanentAddressDifferent: "no", 
    permanentAddress: { fullAddress: '' }, 
    employmentIncome: {
      employmentType: undefined, 
      companyName: '',
      monthlyIncome: undefined,
      yearsInCurrentJobOrBusiness: undefined,
    },
    loanPropertyDetails: {
      loanAmountRequired: undefined,
      loanTenureRequired: undefined,
      purposeOfLoan: undefined,
      propertyLocation: '',
      estimatedPropertyValue: undefined, 
      propertyType: undefined,
    },
    hasExistingLoans: "no", 
    existingLoans: { 
      bankName: '',
      outstandingAmount: undefined, 
      emiAmount: undefined,
    },
    documentUploads: { 
        panCard: undefined,
        aadhaarCard: undefined,
        photograph: undefined,
        incomeProof: undefined,
        bankStatement: undefined,
        propertyDocs: undefined,
        allotmentLetter: undefined,
        employmentProof: undefined,
        existingLoanStatement: undefined,
    }
  };

  return (
    <GenericLoanForm
      setCurrentPage={setCurrentPage}
      formTitle="Home Loan Application Form"
      formSubtitle="Simple & Fast Home Loan Process. Transparent Terms, Minimum Documentation. 100% Digital & Safe."
      formIcon={<HomeIcon className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={HomeLoanApplicationSchema}
      defaultValues={defaultValues}
      sections={homeLoanSections}
      loanType="Home Loan"
    />
  );
}
