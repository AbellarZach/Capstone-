"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { complaintsApi } from "@/services/api";
import type { Complaint } from "@/lib/types";
import { normalizeStatus, sortByPriority } from "@/lib/complaint-utils";
import { PageHeader } from "@/components/admin/PageHeader";
import { GlassStatCard } from "@/components/admin/GlassStatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PriorityBadge } from "@/components/admin/PriorityBadge";

export default function ManageComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintsApi
      .getAll()
      .then(setComplaints)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sortedComplaints = useMemo(() => sortByPriority(complaints), [complaints]);

  const total = complaints.length;
  const pending = complaints.filter((c) => normalizeStatus(c.status) === "Pending").length;
  const inProgress = complaints.filter((c) => normalizeStatus(c.status) === "In Progress").length;
  const scheduled = complaints.filter((c) => normalizeStatus(c.status) === "Scheduled").length;
  const resolved = complaints.filter((c) => normalizeStatus(c.status) === "Resolved").length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading complaints...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Manage Complaints" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <GlassStatCard label="Total" value={total} icon="assignment" variant="blue" />
        <GlassStatCard label="Pending" value={pending} icon="pending" variant="amber" />
        <GlassStatCard label="In Progress" value={inProgress} icon="sync" variant="purple" />
        <GlassStatCard label="Scheduled" value={scheduled} icon="event" variant="blue" />
        <GlassStatCard label="Resolved" value={resolved} icon="check_circle" variant="green" />
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "9%" }}>Complaint #</th>
              <th style={{ width: "14%" }}>Complainant</th>
              <th style={{ width: "14%" }}>Respondent</th>
              <th style={{ width: "12%" }}>Category</th>
              <th style={{ width: "9%" }}>Priority</th>
              <th style={{ width: "12%" }}>Status</th>
              <th style={{ width: "10%" }}>Date Filed</th>
              <th style={{ width: "8%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedComplaints.map((c) => (
              <tr key={c.id}>
                <td className="font-semibold text-primary">{c.complaintNo}</td>
                <td className="wrap-cell text-gray-900">{c.complainant}</td>
                <td className="wrap-cell text-gray-600">{c.respondent}</td>
                <td className="wrap-cell text-gray-600">{c.category}</td>
                <td>
                  <PriorityBadge priority={c.priority} />
                </td>
                <td>
                  <StatusBadge status={c.status} />
                </td>
                <td className="text-gray-600">{c.dateFiled}</td>
                <td>
                  <Link
                    href={`/admin/complaints/${c.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedComplaints.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No complaints found.</p>
        )}
      </div>
    </div>
  );
}
