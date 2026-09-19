"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { complaintsApi, summonsApi } from "@/services/api";
import type { Complaint } from "@/lib/types";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { PageHeader } from "@/components/admin/PageHeader";
import { printCurrentPage } from "@/components/admin/PrintButton";
import SummonPaper from "@/components/admin/summon/SummonPaper";

export default function GenerateSummonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [summonNo] = useState(`S-${String(Math.floor(Math.random() * 900) + 100).padStart(5, "0")}`);
  const [hearingDate, setHearingDate] = useState("2026-07-15");
  const [hearingTime, setHearingTime] = useState("9:00 AM");
  const [venue, setVenue] = useState("Barangay Hall Conference Room");
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    complaintsApi
      .getById(id)
      .then(setComplaint)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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

  const handleGenerate = async () => {
    setSaving(true);
    try {
      await summonsApi.create({
        complaintId: id,
        hearingDate,
        hearingTime,
        venue,
        officer: "Brgy. Captain Reyes",
        summonNo,
      });
      setGenerated(true);
    } catch (err) {
      console.error(err);
      alert("Failed to generate summon.");
    } finally {
      setSaving(false);
    }
  };

  const handleNotify = async () => {
    try {
      await summonsApi.notify(id);
      alert("Notification sent to respondent.");
    } catch (err) {
      console.error(err);
      alert("Failed to send notification.");
    }
  };

  return (
    <div className="summon-page-root printable-content space-y-5">
      <div className="no-print">
        <PageHeader title="Generate Summon" />
      </div>

      {generated && (
        <div className="no-print rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-green-700">
            <MaterialIcon name="check_circle" />
            <p className="font-medium">
              Summon generated successfully. Status changed to{" "}
              <strong>Scheduled</strong>.
            </p>
          </div>
        </div>
      )}

      <div
        id="summon-form"
        className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm print:border-none print:shadow-none print:p-0"
      >
        <SummonPaper />
      </div>

      <div className="no-print flex flex-wrap justify-center gap-3">
        {!generated ? (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={saving}
            className="btn btn-primary btn-lg"
          >
            <MaterialIcon name="description" className="text-lg" />
            {saving ? "Generating..." : "Generate Summon"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void printCurrentPage()}
              className="btn btn-secondary btn-lg"
            >
              <MaterialIcon name="print" className="text-lg" />
              Print Summon
            </button>
            <button
              type="button"
              onClick={handleNotify}
              className="btn btn-secondary btn-lg"
            >
              <MaterialIcon name="send" className="text-lg" />
              Send Notification
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/complaints")}
              className="btn btn-primary btn-lg"
            >
              <MaterialIcon name="arrow_forward" className="text-lg" />
              Back to Complaints
            </button>
          </>
        )}
      </div>
    </div>
  );
}
