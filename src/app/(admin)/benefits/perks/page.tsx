"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Input, Label, Switch, TextField } from "@heroui/react";
import type { Perk } from "@phmc/demo-data";
import { DataTable } from "@/components/tables/DataTable";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useDemoStore } from "@/context/DemoStoreContext";

export default function PerksPage() {
  const store = useDemoStore();
  const [editing, setEditing] = useState<Perk | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const data = store.listPerks();

  const columns = useMemo<ColumnDef<Perk>[]>(
    () => [
      { header: "Title", accessorKey: "title" },
      { header: "Partner", accessorKey: "partner" },
      {
        header: "Active",
        accessorKey: "active",
        cell: ({ row }) => (row.original.active ? "Yes" : "No"),
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
        <h1 className="text-2xl font-extrabold">Perks</h1>
        <Button
          variant="primary"
          onPress={() =>
            setEditing({ id: "", title: "", partner: "", description: "", active: true })
          }
        >
          Add perk
        </Button>
      </div>
      <DataTable data={data} columns={columns} />

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
