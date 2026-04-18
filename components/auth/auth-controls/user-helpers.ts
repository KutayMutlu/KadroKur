import type { User } from "@supabase/supabase-js";
import { extractProfileNamesFromUserMetadata, joinFirstLast } from "@/lib/profile-names";

/** `user_profiles` satırı — AuthControls isteğe bağlı yükler */
export type ProfileNameFields = {
  first_name?: string | null;
  last_name?: string | null;
};

export { joinFirstLast, extractProfileNamesFromUserMetadata };

export function pickAvatarUrl(user: User): string | null {
  const m = user.user_metadata as Record<string, unknown> | undefined;
  if (!m) return null;
  const a = m.avatar_url;
  const p = m.picture;
  if (typeof a === "string" && a.length > 0) return a;
  if (typeof p === "string" && p.length > 0) return p;
  return null;
}

/**
 * Görünen ad: önce `user_profiles` (tek doğruluk kaynağı), boşsa metadata;
 * en son e-posta yereli.
 */
export function pickDisplayName(user: User, profile?: ProfileNameFields | null): string {
  const fromDb = joinFirstLast(profile?.first_name, profile?.last_name);
  if (fromDb) return fromDb;

  const meta = extractProfileNamesFromUserMetadata(user);
  const fromMeta = joinFirstLast(meta.first_name, meta.last_name);
  if (fromMeta) return fromMeta;

  const email = user.email;
  if (email) {
    const local = email.split("@")[0]?.trim();
    if (local) return local;
  }
  return "Kullanıcı";
}

export function pickInitials(user: User, profile?: ProfileNameFields | null): string {
  const display = pickDisplayName(user, profile);
  const words = display.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const a = words[0].charAt(0);
    const b = words[words.length - 1].charAt(0);
    return `${a}${b}`.toUpperCase();
  }
  if (display.length >= 2) {
    return display.slice(0, 2).toUpperCase();
  }
  return display.charAt(0).toUpperCase() || "?";
}

/** Kopyala-yapıştır / IME kaynaklı görünmez karakterleri temizler (Supabase “invalid format” önlemi). */
export function normalizeEmailInput(value: string): string {
  return value
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .normalize("NFKC");
}

/** Basit e-posta kontrolü: @ ve alan adı için en az bir nokta (ör. a@b.co). */
export function isLikelyValidEmail(value: string): boolean {
  const s = normalizeEmailInput(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
