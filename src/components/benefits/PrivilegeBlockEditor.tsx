"use client";

import { useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Input, Label, TextField } from "@heroui/react";
import type { PrivilegeBlock } from "@phmc/demo-data";
import { publicAsset } from "@/lib/public-asset";

export const MAX_PRIVILEGE_INFOGRAPHIC_BYTES = 400_000;

type Props = {
  block: PrivilegeBlock;
  onChange: (patch: Partial<PrivilegeBlock>) => void;
  onRemove: () => void;
};

export function PrivilegeBlockEditor({ block, onChange, onRemove }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imageUrl = block.infographicImage ? publicAsset(block.infographicImage) : undefined;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > MAX_PRIVILEGE_INFOGRAPHIC_BYTES) {
      setUploadError("Image must be under 400 KB for this demo store.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange({ infographicImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 rounded-xl border border-phmc-border bg-white p-4 shadow-sm">
      <TextField>
        <Label>Heading</Label>
        <Input
          value={block.heading}
          onChange={(e) => onChange({ heading: e.target.value })}
        />
      </TextField>

      <div className="grid gap-4 md:grid-cols-[1fr_minmax(200px,280px)]">
        <div>
          <Label className="mb-1 block">Body</Label>
          <textarea
            className="min-h-[200px] w-full rounded-lg border border-phmc-border p-3 text-sm leading-relaxed"
            value={block.body}
            onChange={(e) => onChange({ body: e.target.value })}
            placeholder="Privilege copy shown beside the infographic on mobile…"
          />
        </div>

        <div className="flex flex-col">
          <Label className="mb-1 block">Infographic image</Label>
          <div className="relative flex min-h-[200px] flex-1 flex-col overflow-hidden rounded-lg border border-dashed border-phmc-border bg-phmc-surface-muted/50">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="h-full min-h-[200px] w-full object-cover object-center"
              />
            ) : (
              <button
                type="button"
                className="flex min-h-[200px] flex-1 flex-col items-center justify-center gap-2 text-phmc-text-muted transition hover:bg-phmc-surface-muted"
                onClick={() => fileRef.current?.click()}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-phmc-border bg-white shadow-sm">
                  <PlusIcon className="h-7 w-7 text-phmc-primary" strokeWidth={2} />
                </span>
                <span className="text-xs font-semibold">Upload infographic</span>
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" onPress={() => fileRef.current?.click()}>
              {imageUrl ? "Replace" : "Upload"}
            </Button>
            {imageUrl ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onPress={() => {
                  onChange({ infographicImage: undefined });
                  setUploadError(null);
                }}
              >
                Remove image
              </Button>
            ) : null}
          </div>
          {uploadError ? <p className="mt-1 text-xs text-red-600">{uploadError}</p> : null}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>

      <Button variant="danger-soft" size="sm" onPress={onRemove}>
        Remove
      </Button>
    </div>
  );
}
