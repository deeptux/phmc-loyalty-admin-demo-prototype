"use client";

import { NewsForm } from "@/components/forms/NewsForm";
import { useDemoStore } from "@/context/DemoStoreContext";
import { useRouter } from "next/navigation";

export default function NewNewsPage() {
  const store = useDemoStore();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold">Create news</h1>
      <NewsForm
        onSubmit={(values) => {
          const item = store.createNews(values);
          router.push(`/news/${item.id}/edit`);
        }}
        onCancel={() => router.push("/news")}
      />
    </div>
  );
}
