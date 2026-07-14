import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics — Snipp",
};

export default function AnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-[28px] font-semibold tracking-tight md:text-4xl">
        Analytics
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Charts and trends come in Phase 2. Your click totals already show on
        the Links dashboard.
      </p>
    </div>
  );
}
