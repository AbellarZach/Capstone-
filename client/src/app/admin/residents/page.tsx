"use client";

import { useState } from "react";
import { residents } from "@/lib/mock-data";
import type { Resident } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export default function ResidentsPage() {
  const [selected, setSelected] = useState<Resident | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Male",
    birthdate: "",
    civilStatus: "Single",
    address: "",
    contactNumber: "",
    email: "",
  });

  const handleView = (resident: Resident) => {
    setSelected(resident);
    setDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Resident saved successfully.");
    setShowAddForm(false);
    setFormData({
      fullName: "",
      gender: "Male",
      birthdate: "",
      civilStatus: "Single",
      address: "",
      contactNumber: "",
      email: "",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Residents"
        action={
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary btn-md"
          >
            <MaterialIcon name="add" className="text-lg" />
            Add Resident
          </button>
        }
      />

      <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Resident ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Date Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold text-primary">{r.id}</td>
                  <td className="text-gray-900">{r.fullName}</td>
                  <td className="wrap-cell text-gray-600">{r.address}</td>
                  <td className="text-gray-600">{r.contactNumber}</td>
                  <td className="text-gray-600">{r.dateRegistered}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleView(r)}
                      className="btn btn-primary btn-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {drawerOpen && selected && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 overlay-enter"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl drawer-enter">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Resident Information
              </h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <MaterialIcon name="close" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <dl className="space-y-4">
                <InfoRow label="Full Name" value={selected.fullName} />
                <InfoRow label="Birthdate" value={selected.birthdate} />
                <InfoRow label="Age" value={String(selected.age)} />
                <InfoRow label="Gender" value={selected.gender} />
                <InfoRow label="Civil Status" value={selected.civilStatus} />
                <InfoRow label="Address" value={selected.address} />
                <InfoRow label="Contact Number" value={selected.contactNumber} />
                <InfoRow label="Email" value={selected.email} />
                <InfoRow label="Household Number" value={selected.householdNumber} />
                <InfoRow label="Emergency Contact" value={selected.emergencyContact} />
              </dl>
            </div>
            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => alert("Edit form would open here.")}
                className="btn btn-primary btn-md btn-block"
              >
                <MaterialIcon name="edit" className="text-lg" />
                Edit Resident
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this resident?")) {
                    setDrawerOpen(false);
                    alert("Resident deleted.");
                  }
                }}
                className="btn btn-danger btn-md btn-block"
              >
                <MaterialIcon name="delete" className="text-lg" />
                Delete Resident
              </button>
            </div>
          </div>
        </>
      )}

      {showAddForm && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 overlay-enter"
            onClick={() => setShowAddForm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="admin-card w-full max-w-lg p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Resident
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                >
                  <MaterialIcon name="close" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <FormInput
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(v) => setFormData({ ...formData, fullName: v })}
                  required
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-500">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <FormInput
                  label="Birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(v) => setFormData({ ...formData, birthdate: v })}
                  required
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-500">
                    Civil Status
                  </label>
                  <select
                    value={formData.civilStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, civilStatus: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>Single</option>
                    <option>Married</option>
                    <option>Widowed</option>
                    <option>Separated</option>
                  </select>
                </div>
                <FormInput
                  label="Address"
                  value={formData.address}
                  onChange={(v) => setFormData({ ...formData, address: v })}
                  required
                />
                <FormInput
                  label="Contact Number"
                  value={formData.contactNumber}
                  onChange={(v) =>
                    setFormData({ ...formData, contactNumber: v })
                  }
                  required
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => setFormData({ ...formData, email: v })}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                >
                  <MaterialIcon name="save" className="text-lg" />
                  Save
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
