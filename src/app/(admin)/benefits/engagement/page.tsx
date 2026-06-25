"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@heroui/react";
import type { EngagementProgram } from "@phmc/demo-data";
import { BenefitActivityFeed } from "@/components/benefits/BenefitActivityFeed";
import { EngagementStatusChip } from "@/components/benefits/BenefitStatusChips";
import { DataTable } from "@/components/tables/DataTable";
import { useDemoStore } from "@/context/DemoStoreContext";
import { formatDate } from "@/lib/utils";

function BudgetBar({ issued, cap }: { issued: number; cap: number }) {
  const pct = cap > 0 ? Math.min(100, Math.round((issued / cap) * 100)) : 0;
  return (
    <div className="min-w-[120px]">
      <div className="h-2 overflow-hidden rounded-full bg-phmc-surface-muted">
        <div
          className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : "bg-phmc-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-phmc-text-muted">
        {issued.toLocaleString()} / {cap.toLocaleString()} pts ({pct}%)
      </p>
    </div>
  );
}

export default function EngagementProgramsPage() {
  const store = useDemoStore();
  const programs = store.listEngagementPrograms();

  const columns = useMemo<ColumnDef<EngagementProgram>[]>(
    () => [
      { header: "Program", accessorKey: "title" },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <EngagementStatusChip status={row.original.status} />,
      },
      {
        header: "Budget used",
        cell: ({ row }) => (
          <BudgetBar issued={row.original.pointsIssued} cap={row.original.budgetCap} />
        ),
      },
      {
        header: "Completions",
        accessorKey: "completions",
        cell: ({ row }) => row.original.completions.toLocaleString(),
      },
      {
        header: "Pts / completion",
        accessorKey: "pointsPerCompletion",
      },
      {
        header: "Period",
        cell: ({ row }) =>
          `${formatDate(row.original.startsAt)} – ${formatDate(row.original.endsAt)}`,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              isDisabled={row.original.status !== "active"}
              onPress={() => store.simulateEngagementBatch(row.original.id, 12)}
            >
              Simulate batch
            </Button>
            {row.original.status === "active" ? (
              <Button
                size="sm"
                variant="ghost"
                onPress={() => store.updateEngagementProgram(row.original.id, { status: "paused" })}
              >
                Pause
              </Button>
            ) : row.original.status === "paused" ? (
              <Button
                size="sm"
                variant="ghost"
                onPress={() => store.updateEngagementProgram(row.original.id, { status: "active" })}
              >
                Resume
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [store]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/benefits" className="text-xs font-semibold text-phmc-primary hover:underline">
            ← Benefits
          </Link>
          <h1 className="text-2xl font-extrabold">Engagement programs</h1>
          <p className="text-sm text-phmc-text-muted">
            Point-earn mini-games & activities [demo budget caps and completion batches (SOW 8)].
          </p>
        </div>
      </div>

      <DataTable data={programs} columns={columns} pageSize={6} />

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-phmc-text-muted">
          Program activity log
        </h2>
        <BenefitActivityFeed
          items={store.listBenefitActivity().filter((a) => a.type === "engagement_completion")}
          limit={5}
        />
      </div>
    </div>
  );
}
