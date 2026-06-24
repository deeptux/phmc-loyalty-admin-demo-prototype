"use client";

import { simpleMarkdownToHtml } from "@/lib/utils";

export function MarkdownPreview({ source }: { source: string }) {
  return (
    <div
      className="markdown-preview rounded-lg border border-phmc-border bg-white p-4 text-sm text-phmc-text"
      dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(source) }}
    />
  );
}
