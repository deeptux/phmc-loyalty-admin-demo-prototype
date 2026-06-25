"use client";

import Link from "next/link";
import {
  BoltIcon,
  ChartBarSquareIcon,
  GiftIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { BenefitActivityFeed } from "@/components/benefits/BenefitActivityFeed";
import { useDemoStore } from "@/context/DemoStoreContext";
import { formatDateTime } from "@/lib/utils";

const links = [
  {
    href: "/benefits/privileges",
    title: "Privileges",
    desc: "Infographic blocks — copy + portrait image upload",
    icon: SparklesIcon,
  },
  {
    href: "/benefits/perks",
    title: "Perks",
    desc: "Partner perks, enrollments & activations",
    icon: GiftIcon,
  },
  {
    href: "/benefits/tiers",
    title: "Tiers",
    desc: "Membership tiers + version publish",
    icon: ChartBarSquareIcon,
  },
  {
    href: "/benefits/engagement",
    title: "Engagement programs",
    desc: "Point-earn activities & budget caps (demo)",
    icon: BoltIcon,
  },
  {
    href: "/benefits/tier-requests",
    title: "Tier upgrade requests",
    desc: "Review member upgrade queue",
    icon: UserGroupIcon,
  },
];

export default function BenefitsIndexPage() {
  const store = useDemoStore();
  const summary = store.getBenefitsSummary();
  const activity = store.listBenefitActivity();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-phmc-primary-light">
          Benefits management
        </p>
        <h1 className="text-2xl font-extrabold">Benefits</h1>
        <p className="mt-1 text-sm text-phmc-text-muted">
          Mock transactional workflows for privileges, perks, tiers, and engagement programs [aligned
          to SOW benefits MVP (no real ledger)].
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending tier requests", value: summary.pendingTierRequests },
          { label: "Perk activations today", value: summary.perkActivationsToday },
          { label: "Engagement pts issued", value: summary.engagementPointsIssued.toLocaleString() },
          { label: "Active programs", value: summary.activePrograms },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-phmc-border bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-phmc-text-muted">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-extrabold text-phmc-primary">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-phmc-text-muted">
            Modules
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl border border-phmc-border bg-white p-4 transition hover:border-phmc-primary/30 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-phmc-primary/10 text-phmc-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold text-phmc-text">{l.title}</p>
                      <p className="mt-1 text-xs text-phmc-text-muted">{l.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-phmc-text-muted">
              Recent activity
            </h2>
            <Link href="/benefits/tier-requests">
              <Button size="sm" variant="ghost">
                Review queue
              </Button>
            </Link>
          </div>
          <BenefitActivityFeed items={activity} limit={6} />
        </div>
      </div>

      {store.privilegesPublishedAt ? (
        <p className="text-xs text-phmc-text-muted">
          Privileges last published v{store.privilegesVersion} ·{" "}
          {formatDateTime(store.privilegesPublishedAt)}
        </p>
      ) : null}
    </div>
  );
}
