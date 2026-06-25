"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import {
  seedBenefitActivity,
  seedDashboardMetrics,
  seedEngagementPrograms,
  seedMembers,
  seedNews,
  seedPerkActivations,
  seedPerks,
  seedPrivileges,
  seedTierUpgradeRequests,
  seedTiers,
  seedVouchers,
  type BenefitActivity,
  type EngagementProgram,
  type LoyaltyMember,
  type MembershipTier,
  type NewsItem,
  type Perk,
  type PerkActivation,
  type PrivilegeBlock,
  type TierUpgradeRequest,
  type Voucher,
} from "@phmc/demo-data";

const STORAGE_KEY = "phmc-admin-demo-store-v1";

type StoreState = {
  news: NewsItem[];
  vouchers: Voucher[];
  privileges: PrivilegeBlock[];
  privilegesVersion: number;
  privilegesPublishedAt: string | null;
  perks: Perk[];
  tiers: MembershipTier[];
  members: LoyaltyMember[];
  engagementPrograms: EngagementProgram[];
  perkActivations: PerkActivation[];
  tierUpgradeRequests: TierUpgradeRequest[];
  benefitActivity: BenefitActivity[];
};

type Action =
  | { type: "HYDRATE"; payload: StoreState }
  | { type: "SET_NEWS"; payload: NewsItem[] }
  | { type: "SET_VOUCHERS"; payload: Voucher[] }
  | { type: "SET_PRIVILEGES"; payload: PrivilegeBlock[] }
  | { type: "SET_PRIVILEGES_META"; payload: { version: number; publishedAt: string | null } }
  | { type: "SET_PERKS"; payload: Perk[] }
  | { type: "SET_TIERS"; payload: MembershipTier[] }
  | { type: "SET_MEMBERS"; payload: LoyaltyMember[] }
  | { type: "SET_ENGAGEMENT_PROGRAMS"; payload: EngagementProgram[] }
  | { type: "SET_PERK_ACTIVATIONS"; payload: PerkActivation[] }
  | { type: "SET_TIER_UPGRADE_REQUESTS"; payload: TierUpgradeRequest[] }
  | { type: "SET_BENEFIT_ACTIVITY"; payload: BenefitActivity[] };

const initialState: StoreState = {
  news: seedNews,
  vouchers: seedVouchers,
  privileges: seedPrivileges,
  privilegesVersion: 4,
  privilegesPublishedAt: "2026-06-18T15:00:00.000Z",
  perks: seedPerks,
  tiers: seedTiers,
  members: seedMembers,
  engagementPrograms: seedEngagementPrograms,
  perkActivations: seedPerkActivations,
  tierUpgradeRequests: seedTierUpgradeRequests,
  benefitActivity: seedBenefitActivity,
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
    case "SET_PRIVILEGES_META":
      return {
        ...state,
        privilegesVersion: action.payload.version,
        privilegesPublishedAt: action.payload.publishedAt,
      };
    case "SET_PERKS":
      return { ...state, perks: action.payload };
    case "SET_TIERS":
      return { ...state, tiers: action.payload };
    case "SET_MEMBERS":
      return { ...state, members: action.payload };
    case "SET_ENGAGEMENT_PROGRAMS":
      return { ...state, engagementPrograms: action.payload };
    case "SET_PERK_ACTIVATIONS":
      return { ...state, perkActivations: action.payload };
    case "SET_TIER_UPGRADE_REQUESTS":
      return { ...state, tierUpgradeRequests: action.payload };
    case "SET_BENEFIT_ACTIVITY":
      return { ...state, benefitActivity: action.payload };
    default:
      return state;
  }
}

function hydrateVouchers(stored: Voucher[] | undefined): Voucher[] {
  const storedList = stored ?? [];
  const storedById = new Map(storedList.map((item) => [item.id, item]));
  const seedIds = new Set(seedVouchers.map((item) => item.id));
  const merged = seedVouchers.map((seed) => {
    const existing = storedById.get(seed.id);
    return existing ? { ...existing, status: seed.status } : seed;
  });
  for (const item of storedList) {
    if (!seedIds.has(item.id)) merged.push(item);
  }
  return merged;
}

function hydratePrivileges(stored: PrivilegeBlock[] | undefined): PrivilegeBlock[] {
  const normalized = (stored ?? []).map((item) => {
    const seed = seedPrivileges.find((s) => s.id === item.id);
    return {
      ...item,
      infographicImage: item.infographicImage ?? seed?.infographicImage,
    };
  });
  return mergeSeedList(normalized, seedPrivileges);
}

function hydratePerks(stored: Perk[] | undefined): Perk[] {
  const normalized = (stored ?? []).map((item) => {
    const seed = seedPerks.find((s) => s.id === item.id);
    return {
      ...item,
      enrollments: item.enrollments ?? seed?.enrollments ?? 0,
      redemptions: item.redemptions ?? seed?.redemptions ?? 0,
    };
  });
  return mergeSeedList(normalized, seedPerks);
}

function hydrateTiers(stored: MembershipTier[] | undefined): MembershipTier[] {
  const list = stored ?? [];
  const seedById = new Map(seedTiers.map((item) => [item.id, item]));
  const merged = list.map((item) => {
    const seed = seedById.get(item.id);
    return {
      ...item,
      memberCount: item.memberCount ?? seed?.memberCount ?? 0,
      version: item.version ?? seed?.version ?? 1,
      effectiveFrom: item.effectiveFrom ?? seed?.effectiveFrom ?? new Date().toISOString().slice(0, 10),
    };
  });
  for (const seed of seedTiers) {
    if (!merged.some((item) => item.id === seed.id)) merged.push(seed);
  }
  return merged;
}

function mergeSeedList<T extends { id: string }>(stored: T[] | undefined, seeds: T[]): T[] {
  const storedList = stored ?? [];
  const storedById = new Map(storedList.map((item) => [item.id, item]));
  const seedIds = new Set(seeds.map((item) => item.id));
  const merged = seeds.map((seed) => storedById.get(seed.id) ?? seed);
  for (const item of storedList) {
    if (!seedIds.has(item.id)) merged.push(item);
  }
  return merged;
}

function hydrateMembers(stored: LoyaltyMember[] | undefined): LoyaltyMember[] {
  const storedList = stored ?? [];
  const storedById = new Map(storedList.map((item) => [item.id, item]));
  const seedIds = new Set(seedMembers.map((item) => item.id));
  const merged = seedMembers.map((seed) => {
    const existing = storedById.get(seed.id);
    return existing
      ? { ...existing, avatarUrl: existing.avatarUrl ?? seed.avatarUrl }
      : seed;
  });
  for (const item of storedList) {
    if (!seedIds.has(item.id)) merged.push(item);
  }
  return merged;
}

function loadState(): StoreState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    const seedById = new Map(seedNews.map((item) => [item.id, item]));
    const news = (parsed.news ?? initialState.news).map((item) => {
      const seed = seedById.get(item.id);
      if (!seed) return item;
      return {
        ...item,
        bannerImage: item.bannerImage ?? seed.bannerImage,
        bannerTint: item.bannerTint ?? seed.bannerTint,
      };
    });
    const vouchers = hydrateVouchers(parsed.vouchers);
    const members = hydrateMembers(parsed.members);
    const privileges = hydratePrivileges(parsed.privileges);
    const perks = hydratePerks(parsed.perks);
    const tiers = hydrateTiers(parsed.tiers);
    const engagementPrograms = mergeSeedList(parsed.engagementPrograms, seedEngagementPrograms);
    const perkActivations = mergeSeedList(parsed.perkActivations, seedPerkActivations);
    const tierUpgradeRequests = mergeSeedList(parsed.tierUpgradeRequests, seedTierUpgradeRequests);
    const benefitActivity = mergeSeedList(parsed.benefitActivity, seedBenefitActivity);
    return {
      ...initialState,
      ...parsed,
      news,
      vouchers,
      members,
      privileges,
      perks,
      tiers,
      engagementPrograms,
      perkActivations,
      tierUpgradeRequests,
      benefitActivity,
      privilegesVersion: parsed.privilegesVersion ?? initialState.privilegesVersion,
      privilegesPublishedAt: parsed.privilegesPublishedAt ?? initialState.privilegesPublishedAt,
    };
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
  listEngagementPrograms: () => EngagementProgram[];
  updateEngagementProgram: (id: string, patch: Partial<EngagementProgram>) => EngagementProgram | undefined;
  simulateEngagementBatch: (id: string, count?: number) => boolean;
  listPerkActivations: () => PerkActivation[];
  recordPerkActivation: (
    perkId: string,
    memberId: string,
    status?: PerkActivation["status"]
  ) => PerkActivation | undefined;
  listTierUpgradeRequests: () => TierUpgradeRequest[];
  approveTierUpgrade: (id: string, reviewer: string, note?: string) => boolean;
  denyTierUpgrade: (id: string, reviewer: string, note?: string) => boolean;
  listBenefitActivity: () => BenefitActivity[];
  publishPrivileges: (actor: string) => void;
  publishTier: (id: string, actor: string) => MembershipTier | undefined;
  getBenefitsSummary: () => {
    pendingTierRequests: number;
    perkActivationsToday: number;
    engagementPointsIssued: number;
    activePrograms: number;
  };
  privilegesVersion: number;
  privilegesPublishedAt: string | null;
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
      const created: Perk = {
        ...item,
        id: nextId("perk"),
        enrollments: item.enrollments ?? 0,
        redemptions: item.redemptions ?? 0,
      };
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
      const created: MembershipTier = {
        ...item,
        id: nextId("tier"),
        memberCount: item.memberCount ?? 0,
        version: item.version ?? 1,
        effectiveFrom: item.effectiveFrom ?? new Date().toISOString().slice(0, 10),
      };
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
    listEngagementPrograms: () =>
      [...state.engagementPrograms].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    updateEngagementProgram: (id, patch) => {
      let updated: EngagementProgram | undefined;
      const programs = state.engagementPrograms.map((p) => {
        if (p.id !== id) return p;
        updated = { ...p, ...patch, updatedAt: new Date().toISOString() };
        return updated;
      });
      dispatch({ type: "SET_ENGAGEMENT_PROGRAMS", payload: programs });
      return updated;
    },
    simulateEngagementBatch: (id, count = 12) => {
      const program = state.engagementPrograms.find((p) => p.id === id);
      if (!program || program.status !== "active") return false;
      const remaining = program.budgetCap - program.pointsIssued;
      if (remaining <= 0) return false;
      const maxCompletions = Math.floor(remaining / program.pointsPerCompletion);
      const batch = Math.min(count, maxCompletions);
      if (batch <= 0) return false;
      const points = batch * program.pointsPerCompletion;
      const programs = state.engagementPrograms.map((p) =>
        p.id === id
          ? {
              ...p,
              completions: p.completions + batch,
              pointsIssued: p.pointsIssued + points,
              updatedAt: new Date().toISOString(),
            }
          : p
      );
      const activity: BenefitActivity = {
        id: nextId("ba"),
        type: "engagement_completion",
        summary: `${program.title} - ${batch} completions credited (${points.toLocaleString()} pts demo)`,
        actor: "system",
        occurredAt: new Date().toISOString(),
      };
      dispatch({ type: "SET_ENGAGEMENT_PROGRAMS", payload: programs });
      dispatch({ type: "SET_BENEFIT_ACTIVITY", payload: [activity, ...state.benefitActivity] });
      return true;
    },
    listPerkActivations: () =>
      [...state.perkActivations].sort((a, b) => b.activatedAt.localeCompare(a.activatedAt)),
    recordPerkActivation: (perkId, memberId, status = "enrolled") => {
      const perk = state.perks.find((p) => p.id === perkId);
      const member = state.members.find((m) => m.id === memberId);
      if (!perk || !member || !perk.active) return undefined;
      const activation: PerkActivation = {
        id: nextId("pa"),
        perkId: perk.id,
        perkTitle: perk.title,
        memberId: member.id,
        memberName: `${member.firstName} ${member.lastName}`,
        memberNumber: member.memberNumber,
        status,
        activatedAt: new Date().toISOString(),
      };
      const perks = state.perks.map((p) =>
        p.id === perkId
          ? {
              ...p,
              enrollments: p.enrollments + (status === "enrolled" ? 1 : 0),
              redemptions: p.redemptions + (status === "redeemed" ? 1 : 0),
            }
          : p
      );
      const activity: BenefitActivity = {
        id: nextId("ba"),
        type: "perk_activation",
        summary: `${member.firstName} ${member.lastName} ${status === "redeemed" ? "redeemed" : "enrolled in"} ${perk.title}`,
        occurredAt: activation.activatedAt,
      };
      dispatch({ type: "SET_PERKS", payload: perks });
      dispatch({ type: "SET_PERK_ACTIVATIONS", payload: [activation, ...state.perkActivations] });
      dispatch({ type: "SET_BENEFIT_ACTIVITY", payload: [activity, ...state.benefitActivity] });
      return activation;
    },
    listTierUpgradeRequests: () =>
      [...state.tierUpgradeRequests].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)),
    approveTierUpgrade: (id, reviewer, note) => {
      const request = state.tierUpgradeRequests.find((r) => r.id === id);
      if (!request || request.status !== "pending") return false;
      const reviewedAt = new Date().toISOString();
      const requests = state.tierUpgradeRequests.map((r) =>
        r.id === id
          ? { ...r, status: "approved" as const, reviewedAt, reviewedBy: reviewer, reviewNote: note }
          : r
      );
      const members = state.members.map((m) =>
        m.id === request.memberId ? { ...m, tier: request.requestedTier, lastActiveAt: reviewedAt } : m
      );
      const activity: BenefitActivity = {
        id: nextId("ba"),
        type: "tier_approved",
        summary: `${request.memberName} upgraded to ${request.requestedTier}`,
        actor: reviewer,
        occurredAt: reviewedAt,
      };
      dispatch({ type: "SET_TIER_UPGRADE_REQUESTS", payload: requests });
      dispatch({ type: "SET_MEMBERS", payload: members });
      dispatch({ type: "SET_BENEFIT_ACTIVITY", payload: [activity, ...state.benefitActivity] });
      return true;
    },
    denyTierUpgrade: (id, reviewer, note) => {
      const request = state.tierUpgradeRequests.find((r) => r.id === id);
      if (!request || request.status !== "pending") return false;
      const reviewedAt = new Date().toISOString();
      const requests = state.tierUpgradeRequests.map((r) =>
        r.id === id
          ? { ...r, status: "denied" as const, reviewedAt, reviewedBy: reviewer, reviewNote: note }
          : r
      );
      const activity: BenefitActivity = {
        id: nextId("ba"),
        type: "tier_denied",
        summary: `${request.memberName} tier upgrade to ${request.requestedTier} denied`,
        actor: reviewer,
        occurredAt: reviewedAt,
      };
      dispatch({ type: "SET_TIER_UPGRADE_REQUESTS", payload: requests });
      dispatch({ type: "SET_BENEFIT_ACTIVITY", payload: [activity, ...state.benefitActivity] });
      return true;
    },
    listBenefitActivity: () =>
      [...state.benefitActivity].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
    publishPrivileges: (actor) => {
      const publishedAt = new Date().toISOString();
      const version = state.privilegesVersion + 1;
      const activity: BenefitActivity = {
        id: nextId("ba"),
        type: "privileges_published",
        summary: `Privileges infographic v${version} published to mobile preview`,
        actor,
        occurredAt: publishedAt,
      };
      dispatch({ type: "SET_PRIVILEGES_META", payload: { version, publishedAt } });
      dispatch({ type: "SET_BENEFIT_ACTIVITY", payload: [activity, ...state.benefitActivity] });
    },
    publishTier: (id, actor) => {
      let updated: MembershipTier | undefined;
      const publishedAt = new Date().toISOString();
      const tiers = state.tiers.map((t) => {
        if (t.id !== id) return t;
        updated = {
          ...t,
          version: t.version + 1,
          effectiveFrom: publishedAt.slice(0, 10),
        };
        return updated;
      });
      if (!updated) return undefined;
      const activity: BenefitActivity = {
        id: nextId("ba"),
        type: "tier_published",
        summary: `${updated.name} tier benefits v${updated.version} effective ${updated.effectiveFrom}`,
        actor,
        occurredAt: publishedAt,
      };
      dispatch({ type: "SET_TIERS", payload: tiers });
      dispatch({ type: "SET_BENEFIT_ACTIVITY", payload: [activity, ...state.benefitActivity] });
      return updated;
    },
    getBenefitsSummary: () => {
      const today = new Date().toISOString().slice(0, 10);
      return {
        pendingTierRequests: state.tierUpgradeRequests.filter((r) => r.status === "pending").length,
        perkActivationsToday: state.perkActivations.filter((a) => a.activatedAt.startsWith(today))
          .length,
        engagementPointsIssued: state.engagementPrograms.reduce((sum, p) => sum + p.pointsIssued, 0),
        activePrograms: state.engagementPrograms.filter((p) => p.status === "active").length,
      };
    },
    privilegesVersion: state.privilegesVersion,
    privilegesPublishedAt: state.privilegesPublishedAt,
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
