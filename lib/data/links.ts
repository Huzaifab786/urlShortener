import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  LINKS_PAGE_SIZE,
  type DashboardLink,
  type DashboardStats,
  type SparkPoint,
} from "@/lib/dashboard/types";

export type LinksFilter = "all" | "active" | "archived";

export type DashboardQuery = {
  page?: number;
  q?: string;
  filter?: LinksFilter;
};

function formatDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function emptySevenDaySeries(): SparkPoint[] {
  const series: SparkPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    series.push({ day: formatDayKey(day), clicks: 0 });
  }
  return series;
}

function sevenDayWindowStart(): Date {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  return start;
}

export async function getDashboardData({
  page = 1,
  q = "",
  filter = "all",
}: DashboardQuery = {}): Promise<{
  links: DashboardLink[];
  stats: DashboardStats;
  totalCount: number;
  ownedCount: number;
  page: number;
  pageSize: number;
  filter: LinksFilter;
  q: string;
}> {
  const empty = {
    links: [] as DashboardLink[],
    stats: { totalLinks: 0, totalClicks30d: 0, topLink: null },
    totalCount: 0,
    ownedCount: 0,
    page: 1,
    pageSize: LINKS_PAGE_SIZE,
    filter,
    q,
  };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return empty;
  }

  const { data: allLinks, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !allLinks) {
    return empty;
  }

  const linkIds = allLinks.map((l) => l.id);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysIso = thirtyDaysAgo.toISOString();
  const sparkStart = sevenDayWindowStart();

  const clickCounts = new Map<string, number>();
  const clickCounts30d = new Map<string, number>();
  const sparkMaps = new Map<string, Map<string, number>>();

  if (linkIds.length > 0) {
    const { data: clicks } = await supabase
      .from("clicks")
      .select("link_id, clicked_at")
      .in("link_id", linkIds);

    for (const click of clicks ?? []) {
      clickCounts.set(
        click.link_id,
        (clickCounts.get(click.link_id) ?? 0) + 1
      );
      if (click.clicked_at >= thirtyDaysIso) {
        clickCounts30d.set(
          click.link_id,
          (clickCounts30d.get(click.link_id) ?? 0) + 1
        );
      }

      const clickedAt = new Date(click.clicked_at);
      if (clickedAt >= sparkStart) {
        const dayKey = formatDayKey(clickedAt);
        let byDay = sparkMaps.get(click.link_id);
        if (!byDay) {
          byDay = new Map();
          sparkMaps.set(click.link_id, byDay);
        }
        byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + 1);
      }
    }
  }

  const withCounts: DashboardLink[] = allLinks.map((link) => {
    const template = emptySevenDaySeries();
    const byDay = sparkMaps.get(link.id);
    const clicks_7d = byDay
      ? template.map((point) => ({
          day: point.day,
          clicks: byDay.get(point.day) ?? 0,
        }))
      : template;

    return {
      ...link,
      click_count: clickCounts.get(link.id) ?? 0,
      clicks_30d: clickCounts30d.get(link.id) ?? 0,
      clicks_7d,
    };
  });

  const totalClicks30d = withCounts.reduce((sum, l) => sum + l.clicks_30d, 0);

  let topLink: DashboardStats["topLink"] = null;
  if (withCounts.length > 0) {
    const best = [...withCounts].sort(
      (a, b) => b.click_count - a.click_count
    )[0];
    if (best && best.click_count > 0) {
      topLink = {
        short_code: best.short_code,
        title: best.title,
        click_count: best.click_count,
      };
    }
  }

  const search = q.trim().toLowerCase();
  let filtered = withCounts;

  if (filter === "active") {
    filtered = filtered.filter((l) => !l.is_archived);
  } else if (filter === "archived") {
    filtered = filtered.filter((l) => l.is_archived);
  }

  if (search) {
    filtered = filtered.filter((l) => {
      const title = (l.title ?? "").toLowerCase();
      const code = l.short_code.toLowerCase();
      const original = l.original_url.toLowerCase();
      return (
        title.includes(search) ||
        code.includes(search) ||
        original.includes(search)
      );
    });
  }

  const totalCount = filtered.length;
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * LINKS_PAGE_SIZE;
  const pageLinks = filtered.slice(start, start + LINKS_PAGE_SIZE);

  return {
    links: pageLinks,
    stats: {
      totalLinks: withCounts.length,
      totalClicks30d,
      topLink,
    },
    totalCount,
    ownedCount: withCounts.length,
    page: safePage,
    pageSize: LINKS_PAGE_SIZE,
    filter,
    q,
  };
}
