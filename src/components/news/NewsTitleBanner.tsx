"use client";

import type { NewsItem } from "@phmc/demo-data";
import { publicAsset, resolveNewsBannerTint } from "@/lib/news-banners";

type Props = Pick<NewsItem, "title" | "summary" | "status" | "bannerImage" | "bannerTint"> & {
  compact?: boolean;
};

export function NewsTitleBanner({
  title,
  summary,
  status,
  bannerImage,
  bannerTint,
  compact = false,
}: Props) {
  const tint = resolveNewsBannerTint(bannerTint, status);
  const imageUrl = bannerImage ? publicAsset(bannerImage) : undefined;

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${
        compact ? "min-h-[64px] min-w-[240px]" : "min-h-[80px] min-w-[280px]"
      }`}
    >
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-phmc-primary/25 via-phmc-primary/10 to-slate-200/40"
          aria-hidden
        />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: tint }} aria-hidden />
      <div className={`relative ${compact ? "px-3 py-2" : "px-3.5 py-2.5"}`}>
        <p className="font-semibold text-white drop-shadow-sm">{title}</p>
        <p className="line-clamp-2 text-xs text-white/90 drop-shadow-sm">{summary}</p>
      </div>
    </div>
  );
}
