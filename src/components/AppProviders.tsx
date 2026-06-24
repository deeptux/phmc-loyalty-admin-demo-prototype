"use client";

import { DemoAdminAuthProvider } from "@/context/DemoAdminAuthContext";
import { DemoStoreProvider } from "@/context/DemoStoreContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DemoAdminAuthProvider>
      <DemoStoreProvider>{children}</DemoStoreProvider>
    </DemoAdminAuthProvider>
  );
}
