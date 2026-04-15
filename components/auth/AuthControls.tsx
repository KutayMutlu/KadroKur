"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { getOAuthRedirectOrigin } from "@/lib/site-origin";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

function pickAvatarUrl(user: User): string | null {
  const m = user.user_metadata as Record<string, unknown> | undefined;
  if (!m) return null;
  const a = m.avatar_url;
  const p = m.picture;
  if (typeof a === "string" && a.length > 0) return a;
  if (typeof p === "string" && p.length > 0) return p;
  return null;
}

function pickInitials(user: User): string {
  const email = user.email ?? "?";
  const ch = email.charAt(0).toUpperCase();
  const ch2 = email.split("@")[0]?.charAt(1);
  return ch2 ? `${ch}${ch2.toUpperCase()}` : ch;
}

export type AuthControlsProps = {
  /** Giriş yokken gösterilir (ör. tema); giriş yapılınca tema hesap menüsüne taşınır. */
  guestCompanion?: ReactNode;
};

export function AuthControls({ guestCompanion }: AuthControlsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

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
      const origin = getOAuthRedirectOrigin();
      if (
        process.env.NODE_ENV === "development" &&
        origin.includes("vercel.app") &&
        typeof window !== "undefined" &&
        !window.location.origin.includes("vercel.app")
      ) {
        console.error(
          "[KadroKur] NEXT_PUBLIC_APP_ORIGIN canlı adres içeriyor; .env.local içinde kaldırın veya http://localhost:3000 yapın."
        );
      }
      const returnPath = `${window.location.pathname}${window.location.search}`;
      document.cookie = `kadrokur_auth_next=${encodeURIComponent(returnPath)}; Path=/; Max-Age=600; SameSite=Lax`;
      const redirectTo = `${origin}/auth/callback`;
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
    const envHint =
      "Kökte .env.local (URL + publishable/anon key). Vercel'den: npm run env:pull — sonra npm run dev yeniden.";
    return (
      <div className="flex shrink-0 flex-col items-end gap-1 text-right sm:max-w-[260px]">
        <Button
          type="button"
          variant="secondary"
          disabled
          size="sm"
          className="shrink-0"
          title={envHint}
        >
          Giriş Yap
        </Button>
        <span className="hidden text-[10px] leading-snug text-amber-200/90 break-words sm:block">
          Kökte <code className="rounded bg-black/25 px-0.5">.env.local</code> (URL + publishable/anon key).{" "}
          Vercel&apos;den çekmek için: <code className="rounded bg-black/25 px-0.5">npm run env:pull</code> — sonra{" "}
          <code className="rounded bg-black/25 px-0.5">npm run dev</code> yeniden.
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 text-xs sm:text-sm"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          Giriş Yap
        </Button>
        {guestCompanion}
      </div>
    );
  }

  const avatarUrl = pickAvatarUrl(user);
  const initials = pickInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={loading}
          className="group flex shrink-0 items-center gap-0.5 rounded-full border-2 border-[var(--border-subtle)] bg-[var(--bg-card)] p-0.5 pl-0.5 pr-1 shadow-sm transition hover:border-[var(--accent)]/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 disabled:opacity-60 data-[state=open]:border-[var(--accent)]/55 data-[state=open]:shadow-[0_0_0_1px_var(--accent)]/25"
          aria-label="Hesap menüsü: e-posta, tema ve çıkış"
          title="Hesap menüsünü aç"
        >
          {avatarUrl ? (
            // OAuth sağlayıcı URL'leri çeşitli; next/image remotePatterns yerine img
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[11px] font-semibold text-[var(--accent)]"
              aria-hidden
            >
              {initials}
            </span>
          )}
          <ChevronDown
            className="h-3.5 w-3.5 shrink-0 text-[var(--muted)] transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-[min(calc(100vw-2rem),18rem)]">
        <DropdownMenuLabel className="space-y-1 font-normal">
          <span className="block text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Hesap
          </span>
          <span className="break-all text-sm leading-snug text-[var(--foreground)]">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div
          className="flex items-center justify-between gap-3 rounded-lg px-2 py-2"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="text-sm text-[var(--foreground)]">Tema</span>
          <ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-red-300 focus:bg-red-950/40 focus:text-red-200"
          disabled={loading}
          onSelect={(e) => {
            e.preventDefault();
            void signOut();
          }}
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
