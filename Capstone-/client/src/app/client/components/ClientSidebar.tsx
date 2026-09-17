"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import type { AuthUser } from "@/lib/types";
import { mediaUrl } from "@/lib/media";

const sidebarNavItems = [
  { label: "Dashboard", href: "/client", icon: "dashboard" },
  { label: "Activity Timeline", href: "/client/activity", icon: "timeline" },
  { label: "My Complaints", href: "/client/complaints", icon: "description" },
  { label: "View Profile", href: "/client/profile", icon: "person" },
];

export function ClientSidebar({ user }: { user: AuthUser | null }) {
  const pathname = usePathname();
  const displayName = user?.fullname || user?.username || "Resident";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "R";
  const avatar = mediaUrl(user?.profilePicture);

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:w-[260px] lg:border-b-0 lg:border-r lg:min-h-[calc(100vh-72px)]">
      <div className="flex flex-col h-full px-4 py-6 lg:sticky lg:top-[72px]">
        {/* User Card */}
        <div className="mb-6 flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#059669] to-[#16A34A] text-sm font-bold text-white shadow-inner">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900 leading-tight">
              {displayName}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Verified Resident
            </span>
          </div>
        </div>

        {/* Quick CTA */}
        <div className="mb-5">
          <Link
            href="/client/complaints/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#047857] cursor-pointer"
          >
            <MaterialIcon name="add" className="text-lg" />
            <span>File a Complaint</span>
          </Link>
        </div>

        {/* Section Label */}
        <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </p>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {sidebarNavItems.map((item) => {
            const isDashboard = item.href === "/client";
            const active = isDashboard
              ? pathname === "/client"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-50 text-[#059669] font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    active
                      ? "bg-[#059669] text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
                  }`}
                >
                  <MaterialIcon name={item.icon} className="text-[19px]" />
                </span>
                <span className="truncate">{item.label}</span>
                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#059669]" aria-hidden />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
