"use server";

import { cookies, headers } from "next/headers";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  ANON_DAILY_LIMIT,
  incrementAnonRateLimit,
} from "@/lib/utils/rate-limit";
import {
  generateUniqueShortCode,
  isShortCodeTaken,
} from "@/lib/utils/shortcode";
import { createLinkSchema } from "@/lib/validations/links";

export type CreateLinkResult =
  | {
      success: true;
      shortCode: string;
      originalUrl: string;
      shortUrl: string;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Partial<Record<"url" | "customAlias" | "title", string>>;
    };

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

function getClientIp(): string {
  const headerStore = headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return headerStore.get("x-real-ip") ?? "unknown";
}

export async function createLink(
  rawInput: unknown
): Promise<CreateLinkResult> {
  const parsed = createLinkSchema.safeParse(rawInput);

  if (!parsed.success) {
    const fieldErrors: Partial<
      Record<"url" | "customAlias" | "title", string>
    > = {};

    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "url" || key === "customAlias" || key === "title") {
        fieldErrors[key] = issue.message;
      }
    }

    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
      fieldErrors,
    };
  }

  const { url, customAlias, title } = parsed.data;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAnonymous = !user;

  if (isAnonymous) {
    try {
      const count = await incrementAnonRateLimit(getClientIp());
      if (count > ANON_DAILY_LIMIT) {
        return {
          success: false,
          error: "Sign in to create more links today",
        };
      }
    } catch {
      return {
        success: false,
        error: "Unable to create link right now. Please try again.",
      };
    }
  }

  const alias = customAlias?.trim() || "";
  let shortCode: string;
  let isCustomAlias = false;

  if (alias) {
    if (!user) {
      return {
        success: false,
        error: "Sign in to use a custom short link",
        fieldErrors: { customAlias: "Sign in to use a custom short link" },
      };
    }

    if (await isShortCodeTaken(alias)) {
      return {
        success: false,
        error: "That short link is already taken",
        fieldErrors: { customAlias: "That short link is already taken" },
      };
    }

    shortCode = alias;
    isCustomAlias = true;
  } else {
    shortCode = await generateUniqueShortCode();
  }

  const { error } = await supabase.from("links").insert({
    original_url: url,
    short_code: shortCode,
    user_id: user?.id ?? null,
    is_custom_alias: isCustomAlias,
    title: title?.trim() || null,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "That short link is already taken",
        fieldErrors: { customAlias: "That short link is already taken" },
      };
    }

    return {
      success: false,
      error: "Unable to create link right now. Please try again.",
    };
  }

  if (isAnonymous) {
    const siteUrl = getSiteUrl();
    cookies().set("snipp_pending_claim", shortCode, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: siteUrl.startsWith("https://"),
    });
  }

  const siteUrl = getSiteUrl();

  return {
    success: true,
    shortCode,
    originalUrl: url,
    shortUrl: `${siteUrl}/${shortCode}`,
  };
}

function clearClaimCookie() {
  const siteUrl = getSiteUrl();
  cookies().set("snipp_pending_claim", "", {
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: siteUrl.startsWith("https://"),
  });
}

/**
 * Claim a specific unclaimed link for the signed-in user.
 * Uses the service-role client for the update after auth checks — Postgres RLS
 * UPDATE can match 0 rows with no error when policies conflict on null → uid.
 */
export async function claimLink(shortCode: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to claim a link" };
  }

  const code = shortCode.trim();
  if (!code) {
    return { success: false, error: "Missing short code" };
  }

  const admin = createAdminClient();
  const { data: link } = await admin
    .from("links")
    .select("id, user_id")
    .eq("short_code", code)
    .maybeSingle();

  if (!link) {
    return { success: false, error: "Link not found" };
  }

  // Already owned by this user — treat as success (idempotent).
  if (link.user_id === user.id) {
    clearClaimCookie();
    return { success: true };
  }

  if (link.user_id !== null) {
    return { success: false, error: "This link already belongs to someone" };
  }

  const { data: updated, error } = await admin
    .from("links")
    .update({ user_id: user.id })
    .eq("short_code", code)
    .is("user_id", null)
    .select("id")
    .maybeSingle();

  if (error || !updated) {
    return { success: false, error: "Unable to claim this link" };
  }

  clearClaimCookie();
  return { success: true };
}

/**
 * Claims using an explicit short code and/or the snipp_pending_claim cookie.
 * Prefer the explicit code (from localStorage) when the httpOnly cookie is missing.
 */
export async function claimPendingLink(explicitCode?: string | null): Promise<{
  success: boolean;
  error?: string;
}> {
  const fromCookie = cookies().get("snipp_pending_claim")?.value;
  const shortCode = explicitCode?.trim() || fromCookie;

  if (!shortCode) {
    return { success: true };
  }

  return claimLink(shortCode);
}
