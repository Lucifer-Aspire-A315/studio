
"use client";

import React from 'react';
import { Briefcase, UploadCloud } from 'lucide-react'; // Added UploadCloud
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
      { name: "businessDetails.businessName", label: "Business Name", type: "text", placeholder: "Your Company Name" },
      { name: "businessDetails.businessType", label: "Type of Business", type: "radio", options: [
          {value: "proprietorship", label: "Proprietorship"},
          {value: "partnership", label: "Partnership"},
          {value: "pvt_ltd", label: "Pvt. Ltd. Company"},
          {value: "other", label: "Other"}
        ], colSpan: 2 },
      { name: "businessDetails.otherBusinessType", label: "If Other, specify type (अन्य प्रकार निर्दिष्ट करें)", type: "text", placeholder: "Specify other type" },
      { name: "businessDetails.natureOfBusiness", label: "Nature of Business (कारोबार का प्रकार)", type: "text", placeholder: "e.g., Manufacturing, Retail" },
      { name: "businessDetails.businessStartYear", label: "Business Start Year (व्यवसाय शुरू होने का वर्ष)", type: "number", placeholder: "YYYY" },
      { name: "businessDetails.businessAddress", label: "Business Address", type: "text", placeholder: "Full business address", colSpan: 2 },
      { name: "businessDetails.annualTurnover", label: "Annual Turnover (₹)", type: "number", placeholder: "e.g., 5000000", prefix: "₹" },
      { name: "businessDetails.profitAfterTax", label: "Profit After Tax (कर के बाद लाभ)", type: "number", placeholder: "e.g., 500000", prefix: "₹" },
    ]
  },
  {
    title: "2. Applicant Details",
    subtitle: "आवेदक की जानकारी",
    fields: [
      { name: "applicantDetails.name", label: "Applicant Name", type: "text", placeholder: "Full Name" },
      { name: "applicantDetails.dob", label: "Date of Birth (जन्म तिथि)", type: "date" },
      { name: "applicantDetails.mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "applicantDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
      { name: "applicantDetails.pan", label: "PAN Number (पैन नंबर)", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "applicantDetails.aadhaar", label: "Aadhaar Number (आधार नंबर)", type: "text", placeholder: "123456789012", isAadhaar: true },
    ]
  },
  {
    title: "3. Loan Requirement",
    subtitle: "ऋण की आवश्यकता",
    fields: [
      { name: "loanDetails.loanAmountRequired", label: "Loan Amount Required (₹)", type: "number", placeholder: "e.g., 1000000", prefix: "₹" },
      { name: "loanDetails.loanTenureRequired", label: "Loan Tenure (in Months)", type: "number", placeholder: "e.g., 60" },
      { name: "loanDetails.purposeOfLoan", label: "Purpose of Loan", type: "radio", options: [
          {value: "working_capital", label: "Working Capital"},
          {value: "machinery_purchase", label: "Machinery"},
          {value: "business_expansion", label: "Business Expansion"},
          {value: "other", label: "Other"}
        ], colSpan: 2 },
      { name: "loanDetails.otherPurposeOfLoan", label: "If Other, specify purpose (अन्य उद्देश्य निर्दिष्ट करें)", type: "text", placeholder: "Specify other purpose" },
      { name: "loanDetails.hasExistingLoans", label: "Any Existing Loans? (क्या कोई वर्तमान लोन है?)", type: "radio", options: [{value: "yes", label: "Yes (हाँ)"}, {value: "no", label: "No (नहीं)"}], colSpan: 2 },
      { name: "loanDetails.existingLoanEMI", label: "If Yes, EMI (ईएमआई)", type: "number", placeholder: "EMI amount", prefix: "₹" },
      { name: "loanDetails.existingLoanBankName", label: "If Yes, Bank Name (बैंक का नाम)", type: "text", placeholder: "Bank Name" },
    ]
  },
  {
    title: "4. Upload Required Documents",
    subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per file.",
    fields: [
      { 
        name: "documentUploadDetails.panCard", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />PAN Card</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
      { 
        name: "documentUploadDetails.aadhaarCard", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />Aadhaar Card</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
      { 
        name: "documentUploadDetails.applicantPhoto", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />Passport Size Photo</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
      { 
        name: "documentUploadDetails.gstOrUdyamCertificate", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />GST Registration / Udyam Certificate</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
      { 
        name: "documentUploadDetails.businessProof", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />Shop Act / Business Proof</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
      { 
        name: "documentUploadDetails.bankStatement", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />Bank Statement (Last 6–12 Months)</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
      { 
        name: "documentUploadDetails.itrLast2Years", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />ITR for Last 2 Years</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
      { 
        name: "documentUploadDetails.balanceSheetAndPL", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />Balance Sheet & Profit/Loss Statement</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
      { 
        name: "documentUploadDetails.existingLoanStatement", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />Existing Loan Statement (if applicable)</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
      { 
        name: "documentUploadDetails.machineryQuotation", 
        label: <><UploadCloud className="w-4 h-4 mr-2 inline-block text-muted-foreground" />Quotation (for Machinery Loan)</>, 
        type: "text", 
        placeholder: "File name or 'Uploaded'", 
        colSpan: 2 
      },
    ]
  }
];

export function BusinessLoanApplicationForm({ setCurrentPage }: BusinessLoanApplicationFormProps) {
  const defaultValues: BusinessLoanApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '' },
    businessDetails: {
      businessName: '',
      businessType: undefined, 
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
      purposeOfLoan: undefined, 
      otherPurposeOfLoan: '',
      hasExistingLoans: undefined, 
      existingLoanEMI: undefined,
      existingLoanBankName: '',
    },
    documentUploadDetails: { 
        panCard: '',
        aadhaarCard: '',
        applicantPhoto: '',
        gstOrUdyamCertificate: '',
        businessProof: '',
        bankStatement: '',
        itrLast2Years: '',
        balanceSheetAndPL: '',
        existingLoanStatement: '',
        machineryQuotation: '',
    }
  };

  return (
    <GenericLoanForm
      setCurrentPage={setCurrentPage}
      formTitle="Business Loan Application Form"
      formSubtitle="Easy Application Process • Minimum Documentation • 100% Digital & Secure"
      formIcon={<Briefcase className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={BusinessLoanApplicationSchema}
      defaultValues={defaultValues}
      sections={businessLoanSections}
      loanType="Business Loan"
    />
  );
}
