import { ClaimPendingOnMount } from "@/components/auth/claim-pending-on-mount";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ClaimPendingOnMount />
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6">
        <Logo href="/dashboard" />
        <div className="flex items-center gap-3">
          <span className="hidden max-w-[200px] truncate text-sm text-muted-foreground sm:inline">
            {user?.email}
          </span>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm" className="rounded-lg">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
