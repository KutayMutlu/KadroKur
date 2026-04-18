import type { SupabaseClient } from "@supabase/supabase-js";
import { extractProfileNamesFromUserMetadata } from "@/lib/profile-names";

/**
 * Tek doğruluk kaynağı `public.user_profiles`. Kişisel bilgi kaydından sonra
 * JWT içindeki `user_metadata` aynı ad/soyad ile güncellenir (UI ve edge tutarlılığı).
 */
export async function syncAuthMetadataNamesToProfile(
  supabase: SupabaseClient,
  firstName: string,
  lastName: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    },
  });
  return { error: error ?? null };
}

/**
 * Profilde ad/soyad yoksa (eski hesap, tetikleyici uygulanmamış DB, vb.)
 * oturum metadata’sından `user_profiles` satırı oluşturur veya doldurur — idempotent.
 */
export async function ensureUserProfileFromAuthUser(supabase: SupabaseClient): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: row } = await supabase
    .from("user_profiles")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const hasDb =
    Boolean((row?.first_name ?? "").trim()) || Boolean((row?.last_name ?? "").trim());
  if (hasDb) return;

  const { first_name, last_name } = extractProfileNamesFromUserMetadata(user);
  if (!first_name && !last_name) return;

  await supabase.from("user_profiles").upsert(
    {
      user_id: user.id,
      first_name,
      last_name,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
}
