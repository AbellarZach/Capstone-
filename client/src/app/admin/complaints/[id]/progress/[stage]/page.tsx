"use client";

import ProgressView from "../_ProgressView";

export default function ComplaintProgressStagePage({
  params,
}: {
  params: Promise<{ id: string; stage: string }>;
}) {
  return <ProgressView params={params} />;
}
