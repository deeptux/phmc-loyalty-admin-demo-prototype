"use client";

import dynamic from "next/dynamic";
import {
  UserGroupIcon,
  SparklesIcon,
  ArrowPathIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { Button, Chip } from "@heroui/react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDemoStore } from "@/context/DemoStoreContext";
import { downloadCsv } from "@/lib/utils";

const DashboardCharts = dynamic(
  () => import("@/components/dashboard/DashboardCharts").then((m) => m.DashboardCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-96 animate-pulse rounded-2xl border border-phmc-border bg-white"
          />
        ))}
      </div>
    ),
  }
);

export default function DashboardPage() {
  const { dashboardMetrics: m } = useDemoStore();

  const exportCsv = () => {
    downloadCsv("phmc-dashboard-demo.csv", [
      ["Metric", "Value"],
      ["Active members", String(m.activeMembers)],
      ["Points issued", String(m.pointsIssued)],
      ["Points redeemed", String(m.pointsRedeemed)],
      ["Voucher redemption rate %", String(m.voucherRedemptionRate)],
    ]);
  };

  const cards = [
    {
      label: "Active members",
      value: m.activeMembers.toLocaleString(),
      icon: UserGroupIcon,
      image: "/brand/hospital-services.jpg",
      tint: "rgba(0, 104, 55, 0.82)",
      href: "/members",
    },
    {
      label: "Points issued",
      value: m.pointsIssued.toLocaleString(),
      icon: SparklesIcon,
      image: "/brand/wellness.jpg",
      tint: "rgba(32, 139, 125, 0.82)",
    },
    {
      label: "Points redeemed",
      value: m.pointsRedeemed.toLocaleString(),
      icon: ArrowPathIcon,
      image: "/brand/diagnostics.jpg",
      tint: "rgba(0, 77, 40, 0.8)",
    },
    {
      label: "Voucher redemption rate",
      value: `${m.voucherRedemptionRate}%`,
      icon: TicketIcon,
      image: "/brand/campus-dining.jpg",
      tint: "rgba(46, 125, 50, 0.82)",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-phmc-border bg-gradient-to-r from-white via-white to-emerald-50/80 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-phmc-primary-light">
              Las Piñas · PHMC Privilege
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-phmc-text">Program dashboard</h1>
            <p className="mt-1 text-sm text-phmc-text-muted">
              Care-forward loyalty snapshot for stakeholder walkthrough (mock data)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip color="success" size="sm" className="font-semibold">
              Integration health: OK (demo)
            </Chip>
            <Chip color="default" size="sm">
              HIS sync: demo mode
            </Chip>
            <Button variant="primary" onPress={exportCsv} className="font-semibold">
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <DashboardCharts metrics={m} />
    </div>
  );
}
