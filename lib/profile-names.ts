import type { User } from "@supabase/supabase-js";

import { normalizePersonNameForStorage } from "@/lib/turkish-person-name";

/** İki alanı tek görünen ada birleştirir (boşları atar). */
export function joinFirstLast(first?: string | null, last?: string | null): string {
  const fn = (first ?? "").trim();
  const ln = (last ?? "").trim();
  if (!fn && !ln) return "";
  return [fn, ln].filter(Boolean).join(" ");
}

/**
 * Auth `user_metadata` içinden ad/soyad çıkarımı (kayıt, Google, diğer OAuth).
 * `user_profiles` ile aynı öncelik mantığı `handle_new_user` tetikleyicisinde de kullanılmalıdır.
 */
export function extractProfileNamesFromUserMetadata(user: User): {
  first_name: string;
  last_name: string;
} {
  const m = user.user_metadata as Record<string, unknown> | undefined;
  if (!m) return { first_name: "", last_name: "" };

  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  let fn = s(m.first_name);
  let ln = s(m.last_name);
  if (fn || ln) {
    return {
      first_name: normalizePersonNameForStorage(fn),
      last_name: normalizePersonNameForStorage(ln),
    };
  }

  fn = s(m.given_name);
  ln = s(m.family_name);
  if (fn || ln) {
    return {
      first_name: normalizePersonNameForStorage(fn),
      last_name: normalizePersonNameForStorage(ln),
    };
  }

  for (const key of ["full_name", "name", "user_name"] as const) {
    const full = s(m[key]);
    if (!full) continue;
    const parts = full.split(/\s+/).filter(Boolean);
    if (parts.length === 0) continue;
    if (parts.length === 1) {
      return { first_name: normalizePersonNameForStorage(parts[0]), last_name: "" };
    }
    return {
      first_name: normalizePersonNameForStorage(parts[0]),
      last_name: normalizePersonNameForStorage(parts.slice(1).join(" ")),
    };
  }

  return { first_name: "", last_name: "" };
}
