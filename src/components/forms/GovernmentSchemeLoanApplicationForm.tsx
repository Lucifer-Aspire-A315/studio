
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GovernmentSchemeLoanApplicationSchema, type GovernmentSchemeLoanApplicationFormData } from '@/lib/schemas';
import { FileText } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import type { PageView, SetPageView } from '@/app/page';
import { submitGovernmentSchemeLoanApplicationAction } from '@/app/actions/governmentSchemeActions';

interface GovernmentSchemeLoanApplicationFormProps {
  setCurrentPage: SetPageView;
  selectedScheme: string;
  otherSchemeName?: string;
}

const schemeDisplayNames: Record<string, string> = {
  pmmy: "PM Mudra Yojana",
  pmegp: "PMEGP (Khadi Board)",
  standup: "Stand-Up India",
  other: "Other",
};

const governmentSchemeSections = [
  {
    title: "1. Applicant Details",
    fields: [
      { name: "applicantDetailsGov.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
      { name: "applicantDetailsGov.fatherSpouseName", label: "Father’s / Spouse’s Name", type: "text", placeholder: "Father's / Spouse's Name" },
      { name: "applicantDetailsGov.dob", label: "Date of Birth", type: "date" },
      { name: "applicantDetailsGov.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "applicantDetailsGov.emailId", label: "Email ID", type: "email", placeholder: "example@mail.com", colSpan: 2 },
      { name: "applicantDetailsGov.gender", label: "Gender", type: "radio", options: [{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}] },
      { name: "applicantDetailsGov.category", label: "Category", type: "radio", options: [{value: 'general', label: 'General'}, {value: 'sc', label: 'SC'}, {value: 'st', label: 'ST'}, {value: 'obc', label: 'OBC'}] },
      { name: "applicantDetailsGov.maritalStatus", label: "Marital Status", type: "radio", colSpan: 2, options: [{value: 'single', label: 'Single'}, {value: 'married', label: 'Married'}] },
    ]
  },
  {
    title: "2. Address Information",
    fields: [
      { name: "addressInformationGov.residentialAddress", label: "Residential Address", type: "textarea", placeholder: "Full Residential Address", colSpan: 2 },
      { name: "addressInformationGov.state", label: "State", type: "text", placeholder: "State" },
      { name: "addressInformationGov.district", label: "District", type: "text", placeholder: "District" },
      { name: "addressInformationGov.pincode", label: "Pincode", type: "text", placeholder: "6-digit Pincode" },
    ]
  },
  {
    title: "3. Business Information",
    fields: [
      { name: "businessInformationGov.businessName", label: "Business Name (if any)", type: "text", placeholder: "Your Business Name" },
      { name: "businessInformationGov.businessType", label: "Type of Business", type: "radio", options: [{value: 'proprietorship', label: 'Proprietorship'}, {value: 'partnership', label: 'Partnership'}, {value: 'other', label: 'Other'}] },
      { name: "businessInformationGov.otherBusinessType", label: "Specify Other Business Type", type: "text", placeholder: "Specify type", dependsOn: { field: "businessInformationGov.businessType", value: "other" } },
      { name: "businessInformationGov.businessLocation", label: "Business Location", type: "text", placeholder: "Location of business" },
      { name: "businessInformationGov.yearsInBusiness", label: "Years in Business", type: "number", placeholder: "e.g., 5" },
      { name: "businessInformationGov.sector", label: "Sector", type: "radio", options: [{value: 'manufacturing', label: 'Manufacturing'}, {value: 'service', label: 'Service'}, {value: 'trading', label: 'Trading'}] },
      { name: "businessInformationGov.loanPurpose", label: "Loan Purpose", type: "radio", colSpan: 2, options: [{value: 'new_setup', label: 'New Setup'}, {value: 'expansion', label: 'Expansion'}, {value: 'working_capital', label: 'Working Capital'}] },
    ]
  },
  {
    title: "4. Loan Details",
    fields: [
      { name: "loanDetailsGov.selectedScheme", label: "Selected Scheme", type: "text", disabled: true, colSpan: 2 },
      { name: "loanDetailsGov.otherSchemeName", label: "Specified Scheme Name", type: "text", disabled: true, dependsOn: { field: "loanDetailsGov.selectedScheme", value: "Other" }, colSpan: 2 },
      { name: "loanDetailsGov.loanAmountRequired", label: "Loan Amount Required (₹)", type: "number", placeholder: "e.g., 500000", prefix: '₹' },
      { name: "loanDetailsGov.loanTenure", label: "Loan Tenure (in Years)", type: "number", placeholder: "e.g., 5" },
    ]
  },
  {
    title: "5. Upload Required Documents",
    subtitle: "File types allowed: PDF, JPG, PNG. Max size: 5 MB per document.",
    fields: [
      { name: "documentUploadsGov.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
      { name: "documentUploadsGov.panCard", label: "PAN Card", type: "file", colSpan: 2 },
      { name: "documentUploadsGov.passportSizePhoto", label: "Passport Size Photo", type: "file", colSpan: 2 },
      { name: "documentUploadsGov.businessProof", label: "Business Proof (Udyam / Registration)", type: "file", colSpan: 2 },
      { name: "documentUploadsGov.bankStatement", label: "Bank Statement (Last 6 Months)", type: "file", colSpan: 2 },
      { name: "documentUploadsGov.casteCertificate", label: "Caste Certificate (if applicable)", type: "file", colSpan: 2 },
      { name: "documentUploadsGov.incomeCertificate", label: "Income Certificate", type: "file", colSpan: 2 },
      { name: "documentUploadsGov.projectReport", label: "Project Report / Business Plan", type: "file", colSpan: 2 },
      { name: "documentUploadsGov.existingLoanStatement", label: "Existing Loan Statement (if any)", type: "file", colSpan: 2 },
    ]
  }
];

export function GovernmentSchemeLoanApplicationForm({ setCurrentPage, selectedScheme, otherSchemeName }: GovernmentSchemeLoanApplicationFormProps) {

  const defaultValues: GovernmentSchemeLoanApplicationFormData = {
    applicantDetailsGov: {
      fullName: '',
      fatherSpouseName: '',
      dob: '',
      mobileNumber: '',
      emailId: '',
      gender: undefined,
      category: undefined,
      maritalStatus: undefined,
    },
    addressInformationGov: {
      residentialAddress: '',
      state: '',
      district: '',
      pincode: '',
    },
    businessInformationGov: {
      businessName: '',
      businessType: undefined,
      otherBusinessType: '',
      businessLocation: '',
      yearsInBusiness: undefined,
      sector: undefined,
      loanPurpose: undefined,
    },
    loanDetailsGov: {
      selectedScheme: schemeDisplayNames[selectedScheme] || selectedScheme,
      otherSchemeName: selectedScheme === 'other' ? otherSchemeName : '',
      loanAmountRequired: undefined,
      loanTenure: undefined,
    },
    documentUploadsGov: {
      aadhaarCard: undefined,
      panCard: undefined,
      passportSizePhoto: undefined,
      businessProof: undefined,
      bankStatement: undefined,
      casteCertificate: undefined,
      incomeCertificate: undefined,
      projectReport: undefined,
      existingLoanStatement: undefined,
    }
  };

  return (
     <GenericLoanForm
      setCurrentPage={setCurrentPage}
      backPage='governmentSchemes'
      formTitle="Government Scheme Loan Application Form"
      formSubtitle={`Applying for: ${defaultValues.loanDetailsGov.selectedScheme === 'Other' && otherSchemeName ? otherSchemeName : defaultValues.loanDetailsGov.selectedScheme}`}
      formIcon={<FileText className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={GovernmentSchemeLoanApplicationSchema}
      defaultValues={defaultValues}
      sections={governmentSchemeSections}
      submitAction={submitGovernmentSchemeLoanApplicationAction}
      submitButtonText="Submit Government Scheme Application"
    />
  );
}
