const PENDING_CLAIM_KEY = "snipp_pending_claim";

export function savePendingClaim(shortCode: string) {
  try {
    window.localStorage.setItem(PENDING_CLAIM_KEY, shortCode);
  } catch {
    // localStorage may be unavailable (private mode, etc.)
  }
}

export function readPendingClaim(): string | null {
  try {
    return window.localStorage.getItem(PENDING_CLAIM_KEY);
  } catch {
    return null;
  }
}

export function clearPendingClaim() {
  try {
    window.localStorage.removeItem(PENDING_CLAIM_KEY);
  } catch {
    // ignore
  }
}
