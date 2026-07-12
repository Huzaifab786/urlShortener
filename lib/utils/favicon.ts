export function getFaviconUrl(domain: string, size = 64): string {
  return `https://www.google.com/s2/favicons?sz=${size}&domain=${encodeURIComponent(domain)}`;
}

export function tryExtractDomain(raw: string): string | null {
  try {
    let value = raw.trim();
    if (!value) return null;
    if (!/^https?:\/\//i.test(value)) {
      value = `https://${value}`;
    }
    return new URL(value).hostname;
  } catch {
    return null;
  }
}
