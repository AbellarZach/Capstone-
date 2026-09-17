"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

type ModalType = "faq" | "privacy" | "terms" | null;

export function ClientFooter() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <>
      <footer className="mt-auto w-full border-t border-slate-800 bg-[#0F172A] text-slate-300">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Identity & Description */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 p-1 ring-1 ring-white/20">
                  <Image
                    src="/barangaylogo.jpg"
                    alt="Barangay Gabi Official Seal"
                    width={44}
                    height={44}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Barangay Gabi Digital Services
                  </h2>
                  <p className="text-xs font-medium text-slate-400">
                    EasyReport Resident Citizen Portal
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                Official digital public service and grievance management portal of Barangay Gabi,
                Municipality of Cordova, Province of Cebu. Providing accessible, transparent, and
                responsive community resolution for all constituents.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Barangay Citizen Portal Online • Lupong Tagapamayapa Ready</span>
              </div>
            </div>

            {/* Essential Links */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Essential Links
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/client"
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                  >
                    <MaterialIcon name="chevron_right" className="text-xs text-blue-400" />
                    Dashboard Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/client/complaints/new"
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                  >
                    <MaterialIcon name="chevron_right" className="text-xs text-blue-400" />
                    Submit Complaint
                  </Link>
                </li>
                <li>
                  <Link
                    href="/client/activity"
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                  >
                    <MaterialIcon name="chevron_right" className="text-xs text-blue-400" />
                    Track Activity
                  </Link>
                </li>
                <li>
                  <Link
                    href="/client/complaints"
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                  >
                    <MaterialIcon name="chevron_right" className="text-xs text-blue-400" />
                    My Complaints List
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("faq")}
                    className="inline-flex items-center gap-2 text-left text-slate-400 transition hover:text-white cursor-pointer"
                  >
                    <MaterialIcon name="chevron_right" className="text-xs text-blue-400" />
                    Frequently Asked Questions (FAQs)
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Contact & Public Helpdesk
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MaterialIcon name="location_on" className="mt-0.5 text-lg text-blue-400 shrink-0" />
                  <span>Barangay Hall, Gabi, Cordova, 6017 Cebu, Philippines</span>
                </li>
                <li className="flex items-center gap-3">
                  <MaterialIcon name="mail" className="text-lg text-blue-400 shrink-0" />
                  <a
                    href="mailto:support@barangaygabi.gov.ph"
                    className="transition hover:text-white"
                  >
                    support@barangaygabi.gov.ph
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MaterialIcon name="phone" className="text-lg text-blue-400 shrink-0" />
                  <span>(032) 496-0000 / +63 917 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <MaterialIcon name="schedule" className="text-lg text-blue-400 shrink-0" />
                  <span>Office Hours: Mon – Fri, 8:00 AM – 5:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Bar */}
        <div className="border-t border-slate-800/80 bg-slate-950/60">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-center sm:text-left">
              &copy; 2026 Barangay Gabi EasyReport. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveModal("privacy")}
                className="cursor-pointer transition hover:text-white"
              >
                Privacy Policy
              </button>
              <span className="text-slate-700" aria-hidden>
                •
              </span>
              <button
                type="button"
                onClick={() => setActiveModal("terms")}
                className="cursor-pointer transition hover:text-white"
              >
                Terms of Service
              </button>
              <span className="text-slate-700" aria-hidden>
                •
              </span>
              <span className="text-slate-500">Katarungang Pambarangay Compliance</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Civic Information Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close dialog"
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>

            {activeModal === "faq" && (
              <div>
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#047857]">
                    <MaterialIcon name="help_outline" className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Frequently Asked Questions (FAQs)
                    </h3>
                    <p className="text-xs text-slate-500">Barangay EasyReport Resident Guidelines</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <h4 className="font-semibold text-slate-900">
                      How do I file a community complaint?
                    </h4>
                    <p className="mt-1 text-slate-600 leading-relaxed">
                      Click the &quot;File a Complaint&quot; button on your dashboard or sidebar.
                      Fill in the respondent name, category, clear description of the incident, and
                      attach supporting photo evidence if available.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <h4 className="font-semibold text-slate-900">
                      What happens after submitting a complaint?
                    </h4>
                    <p className="mt-1 text-slate-600 leading-relaxed">
                      Your complaint will be reviewed by the Barangay Secretary and Lupon
                      Tagapamayapa. You will receive notifications on scheduled mediation hearings
                      or resolutions directly on this portal.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <h4 className="font-semibold text-slate-900">
                      What is the standard resolution timeline?
                    </h4>
                    <p className="mt-1 text-slate-600 leading-relaxed">
                      In accordance with Katarungang Pambarangay (RA 7160), preliminary review occurs
                      within 1-3 business days. Mediation sessions are typically scheduled within 7
                      days upon respondent notification.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <h4 className="font-semibold text-slate-900">
                      Can I track my case status in real-time?
                    </h4>
                    <p className="mt-1 text-slate-600 leading-relaxed">
                      Yes! Check your &quot;Activity Timeline&quot; and &quot;My Complaints&quot; tabs
                      anytime to view hearing notices, summons numbers, and progress updates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeModal === "privacy" && (
              <div>
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#047857]">
                    <MaterialIcon name="privacy_tip" className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Privacy Policy</h3>
                    <p className="text-xs text-slate-500">
                      Republic Act No. 10173 (Data Privacy Act of 2012)
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>
                    Barangay Gabi Digital Services is dedicated to safeguarding your personal data in
                    accordance with the Data Privacy Act of 2012 (RA 10173). All resident profiles,
                    incident narratives, and attached evidence are stored securely.
                  </p>
                  <p>
                    <strong>Information Collected:</strong> Resident name, verified email, contact
                    number, sitio/purok residence, and complaint submission records.
                  </p>
                  <p>
                    <strong>Use of Data:</strong> Information submitted is strictly utilized by
                    authorized Barangay Officials, the Punong Barangay, and the Lupong Tagapamayapa
                    to process, mediate, and resolve submitted complaints.
                  </p>
                  <p>
                    Your personal information is never sold or shared with commercial entities. For data
                    privacy inquiries, please contact privacy@barangaygabi.gov.ph.
                  </p>
                </div>
              </div>
            )}

            {activeModal === "terms" && (
              <div>
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#047857]">
                    <MaterialIcon name="gavel" className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Terms of Service</h3>
                    <p className="text-xs text-slate-500">Barangay Gabi EasyReport Resident Portal</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>
                    By accessing and using the Barangay EasyReport portal, you agree to comply with
                    the following terms:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Truthful Reporting:</strong> All complaints and statements filed through
                      this portal must be genuine, factual, and submitted in good faith. Frivolous or
                      malicious reports are subject to barangay penalties.
                    </li>
                    <li>
                      <strong>Proper Identification:</strong> Residents must provide accurate personal
                      details to facilitate proper barangay mediation and official summons issuance.
                    </li>
                    <li>
                      <strong>Respectful Conduct:</strong> All communications, descriptions, and
                      uploaded materials must adhere to public decency and civic decorum.
                    </li>
                    <li>
                      <strong>Official Record:</strong> Submissions become part of the official
                      Barangay Gabi complaint docket and may be used during mediation proceedings under
                      the Katarungang Pambarangay system.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-[#047857] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
