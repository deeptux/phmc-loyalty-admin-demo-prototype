"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { VoucherForm } from "@/components/forms/VoucherForm";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useDemoStore } from "@/context/DemoStoreContext";

export default function VoucherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const store = useDemoStore();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const item = store.getVoucher(id);

  if (!item) return <p className="text-phmc-text-muted">Voucher not found.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Edit voucher</h1>
        <Button variant="danger-soft" onPress={() => setConfirmDelete(true)}>
          Delete
        </Button>
      </div>
      <VoucherForm
        initial={item}
        onSubmit={(values) => {
          store.updateVoucher(id, values);
          router.push("/vouchers");
        }}
        onCancel={() => router.push("/vouchers")}
      />
      <ConfirmModal
        isOpen={confirmDelete}
        title="Delete voucher?"
        message="This removes the voucher from the demo store."
        confirmLabel="Delete"
        danger
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          store.deleteVoucher(id);
          router.push("/vouchers");
        }}
      />
    </div>
  );
}
