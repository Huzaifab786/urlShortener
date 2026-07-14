"use client";

import { Link2 } from "lucide-react";

import { CreateLinkButton } from "@/components/dashboard/create-link-button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-secondary">
        <Link2 className="size-10 text-primary" strokeWidth={1.5} />
        <span className="sr-only">Empty links illustration</span>
      </div>
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
        No links yet
      </h2>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Create your first shortened link to start tracking clicks and managing
        URLs in one place.
      </p>
      <CreateLinkButton label="Create your first shortened link" />
    </div>
  );
}
