"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Button, Dropdown, Input, ListBox, Avatar } from "@heroui/react";
import { seedNotifications } from "@phmc/demo-data";
import { useDemoAdminAuth } from "@/context/DemoAdminAuthContext";

export function HeaderBar() {
  const router = useRouter();
  const { user, logout } = useDemoAdminAuth();
  const [query, setQuery] = useState("");

  if (!user) return null;

  return (
    <header className="flex items-center gap-4 border-b border-phmc-border bg-white px-6 py-3 shadow-sm">
      <div className="relative min-w-0 max-w-xl flex-1">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-phmc-text-muted" />
        <Input
          aria-label="Global search"
          className="w-full pl-9"
          placeholder="Search members, vouchers, news (mock)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Dropdown>
          <Button variant="ghost" isIconOnly aria-label="Notifications" className="relative">
            <BellIcon className="h-5 w-5 text-phmc-primary" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-phmc-warning" />
          </Button>
          <Dropdown.Popover className="w-80 p-2">
            <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-phmc-text-muted">
              Notifications
            </p>
            <ListBox aria-label="Notifications">
              {seedNotifications.map((n) => (
                <ListBox.Item key={n.id} id={n.id} textValue={n.title}>
                  <div className="py-1">
                    <p className="text-sm font-medium text-phmc-text">{n.title}</p>
                    <p className="text-xs text-phmc-text-muted">{n.time}</p>
                  </div>
                </ListBox.Item>
              ))}
            </ListBox>
          </Dropdown.Popover>
        </Dropdown>

        <Dropdown>
          <Button variant="ghost" className="gap-2 pl-2 pr-3">
            <Avatar className="h-9 w-9 bg-phmc-primary text-xs font-bold text-white">
              {user.name.slice(0, 2).toUpperCase()}
            </Avatar>
            <span className="hidden max-w-[140px] truncate text-sm font-semibold text-phmc-text md:inline">
              {user.name}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-phmc-text-muted" />
          </Button>
          <Dropdown.Popover className="w-56 p-2">
            <div className="border-b border-phmc-border px-2 pb-2">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-phmc-text-muted">{user.email}</p>
              <p className="mt-1 inline-block rounded-full bg-phmc-primary/10 px-2 py-0.5 text-xs font-semibold text-phmc-primary">
                {user.role}
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="danger-soft"
                className="w-full"
                onPress={() => {
                  logout();
                  router.push("/login");
                }}
              >
                Log out
              </Button>
            </div>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </header>
  );
}
