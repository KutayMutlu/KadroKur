/**
 * Supabase dashboard: Project URL + anon (legacy) veya publishable key.
 * İkisi de desteklenir; publishable önceliklidir.
 */
function pickEnv(...keys: (string | undefined)[]): string | null {
  for (const v of keys) {
    const t = v?.trim();
    if (t) return t;
  }
  return null;
}

export function getSupabaseUrl(): string | null {
  return pickEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string | null {
  return pickEnv(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
