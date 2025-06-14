"use client";

import React from 'react';
import { User } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { PersonalLoanApplicationSchema, type PersonalLoanApplicationFormData } from '@/lib/schemas';
import type { SetPageView } from '@/app/page';

interface PersonalLoanApplicationFormProps {
  setCurrentPage: SetPageView;
}

const personalLoanSections = [
  {
    title: "1. Applicant Details",
    subtitle: "आवेदक की जानकारी",
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
      { name: "residentialAddress.fullAddress", label: "Full Address (पूरा पता)", type: "text", placeholder: "Enter your full address", colSpan: 2 }, // Assuming Input can be textarea via asChild or similar, or use Textarea component. For simplicity, using text.
      { name: "residentialAddress.city", label: "City (शहर)", type: "text", placeholder: "City" },
      { name: "residentialAddress.state", label: "State (राज्य)", type: "text", placeholder: "State" },
      { name: "residentialAddress.pincode", label: "Pincode (पिन कोड)", type: "text", placeholder: "6-digit Pincode" },
    ]
  },
  {
    title: "3. Employment & Income Details",
    subtitle: "रोजगार और आय की जानकारी",
    fields: [
      { name: "employmentIncome.employmentType", label: "Employment Type (रोजगार का प्रकार)", type: "radio", options: [{value: "salaried", label: "Salaried"}, {value: "self-employed", label: "Self-Employed"}], colSpan: 2},
      { name: "employmentIncome.occupation", label: "Occupation/Designation (पद)", type: "text", placeholder: "e.g., Software Engineer"},
      { name: "employmentIncome.companyName", label: "Company Name (कंपनी का नाम)", type: "text", placeholder: "Company Name" },
      { name: "employmentIncome.monthlyIncome", label: "Monthly Income (मासिक आय)", type: "number", placeholder: "e.g., 50000", prefix: "₹" },
    ]
  },
   {
    title: "4. Loan Details",
    subtitle: "ऋण की जानकारी",
    fields: [
      { name: "loanDetails.loanAmountRequired", label: "Loan Amount Required", type: "number", placeholder: "e.g., 200000", prefix: "₹" },
      { name: "loanDetails.loanTenureRequired", label: "Loan Tenure (Years)", type: "number", placeholder: "e.g., 3" },
    ]
  },
];


export function PersonalLoanApplicationForm({ setCurrentPage }: PersonalLoanApplicationFormProps) {
  const defaultValues: PersonalLoanApplicationFormData = {
    applicantDetails: { name: '', dob: '', mobile: '', email: '', pan: '', aadhaar: '' },
    residentialAddress: { fullAddress: '', city: '', state: '', pincode: '' },
    employmentIncome: { employmentType: 'salaried', occupation: '', companyName: '', monthlyIncome: undefined },
    // existingLoans is optional so not explicitly set here
    // Omitting loanPropertyDetails as per simplified schema
  };


  return (
    <GenericLoanForm
      setCurrentPage={setCurrentPage}
      formTitle="Personal Loan Application"
      formSubtitle="व्यक्तिगत ऋण आवेदन फॉर्म"
      formIcon={<User className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={PersonalLoanApplicationSchema}
      defaultValues={defaultValues}
      sections={personalLoanSections}
      loanType="Personal Loan"
    />
  );
}
