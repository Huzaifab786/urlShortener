import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function LinksPagination({
  page,
  pageSize,
  totalCount,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalCount <= pageSize) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 sm:flex-row">
      <span className="text-sm text-muted-foreground">
        Showing {start} to {end} of {totalCount.toLocaleString()} entries
      </span>
      <div className="flex gap-1">
        <PaginationLink
          href={page > 1 ? `/dashboard?page=${page - 1}` : undefined}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </PaginationLink>
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 py-1 text-muted-foreground"
            >
              …
            </span>
          ) : (
            <PaginationLink
              key={p}
              href={`/dashboard?page=${p}`}
              active={p === page}
            >
              {p}
            </PaginationLink>
          )
        )}
        <PaginationLink
          href={page < totalPages ? `/dashboard?page=${page + 1}` : undefined}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </PaginationLink>
      </div>
    </div>
  );
}

function PaginationLink({
  href,
  children,
  disabled,
  active,
  "aria-label": ariaLabel,
}: {
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  "aria-label"?: string;
}) {
  const className = cn(
    "flex min-w-8 items-center justify-center rounded border px-2 py-1 text-[13px] font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border text-foreground hover:bg-secondary",
    disabled && "pointer-events-none opacity-50"
  );

  if (!href || disabled) {
    return (
      <span className={className} aria-label={ariaLabel} aria-disabled>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, "…", total];
  }
  if (current >= total - 2) {
    return [1, "…", total - 2, total - 1, total];
  }
  return [1, "…", current, "…", total];
}
