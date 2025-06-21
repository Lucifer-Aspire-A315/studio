
"use client";

import React from 'react';
import { FinancialAdvisoryFormSchema, type FinancialAdvisoryFormData } from '@/lib/schemas';
import { PiggyBank } from 'lucide-react';
import type { SetPageView } from '@/app/page';
import { submitFinancialAdvisoryAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface FinancialAdvisoryFormProps {
  setCurrentPage: SetPageView;
}

const financialAdvisorySections = [
    {
        title: "Applicant Details",
        fields: [
            { name: "applicantDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
            { name: "applicantDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "applicantDetails.emailId", label: "Email ID", type: "email", placeholder: "example@mail.com" },
            { name: "applicantDetails.dob", label: "Date of Birth", type: "date" },
            { name: "applicantDetails.occupation", label: "Occupation", type: "radio", colSpan: 2, options: [
                { value: "salaried", label: "Salaried" },
                { value: "business", label: "Business" },
                { value: "professional", label: "Professional" },
                { value: "retired", label: "Retired" },
                { value: "other", label: "Other" }
            ]},
            { name: "applicantDetails.otherOccupationDetail", label: "Specify Other Occupation", type: "text", placeholder: "Specify occupation", dependsOn: { field: "applicantDetails.occupation", value: "other" } },
            { name: "applicantDetails.cityAndState", label: "City & State", type: "text", placeholder: "e.g., Mumbai, Maharashtra" },
            { name: "applicantDetails.maritalStatus", label: "Marital Status", type: "radio", options: [{ value: "single", label: "Single" }, { value: "married", label: "Married" }] },
            { name: "applicantDetails.dependentMembersAdults", label: "Dependent Adults", type: "number", placeholder: "e.g., 2" },
            { name: "applicantDetails.dependentMembersChildren", label: "Dependent Children", type: "number", placeholder: "e.g., 1" },
        ]
    },
    {
        title: "Advisory Services Required",
        subtitle: "Select all that apply",
        fields: [
            { name: "advisoryServicesRequired.taxSavingPlan", label: "Tax Saving Plan (under 80C, 80D, etc.)", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.investmentPlanning", label: "Investment Planning (Mutual Funds, FD, PPF)", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.retirementPlanning", label: "Retirement Planning", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.insuranceAdvisory", label: "Insurance Advisory (Term / Health / Life)", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.wealthManagement", label: "Wealth Management", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.childEducationPlanning", label: "Child Education Planning", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.nriFinancialAdvisory", label: "NRI Financial Advisory", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.otherAdvisoryService", label: "Other", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.otherAdvisoryServiceDetail", label: "Specify Other Service", type: "text", placeholder: "Details for other service", colSpan: 2, dependsOn: { field: "advisoryServicesRequired.otherAdvisoryService", value: true } },
        ]
    },
    {
        title: "Current Financial Overview",
        fields: [
            { name: "currentFinancialOverview.annualIncome", label: "Annual Income (approx) (₹)", type: "number", placeholder: "e.g., 1200000" },
            { name: "currentFinancialOverview.monthlySavings", label: "Monthly Savings (avg) (₹)", type: "number", placeholder: "e.g., 25000" },
            { name: "currentFinancialOverview.currentInvestmentsAmount", label: "Current Investments (approx) (₹)", type: "number", placeholder: "e.g., 500000" },
            { name: "currentFinancialOverview.currentInvestmentsTypes.licInsurance", label: "LIC / Insurance", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.ppfEpf", label: "PPF / EPF", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.mutualFunds", label: "Mutual Funds", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.fdRd", label: "FD / RD", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.realEstate", label: "Real Estate", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.none", label: "None", type: "checkbox", colSpan: 1 },
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "Optional but Recommended. Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.",
        fields: [
            { name: "documentUploads.panCard", label: "PAN Card", type: "file", colSpan: 2 },
            { name: "documentUploads.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
            { name: "documentUploads.salarySlipsIncomeProof", label: "Salary Slips / Income Proof", type: "file", colSpan: 2 },
            { name: "documentUploads.lastYearItrForm16", label: "Last Year’s ITR or Form 16", type: "file", colSpan: 2 },
            { name: "documentUploads.bankStatement", label: "Bank Statement (3–6 Months)", type: "file", colSpan: 2 },
            { name: "documentUploads.investmentProofs", label: "Investment Proofs (Mutual Funds, LIC, etc.)", type: "file", colSpan: 2 },
            { name: "documentUploads.existingLoanEmiDetails", label: "Existing Loan / EMI Details (if any)", type: "file", colSpan: 2 },
        ]
    }
];

export function FinancialAdvisoryForm({ setCurrentPage }: FinancialAdvisoryFormProps) {
  const defaultValues: FinancialAdvisoryFormData = {
    applicantDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      dob: '',
      occupation: undefined,
      otherOccupationDetail: '',
      cityAndState: '',
      maritalStatus: undefined,
      dependentMembersAdults: undefined,
      dependentMembersChildren: undefined,
    },
    advisoryServicesRequired: {
      taxSavingPlan: false,
      investmentPlanning: false,
      retirementPlanning: false,
      insuranceAdvisory: false,
      wealthManagement: false,
      childEducationPlanning: false,
      nriFinancialAdvisory: false,
      otherAdvisoryService: false,
      otherAdvisoryServiceDetail: '',
    },
    currentFinancialOverview: {
      annualIncome: undefined,
      monthlySavings: undefined,
      currentInvestmentsAmount: undefined,
      currentInvestmentsTypes: {
        licInsurance: false,
        ppfEpf: false,
        mutualFunds: false,
        fdRd: false,
        realEstate: false,
        none: false,
      },
    },
    documentUploads: {
        panCard: undefined,
        aadhaarCard: undefined,
        salarySlipsIncomeProof: undefined,
        lastYearItrForm16: undefined,
        bankStatement: undefined,
        investmentProofs: undefined,
        existingLoanEmiDetails: undefined,
    }
  };

  return (
    <GenericCAServiceForm
        setCurrentPage={setCurrentPage}
        backPage='caServices'
        formTitle="Financial Advisory Service Application"
        formSubtitle="Please provide the details below to help us understand your financial needs."
        formIcon={<PiggyBank className="w-12 h-12 mx-auto text-primary mb-2" />}
        schema={FinancialAdvisoryFormSchema}
        defaultValues={defaultValues}
        sections={financialAdvisorySections}
        submitAction={submitFinancialAdvisoryAction}
    />
  );
}
