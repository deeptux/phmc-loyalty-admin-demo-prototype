"use client";

import type { BenefitActivity } from "@phmc/demo-data";
import { formatDateTime } from "@/lib/utils";

const typeLabels: Record<BenefitActivity["type"], string> = {
  perk_activation: "Perk",
  tier_request: "Tier request",
  tier_approved: "Tier approved",
  tier_denied: "Tier denied",
  engagement_completion: "Engagement",
  privileges_published: "Privileges",
  tier_published: "Tier publish",
};

const typeStyles: Record<BenefitActivity["type"], string> = {
  perk_activation: "bg-blue-100 text-blue-800",
  tier_request: "bg-amber-100 text-amber-900",
  tier_approved: "bg-emerald-100 text-emerald-800",
  tier_denied: "bg-red-100 text-red-800",
  engagement_completion: "bg-violet-100 text-violet-800",
  privileges_published: "bg-teal-100 text-teal-800",
  tier_published: "bg-slate-100 text-slate-800",
};

type Props = {
  items: BenefitActivity[];
  limit?: number;
};

export function BenefitActivityFeed({ items, limit = 8 }: Props) {
  const visible = items.slice(0, limit);
  if (!visible.length) {
    return <p className="text-sm text-phmc-text-muted">No benefit activity yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {visible.map((item) => (
        <li
          key={item.id}
          className="flex gap-3 rounded-xl border border-phmc-border bg-white px-4 py-3"
        >
          <span
            className={`mt-0.5 inline-flex h-fit shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeStyles[item.type]}`}
          >
            {typeLabels[item.type]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-phmc-text">{item.summary}</p>
            <p className="mt-1 text-xs text-phmc-text-muted">
              {formatDateTime(item.occurredAt)}
              {item.actor ? ` · ${item.actor}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
