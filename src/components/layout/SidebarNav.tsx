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
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar();
  const [benefitsOpen, setBenefitsOpen] = useState(true);

  if (!user) return null;

  const items = navForRole(user.role);
  const navClick = () => closeMobile();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-phmc-border bg-white shadow-lg transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-auto lg:translate-x-0 lg:shadow-sm ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-[72px]" : "lg:w-64"}`}
      >
        <div
          className={`flex items-center border-b border-phmc-border ${
            collapsed ? "lg:justify-center lg:px-2 lg:py-4" : "gap-3 px-4 py-4"
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
            <div className="min-w-0 lg:block">
              <p className="truncate text-sm font-extrabold leading-tight text-phmc-primary">
                PHMC Privilege
              </p>
              <p className="text-[11px] text-phmc-text-muted">Admin · Las Piñas</p>
            </div>
          ) : (
            <div className="min-w-0 lg:hidden">
              <p className="truncate text-sm font-extrabold leading-tight text-phmc-primary">
                PHMC Privilege
              </p>
              <p className="text-[11px] text-phmc-text-muted">Admin · Las Piñas</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
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
                      onClick={navClick}
                      className={`mb-1 flex justify-center rounded-xl p-2.5 transition lg:flex ${
                        active || childActive
                          ? "bg-phmc-primary text-white shadow-sm"
                          : "text-phmc-text hover:bg-phmc-surface-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setBenefitsOpen((o) => !o)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      collapsed ? "hidden lg:flex" : "flex"
                    } ${
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
                  {benefitsOpen ? (
                    <div
                      className={`ml-4 mt-1 space-y-0.5 border-l-2 border-phmc-primary/20 pl-3 ${
                        collapsed ? "hidden lg:block" : ""
                      }`}
                    >
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={navClick}
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
                    <div className="mt-1 hidden space-y-1 lg:block">
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            title={child.label}
                            onClick={navClick}
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
                onClick={navClick}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-phmc-primary text-white shadow-sm"
                    : "text-phmc-text hover:bg-phmc-surface-muted"
                } ${collapsed ? "lg:justify-center" : ""}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-phmc-border p-2 lg:block">
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
    </>
  );
}
