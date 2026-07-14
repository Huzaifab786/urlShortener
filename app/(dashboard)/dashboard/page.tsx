import type { Metadata } from "next";
import { Suspense } from "react";

import { CreateLinkButton } from "@/components/dashboard/create-link-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LinksHeaderSearch } from "@/components/dashboard/links-header-search";
import { LinksTable } from "@/components/dashboard/links-table";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  getDashboardData,
  type LinksFilter,
} from "@/lib/data/links";
import { formatShortUrl } from "@/lib/dashboard/types";

export const metadata: Metadata = {
  title: "Links — Snipp",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?:
    | Promise<{ page?: string; q?: string; filter?: string }>
    | { page?: string; q?: string; filter?: string };
};

function parseFilter(raw: string | undefined): LinksFilter {
  if (raw === "active" || raw === "archived") return raw;
  return "all";
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams);
  const page = Math.max(1, Number(params?.page) || 1);
  const q = params?.q ?? "";
  const filter = parseFilter(params?.filter);

  const { links, stats, totalCount, ownedCount, pageSize } =
    await getDashboardData({ page, q, filter });

  const topValue = stats.topLink
    ? formatShortUrl(stats.topLink.short_code)
    : "—";

  const query = new URLSearchParams();
  if (q.trim()) query.set("q", q.trim());
  if (filter !== "all") query.set("filter", filter);
  const queryString = query.toString();

  const showEmptyState = ownedCount === 0;

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
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          {!showEmptyState && (
            <Suspense fallback={null}>
              <LinksHeaderSearch initialQuery={q} />
            </Suspense>
          )}
          <CreateLinkButton className="shrink-0 self-start sm:self-auto" />
        </div>
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

      {showEmptyState ? (
        <EmptyState />
      ) : (
        <Suspense
          fallback={
            <div className="h-64 animate-pulse rounded-xl bg-secondary" />
          }
        >
          <LinksTable
            links={links}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            filter={filter}
            q={q}
            queryString={queryString}
          />
        </Suspense>
      )}
    </div>
  );
}
