import { normalizeStatus } from "@/lib/complaint-utils";

interface StatusBadgeProps {
  status: string;
  hearingNumber?: number;
}

export function StatusBadge({ status, hearingNumber }: StatusBadgeProps) {
  const normalized = normalizeStatus(status);
  const stage = hearingNumber && hearingNumber > 0 ? hearingNumber : 1;

  if (normalized === "Scheduled") {
    let label = `Scheduled ${Math.min(stage, 3)}`;
    let style = "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-300";

    if (stage === 2) {
      label = "Scheduled 2";
      style = "bg-purple-100 text-purple-800 ring-1 ring-purple-300";
    } else if (stage >= 3) {
      label = "Scheduled 3";
      style = "bg-teal-100 text-teal-800 ring-1 ring-teal-300";
    }

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}
      >
        {label}
      </span>
    );
  }

  if (normalized === "In Progress") {
    const label = `In Progress ${stage}`;
    let style = "bg-blue-100 text-blue-800 ring-1 ring-blue-300";
    if (stage === 2) style = "bg-cyan-100 text-cyan-800 ring-1 ring-cyan-300";
    if (stage === 3) style = "bg-sky-100 text-sky-800 ring-1 ring-sky-300";
    if (stage === 4) style = "bg-sky-200 text-sky-900 ring-1 ring-sky-400";

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}
      >
        {label}
      </span>
    );
  }

  if (normalized === "Resolved") {
    const label = `Resolved ${stage}`;
    const style = "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300";

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}
      >
        {label}
      </span>
    );
  }

  let style = "bg-gray-100 text-gray-700 ring-1 ring-gray-200";

  switch (normalized) {
    case "Pending":
      style = "bg-amber-100 text-amber-800 ring-1 ring-amber-300";
      break;
    case "Cancelled":
      style = "bg-red-100 text-red-800 ring-1 ring-red-300";
      break;
    case "Unsettled":
      style = "bg-slate-800 text-slate-100 ring-1 ring-slate-900";
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {normalized}
    </span>
  );
}
