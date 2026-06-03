export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  createdAt: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  deadline: string | null;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string | null;
  coverLetter: string | null;
  resumePath: string | null;
  projects: string | null;
  priorExperience: boolean;
  priorCompany: string | null;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'closed';
  appliedAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  userId: string;
  companyName: string;
  industry: string | null;
  description: string | null;
  website: string | null;
  location: string | null;
  createdAt: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  experienceYears: number;
  degree: string | null;
  skills: string | null;
  resumePath: string | null;
  name: string | null;
  email: string | null;
}

export interface AdminStats {
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  openJobs: number;
  totalApplications: number;
  totalCompanies: number;
  totalReviews: number;
  averageReviewRating: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string | null;
  userRole: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}
