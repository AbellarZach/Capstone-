"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CategoryReport, MonthlyAnalytics } from "@/lib/types";

const PIE_COLORS = ["#0575FF", "#22c55e", "#f59e0b", "#a855f7", "#ef4444"];

export function CategoryPieChart({ data }: { data: CategoryReport[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="total"
          nameKey="category"
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBarChart({ data }: { data: MonthlyAnalytics[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        />
        <Legend />
        <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        <Bar dataKey="inProgress" name="In Progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="scheduled" name="Scheduled" fill="#a855f7" radius={[4, 4, 0, 0]} />
        <Bar dataKey="resolved" name="Resolved" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="unsettled" name="Unsettled" fill="#dc2626" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ResolutionLineChart({ data }: { data: MonthlyAnalytics[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        />
        <Legend />
        <Bar dataKey="complaints" name="Total Filed" fill="#0066ff" radius={[6, 6, 0, 0]} />
        <Bar dataKey="resolved" name="Resolved" fill="#22c55e" radius={[6, 6, 0, 0]} />
        <Bar dataKey="unsettled" name="Unsettled" fill="#dc2626" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
