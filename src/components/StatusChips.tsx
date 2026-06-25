"use client";

import { Chip } from "@heroui/react";
import type { MemberStatus, MemberTier, NewsStatus, VoucherStatus } from "@phmc/demo-data";

const newsColors: Record<NewsStatus, "default" | "success" | "warning"> = {
  draft: "default",
  published: "success",
  scheduled: "warning",
};

const voucherBadgeStyles: Record<VoucherStatus, string> = {
  draft: "bg-slate-500 text-white",
  scheduled: "bg-amber-500 text-white",
  active: "bg-[#006837] text-white",
  issued: "bg-blue-600 text-white",
  redeemed: "bg-violet-600 text-white",
  paused: "bg-orange-500 text-white",
  expired: "bg-red-600 text-white",
};

export const VOUCHER_STATUSES: VoucherStatus[] = [
  "draft",
  "scheduled",
  "active",
  "issued",
  "redeemed",
  "paused",
  "expired",
];

export function NewsStatusChip({ status }: { status: NewsStatus }) {
  return <Chip color={newsColors[status]} size="sm">{status}</Chip>;
}

export function VoucherStatusChip({ status }: { status: VoucherStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold capitalize shadow-sm ${voucherBadgeStyles[status]}`}
    >
      {status}
    </span>
  );
}

const memberStatusColors: Record<MemberStatus, "default" | "success" | "warning"> = {
  active: "success",
  pending: "warning",
  inactive: "default",
};

const tierColors: Record<MemberTier, "default" | "warning" | "accent"> = {
  Silver: "default",
  Gold: "warning",
  Platinum: "accent",
};

export function MemberStatusChip({ status }: { status: MemberStatus }) {
  return (
    <Chip color={memberStatusColors[status]} size="sm" className="capitalize">
      {status}
    </Chip>
  );
}

export function MemberTierChip({ tier }: { tier: MemberTier }) {
  return <Chip color={tierColors[tier]} size="sm">{tier}</Chip>;
}
