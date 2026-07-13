import type { ComplaintStatus, Priority } from "./types";

const LEGACY_STATUS_MAP: Record<string, ComplaintStatus> = {
  "Forwarded to Court": "Unsettled",
  Rejected: "Cancelled",
};

const PRIORITY_RANK: Record<string, number> = {
  High: 0,
  Medium: 1,
  Normal: 2,
  Low: 2,
};

export function normalizeStatus(status: string): ComplaintStatus {
  return (LEGACY_STATUS_MAP[status] ?? status) as ComplaintStatus;
}

export function normalizePriority(priority: string): Priority {
  if (priority === "Low") return "Normal";
  return priority as Priority;
}

export function sortByPriority<T extends { priority: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const rankA = PRIORITY_RANK[a.priority] ?? 99;
    const rankB = PRIORITY_RANK[b.priority] ?? 99;
    if (rankA !== rankB) return rankA - rankB;
    return 0;
  });
}

export const COMPLAINT_STATUSES: ComplaintStatus[] = [
  "Pending",
  "In Progress",
  "Scheduled",
  "Resolved",
  "Cancelled",
  "Unsettled",
];
