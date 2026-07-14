"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";

export function LinksHeaderSearch({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const trimmed = query.trim();
      const current = (searchParams.get("q") ?? "").trim();
      if (trimmed === current) return;

      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      params.delete("page");

      startTransition(() => {
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    }, 300);

    return () => window.clearTimeout(handle);
  }, [query, pathname, router, searchParams]);

  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search links..."
        className="h-9 rounded-lg pl-9"
        aria-label="Search links by name or short code"
      />
    </div>
  );
}
