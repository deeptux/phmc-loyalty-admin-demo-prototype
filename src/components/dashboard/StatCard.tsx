"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { publicAsset } from "@/lib/public-asset";

type Props = {
  label: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  image: string;
  tint: string;
  href?: string;
};

export function StatCard({ label, value, icon: Icon, image, tint, href }: Props) {
  const inner = (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center transition group-hover:scale-105"
        style={{ backgroundImage: `url(${publicAsset(image)})` }}
        aria-hidden
      />
      <div className="absolute inset-0" style={{ backgroundColor: tint }} aria-hidden />
      <div className="relative flex min-h-[118px] flex-col justify-between p-4 text-white">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-white/90">{label}</p>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <p className="text-3xl font-extrabold tracking-tight drop-shadow-sm">{value}</p>
      </div>
    </>
  );

  const className =
    "group relative block overflow-hidden rounded-2xl border border-phmc-border bg-white shadow-sm transition hover:shadow-md";

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
