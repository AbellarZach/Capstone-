import axios from "axios";
import type {
  Complaint,
  Hearing,
  MonthlyAnalytics,
  PersonInfo,
  Resident,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export interface DashboardData {
  stats: {
    pending: number;
    inProgress: number;
    scheduled: number;
    resolved: number;
    cancelled: number;
    unsettled: number;
    total: number;
  };
  statusOverview: { status: string; count: number }[];
  monthlyAnalytics: MonthlyAnalytics[];
}

export interface ReportsData {
  stats: {
    totalComplaints: number;
    resolvedCases: number;
    pendingCases: number;
    avgResolutionTime: number;
    resolvedRate: number;
    activeCases: number;
  };
  monthlyAnalytics: MonthlyAnalytics[];
  categoryReports: { category: string; total: number }[];
  priorityReports: { priority: string; cases: number }[];
}

export interface Summon {
  id: string;
  summonNo: string;
  complaintId: string;
  complaintNo: string;
  complainant: string;
  respondent: string;
  hearingDate: string;
  hearingTime: string;
  venue: string;
  officer: string;
}

export const complaintsApi = {
  getAll: (filters?: { search?: string; status?: string; priority?: string; category?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.category) params.append("category", filters.category);
    const queryString = params.toString();
    return api
      .get<Complaint[]>(`/api/complaints${queryString ? `?${queryString}` : ""}`)
      .then((r) => r.data);
  },
  getCategories: () =>
    api.get<string[]>("/api/complaints/categories").then((r) => r.data),
  getRecent: (limit = 10) =>
    api.get<Complaint[]>(`/api/complaints/recent?limit=${limit}`).then((r) => r.data),
  getById: (id: string) =>
    api.get<Complaint>(`/api/complaints/${id}`).then((r) => r.data),
  getDashboard: () =>
    api.get<DashboardData>("/api/complaints/dashboard").then((r) => r.data),
  approve: (id: string) =>
    api.put<Complaint>(`/api/admin/complaints/${id}/approve`).then((r) => r.data),
  reject: (id: string) =>
    api.put<Complaint>(`/api/admin/complaints/${id}/reject`).then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch<Complaint>(`/api/complaints/${id}/status`, { status }).then((r) => r.data),
  updateRespondent: (id: string, respondentInfo: Partial<PersonInfo>) =>
    api.patch<Complaint>(`/api/complaints/${id}/respondent`, respondentInfo).then((r) => r.data),
};

export const hearingsApi = {
  getScheduled: () =>
    api.get<Hearing[]>("/api/hearings/scheduled").then((r) => r.data),
  getByComplaint: (complaintId: string) =>
    api.get<Hearing[]>(`/api/hearings/complaint/${complaintId}`).then((r) => r.data),
  save: (data: {
    complaintId: string;
    hearingNumber?: number;
    hearingDate?: string;
    hearingTime?: string;
    timeConsumed?: string;
    assignedMediator?: string;
    venue?: string;
    witnesses?: string[];
    decision?: string;
    mediationNotes?: string;
    complaintStatus?: string;
    status?: string;
  }) => api.post<Hearing>("/api/hearings", data).then((r) => r.data),
};

export const summonsApi = {
  create: (data: {
    complaintId: string;
    hearingDate: string;
    hearingTime: string;
    venue: string;
    officer: string;
    summonNo?: string;
  }) => api.post<Summon>("/api/summons", data).then((r) => r.data),
  getByComplaint: (complaintId: string) =>
    api.get<Summon>(`/api/summons/complaint/${complaintId}`).then((r) => r.data),
  notify: (complaintId: string) =>
    api.post(`/api/summons/${complaintId}/notify`).then((r) => r.data),
};

export const reportsApi = {
  getAll: () => api.get<ReportsData>("/api/reports").then((r) => r.data),
};

export const residentsApi = {
  getAll: () => api.get<Resident[]>("/api/residents").then((r) => r.data),
  getById: (id: string) =>
    api.get<Resident>(`/api/residents/${id}`).then((r) => r.data),
  create: (data: Partial<Resident>) =>
    api.post<Resident>("/api/residents", data).then((r) => r.data),
  update: (id: string, data: Partial<Resident>) =>
    api.put<Resident>(`/api/residents/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/api/residents/${id}`).then((r) => r.data),
};

export default api;
