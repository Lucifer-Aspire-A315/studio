"use client";

import React from 'react';
import { FileText } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm'; // Reusing generic form structure
import { ITRFilingSchema, type ITRFilingFormData } from '@/lib/schemas';
import type { SetPageView } from '@/app/page';

interface ITRFilingFormProps {
  setCurrentPage: SetPageView;
}

const itrFilingSections = [
  {
    title: "1. Personal Information",
    subtitle: "व्यक्तिगत जानकारी",
    fields: [
      { name: "name", label: "Full Name (पूरा नाम)", type: "text", placeholder: "As per PAN" },
      { name: "pan", label: "PAN Number (पैन नंबर)", type: "text", placeholder: "ABCDE1234F", isPAN: true }, // Assuming PAN validation might be useful here too
      { name: "email", label: "Email ID (ईमेल आईडी)", type: "email", placeholder: "example@mail.com" },
      { name: "mobile", label: "Mobile Number (मोबाइल नंबर)", type: "tel", placeholder: "10-digit mobile" },
    ]
  },
  {
    title: "2. Filing Details",
    subtitle: "फाइलिंग की जानकारी",
    fields: [
      { name: "assessmentYear", label: "Assessment Year (निर्धारण वर्ष)", type: "text", placeholder: "e.g., 2023-24" },
      // Add more ITR specific fields here. For example:
      // { name: "filingType", label: "Filing Type", type: "radio", options: [{value: "original", label:"Original"}, {value: "revised", label:"Revised"}]},
      // { name: "incomeFromSalary", label: "Income from Salary", type: "number", prefix: "₹"},
      // { name: "otherIncome", label: "Other Income Sources", type: "number", prefix: "₹"},
    ]
  },
  // Section for document uploads could be added if needed.
  // The GenericLoanForm doesn't explicitly support file uploads yet.
];

export function ITRFilingForm({ setCurrentPage }: ITRFilingFormProps) {
  const defaultValues: ITRFilingFormData = {
    name: '',
    pan: '',
    email: '',
    mobile: '',
    assessmentYear: '',
  };

  return (
    <GenericLoanForm
      setCurrentPage={setCurrentPage}
      formTitle="ITR Filing Service"
      formSubtitle="आयकर रिटर्न फाइलिंग सेवा"
      formIcon={<FileText className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={ITRFilingSchema}
      defaultValues={defaultValues}
      sections={itrFilingSections}
      loanType="ITR Filing" // This is used for the submit button text
    />
  );
}
