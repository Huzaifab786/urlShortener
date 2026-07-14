"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  AnalyticsDayPoint,
  AnalyticsTopLink,
} from "@/lib/data/analytics";

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function ClicksOverTimeChart({ data }: { data: AnalyticsDayPoint[] }) {
  const gradientId = useId().replace(/:/g, "");
  const hasActivity = data.some((d) => d.clicks > 0);

  if (!hasActivity) {
    return (
      <ChartCard
        title="Clicks over time"
        description="Last 30 days across all of your links."
      >
        <div className="flex h-64 items-center justify-center rounded-lg bg-secondary/50 text-sm text-muted-foreground">
          No clicks in the last 30 days yet.
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Clicks over time"
      description="Last 30 days across all of your links."
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              minTickGap={28}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={36}
              tick={{ fill: "#6B7280", fontSize: 12, fontFamily: "var(--font-mono), ui-monospace, monospace" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E5E5E5",
                boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
              }}
              labelStyle={{ color: "#171717", fontWeight: 600 }}
              formatter={(value) => [
                typeof value === "number" ? value.toLocaleString() : String(value ?? 0),
                "Clicks",
              ]}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#3B82F6"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function TopLinksChart({ links }: { links: AnalyticsTopLink[] }) {
  if (links.length === 0) {
    return (
      <ChartCard
        title="Top links"
        description="Your five most clicked short URLs."
      >
        <div className="flex h-64 items-center justify-center rounded-lg bg-secondary/50 text-sm text-muted-foreground">
          No click data yet. Share a short link to see rankings here.
        </div>
      </ChartCard>
    );
  }

  const chartData = links.map((link) => ({
    name: link.label.length > 22 ? `${link.label.slice(0, 21)}…` : link.label,
    fullName: link.label,
    shortUrl: link.short_url,
    clicks: link.click_count,
  }));

  return (
    <ChartCard
      title="Top links"
      description="Your five most clicked short URLs."
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5E5" />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12, fontFamily: "var(--font-mono), ui-monospace, monospace" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#171717", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E5E5E5",
                boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
              }}
              formatter={(value, _name, item) => {
                const payload = item?.payload as
                  | { shortUrl?: string; fullName?: string }
                  | undefined;
                const count =
                  typeof value === "number"
                    ? value.toLocaleString()
                    : String(value ?? 0);
                return [
                  count,
                  payload?.shortUrl ?? payload?.fullName ?? "Clicks",
                ];
              }}
            />
            <Bar
              dataKey="clicks"
              fill="#3B82F6"
              radius={[0, 6, 6, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
