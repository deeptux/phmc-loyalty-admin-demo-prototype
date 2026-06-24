"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@heroui/react";
import type { DashboardMetrics } from "@phmc/demo-data";

type Props = {
  metrics: DashboardMetrics;
};

export function DashboardCharts({ metrics }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="overflow-hidden border border-phmc-border shadow-sm">
        <Card.Header className="border-b border-phmc-border bg-white px-5 py-4">
          <Card.Title className="text-base font-bold text-phmc-text">
            Points issued vs redeemed
          </Card.Title>
          <Card.Description>Monthly privilege points (mock series)</Card.Description>
        </Card.Header>
        <Card.Content className="bg-white p-4">
          <div className="h-80 w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={320}>
              <LineChart data={metrics.pointsTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e8e8e8" strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: "#5c5c5c", fontSize: 12 }} />
                <YAxis tick={{ fill: "#5c5c5c", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="issued"
                  name="Issued"
                  stroke="#006837"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#006837" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="redeemed"
                  name="Redeemed"
                  stroke="#208b7d"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#208b7d" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>

      <Card className="overflow-hidden border border-phmc-border shadow-sm">
        <Card.Header className="border-b border-phmc-border bg-white px-5 py-4">
          <Card.Title className="text-base font-bold text-phmc-text">Voucher activity</Card.Title>
          <Card.Description>Issued vs redeemed vouchers (mock)</Card.Description>
        </Card.Header>
        <Card.Content className="bg-white p-4">
          <div className="h-80 w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={320}>
              <BarChart data={metrics.voucherTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e8e8e8" strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: "#5c5c5c", fontSize: 12 }} />
                <YAxis tick={{ fill: "#5c5c5c", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend />
                <Bar dataKey="issued" name="Issued" fill="#006837" radius={[6, 6, 0, 0]} />
                <Bar dataKey="redeemed" name="Redeemed" fill="#7cb342" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
