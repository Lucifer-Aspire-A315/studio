
"use client";

import React from 'react';
import { ItrFilingConsultationFormSchema, type ItrFilingConsultationFormData } from '@/lib/schemas';
import { FileSpreadsheet } from 'lucide-react';
import type { SetPageView } from '@/app/page';
import { submitItrFilingConsultationAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface ItrFilingConsultationFormProps {
  setCurrentPage: SetPageView;
}

const itrFilingSections = [
    {
        title: "Applicant Details",
        fields: [
            { name: "applicantDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
            { name: "applicantDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "applicantDetails.emailId", label: "Email ID", type: "email", placeholder: "example@mail.com" },
            { name: "applicantDetails.dob", label: "Date of Birth", type: "date" },
            { name: "applicantDetails.panNumber", label: "PAN Number", type: "text", placeholder: "ABCDE1234F" },
            { name: "applicantDetails.aadhaarNumber", label: "Aadhaar Number", type: "text", placeholder: "123456789012" },
            { name: "applicantDetails.address", label: "Address", type: "textarea", placeholder: "Your full address", colSpan: 2 },
            { name: "applicantDetails.cityAndState", label: "City & State", type: "text", placeholder: "e.g., Mumbai, Maharashtra", colSpan: 2 },
        ]
    },
    {
        title: "Income Source Type",
        subtitle: "Select all that apply",
        fields: [
            { name: "incomeSourceType.salariedEmployee", label: "Salaried Employee", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.businessIncome", label: "Business Income", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.freelanceProfessional", label: "Freelance / Professional", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.capitalGains", label: "Capital Gains (Stocks, Property)", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.housePropertyIncome", label: "House Property Income", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.otherIncomeSource", label: "Other", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.otherIncomeSourceDetail", label: "Specify Other Income Source", type: "text", placeholder: "Details for other income source", colSpan: 2, dependsOn: { field: "incomeSourceType.otherIncomeSource", value: true } },
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.",
        fields: [
            { name: "documentUploads.panCard", label: "PAN Card", type: "file", colSpan: 2 },
            { name: "documentUploads.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
            { name: "documentUploads.form16", label: "Form 16 (if Salaried)", type: "file", colSpan: 2 },
            { name: "documentUploads.salarySlips", label: "Salary Slips (if applicable)", type: "file", colSpan: 2 },
            { name: "documentUploads.bankStatement", label: "Bank Statement (Full FY)", type: "file", colSpan: 2 },
            { name: "documentUploads.investmentProofs", label: "Investment Proofs (LIC, PPF, 80C, etc.)", type: "file", colSpan: 2 },
            { name: "documentUploads.rentReceipts", label: "Rent Receipts / HRA Proofs", type: "file", colSpan: 2 },
            { name: "documentUploads.capitalGainStatement", label: "Capital Gain Statement (if any)", type: "file", colSpan: 2 },
            { name: "documentUploads.businessIncomeProof", label: "Business Income Proof / ITR of Previous Year", type: "file", colSpan: 2 },
        ]
    }
];

export function ItrFilingConsultationForm({ setCurrentPage }: ItrFilingConsultationFormProps) {
  const defaultValues: ItrFilingConsultationFormData = {
    applicantDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      dob: '',
      panNumber: '',
      aadhaarNumber: '',
      address: '',
      cityAndState: '',
    },
    incomeSourceType: {
      salariedEmployee: false,
      businessIncome: false,
      freelanceProfessional: false,
      capitalGains: false,
      housePropertyIncome: false,
      otherIncomeSource: false,
      otherIncomeSourceDetail: '',
    },
    documentUploads: {
        panCard: undefined,
        aadhaarCard: undefined,
        form16: undefined,
        salarySlips: undefined,
        bankStatement: undefined,
        investmentProofs: undefined,
        rentReceipts: undefined,
        capitalGainStatement: undefined,
        businessIncomeProof: undefined,
    }
  };

  return (
    <GenericCAServiceForm
      setCurrentPage={setCurrentPage}
      backPage="caServices"
      formTitle="Income Tax Filing & Consultation Application"
      formSubtitle="Please provide the following details for ITR filing and consultation services."
      formIcon={<FileSpreadsheet className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={ItrFilingConsultationFormSchema}
      defaultValues={defaultValues}
      sections={itrFilingSections}
      submitAction={submitItrFilingConsultationAction}
    />
  );
}
