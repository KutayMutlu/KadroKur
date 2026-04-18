"use client";

import { useLocale } from "@/components/locale-provider";

export default function UserPanelLoading() {
  const { strings: ui } = useLocale();
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
        <div className="mb-3 h-4 w-40 animate-pulse rounded bg-[var(--bg-soft)]" />
        <div className="h-3 w-64 animate-pulse rounded bg-[var(--bg-soft)]" />
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-[var(--bg-soft)]" />
          <div className="h-8 w-24 animate-pulse rounded-lg bg-[var(--bg-soft)]" />
        </div>

        <div className="space-y-3">
          <div className="h-10 w-full animate-pulse rounded-lg bg-[var(--bg-soft)]" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-[var(--bg-soft)]" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-[var(--bg-soft)]" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-[var(--bg-soft)]" />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">{ui.panelLoadingMessage}</p>
      </div>
    </section>
  );
}
