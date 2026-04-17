"use client";

/**
 * Sol panel üstü — masaüstü: tam blok; mobil çekmede drawer başlığı kullanılır, bu bileşen gösterilmez.
 */
export function EditorPanelHeader() {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-b from-[var(--bg-elevated)]/70 to-[var(--bg-card)]/40 px-3 py-3.5 shadow-[var(--card-inset-glow)] sm:px-4 sm:py-4">
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-10 -top-16 h-28 w-28 rounded-full bg-[var(--accent)]/[0.07] blur-2xl" aria-hidden />
      <div className="relative flex flex-col items-center gap-1.5 text-center sm:gap-2">
        <h2
          className="text-base font-semibold tracking-[0.14em] text-[var(--foreground)] sm:text-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          EDİTÖR
        </h2>
        <p className="max-w-[17.5rem] text-pretty text-[11px] leading-relaxed text-[var(--muted)] sm:max-w-md sm:text-xs">
          Dizilişi seç, oyuncuları taşı; kaydet veya paylaş.
        </p>
      </div>
    </header>
  );
}
