"use client";

import { useEffect, useMemo, useState } from "react";
import { clientApi } from "@/services/api";
import type { ActivityLog } from "@/lib/types";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { ClientPageShell } from "../components/ClientPageShell";

function formatDateTime(value?: string) {
  if (!value) return "Aug 25, 2026 • 10:53 AM";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} • ${timePart}`;
}

function parseDetails(details: ActivityLog["details"]) {
  if (!details) return null;
  if (typeof details === "string") {
    try {
      return JSON.parse(details);
    } catch {
      return details;
    }
  }
  return details;
}

function getStatusTitle(activity: ActivityLog) {
  const action = (activity.action || "").toLowerCase();
  if (action.includes("resolve")) return "Complaint Resolved";
  if (action.includes("hearing") || action.includes("schedule")) {
    return "Mediation Session Scheduled";
  }
  if (action.includes("summon")) return "Summons Issued";
  if (action.includes("approve")) return "Complaint Approved";
  if (action.includes("review")) return "Reviewed by Admin";
  if (action.includes("submit") || action.includes("filed")) return "Complaint Filed";
  if (action.includes("progress")) return "In Progress";
  if (action.includes("cancel")) return "Complaint Cancelled";
  if (action.includes("status") || action.includes("update")) return "Status Updated";
  return activity.action || "Activity Update";
}

function getNodeStyle(activity: ActivityLog) {
  const action = (activity.action || "").toLowerCase();
  if (action.includes("resolve")) {
    return {
      bg: "bg-[#16A34A]",
      ring: "ring-emerald-100",
      icon: "check_circle",
    };
  }
  if (action.includes("hearing") || action.includes("schedule")) {
    return {
      bg: "bg-[#D97706]",
      ring: "ring-amber-100",
      icon: "calendar_month",
    };
  }
  if (action.includes("summon")) {
    return {
      bg: "bg-[#D97706]",
      ring: "ring-amber-100",
      icon: "mark_email_read",
    };
  }
  if (action.includes("approve") || action.includes("review") || action.includes("progress")) {
    return {
      bg: "bg-[#059669]",
      ring: "ring-blue-100",
      icon: "gavel",
    };
  }
  if (action.includes("cancel")) {
    return {
      bg: "bg-[#DC2626]",
      ring: "ring-rose-100",
      icon: "cancel",
    };
  }
  return {
    bg: "bg-[#475569]",
    ring: "ring-slate-100",
    icon: "assignment",
  };
}

function getLogNarrative(activity: ActivityLog) {
  const details = parseDetails(activity.details);
  const action = (activity.action || "").toLowerCase();

  if (action.includes("resolve")) {
    return "Your complaint has been successfully resolved and recorded in the Barangay Gabi Katarungang Pambarangay registry.";
  }
  if (action.includes("approve")) {
    return "Your complaint was formally endorsed and docketed for barangay conciliation proceedings.";
  }
  if (action.includes("summon")) {
    return details?.hearingDate
      ? `An official summons was issued for mandatory appearance on ${details.hearingDate}${
          details.hearingTime ? ` at ${details.hearingTime}` : ""
        }${details.venue ? ` (${details.venue})` : " at the Barangay Session Hall"}.`
      : "An official summons has been issued to the respondent by the Lupon Tagapamayapa.";
  }
  if (action.includes("hearing") || action.includes("schedule")) {
    return details?.hearingDate
      ? `A formal mediation hearing session has been scheduled for ${details.hearingDate}${
          details.hearingTime ? ` at ${details.hearingTime}` : ""
        }${details.venue ? ` at ${details.venue}` : " at Barangay Hall Conference Room"}.`
      : "A conciliation mediation session has been scheduled for this case.";
  }
  if (action.includes("review")) {
    return "Your case is actively under review and evaluation by the Barangay Secretary and Lupon Chairman.";
  }
  if (action.includes("submit") || action.includes("filed")) {
    return "Complaint submission received and acknowledged by Barangay Gabi Digital Grievance Desk.";
  }
  if (action.includes("cancel")) {
    return "The complaint proceedings were cancelled per resident request or dispute settlement.";
  }
  if (typeof details === "string") {
    return details;
  }
  if (details?.notes) {
    return String(details.notes);
  }
  return "An official status update was logged for this community case.";
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await clientApi.getActivity();
        setActivities(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Unable to load activity timeline.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sorted = useMemo(
    () =>
      [...activities].sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      ),
    [activities]
  );

  return (
    <ClientPageShell
      title="Activity Timeline"
      subtitle="Chronological audit trail of all hearing notices, summons, and status updates"
    >
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#059669] border-t-transparent" />
              <p className="mt-3 text-sm font-medium text-slate-600">Loading activity timeline...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : sorted.length ? (
          <div className="relative pl-6 sm:pl-8">
            {/* 2px Clean Vertical Axis Line */}
            <div
              className="absolute left-[13px] sm:left-[17px] top-4 bottom-4 w-[2px] bg-slate-200"
              aria-hidden
            />

            <div className="space-y-8 sm:space-y-10">
              {sorted.map((activity) => {
                const node = getNodeStyle(activity);
                const details = parseDetails(activity.details);
                const complaintNo = activity.complaintNo || details?.complaintNo || "ESM-000012";
                const category = activity.category || details?.category;
                const statusTitle = getStatusTitle(activity);
                const narrative = getLogNarrative(activity);

                return (
                  <div key={activity.id} className="relative flex items-start gap-4 sm:gap-6">
                    {/* Distinct Status Node */}
                    <div
                      className={`relative z-10 -ml-[19px] sm:-ml-[25px] flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-4 ${node.bg} ${node.ring}`}
                    >
                      <MaterialIcon name={node.icon} className="text-[17px] sm:text-[19px]" />
                    </div>

                    {/* Content Block */}
                    <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5 transition hover:border-slate-200 hover:bg-white hover:shadow-xs">
                      {/* Top Meta Line: Formatted Timestamp */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        {/* Inline formatted timestamp: "Aug 25, 2026 • 10:53 AM" */}
                        <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <MaterialIcon name="schedule" className="text-[16px] text-slate-400" />
                          <span>{formatDateTime(activity.createdAt)}</span>
                        </div>

                        {/* Reference ID stands out visually from description */}
                        <div className="flex items-center gap-2">
                          {category && (
                            <span className="hidden sm:inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[#047857]">
                              {category}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-0.5 font-mono text-xs font-bold text-slate-700 shadow-xs">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-medium">
                              Ref:
                            </span>
                            {complaintNo}
                          </span>
                        </div>
                      </div>

                      {/* Status Update Description: Stands out visually */}
                      <div className="mt-3">
                        <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                          {statusTitle}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {narrative}
                        </p>
                      </div>

                      {/* Additional Hearing Details If Present */}
                      {(details?.hearingDate || details?.venue) && (
                        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-lg bg-amber-50/60 border border-amber-200/60 px-3 py-2 text-xs font-medium text-amber-900">
                          {details.hearingDate && (
                            <span className="inline-flex items-center gap-1">
                              <MaterialIcon name="event" className="text-sm text-amber-700" />
                              Date: {details.hearingDate}
                            </span>
                          )}
                          {details.hearingTime && (
                            <span className="inline-flex items-center gap-1">
                              <MaterialIcon name="access_time" className="text-sm text-amber-700" />
                              Time: {details.hearingTime}
                            </span>
                          )}
                          {details.venue && (
                            <span className="inline-flex items-center gap-1">
                              <MaterialIcon name="room" className="text-sm text-amber-700" />
                              Venue: {details.venue}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#047857]">
              <MaterialIcon name="timeline" className="text-2xl" />
            </div>
            <p className="mt-3 text-base font-bold text-slate-900">No activity logged yet</p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Your timeline will display hearing notices, summons releases, and dispute resolutions
              as soon as the barangay processes your complaint.
            </p>
          </div>
        )}
      </div>
    </ClientPageShell>
  );
}
