"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@heroui/react";
import type { NewsItem } from "@phmc/demo-data";
import { NewsTitleBanner } from "@/components/news/NewsTitleBanner";
import { DataTable } from "@/components/tables/DataTable";
import { ConfirmModal } from "@/components/ConfirmModal";
import { NewsStatusChip } from "@/components/StatusChips";
import { useDemoStore } from "@/context/DemoStoreContext";
import { formatDateTime } from "@/lib/utils";

export default function NewsListPage() {
  const store = useDemoStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const data = store.listNews();

  const columns = useMemo<ColumnDef<NewsItem>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => <NewsTitleBanner {...row.original} compact />,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <NewsStatusChip status={row.original.status} />,
      },
      {
        header: "Publish",
        accessorKey: "publishAt",
        cell: ({ row }) => formatDateTime(row.original.publishAt),
      },
      {
        header: "Pinned",
        accessorKey: "pinned",
        cell: ({ row }) => (row.original.pinned ? "Yes" : "No"),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Link href={`/news/${row.original.id}/edit`}>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </Link>
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
        <div>
          <h1 className="text-2xl font-extrabold">News</h1>
          <p className="text-sm text-phmc-text-muted">Events, announcements, and engagement copy</p>
        </div>
        <Link href="/news/new">
          <Button variant="primary">Create news</Button>
        </Link>
      </div>
      <DataTable data={data} columns={columns} />
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete news item?"
        message="This removes the item from the demo store only."
        confirmLabel="Delete"
        danger
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && store.deleteNews(deleteId)}
      />
    </div>
  );
}
