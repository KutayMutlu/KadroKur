import type { User } from "@supabase/supabase-js";

/** `user_profiles` satırı — AuthControls isteğe bağlı yükler */
export type ProfileNameFields = {
  first_name?: string | null;
  last_name?: string | null;
};

function joinFirstLast(first?: string | null, last?: string | null): string {
  const fn = (first ?? "").trim();
  const ln = (last ?? "").trim();
  if (!fn && !ln) return "";
  return [fn, ln].filter(Boolean).join(" ");
}

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
 * Görünen ad: önce `user_profiles`, sonra kayıtta yazılan metadata `first_name`/`last_name`,
 * sonra OAuth alanları; en son e-posta yereli.
 */
export function pickDisplayName(user: User, profile?: ProfileNameFields | null): string {
  const fromDb = joinFirstLast(profile?.first_name, profile?.last_name);
  if (fromDb) return fromDb;

  const m = user.user_metadata as Record<string, unknown> | undefined;
  if (m) {
    const fromSignup = joinFirstLast(
      typeof m.first_name === "string" ? m.first_name : null,
      typeof m.last_name === "string" ? m.last_name : null
    );
    if (fromSignup) return fromSignup;

    const full = m.full_name;
    if (typeof full === "string" && full.trim()) return full.trim();
    const given = m.given_name;
    const family = m.family_name;
    if (typeof given === "string" && given.trim()) {
      if (typeof family === "string" && family.trim()) {
        return `${given.trim()} ${family.trim()}`;
      }
      return given.trim();
    }
    const name = m.name;
    if (typeof name === "string" && name.trim()) return name.trim();
    const userName = m.user_name;
    if (typeof userName === "string" && userName.trim()) return userName.trim();
  }
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

/** Basit e-posta kontrolü: @ ve alan adı için en az bir nokta (ör. a@b.co). */
export function isLikelyValidEmail(value: string): boolean {
  const s = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
