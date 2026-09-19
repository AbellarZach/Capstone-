"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { hearingsApi } from "@/services/api";
import { PageHeader } from "@/components/admin/PageHeader";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { PrintButton } from "@/components/admin/PrintButton";
import SummonPaper from "@/components/admin/summon/SummonPaper";

export default function StageSummonFormPage({
  params,
}: {
  params: Promise<{ id: string; stage: string }>;
}) {
  const { id, stage } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const stageNum = Number(stage) || 2;
  const stageOrdinals: Record<number, string> = {
    1: "FIRST",
    2: "SECOND",
    3: "THIRD",
    4: "FOURTH",
  };
  const stageOrdinal = stageOrdinals[stageNum] || `${stageNum}TH`;

  const initSummon = useCallback(async () => {
    try {
      await hearingsApi.save({
        complaintId: id,
        hearingNumber: stageNum,
        complaintStatus: "In Progress",
        status: "In Progress",
      });
    } catch (err) {
      console.error(`Failed to initialize summon ${stageNum} stage`, err);
    } finally {
      setLoading(false);
    }
  }, [id, stageNum]);

  useEffect(() => {
    initSummon();
  }, [initSummon]);

  const handleBack = async () => {
    try {
      await hearingsApi.save({
        complaintId: id,
        hearingNumber: stageNum,
        complaintStatus: "In Progress",
        status: "In Progress",
      });
    } catch (err) {
      console.error(`Failed to preserve In Progress ${stageNum} status`, err);
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
    <div className="summon-page-root printable-content space-y-5 max-w-4xl mx-auto">
      {/* Header controls (Hidden on print) */}
      <div className="no-print">
        <PageHeader
          title={`${stageOrdinal} KP Summon Form`}
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
      <div>
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
        <PrintButton label="PRINT" />
      </div>
    </div>
  );
}
