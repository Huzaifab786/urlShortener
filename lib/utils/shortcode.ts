import { customAlphabet } from "nanoid";

import { createAdminClient } from "@/lib/supabase/admin";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const generate = customAlphabet(alphabet, 7);

export async function generateUniqueShortCode(): Promise<string> {
  const admin = createAdminClient();

  for (let attempt = 0; attempt < 2; attempt++) {
    const code = generate();
    const { data } = await admin
      .from("links")
      .select("id")
      .eq("short_code", code)
      .maybeSingle();

    if (!data) {
      return code;
    }
  }

  // Extremely unlikely — one more try with a fresh code
  return generate();
}

export async function isShortCodeTaken(
  shortCode: string,
  excludeLinkId?: string
): Promise<boolean> {
  const admin = createAdminClient();
  let query = admin
    .from("links")
    .select("id")
    .eq("short_code", shortCode);

  if (excludeLinkId) {
    query = query.neq("id", excludeLinkId);
  }

  const { data } = await query.maybeSingle();
  return Boolean(data);
}
