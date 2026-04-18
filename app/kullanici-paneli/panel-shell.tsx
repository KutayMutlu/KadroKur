"use client";

import Link from "next/link";
import { ChevronRight, Contact, Home, Menu, Settings, UserRound, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
import { useUserPanelUser } from "./user-panel-context";

function initialsFromUser(displayName: string, email: string | null): string {
  const words = displayName.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const a = words[0][0];
    const b = words[words.length - 1][0];
    if (a && b) return (a + b).toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  if (email) {
    const local = email.split("@")[0] ?? "";
    if (local.length >= 2) return local.slice(0, 2).toUpperCase();
    if (local.length === 1) return `${local.toUpperCase()}·`;
  }
  return "?";
}

function PanelUserAvatar({
  avatarUrl,
  displayName,
  email,
  size = "lg",
}: {
  avatarUrl?: string | null;
  displayName: string;
  email: string | null;
  size?: "sm" | "lg";
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = useMemo(() => initialsFromUser(displayName, email), [displayName, email]);
  const src = avatarUrl?.trim();
  const showImage = Boolean(src) && !imgFailed;

  const box =
    size === "lg"
      ? "h-14 w-14 text-[15px]"
      : "h-10 w-10 text-[11px] font-semibold";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-[var(--bg-elevated)] ring-2 ring-[var(--border-subtle)] ring-offset-2 ring-offset-[var(--bg-card)]",
        box
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- harici / Supabase URL; ileride next/image domain eklenebilir
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--accent)]/25 via-[var(--bg-elevated)] to-[var(--accent)]/10 font-semibold text-[var(--accent)]"
          style={{ fontFamily: "var(--font-display)" }}
          aria-hidden
        >
          {initials}
        </div>
      )}
    </div>
  );
}

type Props = {
  children: React.ReactNode;
};

function PanelLinks({
  onNavigate,
  items,
}: {
  onNavigate?: () => void;
  items: readonly { href: string; label: string; Icon: LucideIcon }[];
}) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[var(--accent)]/[0.12] text-[var(--foreground)] shadow-[inset_3px_0_0_0_var(--accent)] ring-1 ring-[var(--accent)]/20"
                  : "text-[var(--muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--foreground)]"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  active
                    ? "border-[var(--accent)]/35 bg-[var(--accent)]/15 text-[var(--accent)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 text-[var(--muted)] group-hover:border-[var(--accent)]/25 group-hover:text-[var(--accent-dim)]"
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
              </span>
              <span className="min-w-0 flex-1 leading-snug tracking-tight">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function UserPanelShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const user = useUserPanelUser();
  const { strings: ui } = useLocale();
  const shownName = user.displayNameIsFallback ? ui.panelDefaultDisplayName : user.displayName;
  const panelNav = [
    { href: "/kullanici-paneli/profil", label: ui.panelNavProfile, Icon: UserRound },
    { href: "/kullanici-paneli/kisisel-bilgiler", label: ui.panelNavPersonal, Icon: Contact },
    { href: "/kullanici-paneli/ayarlar", label: ui.panelNavSettings, Icon: Settings },
  ] as const;

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    router.prefetch("/kullanici-paneli/profil");
    router.prefetch("/kullanici-paneli/kisisel-bilgiler");
    router.prefetch("/kullanici-paneli/ayarlar");
  }, [router]);

  const profilHref = "/kullanici-paneli/profil";

  const identityCard = (opts: { onNavigate?: () => void; compact?: boolean }) => (
    <Link
      href={profilHref}
      onClick={opts.onNavigate}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--bg-elevated)]/80 to-[var(--bg-card)] p-3 shadow-[var(--card-inset-glow)] transition hover:border-[var(--accent)]/35 hover:shadow-[0_0_0_1px_rgba(190,255,100,0.12)]",
        opts.compact && "p-2.5"
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[var(--accent)]/[0.06] blur-2xl transition group-hover:bg-[var(--accent)]/[0.1]"
        aria-hidden
      />
      <div className="relative flex items-start gap-3">
        <PanelUserAvatar
          avatarUrl={user.avatarUrl}
          displayName={shownName}
          email={user.email}
          size={opts.compact ? "sm" : "lg"}
        />
        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className="text-pretty break-words text-sm font-semibold leading-snug text-[var(--foreground)] [overflow-wrap:anywhere] group-hover:text-[var(--accent)] sm:text-[15px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {shownName}
            </p>
            <ChevronRight
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted)] opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden
            />
          </div>
          {user.email ? (
            <p className="mt-1.5 break-all text-[11px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere] sm:break-words">
              {user.email}
            </p>
          ) : (
            <p className="mt-1.5 text-[11px] text-[var(--muted)]">{ui.panelEditProfileHint}</p>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-pitch-night">
      {/* Mobil üst bar — çentik / durum çubuğu için safe-area */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/90 px-3 py-2.5 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="user-panel-sidebar"
          aria-label={mobileOpen ? ui.panelMenuCloseMobile : ui.panelMenuOpenMobile}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2.5 text-[var(--foreground)] transition hover:border-[var(--accent)]/35 hover:bg-[var(--accent)]/5"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link
          href={profilHref}
          className="flex min-w-0 flex-1 items-start gap-2.5 rounded-xl py-1 pr-1 transition hover:bg-[var(--bg-elevated)]/60"
        >
          <PanelUserAvatar
            avatarUrl={user.avatarUrl}
            displayName={shownName}
            email={user.email}
            size="sm"
          />
          <div className="min-w-0 flex-1 text-left">
            <p
              className="text-pretty break-words text-sm font-semibold leading-snug text-[var(--foreground)] [overflow-wrap:anywhere]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {shownName}
            </p>
            {user.email ? (
              <p className="mt-0.5 break-all text-[10px] leading-snug text-[var(--muted)] sm:break-words">{user.email}</p>
            ) : null}
          </div>
        </Link>
      </header>

      <button
        type="button"
        aria-label={ui.panelMenuCloseMobile}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-[var(--bg-deep)]/70 backdrop-blur-sm transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Yan navbar */}
      <aside
        id="user-panel-sidebar"
        className={cn(
          "fixed left-0 top-0 z-40 flex h-[100dvh] max-h-[100dvh] w-[min(100vw-1rem,20rem)] flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-card)]/95 shadow-[8px_0_32px_-16px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-[transform,width] duration-300 ease-out md:z-20 md:w-72 lg:w-80",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] md:h-full md:p-5">
          <div className="hidden md:block">{identityCard({ onNavigate: () => setMobileOpen(false) })}</div>
          <div className="mb-4 md:hidden">{identityCard({ compact: true, onNavigate: () => setMobileOpen(false) })}</div>

          <div className="mb-2 px-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              {ui.panelNavSection}
            </p>
          </div>

          <nav
            aria-label={ui.panelNavAria}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3 [-webkit-overflow-scrolling:touch]"
          >
            <PanelLinks items={panelNav} onNavigate={() => setMobileOpen(false)} />
          </nav>

          {/* Alt blok: home indicator / Safari alt çubuğu üstünde kalsın; arka plan opak */}
          <div className="relative z-10 mt-auto shrink-0 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] pt-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 px-3 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.08]"
            >
              <Home className="h-4 w-4 shrink-0 text-[var(--accent-dim)]" aria-hidden />
              {ui.panelBackHome}
            </Link>
          </div>
        </div>
      </aside>

      <main className="min-h-screen px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:ml-72 md:pb-8 lg:ml-80 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
