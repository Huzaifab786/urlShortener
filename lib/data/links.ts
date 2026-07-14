import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  LINKS_PAGE_SIZE,
  type DashboardLink,
  type DashboardStats,
} from "@/lib/dashboard/types";

export async function getDashboardData(page = 1): Promise<{
  links: DashboardLink[];
  stats: DashboardStats;
  totalCount: number;
  page: number;
  pageSize: number;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      links: [],
      stats: { totalLinks: 0, totalClicks30d: 0, topLink: null },
      totalCount: 0,
      page: 1,
      pageSize: LINKS_PAGE_SIZE,
    };
  }

  const { data: allLinks, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !allLinks) {
    return {
      links: [],
      stats: { totalLinks: 0, totalClicks30d: 0, topLink: null },
      totalCount: 0,
      page: 1,
      pageSize: LINKS_PAGE_SIZE,
    };
  }

  const linkIds = allLinks.map((l) => l.id);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysIso = thirtyDaysAgo.toISOString();

  const clickCounts = new Map<string, number>();
  const clickCounts30d = new Map<string, number>();

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
    }
  }

  const withCounts: DashboardLink[] = allLinks.map((link) => ({
    ...link,
    click_count: clickCounts.get(link.id) ?? 0,
    clicks_30d: clickCounts30d.get(link.id) ?? 0,
  }));

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

  const totalCount = withCounts.length;
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * LINKS_PAGE_SIZE;
  const pageLinks = withCounts.slice(start, start + LINKS_PAGE_SIZE);

  return {
    links: pageLinks,
    stats: {
      totalLinks: totalCount,
      totalClicks30d,
      topLink,
    },
    totalCount,
    page: safePage,
    pageSize: LINKS_PAGE_SIZE,
  };
}
