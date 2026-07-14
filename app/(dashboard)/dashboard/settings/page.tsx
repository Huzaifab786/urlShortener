import type { Metadata } from "next";

import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { ConnectedProviders } from "@/components/dashboard/connected-providers";
import { DeleteAccountSection } from "@/components/dashboard/delete-account-section";
import { getAccountSettings } from "@/lib/actions/settings";

export const metadata: Metadata = {
  title: "Settings — Snipp",
};

export const dynamic = "force-dynamic";

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
      <div className="mb-4 max-w-2xl">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default async function SettingsPage() {
  const account = await getAccountSettings();

  return (
    <div className="mx-auto w-full max-w-container-max flex-1 px-4 py-6 md:px-6 md:py-8">
      <header className="mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground md:text-4xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, sign-in methods, and data.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <SettingsSection
          title="Account"
          description="The email address on your Snipp account."
        >
          <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
            <div className="text-[13px] font-medium text-muted-foreground">
              Email
            </div>
            <div className="mt-0.5 font-mono text-sm text-foreground">
              {account.email ?? "—"}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Sign-in methods"
          description="Providers currently connected to your account."
        >
          <ConnectedProviders providers={account.providers} />
        </SettingsSection>

        <SettingsSection
          title={account.hasPasswordLogin ? "Password" : "Set a password"}
          description={
            account.hasPasswordLogin
              ? "Choose a new password for email sign-in."
              : "Optional. Add a password if you also want to sign in with email."
          }
        >
          <ChangePasswordForm hasPasswordLogin={account.hasPasswordLogin} />
        </SettingsSection>

        <SettingsSection
          title="Danger zone"
          description="Irreversible actions for this account."
        >
          <DeleteAccountSection />
        </SettingsSection>
      </div>
    </div>
  );
}
