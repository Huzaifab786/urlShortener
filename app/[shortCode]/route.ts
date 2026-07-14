import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ shortCode: string }> | { shortCode: string };
};

export async function GET(request: Request, context: RouteContext) {
  const { shortCode: rawCode } = await Promise.resolve(context.params);
  const shortCode = rawCode?.trim();

  if (!shortCode) {
    return NextResponse.rewrite(new URL("/link-not-found", request.url));
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.rewrite(new URL("/link-not-found", request.url));
  }

  const { data: link } = await admin
    .from("links")
    .select("id, original_url")
    .eq("short_code", shortCode)
    .maybeSingle();

  if (!link?.original_url) {
    return NextResponse.rewrite(new URL("/link-not-found", request.url));
  }

  // Log click then redirect — no geo or other non-essential work
  await admin.from("clicks").insert({
    link_id: link.id,
    referrer: request.headers.get("referer"),
    user_agent: request.headers.get("user-agent"),
  });

  return NextResponse.redirect(link.original_url, 307);
}
