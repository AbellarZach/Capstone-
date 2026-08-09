"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { complaintsApi } from "@/services/api";
import type { Complaint } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PriorityBadge } from "@/components/admin/PriorityBadge";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export default function PendingComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    complaintsApi
      .getById(id)
      .then(setComplaint)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this complaint?")) return;
    setActionLoading(true);
    try {
      await complaintsApi.approve(id);
      router.push(`/admin/complaints/${id}/summon`);
    } catch (err) {
      console.error(err);
      alert("Failed to approve complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this complaint?")) return;
    setActionLoading(true);
    try {
      await complaintsApi.updateStatus(id, "Cancelled");
      router.push("/admin/complaints");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading complaint details...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Complaint not found.</p>
        <Link href="/admin/complaints" className="mt-4 inline-block text-primary hover:underline text-sm font-medium">
          ← Back to Complaints
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <PageHeader
        title={`Pending Complaint #${complaint.complaintNo}`}
        action={
          <Link
            href="/admin/complaints"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            ← Back to Complaints
          </Link>
        }
      />

      {/* Complaint Details Summary Header */}
      <div className="admin-card p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          Complaint Details
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <InfoBox label="Complaint Number" value={complaint.complaintNo} />
          <InfoBox label="Date Filed" value={complaint.dateFiled} />
          <InfoBox label="Category" value={complaint.category} />
          <div>
            <p className="text-xs text-gray-500 font-medium">Priority</p>
            <div className="mt-1">
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Status</p>
            <div className="mt-1">
              <StatusBadge status={complaint.status} hearingNumber={complaint.latestHearingNumber} />
            </div>
          </div>
        </div>
      </div>

      {/* Complainant & Respondent Information */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="admin-card p-5 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 pb-2 border-b border-gray-100">
            <MaterialIcon name="person" className="text-primary text-xl" />
            Complainant Information
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoBox label="Full Name" value={complaint.complainantInfo.name || complaint.complainant} />
            <InfoBox label="Age" value={complaint.complainantInfo.age ? `${complaint.complainantInfo.age} yrs old` : "N/A"} />
            <InfoBox label="Complete Address" value={complaint.complainantInfo.address || "N/A"} colSpan={2} />
            <InfoBox label="Mobile Number" value={complaint.complainantInfo.contact || "N/A"} />
            <InfoBox label="Email / Gmail" value={complaint.complainantInfo.email || "N/A"} />
          </dl>
        </div>

        <div className="admin-card p-5 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 pb-2 border-b border-gray-100">
            <MaterialIcon name="person_outline" className="text-primary text-xl" />
            Respondent Information
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoBox label="Full Name" value={complaint.respondentInfo.name || complaint.respondent} />
            <InfoBox label="Age" value={complaint.respondentInfo.age ? `${complaint.respondentInfo.age} yrs old` : "N/A"} />
            <InfoBox label="Complete Address" value={complaint.respondentInfo.address || "N/A"} colSpan={2} />
            <InfoBox label="Mobile Number" value={complaint.respondentInfo.contact || "N/A"} />
            <InfoBox label="Email / Gmail" value={complaint.respondentInfo.email || "N/A"} />
          </dl>
        </div>
      </div>

      {/* Complaint Description & Evidence */}
      <div className="admin-card p-5 space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Complaint Description
          </h3>
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-800 leading-relaxed border border-gray-100">
            {complaint.description || "No description provided."}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Complaint Evidence
          </h3>
          {complaint.evidence && complaint.evidence.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {complaint.evidence.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm border border-gray-200">
                  <MaterialIcon name="attach_file" className="text-primary" />
                  <span className="text-gray-700 truncate">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No evidence submitted.</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={actionLoading}
          className="btn btn-danger btn-lg min-w-[140px]"
        >
          <MaterialIcon name="cancel" className="text-lg" />
          CANCEL
        </button>
        <button
          type="button"
          onClick={handleApprove}
          disabled={actionLoading}
          className="btn btn-success btn-lg min-w-[140px]"
        >
          <MaterialIcon name="check_circle" className="text-lg" />
          APPROVE
        </button>
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
  colSpan = 1,
}: {
  label: string;
  value: string;
  colSpan?: number;
}) {
  return (
    <div className={colSpan > 1 ? `sm:col-span-${colSpan}` : ""}>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
