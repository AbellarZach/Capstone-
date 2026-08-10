"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { complaintsApi, hearingsApi } from "@/services/api";
import type { Complaint, Hearing } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export default function HearingStagePage({
  params,
}: {
  params: Promise<{ id: string; stage: string }>;
}) {
  const { id, stage } = use(params);
  const router = useRouter();

  const stageNumber = Math.max(1, Math.min(3, Number(stage) || 1));

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [currentHearing, setCurrentHearing] = useState<Hearing | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const cData = await complaintsApi.getById(id);
      setComplaint(cData);

      const hData = await hearingsApi.getByComplaint(id);
      setHearings(hData);

      const found = hData.find((h) => h.hearingNumber === stageNumber);
      if (found) {
        setCurrentHearing(found);
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

  const handleProceedNextSummon = (nextStage: number) => {
    router.push(`/admin/complaints/${id}/summon/${nextStage}`);
  };

  const stageTitles: Record<number, string> = {
    1: "First Hearing",
    2: "Second Hearing",
    3: "Third Hearing",
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500 text-sm">
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

  // Fallbacks for complainant, respondent, witness, hearing values
  const complainantName = complaint.complainantInfo?.name || complaint.complainant || "N/A";
  const complainantEmail = complaint.complainantInfo?.email || "N/A";
  const complainantContact = complaint.complainantInfo?.contact || "N/A";
  const complainantAddress = complaint.complainantInfo?.address || "N/A";

  const respondentName = complaint.respondentInfo?.name || complaint.respondent || "N/A";
  const respondentAddress = complaint.respondentInfo?.address || "N/A";
  const respondentContact = complaint.respondentInfo?.contact || "N/A";
  const respondentEmail = complaint.respondentInfo?.email || "N/A";

  const witnessObj = (currentHearing?.witnesses && currentHearing.witnesses.length > 0)
    ? currentHearing.witnesses[0]
    : null;
  const witnessName = typeof witnessObj === "string"
    ? witnessObj
    : (witnessObj && typeof witnessObj === "object" && "name" in (witnessObj as object) ? String((witnessObj as any).name) : "N/A");
  const witnessAddress = witnessObj && typeof witnessObj === "object" && "address" in (witnessObj as object)
    ? String((witnessObj as any).address)
    : "N/A";

  const hearingDate = currentHearing?.date || complaint.hearingDate || "N/A";
  const hearingTime = currentHearing?.time || complaint.hearingTime || "N/A";
  const timeConsumed = currentHearing?.timeConsumed || "N/A";
  const assignedMediator = currentHearing?.assignedMediator || "N/A";
  const decision = currentHearing?.decision || "N/A";
  const messageNotes = currentHearing?.mediationNotes || "No notes available for this hearing.";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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

      {/* Display Previous Hearing Records if existing */}
      {previousHearings.length > 0 && (
        <div className="admin-card p-5 space-y-3">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
            <MaterialIcon name="history" className="text-primary text-lg" />
            Previous Hearing Records [READ ONLY]
          </h3>
          <div className="space-y-3">
            {previousHearings.map((ph) => (
              <div key={ph.id} className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span>HEARING #{ph.hearingNumber} RECORD [READ ONLY]</span>
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

      {/* Main Hearing Display Form (Read-Only matching Reference Image Structure) */}
      <div className="admin-card p-6 md:p-8 bg-white space-y-6 border border-gray-200 shadow-sm rounded-2xl">
        {/* Section 1: Complainant Information */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900">Complainant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 font-medium">Full Name</p>
              <p className="font-bold text-gray-900 mt-0.5">{complainantName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Email Address</p>
              <p className="font-bold text-gray-900 mt-0.5">{complainantEmail}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mobile Number</p>
              <p className="font-bold text-gray-900 mt-0.5">{complainantContact}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Complete Address</p>
              <p className="font-bold text-gray-900 mt-0.5">{complainantAddress}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Respondent Information */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-gray-900">Respondent Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Full Name</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-800 text-sm">
                {respondentName}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Complete Address</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-800 text-sm">
                {respondentAddress}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Mobile Number</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-800 text-sm">
                {respondentContact}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Email Address</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-800 text-sm">
                {respondentEmail}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Witness */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-gray-900">Witness</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Full Name</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-800 text-sm">
                {witnessName}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Complete Address</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-800 text-sm">
                {witnessAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Hearing Schedule & Decision */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-base font-bold text-gray-900 mb-1">Hearing Date</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-full bg-white flex items-center justify-between font-medium text-gray-800 text-sm shadow-sm">
                <span>{hearingDate}</span>
                <MaterialIcon name="calendar_today" className="text-gray-400 text-lg" />
              </div>
            </div>
            <div className="hidden md:block" />

            <div>
              <p className="text-base font-bold text-gray-900 mb-1">Hearing Time</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-full bg-white font-medium text-gray-800 text-sm shadow-sm">
                {hearingTime}
              </div>
            </div>

            <div>
              <p className="text-base font-bold text-gray-900 mb-1">Time Consumed</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-full bg-white font-medium text-gray-800 text-sm shadow-sm">
                {timeConsumed}
              </div>
            </div>

            <div>
              <p className="text-base font-bold text-gray-900 mb-1">Assign Mediator</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-full bg-white flex items-center justify-between font-medium text-gray-800 text-sm shadow-sm">
                <span>{assignedMediator}</span>
                <MaterialIcon name="expand_more" className="text-gray-400 text-xl" />
              </div>
            </div>

            <div>
              <p className="text-base font-bold text-gray-900 mb-1">Decision</p>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-full bg-white flex items-center justify-between font-medium text-gray-800 text-sm shadow-sm">
                <span>{decision}</span>
                <MaterialIcon name="expand_more" className="text-gray-400 text-xl" />
              </div>
            </div>
          </div>

          <div>
            <div className="w-full p-4 border border-gray-200 rounded-2xl bg-white text-sm text-gray-800 leading-relaxed shadow-sm min-h-[100px]">
              &ldquo;{messageNotes}&rdquo;
            </div>
          </div>
        </div>

        {/* Action Buttons matching Reference Image layout */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.push("/admin/complaints")}
            className="px-8 py-2.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold text-sm transition-colors min-w-[120px]"
          >
            Back
          </button>

          {stageNumber === 1 && (
            <button
              type="button"
              onClick={() => handleProceedNextSummon(2)}
              className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors min-w-[160px]"
            >
              Second Hearing
            </button>
          )}

          {stageNumber === 2 && (
            <button
              type="button"
              onClick={() => handleProceedNextSummon(3)}
              className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors min-w-[160px]"
            >
              Third Hearing
            </button>
          )}

          {stageNumber === 3 && (
            <button
              type="button"
              onClick={() => handleProceedNextSummon(4)}
              className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors min-w-[160px]"
            >
              Fourth Hearing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
