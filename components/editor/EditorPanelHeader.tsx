"use client";

const STEPS = [
  { n: 1, label: "Takım" },
  { n: 2, label: "Saha" },
  { n: 3, label: "Rakip" },
  { n: 4, label: "Kaydet" },
] as const;

/**
 * Sol panel üstü — masaüstü: tam blok; mobil çekmede drawer başlığı kullanılır, bu bileşen gösterilmez.
 */
export function EditorPanelHeader() {
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
            EDİTÖR
          </h2>
          <p className="mt-1 max-w-md text-pretty text-[11px] leading-relaxed text-[var(--muted)] sm:mx-0 sm:text-xs">
            Aşağıdaki sırayı izleyin: önce takım, sonra saha, isteğe rakip, en sonda kayıt.
          </p>
        </div>

        <ol className="flex flex-wrap justify-center gap-2 sm:justify-start" aria-label="Adımlar">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-black/20 py-1 pl-1 pr-2.5 text-[10px] font-medium text-[var(--muted)] ring-1 ring-white/[0.04]"
            >
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)]/22 px-1 text-[10px] font-bold tabular-nums text-[var(--accent)]">
                {s.n}
              </span>
              <span className="text-[var(--foreground)]/90">{s.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
