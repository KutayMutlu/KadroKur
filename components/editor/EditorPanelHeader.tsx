"use client";

import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

export type EditorPanelHeaderProps = {
  /** 0 = hiçbiri seçili değil (hepsi kapalı) */
  activeStep: number;
  onStepSelect: (step: number) => void;
};

/**
 * Sol panel üstü — masaüstü: tam blok; mobil çekmede drawer başlığı kullanılır, bu bileşen gösterilmez.
 * Adım rozetleri accordion ile eşlenir; aynı rozete tekrar tıklanınca bölüm kapanır.
 */
export function EditorPanelHeader({ activeStep, onStepSelect }: EditorPanelHeaderProps) {
  const { strings: ui } = useLocale();
  const steps = [
    { n: 1, label: ui.editorStepTeam },
    { n: 2, label: ui.editorStepMatch },
    { n: 3, label: ui.editorStepOpponent },
    { n: 4, label: ui.editorStepSave },
  ] as const;

  return (
    <header className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-b from-[var(--bg-elevated)]/80 to-[var(--bg-card)]/50 px-3 py-3.5 shadow-[var(--card-inset-glow)] sm:px-4 sm:py-4">
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-10 -top-16 h-28 w-28 rounded-full bg-[var(--accent)]/[0.07] blur-2xl" aria-hidden />

      <div className="relative flex flex-col gap-3">
        <div className="text-center sm:text-left">
          <h2
            className="text-base font-semibold tracking-[0.14em] text-[var(--foreground)] sm:text-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {ui.editorPanelTitle}
          </h2>
          <p className="mt-1 max-w-md text-pretty text-[11px] leading-relaxed text-[var(--muted)] sm:mx-0 sm:text-xs">
            {ui.editorPanelIntro}
          </p>
        </div>

        <ol
          className="flex flex-wrap justify-center gap-2 sm:justify-start"
          aria-label={ui.editorStepsAria}
        >
          {steps.map((s) => {
            const isActive = activeStep === s.n;
            return (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => onStepSelect(s.n)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-[10px] font-medium ring-1 transition-colors",
                    isActive
                      ? "border-[var(--accent)]/45 bg-[var(--accent)]/14 text-[var(--foreground)] ring-[var(--accent)]/25"
                      : "border-white/8 bg-black/20 text-[var(--muted)] ring-white/[0.04] hover:border-white/15 hover:bg-black/28"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
                      isActive
                        ? "bg-[var(--accent)]/35 text-[var(--accent)]"
                        : "bg-[var(--accent)]/22 text-[var(--accent)]"
                    )}
                  >
                    {s.n}
                  </span>
                  <span className={cn(isActive ? "text-[var(--foreground)]" : "text-[var(--foreground)]/90")}>
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
