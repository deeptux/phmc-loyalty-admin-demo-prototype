import { publicAsset } from "@/lib/public-asset";

export function resolveMemberAvatarUrl(avatarUrl: string | undefined): string | undefined {
  if (!avatarUrl) return undefined;
  return publicAsset(avatarUrl);
}

export const MAX_MEMBER_AVATAR_BYTES = 300_000;
