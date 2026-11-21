/** Demo referral token — not cryptographic. */
export function generateReferralToken(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function buildReferralUrl(token: string): string {
  if (typeof window === "undefined") {
    return `https://accolade.app/r/${token}`;
  }
  const base = window.location.origin;
  return `${base}/client-leads?ref=${token}`;
}

export function maskReferralUrl(url: string): string {
  if (url.length <= 24) return "••••••••••••••••";
  return `${url.slice(0, 12)}${"•".repeat(12)}${url.slice(-8)}`;
}