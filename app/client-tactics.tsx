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
      <section className="mt-16 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 text-center backdrop-blur-sm">
        <p
          className="text-sm text-[var(--muted)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Henüz kayıtlı taktik yok. Editörde bir diziliş kaydettiğinde burada
          listelenecek.
        </p>
        <Link
          href="/editor"
          className="mt-4 inline-block text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          İlk taktikini oluştur →
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kayıtlı taktikler
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Bu cihaz + hesabınız</p>
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
