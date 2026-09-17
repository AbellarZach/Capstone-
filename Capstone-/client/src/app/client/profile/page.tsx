"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clientApi } from "@/services/api";
import type { AuthUser } from "@/lib/types";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { ClientPageShell } from "../components/ClientPageShell";
import { mediaUrl } from "@/lib/media";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const profile = await clientApi.getProfile();
        setUser(profile);
        setFullname(profile.fullname || "");
        setEmail(profile.email || "");
        setPhoneNumber(profile.phoneNumber || "");
        setLocation(
          localStorage.getItem(`client_location_${profile.id}`) ||
            "Purok 3, Barangay Gabi, Cordova, Cebu"
        );
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const initials = useMemo(() => {
    const name = fullname || user?.username || "R";
    return (
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "R"
    );
  }, [fullname, user?.username]);

  const avatarSrc = mediaUrl(user?.profilePicture);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(null);
    setUploadingPhoto(true);
    try {
      const updated = await clientApi.uploadProfilePicture(file);
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setSuccess("Profile picture updated successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Unable to upload profile picture.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveField = async (fieldKey?: string) => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const updated = await clientApi.updateProfile({
        fullname: fullname.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || null,
      });
      setUser(updated);
      setFullname(updated.fullname || "");
      setEmail(updated.email || "");
      setPhoneNumber(updated.phoneNumber || "");
      localStorage.setItem("user", JSON.stringify(updated));
      if (updated.id) {
        localStorage.setItem(`client_location_${updated.id}`, location.trim());
      }
      if (fieldKey) {
        setEditing((prev) => ({ ...prev, [fieldKey]: false }));
      } else {
        setEditing({});
      }
      setSuccess("Profile details saved successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Unable to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClientPageShell
      title="Resident Profile"
      subtitle="Manage your personal credentials, contact numbers, and residency details"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#059669] border-t-transparent" />
            <p className="mt-3 text-sm font-medium text-slate-600">Loading profile data...</p>
          </div>
        ) : error && !user ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <p className="font-semibold text-rose-700">{error}</p>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Feedback Notifications */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800 shadow-xs">
                <MaterialIcon name="error_outline" className="text-xl text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 shadow-xs">
                <MaterialIcon name="check_circle" className="text-xl text-emerald-600 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* 1. Modern Avatar Header Card */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Modern Avatar with Uploader */}
                <div className="relative shrink-0">
                  <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#047857] to-[#059669] text-3xl sm:text-4xl font-bold text-white shadow-md ring-4 ring-slate-100">
                    {avatarSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>

                  {/* Floating Camera / Edit Trigger */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute bottom-0 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-emerald-50 hover:text-[#047857] disabled:opacity-60 cursor-pointer"
                    aria-label="Upload profile picture"
                    title="Upload profile picture"
                  >
                    <MaterialIcon name="photo_camera" className="text-[18px]" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>

                {/* Identity Summary */}
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      {fullname || user.username}
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-[#16A34A] border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                      Verified Resident
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">{email || "No email registered"}</p>

                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium">
                      <MaterialIcon name="badge" className="text-sm text-slate-400" />
                      ID: RES-{String(user.id).padStart(5, "0")}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium">
                      <MaterialIcon name="home" className="text-sm text-slate-400" />
                      Barangay Gabi Constituent
                    </span>
                  </div>

                  {uploadingPhoto && (
                    <p className="mt-2 text-xs font-medium text-[#059669] animate-pulse">
                      Uploading new profile picture...
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Grouped Profile Details: Clean Form Sections with Subtle Inline Edit Triggers */}
            <div className="grid gap-6">
              {/* Personal Information Section */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                  <p className="text-xs text-slate-500">Legal identity registered for barangay dispute records</p>
                </div>

                <div className="divide-y divide-slate-100">
                  <ProfileFieldRow
                    icon="badge"
                    label="Name"
                    value={fullname}
                    placeholder="Enter full legal name"
                    editing={!!editing.fullname}
                    saving={saving}
                    onStartEdit={() => setEditing((prev) => ({ ...prev, fullname: true }))}
                    onCancelEdit={() => setEditing((prev) => ({ ...prev, fullname: false }))}
                    onSave={() => handleSaveField("fullname")}
                    onChange={setFullname}
                  />

                  <ProfileFieldRow
                    icon="email"
                    label="Email Account"
                    value={email}
                    placeholder="Enter active email address"
                    editing={!!editing.email}
                    saving={saving}
                    onStartEdit={() => setEditing((prev) => ({ ...prev, email: true }))}
                    onCancelEdit={() => setEditing((prev) => ({ ...prev, email: false }))}
                    onSave={() => handleSaveField("email")}
                    onChange={setEmail}
                  />
                </div>
              </div>

              {/* Contact & Location Section */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Contact & Residency Details</h3>
                  <p className="text-xs text-slate-500">Used by the Lupon Tagapamayapa for summons and conciliation notices</p>
                </div>

                <div className="divide-y divide-slate-100">
                  <ProfileFieldRow
                    icon="phone"
                    label="Mobile Number"
                    value={phoneNumber}
                    placeholder="+63 9XX XXX XXXX"
                    editing={!!editing.phoneNumber}
                    saving={saving}
                    onStartEdit={() => setEditing((prev) => ({ ...prev, phoneNumber: true }))}
                    onCancelEdit={() => setEditing((prev) => ({ ...prev, phoneNumber: false }))}
                    onSave={() => handleSaveField("phoneNumber")}
                    onChange={setPhoneNumber}
                  />

                  <ProfileFieldRow
                    icon="location_on"
                    label="Location"
                    value={location}
                    placeholder="Purok / Sitio, Barangay Gabi, Cordova, Cebu"
                    editing={!!editing.location}
                    saving={saving}
                    onStartEdit={() => setEditing((prev) => ({ ...prev, location: true }))}
                    onCancelEdit={() => setEditing((prev) => ({ ...prev, location: false }))}
                    onSave={() => handleSaveField("location")}
                    onChange={setLocation}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveField()}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#059669] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#047857] disabled:opacity-60"
              >
                <MaterialIcon name="save" className="text-lg" />
                <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </ClientPageShell>
  );
}

function ProfileFieldRow({
  icon,
  label,
  value,
  placeholder,
  editing,
  saving,
  onStartEdit,
  onCancelEdit,
  onSave,
  onChange,
}: {
  icon: string;
  label: string;
  value: string;
  placeholder?: string;
  editing: boolean;
  saving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
      {/* Field Label */}
      <div className="flex items-center gap-3 sm:w-48 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <MaterialIcon name={icon} className="text-[18px]" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
      </div>

      {/* Field Value or Input */}
      <div className="min-w-0 flex-1 sm:px-4">
        {editing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 font-medium outline-none transition focus:border-[#059669] focus:bg-white focus:ring-2 focus:ring-emerald-100"
            autoFocus
          />
        ) : (
          <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">
            {value || <span className="text-slate-400 font-normal italic">Not specified</span>}
          </p>
        )}
      </div>

      {/* Subtle Inline Edit Trigger / Save Controls */}
      <div className="flex items-center justify-end gap-2 shrink-0">
        {editing ? (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={onSave}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#047857] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800"
            >
              <MaterialIcon name="check" className="text-sm" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <span>Cancel</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onStartEdit}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-1.5 text-xs font-bold text-[#047857] transition hover:bg-emerald-100/80 hover:border-emerald-300 shadow-xs"
            aria-label={`Edit ${label}`}
          >
            <MaterialIcon name="edit" className="text-[14px]" />
            <span>Edit</span>
          </button>
        )}
      </div>
    </div>
  );
}
