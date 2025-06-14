
import { z } from 'zod';

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
  panCard: z.string().optional().describe("PAN Card"),
  aadhaarCard: z.string().optional().describe("Aadhaar Card"),
  photograph: z.string().optional().describe("Passport Size Photograph"),
  incomeProof: z.string().optional().describe("Income Proof (Salary Slip / ITR)"),
  bankStatement: z.string().optional().describe("Bank Statement (Last 6 Months)"),
  propertyDocs: z.string().optional().describe("Property Documents / Sale Agreement"),
  allotmentLetter: z.string().optional().describe("Allotment Letter (if any)"),
  employmentProof: z.string().optional().describe("Employment/Business Proof"),
  existingLoanStatement: z.string().optional().describe("Existing Loan Statement (if applicable)"),
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
        if (data.existingLoans.emiAmount === undefined || data.existingLoans.emiAmount < 0) {
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
  panCard: z.string().optional().describe("PAN Card"),
  aadhaarCard: z.string().optional().describe("Aadhaar Card"),
  photograph: z.string().optional().describe("Passport Size Photograph"),
  incomeProof: z.string().optional().describe("Income Proof (Salary Slip / ITR)"),
  bankStatement: z.string().optional().describe("Bank Statement (Last 6 Months)"),
  employmentProof: z.string().optional().describe("Employment/Business Proof"),
  existingLoanStatement: z.string().optional().describe("Existing Loan Statement (if any)"),
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
        if (data.existingLoans.emiAmount === undefined || data.existingLoans.emiAmount < 0) {
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
    if (data.existingLoanEMI === undefined || data.existingLoanEMI < 0) {
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
  panCard: z.string().optional().describe("PAN Card"),
  aadhaarCard: z.string().optional().describe("Aadhaar Card"),
  applicantPhoto: z.string().optional().describe("Passport Size Photo"),
  gstOrUdyamCertificate: z.string().optional().describe("GST Registration / Udyam Certificate"),
  businessProof: z.string().optional().describe("Shop Act / Business Proof"),
  bankStatement: z.string().optional().describe("Bank Statement (Last 6–12 Months)"),
  itrLast2Years: z.string().optional().describe("ITR for Last 2 Years"),
  balanceSheetAndPL: z.string().optional().describe("Balance Sheet & Profit/Loss Statement"),
  existingLoanStatement: z.string().optional().describe("Existing Loan Statement (if applicable)"),
  machineryQuotation: z.string().optional().describe("Quotation (for Machinery Loan)"),
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
    if (data.existingCreditCardLimit === undefined || data.existingCreditCardLimit < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid credit limit is required if you have an existing card",
        path: ["existingCreditCardLimit"],
      });
    }
  }
});

const CreditCardDocumentUploadSchema = z.object({
  panCard: z.string().optional().describe("PAN Card"),
  aadhaarCard: z.string().optional().describe("Aadhaar Card"),
  photograph: z.string().optional().describe("Passport Size Photo"),
  incomeProof: z.string().optional().describe("Income Proof (Salary Slip / ITR)"),
  bankStatement: z.string().optional().describe("Bank Statement (Last 3–6 Months)"),
  employmentProof: z.string().optional().describe("Employment/Business Proof"),
  existingCreditCardStatement: z.string().optional().describe("Existing Credit Card Statement (if any)"),
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
  selectedScheme: z.string().min(1, "Loan scheme is required"), // This will be pre-filled
  otherSchemeName: z.string().optional(), // This will be pre-filled if "other" was chosen
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
  aadhaarCard: z.string().optional().describe("Aadhaar Card"),
  panCard: z.string().optional().describe("PAN Card"),
  passportSizePhoto: z.string().optional().describe("Passport Size Photo"),
  businessProof: z.string().optional().describe("Business Proof (Udyam / Registration)"),
  bankStatement: z.string().optional().describe("Bank Statement (Last 6 Months)"),
  casteCertificate: z.string().optional().describe("Caste Certificate (if applicable)"),
  incomeCertificate: z.string().optional().describe("Income Certificate"),
  projectReport: z.string().optional().describe("Project Report / Business Plan"),
  existingLoanStatement: z.string().optional().describe("Existing Loan Statement (if any)"),
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
