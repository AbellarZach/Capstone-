"use client";

import { MaterialIcon } from "./MaterialIcon";

interface TopNavProps {
  title: string;
  onMenuClick: () => void;
}

export function TopNav({ title, onMenuClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-3 backdrop-blur-md sm:px-5">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <MaterialIcon name="menu" />
        </button>
        
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <MaterialIcon name="notifications" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-900">Administrator</p>
            <p className="text-[10px] text-gray-500">Barangay Official</p>
          </div>
        </div>
      </div>
    </header>
  );
}
