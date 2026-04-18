"use client";

import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
import { Goal } from "lucide-react";

/**
 * Üst çubukta, saha ile aynı görsel dil — tek satır, sahayı küçültmez.
 */
export function EditorHeaderPitchBar({ tacticTitle }: { tacticTitle: string }) {
  const { strings: ui } = useLocale();
  const trimmed = tacticTitle.trim();
  const hasTitle = trimmed.length > 0;
  const ariaLabel = hasTitle
    ? ui.editorPitchAriaWithTitle.replace("{title}", trimmed)
    : ui.editorPitchAriaNoTitle;

  return (
    <div
      className={cn(
        "relative min-w-0 w-full max-w-md overflow-hidden rounded-xl border px-2.5 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm sm:rounded-[0.9rem] sm:px-3 sm:py-2",
        "border-emerald-500/30 bg-gradient-to-b from-emerald-900/55 via-[#0c1810]/95 to-black/35"
      )}
      title={hasTitle ? trimmed : undefined}
      aria-label={ariaLabel}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(16,185,129,0.06)_0%,transparent_100%)]"
        aria-hidden
      />

      <div className="relative flex min-w-0 items-center justify-center gap-1.5 sm:justify-start sm:gap-2">
        <Goal className="h-3.5 w-3.5 shrink-0 text-emerald-400" strokeWidth={2} aria-hidden />
        <span className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-200/88 sm:inline sm:text-[10px]">
          {ui.editorPitchBadgeThisPitch}
        </span>
        <span className="hidden text-emerald-500/45 sm:inline" aria-hidden>
          ·
        </span>
        <p
          className={cn(
            "min-w-0 flex-1 truncate text-center text-[12px] font-semibold leading-tight text-white sm:text-left sm:text-[13px]",
            !hasTitle && "text-emerald-100/45"
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {hasTitle ? trimmed : ui.editorUntitledTactic}
        </p>
      </div>
    </div>
  );
}
