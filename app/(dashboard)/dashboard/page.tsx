import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { LinksTable } from "@/components/dashboard/links-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/data/links";
import { formatShortUrl } from "@/lib/dashboard/types";

export const metadata: Metadata = {
  title: "Links — Snipp",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ page?: string }> | { page?: string };
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams);
  const page = Math.max(1, Number(params?.page) || 1);
  const { links, stats, totalCount, pageSize } = await getDashboardData(page);

  const topValue = stats.topLink
    ? formatShortUrl(stats.topLink.short_code)
    : "—";

  return (
    <div className="mx-auto w-full max-w-container-max flex-1 px-4 py-6 md:px-6 md:py-8">
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground md:text-4xl">
            Links
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track your shortened URLs.
          </p>
        </div>
        <Button
          type="button"
          className="shrink-0 rounded-lg self-start sm:self-auto"
          disabled
          title="Create modal comes in the next phase"
        >
          <Plus className="size-4" />
          New Link
        </Button>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Links"
          value={stats.totalLinks.toLocaleString()}
        />
        <StatCard
          label="Total Clicks (30d)"
          value={stats.totalClicks30d.toLocaleString()}
        />
        <StatCard
          label="Top Performing"
          value={topValue}
          valueClassName="text-primary"
        />
      </div>

      {totalCount === 0 ? (
        <EmptyState />
      ) : (
        <LinksTable
          links={links}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      )}
    </div>
  );
}
