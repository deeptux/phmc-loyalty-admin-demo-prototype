"use client";

import { useRouter } from "next/navigation";
import { VoucherForm } from "@/components/forms/VoucherForm";
import { useDemoStore } from "@/context/DemoStoreContext";

export default function NewVoucherPage() {
  const store = useDemoStore();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold">Create voucher</h1>
      <VoucherForm
        onSubmit={(values) => {
          const item = store.createVoucher(values);
          router.push(`/vouchers/${item.id}`);
        }}
        onCancel={() => router.push("/vouchers")}
      />
    </div>
  );
}
