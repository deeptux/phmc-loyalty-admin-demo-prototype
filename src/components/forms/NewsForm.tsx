"use client";

import { useState } from "react";
import { Button, Input, Label, Switch, TextField } from "@heroui/react";
import type { NewsItem, NewsStatus } from "@phmc/demo-data";
import { MarkdownPreview } from "@/components/MarkdownPreview";

type Values = Omit<NewsItem, "id" | "updatedAt">;

type Props = {
  initial?: NewsItem;
  onSubmit: (values: Values) => void;
  onCancel: () => void;
};

export function NewsForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [status, setStatus] = useState<NewsStatus>(initial?.status ?? "draft");
  const [publishAt, setPublishAt] = useState(
    initial?.publishAt ? initial.publishAt.slice(0, 16) : ""
  );
  const [pinned, setPinned] = useState(initial?.pinned ?? false);

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
            onChange={(e) => setStatus(e.target.value as NewsStatus)}
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
