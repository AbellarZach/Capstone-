"use client";

import { useState, useRef } from "react";
import { residents as initialResidents } from "@/lib/mock-data";
import type { Resident } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

const emptyFormData = {
  id: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "Select",
  gender: "Male",
  birthdate: "",
  birthPlace: "",
  age: "",
  civilStatus: "Single",
  nationality: "Filipino",
  religion: "",
  occupation: "",
  contactNumber: "",
  email: "",
  pwdIdNo: "",
  familyMonthlyIncome: "Select Range",
  indigent: "No",
  registeredVoter: "Yes",
  precinctNo: "",
  voterIdNo: "",
  photoUrl: "",
  address: "",
};

export default function ResidentsPage() {
  const [residentList, setResidentList] = useState<Resident[]>(initialResidents);
  const [selected, setSelected] = useState<Resident | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Manage Details modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyFormData);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData(emptyFormData);
    setModalOpen(true);
  };

  const handleOpenEdit = (resident: Resident) => {
    setIsEditing(true);
    setFormData({
      id: resident.id,
      firstName: resident.firstName || resident.fullName.split(" ")[0] || "",
      middleName: resident.middleName || "",
      lastName: resident.lastName || resident.fullName.split(" ").slice(1).join(" ") || "",
      suffix: resident.suffix || "Select",
      gender: resident.gender || "Male",
      birthdate: resident.birthdate || "",
      birthPlace: resident.birthPlace || "",
      age: resident.age !== undefined ? String(resident.age) : "",
      civilStatus: resident.civilStatus || "Single",
      nationality: resident.nationality || "Filipino",
      religion: resident.religion || "",
      occupation: resident.occupation || "",
      contactNumber: resident.contactNumber || "",
      email: resident.email || "",
      pwdIdNo: resident.pwdIdNo || "",
      familyMonthlyIncome: resident.familyMonthlyIncome || "Select Range",
      indigent: resident.indigent || "No",
      registeredVoter: resident.registeredVoter || "Yes",
      precinctNo: resident.precinctNo || "",
      voterIdNo: resident.voterIdNo || "",
      photoUrl: resident.photoUrl || "",
      address: resident.address || "",
    });
    setModalOpen(true);
  };

  const handleView = (resident: Resident) => {
    setSelected(resident);
    setDrawerOpen(true);
  };

  const handleBirthdateChange = (dateVal: string) => {
    let calculatedAge = "";
    if (dateVal) {
      const birth = new Date(dateVal);
      const today = new Date();
      let ageNum = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        ageNum--;
      }
      if (!isNaN(ageNum) && ageNum >= 0) {
        calculatedAge = String(ageNum);
      }
    }
    setFormData((prev) => ({
      ...prev,
      birthdate: dateVal,
      age: calculatedAge || prev.age,
    }));
  };

  const handlePhotoBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photoUrl: url }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct full name
    const constructedFullName = [formData.firstName, formData.middleName, formData.lastName]
      .filter(Boolean)
      .join(" ") || "Unnamed Resident";

    const constructedAddress = formData.address || (formData.birthPlace ? `Brgy. San Jose, ${formData.birthPlace}` : "Brgy. San Jose");

    if (isEditing && formData.id) {
      setResidentList((prev) =>
        prev.map((r) =>
          r.id === formData.id
            ? {
                ...r,
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                suffix: formData.suffix,
                fullName: constructedFullName,
                birthdate: formData.birthdate,
                birthPlace: formData.birthPlace,
                age: Number(formData.age) || 0,
                gender: formData.gender,
                civilStatus: formData.civilStatus,
                nationality: formData.nationality,
                religion: formData.religion,
                occupation: formData.occupation,
                contactNumber: formData.contactNumber,
                email: formData.email,
                pwdIdNo: formData.pwdIdNo,
                familyMonthlyIncome: formData.familyMonthlyIncome,
                indigent: formData.indigent,
                registeredVoter: formData.registeredVoter,
                precinctNo: formData.precinctNo,
                voterIdNo: formData.voterIdNo,
                photoUrl: formData.photoUrl,
                address: constructedAddress,
              }
            : r
        )
      );
      if (selected && selected.id === formData.id) {
        setSelected((prev) => prev ? {
          ...prev,
          fullName: constructedFullName,
          contactNumber: formData.contactNumber,
          email: formData.email,
          gender: formData.gender,
          civilStatus: formData.civilStatus,
          birthdate: formData.birthdate,
          age: Number(formData.age) || prev.age,
        } : null);
      }
    } else {
      const newId = `R-00${residentList.length + 1}`;
      const newResident: Resident = {
        id: newId,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffix: formData.suffix,
        fullName: constructedFullName,
        birthdate: formData.birthdate,
        birthPlace: formData.birthPlace,
        age: Number(formData.age) || 0,
        gender: formData.gender,
        civilStatus: formData.civilStatus,
        nationality: formData.nationality,
        religion: formData.religion,
        occupation: formData.occupation,
        address: constructedAddress,
        contactNumber: formData.contactNumber,
        email: formData.email,
        pwdIdNo: formData.pwdIdNo,
        familyMonthlyIncome: formData.familyMonthlyIncome,
        indigent: formData.indigent,
        registeredVoter: formData.registeredVoter,
        precinctNo: formData.precinctNo,
        voterIdNo: formData.voterIdNo,
        photoUrl: formData.photoUrl,
        householdNumber: `HH-00${Math.floor(100 + Math.random() * 900)}`,
        emergencyContact: `${formData.lastName || "Family"} - ${formData.contactNumber}`,
        dateRegistered: new Date().toISOString().split("T")[0],
      };
      setResidentList((prev) => [newResident, ...prev]);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Residents"
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
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
            {residentList.map((r) => (
              <tr key={r.id}>
                <td className="font-semibold text-primary">{r.id}</td>
                <td className="text-gray-900 font-medium">{r.fullName}</td>
                <td className="wrap-cell text-gray-600">{r.address}</td>
                <td className="text-gray-600">{r.contactNumber}</td>
                <td className="text-gray-600">{r.dateRegistered || "2024-01-10"}</td>
                <td className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleView(r)}
                    className="btn btn-primary btn-sm"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(r)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Drawer */}
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
                <InfoRow label="Nationality" value={selected.nationality || "Filipino"} />
                <InfoRow label="Address" value={selected.address} />
                <InfoRow label="Contact Number" value={selected.contactNumber} />
                <InfoRow label="Email" value={selected.email} />
                <InfoRow label="Household Number" value={selected.householdNumber || "N/A"} />
                <InfoRow label="Emergency Contact" value={selected.emergencyContact || "N/A"} />
              </dl>
            </div>
            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  handleOpenEdit(selected);
                }}
                className="btn btn-primary btn-md btn-block"
              >
                <MaterialIcon name="edit" className="text-lg" />
                Edit Resident
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this resident?")) {
                    setResidentList((prev) => prev.filter((item) => item.id !== selected.id));
                    setDrawerOpen(false);
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

      {/* MANAGE DETAILS MODAL */}
      {modalOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs overlay-enter"
            onClick={() => setModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl my-8 overflow-hidden border border-gray-100">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">Manage Details</h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <MaterialIcon name="close" className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSave}>
                <div className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Column - PHOTO */}
                    <div className="w-full lg:w-56 shrink-0">
                      <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">
                        PHOTO
                      </label>
                      <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100/90 border border-gray-200 overflow-hidden shadow-inner">
                        {formData.photoUrl ? (
                          <img
                            src={formData.photoUrl}
                            alt="Resident Photo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-300">
                            <MaterialIcon name="person" className="text-7xl opacity-80" />
                          </div>
                        )}
                      </div>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      <button
                        type="button"
                        onClick={handlePhotoBrowse}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors active:scale-[0.98]"
                      >
                        <MaterialIcon name="image" className="text-lg" />
                        Browse
                      </button>
                    </div>

                    {/* Right Column - PERSONAL INFORMATION */}
                    <div className="flex-1">
                      <div className="mb-4 pb-2 border-b border-gray-100">
                        <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                          PERSONAL INFORMATION
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        
                        {/* Row 1 */}
                        <FormInputField
                          label="FIRST NAME"
                          required
                          value={formData.firstName}
                          onChange={(val) => setFormData({ ...formData, firstName: val })}
                          placeholder="First Name"
                        />
                        <FormInputField
                          label="MIDDLE NAME"
                          value={formData.middleName}
                          onChange={(val) => setFormData({ ...formData, middleName: val })}
                          placeholder="Middle Name"
                        />
                        <FormInputField
                          label="LAST NAME"
                          required
                          value={formData.lastName}
                          onChange={(val) => setFormData({ ...formData, lastName: val })}
                          placeholder="Last Name"
                        />
                        <FormSelectField
                          label="SUFFIX"
                          value={formData.suffix}
                          onChange={(val) => setFormData({ ...formData, suffix: val })}
                          options={["Select", "Jr.", "Sr.", "I", "II", "III", "IV", "V"]}
                        />

                        {/* Row 2 */}
                        <FormSelectField
                          label="GENDER"
                          required
                          value={formData.gender}
                          onChange={(val) => setFormData({ ...formData, gender: val })}
                          options={["Male", "Female", "Other"]}
                        />
                        <FormInputField
                          label="BIRTH DATE"
                          required
                          type="date"
                          value={formData.birthdate}
                          onChange={handleBirthdateChange}
                        />
                        <FormInputField
                          label="BIRTH PLACE"
                          value={formData.birthPlace}
                          onChange={(val) => setFormData({ ...formData, birthPlace: val })}
                          placeholder="Cordova, Cebu"
                        />
                        <FormInputField
                          label="AGE"
                          value={formData.age}
                          onChange={(val) => setFormData({ ...formData, age: val })}
                          placeholder="Age"
                        />

                        {/* Row 3 */}
                        <FormSelectField
                          label="CIVIL STATUS"
                          required
                          value={formData.civilStatus}
                          onChange={(val) => setFormData({ ...formData, civilStatus: val })}
                          options={["Single", "Married", "Widowed", "Separated"]}
                        />
                        <FormInputField
                          label="NATIONALITY"
                          required
                          value={formData.nationality}
                          onChange={(val) => setFormData({ ...formData, nationality: val })}
                          placeholder="Filipino"
                        />
                        <FormInputField
                          label="RELIGION"
                          value={formData.religion}
                          onChange={(val) => setFormData({ ...formData, religion: val })}
                          placeholder="Catholic"
                        />
                        <FormInputField
                          label="OCCUPATION"
                          value={formData.occupation}
                          onChange={(val) => setFormData({ ...formData, occupation: val })}
                          placeholder="Occupation"
                        />

                        {/* Row 4 */}
                        <FormInputField
                          label="CONTACT NUMBER"
                          required
                          value={formData.contactNumber}
                          onChange={(val) => setFormData({ ...formData, contactNumber: val })}
                          placeholder="09123456789"
                        />
                        <FormInputField
                          label="EMAIL"
                          type="email"
                          value={formData.email}
                          onChange={(val) => setFormData({ ...formData, email: val })}
                          placeholder="zach@example.com"
                        />
                        <FormInputField
                          label="PWD ID NO."
                          value={formData.pwdIdNo}
                          onChange={(val) => setFormData({ ...formData, pwdIdNo: val })}
                          placeholder="ID Number"
                        />
                        <FormSelectField
                          label="FAMILY MONTHLY INCOME"
                          value={formData.familyMonthlyIncome}
                          onChange={(val) => setFormData({ ...formData, familyMonthlyIncome: val })}
                          options={[
                            "Select Range",
                            "Below ₱10,000",
                            "₱10,000 - ₱20,000",
                            "₱20,000 - ₱40,000",
                            "Above ₱40,000",
                          ]}
                        />

                        {/* Row 5 */}
                        <FormSelectField
                          label="INDIGENT?"
                          value={formData.indigent}
                          onChange={(val) => setFormData({ ...formData, indigent: val })}
                          options={["No", "Yes"]}
                        />
                        <FormSelectField
                          label="REGISTERED VOTER?"
                          value={formData.registeredVoter}
                          onChange={(val) => setFormData({ ...formData, registeredVoter: val })}
                          options={["Yes", "No"]}
                        />
                        <FormInputField
                          label="PRECINCT NO."
                          value={formData.precinctNo}
                          onChange={(val) => setFormData({ ...formData, precinctNo: val })}
                          placeholder="Precinct No."
                        />
                        <FormInputField
                          label="VOTER ID NO."
                          value={formData.voterIdNo}
                          onChange={(val) => setFormData({ ...formData, voterIdNo: val })}
                          placeholder="Voter ID Number"
                        />

                      </div>
                    </div>

                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    Save Resident
                  </button>
                </div>
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

function FormInputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
      />
    </div>
  );
}

function FormSelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
