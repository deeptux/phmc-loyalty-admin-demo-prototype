"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useDemoAdminAuth } from "@/context/DemoAdminAuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { navForRole } from "@/lib/navigation";

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useDemoAdminAuth();
  const { collapsed, toggle } = useSidebar();
  const [benefitsOpen, setBenefitsOpen] = useState(true);

  if (!user) return null;

  const items = navForRole(user.role);

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-phmc-border bg-white shadow-sm transition-all duration-200 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div
        className={`flex items-center border-b border-phmc-border ${
          collapsed ? "justify-center px-2 py-4" : "gap-3 px-4 py-4"
        }`}
      >
        <Image
          src="/brand/logo-phmc.png"
          alt="PHMC"
          width={collapsed ? 40 : 48}
          height={collapsed ? 62 : 74}
          className="h-auto w-auto shrink-0 object-contain"
          priority
        />
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold leading-tight text-phmc-primary">
              PHMC Privilege
            </p>
            <p className="text-[11px] text-phmc-text-muted">Admin · Las Piñas</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const hasChildren = !!item.children?.length;
          const childActive = item.children?.some((c) => pathname === c.href);

          if (hasChildren) {
            return (
              <div key={item.href}>
                {collapsed ? (
                  <Link
                    href={item.href}
                    title={item.label}
                    className={`mb-1 flex justify-center rounded-xl p-2.5 transition ${
                      active || childActive
                        ? "bg-phmc-primary text-white shadow-sm"
                        : "text-phmc-text hover:bg-phmc-surface-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setBenefitsOpen((o) => !o)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active || childActive
                        ? "bg-phmc-primary text-white shadow-sm"
                        : "text-phmc-text hover:bg-phmc-surface-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition ${benefitsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
                {!collapsed && benefitsOpen ? (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-phmc-primary/20 pl-3">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium transition ${
                            pathname === child.href
                              ? "bg-phmc-primary/10 text-phmc-primary"
                              : "text-phmc-text-muted hover:bg-phmc-surface-muted hover:text-phmc-text"
                          }`}
                        >
                          <ChildIcon className="h-4 w-4 shrink-0" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
                {collapsed ? (
                  <div className="mt-1 space-y-1">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          title={child.label}
                          className={`flex justify-center rounded-lg p-2 transition ${
                            pathname === child.href
                              ? "bg-phmc-primary/10 text-phmc-primary"
                              : "text-phmc-text-muted hover:bg-phmc-surface-muted"
                          }`}
                        >
                          <ChildIcon className="h-4 w-4" />
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-phmc-primary text-white shadow-sm"
                  : "text-phmc-text hover:bg-phmc-surface-muted"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-phmc-border p-2">
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-phmc-text-muted transition hover:bg-phmc-surface-muted hover:text-phmc-primary"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5" />
          ) : (
            <>
              <ChevronDoubleLeftIcon className="h-5 w-5" />
              <span>Collapse menu</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
