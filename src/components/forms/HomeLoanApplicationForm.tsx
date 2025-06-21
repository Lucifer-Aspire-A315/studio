
"use client";

import React from 'react';
import { Home as HomeIcon } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { HomeLoanApplicationSchema, type HomeLoanApplicationFormData } from '@/lib/schemas';
import type { SetPageView } from '@/app/page';
import { submitLoanApplicationAction } from '@/app/actions/loanActions';

interface HomeLoanApplicationFormProps {
  setCurrentPage: SetPageView;
}

const homeLoanSections = [
  {
    title: "Applicant Information",
    subtitle: "व्यक्तिगत जानकारी",
    fields: [
      { name: "applicantDetails.name", label: "Full Name", type: "text", placeholder: "Full Name" },
      { name: "applicantDetails.dob", label: "Date of Birth", type: "date" },
      { name: "applicantDetails.mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "applicantDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
      { name: "applicantDetails.pan", label: "PAN Number", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "applicantDetails.aadhaar", label: "Aadhaar Number", type: "text", placeholder: "123456789012", isAadhaar: true },
    ]
  },
  {
    title: "Address Details",
    subtitle: "पते की जानकारी",
    fields: [
      { name: "addressDetails.residentialAddress", label: "Current Residential Address", type: "textarea", placeholder: "Enter your current full address", colSpan: 2 },
      { 
        name: "addressDetails.isPermanentAddressSame", 
        label: "Is Permanent Address same as Current Address?", 
        type: "radio", 
        options: [{value: "yes", label: "Yes"}, {value: "no", label: "No"}], 
        colSpan: 2
      },
      { name: "addressDetails.permanentAddress", label: "Permanent Address (if different)", type: "textarea", placeholder: "Enter your permanent full address", colSpan: 2, dependsOn: { field: "addressDetails.isPermanentAddressSame", value: "no" } },
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
    title: "Loan & Property Details",
    subtitle: "ऋण और संपत्ति की जानकारी",
    fields: [
      { name: "loanPropertyDetails.loanAmountRequired", label: "Loan Amount Required (₹)", type: "number", placeholder: "e.g., 2500000", prefix: "₹" },
      { name: "loanPropertyDetails.loanTenureRequired", label: "Loan Tenure (in Years)", type: "number", placeholder: "e.g., 20" },
      { name: "loanPropertyDetails.purposeOfLoan", label: "Purpose of Loan", type: "radio", options: [
          {value: "purchase", label: "Home Purchase"},
          {value: "construction", label: "Construction"},
          {value: "renovation", label: "Home Renovation"},
          {value: "transfer", label: "Balance Transfer"}
        ], colSpan: 2 },
      { name: "loanPropertyDetails.propertyLocation", label: "Property Location (City/Area)", type: "text", placeholder: "Location of property" },
      { name: "loanPropertyDetails.estimatedPropertyValue", label: "Estimated Property Value (₹)", type: "number", placeholder: "e.g., 5000000", prefix: "₹" },
      { name: "loanPropertyDetails.propertyType", label: "Property Type", type: "radio", options: [
          {value: "apartment", label: "Apartment"},
          {value: "independent_house", label: "Independent House"},
          {value: "plot_construction", label: "Plot + Construction"}
        ], colSpan: 2 },
      { name: "loanPropertyDetails.hasExistingLoans", label: "Any Existing Loans?", type: "radio", options: [{value: "yes", label: "Yes"}, {value: "no", label: "No"}], colSpan: 2 },
    ]
  },
  {
    title: "Existing Loan Details",
    subtitle: "मौजूदा ऋण की जानकारी",
    fields: [
      { name: "existingLoans.bankName", label: "If Yes, Bank Name", type: "text", placeholder: "Bank Name", dependsOn: { field: "loanPropertyDetails.hasExistingLoans", value: "yes" } },
      { name: "existingLoans.outstandingAmount", label: "If Yes, Outstanding Amount (₹)", type: "number", placeholder: "Outstanding amount", prefix: "₹", dependsOn: { field: "loanPropertyDetails.hasExistingLoans", value: "yes" } },
      { name: "existingLoans.emiAmount", label: "If Yes, EMI Amount (₹)", type: "number", placeholder: "EMI amount", prefix: "₹", dependsOn: { field: "loanPropertyDetails.hasExistingLoans", value: "yes" } },
    ]
  },
  {
    title: "Upload Required Documents",
    subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per file.",
    fields: [
      { name: "documentUploads.panCard", label: "PAN Card", type: "file", colSpan: 2 },
      { name: "documentUploads.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
      { name: "documentUploads.photograph", label: "Passport Size Photograph", type: "file", colSpan: 2 },
      { name: "documentUploads.incomeProof", label: "Income Proof (Salary Slip / ITR)", type: "file", colSpan: 2 },
      { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6 Months)", type: "file", colSpan: 2 },
      { name: "documentUploads.propertyDocs", label: "Property Documents / Sale Agreement", type: "file", colSpan: 2 },
      { name: "documentUploads.allotmentLetter", label: "Allotment Letter (if any)", type: "file", colSpan: 2 },
      { name: "documentUploads.employmentProof", label: "Employment/Business Proof", type: "file", colSpan: 2 },
      { name: "documentUploads.existingLoanStatement", label: "Existing Loan Statement (if applicable)", type: "file", colSpan: 2 },
    ]
  }
];

export function HomeLoanApplicationForm({ setCurrentPage }: HomeLoanApplicationFormProps) {
  const defaultValues: HomeLoanApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '' },
    addressDetails: {
      residentialAddress: '',
      isPermanentAddressSame: "yes",
      permanentAddress: '',
    },
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
      hasExistingLoans: "no", 
    },
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
      submitAction={(data) => submitLoanApplicationAction(data, 'Home Loan')}
      submitButtonText="Submit Home Loan Application"
    />
  );
}
