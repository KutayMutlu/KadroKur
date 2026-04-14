"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function AuthControls() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [configured] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const sb = getSupabase();
    if (!sb) {
      window.alert(
        "Supabase ayarlari yok veya yuklenemedi. Vercel / .env.local icinde NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY (veya PUBLISHABLE_KEY) tanimlayip yeniden deploy edin."
      );
      return;
    }
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        `${window.location.pathname}${window.location.search}`
      )}`;
      const { data, error } = await sb.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: false },
      });
      if (error) {
        window.alert(error.message);
        setLoading(false);
        return;
      }
      if (data?.url) {
        window.location.assign(data.url);
      }
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Giris baslatilamadi.");
      setLoading(false);
    }
  };

  const signOut = async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoading(true);
    await sb.auth.signOut();
    setLoading(false);
  };

  if (!configured) {
    return (
      <div className="flex max-w-[220px] flex-col items-end gap-1 text-right">
        <Button type="button" variant="secondary" disabled className="w-full">
          Google ile giris
        </Button>
        <span className="text-[10px] leading-tight text-amber-200/90">
          Ortamda NEXT_PUBLIC_SUPABASE_* eksik; Vercel env ekleyin.
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <Button
        type="button"
        variant="secondary"
        onClick={signInWithGoogle}
        disabled={loading}
      >
        Google ile giris
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="max-w-[180px] truncate text-xs text-[var(--muted)]">
        {user.email}
      </span>
      <Button
        type="button"
        variant="secondary"
        onClick={signOut}
        disabled={loading}
      >
        Cikis
      </Button>
    </div>
  );
}
