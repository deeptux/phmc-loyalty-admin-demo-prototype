export type NewsStatus = "draft" | "published" | "scheduled";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  body: string;
  status: NewsStatus;
  publishAt?: string;
  pinned: boolean;
  updatedAt: string;
  /** Public path (/brand/...) or data URL from demo upload */
  bannerImage?: string;
  /** CSS color for translucent overlay (rgba) */
  bannerTint?: string;
};

export type VoucherStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "issued"
  | "redeemed"
  | "paused"
  | "expired";
export type VoucherType = "Care" | "Partner" | "Discount" | "Freebie";

export type Voucher = {
  id: string;
  code: string;
  title: string;
  type: VoucherType;
  status: VoucherStatus;
  startsAt: string;
  endsAt: string;
  description: string;
  updatedAt: string;
};

export type PrivilegeBlock = {
  id: string;
  heading: string;
  body: string;
  order: number;
};

export type Perk = {
  id: string;
  title: string;
  partner: string;
  description: string;
  active: boolean;
};

export type MembershipTier = {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  order: number;
};

export type DashboardMetrics = {
  activeMembers: number;
  pointsIssued: number;
  pointsRedeemed: number;
  voucherRedemptionRate: number;
  pointsTrend: { month: string; issued: number; redeemed: number }[];
  voucherTrend: { month: string; redeemed: number; issued: number }[];
};

export type MemberStatus = "active" | "inactive" | "pending";
export type MemberTier = "Silver" | "Gold" | "Platinum";

export type LoyaltyMember = {
  id: string;
  memberNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: MemberStatus;
  tier: MemberTier;
  pointsBalance: number;
  pointsLifetime: number;
  joinedAt: string;
  lastActiveAt: string;
  avatarColor: string;
  /** Public path, https URL, or data URL from demo upload */
  avatarUrl?: string;
  campus: string;
  cardsLinked: number;
  vouchersRedeemed: number;
  notes?: string;
};

export type AdminRole = "Support L1" | "Marketing" | "Super Admin";

export type DemoAdminUser = {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
};
