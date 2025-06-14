"use client";

import React from 'react';
import { Briefcase } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { BusinessLoanApplicationSchema, type BusinessLoanApplicationFormData } from '@/lib/schemas';
import type { SetPageView } from '@/app/page';

interface BusinessLoanApplicationFormProps {
  setCurrentPage: SetPageView;
}

const businessLoanSections = [
    {
    title: "1. Applicant/Promoter Details",
    subtitle: "आवेदक/प्रमोटर की जानकारी",
    fields: [
      { name: "applicantDetails.name", label: "Name (नाम)", type: "text", placeholder: "Full Name" },
      { name: "applicantDetails.dob", label: "Date of Birth (जन्म तिथि)", type: "date" },
      { name: "applicantDetails.mobile", label: "Mobile Number (मोबाइल नंबर)", type: "tel", placeholder: "10-digit mobile" },
      { name: "applicantDetails.email", label: "Email ID (ईमेल आईडी)", type: "email", placeholder: "example@mail.com" },
      { name: "applicantDetails.pan", label: "PAN Number (पैन नंबर)", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "applicantDetails.aadhaar", label: "Aadhaar Number (आधार नंबर)", type: "text", placeholder: "123456789012", isAadhaar: true },
    ]
  },
  {
    title: "2. Business Details",
    subtitle: "व्यवसाय की जानकारी",
    fields: [
      { name: "businessDetails.companyName", label: "Company Name", type: "text", placeholder: "Your Company Name" },
      { name: "businessDetails.businessType", label: "Type of Business", type: "text", placeholder: "e.g., Proprietorship, Partnership, Pvt Ltd" },
      { name: "businessDetails.yearsInBusiness", label: "Years in Business", type: "number", placeholder: "e.g., 5" },
      { name: "businessDetails.annualTurnover", label: "Annual Turnover", type: "number", placeholder: "e.g., 5000000", prefix: "₹" },
    ]
  },
  {
    title: "3. Loan Requirement",
    subtitle: "ऋण आवश्यकताएँ",
    fields: [
      { name: "loanPropertyDetails.loanAmountRequired", label: "Loan Amount Required", type: "number", placeholder: "e.g., 1000000", prefix: "₹" },
      { name: "loanPropertyDetails.loanTenureRequired", label: "Loan Tenure (Years)", type: "number", placeholder: "e.g., 5" },
      { name: "loanPropertyDetails.purposeOfLoan", label: "Purpose of Loan", type: "radio", options: [ {value: "working_capital", label: "Working Capital"}, {value: "expansion", label: "Business Expansion"}, {value: "equipment", label: "Equipment Purchase"}, {value: "other", label: "Other"} ], colSpan: 2 },
    ]
  },
];

export function BusinessLoanApplicationForm({ setCurrentPage }: BusinessLoanApplicationFormProps) {
 const defaultValues: BusinessLoanApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '' },
    residentialAddress: { fullAddress: '', city: '', state: '', pincode: '' }, // Included as per schema, may need adjustment
    employmentIncome: { employmentType: 'self-employed', occupation: 'Business Owner', companyName: '', monthlyIncome: undefined }, // Adjusted for business context
    loanPropertyDetails: { loanAmountRequired: undefined, loanTenureRequired: undefined, purposeOfLoan: 'working_capital', propertyLocation: '', estimatedPropertyValue: undefined }, // property fields might be less relevant or different for business loans
    // businessDetails specific fields would be added to schema and defaultValues if a more distinct BusinessLoan schema is used.
  };
  return (
    <GenericLoanForm
      setCurrentPage={setCurrentPage}
      formTitle="Business Loan Application"
      formSubtitle="व्यवसाय ऋण आवेदन फॉर्म"
      formIcon={<Briefcase className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={BusinessLoanApplicationSchema} // Needs a more specific schema
      defaultValues={defaultValues} // Needs to match schema
      sections={businessLoanSections}
      loanType="Business Loan"
    />
  );
}
