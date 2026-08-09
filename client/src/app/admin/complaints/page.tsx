"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { complaintsApi } from "@/services/api";
import type { Complaint } from "@/lib/types";
import { normalizeStatus } from "@/lib/complaint-utils";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PriorityBadge } from "@/components/admin/PriorityBadge";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export default function ManageComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchComplaints = useCallback(() => {
    setLoading(true);
    complaintsApi
      .getAll({
        search: search.trim(),
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
      })
      .then(setComplaints)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    complaintsApi
      .getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setCategoryFilter("");
  };

  const getTargetRoute = (c: Complaint) => {
    const normStatus = normalizeStatus(c.status);
    const stage = c.latestHearingNumber && c.latestHearingNumber > 0 ? c.latestHearingNumber : 1;

    switch (normStatus) {
      case "Pending":
        return `/admin/complaints/${c.id}/pending`;
      case "In Progress":
        return `/admin/complaints/${c.id}/progress`;
      case "Scheduled":
        return `/admin/complaints/${c.id}/hearing/${stage}`;
      case "Resolved":
      case "Unsettled":
        return `/admin/complaints/${c.id}/progress`;
      case "Cancelled":
        return `/admin/complaints/${c.id}/pending`;
      default:
        return `/admin/complaints/${c.id}/progress`;
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Complaints Management" />

      {/* Filter and Search Bar Card */}
      <div className="admin-card p-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <MaterialIcon name="search" className="text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search Complaint #, Name, Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Resolved">Resolved</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Unsettled">Unsettled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{complaints.length}</strong> complaints
          </p>
          {(search || statusFilter || priorityFilter || categoryFilter) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <MaterialIcon name="filter_alt_off" className="text-sm" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints Table Card */}
      <div className="admin-card admin-table-wrap">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-gray-500 text-sm">
            Loading complaints...
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Complaint #</th>
                <th style={{ width: "11%" }}>Date Filed</th>
                <th style={{ width: "14%" }}>Complainant</th>
                <th style={{ width: "14%" }}>Respondent</th>
                <th style={{ width: "14%" }}>Category</th>
                <th style={{ width: "9%" }}>Priority</th>
                <th style={{ width: "14%" }}>Status</th>
                <th style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td className="font-semibold text-primary">{c.complaintNo}</td>
                  <td className="text-gray-600">{c.dateFiled}</td>
                  <td className="wrap-cell text-gray-900 font-medium">{c.complainant}</td>
                  <td className="wrap-cell text-gray-700">{c.respondent}</td>
                  <td className="wrap-cell text-gray-600">{c.category}</td>
                  <td>
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td>
                    <StatusBadge status={c.status} hearingNumber={c.latestHearingNumber} />
                  </td>
                  <td>
                    <Link href={getTargetRoute(c)} className="btn btn-primary btn-sm">
                      VIEW
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && complaints.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            <MaterialIcon name="search_off" className="mx-auto mb-2 text-3xl text-gray-400 block" />
            No complaints found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
