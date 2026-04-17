import type { User } from "@supabase/supabase-js";

export function pickAvatarUrl(user: User): string | null {
  const m = user.user_metadata as Record<string, unknown> | undefined;
  if (!m) return null;
  const a = m.avatar_url;
  const p = m.picture;
  if (typeof a === "string" && a.length > 0) return a;
  if (typeof p === "string" && p.length > 0) return p;
  return null;
}

export function pickInitials(user: User): string {
  const email = user.email ?? "?";
  const ch = email.charAt(0).toUpperCase();
  const ch2 = email.split("@")[0]?.charAt(1);
  return ch2 ? `${ch}${ch2.toUpperCase()}` : ch;
}

/** Basit e-posta kontrolü: @ ve alan adı için en az bir nokta (ör. a@b.co). */
export function isLikelyValidEmail(value: string): boolean {
  const s = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
