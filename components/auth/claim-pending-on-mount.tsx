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

    void claimPendingLink(pending).finally(() => {
      clearPendingClaim();
    });
  }, []);

  return null;
}
