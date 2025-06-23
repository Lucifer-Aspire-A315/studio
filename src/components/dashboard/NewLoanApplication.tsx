
"use client"

import type React from "react"

import { useState } from "react"
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

interface NewLoanApplicationProps {
  onClose: () => void
}

export function NewLoanApplication({ onClose }: NewLoanApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    pincode: "",

    // Loan Information
    loanType: "",
    loanAmount: "",
    loanPurpose: "",
    employmentType: "",
    monthlyIncome: "",
    companyName: "",
    workExperience: "",

    // Government Scheme (for business loans)
    governmentScheme: "",
    businessType: "",
    businessAge: "",

    // Documents
    uploadedDocuments: [] as File[],
  })

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
    {
      value: "pmegp",
      label: "PM Employment Generation Programme",
      description: "₹25 lakh for manufacturing, ₹10 lakh for service",
    },
    { value: "msme", label: "MSME Loans", description: "Various schemes for Micro, Small & Medium Enterprises" },
    { value: "startup", label: "Startup India Scheme", description: "Support for innovative startups" },
    { value: "kisan", label: "PM Kisan Credit Card", description: "For agricultural and allied activities" },
    { value: "sbi_msme", label: "SBI MSME Loans", description: "Specialized MSME financing solutions" },
  ]

  const requiredDocuments = {
    personal: [
      "Aadhaar Card",
      "PAN Card",
      "Salary Slips (3 months)",
      "Bank Statements (6 months)",
      "Employment Certificate",
    ],
    home: [
      "Aadhaar Card",
      "PAN Card",
      "Income Proof",
      "Property Documents",
      "Bank Statements",
      "Employment Certificate",
    ],
    business: [
      "Aadhaar Card",
      "PAN Card",
      "Business Registration",
      "ITR (2 years)",
      "Bank Statements",
      "Business Plan",
    ],
    vehicle: ["Aadhaar Card", "PAN Card", "Income Proof", "Bank Statements", "Vehicle Quotation"],
    gold: ["Aadhaar Card", "PAN Card", "Gold Jewelry", "Income Proof"],
    education: ["Aadhaar Card", "PAN Card", "Admission Letter", "Fee Structure", "Income Proof", "Academic Records"],
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      uploadedDocuments: [...prev.uploadedDocuments, ...files],
    }))
  }

  const removeDocument = (documentType: string) => {
    setFormData((prev) => ({
      ...prev,
      uploadedDocuments: prev.uploadedDocuments.filter((file: any) => file.documentType !== documentType),
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const submitApplication = () => {
    // Handle form submission
    console.log("Application submitted:", formData)
    alert("Loan application submitted successfully!")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">New Loan Application</h2>
            <p className="text-gray-600">Step {currentStep} of 4</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {step < 4 && <div className={`w-16 h-1 ${step < currentStep ? "bg-blue-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Personal Info</span>
            <span>Loan Details</span>
            <span>Documents</span>
            <span>Review</span>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Please provide your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <RadioGroup value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Loan Details */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Loan Information</CardTitle>
                <CardDescription>Select loan type and provide details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Select Loan Type *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loanTypes.map((loan) => (
                      <div
                        key={loan.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.loanType === loan.value ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => handleInputChange("loanType", loan.value)}
                      >
                        <h4 className="font-semibold">{loan.label}</h4>
                        <p className="text-sm text-gray-600">{loan.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.loanType === "business" && (
                  <div className="space-y-4">
                    <Label>Government Business Loan Schemes</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {governmentSchemes.map((scheme) => (
                        <div
                          key={scheme.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.governmentScheme === scheme.value
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleInputChange("governmentScheme", scheme.value)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-medium">{scheme.label}</h5>
                              <p className="text-sm text-gray-600">{scheme.description}</p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Govt. Scheme
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                      placeholder="Enter loan amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type *</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) => handleInputChange("employmentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salaried">Salaried</SelectItem>
                        <SelectItem value="self-employed">Self Employed</SelectItem>
                        <SelectItem value="business">Business Owner</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                      placeholder="Enter monthly income"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company/Business Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="Enter company or business name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanPurpose">Loan Purpose *</Label>
                  <Textarea
                    id="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={(e) => handleInputChange("loanPurpose", e.target.value)}
                    placeholder="Describe the purpose of the loan"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>Upload required documents for your loan application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.loanType && (
                  <div className="space-y-6">
                    <h4 className="font-semibold">
                      Required Documents for {loanTypes.find((l) => l.value === formData.loanType)?.label}:
                    </h4>

                    {/* Individual Document Upload Sections */}
                    <div className="space-y-4">
                      {requiredDocuments[formData.loanType as keyof typeof requiredDocuments]?.map((docType, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-blue-500" />
                              <h5 className="font-medium">{docType}</h5>
                              <span className="text-red-500">*</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Required
                            </Badge>
                          </div>

                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-2">Upload {docType}</p>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    // Add document with type identifier
                                    const fileWithType = Object.assign(file, { documentType: docType })
                                    setFormData((prev) => ({
                                      ...prev,
                                      uploadedDocuments: [...prev.uploadedDocuments, fileWithType],
                                    }))
                                  }
                                }}
                                className="hidden"
                                id={`file-upload-${index}`}
                              />
                              <Button size="sm" variant="outline" asChild>
                                <label htmlFor={`file-upload-${index}`} className="cursor-pointer">
                                  Choose File
                                </label>
                              </Button>
                              <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                            </div>

                            {/* Show uploaded file for this document type */}
                            {(() => {
                              const uploadedFile = formData.uploadedDocuments.find(
                                (file: any) => file.documentType === docType,
                              )
                              if (uploadedFile) {
                                return (
                                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-sm text-green-800">{uploadedFile.name}</span>
                                      <span className="text-xs text-green-600">
                                        ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        removeDocument(docType)
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              }
                              return null
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Upload Progress Summary */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-blue-800">Upload Progress</h5>
                        <span className="text-sm text-blue-600">
                          {formData.uploadedDocuments.length} of{" "}
                          {requiredDocuments[formData.loanType as keyof typeof requiredDocuments]?.length || 0}{" "}
                          documents uploaded
                        </span>
                      </div>
                      <Progress
                        value={
                          (formData.uploadedDocuments.length /
                            (requiredDocuments[formData.loanType as keyof typeof requiredDocuments]?.length || 1)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Application</CardTitle>
                <CardDescription>Please review your application before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Name:</strong> {formData.firstName} {formData.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {formData.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {formData.phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} -{" "}
                        {formData.pincode}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Loan Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Loan Type:</strong> {loanTypes.find((l) => l.value === formData.loanType)?.label}
                      </p>
                      <p>
                        <strong>Loan Amount:</strong> ₹
                        {formData.loanAmount ? Number.parseInt(formData.loanAmount).toLocaleString() : ""}
                      </p>
                      <p>
                        <strong>Monthly Income:</strong> ₹
                        {formData.monthlyIncome ? Number.parseInt(formData.monthlyIncome).toLocaleString() : ""}
                      </p>
                      <p>
                        <strong>Employment:</strong> {formData.employmentType}
                      </p>
                      {formData.governmentScheme && (
                        <p>
                          <strong>Government Scheme:</strong>{" "}
                          {governmentSchemes.find((s) => s.value === formData.governmentScheme)?.label}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Uploaded Documents ({formData.uploadedDocuments.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {formData.uploadedDocuments.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Important Notes:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your application will be reviewed within 24-48 hours</li>
                    <li>• You will receive updates via email and SMS</li>
                    <li>• Additional documents may be requested during processing</li>
                    <li>• Loan approval is subject to credit verification and bank policies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submitApplication} className="bg-green-600 hover:bg-green-700">
                Submit Application
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
