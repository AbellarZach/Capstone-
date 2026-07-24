export type ComplaintStatus =
  | "Pending"
  | "In Progress"
  | "Scheduled"
  | "Resolved"
  | "Cancelled"
  | "Unsettled";

export type Priority = "High" | "Medium" | "Normal";

export interface PersonInfo {
  name: string;
  age: number;
  address: string;
  contact: string;
  email?: string;
}

export interface Complaint {
  id: string;
  complaintNo: string;
  dateFiled: string;
  complainant: string;
  complainantInfo: PersonInfo;
  respondent: string;
  respondentInfo: PersonInfo;
  category: string;
  priority: Priority;
  status: ComplaintStatus;
  description: string;
  evidence: string[];
  hearingDate?: string;
  hearingTime?: string;
  venue?: string;
  summonNo?: string;
  mediationNotes?: string;
  previousHearingNotes?: string;
  witnesses?: string[];
}

export interface Hearing {
  id: string;
  complaintId: string;
  complaintNo: string;
  complainant?: string;
  respondent?: string;
  date: string;
  time: string;
  venue: string;
  hearingNumber: number;
  status?: string;
}

export interface Resident {
  id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  fullName: string;
  birthdate: string;
  birthPlace?: string;
  age: number;
  gender: string;
  civilStatus: string;
  nationality?: string;
  religion?: string;
  occupation?: string;
  address: string;
  contactNumber: string;
  email: string;
  pwdIdNo?: string;
  familyMonthlyIncome?: string;
  indigent?: string;
  registeredVoter?: string;
  precinctNo?: string;
  voterIdNo?: string;
  photoUrl?: string;
  householdNumber?: string;
  emergencyContact?: string;
  dateRegistered?: string;
}

export interface DashboardStats {
  activeCases: number;
  pendingApproval: number;
  inProgress: number;
  resolvedCases: number;
}

export interface MonthlyAnalytics {
  month: string;
  complaints: number;
  resolved: number;
  scheduled: number;
}

export interface CategoryReport {
  category: string;
  total: number;
}

export interface PriorityReport {
  priority: Priority;
  cases: number;
}
