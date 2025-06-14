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
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode (must be 6 digits)"),
});

export const EmploymentIncomeSchema = z.object({
  employmentType: z.enum(["salaried", "self-employed"], { required_error: "Employment type is required" }),
  occupation: z.string().min(1, "Occupation is required"),
  companyName: z.string().min(1, "Company name is required"),
  monthlyIncome: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Monthly income must be a number"}).min(0, "Monthly income cannot be negative")
  ),
});

export const LoanPropertyDetailsSchema = z.object({
  loanAmountRequired: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Loan amount must be a number"}).min(1, "Loan amount is required")
  ),
  loanTenureRequired: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Loan tenure must be a number"}).min(1, "Loan tenure is required (in years)")
  ),
  purposeOfLoan: z.enum(["purchase", "construction", "renovation", "transfer"], { required_error: "Purpose of loan is required" }),
  propertyLocation: z.string().min(1, "Property location is required"),
  estimatedPropertyValue: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Property value must be a number"}).min(1, "Estimated property value is required")
  ),
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


export const HomeLoanApplicationSchema = z.object({
  applicantDetails: HomeLoanApplicantDetailsSchema,
  residentialAddress: ResidentialAddressSchema,
  employmentIncome: EmploymentIncomeSchema,
  loanPropertyDetails: LoanPropertyDetailsSchema,
  existingLoans: ExistingLoansSchema.optional(),
});

export type HomeLoanApplicationFormData = z.infer<typeof HomeLoanApplicationSchema>;

// Personal Loan Schema
export const PersonalLoanApplicationSchema = z.object({
  applicantDetails: HomeLoanApplicantDetailsSchema,
  residentialAddress: ResidentialAddressSchema,
  employmentIncome: EmploymentIncomeSchema,
  loanDetails: z.object({ // Simplified loan details for personal loan
    loanAmountRequired: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number({ invalid_type_error: "Loan amount must be a number"}).min(1, "Loan amount is required")
    ),
    loanTenureRequired: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number({ invalid_type_error: "Loan tenure must be a number"}).min(1, "Loan tenure is required (in years)")
    ),
  }),
  existingLoans: ExistingLoansSchema.optional(),
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
    z.number({invalid_type_error: "Loan tenure must be a number"}).min(1, "Loan tenure is required (in years)")
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
    if (data.existingLoanEMI === undefined || data.existingLoanEMI < 0) { // Check for undefined or negative
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

export const BusinessLoanApplicationSchema = z.object({
  applicantDetails: HomeLoanApplicantDetailsSchema,
  businessDetails: BusinessDetailsSchema,
  loanDetails: LoanDetailsForBusinessSchema,
});
export type BusinessLoanApplicationFormData = z.infer<typeof BusinessLoanApplicationSchema>;


// Credit Card Schema
export const CreditCardApplicationSchema = HomeLoanApplicationSchema.pick({ applicantDetails: true, residentialAddress: true, employmentIncome: true });
export type CreditCardApplicationFormData = z.infer<typeof CreditCardApplicationSchema>;


// ITR Filing Schema
export const ITRFilingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pan: z.string().regex(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/, "Invalid PAN format"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  assessmentYear: z.string().min(1, "Assessment year is required"),
});
export type ITRFilingFormData = z.infer<typeof ITRFilingSchema>;
