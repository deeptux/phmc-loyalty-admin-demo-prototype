import { BASE_PATH } from "@/lib/base-path";

export function resolveMemberAvatarUrl(avatarUrl: string | undefined): string | undefined {
  if (!avatarUrl) return undefined;
  if (avatarUrl.startsWith("data:") || avatarUrl.startsWith("http")) return avatarUrl;
  return `${BASE_PATH}${avatarUrl}`;
}

export const MAX_MEMBER_AVATAR_BYTES = 300_000;
