
import { z } from 'zod';

// #region --- REUSABLE FILE & FIELD SCHEMAS ---

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_EXCEL_TYPES = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
const ACCEPTED_WORD_TYPES = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const aCCOUNTING_ACCEPTED_TYPES = [...ACCEPTED_DOCUMENT_TYPES, ...ACCEPTED_EXCEL_TYPES];
const ACCEPTED_BANK_STATEMENT_TYPES = [...ACCEPTED_DOCUMENT_TYPES, ...ACCEPTED_EXCEL_TYPES, ...ACCEPTED_WORD_TYPES];


const fileSchema = (types: string[]) => z.instanceof(File, { message: "File is required." })
  .refine(file => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(file => types.includes(file.type), `Unsupported file type.`)
  .optional()
  .nullable();

const stringOrFileSchema = (types: string[]) => z.union([
  z.string().url({ message: "Invalid URL." }).optional().nullable(),
  fileSchema(types)
]);

// #endregion

// #region --- REUSABLE FORM SECTION SCHEMAS ---

export const ApplicantDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  mobile: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  email: z.string().email("Invalid email address"),
  pan: z.string().regex(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/, "Invalid PAN format"),
  aadhaar: z.string().regex(/^\d{12}$/, "Invalid Aadhaar format (must be 12 digits)"),
});

export const EmploymentIncomeSchema = z.object({
  employmentType: z.enum(["salaried", "self-employed"], { required_error: "Occupation Type is required" }),
  companyName: z.string().min(1, "Company / Business Name is required"),
  monthlyIncome: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0, "Monthly income cannot be negative")
  ),
  yearsInCurrentJobOrBusiness: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0, "Years cannot be negative")
  ).optional(),
});

export const ExistingLoansSchema = z.object({
  bankName: z.string().optional(),
  outstandingAmount: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0)
  ).optional(),
  emiAmount: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0)
  ).optional(),
});
export type ExistingLoansFormData = z.infer<typeof ExistingLoansSchema>;

// #endregion

// #region --- HOME LOAN ---

const HomeLoanAddressDetailsSchema = z.object({
      residentialAddress: z.string().min(1, "Current residential address is required"),
      isPermanentAddressSame: z.enum(["yes", "no"], { required_error: "Please specify if your permanent address is the same." }),
      permanentAddress: z.string().optional(),
    }).superRefine((data, ctx) => {
      if (data.isPermanentAddressSame === "no" && (!data.permanentAddress || data.permanentAddress.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Permanent Address is required if different.",
          path: ["permanentAddress"]
        });
      }
});

const HomeLoanPropertyDetailsSchema = z.object({
  loanAmountRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan Amount Required is required")),
  loanTenureRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan Tenure is required (in years)")),
  purposeOfLoan: z.enum(["purchase", "construction", "renovation", "transfer"], { required_error: "Purpose of Loan is required" }),
  propertyLocation: z.string().min(1, "Property Location is required"),
  estimatedPropertyValue: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Estimated property value is required")),
  propertyType: z.enum(["apartment", "independent_house", "plot_construction"], { required_error: "Property Type is required" }),
  hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
});

const HomeLoanDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  photograph: stringOrFileSchema(ACCEPTED_IMAGE_TYPES),
  incomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  propertyDocs: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  allotmentLetter: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  employmentProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const HomeLoanApplicationSchema = z.object({
  applicantDetails: ApplicantDetailsSchema,
  addressDetails: HomeLoanAddressDetailsSchema,
  employmentIncome: EmploymentIncomeSchema,
  loanPropertyDetails: HomeLoanPropertyDetailsSchema,
  existingLoans: ExistingLoansSchema.optional(),
  documentUploads: HomeLoanDocumentUploadSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.loanPropertyDetails.hasExistingLoans === "yes") {
      const loanData = data.existingLoans;
      if (!loanData || loanData.emiAmount === undefined || loanData.emiAmount <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid EMI is required.", path: ["existingLoans", "emiAmount"] });
      }
      if (!loanData || !loanData.bankName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bank name is required.", path: ["existingLoans", "bankName"] });
      }
      if (!loanData || loanData.outstandingAmount === undefined || loanData.outstandingAmount < 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid outstanding amount is required.", path: ["existingLoans", "outstandingAmount"] });
      }
  }
});
export type HomeLoanApplicationFormData = z.infer<typeof HomeLoanApplicationSchema>;

// #endregion

// #region --- PERSONAL LOAN ---

const PersonalLoanApplicantDetailsSchema = ApplicantDetailsSchema.extend({
    residentialAddress: z.string().min(1, "Full address is required"),
});

const PersonalLoanDetailsSchema = z.object({
    loanAmountRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan amount is required")),
    purposeOfLoan: z.enum(["medical_emergency", "travel", "education", "wedding", "home_renovation", "other"], { required_error: "Purpose of Loan is required" }),
    otherPurposeOfLoan: z.string().optional(),
    loanTenureRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan tenure is required (in months)")),
    hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
  }).superRefine((data, ctx) => {
    if (data.purposeOfLoan === "other" && (!data.otherPurposeOfLoan || data.otherPurposeOfLoan.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other purpose of loan", path: ["otherPurposeOfLoan"] });
    }
});

const PersonalLoanDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  photograph: stringOrFileSchema(ACCEPTED_IMAGE_TYPES),
  incomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  employmentProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const PersonalLoanApplicationSchema = z.object({
  applicantDetails: PersonalLoanApplicantDetailsSchema,
  employmentIncome: EmploymentIncomeSchema,
  loanDetails: PersonalLoanDetailsSchema,
  existingLoans: ExistingLoansSchema.optional(),
  documentUploads: PersonalLoanDocumentUploadSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.loanDetails.hasExistingLoans === "yes") {
    const loanData = data.existingLoans;
    if (!loanData || loanData.emiAmount === undefined || loanData.emiAmount <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid EMI is required.", path: ["existingLoans", "emiAmount"] });
    }
    if (!loanData || !loanData.bankName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bank name is required.", path: ["existingLoans", "bankName"] });
    }
  }
});
export type PersonalLoanApplicationFormData = z.infer<typeof PersonalLoanApplicationSchema>;

// #endregion

// #region --- BUSINESS LOAN ---

const BusinessDetailsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.enum(["proprietorship", "partnership", "pvt_ltd", "other"], { required_error: "Business type is required" }),
  otherBusinessType: z.string().optional(),
  natureOfBusiness: z.string().min(1, "Nature of business is required"),
  businessStartYear: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1900, "Invalid year").max(new Date().getFullYear(), "Invalid year")),
  businessAddress: z.string().min(1, "Business address is required"),
  annualTurnover: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0, "Annual turnover cannot be negative")),
  profitAfterTax: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0, "Profit after tax cannot be negative")),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessType || data.otherBusinessType.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessType"] });
  }
});

const BusinessLoanDetailsSchema = z.object({
  loanAmountRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan amount is required")),
  loanTenureRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan tenure is required (in months)")),
  purposeOfLoan: z.enum(["working_capital", "machinery_purchase", "business_expansion", "other"], { required_error: "Purpose of loan is required" }),
  otherPurposeOfLoan: z.string().optional(),
  hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
}).superRefine((data, ctx) => {
  if (data.purposeOfLoan === "other" && (!data.otherPurposeOfLoan || data.otherPurposeOfLoan.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other purpose of loan", path: ["otherPurposeOfLoan"] });
  }
});

const BusinessLoanDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  applicantPhoto: stringOrFileSchema(ACCEPTED_IMAGE_TYPES),
  gstOrUdyamCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  businessProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  itrLast2Years: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  balanceSheetAndPL: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  machineryQuotation: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const BusinessLoanApplicationSchema = z.object({
  applicantDetails: ApplicantDetailsSchema,
  businessDetails: BusinessDetailsSchema,
  loanDetails: BusinessLoanDetailsSchema,
  existingLoans: ExistingLoansSchema.optional(),
  documentUploads: BusinessLoanDocumentUploadSchema.optional(),
}).superRefine((data, ctx) => {
    if (data.loanDetails.hasExistingLoans === "yes") {
        const loanData = data.existingLoans;
        if (!loanData || loanData.emiAmount === undefined || loanData.emiAmount <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid EMI is required.", path: ["existingLoans", "emiAmount"] });
        }
        if (!loanData || !loanData.bankName) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bank name is required.", path: ["existingLoans", "bankName"] });
        }
    }
});
export type BusinessLoanApplicationFormData = z.infer<typeof BusinessLoanApplicationSchema>;

// #endregion

// #region --- CREDIT CARD ---

const CreditCardApplicantDetailsSchema = ApplicantDetailsSchema.extend({
    residentialAddress: z.string().min(1, "Full address is required"),
    city: z.string().min(1, "City is required"),
    pincode: z.string().regex(/^\d{6}$/, "Invalid Pincode (must be 6 digits)"),
});

const CreditCardPreferencesSchema = z.object({
  preferredCardType: z.enum(["basic", "rewards", "travel", "business", "other"], { required_error: "Preferred card type is required" }),
  otherPreferredCardType: z.string().optional(),
  hasExistingCreditCard: z.enum(["yes", "no"], { required_error: "Specify if you have existing credit cards" }),
  existingCreditCardIssuer: z.string().optional(),
  existingCreditCardLimit: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
}).superRefine((data, ctx) => {
  if (data.preferredCardType === "other" && (!data.otherPreferredCardType || data.otherPreferredCardType.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other card type", path: ["otherPreferredCardType"] });
  }
  if (data.hasExistingCreditCard === "yes") {
    if (!data.existingCreditCardIssuer) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Issuer name is required", path: ["existingCreditCardIssuer"] });
    }
    if (data.existingCreditCardLimit === undefined || data.existingCreditCardLimit <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid credit limit is required", path: ["existingCreditCardLimit"] });
    }
  }
});

const CreditCardDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  photograph: stringOrFileSchema(ACCEPTED_IMAGE_TYPES),
  incomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  employmentProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  existingCreditCardStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const CreditCardApplicationSchema = z.object({
  applicantDetails: CreditCardApplicantDetailsSchema,
  employmentIncome: EmploymentIncomeSchema,
  creditCardPreferences: CreditCardPreferencesSchema,
  documentUploads: CreditCardDocumentUploadSchema.optional(),
});
export type CreditCardApplicationFormData = z.infer<typeof CreditCardApplicationSchema>;

// #endregion

// #region --- GOVERNMENT SCHEME LOAN ---

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
  yearsInBusiness: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0, "Years in business cannot be negative")),
  sector: z.enum(["manufacturing", "service", "trading"], { required_error: "Sector is required" }),
  loanPurpose: z.enum(["new_setup", "expansion", "working_capital"], { required_error: "Loan Purpose is required" }),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessType || data.otherBusinessType.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessType"] });
  }
});

export const GovernmentSchemeLoanDetailsSchema = z.object({
  selectedScheme: z.string().min(1, "Loan scheme is required"),
  otherSchemeName: z.string().optional(),
  loanAmountRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan Amount Required is required")),
  loanTenure: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan Tenure is required (in years)")),
});

export const GovernmentSchemeDocumentUploadSchema = z.object({
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  passportSizePhoto: stringOrFileSchema(ACCEPTED_IMAGE_TYPES),
  businessProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  casteCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  incomeCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  projectReport: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const GovernmentSchemeLoanApplicationSchema = z.object({
  applicantDetailsGov: GovernmentSchemeApplicantDetailsSchema,
  addressInformationGov: GovernmentSchemeAddressSchema,
  businessInformationGov: GovernmentSchemeBusinessInfoSchema,
  loanDetailsGov: GovernmentSchemeLoanDetailsSchema,
  documentUploadsGov: GovernmentSchemeDocumentUploadSchema.optional(),
});
export type GovernmentSchemeLoanApplicationFormData = z.infer<typeof GovernmentSchemeLoanApplicationSchema>;

// #endregion

// #region --- CA SERVICE SCHEMAS ---

// GST Service
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
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessTypeDetail"] });
  }
});

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
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other GST service details.", path: ["otherGstServiceDetail"] });
  }
  const { otherGstServiceDetail, ...services } = data;
  if (!Object.values(services).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one GST service must be selected.", path: ["newGstRegistration"] });
  }
});

export const GstDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  passportPhoto: stringOrFileSchema(ACCEPTED_IMAGE_TYPES),
  businessProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  addressProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  bankDetails: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  digitalSignature: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const GstServiceApplicationSchema = z.object({
  applicantDetails: GstApplicantDetailsSchema,
  gstServiceRequired: GstServiceRequiredSchema,
  documentUploads: GstDocumentUploadSchema.optional(),
});
export type GstServiceApplicationFormData = z.infer<typeof GstServiceApplicationSchema>;

// ITR Filing
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
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other income source details.", path: ["otherIncomeSourceDetail"] });
  }
  const { otherIncomeSourceDetail, ...sources } = data;
  if (!Object.values(sources).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one income source must be selected.", path: ["salariedEmployee"] });
  }
});

export const ItrDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  form16: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  salarySlips: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  investmentProofs: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  rentReceipts: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  capitalGainStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  businessIncomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const ItrFilingConsultationFormSchema = z.object({
  applicantDetails: ItrApplicantDetailsSchema,
  incomeSourceType: IncomeSourceTypeSchema,
  documentUploads: ItrDocumentUploadSchema.optional(),
});
export type ItrFilingConsultationFormData = z.infer<typeof ItrFilingConsultationFormSchema>;

// Accounting & Bookkeeping
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
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessTypeDetail"] });
  }
});

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
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other service details.", path: ["otherAccountingServiceDetail"] });
  }
  const { otherAccountingServiceDetail, ...services } = data;
  if (!Object.values(services).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one service must be selected.", path: ["bookkeeping"] });
  }
});

export const AccountingDocumentUploadSchema = z.object({
  panCardBusinessOwner: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  gstCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  previousYearFinancials: stringOrFileSchema(aCCOUNTING_ACCEPTED_TYPES).optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  invoices: stringOrFileSchema(aCCOUNTING_ACCEPTED_TYPES).optional(),
  payrollData: stringOrFileSchema(aCCOUNTING_ACCEPTED_TYPES).optional(),
  tdsTaxDetails: stringOrFileSchema(aCCOUNTING_ACCEPTED_TYPES).optional(),
  otherSupportingDocuments: stringOrFileSchema(aCCOUNTING_ACCEPTED_TYPES).optional(),
});

export const AccountingBookkeepingFormSchema = z.object({
  applicantDetails: AccountingApplicantDetailsSchema,
  servicesRequired: AccountingServicesRequiredSchema,
  documentUploads: AccountingDocumentUploadSchema.optional(),
});
export type AccountingBookkeepingFormData = z.infer<typeof AccountingBookkeepingFormSchema>;

// Company Incorporation
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
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other occupation", path: ["otherOccupationDetail"] });
  }
});

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
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other company type", path: ["otherCompanyTypeDetail"] });
  }
});

export const IncorporationDirectorsPartnersSchema = z.object({
  numberOfDirectorsPartners: z.enum(["1", "2", "3", "4+"], { required_error: "Number of Directors / Partners is required" }),
});

export const IncorporationDocumentUploadsSchema = z.object({
  directorPanCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  directorAadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  directorPhoto: stringOrFileSchema(ACCEPTED_IMAGE_TYPES),
  businessAddressProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  directorBankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  dsc: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const IncorporationOptionalServicesSchema = z.object({
  gstRegistration: z.boolean().optional().default(false),
  msmeRegistration: z.boolean().optional().default(false),
  trademarkFiling: z.boolean().optional().default(false),
  openBusinessBankAccount: z.boolean().optional().default(false),
  accountingTaxSetup: z.boolean().optional().default(false),
});

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

// Financial Advisory
export const FinancialAdvisoryApplicantDetailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  emailId: z.string().email("Invalid email address"),
  dob: z.string().min(1, "Date of Birth is required"),
  occupation: z.enum(["salaried", "business", "professional", "retired", "other"], { required_error: "Occupation is required" }),
  otherOccupationDetail: z.string().optional(),
  cityAndState: z.string().min(1, "City & State are required"),
  maritalStatus: z.enum(["single", "married"], { required_error: "Marital Status is required" }),
  dependentMembersAdults: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
  dependentMembersChildren: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
}).superRefine((data, ctx) => {
  if (data.occupation === "other" && (!data.otherOccupationDetail || data.otherOccupationDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other occupation", path: ["otherOccupationDetail"] });
  }
});

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
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other advisory service details.", path: ["otherAdvisoryServiceDetail"] });
  }
  const { otherAdvisoryServiceDetail, ...services } = data;
  if (!Object.values(services).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one advisory service must be selected.", path: ["taxSavingPlan"] });
  }
});

export const FinancialAdvisoryCurrentFinancialOverviewSchema = z.object({
  annualIncome: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
  monthlySavings: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
  currentInvestmentsAmount: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
  currentInvestmentsTypes: z.object({
    licInsurance: z.boolean().optional().default(false),
    ppfEpf: z.boolean().optional().default(false),
    mutualFunds: z.boolean().optional().default(false),
    fdRd: z.boolean().optional().default(false),
    realEstate: z.boolean().optional().default(false),
    none: z.boolean().optional().default(false),
  }).optional(),
});

export const FinancialAdvisoryDocumentUploadSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  salarySlipsIncomeProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  lastYearItrForm16: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  investmentProofs: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  existingLoanEmiDetails: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const FinancialAdvisoryFormSchema = z.object({
  applicantDetails: FinancialAdvisoryApplicantDetailsSchema,
  advisoryServicesRequired: FinancialAdvisoryServicesRequiredSchema,
  currentFinancialOverview: FinancialAdvisoryCurrentFinancialOverviewSchema,
  documentUploads: FinancialAdvisoryDocumentUploadSchema.optional(),
});
export type FinancialAdvisoryFormData = z.infer<typeof FinancialAdvisoryFormSchema>;

// Audit and Assurance
export const AuditAndAssuranceApplicantDetailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  emailId: z.string().email("Invalid email address"),
  businessName: z.string().min(1, "Business Name is required"),
  businessType: z.enum(["proprietorship", "partnership", "pvt_ltd", "llp", "other"], { required_error: "Business type is required" }),
  otherBusinessTypeDetail: z.string().optional(),
  annualTurnover: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0, "Annual turnover cannot be negative")),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessTypeDetail || data.otherBusinessTypeDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessTypeDetail"] });
  }
});

export const AuditAndAssuranceServicesRequiredSchema = z.object({
  statutoryAudit: z.boolean().optional().default(false),
  taxAudit: z.boolean().optional().default(false),
  internalAudit: z.boolean().optional().default(false),
  managementAudit: z.boolean().optional().default(false),
  stockAudit: z.boolean().optional().default(false),
  dueDiligence: z.boolean().optional().default(false),
  otherAuditService: z.boolean().optional().default(false),
  otherAuditServiceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherAuditService && (!data.otherAuditServiceDetail || data.otherAuditServiceDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other service details.", path: ["otherAuditServiceDetail"] });
  }
  const { otherAuditServiceDetail, ...services } = data;
  if (!Object.values(services).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one audit service must be selected.", path: ["statutoryAudit"] });
  }
});

export const AuditAndAssuranceDocumentUploadSchema = z.object({
  panCardBusiness: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  gstCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  lastFinancials: stringOrFileSchema(aCCOUNTING_ACCEPTED_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  existingAuditorDetails: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  otherSupportingDocs: stringOrFileSchema(aCCOUNTING_ACCEPTED_TYPES).optional(),
});

export const AuditAndAssuranceFormSchema = z.object({
  applicantDetails: AuditAndAssuranceApplicantDetailsSchema,
  servicesRequired: AuditAndAssuranceServicesRequiredSchema,
  documentUploads: AuditAndAssuranceDocumentUploadSchema.optional(),
});
export type AuditAndAssuranceFormData = z.infer<typeof AuditAndAssuranceFormSchema>;

// #endregion

// #region --- AUTHENTICATION SCHEMAS ---

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

export const PartnerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type PartnerLoginFormData = z.infer<typeof PartnerLoginSchema>;

export const UserSignUpSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type UserSignUpFormData = z.infer<typeof UserSignUpSchema>;

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type UserLoginFormData = z.infer<typeof UserLoginSchema>;

// #endregion
