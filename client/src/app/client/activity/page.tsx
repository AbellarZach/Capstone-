"use client";

import { useEffect, useMemo, useState } from "react";
import { clientApi } from "@/services/api";
import type { ActivityLog } from "@/lib/types";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { ClientPageShell } from "../components/ClientPageShell";

function formatLeftDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getVisual(action: string) {
  const value = action.toLowerCase();
  if (value.includes("resolve")) {
    return { color: "bg-[#22C55E]", icon: "check", title: "Resolved" };
  }
  if (value.includes("hearing") || value.includes("schedule")) {
    return { color: "bg-[#F97316]", icon: "event", title: "Hearing Scheduled" };
  }
  if (value.includes("approve")) {
    return { color: "bg-[#2563EB]", icon: "verified", title: "Complaint Approved" };
  }
  if (value.includes("review") || value.includes("status")) {
    return { color: "bg-[#2563EB]", icon: "sync", title: value.includes("review") ? "Reviewed by Admin" : "Complaint Updated" };
  }
  if (value.includes("submit")) {
    return { color: "bg-[#22C55E]", icon: "check", title: "Complaint Submitted" };
  }
  if (value.includes("progress")) {
    return { color: "bg-[#2563EB]", icon: "timelapse", title: "In Progress" };
  }
  return { color: "bg-[#2563EB]", icon: "circle", title: action || "Activity Update" };
}

function getDescription(activity: ActivityLog) {
  const details =
    typeof activity.details === "string"
      ? (() => {
          try {
            return JSON.parse(activity.details);
          } catch {
            return activity.details;
          }
        })()
      : activity.details;

  const action = (activity.action || "").toLowerCase();
  if (action.includes("resolve")) return "Complaint has been resolved.";
  if (action.includes("approve")) return "Your complaint was approved and is now being processed.";
  if (action.includes("hearing") || action.includes("schedule")) {
    return details?.hearingDate
      ? `Hearing on ${details.hearingDate}${details.venue ? ` at ${details.venue}` : ""}`
      : "A hearing has been scheduled for your complaint.";
  }
  if (action.includes("review")) return "The complaint is now under evaluation.";
  if (action.includes("submit")) return "Your complaint has been successfully submitted.";
  if (action.includes("progress") || action.includes("status")) {
    return details?.status
      ? `Status changed to ${details.status}.`
      : "Case is currently being handled.";
  }

  const complaintNo = activity.complaintNo || details?.complaintNo;
  const category = activity.category || details?.category;
  const parts = [];
  if (category) parts.push(category);
  if (complaintNo) parts.push(`Complaint No: ${complaintNo}`);
  return parts.join(" · ") || "Activity recorded for your complaint.";
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
      subtitle="View all actions and updates related to your complaints"
    >
      <div className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
        {loading ? (
          <p className="text-slate-600">Loading activity...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : sorted.length ? (
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2 bg-slate-200" />
            <div className="space-y-8">
              {sorted.map((activity) => {
                const visual = getVisual(activity.action);
                return (
                  <div
                    key={activity.id}
                    className="grid grid-cols-[1fr,48px,1.3fr] items-start gap-3 sm:gap-4"
                  >
                    <div className="pt-1 text-right text-xs font-medium text-slate-500 sm:text-sm">
                      {formatLeftDate(activity.createdAt)}
                    </div>
                    <div className="relative z-10 flex justify-center">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm ${visual.color}`}
                      >
                        <MaterialIcon name={visual.icon} className="text-[18px]" />
                      </span>
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-bold text-slate-900 sm:text-base">{visual.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{getDescription(activity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">No activity yet.</p>
            <p className="mt-2 text-sm text-slate-500">
              Your timeline will appear once you submit a complaint or the barangay updates your case.
            </p>
          </div>
        )}
      </div>
    </ClientPageShell>
  );
}
