"use client";

import { useState } from "react";
import { Button, Input, Label, TextField } from "@heroui/react";
import type { PrivilegeBlock } from "@phmc/demo-data";
import { useDemoStore } from "@/context/DemoStoreContext";

export default function PrivilegesPage() {
  const store = useDemoStore();
  const [blocks, setBlocks] = useState<PrivilegeBlock[]>(store.listPrivileges());

  const update = (id: string, patch: Partial<PrivilegeBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const addBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: `priv-local-${Date.now()}`,
        heading: "New privilege block",
        body: "",
        order: prev.length + 1,
      },
    ]);
  };

  const remove = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold">Privileges</h1>
      <p className="text-sm text-phmc-text-muted">Editable infographic text blocks for member benefits.</p>
      {blocks.map((b) => (
        <div key={b.id} className="space-y-3 rounded-xl border border-phmc-border bg-white p-4">
          <TextField>
            <Label>Heading</Label>
            <Input value={b.heading} onChange={(e) => update(b.id, { heading: e.target.value })} />
          </TextField>
          <div>
            <Label className="mb-1 block">Body</Label>
            <textarea
              className="min-h-24 w-full rounded-lg border border-phmc-border p-3 text-sm"
              value={b.body}
              onChange={(e) => update(b.id, { body: e.target.value })}
            />
          </div>
          <Button variant="danger-soft" size="sm" onPress={() => remove(b.id)}>
            Remove
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Button variant="ghost" onPress={addBlock}>
          Add block
        </Button>
        <Button
          variant="primary"
          onPress={() => store.savePrivileges(blocks.map((b, i) => ({ ...b, order: i + 1 })))}
        >
          Save all
        </Button>
      </div>
    </div>
  );
}
