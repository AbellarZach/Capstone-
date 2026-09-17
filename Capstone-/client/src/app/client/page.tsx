"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clientApi } from "@/services/api";
import type { Complaint, AuthUser } from "@/lib/types";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { CLIENT_PROGRESS_STEPS, getClientStatusLabel } from "@/lib/complaint-utils";
import { ClientTopBar } from "./components/ClientTopBar";
import { ClientSidebar } from "./components/ClientSidebar";
import { ClientFooter } from "./components/ClientFooter";
import { FeeConfirmModal } from "./components/FeeConfirmModal";
import {
  getDashboardStepperCompletedIndex,
  getStatusBadgeProps,
} from "./components/statusStyles";

function friendlyError(err: any) {
  const message = err?.response?.data?.message || err?.message || "";
  if (/invalid token|expired|unauthorized|access token/i.test(String(message))) {
    return "Your session has expired. Please log in again.";
  }
  return message || "Unable to load client data.";
}

function formatDate(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ClientHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feeModalOpen, setFeeModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [profile, complaints] = await Promise.all([
          clientApi.getProfile(),
          clientApi.getComplaints({ limit: 5 }),
        ]);
        setUser(profile);
        setRecentComplaints(complaints);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (err: any) {
        setError(friendlyError(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const latestComplaint = useMemo(() => recentComplaints[0] || null, [recentComplaints]);
  const completedIndex = latestComplaint
    ? getDashboardStepperCompletedIndex(latestComplaint.status)
    : -1;

  const displayName = user?.fullname || user?.username || "kevs";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "R";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <ClientTopBar rightSlot="avatar" avatarInitials="..." displayName="Resident" />
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col lg:flex-row">
          <ClientSidebar user={null} />
          <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#059669] border-t-transparent" />
                <p className="mt-3 text-sm font-medium text-slate-600">Loading your resident portal...</p>
              </div>
            </div>
          </main>
        </div>
        <ClientFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <ClientTopBar rightSlot="avatar" avatarInitials={initials} displayName={displayName} />
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col lg:flex-row">
          <ClientSidebar user={user} />
          <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
            <div className="rounded-2xl border border-rose-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <p className="font-semibold text-rose-600">{error}</p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-4 rounded-xl bg-[#059669] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#047857]"
              >
                Go to Login
              </button>
            </div>
          </main>
        </div>
        <ClientFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <ClientTopBar
        rightSlot="avatar"
        avatarInitials={initials}
        avatarUrl={user?.profilePicture}
        displayName={displayName}
        onAvatarClick={() => router.push("/client/profile")}
      />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col lg:flex-row">
        {/* Fixed Left Navigation Sidebar */}
        <ClientSidebar user={user} />

        {/* Central Content Region */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
          {/* 1. Hero Banner: Retain CCLEX aerial image with modern dark overlay rgba(15, 23, 42, 0.65) */}
          <section
            className="relative flex min-h-[260px] sm:min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-cover bg-center px-6 py-12 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url('/hero-banner.png')",
            }}
          >
            <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Barangay Gabi Citizen Grievance Portal
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
                Welcome, {displayName}!
              </h1>
              <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-slate-200 sm:text-base">
                File community concerns, monitor summons and hearings, and resolve disputes transparently.
              </p>

              {/* Prominent High-Contrast Primary Green CTA */}
              <button
                type="button"
                onClick={() => setFeeModalOpen(true)}
                className="mt-6 inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-[#059669] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#047857] hover:shadow-xl transform active:scale-95"
              >
                <MaterialIcon name="folder_open" className="text-[20px]" />
                <span>File a Complaint</span>
              </button>
            </div>
          </section>

          {/* Fee Confirmation Modal */}
          <FeeConfirmModal
            open={feeModalOpen}
            onClose={() => setFeeModalOpen(false)}
            onProceed={() => {
              setFeeModalOpen(false);
              router.push("/client/complaints/new");
            }}
          />

          {/* 2. Recent Complaints Card: Rounded container card with clean status badges */}
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#059669]">
                  <MaterialIcon name="assignment" className="text-[20px]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
                  <p className="text-xs text-slate-500">Your latest filed cases and current statuses</p>
                </div>
              </div>

              {recentComplaints.length > 0 && (
                <Link
                  href="/client/complaints"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669] hover:underline"
                >
                  View all ({recentComplaints.length})
                  <MaterialIcon name="arrow_forward" className="text-[14px]" />
                </Link>
              )}
            </div>

            {recentComplaints.length ? (
              <div className="mt-2 divide-y divide-slate-100">
                {recentComplaints.map((complaint) => {
                  const badge = getStatusBadgeProps(complaint.status);

                  return (
                    <div
                      key={complaint.id}
                      onClick={() => router.push(`/client/complaints/${complaint.id}`)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 cursor-pointer transition hover:bg-slate-50/80 rounded-xl px-2 -mx-2"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span
                          className={`mt-1 h-3 w-3 shrink-0 rounded-full ${badge.dotClass}`}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 font-mono">
                              {complaint.complaintNo}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                              {complaint.category}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500">
                              Filed {formatDate(complaint.dateFiled)}
                            </span>
                          </div>
                          {complaint.description ? (
                            <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                              {complaint.description}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        {/* Clean Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badge.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dotClass}`} />
                          {badge.label}
                        </span>

                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 group-hover:text-[#059669] group-hover:bg-emerald-50 transition">
                          <MaterialIcon name="chevron_right" className="text-[20px]" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#059669]">
                  <MaterialIcon name="inbox" className="text-2xl" />
                </div>
                <p className="mt-3 font-bold text-slate-900 text-sm">No complaints filed yet</p>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  Your submitted community complaints will appear here with real-time status updates from the Barangay Hall.
                </p>
                <button
                  type="button"
                  onClick={() => setFeeModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#059669] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#047857]"
                >
                  <MaterialIcon name="add" className="text-base" />
                  File your first complaint
                </button>
              </div>
            )}
          </section>

          {/* 3. Status Trackers: Complaint Progress Stepper */}
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#16A34A]">
                  <MaterialIcon name="linear_scale" className="text-[20px]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Complaint Status Tracker</h2>
                  <p className="text-xs text-slate-500">
                    {latestComplaint
                      ? `Active case: ${latestComplaint.complaintNo} (${latestComplaint.category})`
                      : "Real-time progression from submission to barangay resolution"}
                  </p>
                </div>
              </div>

              {latestComplaint && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#059669]">
                  {getClientStatusLabel(latestComplaint.status)}
                </span>
              )}
            </div>

            {latestComplaint ? (
              <div className="mt-8 px-2 sm:px-6 pb-2">
                <div className="relative flex items-start justify-between">
                  {/* Background Track Line */}
                  <div className="absolute left-[12%] right-[12%] top-4 h-[3px] bg-slate-200" />
                  {/* Progress Line */}
                  <div
                    className="absolute left-[12%] top-4 h-[3px] bg-[#16A34A] transition-all duration-500"
                    style={{
                      width:
                        completedIndex <= 0
                          ? "0%"
                          : completedIndex >= 3
                            ? "76%"
                            : `${(completedIndex / 3) * 76}%`,
                    }}
                  />

                  {CLIENT_PROGRESS_STEPS.map((step, index) => {
                    const done = completedIndex >= index;
                    const isCurrent = completedIndex === index;

                    return (
                      <div key={step} className="relative z-10 flex w-1/4 flex-col items-center">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                            done
                              ? "border-[#16A34A] bg-[#16A34A] text-white shadow-sm"
                              : "border-slate-300 bg-white text-slate-400"
                          } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}
                        >
                          {done ? (
                            <MaterialIcon name="check" className="text-[17px] font-bold" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </span>
                        <p
                          className={`mt-2.5 text-center text-xs font-bold sm:text-sm ${
                            done ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
                <p className="font-bold text-slate-900 text-sm">No active complaint progress to display.</p>
                <p className="mt-1 text-xs text-slate-500">
                  File a complaint to monitor the 4-step Katarungang Pambarangay workflow.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Pinned Understated Civic Footer */}
      <ClientFooter />
    </div>
  );
}
