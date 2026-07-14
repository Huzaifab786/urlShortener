import type { Metadata } from "next";
import { Suspense } from "react";

import {
  ClicksOverTimeChart,
  TopLinksChart,
} from "@/components/dashboard/analytics-charts";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { getAnalyticsData } from "@/lib/data/analytics";

export const metadata: Metadata = {
  title: "Analytics — Snipp",
};

export const dynamic = "force-dynamic";

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[88px] animate-pulse rounded-xl bg-secondary"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-xl bg-secondary" />
      <div className="h-80 animate-pulse rounded-xl bg-secondary" />
    </div>
  );
}

async function AnalyticsContent() {
  const data = await getAnalyticsData();

  if (data.totalLinks === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Clicks"
          value={data.totalClicks.toLocaleString()}
        />
        <StatCard
          label="Clicks (30d)"
          value={data.totalClicks30d.toLocaleString()}
        />
        <StatCard
          label="Links with Clicks"
          value={data.linksWithClicks.toLocaleString()}
        />
      </div>

      <div className="flex flex-col gap-6">
        <ClicksOverTimeChart data={data.clicksOverTime} />
        <TopLinksChart links={data.topLinks} />
      </div>
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-container-max flex-1 px-4 py-6 md:px-6 md:py-8">
      <header className="mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground md:text-4xl">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Click trends across all of your shortened links.
        </p>
      </header>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}
