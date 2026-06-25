"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Input, Label, Switch, TextField } from "@heroui/react";
import type { Perk } from "@phmc/demo-data";
import { BenefitActivityFeed } from "@/components/benefits/BenefitActivityFeed";
import { PerkActivationStatusChip } from "@/components/benefits/BenefitStatusChips";
import { DataTable } from "@/components/tables/DataTable";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useDemoStore } from "@/context/DemoStoreContext";
import { formatDateTime } from "@/lib/utils";

export default function PerksPage() {
  const store = useDemoStore();
  const [editing, setEditing] = useState<Perk | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activatePerkId, setActivatePerkId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState("");
  const data = store.listPerks();
  const activations = store.listPerkActivations();
  const members = store.listMembers().slice(0, 12);

  const columns = useMemo<ColumnDef<Perk>[]>(
    () => [
      { header: "Title", accessorKey: "title" },
      { header: "Partner", accessorKey: "partner" },
      {
        header: "Enrollments",
        accessorKey: "enrollments",
        cell: ({ row }) => row.original.enrollments.toLocaleString(),
      },
      {
        header: "Redemptions",
        accessorKey: "redemptions",
        cell: ({ row }) => row.original.redemptions.toLocaleString(),
      },
      {
        header: "Active",
        accessorKey: "active",
        cell: ({ row }) => (
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
              row.original.active ? "bg-emerald-600 text-white" : "bg-slate-500 text-white"
            }`}
          >
            {row.original.active ? "Yes" : "No"}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              isDisabled={!row.original.active}
              onPress={() => {
                setActivatePerkId(row.original.id);
                setMemberId(members[0]?.id ?? "");
              }}
            >
              Record activation
            </Button>
            <Button size="sm" variant="ghost" onPress={() => setEditing(row.original)}>
              Edit
            </Button>
            <Button size="sm" variant="danger-soft" onPress={() => setDeleteId(row.original.id)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [members]
  );

  const activationColumns = useMemo(
    () => [
      { header: "Member", accessorKey: "memberName" as const },
      { header: "Perk", accessorKey: "perkTitle" as const },
      {
        header: "Status",
        accessorKey: "status" as const,
        cell: ({ row }: { row: { original: (typeof activations)[0] } }) => (
          <PerkActivationStatusChip status={row.original.status} />
        ),
      },
      {
        header: "When",
        accessorKey: "activatedAt" as const,
        cell: ({ row }: { row: { original: (typeof activations)[0] } }) =>
          formatDateTime(row.original.activatedAt),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/benefits" className="text-xs font-semibold text-phmc-primary hover:underline">
            ← Benefits
          </Link>
          <h1 className="text-2xl font-extrabold">Perks</h1>
          <p className="text-sm text-phmc-text-muted">
            Partner perk catalog with mock enrollments and activation ledger.
          </p>
        </div>
        <Button
          variant="primary"
          onPress={() =>
            setEditing({
              id: "",
              title: "",
              partner: "",
              description: "",
              active: true,
              enrollments: 0,
              redemptions: 0,
            })
          }
        >
          Add perk
        </Button>
      </div>

      <DataTable data={data} columns={columns} />

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-phmc-text-muted">
          Recent activations
        </h2>
        <DataTable data={activations.slice(0, 8)} columns={activationColumns} pageSize={5} />
      </div>

      {editing ? (
        <form
          className="space-y-3 rounded-xl border border-phmc-border bg-white p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (editing.id) store.updatePerk(editing.id, editing);
            else
              store.createPerk({
                title: editing.title,
                partner: editing.partner,
                description: editing.description,
                active: editing.active,
                enrollments: editing.enrollments,
                redemptions: editing.redemptions,
              });
            setEditing(null);
          }}
        >
          <TextField isRequired>
            <Label>Title</Label>
            <Input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </TextField>
          <TextField isRequired>
            <Label>Partner</Label>
            <Input
              value={editing.partner}
              onChange={(e) => setEditing({ ...editing, partner: e.target.value })}
            />
          </TextField>
          <div>
            <Label className="mb-1 block">Description</Label>
            <textarea
              className="min-h-20 w-full rounded-lg border border-phmc-border p-3 text-sm"
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <Switch
            isSelected={editing.active}
            onChange={(v) => setEditing({ ...editing, active: v })}
          >
            Active
          </Switch>
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button type="button" variant="ghost" onPress={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      {activatePerkId ? (
        <div className="rounded-xl border border-phmc-border bg-white p-4">
          <h3 className="font-bold">Record demo perk activation</h3>
          <div className="mt-3">
            <Label className="mb-1 block">Member</Label>
            <select
              className="w-full rounded-lg border border-phmc-border p-2 text-sm"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} ({m.memberNumber})
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="primary"
              onPress={() => {
                store.recordPerkActivation(activatePerkId, memberId, "enrolled");
                setActivatePerkId(null);
              }}
            >
              Record enrollment
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                store.recordPerkActivation(activatePerkId, memberId, "redeemed");
                setActivatePerkId(null);
              }}
            >
              Record redemption
            </Button>
            <Button variant="ghost" onPress={() => setActivatePerkId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <BenefitActivityFeed
        items={store.listBenefitActivity().filter((a) => a.type === "perk_activation")}
        limit={4}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete perk?"
        message="Removes perk from demo store."
        confirmLabel="Delete"
        danger
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && store.deletePerk(deleteId)}
      />
    </div>
  );
}
