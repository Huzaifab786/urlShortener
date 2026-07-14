import "server-only";

import { createClient } from "@/lib/supabase/server";
import { formatShortUrl } from "@/lib/dashboard/types";

export type AnalyticsDayPoint = {
  day: string;
  label: string;
  clicks: number;
};

export type AnalyticsTopLink = {
  id: string;
  short_code: string;
  title: string | null;
  label: string;
  short_url: string;
  click_count: number;
};

export type AnalyticsData = {
  totalLinks: number;
  totalClicks: number;
  totalClicks30d: number;
  linksWithClicks: number;
  clicksOverTime: AnalyticsDayPoint[];
  topLinks: AnalyticsTopLink[];
};

function formatDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatChartLabel(dayKey: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function emptyThirtyDaySeries(): AnalyticsDayPoint[] {
  const series: AnalyticsDayPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const key = formatDayKey(day);
    series.push({ day: key, label: formatChartLabel(key), clicks: 0 });
  }
  return series;
}

function thirtyDayWindowStart(): Date {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 29);
  return start;
}

function linkDisplayLabel(
  title: string | null,
  shortCode: string,
  originalUrl: string
): string {
  const trimmed = title?.trim();
  if (trimmed) return trimmed;
  try {
    return new URL(originalUrl).hostname.replace(/^www\./, "");
  } catch {
    return shortCode;
  }
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const empty: AnalyticsData = {
    totalLinks: 0,
    totalClicks: 0,
    totalClicks30d: 0,
    linksWithClicks: 0,
    clicksOverTime: emptyThirtyDaySeries(),
    topLinks: [],
  };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return empty;
  }

  const { data: links, error } = await supabase
    .from("links")
    .select("id, short_code, title, original_url")
    .eq("user_id", user.id);

  if (error || !links || links.length === 0) {
    return empty;
  }

  const linkIds = links.map((l) => l.id);
  const linkMeta = new Map(links.map((l) => [l.id, l]));

  const { data: clicks } = await supabase
    .from("clicks")
    .select("link_id, clicked_at")
    .in("link_id", linkIds);

  const clickCounts = new Map<string, number>();
  const byDay = new Map<string, number>();
  const seriesStart = thirtyDayWindowStart();
  let totalClicks30d = 0;

  for (const click of clicks ?? []) {
    clickCounts.set(
      click.link_id,
      (clickCounts.get(click.link_id) ?? 0) + 1
    );

    const clickedAt = new Date(click.clicked_at);
    if (clickedAt >= seriesStart) {
      totalClicks30d += 1;
      const key = formatDayKey(clickedAt);
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }
  }

  const clicksOverTime = emptyThirtyDaySeries().map((point) => ({
    ...point,
    clicks: byDay.get(point.day) ?? 0,
  }));

  const topLinks: AnalyticsTopLink[] = Array.from(clickCounts.entries())
    .map(([id, click_count]) => {
      const meta = linkMeta.get(id);
      if (!meta) return null;
      return {
        id,
        short_code: meta.short_code,
        title: meta.title,
        label: linkDisplayLabel(meta.title, meta.short_code, meta.original_url),
        short_url: formatShortUrl(meta.short_code),
        click_count,
      };
    })
    .filter((row): row is AnalyticsTopLink => row !== null)
    .sort((a, b) => b.click_count - a.click_count)
    .slice(0, 5);

  const totalClicks = Array.from(clickCounts.values()).reduce(
    (sum, n) => sum + n,
    0
  );
  const linksWithClicks = clickCounts.size;

  return {
    totalLinks: links.length,
    totalClicks,
    totalClicks30d,
    linksWithClicks,
    clicksOverTime,
    topLinks,
  };
}
