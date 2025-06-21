
"use client";

import React from 'react';
import { CompanyIncorporationFormSchema, type CompanyIncorporationFormData } from '@/lib/schemas';
import { Building2 } from 'lucide-react';
import type { SetPageView } from '@/app/page';
import { submitCompanyIncorporationAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface CompanyIncorporationFormProps {
  setCurrentPage: SetPageView;
}

const companyIncorporationSections = [
    {
        title: "Applicant / Founder Details",
        fields: [
            { name: "applicantFounderDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
            { name: "applicantFounderDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "applicantFounderDetails.emailId", label: "Email ID", type: "email", placeholder: "example@mail.com" },
            { name: "applicantFounderDetails.dob", label: "Date of Birth", type: "date" },
            { name: "applicantFounderDetails.occupation", label: "Occupation", type: "radio", colSpan: 2, options: [
                { value: "business", label: "Business" },
                { value: "job", label: "Job" },
                { value: "student", label: "Student" },
                { value: "other", label: "Other" }
            ]},
            { name: "applicantFounderDetails.otherOccupationDetail", label: "Specify Other Occupation", type: "text", placeholder: "Specify occupation", dependsOn: { field: "applicantFounderDetails.occupation", value: "other" } },
            { name: "applicantFounderDetails.residentialAddress", label: "Residential Address", type: "textarea", placeholder: "Your full residential address", colSpan: 2 },
            { name: "applicantFounderDetails.cityAndState", label: "City & State", type: "text", placeholder: "e.g., Mumbai, Maharashtra" },
        ]
    },
    {
        title: "Company Details",
        fields: [
            { name: "companyDetails.companyType", label: "Type of Company to Incorporate", type: "radio", colSpan: 2, options: [
                { value: "pvt_ltd", label: "Private Limited (Pvt Ltd)" },
                { value: "llp", label: "Limited Liability Partnership (LLP)" },
                { value: "opc", label: "One Person Company (OPC)" },
                { value: "partnership", label: "Partnership Firm" },
                { value: "other", label: "Other" }
            ]},
            { name: "companyDetails.otherCompanyTypeDetail", label: "Specify Other Company Type", type: "text", placeholder: "Specify type", dependsOn: { field: "companyDetails.companyType", value: "other" } },
            { name: "companyDetails.proposedCompanyName1", label: "Proposed Company Name 1", type: "text", placeholder: "Name preference 1" },
            { name: "companyDetails.proposedCompanyName2", label: "Proposed Company Name 2 (Optional)", type: "text", placeholder: "Name preference 2" },
            { name: "companyDetails.proposedCompanyName3", label: "Proposed Company Name 3 (Optional)", type: "text", placeholder: "Name preference 3" },
            { name: "companyDetails.businessActivity", label: "Business Activity / Nature of Work", type: "textarea", placeholder: "Describe your business activities", colSpan: 2 },
            { name: "companyDetails.proposedBusinessAddress", label: "Proposed Business Address", type: "textarea", placeholder: "Full proposed business address", colSpan: 2 },
        ]
    },
    {
        title: "Number of Directors / Partners",
        fields: [
            { name: "directorsPartners.numberOfDirectorsPartners", label: "Select Number", type: "radio", colSpan: 2, options: [
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4+", label: "4+" }
            ]},
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "For Each Director/Partner. Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.",
        fields: [
            { name: "documentUploads.directorPanCard", label: "PAN Card", type: "file", colSpan: 2 },
            { name: "documentUploads.directorAadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
            { name: "documentUploads.directorPhoto", label: "Passport Size Photo (JPG/PNG)", type: "file", colSpan: 2 },
            { name: "documentUploads.businessAddressProof", label: "Electricity Bill / Rent Agreement (Business Address Proof)", type: "file", colSpan: 2 },
            { name: "documentUploads.directorBankStatement", label: "Bank Statement (Last 1 month)", type: "file", colSpan: 2 },
            { name: "documentUploads.dsc", label: "Digital Signature Certificate (DSC, if available)", type: "file", colSpan: 2 },
        ]
    },
    {
        title: "Optional Services",
        subtitle: "Select if Needed",
        fields: [
            { name: "optionalServices.gstRegistration", label: "GST Registration", type: "checkbox", colSpan: 2 },
            { name: "optionalServices.msmeRegistration", label: "MSME Registration", type: "checkbox", colSpan: 2 },
            { name: "optionalServices.trademarkFiling", label: "Trademark Filing", type: "checkbox", colSpan: 2 },
            { name: "optionalServices.openBusinessBankAccount", label: "Opening Business Bank Account", type: "checkbox", colSpan: 2 },
            { name: "optionalServices.accountingTaxSetup", label: "Accounting & Tax Filing Setup", type: "checkbox", colSpan: 2 },
        ]
    },
    {
        title: "Declaration",
        fields: [
            { name: "declaration", label: "I hereby declare that the details and documents submitted are true and correct. I authorize RN Fintech to initiate the company registration process on my behalf.", type: "checkbox", colSpan: 2 },
        ]
    }
];

export function CompanyIncorporationForm({ setCurrentPage }: CompanyIncorporationFormProps) {
  const defaultValues: CompanyIncorporationFormData = {
    applicantFounderDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      dob: '',
      occupation: undefined,
      otherOccupationDetail: '',
      residentialAddress: '',
      cityAndState: '',
    },
    companyDetails: {
      companyType: undefined,
      otherCompanyTypeDetail: '',
      proposedCompanyName1: '',
      proposedCompanyName2: '',
      proposedCompanyName3: '',
      businessActivity: '',
      proposedBusinessAddress: '',
    },
    directorsPartners: {
      numberOfDirectorsPartners: undefined,
    },
    documentUploads: {
        directorPanCard: undefined,
        directorAadhaarCard: undefined,
        directorPhoto: undefined,
        businessAddressProof: undefined,
        directorBankStatement: undefined,
        dsc: undefined,
    },
    optionalServices: {
        gstRegistration: false,
        msmeRegistration: false,
        trademarkFiling: false,
        openBusinessBankAccount: false,
        accountingTaxSetup: false,
    },
    declaration: false,
  };

  return (
    <GenericCAServiceForm
        setCurrentPage={setCurrentPage}
        backPage='caServices'
        formTitle="Company Incorporation Application Form"
        formSubtitle="Please provide the details below to start your company registration process."
        formIcon={<Building2 className="w-12 h-12 mx-auto text-primary mb-2" />}
        schema={CompanyIncorporationFormSchema}
        defaultValues={defaultValues}
        sections={companyIncorporationSections}
        submitAction={submitCompanyIncorporationAction}
    />
  );
}
