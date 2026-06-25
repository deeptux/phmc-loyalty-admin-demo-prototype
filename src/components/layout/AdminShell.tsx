"use client";

import { DemoBanner } from "./DemoBanner";
import { HeaderBar } from "./HeaderBar";
import { SidebarNav } from "./SidebarNav";
import { useRequireAdminAuth } from "@/context/DemoAdminAuthContext";
import { SidebarProvider } from "@/context/SidebarContext";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRequireAdminAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-phmc-surface-muted text-phmc-text-muted">
        Loading…
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <DemoBanner />
        <div className="flex min-h-0 flex-1">
          <SidebarNav />
          <div id="admin-workspace" className="relative flex min-w-0 flex-1 flex-col">
            <HeaderBar />
            <main className="flex-1 overflow-auto bg-phmc-surface-muted p-3 sm:p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
