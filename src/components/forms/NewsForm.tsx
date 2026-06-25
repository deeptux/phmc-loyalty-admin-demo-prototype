"use client";

import { useRef, useState } from "react";
import { Button, Input, Label, Switch, TextField } from "@heroui/react";
import type { NewsItem, NewsStatus } from "@phmc/demo-data";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { NewsTitleBanner } from "@/components/news/NewsTitleBanner";
import {
  NEWS_BANNER_PRESETS,
  NEWS_STATUS_TINTS,
} from "@/lib/news-banners";

type Values = Omit<NewsItem, "id" | "updatedAt">;

type Props = {
  initial?: NewsItem;
  onSubmit: (values: Values) => void;
  onCancel: () => void;
};

const MAX_BANNER_BYTES = 400_000;

export function NewsForm({ initial, onSubmit, onCancel }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [status, setStatus] = useState<NewsStatus>(initial?.status ?? "draft");
  const [publishAt, setPublishAt] = useState(
    initial?.publishAt ? initial.publishAt.slice(0, 16) : ""
  );
  const [pinned, setPinned] = useState(initial?.pinned ?? false);
  const [bannerImage, setBannerImage] = useState(initial?.bannerImage);
  const [bannerTint, setBannerTint] = useState(
    initial?.bannerTint ?? NEWS_STATUS_TINTS[initial?.status ?? "draft"]
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > MAX_BANNER_BYTES) {
      setUploadError("Image must be under 400 KB for this demo store.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setBannerImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form
      className="space-y-4 rounded-xl border border-phmc-border bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          summary,
          body,
          status,
          publishAt: publishAt ? new Date(publishAt).toISOString() : undefined,
          pinned,
          bannerImage,
          bannerTint,
        });
      }}
    >
      <TextField isRequired>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </TextField>
      <TextField isRequired>
        <Label>Summary</Label>
        <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
      </TextField>

      <div className="space-y-3 rounded-xl border border-phmc-border bg-phmc-surface-muted/40 p-4">
        <div>
          <Label className="mb-1 block">Banner image</Label>
          <p className="text-xs text-phmc-text-muted">
            Upload a photo or pick a preset. Rows in the news table show title and summary over a
            translucent banner for quick visual scanning.
          </p>
        </div>

        {title ? (
          <NewsTitleBanner
            title={title}
            summary={summary || "Summary preview"}
            status={status}
            bannerImage={bannerImage}
            bannerTint={bannerTint}
          />
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" onPress={() => fileRef.current?.click()}>
            Upload image
          </Button>
          {bannerImage ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onPress={() => {
                setBannerImage(undefined);
                setUploadError(null);
              }}
            >
              Remove image
            </Button>
          ) : null}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}

        <div>
          <Label className="mb-2 block text-xs">Preset banners</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {NEWS_BANNER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`relative h-16 overflow-hidden rounded-lg border-2 transition ${
                  bannerImage === preset.image
                    ? "border-phmc-primary ring-2 ring-phmc-primary/30"
                    : "border-transparent hover:border-phmc-border"
                }`}
                onClick={() => {
                  setBannerImage(preset.image);
                  setBannerTint(preset.tint);
                  setUploadError(null);
                }}
              >
                <span
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${preset.image})` }}
                  aria-hidden
                />
                <span
                  className="absolute inset-0"
                  style={{ backgroundColor: preset.tint }}
                  aria-hidden
                />
                <span className="relative flex h-full items-end p-1.5 text-left text-[10px] font-semibold text-white drop-shadow">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-1 block text-xs">Overlay tint</Label>
          <select
            className="w-full rounded-lg border border-phmc-border p-2 text-sm"
            value={bannerTint}
            onChange={(e) => setBannerTint(e.target.value)}
          >
            <option value={NEWS_STATUS_TINTS.draft}>Draft (slate)</option>
            <option value={NEWS_STATUS_TINTS.published}>Published (PHMC green)</option>
            <option value={NEWS_STATUS_TINTS.scheduled}>Scheduled (teal)</option>
            {NEWS_BANNER_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.tint}>
                {preset.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-phmc-text-muted">
            Without an image, the table row still uses this tint over a soft gradient.
          </p>
        </div>
      </div>

      <div>
        <Label className="mb-1 block">Body (markdown)</Label>
        <textarea
          className="min-h-40 w-full rounded-lg border border-phmc-border p-3 text-sm"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div>
        <Label className="mb-2 block">Live preview</Label>
        <MarkdownPreview source={body} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1 block">Status</Label>
          <select
            className="w-full rounded-lg border border-phmc-border p-2 text-sm"
            value={status}
            onChange={(e) => {
              const next = e.target.value as NewsStatus;
              setStatus(next);
              if (!initial?.bannerTint && !NEWS_BANNER_PRESETS.some((p) => p.tint === bannerTint)) {
                setBannerTint(NEWS_STATUS_TINTS[next]);
              }
            }}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="scheduled">scheduled</option>
          </select>
        </div>
        <TextField>
          <Label>Publish date</Label>
          <Input
            type="datetime-local"
            value={publishAt}
            onChange={(e) => setPublishAt(e.target.value)}
          />
        </TextField>
      </div>
      <Switch isSelected={pinned} onChange={setPinned}>
        Pin to top
      </Switch>
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
