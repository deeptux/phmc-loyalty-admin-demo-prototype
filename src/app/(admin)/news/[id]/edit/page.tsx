"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { NewsForm } from "@/components/forms/NewsForm";
import { useDemoStore } from "@/context/DemoStoreContext";

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const store = useDemoStore();
  const router = useRouter();
  const item = store.getNews(id);

  if (!item) {
    return <p className="text-phmc-text-muted">News item not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold">Edit news</h1>
      <NewsForm
        initial={item}
        onSubmit={(values) => {
          store.updateNews(id, values);
          router.push("/news");
        }}
        onCancel={() => router.push("/news")}
      />
    </div>
  );
}
