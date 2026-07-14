import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Snipp",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-[28px] font-semibold tracking-tight md:text-4xl">
        Settings
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Account settings come in Phase 2. Use Sign out in the sidebar for now.
      </p>
    </div>
  );
}
