
"use client";

import React from 'react';
import { GstServiceApplicationSchema, type GstServiceApplicationFormData } from '@/lib/schemas';
import { ReceiptText } from 'lucide-react';
import type { SetPageView } from '@/app/page';
import { submitGstServiceApplicationAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface GstServiceApplicationFormProps {
  setCurrentPage: SetPageView;
}

const gstServiceSections = [
    {
        title: "Applicant Details",
        fields: [
            { name: "applicantDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
            { name: "applicantDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "applicantDetails.emailId", label: "Email ID", type: "email", placeholder: "example@mail.com", colSpan: 2 },
            { name: "applicantDetails.businessName", label: "Business Name (if any)", type: "text", placeholder: "Your Company Name" },
            { name: "applicantDetails.businessType", label: "Business Type", type: "radio", options: [
                { value: "proprietorship", label: "Proprietorship" },
                { value: "partnership", label: "Partnership" },
                { value: "pvt_ltd", label: "Pvt Ltd" },
                { value: "other", label: "Other" }
            ]},
            { name: "applicantDetails.otherBusinessTypeDetail", label: "Specify Other Business Type", type: "text", placeholder: "Specify type", dependsOn: { field: "applicantDetails.businessType", value: "other" } },
            { name: "applicantDetails.natureOfBusiness", label: "Nature of Business", type: "text", placeholder: "e.g., Manufacturing, Retail" },
            { name: "applicantDetails.stateAndCity", label: "State & City", type: "text", placeholder: "e.g., Maharashtra, Mumbai" },
        ]
    },
    {
        title: "GST Service Required",
        fields: [
            { name: "gstServiceRequired.newGstRegistration", label: "New GST Registration", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.gstReturnFiling", label: "GST Return Filing (Monthly/Quarterly)", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.gstCancellationAmendment", label: "GST Cancellation / Amendment", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.gstAudit", label: "GST Audit", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.gstNoticeHandling", label: "GST Notice Handling", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.otherGstService", label: "Other", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.otherGstServiceDetail", label: "Specify Other GST Service", type: "text", placeholder: "Details for other service", colSpan: 2, dependsOn: { field: "gstServiceRequired.otherGstService", value: true } },
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 5 MB per document.",
        fields: [
            { name: "documentUploads.panCard", label: "PAN Card of Applicant/Business", type: "file", colSpan: 2 },
            { name: "documentUploads.aadhaarCard", label: "Aadhaar Card of Proprietor/Director", type: "file", colSpan: 2 },
            { name: "documentUploads.passportPhoto", label: "Passport Size Photo (JPG/PNG)", type: "file", colSpan: 2 },
            { name: "documentUploads.businessProof", label: "Business Proof (e.g., Shop Act/License)", type: "file", colSpan: 2 },
            { name: "documentUploads.addressProof", label: "Electricity Bill / Rent Agreement (Address Proof)", type: "file", colSpan: 2 },
            { name: "documentUploads.bankDetails", label: "Cancelled Cheque or Bank Passbook (1st page)", type: "file", colSpan: 2 },
            { name: "documentUploads.digitalSignature", label: "Digital Signature (If available)", type: "file", colSpan: 2 },
        ]
    }
];

export function GstServiceApplicationForm({ setCurrentPage }: GstServiceApplicationFormProps) {
  const defaultValues: GstServiceApplicationFormData = {
    applicantDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      businessName: '',
      businessType: undefined,
      otherBusinessTypeDetail: '',
      natureOfBusiness: '',
      stateAndCity: '',
    },
    gstServiceRequired: {
      newGstRegistration: false,
      gstReturnFiling: false,
      gstCancellationAmendment: false,
      gstAudit: false,
      gstNoticeHandling: false,
      otherGstService: false,
      otherGstServiceDetail: '',
    },
    documentUploads: {
        panCard: undefined,
        aadhaarCard: undefined,
        passportPhoto: undefined,
        businessProof: undefined,
        addressProof: undefined,
        bankDetails: undefined,
        digitalSignature: undefined,
    }
  };

  return (
    <GenericCAServiceForm
      setCurrentPage={setCurrentPage}
      backPage="caServices"
      formTitle="GST Service Application Form"
      formSubtitle="Please fill in the details below to apply for GST related services."
      formIcon={<ReceiptText className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={GstServiceApplicationSchema}
      defaultValues={defaultValues}
      sections={gstServiceSections}
      submitAction={submitGstServiceApplicationAction}
    />
  );
}
