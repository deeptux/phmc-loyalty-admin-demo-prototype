"use client";

import type { LoyaltyMember } from "@phmc/demo-data";

type Props = {
  member: Pick<LoyaltyMember, "firstName" | "lastName" | "avatarColor">;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function memberInitials(member: Pick<LoyaltyMember, "firstName" | "lastName">) {
  return `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();
}

export function MemberAvatar({ member, size = "md", className = "" }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ring-2 ring-white ${sizes[size]} ${className}`}
      style={{ backgroundColor: member.avatarColor }}
      aria-hidden
    >
      {memberInitials(member)}
    </span>
  );
}
