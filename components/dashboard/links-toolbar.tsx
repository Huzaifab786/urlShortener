"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { LinksFilter } from "@/lib/data/links";
import { cn } from "@/lib/utils";

const FILTERS: { value: LinksFilter; label: string }[] = [
  { value: "all", label: "All Links" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export function LinksToolbar({
  currentFilter,
}: {
  currentFilter: LinksFilter;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(filter: LinksFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="mb-0 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors",
              currentFilter === value
                ? "border-border bg-secondary text-foreground"
                : "border-transparent text-muted-foreground hover:bg-secondary/70"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
