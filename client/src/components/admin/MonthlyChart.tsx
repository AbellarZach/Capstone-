"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyAnalytics } from "@/lib/types";

export function MonthlyChart({ data }: { data: MonthlyAnalytics[] }) {
  return (
    <ResponsiveContainer width="100%" height={300} >
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="complaints"
          name="Complaints"
          stroke="#0575FF"
          strokeWidth={2}
          dot={{ fill: "#0575FF", r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="resolved"
          name="Resolved"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ fill: "#22c55e", r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="scheduled"
          name="Scheduled"
          stroke="#a855f7"
          strokeWidth={2}
          dot={{ fill: "#a855f7", r: 4 }}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}
