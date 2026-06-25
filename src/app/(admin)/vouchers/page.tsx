"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Chip } from "@heroui/react";
import type { Voucher, VoucherStatus } from "@phmc/demo-data";
import { DataTable } from "@/components/tables/DataTable";
import { VoucherStatusChip, VOUCHER_STATUSES } from "@/components/StatusChips";
import { useDemoStore } from "@/context/DemoStoreContext";

export default function VouchersListPage() {
  const store = useDemoStore();
  const [filter, setFilter] = useState<VoucherStatus | "all">("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const data = store.listVouchers().filter((v) => filter === "all" || v.status === filter);

  const columns = useMemo<ColumnDef<Voucher>[]>(
    () => [
      {
        id: "select",
        header: " ",
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={!!selected[row.original.id]}
            onChange={(e) =>
              setSelected((prev) => ({ ...prev, [row.original.id]: e.target.checked }))
            }
          />
        ),
      },
      { header: "Code", accessorKey: "code" },
      { header: "Title", accessorKey: "title" },
      { header: "Type", accessorKey: "type" },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <VoucherStatusChip status={row.original.status} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <Link href={`/vouchers/${row.original.id}`}>
            <Button size="sm" variant="ghost">
              Edit
            </Button>
          </Link>
        ),
      },
    ],
    [selected]
  );

  const selectedIds = Object.entries(selected)
    .filter(([, v]) => v)
    .map(([id]) => id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Vouchers</h1>
          <p className="text-sm text-phmc-text-muted">Care, partner, discount, and freebie offers</p>
        </div>
        <Link href="/vouchers/new">
          <Button variant="primary">Create voucher</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip
          className="cursor-pointer"
          color={filter === "all" ? "accent" : "default"}
          onClick={() => setFilter("all")}
        >
          All
        </Chip>
        {VOUCHER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
              filter === s
                ? "bg-phmc-primary text-white shadow-sm"
                : "bg-phmc-surface-muted text-phmc-text-muted hover:bg-phmc-border/60"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          isDisabled={!selectedIds.length}
          onPress={() => {
            store.pauseVouchers(selectedIds);
            setSelected({});
          }}
        >
          Pause selected (demo)
        </Button>
      </div>

      <DataTable data={data} columns={columns} />
    </div>
  );
}
