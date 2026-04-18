import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DOTS = [
  { pos: "bottom-[18%] left-[22%]", color: "bg-[#f87171]", delay: "0s" },
  { pos: "bottom-[28%] left-1/2 -translate-x-1/2", color: "bg-[#fbbf24]", delay: "0.18s" },
  { pos: "bottom-[18%] right-[22%]", color: "bg-[#4ade80]", delay: "0.36s" },
  { pos: "bottom-[42%] left-[30%]", color: "bg-[#a78bfa]", delay: "0.54s" },
  { pos: "bottom-[42%] right-[30%]", color: "bg-[#22d3ee]", delay: "0.72s" },
] as const;

export function HomePitchPreview() {
  return (
    <div className="relative lg:pl-2">
      <div
        className="absolute -inset-1 rounded-[1.65rem] bg-gradient-to-br from-[var(--accent)]/18 via-transparent to-[var(--accent-hot)]/12 blur-2xl"
        aria-hidden
      />
      <div
        className="home-preview-card animate-float-soft relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/95 p-5 shadow-2xl backdrop-blur-md sm:p-6"
        style={{ boxShadow: "var(--card-inset-glow)" }}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="inline-flex items-center gap-2 font-medium text-[var(--foreground)]/90">
              <span className="home-preview-live-dot relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)] ring-2 ring-[var(--accent)]/35" />
              </span>
              Canlı önizleme
            </span>
            <span className="pl-4 text-[10px] font-normal leading-tight text-[var(--muted)]/90 sm:pl-6">
              Animasyonlu örnek — editördeki saha görünümünü yansıtır
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="rounded-md bg-[var(--accent)]/12 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--accent)] ring-1 ring-[var(--accent)]/25">
              Demo
            </span>
            <span className="rounded-lg bg-[var(--bg-elevated)] px-2 py-1 font-mono text-[10px] text-[var(--accent)]">
              /editor
            </span>
          </div>
        </div>

        <div className="home-preview-pitch relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[var(--pitch-line)] bg-gradient-to-b from-[var(--mini-pitch-from)] to-[var(--mini-pitch-to)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)",
            }}
            aria-hidden
          />
          <div className="absolute inset-x-[12%] top-[8%] bottom-[8%] rounded-sm border border-[var(--pitch-line)]" />
          <div className="absolute left-1/2 top-1/2 h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--pitch-line)]" />
          <div className="absolute left-0 right-0 top-1/2 border-t border-[var(--pitch-line)]" />

          {/* Küçük “top” — orta hatta hafif gidip gelir */}
          <div
            className="home-preview-ball absolute bottom-[36%] left-1/2 h-2 w-2 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.35)] ring-1 ring-white/40"
            aria-hidden
          />

          {DOTS.map(({ pos, color, delay }) => (
            <div key={`${pos}-${color}`} className={`absolute ${pos}`}>
              <div
                className={`home-preview-dot-bob h-3 w-3 rounded-full ${color} ring-2 ring-[var(--mini-pitch-ring)]`}
                style={{ "--home-preview-delay": delay } as CSSProperties}
              />
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-[var(--muted)]">
          Editörde oyuncuları sürükleyerek konumlandırırsın; atak yönünü tek dokunuşla çevirebilirsin.
        </p>
        <p className="mt-2 text-center">
          <Link
            href="/editor"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--accent)] underline-offset-4 transition hover:underline"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tam önizlemeyi editörde aç
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </p>
      </div>
    </div>
  );
}
