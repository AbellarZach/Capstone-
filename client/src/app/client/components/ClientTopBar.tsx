"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { mediaUrl } from "@/lib/media";

type ClientTopBarProps = {
  rightSlot?: "avatar" | "home";
  avatarInitials?: string;
  avatarUrl?: string | null;
  onAvatarClick?: () => void;
};

export function ClientTopBar({
  rightSlot = "home",
  avatarInitials = "R",
  avatarUrl,
  onAvatarClick,
}: ClientTopBarProps) {
  const resolvedAvatar = mediaUrl(avatarUrl);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/client" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Barangay EasyReport"
            width={44}
            height={44}
            className="rounded-full object-cover"
            priority
          />
          <div className="leading-tight">
            <p className="text-[15px] font-extrabold tracking-wide text-slate-900">
              BARANGAY EASYREPORT
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Report · Track · Resolve
            </p>
          </div>
        </Link>

        {rightSlot === "home" ? (
          <Link
            href="/client"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white shadow-sm transition hover:bg-slate-700"
            aria-label="Go to dashboard"
          >
            <MaterialIcon name="home" className="text-[22px]" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAvatarClick}
            className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#2563EB] text-sm font-bold text-white shadow-sm ring-2 ring-white"
            aria-label="Open profile menu"
          >
            {resolvedAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolvedAvatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              avatarInitials
            )}
          </button>
        )}
      </div>
    </header>
  );
}
