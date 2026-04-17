import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function UserPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-pitch-night">
      <aside className="fixed left-0 top-0 z-20 h-screen w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-card)]/95 p-4 backdrop-blur">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Hesap</p>
          <h1 className="mt-1 text-lg font-semibold text-[var(--foreground)]">Kullanıcı Paneli</h1>
        </div>

        <nav aria-label="Kullanıcı paneli menüsü" className="space-y-1">
          <Link
            href="/kullanici-paneli/profil"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]/10"
          >
            Profil
          </Link>
          <Link
            href="/kullanici-paneli/kisisel-bilgiler"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]/10"
          >
            Kişisel Bilgiler
          </Link>
          <Link
            href="/kullanici-paneli/taktikler"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]/10"
          >
            Taktikler
          </Link>
          <Link
            href="/kullanici-paneli/ayarlar"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]/10"
          >
            Ayarlar
          </Link>
        </nav>

        <div className="mt-8 border-t border-[var(--border-subtle)] pt-4">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]/40"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </aside>

      <main className="min-h-screen px-4 py-8 md:ml-64 md:px-8">{children}</main>
    </div>
  );
}
