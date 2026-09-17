"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hearingsApi } from "@/services/api";
import { PageHeader } from "@/components/admin/PageHeader";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import SummonPaper from "@/components/admin/summon/SummonPaper";

export default function SummonFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const initSummon = useCallback(async () => {
    try {
      await hearingsApi.save({
        complaintId: id,
        hearingNumber: 1,
        complaintStatus: "In Progress",
        status: "In Progress",
      });
    } catch (err) {
      console.error("Failed to initialize summon 1 stage", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    initSummon();
  }, [initSummon]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = async () => {
    try {
      await hearingsApi.save({
        complaintId: id,
        hearingNumber: 1,
        complaintStatus: "In Progress",
        status: "In Progress",
      });
    } catch (err) {
      console.error("Failed to preserve In Progress 1 status", err);
    }
    router.push("/admin/complaints");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading summon form...
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header controls (Hidden on print) */}
      <div className="no-print">
        <PageHeader
          title="KP Summon Form — Complaint #"
          action={
            <button
              type="button"
              onClick={handleBack}
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              ← Back to Complaints
            </button>
          }
        />
      </div>

      {/* Printable Summon Container Area */}
      <div
        id="summon-print-area"
        className="admin-card p-8 bg-white border border-gray-300 rounded-xl shadow-sm print:border-none print:shadow-none print:p-0 print:m-0"
      >
        <SummonPaper />
      </div>

      {/* Buttons (Hidden on print) */}
      <div className="no-print flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-secondary btn-lg min-w-[120px]"
        >
          <MaterialIcon name="arrow_back" />
          BACK
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="btn btn-primary btn-lg min-w-[140px]"
        >
          <MaterialIcon name="print" />
          PRINT
        </button>
      </div>
    </div>
  );
}
