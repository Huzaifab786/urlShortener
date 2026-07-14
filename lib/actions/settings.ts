"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  changePasswordSchema,
  deleteAccountSchema,
} from "@/lib/validations/settings";

export type AccountProvider = {
  id: string;
  label: string;
  connected: boolean;
};

export async function getAccountSettings(): Promise<{
  email: string | null;
  hasPasswordLogin: boolean;
  providers: AccountProvider[];
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { email: null, hasPasswordLogin: false, providers: [] };
  }

  const identityProviders = new Set(
    (user.identities ?? []).map((identity) => identity.provider)
  );

  const hasPasswordLogin = identityProviders.has("email");

  const providers: AccountProvider[] = [
    {
      id: "email",
      label: "Email & password",
      connected: hasPasswordLogin,
    },
    {
      id: "google",
      label: "Google",
      connected: identityProviders.has("google"),
    },
    {
      id: "github",
      label: "GitHub",
      connected: identityProviders.has("github"),
    },
  ];

  return {
    email: user.email ?? null,
    hasPasswordLogin,
    providers,
  };
}

export async function changePassword(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { success: false, error: "You must be signed in" };
  }

  const hasPasswordLogin = (user.identities ?? []).some(
    (identity) => identity.provider === "email"
  );

  if (hasPasswordLogin) {
    const current = parsed.data.currentPassword?.trim() ?? "";
    if (!current) {
      return { success: false, error: "Current password is required" };
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });

    if (reauthError) {
      return { success: false, error: "Current password is incorrect" };
    }
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function deleteAccount(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const parsed = deleteAccountSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid confirmation",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in" };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return {
      success: false,
      error: "Unable to delete account. Please try again.",
    };
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
