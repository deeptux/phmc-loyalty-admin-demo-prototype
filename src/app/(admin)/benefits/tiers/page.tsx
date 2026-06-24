"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Input, Label, TextField } from "@heroui/react";
import type { MembershipTier } from "@phmc/demo-data";
import { DataTable } from "@/components/tables/DataTable";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useDemoStore } from "@/context/DemoStoreContext";

export default function TiersPage() {
  const store = useDemoStore();
  const [editing, setEditing] = useState<MembershipTier | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const data = store.listTiers();

  const columns = useMemo<ColumnDef<MembershipTier>[]>(
    () => [
      { header: "Name", accessorKey: "name" },
      { header: "Min points", accessorKey: "minPoints" },
      {
        header: "Benefits",
        accessorKey: "benefits",
        cell: ({ row }) => row.original.benefits.join(" · "),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
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
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Membership tiers</h1>
        <Button
          variant="primary"
          onPress={() =>
            setEditing({ id: "", name: "", minPoints: 0, benefits: [""], order: data.length + 1 })
          }
        >
          Add tier
        </Button>
      </div>
      <DataTable data={data} columns={columns} />

      {editing ? (
        <form
          className="space-y-3 rounded-xl border border-phmc-border bg-white p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const benefits = editing.benefits.filter(Boolean);
            if (editing.id) store.updateTier(editing.id, { ...editing, benefits });
            else
              store.createTier({
                name: editing.name,
                minPoints: editing.minPoints,
                benefits,
                order: editing.order,
              });
            setEditing(null);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField isRequired>
              <Label>Name</Label>
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </TextField>
            <TextField isRequired>
              <Label>Minimum points</Label>
              <Input
                type="number"
                value={String(editing.minPoints)}
                onChange={(e) =>
                  setEditing({ ...editing, minPoints: Number(e.target.value) || 0 })
                }
              />
            </TextField>
          </div>
          <div>
            <Label className="mb-1 block">Benefits (one per line)</Label>
            <textarea
              className="min-h-28 w-full rounded-lg border border-phmc-border p-3 text-sm"
              value={editing.benefits.join("\n")}
              onChange={(e) =>
                setEditing({ ...editing, benefits: e.target.value.split("\n") })
              }
            />
          </div>
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

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete tier?"
        message="Removes tier from demo store."
        confirmLabel="Delete"
        danger
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && store.deleteTier(deleteId)}
      />
    </div>
  );
}
