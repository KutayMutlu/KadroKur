"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EditorSectionProps = {
  title: string;
  step: number;
  /** Tek seferde bir bölüm açık — masaüstünde panel kaydırmasını azaltır */
  expanded: boolean;
  onSelect: () => void;
  children: ReactNode;
  className?: string;
};

const panelId = (step: number) => `editor-section-panel-${step}`;
const triggerId = (step: number) => `editor-section-trigger-${step}`;

/** Sol panelde numaralı accordion — başlığa tıklayınca açılır, diğerleri kapanır */
export function EditorSection({ title, step, children, expanded, onSelect, className }: EditorSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-black/[0.14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-[border-color,box-shadow] duration-150",
        expanded
          ? "border-[var(--accent)]/35 ring-1 ring-[var(--accent)]/12"
          : "border-[var(--border-subtle)]",
        className
      )}
    >
      <button
        type="button"
        id={triggerId(step)}
        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04] sm:px-3.5 sm:py-3"
        onClick={onSelect}
        aria-expanded={expanded}
        aria-controls={panelId(step)}
      >
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums ring-1",
            expanded
              ? "bg-[var(--accent)]/25 text-[var(--accent)] ring-[var(--accent)]/30"
              : "bg-[var(--accent)]/18 text-[var(--accent)] ring-[var(--accent)]/25"
          )}
          aria-hidden
        >
          {step}
        </span>
        <h3 className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]/95">
          {title}
        </h3>
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--muted)]" aria-hidden />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-[var(--muted)]" aria-hidden />
        )}
      </button>
      <div
        id={panelId(step)}
        role="region"
        aria-labelledby={triggerId(step)}
        hidden={!expanded}
        className={cn(
          "border-t border-[var(--border-subtle)]/80 px-3 pb-3 pt-1 sm:px-3.5 sm:pb-3.5",
          expanded && "max-h-[min(58vh,520px)] overflow-y-auto overscroll-contain"
        )}
      >
        <div className="space-y-3 pt-2">{children}</div>
      </div>
    </section>
  );
}
