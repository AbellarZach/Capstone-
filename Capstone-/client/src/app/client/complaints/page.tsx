"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/services/api";
import type { Complaint } from "@/lib/types";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { COMPLAINT_STATUSES } from "@/lib/complaint-utils";
import { ClientPageShell } from "../components/ClientPageShell";
import { FeeConfirmModal } from "../components/FeeConfirmModal";
import { getStatusBadgeProps } from "../components/statusStyles";

function formatDate(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [feeModalOpen, setFeeModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await clientApi.getComplaints({
          search: debouncedSearch || undefined,
          status: status === "All" ? undefined : status,
        });
        setComplaints(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Unable to load complaints.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [debouncedSearch, status]);

  const emptyMessage = useMemo(
    () =>
      debouncedSearch || status !== "All"
        ? "No complaints match your search or filter."
        : "You have not submitted any complaints yet.",
    [debouncedSearch, status]
  );

  return (
    <ClientPageShell
      title="My Complaints"
      subtitle="Track, filter, and review all community grievance filings"
    >
      {/* 1. Redesigned Search & Filters with accessible form controls and clear field icons */}
      <div className="mb-6 flex flex-col gap-3.5 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <MaterialIcon name="search" className="text-[20px]" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case reference (e.g. ESM-000012), category, or keyword..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs outline-none transition focus:border-[#059669] focus:ring-2 focus:ring-emerald-100"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <MaterialIcon name="cancel" className="text-base" />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown with icon */}
        <div className="relative shrink-0 sm:w-56">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <MaterialIcon name="tune" className="text-[19px]" />
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-slate-800 shadow-xs outline-none transition focus:border-[#059669] focus:ring-2 focus:ring-emerald-100 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {COMPLAINT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <MaterialIcon name="expand_more" className="text-[20px]" />
          </span>
        </div>

        {/* New Filing CTA */}
        <button
          type="button"
          onClick={() => setFeeModalOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#059669] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#047857] shrink-0"
        >
          <MaterialIcon name="add" className="text-lg" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Result Count and Active Filter Status */}
      {!loading && !error && (
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 px-1">
          <p>
            Showing <strong className="text-slate-800">{complaints.length}</strong>{" "}
            {complaints.length === 1 ? "case" : "cases"}
            {status !== "All" && (
              <span>
                {" "}
                filtered by <strong className="text-[#059669]">{status}</strong>
              </span>
            )}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#059669] border-t-transparent" />
          <p className="mt-3 text-sm font-medium text-slate-600">Loading complaints registry...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="font-semibold text-rose-700">{error}</p>
        </div>
      ) : complaints.length ? (
        /* 2. Complaint Cards with Structured Scannable Metadata & Right Margin Action */
        <div className="space-y-4">
          {complaints.map((complaint) => {
            const badge = getStatusBadgeProps(complaint.status);

            return (
              <article
                key={complaint.id}
                className="group rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  {/* Left Column: Complaint Details */}
                  <div className="min-w-0 flex-1 space-y-3.5">
                    {/* Top Row: Case ID, Priority, and Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-slate-900 tracking-tight">
                          {complaint.complaintNo}
                        </span>
                        {complaint.priority && (
                          <span
                            className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                              complaint.priority === "High"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : complaint.priority === "Medium"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {complaint.priority} Priority
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badge.badgeClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${badge.dotClass}`} />
                        {badge.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
                      {complaint.description || "No specific incident description provided."}
                    </p>

                    {/* Structured Scannable Data Fields */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-slate-500">
                      {/* Category */}
                      <div className="flex items-center gap-1.5">
                        <MaterialIcon name="folder_open" className="text-[16px] text-slate-400" />
                        <span className="font-medium text-slate-500">Category:</span>
                        <span className="font-semibold text-slate-800">{complaint.category}</span>
                      </div>

                      {/* Date Filed */}
                      <div className="flex items-center gap-1.5">
                        <MaterialIcon name="calendar_today" className="text-[15px] text-slate-400" />
                        <span className="font-medium text-slate-500">Date Filed:</span>
                        <span className="font-semibold text-slate-800">
                          {formatDate(complaint.dateFiled)}
                        </span>
                      </div>

                      {/* Respondent */}
                      {complaint.respondent && (
                        <div className="flex items-center gap-1.5">
                          <MaterialIcon name="person" className="text-[16px] text-slate-400" />
                          <span className="font-medium text-slate-500">Respondent:</span>
                          <span className="font-semibold text-slate-800">
                            {complaint.respondent}
                          </span>
                        </div>
                      )}

                      {/* Hearing Info Notice If Scheduled */}
                      {complaint.hearingDate && (
                        <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                          <MaterialIcon name="event" className="text-[16px]" />
                          <span>Hearing: {complaint.hearingDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Margin: Dedicated "View Details" Action Trigger */}
                  <div className="flex lg:flex-col items-center justify-end border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0 shrink-0">
                    <button
                      type="button"
                      onClick={() => router.push(`/client/complaints/${complaint.id}`)}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#059669] border border-emerald-200/80 transition hover:bg-[#047857] hover:text-white hover:border-[#047857] cursor-pointer shadow-xs"
                    >
                      <span>View Details</span>
                      <MaterialIcon name="arrow_forward" className="text-base" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#059669]">
            <MaterialIcon name="description" className="text-3xl" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">{emptyMessage}</h3>
          <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            All submitted grievance reports are recorded in the official Katarungang Pambarangay
            docket and synchronized with the Barangay Hall.
          </p>
          <button
            type="button"
            onClick={() => setFeeModalOpen(true)}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#059669] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#047857]"
          >
            <MaterialIcon name="add" className="text-base" />
            <span>File a Complaint</span>
          </button>
        </div>
      )}

      {/* Fee Confirm Modal */}
      <FeeConfirmModal
        open={feeModalOpen}
        onClose={() => setFeeModalOpen(false)}
        onProceed={() => {
          setFeeModalOpen(false);
          router.push("/client/complaints/new");
        }}
      />
    </ClientPageShell>
  );
}
