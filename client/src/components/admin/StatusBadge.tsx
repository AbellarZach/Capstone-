import type { ComplaintStatus } from "@/lib/types";
import { normalizeStatus } from "@/lib/complaint-utils";

const statusStyles: Record<ComplaintStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  "In Progress": "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
  Scheduled: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
  Resolved: "bg-green-100 text-green-800 ring-1 ring-green-200",
  Cancelled: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  Unsettled: "bg-red-100 text-red-800 ring-1 ring-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  const normalized = normalizeStatus(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[normalized] ?? "bg-gray-100 text-gray-600"}`}
    >
      {normalized}
    </span>
  );
}
