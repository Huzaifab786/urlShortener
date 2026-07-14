import type { Database, LinkTag } from "@/types/database";

export type DashboardLink = Database["public"]["Tables"]["links"]["Row"] & {
  click_count: number;
  clicks_30d: number;
};

export type DashboardStats = {
  totalLinks: number;
  totalClicks30d: number;
  topLink: {
    short_code: string;
    title: string | null;
    click_count: number;
  } | null;
};

export const LINKS_PAGE_SIZE = 10;

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function formatShortUrl(shortCode: string) {
  const site = getSiteUrl().replace(/^https?:\/\//, "");
  return `${site}/${shortCode}`;
}

export function absoluteShortUrl(shortCode: string) {
  return `${getSiteUrl()}/${shortCode}`;
}

export function tagLabel(tag: LinkTag | null): string | null {
  if (!tag) return null;
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}
