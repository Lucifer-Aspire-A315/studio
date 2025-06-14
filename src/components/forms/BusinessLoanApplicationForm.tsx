
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
    title: "1. Business Details",
    subtitle: "व्यवसाय की जानकारी",
    fields: [
      { name: "businessDetails.businessName", label: "Business Name (बिज़नेस का नाम)", type: "text", placeholder: "Your Company Name" },
      { name: "businessDetails.businessType", label: "Type of Business (बिज़नेस का प्रकार)", type: "radio", options: [
          {value: "proprietorship", label: "Proprietorship (स्वामित्व)"},
          {value: "partnership", label: "Partnership (साझेदारी)"},
          {value: "pvt_ltd", label: "Pvt. Ltd. Company (प्रा. लि. कंपनी)"},
          {value: "other", label: "Others (अन्य)"}
        ], colSpan: 2 },
      { name: "businessDetails.otherBusinessType", label: "If Other, specify type (अन्य प्रकार निर्दिष्ट करें)", type: "text", placeholder: "Specify other type" },
      { name: "businessDetails.natureOfBusiness", label: "Nature of Business (कारोबार का प्रकार)", type: "text", placeholder: "e.g., Manufacturing, Retail" },
      { name: "businessDetails.businessStartYear", label: "Business Start Year (व्यवसाय शुरू होने का वर्ष)", type: "number", placeholder: "YYYY" },
      { name: "businessDetails.businessAddress", label: "Business Address (व्यवसाय का पता)", type: "text", placeholder: "Full business address", colSpan: 2 },
      { name: "businessDetails.annualTurnover", label: "Annual Turnover (वार्षिक टर्नओवर)", type: "number", placeholder: "e.g., 5000000", prefix: "₹" },
      { name: "businessDetails.profitAfterTax", label: "Profit After Tax (कर के बाद लाभ)", type: "number", placeholder: "e.g., 500000", prefix: "₹" },
    ]
  },
  {
    title: "2. Loan Details",
    subtitle: "ऋण की जानकारी",
    fields: [
      { name: "loanDetails.loanAmountRequired", label: "Required Loan Amount (आवश्यक लोन राशि)", type: "number", placeholder: "e.g., 1000000", prefix: "₹" },
      { name: "loanDetails.loanTenureRequired", label: "Preferred Tenure (लोन अवधि - Years)", type: "number", placeholder: "e.g., 5" },
      { name: "loanDetails.purposeOfLoan", label: "Purpose of Loan (लोन का उद्देश्य)", type: "radio", options: [
          {value: "working_capital", label: "Working Capital (कार्यशील पूंजी)"},
          {value: "machinery_purchase", label: "Machinery Purchase (मशीनरी खरीद)"},
          {value: "business_expansion", label: "Business Expansion (विस्तार)"},
          {value: "other", label: "Other (अन्य)"}
        ], colSpan: 2 },
      { name: "loanDetails.otherPurposeOfLoan", label: "If Other, specify purpose (अन्य उद्देश्य निर्दिष्ट करें)", type: "text", placeholder: "Specify other purpose" },
      { name: "loanDetails.hasExistingLoans", label: "Any Existing Loans? (क्या कोई वर्तमान लोन है?)", type: "radio", options: [{value: "yes", label: "Yes (हाँ)"}, {value: "no", label: "No (नहीं)"}], colSpan: 2 },
      { name: "loanDetails.existingLoanEMI", label: "If Yes, EMI (ईएमआई)", type: "number", placeholder: "EMI amount", prefix: "₹" },
      { name: "loanDetails.existingLoanBankName", label: "If Yes, Bank Name (बैंक का नाम)", type: "text", placeholder: "Bank Name" },
    ]
  },
  {
    title: "3. Applicant Details",
    subtitle: "आवेदक की जानकारी",
    fields: [
      { name: "applicantDetails.name", label: "Name of Applicant (आवेदक का नाम)", type: "text", placeholder: "Full Name" },
      { name: "applicantDetails.dob", label: "Date of Birth (जन्म तिथि)", type: "date" },
      { name: "applicantDetails.mobile", label: "Mobile Number (मोबाइल नंबर)", type: "tel", placeholder: "10-digit mobile" },
      { name: "applicantDetails.email", label: "Email ID (ईमेल आईडी)", type: "email", placeholder: "example@mail.com" },
      { name: "applicantDetails.pan", label: "PAN Number (पैन नंबर)", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "applicantDetails.aadhaar", label: "Aadhaar Number (आधार नंबर)", type: "text", placeholder: "123456789012", isAadhaar: true },
    ]
  },
];

export function BusinessLoanApplicationForm({ setCurrentPage }: BusinessLoanApplicationFormProps) {
  const defaultValues: BusinessLoanApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '' },
    businessDetails: {
      businessName: '',
      businessType: undefined, // Let zod default or user select
      otherBusinessType: '',
      natureOfBusiness: '',
      businessStartYear: undefined,
      businessAddress: '',
      annualTurnover: undefined,
      profitAfterTax: undefined,
    },
    loanDetails: {
      loanAmountRequired: undefined,
      loanTenureRequired: undefined,
      purposeOfLoan: undefined, // Let zod default or user select
      otherPurposeOfLoan: '',
      hasExistingLoans: undefined, // Let zod default or user select
      existingLoanEMI: undefined,
      existingLoanBankName: '',
    },
  };

  return (
    <GenericLoanForm
      setCurrentPage={setCurrentPage}
      formTitle="Business Loan Application"
      formSubtitle="व्यवसाय ऋण आवेदन फॉर्म"
      formIcon={<Briefcase className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={BusinessLoanApplicationSchema}
      defaultValues={defaultValues}
      sections={businessLoanSections}
      loanType="Business Loan"
    />
  );
}
