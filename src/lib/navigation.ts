import type { AdminRole } from "@phmc/demo-data";
import type { ComponentType, SVGProps } from "react";
import {
  ChartBarSquareIcon,
  GiftIcon,
  NewspaperIcon,
  SparklesIcon,
  Squares2X2Icon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  roles: AdminRole[];
  children?: { href: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[];
};

export const adminNav: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Squares2X2Icon,
    roles: ["Support L1", "Marketing", "Super Admin"],
  },
  {
    href: "/members",
    label: "Members",
    icon: UserGroupIcon,
    roles: ["Support L1", "Marketing", "Super Admin"],
  },
  {
    href: "/news",
    label: "News",
    icon: NewspaperIcon,
    roles: ["Marketing", "Super Admin"],
  },
  {
    href: "/vouchers",
    label: "Vouchers",
    icon: TicketIcon,
    roles: ["Support L1", "Marketing", "Super Admin"],
  },
  {
    href: "/benefits",
    label: "Benefits",
    icon: GiftIcon,
    roles: ["Marketing", "Super Admin"],
    children: [
      { href: "/benefits/privileges", label: "Privileges", icon: SparklesIcon },
      { href: "/benefits/perks", label: "Perks", icon: GiftIcon },
      { href: "/benefits/tiers", label: "Tiers", icon: ChartBarSquareIcon },
    ],
  },
];

export function navForRole(role: AdminRole): NavItem[] {
  return adminNav.filter((item) => item.roles.includes(role));
}
