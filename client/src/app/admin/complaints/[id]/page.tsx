"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { complaintsApi } from "@/services/api";
import type { Complaint } from "@/lib/types";
import { normalizeStatus } from "@/lib/complaint-utils";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PriorityBadge } from "@/components/admin/PriorityBadge";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export default function ComplaintDetailPage({
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

  const status = complaint ? normalizeStatus(complaint.status) : null;

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await complaintsApi.approve(id);
      router.push(`/admin/summon/${id}`);
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
      await complaintsApi.reject(id);
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
        Loading complaint...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Complaint not found.</p>
        <Link href="/admin/complaints" className="mt-4 text-primary hover:underline">
          Back to complaints
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Complaint Details"
        action={
          <Link
            href="/admin/complaints"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            ← Back to Complaints
          </Link>
        }
      />

      <div className="admin-card p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Complaint Information
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <InfoItem label="Complaint Number" value={complaint.complaintNo} />
          <InfoItem label="Date Filed" value={complaint.dateFiled} />
          <InfoItem label="Category" value={complaint.category} />
          <div>
            <p className="text-xs text-gray-500">Priority</p>
            <div className="mt-1">
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <div className="mt-1">
              <StatusBadge status={complaint.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PersonCard
          title="Complainant Information"
          fields={[
            { label: "Full Name", value: complaint.complainantInfo.name },
            { label: "Address", value: complaint.complainantInfo.address },
            { label: "Contact Number", value: complaint.complainantInfo.contact },
            { label: "Email", value: complaint.complainantInfo.email ?? "—" },
          ]}
        />
        <PersonCard
          title="Respondent Information"
          fields={[
            { label: "Full Name", value: complaint.respondentInfo.name },
            { label: "Address", value: complaint.respondentInfo.address },
            { label: "Contact Number", value: complaint.respondentInfo.contact },
          ]}
        />
      </div>

      <div className="admin-card p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Complaint Description
        </h3>
        <p className="text-sm leading-relaxed text-gray-700">{complaint.description}</p>

        <h4 className="mb-2 mt-5 text-sm font-semibold text-gray-500">Evidence Upload</h4>
        <div className="space-y-2">
          {complaint.evidence.length > 0 ? (
            complaint.evidence.map((file) => (
              <div
                key={file}
                className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <MaterialIcon name="attach_file" className="text-lg text-primary" />
                {file}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No evidence uploaded.</p>
          )}
        </div>
      </div>

      {status === "Pending" && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleApprove}
            disabled={actionLoading}
            className="btn btn-success btn-lg"
          >
            <MaterialIcon name="check_circle" className="text-lg" />
            Approve Complaint
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={actionLoading}
            className="btn btn-danger btn-lg"
          >
            <MaterialIcon name="cancel" className="text-lg" />
            Cancel Complaint
          </button>
        </div>
      )}

      {status === "In Progress" && (
        <Link
          href={`/admin/summon/${id}`}
          className="btn btn-primary btn-lg"
        >
          <MaterialIcon name="description" className="text-lg" />
          Generate Summon
        </Link>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function PersonCard({
  title,
  fields,
}: {
  title: string;
  fields: { label: string; value: string }[];
}) {
  return (
    <div className="admin-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        <MaterialIcon name="person" className="text-lg text-primary" />
        {title}
      </h3>
      <dl className="space-y-3">
        {fields.map((f) => (
          <InfoItem key={f.label} label={f.label} value={f.value} />
        ))}
      </dl>
    </div>
  );
}
