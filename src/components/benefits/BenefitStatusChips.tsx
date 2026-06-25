"use client";

import type { EngagementProgramStatus } from "@phmc/demo-data";

const styles: Record<EngagementProgramStatus, string> = {
  draft: "bg-slate-500 text-white",
  active: "bg-[#006837] text-white",
  paused: "bg-orange-500 text-white",
  ended: "bg-red-600 text-white",
};

export function EngagementStatusChip({ status }: { status: EngagementProgramStatus }) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function TierRequestStatusChip({
  status,
}: {
  status: "pending" | "approved" | "denied";
}) {
  const map = {
    pending: "bg-amber-500 text-white",
    approved: "bg-[#006837] text-white",
    denied: "bg-red-600 text-white",
  };
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${map[status]}`}>
      {status}
    </span>
  );
}

export function PerkActivationStatusChip({
  status,
}: {
  status: "enrolled" | "redeemed" | "expired";
}) {
  const map = {
    enrolled: "bg-blue-600 text-white",
    redeemed: "bg-violet-600 text-white",
    expired: "bg-slate-500 text-white",
  };
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${map[status]}`}>
      {status}
    </span>
  );
}
