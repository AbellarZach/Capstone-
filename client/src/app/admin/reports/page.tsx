"use client";

import {
  reportStats,
  categoryReports,
  priorityReports,
  monthlyAnalytics,
} from "@/lib/mock-data";
import { PageHeader } from "@/components/admin/PageHeader";
import { GlassStatCard } from "@/components/admin/GlassStatCard";
import {
  CategoryPieChart,
  MonthlyBarChart,
  ResolutionLineChart,
} from "@/components/admin/ReportCharts";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GlassStatCard
          label="Total Complaints"
          value={reportStats.totalComplaints}
          icon="assignment"
          variant="blue"
        />
        <GlassStatCard
          label="Resolved Rate"
          value={`${reportStats.resolvedRate}%`}
          icon="trending_up"
          variant="green"
        />
        <GlassStatCard
          label="Avg Resolution Time"
          value={`${reportStats.avgResolutionTime} days`}
          icon="schedule"
          variant="purple"
        />
        <GlassStatCard
          label="Active Cases"
          value={reportStats.activeCases}
          icon="folder_open"
          variant="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="admin-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Complaint Categories
          </h3>
          <CategoryPieChart data={categoryReports} />
        </div>
        <div className="admin-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Monthly Complaints
          </h3>
          <MonthlyBarChart data={monthlyAnalytics} />
        </div>
        <div className="admin-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Resolution Trend
          </h3>
          <ResolutionLineChart data={monthlyAnalytics} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Top Complaints
          </h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="pb-3 pr-4">Complaint Category</th>
                <th className="pb-3">Total Cases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categoryReports.map((c) => (
                <tr key={c.category}>
                  <td className="py-3 pr-4 text-gray-900">{c.category}</td>
                  <td className="py-3 font-semibold text-primary">{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Priority Analytics
          </h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="pb-3 pr-4">Priority</th>
                <th className="pb-3">Cases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {priorityReports.map((p) => (
                <tr key={p.priority}>
                  <td className="py-3 pr-4 text-gray-900">{p.priority}</td>
                  <td className="py-3 font-semibold text-primary">{p.cases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => alert("Exporting PDF report...")}
          className="btn btn-primary btn-lg"
        >
          <MaterialIcon name="picture_as_pdf" className="text-lg" />
          Export PDF
        </button>
        <button
          type="button"
          onClick={() => alert("Exporting Excel report...")}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <MaterialIcon name="table_chart" className="text-lg" />
          Export Excel
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <MaterialIcon name="print" className="text-lg" />
          Print Report
        </button>
      </div>
    </div>
  );
}
