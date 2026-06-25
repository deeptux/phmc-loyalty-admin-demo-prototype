import type { NewsStatus } from "@phmc/demo-data";
import { BASE_PATH } from "@/lib/base-path";

export type NewsBannerPreset = {
  id: string;
  label: string;
  image: string;
  tint: string;
};

/** Preset banners aligned with mobile Discover category tiles */
export const NEWS_BANNER_PRESETS: NewsBannerPreset[] = [
  {
    id: "hospital",
    label: "Hospital services",
    image: "/brand/hospital-services.jpg",
    tint: "rgba(0, 104, 55, 0.82)",
  },
  {
    id: "campus-dining",
    label: "Campus dining",
    image: "/brand/campus-dining.jpg",
    tint: "rgba(219, 39, 119, 0.78)",
  },
  {
    id: "wellness",
    label: "Wellness",
    image: "/brand/wellness.jpg",
    tint: "rgba(234, 179, 8, 0.78)",
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    image: "/brand/diagnostics.jpg",
    tint: "rgba(32, 139, 125, 0.82)",
  },
  {
    id: "more",
    label: "Community",
    image: "/brand/more.jpg",
    tint: "rgba(220, 38, 38, 0.78)",
  },
];

export const NEWS_STATUS_TINTS: Record<NewsStatus, string> = {
  draft: "rgba(100, 116, 139, 0.78)",
  published: "rgba(0, 104, 55, 0.82)",
  scheduled: "rgba(32, 139, 125, 0.82)",
};

export function resolveNewsBannerTint(
  bannerTint: string | undefined,
  status: NewsStatus
): string {
  return bannerTint ?? NEWS_STATUS_TINTS[status];
}

export function publicAsset(path: string): string {
  if (path.startsWith("data:") || path.startsWith("http")) return path;
  return `${BASE_PATH}${path}`;
}
