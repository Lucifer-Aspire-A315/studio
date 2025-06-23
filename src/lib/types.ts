
export interface UserData {
  id: string;
  fullName: string;
  email: string;
  type: 'partner' | 'normal';
  isAdmin?: boolean;
  businessModel?: 'referral' | 'dsa' | 'merchant';
}

export interface UserApplication {
  id:string;
  applicantDetails?: {
    userId: string;
    fullName: string;
    email: string;
  };
  submittedBy?: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  serviceCategory: 'loan' | 'caService' | 'governmentScheme' | 'Unknown';
  applicationType: string;
  createdAt: string; // ISO string date
  status: string;
}

export interface PartnerData {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  createdAt: string; // ISO string date
  isApproved: boolean;
}
