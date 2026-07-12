"use client";

import Link from "next/link";
import { BarChart3, Link2, Plus } from "lucide-react";

import { CopyButton } from "@/components/shared/copy-button";
import { QrCodeImage } from "@/components/shared/qr-code";
import { Button } from "@/components/ui/button";

export type ShortenResult = {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
};

function truncateUrl(url: string, max = 64) {
  if (url.length <= max) return url;
  return `${url.slice(0, max - 1)}…`;
}

export function ResultCard({
  result,
  onReset,
}: {
  result: ShortenResult;
  onReset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[13px] font-medium text-primary">
          <span className="inline-block size-2 rounded-full bg-primary" />
          Link shortened successfully
        </div>
        <h2 className="text-[28px] font-semibold tracking-tight text-foreground md:text-4xl">
          Your link is ready to share.
        </h2>
        <p className="mx-auto max-w-lg text-base text-muted-foreground">
          Copy your new Snipp URL below. Sign in to track clicks and manage your
          links.
        </p>
      </div>

      {/* Receipt motif: dashed border + perforation dots */}
      <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-card p-6 shadow-md md:p-8">
        <div className="absolute left-0 right-0 top-0 z-20 flex -mt-2 justify-around">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="size-4 rounded-full border border-border bg-background"
            />
          ))}
        </div>

        <div className="relative z-10 mt-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex w-full flex-col items-center gap-6 md:flex-row">
            <div className="shrink-0 rounded-lg border border-border bg-white p-2">
              <QrCodeImage value={result.shortUrl} size={80} />
            </div>

            <div className="flex w-full flex-grow flex-col gap-2 overflow-hidden">
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Shortened URL
              </label>
              <div className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border bg-white p-3">
                <Link2 className="size-5 shrink-0 text-primary" />
                <span className="flex-grow select-all truncate font-mono text-sm text-foreground">
                  {result.shortUrl.replace(/^https?:\/\//, "")}
                </span>
              </div>
            </div>

            <div className="w-full self-end md:w-auto md:self-center">
              <CopyButton
                value={result.shortUrl}
                className="h-11 w-full rounded-lg md:w-auto"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-dashed border-border pt-4">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Original URL
          </label>
          <p
            className="w-full truncate text-sm text-muted-foreground"
            title={result.originalUrl}
          >
            {truncateUrl(result.originalUrl)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-secondary p-6 text-center">
        <BarChart3 className="size-8 text-primary" />
        <div>
          <h3 className="mb-1 text-xl font-semibold text-foreground">
            Want to track this link?
          </h3>
          <p className="text-sm text-muted-foreground">
            Sign in to save this link to your dashboard and view detailed click
            analytics.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-2 rounded-lg bg-card">
          <Link href="/sign-in">Sign in to Save</Link>
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:text-primary/80"
        >
          <Plus className="size-4" />
          Shorten another link
        </button>
      </div>
    </div>
  );
}
