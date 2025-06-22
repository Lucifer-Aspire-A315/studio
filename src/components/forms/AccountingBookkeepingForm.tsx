
"use client";

import React from 'react';
import { AccountingBookkeepingFormSchema, type AccountingBookkeepingFormData } from '@/lib/schemas';
import { BookOpenCheck } from 'lucide-react';
import type { SetPageView } from '@/app/page';
import { submitAccountingBookkeepingAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface AccountingBookkeepingFormProps {
  setCurrentPage: SetPageView;
}

const accountingSections = [
    {
        title: "Applicant Details",
        fields: [
            { name: "applicantDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
            { name: "applicantDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "applicantDetails.emailId", label: "Email ID", type: "email", placeholder: "example@mail.com" },
            { name: "applicantDetails.businessName", label: "Business Name", type: "text", placeholder: "Your Company Name" },
            { name: "applicantDetails.businessType", label: "Business Type", type: "radio", options: [
                { value: "proprietorship", label: "Proprietorship" },
                { value: "partnership", label: "Partnership" },
                { value: "pvt_ltd", label: "Pvt Ltd" },
                { value: "llp", label: "LLP" },
                { value: "other", label: "Other" }
            ]},
            { name: "applicantDetails.otherBusinessTypeDetail", label: "Specify Other Business Type", type: "text", placeholder: "Specify type", dependsOn: { field: "applicantDetails.businessType", value: "other" } },
            { name: "applicantDetails.natureOfBusiness", label: "Nature of Business", type: "text", placeholder: "e.g., Manufacturing, Retail, Service" },
            { name: "applicantDetails.cityAndState", label: "City & State", type: "text", placeholder: "e.g., Mumbai, Maharashtra", colSpan: 2 },
        ]
    },
    {
        title: "Services Required",
        subtitle: "Select all that apply",
        fields: [
            { name: "servicesRequired.bookkeeping", label: "Bookkeeping (Monthly/Quarterly)", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.ledgerMaintenance", label: "Ledger & Journal Maintenance", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.financialStatementPreparation", label: "Profit & Loss, Balance Sheet Preparation", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.tdsFiling", label: "TDS Calculation & Filing", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.gstReconciliationFiling", label: "GST Reconciliation & Filing", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.payrollServices", label: "Payroll Services", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.otherAccountingService", label: "Other", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.otherAccountingServiceDetail", label: "Specify Other Service", type: "text", placeholder: "Details for other service", colSpan: 2, dependsOn: { field: "servicesRequired.otherAccountingService", value: true } },
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "Accepted File Types: PDF, Excel, JPG, PNG. Max File Size: 5 MB per document.",
        fields: [
            { name: "documentUploads.panCardBusinessOwner", label: "PAN Card of Business/Owner", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.gstCertificate", label: "GST Certificate (if available)", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.previousYearFinancials", label: "Previous Year Financial Statements", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6–12 Months)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.invoices", label: "Invoices (Sales & Purchase - PDF/Excel)", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.payrollData", label: "Payroll Data (if applicable)", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.tdsTaxDetails", label: "TDS & Tax Details (if any)", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.otherSupportingDocuments", label: "Any Other Supporting Documents", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
        ]
    }
];

export function AccountingBookkeepingForm({ setCurrentPage }: AccountingBookkeepingFormProps) {
  const defaultValues: AccountingBookkeepingFormData = {
    applicantDetails: {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      businessName: '',
      businessType: undefined,
      otherBusinessTypeDetail: '',
      natureOfBusiness: '',
      cityAndState: '',
    },
    servicesRequired: {
      bookkeeping: false,
      ledgerMaintenance: false,
      financialStatementPreparation: false,
      tdsFiling: false,
      gstReconciliationFiling: false,
      payrollServices: false,
      otherAccountingService: false,
      otherAccountingServiceDetail: '',
    },
    documentUploads: {
        panCardBusinessOwner: undefined,
        gstCertificate: undefined,
        previousYearFinancials: undefined,
        bankStatement: undefined,
        invoices: undefined,
        payrollData: undefined,
        tdsTaxDetails: undefined,
        otherSupportingDocuments: undefined,
    }
  };

  return (
    <GenericCAServiceForm
        setCurrentPage={setCurrentPage}
        backPage='caServices'
        formTitle="Accounting & Bookkeeping Service Application"
        formSubtitle="Please provide the details below to avail our services."
        formIcon={<BookOpenCheck className="w-12 h-12 mx-auto text-primary mb-2" />}
        schema={AccountingBookkeepingFormSchema}
        defaultValues={defaultValues}
        sections={accountingSections}
        submitAction={submitAccountingBookkeepingAction}
    />
  );
}
