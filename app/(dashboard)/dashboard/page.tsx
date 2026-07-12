import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Snipp",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome to your dashboard
      </h1>
      <p className="text-muted-foreground">
        You&apos;re signed in. Link management UI comes in the next phase.
      </p>
    </div>
  );
}
