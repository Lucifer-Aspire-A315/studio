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

// Placeholder schemas for other forms
export const PersonalLoanApplicationSchema = HomeLoanApplicationSchema.omit({ loanPropertyDetails: true }); // Example simplification
export type PersonalLoanApplicationFormData = z.infer<typeof PersonalLoanApplicationSchema>;

export const BusinessLoanApplicationSchema = HomeLoanApplicationSchema; // Could be more complex
export type BusinessLoanApplicationFormData = z.infer<typeof BusinessLoanApplicationSchema>;

export const CreditCardApplicationSchema = HomeLoanApplicationSchema.pick({ applicantDetails: true, residentialAddress: true, employmentIncome: true }); // Example simplification
export type CreditCardApplicationFormData = z.infer<typeof CreditCardApplicationSchema>;

export const ITRFilingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pan: z.string().regex(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/, "Invalid PAN format"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  assessmentYear: z.string().min(1, "Assessment year is required"),
  // Add more ITR specific fields as needed
});
export type ITRFilingFormData = z.infer<typeof ITRFilingSchema>;

