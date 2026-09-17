import { normalizeStatus } from "@/lib/complaint-utils";

export function getStatusDotClass(status: string) {
  const normalized = normalizeStatus(status);
  switch (normalized) {
    case "Resolved":
      return "bg-[#16A34A]";
    case "Pending":
      return "bg-[#D97706]";
    case "In Progress":
      return "bg-[#2563EB]";
    case "Scheduled":
      return "bg-[#D97706]";
    case "Cancelled":
      return "bg-[#DC2626]";
    case "Unsettled":
      return "bg-[#64748B]";
    default:
      return "bg-slate-400";
  }
}

export function getStatusBadgeProps(status: string) {
  const normalized = normalizeStatus(status);
  switch (normalized) {
    case "Resolved":
      return {
        badgeClass: "bg-emerald-50 text-[#16A34A] border border-emerald-200",
        dotClass: "bg-[#16A34A]",
        label: "Resolved",
      };
    case "Pending":
      return {
        badgeClass: "bg-amber-50 text-[#D97706] border border-amber-200",
        dotClass: "bg-[#D97706]",
        label: "Pending",
      };
    case "In Progress":
      return {
        badgeClass: "bg-blue-50 text-[#2563EB] border border-blue-200",
        dotClass: "bg-[#2563EB]",
        label: "In Progress",
      };
    case "Scheduled":
      return {
        badgeClass: "bg-amber-50 text-[#D97706] border border-amber-200",
        dotClass: "bg-[#D97706]",
        label: "Hearing Scheduled",
      };
    case "Cancelled":
      return {
        badgeClass: "bg-rose-50 text-[#DC2626] border border-rose-200",
        dotClass: "bg-[#DC2626]",
        label: "Cancelled",
      };
    case "Unsettled":
      return {
        badgeClass: "bg-slate-100 text-[#475569] border border-slate-300",
        dotClass: "bg-[#64748B]",
        label: "Unsettled",
      };
    default:
      return {
        badgeClass: "bg-slate-100 text-slate-700 border border-slate-200",
        dotClass: "bg-slate-400",
        label: status || "Unknown",
      };
  }
}

/** How many horizontal stepper steps are completed (0-based inclusive). */
export function getDashboardStepperCompletedIndex(status: string) {
  const normalized = normalizeStatus(status);
  if (normalized === "Pending") return 0;
  if (normalized === "In Progress" || normalized === "Scheduled") return 2;
  if (normalized === "Resolved" || normalized === "Cancelled" || normalized === "Unsettled") {
    return 3;
  }
  return 0;
}

