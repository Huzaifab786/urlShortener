import type { Metadata } from "next";
import Link from "next/link";
import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  title: "Link not found — Snipp",
};

export default function LinkNotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card/90 px-6 py-4 backdrop-blur-md">
        <Logo />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-secondary">
          <Link2 className="size-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-[28px] font-semibold tracking-tight text-foreground md:text-4xl">
          This link doesn&apos;t exist or has expired
        </h1>
        <p className="mb-8 max-w-md text-base text-muted-foreground">
          The short URL you followed isn&apos;t in Snipp. It may have been typed
          incorrectly or removed by its owner.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-lg">
            <Link href="/">Shorten a link</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
