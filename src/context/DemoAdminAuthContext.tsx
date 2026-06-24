"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { demoAccounts, type AdminRole } from "@phmc/demo-data";

export type AdminUser = {
  email: string;
  name: string;
  role: AdminRole;
};

type AuthContextValue = {
  user: AdminUser | null;
  ready: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setRole: (role: AdminRole) => void;
};

const STORAGE_KEY = "phmc-admin-demo-auth-v1";
const Ctx = createContext<AuthContextValue | null>(null);

function loadUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function DemoAdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(loadUser());
    setReady(true);
  }, []);

  const persist = useCallback((next: AdminUser | null) => {
    setUser(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const account = demoAccounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!account && email.trim() && password.trim()) {
      persist({ email: email.trim(), name: "Demo Admin", role: "Super Admin" });
      return true;
    }
    if (!account) return false;
    persist({ email: account.email, name: account.name, role: account.role });
    return true;
  }, [persist]);

  const logout = useCallback(() => persist(null), [persist]);

  const setRole = useCallback(
    (role: AdminRole) => {
      if (!user) return;
      persist({ ...user, role });
    },
    [persist, user]
  );

  const value = useMemo(
    () => ({ user, ready, login, logout, setRole }),
    [user, ready, login, logout, setRole]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoAdminAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoAdminAuth outside provider");
  return ctx;
}

export function useRequireAdminAuth() {
  const auth = useDemoAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.ready && !auth.user) router.replace("/login");
  }, [auth.ready, auth.user, router]);

  return auth;
}
