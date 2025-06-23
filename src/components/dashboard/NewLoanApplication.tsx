
"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { Upload, X, FileText, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface NewLoanApplicationProps {
  onClose: () => void
}

const loanTypes = [
  { value: "personal", label: "Personal Loan", description: "For personal expenses, medical bills, travel" },
  { value: "home", label: "Home Loan", description: "For purchasing or constructing a house" },
  { value: "business", label: "Business Loan", description: "For business expansion and working capital" },
  { value: "vehicle", label: "Vehicle Loan", description: "For purchasing cars, bikes, commercial vehicles" },
  { value: "gold", label: "Gold Loan", description: "Loan against gold jewelry" },
  { value: "education", label: "Education Loan", description: "For higher education and skill development" },
]

const governmentSchemes = [
  { value: "pmmy", label: "Pradhan Mantri Mudra Yojana (PMMY)", description: "Up to ₹10 lakh for micro enterprises" },
  { value: "standup", label: "Stand-Up India", description: "₹10 lakh to ₹1 crore for SC/ST/Women entrepreneurs" },
  { value: "cgtmse", label: "CGTMSE Scheme", description: "Collateral-free loans up to ₹2 crore" },
  { value: "pmegp", label: "PM Employment Generation Programme", description: "₹25 lakh for manufacturing, ₹10 lakh for service" },
  { value: "msme", label: "MSME Loans", description: "Various schemes for Micro, Small & Medium Enterprises" },
  { value: "startup", label: "Startup India Scheme", description: "Support for innovative startups" },
  { value: "kisan", label: "PM Kisan Credit Card", description: "For agricultural and allied activities" },
  { value: "sbi_msme", label: "SBI MSME Loans", description: "Specialized MSME financing solutions" },
]

const requiredDocuments: Record<string, string[]> = {
  personal: ["Aadhaar Card", "PAN Card", "Salary Slips (3 months)", "Bank Statements (6 months)", "Employment Certificate"],
  home: ["Aadhaar Card", "PAN Card", "Income Proof", "Property Documents", "Bank Statements", "Employment Certificate"],
  business: ["Aadhaar Card", "PAN Card", "Business Registration", "ITR (2 years)", "Bank Statements", "Business Plan"],
  vehicle: ["Aadhaar Card", "PAN Card", "Income Proof", "Bank Statements", "Vehicle Quotation"],
  gold: ["Aadhaar Card", "PAN Card", "Gold Jewelry", "Income Proof"],
  education: ["Aadhaar Card", "PAN Card", "Admission Letter", "Fee Structure", "Income Proof", "Academic Records"],
}

export function NewLoanApplication({ onClose }: NewLoanApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()
  const { control, register, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        loanType: "",
        governmentScheme: "",
        loanAmount: "",
        employmentType: "",
        monthlyIncome: "",
        companyName: "",
        loanPurpose: "",
        uploadedDocuments: {} as Record<string, File>,
    }
  })

  const loanType = watch("loanType")
  const uploadedDocs = watch("uploadedDocuments", {})

  const documentsForLoan = useMemo(() => {
    return loanType ? requiredDocuments[loanType] || [] : []
  }, [loanType])
  
  const uploadedDocsCount = useMemo(() => Object.keys(uploadedDocs).filter(key => uploadedDocs[key]).length, [uploadedDocs]);

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const onSubmit = (data: any) => {
    console.log("Application submitted:", data)
    toast({
      title: "Application Submitted Successfully!",
      description: "The loan application has been logged to the console.",
    })
    onClose()
  }

  const handleSelectLoanType = (value: string) => {
      setValue("loanType", value);
      if (value !== 'business') {
          setValue('governmentScheme', '');
      }
  }

  const handleRemoveDocument = (docType: string) => {
      setValue(`uploadedDocuments.${docType}`, undefined as any, { shouldDirty: true });
  }

  const renderReviewValue = (value: any) => {
      if (typeof value === 'object' && value instanceof File) {
          return value.name;
      }
      return value || 'N/A';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">New Loan Application</h2>
            <p className="text-muted-foreground">Step {currentStep} of 4</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {/* Progress Bar */}
          <div className="px-6 py-4">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                    </div>
                  </div>
                  {index < 3 && <div className={cn("flex-1 h-1 transition-colors", step < currentStep ? "bg-primary" : "bg-muted")} />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span className={cn(currentStep === 1 && "font-semibold text-primary")}>Personal Info</span>
              <span className={cn(currentStep === 2 && "font-semibold text-primary")}>Loan Details</span>
              <span className={cn(currentStep === 3 && "font-semibold text-primary")}>Documents</span>
              <span className={cn(currentStep === 4 && "font-semibold text-primary")}>Review</span>
            </div>
          </div>

          <div className="p-6">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Please provide your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"> <Label htmlFor="firstName">First Name *</Label> <Input id="firstName" {...register("firstName")} placeholder="Enter first name" /> </div>
                    <div className="space-y-2"> <Label htmlFor="lastName">Last Name *</Label> <Input id="lastName" {...register("lastName")} placeholder="Enter last name" /> </div>
                    <div className="space-y-2"> <Label htmlFor="email">Email *</Label> <Input id="email" type="email" {...register("email")} placeholder="Enter email address" /> </div>
                    <div className="space-y-2"> <Label htmlFor="phone">Phone Number *</Label> <Input id="phone" {...register("phone")} placeholder="Enter phone number" /> </div>
                    <div className="space-y-2"> <Label htmlFor="dateOfBirth">Date of Birth *</Label> <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} /> </div>
                    <div className="space-y-2">
                        <Label>Gender *</Label>
                        <Controller name="gender" control={control} render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                <Label className="flex items-center space-x-2 font-normal"> <RadioGroupItem value="male" /> <span>Male</span> </Label>
                                <Label className="flex items-center space-x-2 font-normal"> <RadioGroupItem value="female" /> <span>Female</span> </Label>
                                <Label className="flex items-center space-x-2 font-normal"> <RadioGroupItem value="other" /> <span>Other</span> </Label>
                            </RadioGroup>
                        )} />
                    </div>
                  </div>
                  <div className="space-y-2"> <Label htmlFor="address">Address *</Label> <Textarea id="address" {...register("address")} placeholder="Enter complete address" /> </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"> <Label htmlFor="city">City *</Label> <Input id="city" {...register("city")} placeholder="Enter city" /> </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Controller name="state" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger> <SelectValue placeholder="Select state" /> </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                                    <SelectItem value="delhi">Delhi</SelectItem>
                                    <SelectItem value="gujarat">Gujarat</SelectItem>
                                    <SelectItem value="karnataka">Karnataka</SelectItem>
                                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                    <div className="space-y-2"> <Label htmlFor="pincode">Pincode *</Label> <Input id="pincode" {...register("pincode")} placeholder="Enter pincode" /> </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader> <CardTitle>Loan Information</CardTitle> <CardDescription>Select loan type and provide details</CardDescription> </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>Select Loan Type *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {loanTypes.map((loan) => (
                                <div key={loan.value} onClick={() => handleSelectLoanType(loan.value)} className={cn("p-4 border rounded-lg cursor-pointer transition-colors", loanType === loan.value ? "border-primary bg-primary/10" : "border-border")}>
                                    <h4 className="font-semibold">{loan.label}</h4> <p className="text-sm text-muted-foreground">{loan.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {loanType === "business" && (
                        <div className="space-y-4">
                            <Label>Government Business Loan Schemes</Label>
                            <Controller name="governmentScheme" control={control} render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-3">
                                {governmentSchemes.map((scheme) => (
                                    <Label key={scheme.value} className={cn("p-3 border rounded-lg cursor-pointer transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-50/50", field.value === scheme.value && "border-green-500 bg-green-50/50")}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h5 className="font-medium">{scheme.label}</h5>
                                                <p className="text-sm text-muted-foreground">{scheme.description}</p>
                                            </div>
                                            <RadioGroupItem value={scheme.value} className="sr-only" />
                                            <Badge variant="outline" className="bg-green-50 text-green-700">Govt. Scheme</Badge>
                                        </div>
                                    </Label>
                                ))}
                                </RadioGroup>
                            )} />
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"> <Label htmlFor="loanAmount">Loan Amount (₹) *</Label> <Input id="loanAmount" type="number" {...register("loanAmount")} placeholder="Enter loan amount" /> </div>
                        <div className="space-y-2">
                            <Label htmlFor="employmentType">Employment Type *</Label>
                            <Controller name="employmentType" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger> <SelectValue placeholder="Select employment type" /> </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="salaried">Salaried</SelectItem> <SelectItem value="self-employed">Self Employed</SelectItem> <SelectItem value="business">Business Owner</SelectItem> <SelectItem value="professional">Professional</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>
                        <div className="space-y-2"> <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label> <Input id="monthlyIncome" type="number" {...register("monthlyIncome")} placeholder="Enter monthly income" /> </div>
                        <div className="space-y-2"> <Label htmlFor="companyName">Company/Business Name</Label> <Input id="companyName" {...register("companyName")} placeholder="Enter company or business name" /> </div>
                    </div>
                    <div className="space-y-2"> <Label htmlFor="loanPurpose">Loan Purpose *</Label> <Textarea id="loanPurpose" {...register("loanPurpose")} placeholder="Describe the purpose of the loan" /> </div>
                </CardContent>
              </Card>
            )}
            
            {currentStep === 3 && (
                <Card>
                    <CardHeader> <CardTitle>Document Upload</CardTitle> <CardDescription>Upload required documents for your loan application</CardDescription> </CardHeader>
                    <CardContent className="space-y-6">
                        {!loanType ? (<p className="text-muted-foreground">Please select a loan type in the previous step to see required documents.</p>) : (
                        <div className="space-y-6">
                            <h4 className="font-semibold">Required Documents for {loanTypes.find((l) => l.value === loanType)?.label}:</h4>
                            <div className="space-y-4">
                                {documentsForLoan.map((docType, index) => {
                                    const fieldName = `uploadedDocuments.${docType}`;
                                    const uploadedFile = uploadedDocs[docType as keyof typeof uploadedDocs];
                                    return (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <Label htmlFor={`file-upload-${index}`} className="flex items-center space-x-2 cursor-pointer">
                                                <FileText className="h-5 w-5 text-primary" />
                                                <h5 className="font-medium">{docType} <span className="text-destructive">*</span></h5>
                                            </Label>
                                            <Badge variant="outline">Required</Badge>
                                        </div>
                                        <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition-colors">
                                            <Controller name={fieldName as any} control={control} render={({ field: { onChange } }) => (
                                                <div className="text-center">
                                                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                                    <p className="text-sm text-muted-foreground mb-2">Upload {docType}</p>
                                                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onChange(e.target.files?.[0])} className="hidden" id={`file-upload-${index}`} />
                                                    <Button size="sm" type="button" variant="outline" onClick={() => document.getElementById(`file-upload-${index}`)?.click()}>Choose File</Button>
                                                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                                                </div>
                                            )}/>
                                            {uploadedFile && (
                                                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                                                    <div className="flex items-center space-x-2 overflow-hidden">
                                                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                        <span className="text-sm text-green-800 truncate" title={uploadedFile.name}>{uploadedFile.name}</span>
                                                        <span className="text-xs text-green-600 flex-shrink-0">({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                    </div>
                                                    <Button size="sm" type="button" variant="ghost" onClick={() => handleRemoveDocument(docType)}> <X className="h-4 w-4" /> </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                            <div className="bg-primary/10 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-primary">Upload Progress</h5>
                                    <span className="text-sm text-primary/80">{uploadedDocsCount} of {documentsForLoan.length} documents uploaded</span>
                                </div>
                                <Progress value={(uploadedDocsCount / (documentsForLoan.length || 1)) * 100} className="h-2" />
                            </div>
                        </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {currentStep === 4 && (
                <Card>
                    <CardHeader> <CardTitle>Review Application</CardTitle> <CardDescription>Please review your application before submitting</CardDescription> </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-3">Personal Information</h4>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Name:</strong> {renderReviewValue(getValues("firstName"))} {renderReviewValue(getValues("lastName"))}</p>
                                    <p><strong>Email:</strong> {renderReviewValue(getValues("email"))}</p>
                                    <p><strong>Phone:</strong> {renderReviewValue(getValues("phone"))}</p>
                                    <p><strong>Address:</strong> {renderReviewValue(getValues("address"))}, {renderReviewValue(getValues("city"))}, {renderReviewValue(getValues("state"))} - {renderReviewValue(getValues("pincode"))}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3">Loan Information</h4>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Loan Type:</strong> {renderReviewValue(loanTypes.find(l => l.value === getValues("loanType"))?.label)}</p>
                                    <p><strong>Loan Amount:</strong> ₹{Number(getValues("loanAmount") || 0).toLocaleString()}</p>
                                    <p><strong>Monthly Income:</strong> ₹{Number(getValues("monthlyIncome") || 0).toLocaleString()}</p>
                                    <p><strong>Employment:</strong> {renderReviewValue(getValues("employmentType"))}</p>
                                    {getValues("governmentScheme") && <p><strong>Government Scheme:</strong> {renderReviewValue(governmentSchemes.find(s => s.value === getValues("governmentScheme"))?.label)}</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Uploaded Documents ({uploadedDocsCount})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {Object.entries(uploadedDocs).map(([key, file]) => file && (
                                    <div key={key} className="flex items-center space-x-2 text-sm">
                                        <FileText className="h-4 w-4 text-primary" />
                                        <span className="truncate">{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                            <h5 className="font-semibold text-primary mb-2">Important Notes:</h5>
                            <ul className="text-sm text-primary/80 space-y-1 list-disc list-inside">
                                <li>Your application will be reviewed within 24-48 hours</li>
                                <li>You will receive updates via email and SMS</li>
                                <li>Additional documents may be requested during processing</li>
                                <li>Loan approval is subject to credit verification and bank policies</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t p-6 flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentStep < 4 ? (
            <Button type="button" onClick={nextStep}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Submit Application <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
