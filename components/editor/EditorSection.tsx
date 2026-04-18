"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EditorSectionProps = {
  title: string;
  step: number;
  children: ReactNode;
  className?: string;
};

/** Sol panelde numaralı blok — akışı netleştirir */
export function EditorSection({ title, step, children, className }: EditorSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--border-subtle)] bg-black/[0.14] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-3.5",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/18 text-xs font-bold tabular-nums text-[var(--accent)] ring-1 ring-[var(--accent)]/25"
          aria-hidden
        >
          {step}
        </span>
        <h3 className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
