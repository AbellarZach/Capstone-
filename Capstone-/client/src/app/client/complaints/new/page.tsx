"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/services/api";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { COMPLAINT_CATEGORIES } from "@/lib/complaint-utils";
import { ClientPageShell } from "../../components/ClientPageShell";

export default function NewComplaintPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [respondentAddress, setRespondentAddress] = useState("");
  const [respondentContact, setRespondentContact] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previews = useMemo(
    () =>
      evidenceFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [evidenceFiles]
  );

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setEvidenceFiles((prev) => [...prev, ...files].slice(0, 8));
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!category || !respondentName) {
      setError("Please fill in category and respondent name.");
      return;
    }
    setLoading(true);

    try {
      await clientApi.createComplaint({
        category,
        respondentName,
        respondentAddress,
        respondentContact,
        respondentEmail,
        description,
        evidenceFiles,
      });
      router.push("/client/complaints");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Unable to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientPageShell
      title="File a Complaint"
      subtitle="Submit a new complaint to the barangay office."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
      >
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {/* Category Dropdown */}
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Category</span>
          <div className="relative mt-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#059669] focus:bg-white focus:ring-2 focus:ring-emerald-100 cursor-pointer"
              required
            >
              <option value="" disabled>
                Select complaint category
              </option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <MaterialIcon name="expand_more" className="text-[20px]" />
            </span>
          </div>
        </label>

        {/* Respondent Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Respondent Name</span>
            <input
              value={respondentName}
              onChange={(e) => setRespondentName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#059669] focus:bg-white focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter respondent name"
              required
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Respondent Contact</span>
            <input
              value={respondentContact}
              onChange={(e) => setRespondentContact(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#059669] focus:bg-white focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter contact number"
            />
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Complete Address for Respondent</span>
            <input
              value={respondentAddress}
              onChange={(e) => setRespondentAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#059669] focus:bg-white focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter complete address (House No., Street, Barangay)"
              required
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Respondent Email</span>
            <input
              type="email"
              value={respondentEmail}
              onChange={(e) => setRespondentEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#059669] focus:bg-white focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter email address"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#059669]"
            placeholder="Describe what happened"
          />
        </label>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Evidence Images</p>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-[#059669] hover:bg-emerald-50/40">
            <MaterialIcon name="cloud_upload" className="text-3xl text-[#059669]" />
            <span className="mt-2 text-sm font-semibold text-slate-700">
              Click to upload image evidence
            </span>
            <span className="mt-1 text-xs text-slate-500">
              Up to 8 images (JPG, PNG, WEBP)
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
          </label>

          {previews.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((preview, index) => (
                <div key={`${preview.name}-${index}`} className="relative overflow-hidden rounded-xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview.url} alt={preview.name} className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/client/complaints")}
            className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#059669] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#047857] disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </form>
    </ClientPageShell>
  );
}
