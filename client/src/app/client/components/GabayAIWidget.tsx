"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export function GabayAIWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="w-[min(92vw,320px)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Gabay AI</p>
              <p className="mt-1 text-xs text-slate-500">
                Ask for help filing complaints or tracking your case.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-slate-100 p-1 text-slate-600 hover:bg-slate-200"
              aria-label="Close Gabay AI"
            >
              <MaterialIcon name="close" className="text-base" />
            </button>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            Full AI chat can connect to your existing assistant service.
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition hover:bg-slate-800"
        aria-label="Open Gabay AI"
      >
        <MaterialIcon name="smart_toy" className="text-[26px]" />
      </button>
    </div>
  );
}
