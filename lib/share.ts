const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

export function generateShareId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function shareUrl(shareId: string, origin?: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : origin ?? "";
  return `${base}/view/${shareId}`;
}
