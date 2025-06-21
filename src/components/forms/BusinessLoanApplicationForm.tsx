
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
    title: "Business Details",
    subtitle: "व्यवसाय की जानकारी",
    fields: [
      { name: "businessDetails.businessName", label: "Business Name", type: "text", placeholder: "Your Company Name" },
      { name: "businessDetails.businessType", label: "Type of Business", type: "radio", options: [
          {value: "proprietorship", label: "Proprietorship"},
          {value: "partnership", label: "Partnership"},
          {value: "pvt_ltd", label: "Pvt. Ltd. Company"},
          {value: "other", label: "Other"}
        ], colSpan: 2 },
      { name: "businessDetails.otherBusinessType", label: "If Other, specify type (अन्य प्रकार निर्दिष्ट करें)", type: "text", placeholder: "Specify other type", dependsOn: { field: "businessDetails.businessType", value: "other"} },
      { name: "businessDetails.natureOfBusiness", label: "Nature of Business (कारोबार का प्रकार)", type: "text", placeholder: "e.g., Manufacturing, Retail" },
      { name: "businessDetails.businessStartYear", label: "Business Start Year (व्यवसाय शुरू होने का वर्ष)", type: "number", placeholder: "YYYY" },
      { name: "businessDetails.businessAddress", label: "Business Address", type: "text", placeholder: "Full business address", colSpan: 2 },
      { name: "businessDetails.annualTurnover", label: "Annual Turnover (₹)", type: "number", placeholder: "e.g., 5000000", prefix: "₹" },
      { name: "businessDetails.profitAfterTax", label: "Profit After Tax (कर के बाद लाभ)", type: "number", placeholder: "e.g., 500000", prefix: "₹" },
    ]
  },
  {
    title: "Applicant Details",
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
    title: "Loan Requirement",
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
      { name: "loanDetails.otherPurposeOfLoan", label: "If Other, specify purpose (अन्य उद्देश्य निर्दिष्ट करें)", type: "text", placeholder: "Specify other purpose", dependsOn: { field: "loanDetails.purposeOfLoan", value: "other" } },
      { name: "loanDetails.hasExistingLoans", label: "Any Existing Loans? (क्या कोई वर्तमान लोन है?)", type: "radio", options: [{value: "yes", label: "Yes (हाँ)"}, {value: "no", label: "No (नहीं)"}], colSpan: 2 },
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
    subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per file.",
    fields: [
      { name: "documentUploads.panCard", label: "PAN Card", type: "file", colSpan: 2 },
      { name: "documentUploads.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
      { name: "documentUploads.applicantPhoto", label: "Passport Size Photo", type: "file", colSpan: 2 },
      { name: "documentUploads.gstOrUdyamCertificate", label: "GST Registration / Udyam Certificate", type: "file", colSpan: 2 },
      { name: "documentUploads.businessProof", label: "Shop Act / Business Proof", type: "file", colSpan: 2 },
      { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6–12 Months)", type: "file", colSpan: 2 },
      { name: "documentUploads.itrLast2Years", label: "ITR for Last 2 Years", type: "file", colSpan: 2 },
      { name: "documentUploads.balanceSheetAndPL", label: "Balance Sheet & Profit/Loss Statement", type: "file", colSpan: 2 },
      { name: "documentUploads.existingLoanStatement", label: "Existing Loan Statement (if applicable)", type: "file", colSpan: 2 },
      { name: "documentUploads.machineryQuotation", label: "Quotation (for Machinery Loan)", type: "file", colSpan: 2 },
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
        applicantPhoto: undefined,
        gstOrUdyamCertificate: undefined,
        businessProof: undefined,
        bankStatement: undefined,
        itrLast2Years: undefined,
        balanceSheetAndPL: undefined,
        existingLoanStatement: undefined,
        machineryQuotation: undefined,
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
