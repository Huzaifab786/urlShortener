"use client";

import { useEffect, useRef } from "react";

import { claimPendingLink } from "@/lib/actions/links";
import {
  clearPendingClaim,
  readPendingClaim,
} from "@/lib/utils/pending-claim";

/** Claims a pending anonymous link after OAuth/email auth lands on the dashboard. */
export function ClaimPendingOnMount() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const pending = readPendingClaim();
    if (!pending) return;

    void (async () => {
      try {
        const result = await claimPendingLink(pending);
        if (result.success) {
          clearPendingClaim();
        } else if (typeof window !== "undefined") {
          console.error("[snipp] claim failed:", result.error, pending);
        }
      } catch (err) {
        console.error("[snipp] claim threw:", err);
      }
    })();
  }, []);

  return null;
}
