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

export default function ComplaintProgressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRespondent, setSavingRespondent] = useState(false);

  // Editable Respondent Form State
  const [respondentName, setRespondentName] = useState("");
  const [respondentAddress, setRespondentAddress] = useState("");
  const [respondentContact, setRespondentContact] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");

  // Witnesses State
  const [witnesses, setWitnesses] = useState<{ name: string; address: string }[]>([]);
  const [newWitnessName, setNewWitnessName] = useState("");
  const [newWitnessAddress, setNewWitnessAddress] = useState("");

  // Hearing Schedule Modal/Inputs for Schedule Hearing
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [hearingDate, setHearingDate] = useState("");
  const [hearingTime, setHearingTime] = useState("");
  const [assignedMediator, setAssignedMediator] = useState("");
  const [timeConsumed, setTimeConsumed] = useState("");
  const [venue, setVenue] = useState("Barangay Hall Session Room");
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const cData = await complaintsApi.getById(id);
      setComplaint(cData);
      setRespondentName(cData.respondentInfo.name || cData.respondent || "");
      setRespondentAddress(cData.respondentInfo.address || "");
      setRespondentContact(cData.respondentInfo.contact || "");
      setRespondentEmail(cData.respondentInfo.email || "");

      const hData = await hearingsApi.getByComplaint(id);
      setHearings(hData);

      // Extract existing witnesses if any
      const existingWit = hData.flatMap((h) => h.witnesses || []);
      const parsedWit = existingWit.map((w) => {
        if (typeof w === "string") {
          return { name: w, address: "" };
        }
        return w as any;
      });
      if (parsedWit.length > 0) setWitnesses(parsedWit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveRespondent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondentName.trim()) {
      alert("Respondent Name is required.");
      return;
    }
    setSavingRespondent(true);
    try {
      await complaintsApi.updateRespondent(id, {
        name: respondentName,
        address: respondentAddress,
        contact: respondentContact,
        email: respondentEmail,
      });
      alert("Respondent Information saved successfully.");
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to save respondent information.");
    } finally {
      setSavingRespondent(false);
    }
  };

  const handleAddWitness = () => {
    if (!newWitnessName.trim()) return;
    setWitnesses((prev) => [...prev, { name: newWitnessName.trim(), address: newWitnessAddress.trim() }]);
    setNewWitnessName("");
    setNewWitnessAddress("");
  };

  const handleRemoveWitness = (index: number) => {
    setWitnesses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResolve = async () => {
    if (!confirm("Are you sure you want to mark this complaint as RESOLVED?")) return;
    setActionLoading(true);
    try {
      await complaintsApi.updateStatus(id, "Resolved");
      router.push("/admin/complaints");
    } catch (err) {
      console.error(err);
      alert("Failed to resolve complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmScheduleHearing = async () => {
    if (!hearingDate || !hearingTime) {
      alert("Hearing Date and Hearing Time are required to schedule a hearing.");
      return;
    }

    const nextHearingNo = (hearings.length || 0) + 1;
    setActionLoading(true);
    try {
      await hearingsApi.save({
        complaintId: id,
        hearingNumber: nextHearingNo,
        hearingDate,
        hearingTime,
        timeConsumed,
        assignedMediator,
        venue,
        witnesses: witnesses.map((w) => `${w.name}${w.address ? ` (${w.address})` : ""}`),
        complaintStatus: "Scheduled",
        status: "Scheduled",
      });

      setShowScheduleModal(false);
      router.push("/admin/complaints");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule hearing.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading case history...
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

  const latestHearingNum = complaint.latestHearingNumber || hearings.length || 0;
  const isUnsettled = complaint.status === "Unsettled";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`CASE PROGRESS — Complaint #${complaint.complaintNo}`}
        action={
          <Link
            href="/admin/complaints"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            ← Back to Complaints
          </Link>
        }
      />

      {/* Case Overview Card */}
      <div className="admin-card p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Complaint Information
          </h3>
          <StatusBadge status={complaint.status} hearingNumber={latestHearingNum} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoItem label="Complaint #" value={complaint.complaintNo} />
          <InfoItem label="Date Filed" value={complaint.dateFiled} />
          <InfoItem label="Category" value={complaint.category} />
          <div>
            <p className="text-xs text-gray-500 font-medium">Priority</p>
            <div className="mt-1">
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
          <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {complaint.description || "No description available."}
          </p>
        </div>

        {complaint.evidence && complaint.evidence.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Evidence Submitted</p>
            <div className="flex flex-wrap gap-2">
              {complaint.evidence.map((ev, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2.5 py-1 rounded text-gray-700">
                  <MaterialIcon name="attach_file" className="text-sm text-primary" />
                  {ev}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complainant & Editable Respondent Information */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Complainant Card */}
        <div className="admin-card p-5 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 pb-2 border-b border-gray-100">
            <MaterialIcon name="person" className="text-primary text-xl" />
            Complainant Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoItem label="Full Name" value={complaint.complainantInfo.name || complaint.complainant} />
            <InfoItem label="Age" value={complaint.complainantInfo.age ? `${complaint.complainantInfo.age} yrs` : "N/A"} />
            <InfoItem label="Address" value={complaint.complainantInfo.address || "N/A"} />
            <InfoItem label="Mobile Number" value={complaint.complainantInfo.contact || "N/A"} />
            <InfoItem label="Email / Gmail" value={complaint.complainantInfo.email || "N/A"} />
          </div>
        </div>

        {/* Editable Respondent Card */}
        <form onSubmit={handleSaveRespondent} className="admin-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
              <MaterialIcon name="edit" className="text-primary text-xl" />
              Respondent Information (Editable)
            </h3>
            <button
              type="submit"
              disabled={savingRespondent}
              className="btn btn-primary btn-sm"
            >
              {savingRespondent ? "Saving..." : "Save Info"}
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-500">Full Name *</label>
              <input
                type="text"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                required
                className="w-full mt-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Complete Address</label>
              <input
                type="text"
                value={respondentAddress}
                onChange={(e) => setRespondentAddress(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500">Mobile Number</label>
                <input
                  type="text"
                  value={respondentContact}
                  onChange={(e) => setRespondentContact(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Gmail / Email</label>
                <input
                  type="email"
                  value={respondentEmail}
                  onChange={(e) => setRespondentEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Witnesses Section */}
      <div className="admin-card p-5 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 pb-2 border-b border-gray-100">
          <MaterialIcon name="groups" className="text-primary text-xl" />
          Witnesses Section (Optional)
        </h3>

        {/* Existing Witness List */}
        {witnesses.length > 0 ? (
          <div className="space-y-2">
            {witnesses.map((w, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-sm">
                <div>
                  <strong className="text-gray-900">{w.name}</strong>
                  {w.address && <span className="text-gray-500 text-xs ml-2">({w.address})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveWitness(idx)}
                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No witnesses added yet.</p>
        )}

        {/* Add Witness Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-100">
          <input
            type="text"
            placeholder="Witness Full Name"
            value={newWitnessName}
            onChange={(e) => setNewWitnessName(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            placeholder="Witness Address (Optional)"
            value={newWitnessAddress}
            onChange={(e) => setNewWitnessAddress(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={handleAddWitness}
            className="btn btn-secondary btn-sm"
          >
            + Add Witness
          </button>
        </div>
      </div>

      {/* Historical Hearings List */}
      <div className="admin-card p-5 space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 pb-2 border-b border-gray-100">
          <MaterialIcon name="history" className="text-primary text-xl" />
          Hearing History
        </h3>

        {hearings.length > 0 ? (
          <div className="space-y-4">
            {hearings.map((h) => (
              <div key={h.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 text-sm">
                    {h.hearingNumber === 1 && "FIRST HEARING"}
                    {h.hearingNumber === 2 && "SECOND HEARING"}
                    {h.hearingNumber === 3 && "THIRD HEARING"}
                    {h.hearingNumber === 4 && "FOURTH HEARING"}
                    {h.hearingNumber > 4 && `HEARING #${h.hearingNumber}`}
                  </h4>
                  <StatusBadge status="Scheduled" hearingNumber={h.hearingNumber} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium">Hearing Date:</span>
                    <p className="font-semibold text-gray-800">{h.date || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Hearing Time:</span>
                    <p className="font-semibold text-gray-800">{h.time || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Time Consumed:</span>
                    <p className="font-semibold text-gray-800">{h.timeConsumed || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Assigned Mediator:</span>
                    <p className="font-semibold text-gray-800">{h.assignedMediator || "N/A"}</p>
                  </div>
                </div>

                {h.decision && (
                  <div className="text-xs">
                    <span className="text-gray-500 font-medium">Decision:</span>
                    <p className="font-medium text-gray-900 bg-white p-2 rounded border border-gray-200 mt-0.5">
                      {h.decision}
                    </p>
                  </div>
                )}

                {h.mediationNotes && (
                  <div className="text-xs">
                    <span className="text-gray-500 font-medium">Message / Notes:</span>
                    <p className="text-gray-700 bg-white p-2 rounded border border-gray-200 mt-0.5">
                      {h.mediationNotes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No hearing records scheduled or conducted yet.</p>
        )}
      </div>

      {/* Prominent Unsettled Notice */}
      {isUnsettled && (
        <div className="rounded-xl border-2 border-slate-900 bg-slate-900 p-6 text-center text-white space-y-2 shadow-lg">
          <MaterialIcon name="gavel" className="text-4xl text-amber-400 block mx-auto" />
          <h3 className="text-lg font-black uppercase tracking-wider text-amber-400">
            CASE UNSETTLED
          </h3>
          <p className="text-base font-extrabold uppercase tracking-widest text-slate-100">
            &quot;FOR FURTHER SETTLEMENT WILL PROCEED TO TRIAL COURT.&quot;
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={() => router.push("/admin/complaints")}
          className="btn btn-secondary btn-lg min-w-[120px]"
        >
          <MaterialIcon name="arrow_back" />
          BACK
        </button>

        {!isUnsettled && complaint.status !== "Resolved" && complaint.status !== "Cancelled" && (
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
              onClick={() => {
                if (latestHearingNum > 0) {
                  // Direct to next stage hearing page or next summon
                  router.push(`/admin/complaints/${id}/hearing/${latestHearingNum}`);
                } else {
                  setShowScheduleModal(true);
                }
              }}
              disabled={actionLoading}
              className="btn btn-primary btn-lg min-w-[180px]"
            >
              <MaterialIcon name="event" />
              {latestHearingNum === 0 && "SCHEDULE HEARING"}
              {latestHearingNum === 1 && "GO TO FIRST HEARING"}
              {latestHearingNum === 2 && "GO TO SECOND HEARING"}
              {latestHearingNum === 3 && "GO TO THIRD HEARING"}
              {latestHearingNum === 4 && "GO TO FOURTH HEARING"}
              {latestHearingNum > 4 && `GO TO HEARING #${latestHearingNum}`}
            </button>
          </>
        )}
      </div>

      {/* Modal for Scheduling First Hearing */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
              Schedule 1st Hearing
            </h3>

            <div className="space-y-3 text-sm">
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
                <label className="block text-xs font-semibold text-gray-600">Time Consumed (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 1 hour 30 mins"
                  value={timeConsumed}
                  onChange={(e) => setTimeConsumed(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600">Assigned Mediator</label>
                <input
                  type="text"
                  placeholder="e.g. Kagawad Juan Cruz"
                  value={assignedMediator}
                  onChange={(e) => setAssignedMediator(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmScheduleHearing}
                disabled={actionLoading}
                className="btn btn-primary btn-sm"
              >
                {actionLoading ? "Scheduling..." : "Schedule & Set Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
