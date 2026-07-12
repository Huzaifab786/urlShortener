"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { claimPendingLink } from "@/lib/actions/links";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/** After client-side auth succeeds, claim any pending anonymous link then go to dashboard. */
export async function completeAuthRedirect() {
  await claimPendingLink();
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
