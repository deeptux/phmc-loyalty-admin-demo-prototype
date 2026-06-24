"use client";

import { useState } from "react";
import { Button, Input, Label, TextField } from "@heroui/react";
import type { Voucher, VoucherStatus, VoucherType } from "@phmc/demo-data";

type Values = Omit<Voucher, "id" | "updatedAt">;

type Props = {
  initial?: Voucher;
  onSubmit: (values: Values) => void;
  onCancel: () => void;
};

const types: VoucherType[] = ["Care", "Partner", "Discount", "Freebie"];
const statuses: VoucherStatus[] = ["draft", "scheduled", "active", "paused", "expired"];

export function VoucherForm({ initial, onSubmit, onCancel }: Props) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<VoucherType>(initial?.type ?? "Care");
  const [status, setStatus] = useState<VoucherStatus>(initial?.status ?? "draft");
  const [startsAt, setStartsAt] = useState(initial?.startsAt ?? "");
  const [endsAt, setEndsAt] = useState(initial?.endsAt ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  return (
    <form
      className="space-y-4 rounded-xl border border-phmc-border bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ code, title, type, status, startsAt, endsAt, description });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField isRequired>
          <Label>Code</Label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} />
        </TextField>
        <TextField isRequired>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </TextField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1 block">Type</Label>
          <select
            className="w-full rounded-lg border border-phmc-border p-2 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as VoucherType)}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="mb-1 block">Status</Label>
          <select
            className="w-full rounded-lg border border-phmc-border p-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as VoucherStatus)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField isRequired>
          <Label>Starts</Label>
          <Input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </TextField>
        <TextField isRequired>
          <Label>Ends</Label>
          <Input type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </TextField>
      </div>
      <div>
        <Label className="mb-1 block">Description</Label>
        <textarea
          className="min-h-24 w-full rounded-lg border border-phmc-border p-3 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Save
        </Button>
        <Button type="button" variant="ghost" onPress={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
