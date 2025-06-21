
export interface UserData {
  id: string;
  fullName: string;
  email: string;
  type: 'partner' | 'normal';
}

export interface UserApplication {
  id: string;
  serviceCategory: 'loan' | 'caService' | 'governmentScheme' | 'Unknown';
  applicationType: string;
  createdAt: string; // ISO string date
  status: string;
}
