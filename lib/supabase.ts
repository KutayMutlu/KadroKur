import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createBrowserSupabase } from "@/lib/supabase/browser";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/keys";

let browserClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  if (!browserClient) {
    browserClient = createBrowserSupabase();
  }
  return browserClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
