"use client";

import { useMemo } from "react";
import {
  UserGroupIcon,
  UserPlusIcon,
  SparklesIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@heroui/react";
import type { LoyaltyMember } from "@phmc/demo-data";

const TIER_COLORS: Record<string, string> = {
  Silver: "#94a3b8",
  Gold: "#d97706",
  Platinum: "#006837",
};

type Props = {
  members: LoyaltyMember[];
  programActiveTotal: number;
};

export function MemberMiniDashboard({ members, programActiveTotal }: Props) {
  const stats = useMemo(() => {
    const active = members.filter((m) => m.status === "active").length;
    const newThisMonth = members.filter((m) => m.joinedAt.startsWith("2026-06")).length;
    const avgPoints =
      members.length > 0
        ? Math.round(members.reduce((s, m) => s + m.pointsBalance, 0) / members.length)
        : 0;

    const tierCounts = (["Silver", "Gold", "Platinum"] as const).map((tier) => ({
      name: tier,
      value: members.filter((m) => m.tier === tier).length,
    }));

    const signupTrend = [
      { month: "Jan", signups: 2 },
      { month: "Feb", signups: 1 },
      { month: "Mar", signups: 3 },
      { month: "Apr", signups: 2 },
      { month: "May", signups: 4 },
      { month: "Jun", signups: newThisMonth },
    ];

    return { active, newThisMonth, avgPoints, tierCounts, signupTrend };
  }, [members]);

  const miniCards = [
    {
      label: "Program active",
      value: programActiveTotal.toLocaleString(),
      sub: `${members.length} in demo roster`,
      icon: UserGroupIcon,
      accent: "bg-phmc-primary",
    },
    {
      label: "Roster active",
      value: String(stats.active),
      sub: "Sample members",
      icon: UserGroupIcon,
      accent: "bg-phmc-primary-light",
    },
    {
      label: "New this month",
      value: String(stats.newThisMonth),
      sub: "June 2026 signups",
      icon: UserPlusIcon,
      accent: "bg-phmc-accent",
    },
    {
      label: "Avg points balance",
      value: stats.avgPoints.toLocaleString(),
      sub: "Across demo roster",
      icon: SparklesIcon,
      accent: "bg-emerald-600",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {miniCards.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-3 rounded-2xl border border-phmc-border bg-white p-4 shadow-sm"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${c.accent}`}
            >
              <c.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-phmc-text-muted">
                {c.label}
              </p>
              <p className="text-2xl font-extrabold text-phmc-text">{c.value}</p>
              <p className="truncate text-xs text-phmc-text-muted">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden border border-phmc-border shadow-sm">
          <Card.Header className="border-b border-phmc-border bg-white px-5 py-4">
            <Card.Title className="flex items-center gap-2 text-base font-bold">
              <ChartPieIcon className="h-5 w-5 text-phmc-primary" />
              Tier distribution
            </Card.Title>
            <Card.Description>Demo roster breakdown</Card.Description>
          </Card.Header>
          <Card.Content className="bg-white p-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.tierCounts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {stats.tierCounts.map((entry) => (
                      <Cell key={entry.name} fill={TIER_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-phmc-text-muted">
              {stats.tierCounts.map((t) => (
                <span key={t.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: TIER_COLORS[t.name] }}
                  />
                  {t.name} ({t.value})
                </span>
              ))}
            </div>
          </Card.Content>
        </Card>

        <Card className="overflow-hidden border border-phmc-border shadow-sm">
          <Card.Header className="border-b border-phmc-border bg-white px-5 py-4">
            <Card.Title className="text-base font-bold">Enrollment trend</Card.Title>
            <Card.Description>Monthly signups (mock series)</Card.Description>
          </Card.Header>
          <Card.Content className="bg-white p-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.signupTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#e8e8e8" strokeDasharray="4 4" />
                  <XAxis dataKey="month" tick={{ fill: "#5c5c5c", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#5c5c5c", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e8e8e8",
                    }}
                  />
                  <Bar dataKey="signups" name="Signups" fill="#006837" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
