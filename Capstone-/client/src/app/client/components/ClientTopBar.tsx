"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/auth";
import { MaterialIcon } from "@/components/admin/MaterialIcon";
import { mediaUrl } from "@/lib/media";

type ClientTopBarProps = {
  rightSlot?: "avatar" | "home";
  avatarInitials?: string;
  avatarUrl?: string | null;
  displayName?: string;
  onAvatarClick?: () => void;
};

export function ClientTopBar({
  rightSlot = "home",
  avatarInitials = "R",
  avatarUrl,
  displayName = "Resident",
  onAvatarClick,
}: ClientTopBarProps) {
  const resolvedAvatar = mediaUrl(avatarUrl);
  const router = useRouter();

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand & Identity */}
        <Link href="/client" className="flex shrink-0 items-center gap-3 group">
          <div className="flex items-center">
            <Image
              src="/easyreport-logo.png"
              alt="Barangay EasyReport"
              width={200}
              height={52}
              className="h-11 w-auto object-contain sm:h-12 transition group-hover:opacity-90"
              priority
            />
          </div>
          <div className="hidden md:block h-6 w-px bg-slate-200" aria-hidden />
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700 border border-emerald-200/60">
              Barangay Gabi
            </span>
            <span>Resident Portal</span>
          </div>
        </Link>

        {/* Right Action Area */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Notification Icon */}
          <Link
            href="/client/notifications"
            className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" className="text-[20px]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#059669] text-[10px] font-bold text-white ring-2 ring-white">
              •
            </span>
          </Link>

          {/* User Name Display */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-700">
            {rightSlot === "avatar" ? (
              <button
                type="button"
                onClick={onAvatarClick}
                className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50 cursor-pointer"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#059669] to-[#16A34A] text-xs font-bold text-white shadow-inner">
                  {resolvedAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolvedAvatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    avatarInitials
                  )}
                </span>
                <span className="font-semibold text-slate-800">{displayName}</span>
              </button>
            ) : (
              <span className="font-semibold text-slate-800">{displayName}</span>
            )}
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-slate-200" aria-hidden />

          {/* Log Out Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 hover:border-rose-200 cursor-pointer"
            aria-label="Log out"
          >
            <MaterialIcon name="logout" className="text-[19px]" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

