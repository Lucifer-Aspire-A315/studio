"use client";

import React from 'react';
import { CreditCardIcon } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { CreditCardApplicationSchema, type CreditCardApplicationFormData } from '@/lib/schemas';
import type { SetPageView } from '@/app/page';

interface CreditCardApplicationFormProps {
  setCurrentPage: SetPageView;
}

const creditCardSections = [
  {
    title: "1. Personal Details",
    subtitle: "व्यक्तिगत जानकारी",
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
    title: "2. Residential Address",
    subtitle: "निवासी पता",
    fields: [
      { name: "residentialAddress.fullAddress", label: "Full Address (पूरा पता)", type: "text", placeholder: "Enter your full address", colSpan: 2 },
      { name: "residentialAddress.city", label: "City (शहर)", type: "text", placeholder: "City" },
      { name: "residentialAddress.state", label: "State (राज्य)", type: "text", placeholder: "State" },
      { name: "residentialAddress.pincode", label: "Pincode (पिन कोड)", type: "text", placeholder: "6-digit Pincode" },
    ]
  },
  {
    title: "3. Employment Details",
    subtitle: "रोजगार की जानकारी",
    fields: [
      { name: "employmentIncome.employmentType", label: "Employment Type (रोजगार का प्रकार)", type: "radio", options: [{value: "salaried", label: "Salaried"}, {value: "self-employed", label: "Self-Employed"}], colSpan: 2},
      { name: "employmentIncome.companyName", label: "Company Name (कंपनी का नाम)", type: "text", placeholder: "Company Name" },
      { name: "employmentIncome.monthlyIncome", label: "Monthly Income (मासिक आय)", type: "number", placeholder: "e.g., 50000", prefix: "₹" },
    ]
  },
];

export function CreditCardApplicationForm({ setCurrentPage }: CreditCardApplicationFormProps) {
  const defaultValues: CreditCardApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '' },
    residentialAddress: { fullAddress: '', city: '', state: '', pincode: '' },
    employmentIncome: { employmentType: 'salaried', occupation: '', companyName: '', monthlyIncome: undefined },
  };

  return (
    <GenericLoanForm
      setCurrentPage={setCurrentPage}
      formTitle="Credit Card Application"
      formSubtitle="क्रेडिट कार्ड आवेदन फॉर्म"
      formIcon={<CreditCardIcon className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={CreditCardApplicationSchema}
      defaultValues={defaultValues}
      sections={creditCardSections}
      loanType="Credit Card"
    />
  );
}
