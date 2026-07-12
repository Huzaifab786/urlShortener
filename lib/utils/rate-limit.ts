import { createAdminClient } from "@/lib/supabase/admin";

/** Suggested daily cap for anonymous (unauthenticated) shortens. */
export const ANON_DAILY_LIMIT = 5;

/**
 * Upserts the rate-limit counter for an IP and returns the new count.
 * Uses the service-role client — rate_limits has RLS with no client policies.
 */
export async function incrementAnonRateLimit(
  ipAddress: string
): Promise<number> {
  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: existing } = await admin
    .from("rate_limits")
    .select("request_count")
    .eq("ip_address", ipAddress)
    .eq("request_date", today)
    .maybeSingle();

  if (!existing) {
    const { data, error } = await admin
      .from("rate_limits")
      .insert({
        ip_address: ipAddress,
        request_date: today,
        request_count: 1,
      })
      .select("request_count")
      .single();

    if (error) {
      throw new Error("Failed to check rate limit");
    }

    return data.request_count;
  }

  const nextCount = existing.request_count + 1;
  const { data, error } = await admin
    .from("rate_limits")
    .update({ request_count: nextCount })
    .eq("ip_address", ipAddress)
    .eq("request_date", today)
    .select("request_count")
    .single();

  if (error) {
    throw new Error("Failed to check rate limit");
  }

  return data.request_count;
}
