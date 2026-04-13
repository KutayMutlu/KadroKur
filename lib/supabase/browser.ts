import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "./keys";

export function createClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    throw new Error(
      "Supabase: NEXT_PUBLIC_SUPABASE_URL ve anon/publishable key eksik."
    );
  }
  return createBrowserClient(url, key);
}
