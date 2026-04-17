import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { TacticsGrid } from "./tactics-grid";

type TacticRow = {
  id: string;
  title: string;
  share_id: string;
  is_public: boolean;
  canvas_state: unknown;
  home_team_name: string;
  away_team_name: string;
  formation_key: string;
  updated_at: string;
  created_at: string;
};

export default async function MyTacticsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) {
    redirect("/");
  }

  const { data, error } = await supabase
    .from("tactics")
    .select(
      "id, title, share_id, is_public, canvas_state, home_team_name, away_team_name, formation_key, created_at, updated_at"
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const tactics = (data ?? []) as TacticRow[];
  const hasTactics = tactics.length > 0;

  return (
    <div className="min-h-screen bg-pitch-night">
      <SiteHeader showEditorLink={false} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-balance text-xl font-semibold text-[var(--foreground)]">Taktiklerim</h1>
            {!error && hasTactics ? (
              <Link
                href="/editor"
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--on-accent)] transition hover:brightness-110"
              >
                Yeni Taktik Oluştur
              </Link>
            ) : null}
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              Taktikler yüklenirken bir hata oluştu.
            </p>
          ) : null}

          {!error && !hasTactics ? (
            <div className="rounded-2xl border border-dashed border-[var(--accent)]/40 bg-[var(--accent)]/5 p-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-[var(--accent)]/35 bg-[var(--accent)]/15 text-[var(--accent)]">
                <PlusCircle className="h-7 w-7" />
              </div>
              <p className="text-base font-semibold text-[var(--foreground)]">Henüz bir taktiğin yok</p>
              <p className="mt-2 text-balance text-sm text-[var(--muted)]">
                İlk taktiğini oluşturmak için editöre geçebilirsin.
              </p>
              <Link
                href="/editor"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-semibold text-[var(--on-accent)] transition hover:brightness-110"
              >
                Yeni Taktik Oluştur
              </Link>
            </div>
          ) : null}

          {!error && hasTactics ? (
            <TacticsGrid tactics={tactics} />
          ) : null}
        </section>
      </main>
    </div>
  );
}
