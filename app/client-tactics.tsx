"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatTeamMatchupLine } from "@/lib/tactic-display";
import { listLocalTactics, type StoredTactic } from "@/lib/local-tactics";
import { getSupabase } from "@/lib/supabase";
import type { CanvasState } from "@/types/tactic";

type CloudTactic = {
  id: string;
  title: string;
  share_id: string;
  updated_at: string;
  canvas_state?: CanvasState | null;
};

export function ClientTactics() {
  const [items, setItems] = useState<StoredTactic[]>([]);
  const [cloudItems, setCloudItems] = useState<CloudTactic[]>([]);
  const [cloudReady, setCloudReady] = useState(false);

  useEffect(() => {
    setItems(listLocalTactics());
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setCloudReady(true);
      return;
    }
    let disposed = false;

    const loadCloud = async () => {
      const { data } = await sb.auth.getUser();
      const userId = data.user?.id;
      if (!userId) {
        if (!disposed) {
          setCloudItems([]);
          setCloudReady(true);
        }
        return;
      }
      const { data: rows } = await sb
        .from("tactics")
        .select("id, title, share_id, updated_at, canvas_state")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (!disposed) {
        setCloudItems((rows as CloudTactic[] | null) ?? []);
        setCloudReady(true);
      }
    };

    loadCloud();
    const { data: sub } = sb.auth.onAuthStateChange(() => {
      loadCloud();
    });
    return () => {
      disposed = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (items.length === 0 && cloudItems.length === 0 && cloudReady) {
    return (
      <section
        className="mt-14 border-t border-[var(--border-subtle)]/80 pt-14 sm:mt-16 sm:pt-16"
        aria-labelledby="taktikler-bos"
      >
        <h2 id="taktikler-bos" className="sr-only">
          Kayıtlı taktikler
        </h2>
        <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)]/80 p-8 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:p-10">
          <p
            className="mx-auto max-w-md text-sm leading-relaxed text-[var(--muted)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Henüz kayıtlı taktik yok. Editörde bir diziliş kaydettiğinde burada listelenecek.
          </p>
          <Link
            href="/editor"
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--on-accent)] transition hover:brightness-110 touch-manipulation"
            style={{ fontFamily: "var(--font-display)" }}
          >
            İlk taktikini oluştur
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      className="mt-14 border-t border-[var(--border-subtle)]/80 pt-14 sm:mt-16 sm:pt-16"
      aria-labelledby="taktikler-baslik"
    >
      <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="taktikler-baslik"
            className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kayıtlı taktikler
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Bu cihazdaki ve hesabınızdaki kayıtlar</p>
        </div>
      </div>
      {cloudItems.length > 0 && (
        <>
          <h3 className="mb-2 text-sm font-medium text-[var(--accent)]">
            Hesabımdaki taktikler
          </h3>
          <ul className="mb-4 grid gap-3 sm:grid-cols-2">
            {cloudItems.map((t) => {
              const matchup = formatTeamMatchupLine(t.canvas_state);
              return (
              <li key={`cloud-${t.id}`}>
                <Link
                  href={`/editor?id=${encodeURIComponent(t.id)}`}
                  className="group flex min-h-[72px] touch-manipulation flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 transition active:bg-[var(--bg-elevated)]/60 hover:border-[var(--border-glow)] hover:bg-[var(--bg-elevated)]/80"
                >
                  <span
                    className="font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.title}
                  </span>
                  {matchup ? (
                    <span className="mt-1 text-xs text-[var(--muted)]">{matchup}</span>
                  ) : null}
                </Link>
              </li>
            );
            })}
          </ul>
        </>
      )}
      {items.length > 0 && (
        <>
          <h3 className="mb-2 text-sm font-medium text-[var(--muted)]">
            Bu cihazdaki kayıtlar
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((t) => {
              const matchup = formatTeamMatchupLine(t.canvas_state);
              return (
              <li key={t.id}>
                <Link
                  href={`/editor?id=${encodeURIComponent(t.id)}`}
                  className="group flex min-h-[72px] touch-manipulation flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 transition active:bg-[var(--bg-elevated)]/60 hover:border-[var(--border-glow)] hover:bg-[var(--bg-elevated)]/80"
                >
                  <span
                    className="font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.title}
                  </span>
                  {matchup ? (
                    <span className="mt-1 text-xs text-[var(--muted)]">{matchup}</span>
                  ) : null}
                </Link>
              </li>
            );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
