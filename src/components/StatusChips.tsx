"use client";

import { Chip } from "@heroui/react";
import type { MemberStatus, MemberTier, NewsStatus, VoucherStatus } from "@phmc/demo-data";

const newsColors: Record<NewsStatus, "default" | "success" | "warning"> = {
  draft: "default",
  published: "success",
  scheduled: "warning",
};

const voucherColors: Record<VoucherStatus, "default" | "success" | "warning" | "danger"> = {
  draft: "default",
  scheduled: "warning",
  active: "success",
  paused: "warning",
  expired: "danger",
};

export function NewsStatusChip({ status }: { status: NewsStatus }) {
  return <Chip color={newsColors[status]} size="sm">{status}</Chip>;
}

export function VoucherStatusChip({ status }: { status: VoucherStatus }) {
  return <Chip color={voucherColors[status]} size="sm">{status}</Chip>;
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
