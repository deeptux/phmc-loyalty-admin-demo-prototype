"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import {
  seedDashboardMetrics,
  seedMembers,
  seedNews,
  seedPerks,
  seedPrivileges,
  seedTiers,
  seedVouchers,
  type LoyaltyMember,
  type MembershipTier,
  type NewsItem,
  type Perk,
  type PrivilegeBlock,
  type Voucher,
} from "@phmc/demo-data";

const STORAGE_KEY = "phmc-admin-demo-store-v1";

type StoreState = {
  news: NewsItem[];
  vouchers: Voucher[];
  privileges: PrivilegeBlock[];
  perks: Perk[];
  tiers: MembershipTier[];
  members: LoyaltyMember[];
};

type Action =
  | { type: "HYDRATE"; payload: StoreState }
  | { type: "SET_NEWS"; payload: NewsItem[] }
  | { type: "SET_VOUCHERS"; payload: Voucher[] }
  | { type: "SET_PRIVILEGES"; payload: PrivilegeBlock[] }
  | { type: "SET_PERKS"; payload: Perk[] }
  | { type: "SET_TIERS"; payload: MembershipTier[] }
  | { type: "SET_MEMBERS"; payload: LoyaltyMember[] };

const initialState: StoreState = {
  news: seedNews,
  vouchers: seedVouchers,
  privileges: seedPrivileges,
  perks: seedPerks,
  tiers: seedTiers,
  members: seedMembers,
};

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "SET_NEWS":
      return { ...state, news: action.payload };
    case "SET_VOUCHERS":
      return { ...state, vouchers: action.payload };
    case "SET_PRIVILEGES":
      return { ...state, privileges: action.payload };
    case "SET_PERKS":
      return { ...state, perks: action.payload };
    case "SET_TIERS":
      return { ...state, tiers: action.payload };
    case "SET_MEMBERS":
      return { ...state, members: action.payload };
    default:
      return state;
  }
}

function loadState(): StoreState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...JSON.parse(raw) } as StoreState;
  } catch {
    return initialState;
  }
}

function persistState(state: StoreState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

type DemoStore = StoreState & {
  dashboardMetrics: typeof seedDashboardMetrics;
  listNews: () => NewsItem[];
  getNews: (id: string) => NewsItem | undefined;
  createNews: (item: Omit<NewsItem, "id" | "updatedAt">) => NewsItem;
  updateNews: (id: string, patch: Partial<NewsItem>) => NewsItem | undefined;
  deleteNews: (id: string) => void;
  listVouchers: () => Voucher[];
  getVoucher: (id: string) => Voucher | undefined;
  createVoucher: (item: Omit<Voucher, "id" | "updatedAt">) => Voucher;
  updateVoucher: (id: string, patch: Partial<Voucher>) => Voucher | undefined;
  deleteVoucher: (id: string) => void;
  pauseVouchers: (ids: string[]) => void;
  listPrivileges: () => PrivilegeBlock[];
  savePrivileges: (items: PrivilegeBlock[]) => void;
  listPerks: () => Perk[];
  createPerk: (item: Omit<Perk, "id">) => Perk;
  updatePerk: (id: string, patch: Partial<Perk>) => Perk | undefined;
  deletePerk: (id: string) => void;
  listTiers: () => MembershipTier[];
  createTier: (item: Omit<MembershipTier, "id">) => MembershipTier;
  updateTier: (id: string, patch: Partial<MembershipTier>) => MembershipTier | undefined;
  deleteTier: (id: string) => void;
  listMembers: () => LoyaltyMember[];
  getMember: (id: string) => LoyaltyMember | undefined;
  createMember: (item: Omit<LoyaltyMember, "id" | "memberNumber" | "lastActiveAt">) => LoyaltyMember;
  updateMember: (id: string, patch: Partial<LoyaltyMember>) => LoyaltyMember | undefined;
  deleteMember: (id: string) => void;
};

const Ctx = createContext<DemoStore | null>(null);

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadState() });
  }, []);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const patchNews = useCallback((updater: (items: NewsItem[]) => NewsItem[]) => {
    dispatch({ type: "SET_NEWS", payload: updater(state.news) });
  }, [state.news]);

  const patchVouchers = useCallback((updater: (items: Voucher[]) => Voucher[]) => {
    dispatch({ type: "SET_VOUCHERS", payload: updater(state.vouchers) });
  }, [state.vouchers]);

  const value = useMemo<DemoStore>(() => ({
    ...state,
    dashboardMetrics: seedDashboardMetrics,
    listNews: () => [...state.news].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    getNews: (id) => state.news.find((n) => n.id === id),
    createNews: (item) => {
      const created: NewsItem = {
        ...item,
        id: nextId("news"),
        updatedAt: new Date().toISOString(),
      };
      patchNews((items) => [created, ...items]);
      return created;
    },
    updateNews: (id, patch) => {
      let updated: NewsItem | undefined;
      patchNews((items) =>
        items.map((n) => {
          if (n.id !== id) return n;
          updated = { ...n, ...patch, updatedAt: new Date().toISOString() };
          return updated;
        })
      );
      return updated;
    },
    deleteNews: (id) => patchNews((items) => items.filter((n) => n.id !== id)),
    listVouchers: () => [...state.vouchers].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    getVoucher: (id) => state.vouchers.find((v) => v.id === id),
    createVoucher: (item) => {
      const created: Voucher = {
        ...item,
        id: nextId("v"),
        updatedAt: new Date().toISOString(),
      };
      patchVouchers((items) => [created, ...items]);
      return created;
    },
    updateVoucher: (id, patch) => {
      let updated: Voucher | undefined;
      patchVouchers((items) =>
        items.map((v) => {
          if (v.id !== id) return v;
          updated = { ...v, ...patch, updatedAt: new Date().toISOString() };
          return updated;
        })
      );
      return updated;
    },
    deleteVoucher: (id) => patchVouchers((items) => items.filter((v) => v.id !== id)),
    pauseVouchers: (ids) => {
      patchVouchers((items) =>
        items.map((v) =>
          ids.includes(v.id) ? { ...v, status: "paused", updatedAt: new Date().toISOString() } : v
        )
      );
    },
    listPrivileges: () => [...state.privileges].sort((a, b) => a.order - b.order),
    savePrivileges: (items) => dispatch({ type: "SET_PRIVILEGES", payload: items }),
    listPerks: () => state.perks,
    createPerk: (item) => {
      const created = { ...item, id: nextId("perk") };
      dispatch({ type: "SET_PERKS", payload: [created, ...state.perks] });
      return created;
    },
    updatePerk: (id, patch) => {
      let updated: Perk | undefined;
      const perks = state.perks.map((p) => {
        if (p.id !== id) return p;
        updated = { ...p, ...patch };
        return updated;
      });
      dispatch({ type: "SET_PERKS", payload: perks });
      return updated;
    },
    deletePerk: (id) =>
      dispatch({ type: "SET_PERKS", payload: state.perks.filter((p) => p.id !== id) }),
    listTiers: () => [...state.tiers].sort((a, b) => a.order - b.order),
    createTier: (item) => {
      const created = { ...item, id: nextId("tier") };
      dispatch({ type: "SET_TIERS", payload: [...state.tiers, created] });
      return created;
    },
    updateTier: (id, patch) => {
      let updated: MembershipTier | undefined;
      const tiers = state.tiers.map((t) => {
        if (t.id !== id) return t;
        updated = { ...t, ...patch };
        return updated;
      });
      dispatch({ type: "SET_TIERS", payload: tiers });
      return updated;
    },
    deleteTier: (id) =>
      dispatch({ type: "SET_TIERS", payload: state.tiers.filter((t) => t.id !== id) }),
    listMembers: () =>
      [...state.members].sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt)),
    getMember: (id) => state.members.find((m) => m.id === id),
    createMember: (item) => {
      const seq = String(state.members.length + 1).padStart(5, "0");
      const created: LoyaltyMember = {
        ...item,
        id: nextId("m"),
        memberNumber: `PHMC-2026-${seq}`,
        lastActiveAt: new Date().toISOString(),
      };
      dispatch({ type: "SET_MEMBERS", payload: [created, ...state.members] });
      return created;
    },
    updateMember: (id, patch) => {
      let updated: LoyaltyMember | undefined;
      const members = state.members.map((m) => {
        if (m.id !== id) return m;
        updated = { ...m, ...patch, lastActiveAt: new Date().toISOString() };
        return updated;
      });
      dispatch({ type: "SET_MEMBERS", payload: members });
      return updated;
    },
    deleteMember: (id) =>
      dispatch({ type: "SET_MEMBERS", payload: state.members.filter((m) => m.id !== id) }),
  }), [state, patchNews, patchVouchers]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoStore outside provider");
  return ctx;
}
