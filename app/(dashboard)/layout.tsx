import { ClaimPendingOnMount } from "@/components/auth/claim-pending-on-mount";
import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? undefined;
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    email?.split("@")[0] ||
    "Account";

  return (
    <div className="flex min-h-screen bg-background">
      <ClaimPendingOnMount />
      <Sidebar email={email} displayName={displayName} />
      <main className="flex min-h-screen flex-1 flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
