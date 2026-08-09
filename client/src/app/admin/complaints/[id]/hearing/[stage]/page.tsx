"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { complaintsApi, hearingsApi } from "@/services/api";
import type { Complaint, Hearing } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PriorityBadge } from "@/components/admin/PriorityBadge";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export default function HearingStagePage({
  params,
}: {
  params: Promise<{ id: string; stage: string }>;
}) {
  const { id, stage } = use(params);
  const router = useRouter();

  const stageNumber = Math.max(1, Math.min(4, Number(stage) || 1));

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form Fields for Current Hearing
  const [hearingDate, setHearingDate] = useState("");
  const [hearingTime, setHearingTime] = useState("");
  const [timeConsumed, setTimeConsumed] = useState("");
  const [assignedMediator, setAssignedMediator] = useState("");
  const [decision, setDecision] = useState("");
  const [mediationNotes, setMediationNotes] = useState("");
  const [venue, setVenue] = useState("Barangay Hall Session Room");

  const loadData = useCallback(async () => {
    try {
      const cData = await complaintsApi.getById(id);
      setComplaint(cData);

      const hData = await hearingsApi.getByComplaint(id);
      setHearings(hData);

      // Find current hearing object if it exists
      const currentH = hData.find((h) => h.hearingNumber === stageNumber);
      if (currentH) {
        if (currentH.date) setHearingDate(currentH.date);
        if (currentH.time) setHearingTime(currentH.time);
        if (currentH.timeConsumed) setTimeConsumed(currentH.timeConsumed);
        if (currentH.assignedMediator) setAssignedMediator(currentH.assignedMediator);
        if (currentH.decision) setDecision(currentH.decision);
        if (currentH.mediationNotes) setMediationNotes(currentH.mediationNotes);
        if (currentH.venue) setVenue(currentH.venue);
      } else if (cData.hearingDate) {
        setHearingDate(cData.hearingDate);
        setHearingTime(cData.hearingTime || "09:00 AM");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, stageNumber]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveCurrentHearing = async (desiredComplaintStatus?: string) => {
    if (!hearingDate || !hearingTime) {
      alert("Hearing Date and Hearing Time are required.");
      return false;
    }

    await hearingsApi.save({
      complaintId: id,
      hearingNumber: stageNumber,
      hearingDate,
      hearingTime,
      timeConsumed,
      assignedMediator,
      venue,
      decision,
      mediationNotes,
      complaintStatus: desiredComplaintStatus || "Scheduled",
      status: "Scheduled",
    });
    return true;
  };

  // Stage Handlers
  const handleProceedNextSummon = async (nextStage: number) => {
    setActionLoading(true);
    try {
      const ok = await saveCurrentHearing("Scheduled");
      if (ok) {
        router.push(`/admin/complaints/${id}/summon/${nextStage}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save hearing details.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleCurrentHearing = async () => {
    setActionLoading(true);
    try {
      const ok = await saveCurrentHearing("Scheduled");
      if (ok) {
        router.push("/admin/complaints");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save hearing information.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!confirm(`Are you sure you want to mark Stage ${stageNumber} as RESOLVED?`)) return;
    setActionLoading(true);
    try {
      const ok = await saveCurrentHearing("Resolved");
      if (ok) {
        router.push("/admin/complaints");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to resolve complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsettled = async () => {
    if (!confirm("Are you sure you want to mark this complaint as UNSETTLED? It will proceed to trial court.")) return;
    setActionLoading(true);
    try {
      const ok = await saveCurrentHearing("Unsettled");
      if (ok) {
        router.push("/admin/complaints");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to unsettle complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Return to complaints list? Hearing state will be preserved.")) {
      router.push("/admin/complaints");
    }
  };

  const stageTitles: Record<number, string> = {
    1: "FIRST HEARING",
    2: "SECOND HEARING",
    3: "THIRD HEARING",
    4: "FOURTH HEARING",
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading hearing details...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Complaint not found.</p>
        <Link href="/admin/complaints" className="mt-4 text-primary hover:underline text-sm font-medium">
          ← Back to Complaints
        </Link>
      </div>
    );
  }

  const previousHearings = hearings.filter((h) => h.hearingNumber < stageNumber);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`${stageTitles[stageNumber]} — Complaint #${complaint.complaintNo}`}
        action={
          <button
            type="button"
            onClick={() => router.push("/admin/complaints")}
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            ← Back to Complaints
          </button>
        }
      />

      {/* Complaint & Parties Summary */}
      <div className="admin-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Complaint Overview
          </h3>
          <StatusBadge status="Scheduled" hearingNumber={stageNumber} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 font-medium">Complaint #</p>
            <p className="font-bold text-primary">{complaint.complaintNo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Date Filed</p>
            <p className="font-semibold text-gray-800">{complaint.dateFiled}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Category</p>
            <p className="font-semibold text-gray-800">{complaint.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Priority</p>
            <div className="mt-0.5">
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase">Complainant Information</p>
            <p className="font-bold text-gray-900 mt-1">{complaint.complainantInfo.name || complaint.complainant}</p>
            <p className="text-xs text-gray-600">{complaint.complainantInfo.address}</p>
            <p className="text-xs text-gray-600">Contact: {complaint.complainantInfo.contact || "N/A"}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase">Respondent Information</p>
            <p className="font-bold text-gray-900 mt-1">{complaint.respondentInfo.name || complaint.respondent}</p>
            <p className="text-xs text-gray-600">{complaint.respondentInfo.address}</p>
            <p className="text-xs text-gray-600">Contact: {complaint.respondentInfo.contact || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Previous Hearings History (Preserved Data) */}
      {previousHearings.length > 0 && (
        <div className="admin-card p-5 space-y-3">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
            <MaterialIcon name="history" className="text-primary text-lg" />
            Previous Hearing Records
          </h3>

          <div className="space-y-3">
            {previousHearings.map((ph) => (
              <div key={ph.id} className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span>
                    {ph.hearingNumber === 1 && "1ST HEARING RECORD"}
                    {ph.hearingNumber === 2 && "2ND HEARING RECORD"}
                    {ph.hearingNumber === 3 && "3RD HEARING RECORD"}
                  </span>
                  <span className="text-gray-500">{ph.date} {ph.time}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <p><strong>Mediator:</strong> {ph.assignedMediator || "N/A"}</p>
                  <p><strong>Duration:</strong> {ph.timeConsumed || "N/A"}</p>
                </div>
                {ph.decision && <p className="text-gray-800"><strong>Decision:</strong> {ph.decision}</p>}
                {ph.mediationNotes && <p className="text-gray-800"><strong>Notes:</strong> {ph.mediationNotes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Hearing Editable Fields Form */}
      <div className="admin-card p-5 space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-800 pb-2 border-b border-gray-100">
          <MaterialIcon name="edit_calendar" className="text-primary text-xl" />
          {stageTitles[stageNumber]} Information Entry
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-600">Hearing Date *</label>
            <input
              type="date"
              value={hearingDate}
              onChange={(e) => setHearingDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600">Hearing Time *</label>
            <input
              type="text"
              placeholder="e.g. 09:00 AM"
              value={hearingTime}
              onChange={(e) => setHearingTime(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600">Time Consumed</label>
            <input
              type="text"
              placeholder="e.g. 1 hour 15 minutes"
              value={timeConsumed}
              onChange={(e) => setTimeConsumed(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600">Assigned Mediator</label>
            <input
              type="text"
              placeholder="e.g. Brgy. Kagawad Ramos"
              value={assignedMediator}
              onChange={(e) => setAssignedMediator(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600">Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600">Decision Outcome</label>
          <textarea
            rows={2}
            placeholder="Record official mediation outcome or consensus reached..."
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600">Message / Hearing Notes</label>
          <textarea
            rows={3}
            placeholder="Detailed notes regarding proceedings, claims, and agreement points..."
            value={mediationNotes}
            onChange={(e) => setMediationNotes(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Action Buttons per Stage */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={() => router.push("/admin/complaints")}
          disabled={actionLoading}
          className="btn btn-secondary btn-lg min-w-[120px]"
        >
          <MaterialIcon name="arrow_back" />
          BACK
        </button>

        {stageNumber === 1 && (
          <button
            type="button"
            onClick={() => handleProceedNextSummon(2)}
            disabled={actionLoading}
            className="btn btn-primary btn-lg min-w-[180px]"
          >
            <MaterialIcon name="description" />
            SECOND HEARING
          </button>
        )}

        {stageNumber === 2 && (
          <>
            <button
              type="button"
              onClick={handleResolve}
              disabled={actionLoading}
              className="btn btn-success btn-lg min-w-[140px]"
            >
              <MaterialIcon name="check_circle" />
              RESOLVED
            </button>
            <button
              type="button"
              onClick={handleScheduleCurrentHearing}
              disabled={actionLoading}
              className="btn btn-secondary btn-lg min-w-[160px]"
            >
              <MaterialIcon name="save" />
              SCHEDULE HEARING
            </button>
            <button
              type="button"
              onClick={() => handleProceedNextSummon(3)}
              disabled={actionLoading}
              className="btn btn-primary btn-lg min-w-[180px]"
            >
              <MaterialIcon name="description" />
              THIRD HEARING
            </button>
          </>
        )}

        {stageNumber === 3 && (
          <>
            <button
              type="button"
              onClick={handleResolve}
              disabled={actionLoading}
              className="btn btn-success btn-lg min-w-[140px]"
            >
              <MaterialIcon name="check_circle" />
              RESOLVED
            </button>
            <button
              type="button"
              onClick={handleScheduleCurrentHearing}
              disabled={actionLoading}
              className="btn btn-secondary btn-lg min-w-[160px]"
            >
              <MaterialIcon name="save" />
              SCHEDULE HEARING
            </button>
            <button
              type="button"
              onClick={() => handleProceedNextSummon(4)}
              disabled={actionLoading}
              className="btn btn-primary btn-lg min-w-[180px]"
            >
              <MaterialIcon name="description" />
              FOURTH HEARING
            </button>
          </>
        )}

        {stageNumber === 4 && (
          <>
            <button
              type="button"
              onClick={handleResolve}
              disabled={actionLoading}
              className="btn btn-success btn-lg min-w-[140px]"
            >
              <MaterialIcon name="check_circle" />
              RESOLVED
            </button>
            <button
              type="button"
              onClick={handleUnsettled}
              disabled={actionLoading}
              className="btn btn-danger btn-lg min-w-[140px]"
            >
              <MaterialIcon name="gavel" />
              UNSETTLED
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={actionLoading}
              className="btn btn-secondary btn-lg min-w-[120px]"
            >
              <MaterialIcon name="close" />
              CANCEL
            </button>
          </>
        )}
      </div>
    </div>
  );
}
