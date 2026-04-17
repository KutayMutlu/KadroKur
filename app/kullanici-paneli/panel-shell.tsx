"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserPanelUser } from "./user-panel-context";

type Props = {
  children: React.ReactNode;
};

function PanelLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link
        href="/kullanici-paneli/profil"
        onClick={onNavigate}
        className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]/10"
      >
        Profil
      </Link>
      <Link
        href="/kullanici-paneli/kisisel-bilgiler"
        onClick={onNavigate}
        className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]/10"
      >
        Kişisel Bilgiler
      </Link>
      <Link
        href="/kullanici-paneli/taktikler"
        onClick={onNavigate}
        className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]/10"
      >
        Taktikler
      </Link>
      <Link
        href="/kullanici-paneli/ayarlar"
        onClick={onNavigate}
        className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]/10"
      >
        Ayarlar
      </Link>
    </>
  );
}

export function UserPanelShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const user = useUserPanelUser();

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
    router.prefetch("/kullanici-paneli/taktikler");
    router.prefetch("/kullanici-paneli/ayarlar");
  }, [router]);

  return (
    <div className="min-h-screen bg-pitch-night">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/95 px-4 py-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menüyü aç/kapat"
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2 text-[var(--foreground)]"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Hesap</p>
          <p className="text-sm font-semibold text-[var(--foreground)]">Kullanıcı Paneli</p>
          {user.email ? <p className="text-[11px] text-[var(--muted)]">{user.email}</p> : null}
        </div>
      </header>

      <button
        type="button"
        aria-label="Menüyü kapat"
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-card)]/95 p-4 backdrop-blur transition-transform md:z-20 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Hesap</p>
          <h1 className="mt-1 text-lg font-semibold text-[var(--foreground)]">Kullanıcı Paneli</h1>
          {user.email ? <p className="mt-1 break-all text-xs text-[var(--muted)]">{user.email}</p> : null}
        </div>

        <nav aria-label="Kullanıcı paneli menüsü" className="space-y-1">
          <PanelLinks onNavigate={() => setMobileOpen(false)} />
        </nav>

        <div className="mt-8 border-t border-[var(--border-subtle)] pt-4">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]/40"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </aside>

      <main className="min-h-screen px-4 py-6 md:ml-64 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
