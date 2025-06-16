
import { z } from 'zod';

// Helper for file validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_EXCEL_TYPES = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];


const fileSchema = (types: string[]) => z.instanceof(File, { message: "File is required." })
  .refine(file => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(file => types.includes(file.type), `Unsupported file type. Accepted: ${types.join(', ')}`)
  .optional()
  .nullable();

const stringOrFileSchema = (types: string[]) => z.union([
  z.string().url({ message: "Invalid URL." }).optional().nullable(),
  fileSchema(types)
]);


export const HomeLoanApplicantDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  mobile: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  email: z.string().email("Invalid email address"),
  pan: z.string().regex(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/, "Invalid PAN format"),
  aadhaar: z.string().regex(/^\d{12}$/, "Invalid Aadhaar format (must be 12 digits)"),
});

export const ResidentialAddressSchema = z.object({
  fullAddress: z.string().min(1, "Full address is required"),
});

export const EmploymentIncomeSchema = z.object({
  employmentType: z.enum(["salaried", "self-employed"], { required_error: "Occupation Type is required" }),
  occupation: z.string().min(1, "Occupation is required").optional(),
  companyName: z.string().min(1, "Company / Business Name is required"),
  monthlyIncome: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Monthly Income must be a number"}).min(0, "Monthly income cannot be negative")
  ),
  yearsInCurrentJobOrBusiness: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Years in job/business must be a number" }).min(0, "Years cannot be negative").optional()
  ),
});

export const LoanPropertyDetailsSchema = z.object({
  loanAmountRequired: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Loan amount must be a number"}).min(1, "Loan Amount Required is required")
  ),
  loanTenureRequired: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Loan tenure must be a number"}).min(1, "Loan Tenure is required (in years)")
  ),
  purposeOfLoan: z.enum(["purchase", "construction", "renovation", "transfer"], { required_error: "Purpose of Loan is required" }),
  propertyLocation: z.string().min(1, "Property Location is required"),
  estimatedPropertyValue: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Property value must be a number"}).min(1, "Estimated property value is required")
  ),
  propertyType: z.enum(["apartment", "independent_house", "plot_construction"], { required_error: "Property Type is required" }),
});

export const ExistingLoansSchema = z.object({
  bankName: z.string().optional(),
  outstandingAmount: z.preprocess(
    (val) => (val === "" ? undefined : (val === undefined ? undefined : Number(val))),
    z.number({ invalid_type_error: "Outstanding amount must be a number"}).min(0).optional()
  ),
  emiAmount: z.preprocess(
    (val) => (val === "" ? undefined : (val === undefined ? undefined : Number(val))),
    z.number({ invalid_type_error: "EMI amount must be a number"}).min(0).optional()
  ),
}).default({});

export const HomeLoanDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card"),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Aadhaar Card"),
  photograph: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).describe("Passport Size Photograph"),
  incomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Income Proof (Salary Slip / ITR)"),
  bankStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Bank Statement (Last 6 Months)"),
  propertyDocs: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Property Documents / Sale Agreement"),
  allotmentLetter: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Allotment Letter (if any)").optional(),
  employmentProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Employment/Business Proof"),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Existing Loan Statement (if applicable)").optional(),
});
export type HomeLoanDocumentUploadFormData = z.infer<typeof HomeLoanDocumentUploadSchema>;

export const HomeLoanApplicationSchema = z.object({
  applicantDetails: HomeLoanApplicantDetailsSchema,
  residentialAddress: ResidentialAddressSchema,
  isPermanentAddressDifferent: z.boolean().optional().default(false),
  permanentAddress: ResidentialAddressSchema.optional(),
  employmentIncome: EmploymentIncomeSchema,
  loanPropertyDetails: LoanPropertyDetailsSchema,
  hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
  existingLoans: ExistingLoansSchema.optional(),
  documentUploads: HomeLoanDocumentUploadSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.isPermanentAddressDifferent) {
    if (!data.permanentAddress || !data.permanentAddress.fullAddress || data.permanentAddress.fullAddress.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Permanent Address is required.",
        path: ["permanentAddress", "fullAddress"]
      });
    }
  }

  if (data.hasExistingLoans === "yes") {
    if (!data.existingLoans) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "EMI and Bank Name are required if you have existing loans.", path: ["existingLoans", "emiAmount"] });
    } else {
        if (data.existingLoans.emiAmount === undefined || data.existingLoans.emiAmount <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Valid EMI is required if existing loans is 'Yes'",
            path: ["existingLoans", "emiAmount"],
          });
        }
        if (!data.existingLoans.bankName || data.existingLoans.bankName.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Bank name is required if existing loans is 'Yes'",
            path: ["existingLoans", "bankName"],
          });
        }
    }
  }
});
export type HomeLoanApplicationFormData = z.infer<typeof HomeLoanApplicationSchema>;


// Personal Loan Schema
export const PersonalLoanDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card"),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Aadhaar Card"),
  photograph: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).describe("Passport Size Photograph"),
  incomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Income Proof (Salary Slip / ITR)"),
  bankStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Bank Statement (Last 6 Months)"),
  employmentProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Employment/Business Proof"),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Existing Loan Statement (if any)").optional(),
});
export type PersonalLoanDocumentUploadFormData = z.infer<typeof PersonalLoanDocumentUploadSchema>;

export const PersonalLoanApplicationSchema = z.object({
  applicantDetails: HomeLoanApplicantDetailsSchema,
  residentialAddress: ResidentialAddressSchema,
  employmentIncome: EmploymentIncomeSchema.omit({ occupation: true }),
  loanDetails: z.object({
    loanAmountRequired: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number({ invalid_type_error: "Loan amount must be a number"}).min(1, "Loan amount is required")
    ),
    purposeOfLoan: z.enum(["medical_emergency", "travel", "education", "wedding", "home_renovation", "other"], { required_error: "Purpose of Loan is required" }),
    otherPurposeOfLoan: z.string().optional(),
    loanTenureRequired: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number({ invalid_type_error: "Loan tenure must be a number"}).min(1, "Loan tenure is required (in months)")
    ),
    hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
  }),
  existingLoans: ExistingLoansSchema.optional(),
  documentUploads: PersonalLoanDocumentUploadSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.loanDetails.purposeOfLoan === "other" && (!data.loanDetails.otherPurposeOfLoan || data.loanDetails.otherPurposeOfLoan.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other purpose of loan",
      path: ["loanDetails", "otherPurposeOfLoan"],
    });
  }
  if (data.loanDetails.hasExistingLoans === "yes") {
    if (!data.existingLoans) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "EMI and Bank Name are required if you have existing loans.", path: ["existingLoans", "emiAmount"] });
    } else {
        if (data.existingLoans.emiAmount === undefined || data.existingLoans.emiAmount <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Valid EMI is required if existing loans is 'Yes'",
            path: ["existingLoans", "emiAmount"],
          });
        }
        if (!data.existingLoans.bankName || data.existingLoans.bankName.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Bank name is required if existing loans is 'Yes'",
            path: ["existingLoans", "bankName"],
          });
        }
    }
  }
});
export type PersonalLoanApplicationFormData = z.infer<typeof PersonalLoanApplicationSchema>;


// Business Loan Schema
const BusinessDetailsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.enum(["proprietorship", "partnership", "pvt_ltd", "other"], { required_error: "Business type is required" }),
  otherBusinessType: z.string().optional(),
  natureOfBusiness: z.string().min(1, "Nature of business is required"),
  businessStartYear: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({invalid_type_error: "Start year must be a number"}).min(1900, "Invalid year").max(new Date().getFullYear(), "Invalid year")
  ),
  businessAddress: z.string().min(1, "Business address is required"),
  annualTurnover: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({invalid_type_error: "Annual turnover must be a number"}).min(0, "Annual turnover cannot be negative")
  ),
  profitAfterTax: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({invalid_type_error: "Profit must be a number"}).min(0, "Profit after tax cannot be negative")
  ),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessType || data.otherBusinessType.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other business type",
      path: ["otherBusinessType"],
    });
  }
});

const LoanDetailsForBusinessSchema = z.object({
  loanAmountRequired: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({invalid_type_error: "Loan amount must be a number"}).min(1, "Loan amount is required")
  ),
  loanTenureRequired: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({invalid_type_error: "Loan tenure must be a number"}).min(1, "Loan tenure is required (in months)")
  ),
  purposeOfLoan: z.enum(["working_capital", "machinery_purchase", "business_expansion", "other"], { required_error: "Purpose of loan is required" }),
  otherPurposeOfLoan: z.string().optional(),
  hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
  existingLoanEMI: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({invalid_type_error: "EMI must be a number"}).min(0).optional()
  ),
  existingLoanBankName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.purposeOfLoan === "other" && (!data.otherPurposeOfLoan || data.otherPurposeOfLoan.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other purpose of loan",
      path: ["otherPurposeOfLoan"],
    });
  }
  if (data.hasExistingLoans === "yes") {
    if (data.existingLoanEMI === undefined || data.existingLoanEMI <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid EMI is required if existing loans is 'Yes'",
        path: ["existingLoanEMI"],
      });
    }
    if (!data.existingLoanBankName || data.existingLoanBankName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bank name is required if existing loans is 'Yes'",
        path: ["existingLoanBankName"],
      });
    }
  }
});

export const DocumentUploadDetailsSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card"),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Aadhaar Card"),
  applicantPhoto: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).describe("Passport Size Photo"),
  gstOrUdyamCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("GST Registration / Udyam Certificate").optional(),
  businessProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Shop Act / Business Proof"),
  bankStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Bank Statement (Last 6–12 Months)"),
  itrLast2Years: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("ITR for Last 2 Years"),
  balanceSheetAndPL: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Balance Sheet & Profit/Loss Statement"),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Existing Loan Statement (if applicable)").optional(),
  machineryQuotation: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Quotation (for Machinery Loan)").optional(),
});
export type DocumentUploadDetailsFormData = z.infer<typeof DocumentUploadDetailsSchema>;


export const BusinessLoanApplicationSchema = z.object({
  applicantDetails: HomeLoanApplicantDetailsSchema,
  businessDetails: BusinessDetailsSchema,
  loanDetails: LoanDetailsForBusinessSchema,
  documentUploadDetails: DocumentUploadDetailsSchema.optional(),
});
export type BusinessLoanApplicationFormData = z.infer<typeof BusinessLoanApplicationSchema>;


// Credit Card Schema
const CreditCardPreferencesSchema = z.object({
  preferredCardType: z.enum(["basic", "rewards", "travel", "business", "other"], { required_error: "Preferred card type is required" }),
  otherPreferredCardType: z.string().optional(),
  hasExistingCreditCard: z.enum(["yes", "no"], { required_error: "Specify if you have existing credit cards" }),
  existingCreditCardIssuer: z.string().optional(),
  existingCreditCardLimit: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Credit limit must be a number" }).min(0).optional()
  ),
}).superRefine((data, ctx) => {
  if (data.preferredCardType === "other" && (!data.otherPreferredCardType || data.otherPreferredCardType.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other card type",
      path: ["otherPreferredCardType"],
    });
  }
  if (data.hasExistingCreditCard === "yes") {
    if (!data.existingCreditCardIssuer || data.existingCreditCardIssuer.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Issuer name is required if you have an existing card",
        path: ["existingCreditCardIssuer"],
      });
    }
    if (data.existingCreditCardLimit === undefined || data.existingCreditCardLimit <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid credit limit is required if you have an existing card",
        path: ["existingCreditCardLimit"],
      });
    }
  }
});

const CreditCardDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card"),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Aadhaar Card"),
  photograph: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).describe("Passport Size Photo"),
  incomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Income Proof (Salary Slip / ITR)"),
  bankStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Bank Statement (Last 3–6 Months)"),
  employmentProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Employment/Business Proof"),
  existingCreditCardStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Existing Credit Card Statement (if any)").optional(),
});
export type CreditCardDocumentUploadFormData = z.infer<typeof CreditCardDocumentUploadSchema>;

export const CreditCardApplicationSchema = z.object({
  applicantDetails: HomeLoanApplicantDetailsSchema,
  residentialAddress: z.object({
    fullAddress: z.string().min(1, "Full address is required"),
    city: z.string().min(1, "City is required"),
    pincode: z.string().regex(/^\d{6}$/, "Invalid Pincode (must be 6 digits)"),
  }),
  employmentIncome: EmploymentIncomeSchema.omit({ occupation: true }),
  creditCardPreferences: CreditCardPreferencesSchema,
  documentUploads: CreditCardDocumentUploadSchema.optional(),
});
export type CreditCardApplicationFormData = z.infer<typeof CreditCardApplicationSchema>;


// Government Scheme Loan Schemas
export const GovernmentSchemeApplicantDetailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  fatherSpouseName: z.string().min(1, "Father's / Spouse's Name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  emailId: z.string().email("Invalid email address"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  category: z.enum(["general", "sc", "st", "obc"], { required_error: "Category is required" }),
  maritalStatus: z.enum(["single", "married"], { required_error: "Marital Status is required" }),
});

export const GovernmentSchemeAddressSchema = z.object({
  residentialAddress: z.string().min(1, "Residential Address is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid Pincode"),
});

export const GovernmentSchemeBusinessInfoSchema = z.object({
  businessName: z.string().optional(),
  businessType: z.enum(["proprietorship", "partnership", "other"], { required_error: "Type of Business is required" }),
  otherBusinessType: z.string().optional(),
  businessLocation: z.string().min(1, "Business Location is required"),
  yearsInBusiness: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Years in business must be a number" }).min(0, "Years in business cannot be negative")
  ),
  sector: z.enum(["manufacturing", "service", "trading"], { required_error: "Sector is required" }),
  loanPurpose: z.enum(["new_setup", "expansion", "working_capital"], { required_error: "Loan Purpose is required" }),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessType || data.otherBusinessType.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other business type",
      path: ["otherBusinessType"],
    });
  }
});

export const GovernmentSchemeLoanDetailsSchema = z.object({
  selectedScheme: z.string().min(1, "Loan scheme is required"),
  otherSchemeName: z.string().optional(),
  loanAmountRequired: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Loan amount must be a number" }).min(1, "Loan Amount Required is required")
  ),
  loanTenure: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Loan tenure must be a number" }).min(1, "Loan Tenure is required (in years)")
  ),
});

export const GovernmentSchemeDocumentUploadSchema = z.object({
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Aadhaar Card"),
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card"),
  passportSizePhoto: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).describe("Passport Size Photo"),
  businessProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Business Proof (Udyam / Registration)").optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Bank Statement (Last 6 Months)"),
  casteCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Caste Certificate (if applicable)").optional(),
  incomeCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Income Certificate").optional(),
  projectReport: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Project Report / Business Plan").optional(),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Existing Loan Statement (if any)").optional(),
});
export type GovernmentSchemeDocumentUploadFormData = z.infer<typeof GovernmentSchemeDocumentUploadSchema>;


export const GovernmentSchemeLoanApplicationSchema = z.object({
  applicantDetailsGov: GovernmentSchemeApplicantDetailsSchema,
  addressInformationGov: GovernmentSchemeAddressSchema,
  businessInformationGov: GovernmentSchemeBusinessInfoSchema,
  loanDetailsGov: GovernmentSchemeLoanDetailsSchema,
  documentUploadsGov: GovernmentSchemeDocumentUploadSchema.optional(),
});
export type GovernmentSchemeLoanApplicationFormData = z.infer<typeof GovernmentSchemeLoanApplicationSchema>;


// GST Service Application Schemas
export const GstApplicantDetailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  emailId: z.string().email("Invalid email address"),
  businessName: z.string().optional(),
  businessType: z.enum(["proprietorship", "partnership", "pvt_ltd", "other"], { required_error: "Business type is required" }),
  otherBusinessTypeDetail: z.string().optional(),
  natureOfBusiness: z.string().min(1, "Nature of Business is required"),
  stateAndCity: z.string().min(1, "State & City are required"),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessTypeDetail || data.otherBusinessTypeDetail.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other business type",
      path: ["otherBusinessTypeDetail"],
    });
  }
});
export type GstApplicantDetailsFormData = z.infer<typeof GstApplicantDetailsSchema>;

export const GstServiceRequiredSchema = z.object({
  newGstRegistration: z.boolean().optional().default(false),
  gstReturnFiling: z.boolean().optional().default(false),
  gstCancellationAmendment: z.boolean().optional().default(false),
  gstAudit: z.boolean().optional().default(false),
  gstNoticeHandling: z.boolean().optional().default(false),
  otherGstService: z.boolean().optional().default(false),
  otherGstServiceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherGstService && (!data.otherGstServiceDetail || data.otherGstServiceDetail.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other GST service details.",
      path: ["otherGstServiceDetail"],
    });
  }
  const { otherGstServiceDetail, ...services } = data;
  const oneSelected = Object.values(services).some(val => val === true);
  if (!oneSelected) {
    ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one GST service must be selected.",
        path: ["newGstRegistration"],
    });
  }
});
export type GstServiceRequiredFormData = z.infer<typeof GstServiceRequiredSchema>;

export const GstDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card of Applicant/Business"),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Aadhaar Card of Proprietor/Director"),
  passportPhoto: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).describe("Passport Size Photo (JPG/PNG)"),
  businessProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Business Proof (e.g., Shop Act/License)").optional(),
  addressProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Electricity Bill / Rent Agreement (Address Proof)"),
  bankDetails: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Cancelled Cheque or Bank Passbook (1st page)"),
  digitalSignature: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Digital Signature (If available)").optional(),
});
export type GstDocumentUploadFormData = z.infer<typeof GstDocumentUploadSchema>;

export const GstServiceApplicationSchema = z.object({
  applicantDetails: GstApplicantDetailsSchema,
  gstServiceRequired: GstServiceRequiredSchema,
  documentUploads: GstDocumentUploadSchema.optional(),
});
export type GstServiceApplicationFormData = z.infer<typeof GstServiceApplicationSchema>;

// ITR Filing & Consultation Schemas
export const ItrApplicantDetailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  emailId: z.string().email("Invalid email address"),
  dob: z.string().min(1, "Date of Birth is required"),
  panNumber: z.string().regex(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/, "Invalid PAN format"),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Invalid Aadhaar format (must be 12 digits)"),
  address: z.string().min(1, "Address is required"),
  cityAndState: z.string().min(1, "City & State are required"),
});
export type ItrApplicantDetailsFormData = z.infer<typeof ItrApplicantDetailsSchema>;

export const IncomeSourceTypeSchema = z.object({
  salariedEmployee: z.boolean().optional().default(false),
  businessIncome: z.boolean().optional().default(false),
  freelanceProfessional: z.boolean().optional().default(false),
  capitalGains: z.boolean().optional().default(false),
  housePropertyIncome: z.boolean().optional().default(false),
  otherIncomeSource: z.boolean().optional().default(false),
  otherIncomeSourceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherIncomeSource && (!data.otherIncomeSourceDetail || data.otherIncomeSourceDetail.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other income source details.",
      path: ["otherIncomeSourceDetail"],
    });
  }
  const { otherIncomeSourceDetail, ...sources } = data;
  const oneSelected = Object.values(sources).some(val => val === true);
  if (!oneSelected) {
    ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one income source must be selected.",
        path: ["salariedEmployee"],
    });
  }
});
export type IncomeSourceTypeFormData = z.infer<typeof IncomeSourceTypeSchema>;

export const ItrDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card"),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Aadhaar Card"),
  form16: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Form 16 (if Salaried)").optional(),
  salarySlips: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Salary Slips (if applicable)").optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Bank Statement (Full FY)"),
  investmentProofs: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Investment Proofs (LIC, PPF, 80C, etc.)").optional(),
  rentReceipts: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Rent Receipts / HRA Proofs").optional(),
  capitalGainStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Capital Gain Statement (if any)").optional(),
  businessIncomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Business Income Proof / ITR of Previous Year").optional(),
});
export type ItrDocumentUploadFormData = z.infer<typeof ItrDocumentUploadSchema>;

export const ItrFilingConsultationFormSchema = z.object({
  applicantDetails: ItrApplicantDetailsSchema,
  incomeSourceType: IncomeSourceTypeSchema,
  documentUploads: ItrDocumentUploadSchema.optional(),
});
export type ItrFilingConsultationFormData = z.infer<typeof ItrFilingConsultationFormSchema>;


// Accounting & Bookkeeping Service Schemas
export const AccountingApplicantDetailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  emailId: z.string().email("Invalid email address"),
  businessName: z.string().min(1, "Business Name is required"),
  businessType: z.enum(["proprietorship", "partnership", "pvt_ltd", "llp", "other"], { required_error: "Business type is required" }),
  otherBusinessTypeDetail: z.string().optional(),
  natureOfBusiness: z.string().min(1, "Nature of Business is required"),
  cityAndState: z.string().min(1, "City & State are required"),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessTypeDetail || data.otherBusinessTypeDetail.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other business type",
      path: ["otherBusinessTypeDetail"],
    });
  }
});
export type AccountingApplicantDetailsFormData = z.infer<typeof AccountingApplicantDetailsSchema>;

export const AccountingServicesRequiredSchema = z.object({
  bookkeeping: z.boolean().optional().default(false),
  ledgerMaintenance: z.boolean().optional().default(false),
  financialStatementPreparation: z.boolean().optional().default(false),
  tdsFiling: z.boolean().optional().default(false),
  gstReconciliationFiling: z.boolean().optional().default(false),
  payrollServices: z.boolean().optional().default(false),
  otherAccountingService: z.boolean().optional().default(false),
  otherAccountingServiceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherAccountingService && (!data.otherAccountingServiceDetail || data.otherAccountingServiceDetail.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other service details.",
      path: ["otherAccountingServiceDetail"],
    });
  }
  const { otherAccountingServiceDetail, ...services } = data;
  const oneSelected = Object.values(services).some(val => val === true);
  if (!oneSelected) {
    ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one service must be selected.",
        path: ["bookkeeping"],
    });
  }
});
export type AccountingServicesRequiredFormData = z.infer<typeof AccountingServicesRequiredSchema>;

const accountingExcelTypes = [...ACCEPTED_DOCUMENT_TYPES, ...ACCEPTED_EXCEL_TYPES];
export const AccountingDocumentUploadSchema = z.object({
  panCardBusinessOwner: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card of Business/Owner"),
  gstCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("GST Certificate (if available)").optional(),
  previousYearFinancials: stringOrFileSchema(accountingExcelTypes).describe("Previous Year Financial Statements").optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Bank Statement (Last 6–12 Months)"),
  invoices: stringOrFileSchema(accountingExcelTypes).describe("Invoices (Sales & Purchase - PDF/Excel)").optional(),
  payrollData: stringOrFileSchema(accountingExcelTypes).describe("Payroll Data (if applicable)").optional(),
  tdsTaxDetails: stringOrFileSchema(accountingExcelTypes).describe("TDS & Tax Details (if any)").optional(),
  otherSupportingDocuments: stringOrFileSchema(accountingExcelTypes).describe("Any Other Supporting Documents").optional(),
});
export type AccountingDocumentUploadFormData = z.infer<typeof AccountingDocumentUploadSchema>;

export const AccountingBookkeepingFormSchema = z.object({
  applicantDetails: AccountingApplicantDetailsSchema,
  servicesRequired: AccountingServicesRequiredSchema,
  documentUploads: AccountingDocumentUploadSchema.optional(),
});
export type AccountingBookkeepingFormData = z.infer<typeof AccountingBookkeepingFormSchema>;


// Company Incorporation Form Schemas
export const IncorporationApplicantFounderDetailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  emailId: z.string().email("Invalid email address"),
  dob: z.string().min(1, "Date of Birth is required"),
  occupation: z.enum(["business", "job", "student", "other"], { required_error: "Occupation is required" }),
  otherOccupationDetail: z.string().optional(),
  residentialAddress: z.string().min(1, "Residential Address is required"),
  cityAndState: z.string().min(1, "City & State are required"),
}).superRefine((data, ctx) => {
  if (data.occupation === "other" && (!data.otherOccupationDetail || data.otherOccupationDetail.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other occupation",
      path: ["otherOccupationDetail"],
    });
  }
});
export type IncorporationApplicantFounderDetailsFormData = z.infer<typeof IncorporationApplicantFounderDetailsSchema>;

export const IncorporationCompanyDetailsSchema = z.object({
  companyType: z.enum(["pvt_ltd", "llp", "opc", "partnership", "other"], { required_error: "Type of Company is required" }),
  otherCompanyTypeDetail: z.string().optional(),
  proposedCompanyName1: z.string().min(1, "At least one proposed company name is required"),
  proposedCompanyName2: z.string().optional(),
  proposedCompanyName3: z.string().optional(),
  businessActivity: z.string().min(1, "Business Activity / Nature of Work is required"),
  proposedBusinessAddress: z.string().min(1, "Proposed Business Address is required"),
}).superRefine((data, ctx) => {
  if (data.companyType === "other" && (!data.otherCompanyTypeDetail || data.otherCompanyTypeDetail.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other company type",
      path: ["otherCompanyTypeDetail"],
    });
  }
});
export type IncorporationCompanyDetailsFormData = z.infer<typeof IncorporationCompanyDetailsSchema>;

export const IncorporationDirectorsPartnersSchema = z.object({
  numberOfDirectorsPartners: z.enum(["1", "2", "3", "4+"], { required_error: "Number of Directors / Partners is required" }),
});
export type IncorporationDirectorsPartnersFormData = z.infer<typeof IncorporationDirectorsPartnersSchema>;

export const IncorporationDocumentUploadsSchema = z.object({
  directorPanCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card (for each director/partner)"),
  directorAadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Aadhaar Card (for each director/partner)"),
  directorPhoto: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).describe("Passport Size Photo (for each director/partner)"),
  businessAddressProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Electricity Bill / Rent Agreement (Business Address Proof)"),
  directorBankStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Bank Statement (Last 1 month, for each director/partner)"),
  dsc: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Digital Signature Certificate (DSC, if available, for each director)").optional(),
});
export type IncorporationDocumentUploadsFormData = z.infer<typeof IncorporationDocumentUploadsSchema>;

export const IncorporationOptionalServicesSchema = z.object({
  gstRegistration: z.boolean().optional().default(false),
  msmeRegistration: z.boolean().optional().default(false),
  trademarkFiling: z.boolean().optional().default(false),
  openBusinessBankAccount: z.boolean().optional().default(false),
  accountingTaxSetup: z.boolean().optional().default(false),
});
export type IncorporationOptionalServicesFormData = z.infer<typeof IncorporationOptionalServicesSchema>;

export const CompanyIncorporationFormSchema = z.object({
  applicantFounderDetails: IncorporationApplicantFounderDetailsSchema,
  companyDetails: IncorporationCompanyDetailsSchema,
  directorsPartners: IncorporationDirectorsPartnersSchema,
  documentUploads: IncorporationDocumentUploadsSchema.optional(),
  optionalServices: IncorporationOptionalServicesSchema.optional(),
  declaration: z.boolean().refine(val => val === true, {
    message: "You must accept the declaration to proceed."
  }),
});
export type CompanyIncorporationFormData = z.infer<typeof CompanyIncorporationFormSchema>;


// Financial Advisory Form Schemas
export const FinancialAdvisoryApplicantDetailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  emailId: z.string().email("Invalid email address"),
  dob: z.string().min(1, "Date of Birth is required"),
  occupation: z.enum(["salaried", "business", "professional", "retired", "other"], { required_error: "Occupation is required" }),
  otherOccupationDetail: z.string().optional(),
  cityAndState: z.string().min(1, "City & State are required"),
  maritalStatus: z.enum(["single", "married"], { required_error: "Marital Status is required" }),
  dependentMembersAdults: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0).optional()
  ),
  dependentMembersChildren: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0).optional()
  ),
}).superRefine((data, ctx) => {
  if (data.occupation === "other" && (!data.otherOccupationDetail || data.otherOccupationDetail.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other occupation",
      path: ["otherOccupationDetail"],
    });
  }
});
export type FinancialAdvisoryApplicantDetailsFormData = z.infer<typeof FinancialAdvisoryApplicantDetailsSchema>;

export const FinancialAdvisoryServicesRequiredSchema = z.object({
  taxSavingPlan: z.boolean().optional().default(false),
  investmentPlanning: z.boolean().optional().default(false),
  retirementPlanning: z.boolean().optional().default(false),
  insuranceAdvisory: z.boolean().optional().default(false),
  wealthManagement: z.boolean().optional().default(false),
  childEducationPlanning: z.boolean().optional().default(false),
  nriFinancialAdvisory: z.boolean().optional().default(false),
  otherAdvisoryService: z.boolean().optional().default(false),
  otherAdvisoryServiceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherAdvisoryService && (!data.otherAdvisoryServiceDetail || data.otherAdvisoryServiceDetail.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify other advisory service details.",
      path: ["otherAdvisoryServiceDetail"],
    });
  }
  const { otherAdvisoryServiceDetail, ...services } = data;
  const oneSelected = Object.values(services).some(val => val === true);
  if (!oneSelected) {
    ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one advisory service must be selected.",
        path: ["taxSavingPlan"],
    });
  }
});
export type FinancialAdvisoryServicesRequiredFormData = z.infer<typeof FinancialAdvisoryServicesRequiredSchema>;

export const FinancialAdvisoryCurrentFinancialOverviewSchema = z.object({
  annualIncome: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Annual income must be a number" }).min(0).optional()
  ),
  monthlySavings: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Monthly savings must be a number" }).min(0).optional()
  ),
  currentInvestmentsAmount: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Current investments amount must be a number" }).min(0).optional()
  ),
  currentInvestmentsTypes: z.object({
    licInsurance: z.boolean().optional().default(false),
    ppfEpf: z.boolean().optional().default(false),
    mutualFunds: z.boolean().optional().default(false),
    fdRd: z.boolean().optional().default(false),
    realEstate: z.boolean().optional().default(false),
    none: z.boolean().optional().default(false),
  }).optional(),
});
export type FinancialAdvisoryCurrentFinancialOverviewFormData = z.infer<typeof FinancialAdvisoryCurrentFinancialOverviewSchema>;

export const FinancialAdvisoryDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("PAN Card").optional(),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Aadhaar Card").optional(),
  salarySlipsIncomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Salary Slips / Income Proof").optional(),
  lastYearItrForm16: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Last Year’s ITR or Form 16").optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Bank Statement (3–6 Months)").optional(),
  investmentProofs: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Investment Proofs (Mutual Funds, LIC, etc.)").optional(),
  existingLoanEmiDetails: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).describe("Existing Loan / EMI Details (if any)").optional(),
});
export type FinancialAdvisoryDocumentUploadFormData = z.infer<typeof FinancialAdvisoryDocumentUploadSchema>;

export const FinancialAdvisoryFormSchema = z.object({
  applicantDetails: FinancialAdvisoryApplicantDetailsSchema,
  advisoryServicesRequired: FinancialAdvisoryServicesRequiredSchema,
  currentFinancialOverview: FinancialAdvisoryCurrentFinancialOverviewSchema,
  documentUploads: FinancialAdvisoryDocumentUploadSchema.optional(),
});
export type FinancialAdvisoryFormData = z.infer<typeof FinancialAdvisoryFormSchema>;

// Partner Sign Up Schema
export const PartnerSignUpSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type PartnerSignUpFormData = z.infer<typeof PartnerSignUpSchema>;

// Partner Login Schema
export const PartnerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type PartnerLoginFormData = z.infer<typeof PartnerLoginSchema>;

    