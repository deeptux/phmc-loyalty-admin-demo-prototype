"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Chip, Input, Accordion } from "@heroui/react";
import { ChartBarSquareIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { LoyaltyMember, MemberStatus } from "@phmc/demo-data";
import { ConfirmModal } from "@/components/ConfirmModal";
import { MemberAvatar } from "@/components/members/MemberAvatar";
import { MemberMiniDashboard } from "@/components/members/MemberMiniDashboard";
import { MemberProfileDrawer } from "@/components/members/MemberProfileDrawer";
import { MemberStatusChip, MemberTierChip } from "@/components/StatusChips";
import { DataTable } from "@/components/tables/DataTable";
import { useDemoStore } from "@/context/DemoStoreContext";
import { formatDateTime, downloadCsv } from "@/lib/utils";

const statuses: (MemberStatus | "all")[] = ["all", "active", "pending", "inactive"];

type DrawerState =
  | { open: false }
  | { open: true; member: LoyaltyMember | null; mode: "view" | "edit" | "create" };

export default function MembersPage() {
  const store = useDemoStore();
  const members = store.listMembers();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "all">("all");
  const [drawer, setDrawer] = useState<DrawerState>({ open: false });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (!q) return true;
      const hay = `${m.firstName} ${m.lastName} ${m.email} ${m.memberNumber}`.toLowerCase();
      return hay.includes(q);
    });
  }, [members, query, statusFilter]);

  const rosterActive = useMemo(
    () => members.filter((m) => m.status === "active").length,
    [members]
  );

  const columns = useMemo<ColumnDef<LoyaltyMember>[]>(
    () => [
      {
        header: "Member",
        cell: ({ row }) => {
          const m = row.original;
          return (
            <div className="flex items-center gap-3">
              <MemberAvatar member={m} size="md" />
              <div className="min-w-0">
                <p className="font-semibold text-phmc-text">
                  {m.firstName} {m.lastName}
                </p>
                <p className="truncate text-xs text-phmc-text-muted">{m.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        header: "Member ID",
        accessorKey: "memberNumber",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-phmc-text-muted">{row.original.memberNumber}</span>
        ),
      },
      {
        header: "Tier",
        accessorKey: "tier",
        cell: ({ row }) => <MemberTierChip tier={row.original.tier} />,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <MemberStatusChip status={row.original.status} />,
      },
      {
        header: "Points",
        accessorKey: "pointsBalance",
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums">
            {row.original.pointsBalance.toLocaleString()}
          </span>
        ),
      },
      {
        header: "Last active",
        accessorKey: "lastActiveAt",
        cell: ({ row }) => (
          <span className="text-phmc-text-muted">{formatDateTime(row.original.lastActiveAt)}</span>
        ),
      },
      {
        header: " ",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="ghost"
            onPress={(e) => {
              e.continuePropagation?.();
              setDrawer({ open: true, member: row.original, mode: "view" });
            }}
            onClick={(e) => e.stopPropagation()}
          >
            View
          </Button>
        ),
      },
    ],
    []
  );

  const exportCsv = () => {
    downloadCsv("phmc-members-demo.csv", [
      ["Member ID", "Name", "Email", "Tier", "Status", "Points", "Joined"],
      ...filtered.map((m) => [
        m.memberNumber,
        `${m.firstName} ${m.lastName}`,
        m.email,
        m.tier,
        m.status,
        String(m.pointsBalance),
        m.joinedAt,
      ]),
    ]);
  };

  const handleSave = (data: Partial<LoyaltyMember> & { id?: string }) => {
    if (data.id) {
      store.updateMember(data.id, data);
    } else {
      store.createMember({
        firstName: data.firstName!,
        lastName: data.lastName!,
        email: data.email!,
        phone: data.phone!,
        status: data.status!,
        tier: data.tier!,
        pointsBalance: data.pointsBalance ?? 0,
        pointsLifetime: data.pointsLifetime ?? 0,
        joinedAt: data.joinedAt!,
        avatarColor: data.avatarColor!,
        campus: data.campus!,
        cardsLinked: data.cardsLinked ?? 0,
        vouchersRedeemed: data.vouchersRedeemed ?? 0,
        notes: data.notes,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-phmc-primary-light">
            PHMC Privilege · Las Piñas
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-phmc-text">Members</h1>
          <p className="mt-1 text-sm text-phmc-text-muted">
            Loyalty program roster [Demo CRUD w/Profile Drawer]
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onPress={exportCsv}>
            Export CSV
          </Button>
          <Button
            variant="primary"
            onPress={() => setDrawer({ open: true, member: null, mode: "create" })}
          >
            Add member
          </Button>
        </div>
      </div>

      <Accordion
        variant="surface"
        defaultExpandedKeys={[]}
        className="overflow-hidden rounded-2xl border border-phmc-border shadow-sm"
      >
        <Accordion.Item id="member-insights">
          <Accordion.Heading>
            <Accordion.Trigger className="px-4 py-3">
              <div className="flex flex-1 items-center gap-3 text-left">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-phmc-primary/10 text-phmc-primary">
                  <ChartBarSquareIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-phmc-text">Program insights</p>
                  <p className="text-xs text-phmc-text-muted">
                    Scorecards, tier mix, and enrollment trend [EXPAND TO SEE ANALYTICS]
                  </p>
                </div>
              </div>
              <span className="mr-2 hidden text-xs font-semibold text-phmc-text-muted sm:inline">
                {store.dashboardMetrics.activeMembers.toLocaleString()} program active · {rosterActive}/
                {members.length} roster
              </span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="border-t border-phmc-border bg-white px-4 py-4">
              <MemberMiniDashboard
                members={members}
                programActiveTotal={store.dashboardMetrics.activeMembers}
              />
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-phmc-text-muted" />
            <Input
              aria-label="Search members"
              className="pl-9"
              placeholder="Search name, email, or member ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <Chip
                key={s}
                className="cursor-pointer capitalize"
                color={statusFilter === s ? "accent" : "default"}
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" ? "All" : s}
              </Chip>
            ))}
          </div>
        </div>

        <DataTable
          data={filtered}
          columns={columns}
          pageSize={8}
          onRowClick={(member) => setDrawer({ open: true, member, mode: "view" })}
        />
      </div>

      {drawer.open ? (
        <MemberProfileDrawer
          member={drawer.member}
          mode={drawer.mode}
          isOpen={drawer.open}
          onClose={() => setDrawer({ open: false })}
          onSave={handleSave}
          onDelete={(id) => {
            setDrawer({ open: false });
            setDeleteId(id);
          }}
        />
      ) : null}

      <ConfirmModal
        title="Delete member?"
        message="This removes the member from the demo roster. This cannot be undone in-session."
        confirmLabel="Delete"
        danger
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) store.deleteMember(deleteId);
        }}
      />
    </div>
  );
}
