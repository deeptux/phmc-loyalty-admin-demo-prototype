"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Input, Label, TextField } from "@heroui/react";
import type { TierUpgradeRequest } from "@phmc/demo-data";
import { TierRequestStatusChip } from "@/components/benefits/BenefitStatusChips";
import { DataTable } from "@/components/tables/DataTable";
import { useDemoAdminAuth } from "@/context/DemoAdminAuthContext";
import { useDemoStore } from "@/context/DemoStoreContext";
import { formatDateTime } from "@/lib/utils";

export default function TierRequestsPage() {
  const store = useDemoStore();
  const { user } = useDemoAdminAuth();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "denied">("pending");
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const requests = store
    .listTierUpgradeRequests()
    .filter((r) => filter === "all" || r.status === filter);

  const columns = useMemo<ColumnDef<TierUpgradeRequest>[]>(
    () => [
      {
        header: "Member",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold">{row.original.memberName}</p>
            <p className="font-mono text-xs text-phmc-text-muted">{row.original.memberNumber}</p>
          </div>
        ),
      },
      {
        header: "Upgrade",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.currentTier} → <strong>{row.original.requestedTier}</strong>
          </span>
        ),
      },
      {
        header: "Points at request",
        accessorKey: "pointsAtRequest",
        cell: ({ row }) => row.original.pointsAtRequest.toLocaleString(),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <TierRequestStatusChip status={row.original.status} />,
      },
      {
        header: "Requested",
        accessorKey: "requestedAt",
        cell: ({ row }) => formatDateTime(row.original.requestedAt),
      },
      {
        header: "Actions",
        cell: ({ row }) =>
          row.original.status === "pending" ? (
            <Button size="sm" variant="ghost" onPress={() => setReviewId(row.original.id)}>
              Review
            </Button>
          ) : (
            <span className="text-xs text-phmc-text-muted">
              {row.original.reviewedBy ? `By ${row.original.reviewedBy}` : ", "}
            </span>
          ),
      },
    ],
    []
  );

  const reviewing = requests.find((r) => r.id === reviewId);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/benefits" className="text-xs font-semibold text-phmc-primary hover:underline">
          ← Benefits
        </Link>
        <h1 className="text-2xl font-extrabold">Tier upgrade requests</h1>
        <p className="text-sm text-phmc-text-muted">
          Mock review queue [approve updates member tier in the demo store (mobile: request upgrade)].
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "denied"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              filter === s
                ? "bg-phmc-primary text-white"
                : "bg-phmc-surface-muted text-phmc-text-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <DataTable data={requests} columns={columns} pageSize={6} />

      {reviewing ? (
        <div className="rounded-xl border border-phmc-border bg-white p-5">
          <h2 className="font-bold">Review: {reviewing.memberName}</h2>
          <p className="mt-1 text-sm text-phmc-text-muted">
            {reviewing.currentTier} → {reviewing.requestedTier} ·{" "}
            {reviewing.pointsAtRequest.toLocaleString()} pts at request
          </p>
          <TextField className="mt-4">
            <Label>Review note (demo)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </TextField>
          <div className="mt-4 flex gap-2">
            <Button
              variant="primary"
              onPress={() => {
                store.approveTierUpgrade(reviewing.id, user?.email ?? "admin", note || undefined);
                setReviewId(null);
                setNote("");
              }}
            >
              Approve upgrade
            </Button>
            <Button
              variant="danger-soft"
              onPress={() => {
                store.denyTierUpgrade(reviewing.id, user?.email ?? "admin", note || undefined);
                setReviewId(null);
                setNote("");
              }}
            >
              Deny
            </Button>
            <Button variant="ghost" onPress={() => setReviewId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
