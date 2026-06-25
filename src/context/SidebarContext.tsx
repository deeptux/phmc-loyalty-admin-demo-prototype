"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
};

const Ctx = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);

  const value = useMemo(
    () => ({
      collapsed,
      toggle: () => setCollapsed((c) => !c),
      mobileOpen,
      openMobile,
      closeMobile,
      toggleMobile,
    }),
    [collapsed, mobileOpen, closeMobile, openMobile, toggleMobile]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSidebar() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSidebar outside provider");
  return ctx;
}
