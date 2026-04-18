"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { SiteHeader } from "@/components/site-header";
import { TacticsGrid, type TacticRow } from "./tactics-grid";

export function MyTacticsPageView({
  tactics,
  loadError,
}: {
  tactics: TacticRow[];
  loadError: boolean;
}) {
  const { strings: ui } = useLocale();
  const hasTactics = tactics.length > 0;

  return (
    <div className="min-h-screen bg-pitch-night">
      <SiteHeader showEditorLink={false} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-balance text-xl font-semibold text-[var(--foreground)]">{ui.myTacticsTitle}</h1>
            {!loadError && hasTactics ? (
              <Link
                href="/editor"
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--on-accent)] transition hover:brightness-110"
              >
                {ui.myTacticsNew}
              </Link>
            ) : null}
          </div>

          {loadError ? (
            <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {ui.myTacticsLoadError}
            </p>
          ) : null}

          {!loadError && !hasTactics ? (
            <div className="rounded-2xl border border-dashed border-[var(--accent)]/40 bg-[var(--accent)]/5 p-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-[var(--accent)]/35 bg-[var(--accent)]/15 text-[var(--accent)]">
                <PlusCircle className="h-7 w-7" />
              </div>
              <p className="text-base font-semibold text-[var(--foreground)]">{ui.myTacticsEmptyTitle}</p>
              <p className="mt-2 text-balance text-sm text-[var(--muted)]">{ui.myTacticsEmptyHint}</p>
              <Link
                href="/editor"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-semibold text-[var(--on-accent)] transition hover:brightness-110"
              >
                {ui.myTacticsNew}
              </Link>
            </div>
          ) : null}

          {!loadError && hasTactics ? <TacticsGrid tactics={tactics} /> : null}
        </section>
      </main>
    </div>
  );
}
