"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import type { PrivilegeBlock } from "@phmc/demo-data";
import { BenefitActivityFeed } from "@/components/benefits/BenefitActivityFeed";
import { PrivilegeBlockEditor } from "@/components/benefits/PrivilegeBlockEditor";
import { useDemoAdminAuth } from "@/context/DemoAdminAuthContext";
import { useDemoStore } from "@/context/DemoStoreContext";
import { formatDateTime } from "@/lib/utils";

export default function PrivilegesPage() {
  const store = useDemoStore();
  const { user } = useDemoAdminAuth();
  const [blocks, setBlocks] = useState<PrivilegeBlock[]>(store.listPrivileges());
  const [dirty, setDirty] = useState(false);

  const update = (id: string, patch: Partial<PrivilegeBlock>) => {
    setDirty(true);
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const addBlock = () => {
    setDirty(true);
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

  const remove = (id: string) => {
    setDirty(true);
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const saveDraft = () => {
    store.savePrivileges(blocks.map((b, i) => ({ ...b, order: i + 1 })));
    setDirty(false);
  };

  const publish = () => {
    store.savePrivileges(blocks.map((b, i) => ({ ...b, order: i + 1 })));
    store.publishPrivileges(user?.email ?? "admin@phmc.demo");
    setDirty(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/benefits" className="text-xs font-semibold text-phmc-primary hover:underline">
          ← Benefits
        </Link>
        <h1 className="text-2xl font-extrabold">Privileges</h1>
        <p className="text-sm text-phmc-text-muted">
          Editable infographic blocks for member benefits — heading, body copy, and portrait
          infographic image (mobile PHMC Privileges).
        </p>
        <p className="mt-2 text-xs text-phmc-text-muted">
          Live version: <strong>v{store.privilegesVersion}</strong>
          {store.privilegesPublishedAt
            ? ` · last published ${formatDateTime(store.privilegesPublishedAt)}`
            : " · not published yet"}
          {dirty ? " · unsaved draft changes" : ""}
        </p>
      </div>

      <div className="space-y-4">
        {blocks.map((b) => (
          <PrivilegeBlockEditor
            key={b.id}
            block={b}
            onChange={(patch) => update(b.id, patch)}
            onRemove={() => remove(b.id)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onPress={addBlock}>
          Add block
        </Button>
        <Button variant="secondary" onPress={saveDraft}>
          Save draft
        </Button>
        <Button variant="primary" onPress={publish}>
          Publish to mobile preview
        </Button>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-phmc-text-muted">
          Publish history (activity)
        </h2>
        <BenefitActivityFeed
          items={store.listBenefitActivity().filter((a) => a.type === "privileges_published")}
          limit={4}
        />
      </div>
    </div>
  );
}
