import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ClientTactics } from "./client-tactics";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-pitch-night">
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />

      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 md:pt-16">
        <section className="grid gap-8 md:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <div>
            <h1
              className="text-3xl font-bold leading-[1.12] tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Taktik tahtası,
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hot)] bg-clip-text text-transparent">
                halı saha ritmiyle.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:mt-5 sm:text-lg">
              Dizilişini seç, oyuncuları sahaya diz, sürükleyerek düzelt; kaydet,
              PNG al veya tek linkle paylaş — maç öncesi son şekil sende.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="/editor"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--on-accent)] shadow-lg shadow-[var(--accent)]/25 transition hover:brightness-110 touch-manipulation"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Taktik kurmaya başla
              </Link>
              <Link
                href="/taktiklerim"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-3.5 text-sm font-medium text-[var(--foreground)] backdrop-blur-sm transition hover:border-[var(--border-glow)] touch-manipulation"
              >
                Kayıtlı taktikler
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              {[
                "2-3-1 · 3-2-1 · 2-2-2 · 3-3",
                "PNG dışa aktar",
              ].map((label) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 px-3 py-2"
                >
                  <span className="text-[var(--accent-dim)]">✓</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Sağ: dekoratif “mini saha” kartı */}
          <div className="relative animate-float-soft">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--accent)]/20 via-transparent to-[var(--accent-hot)]/10 blur-2xl" />
            <div
              className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-2xl backdrop-blur-md"
              style={{ boxShadow: "var(--card-inset-glow)" }}
            >
              <div className="mb-4 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Önizleme</span>
                <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[10px] text-[var(--accent)]">
                  /editor
                </span>
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[var(--pitch-line)] bg-gradient-to-b from-[var(--mini-pitch-from)] to-[var(--mini-pitch-to)]">
                <div className="absolute inset-x-[12%] top-[8%] bottom-[8%] rounded-sm border border-[var(--pitch-line)]" />
                <div className="absolute left-1/2 top-1/2 h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--pitch-line)]" />
                <div className="absolute left-0 right-0 top-1/2 border-t border-[var(--pitch-line)]" />
                <div className="absolute bottom-[18%] left-[22%] h-3 w-3 rounded-full bg-[#f87171] ring-2 ring-[var(--mini-pitch-ring)]" />
                <div className="absolute bottom-[28%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#fbbf24] ring-2 ring-[var(--mini-pitch-ring)]" />
                <div className="absolute bottom-[18%] right-[22%] h-3 w-3 rounded-full bg-[#4ade80] ring-2 ring-[var(--mini-pitch-ring)]" />
                <div className="absolute bottom-[42%] left-[30%] h-3 w-3 rounded-full bg-[#a78bfa] ring-2 ring-[var(--mini-pitch-ring)]" />
                <div className="absolute bottom-[42%] right-[30%] h-3 w-3 rounded-full bg-[#22d3ee] ring-2 ring-[var(--mini-pitch-ring)]" />
              </div>
              <p className="mt-4 text-center text-xs text-[var(--muted)]">
                Gerçek editörde oyuncuları sürükleyerek konumlandırırsın.
              </p>
            </div>
          </div>
        </section>

        <div id="kayitli" className="scroll-mt-24">
          <ClientTactics />
        </div>
      </main>

      <footer className="relative z-10 border-t border-[var(--border-subtle)] py-8 text-center text-xs text-[var(--muted)]">
        <p>KadroKur — halı saha için taktik editörü demosu</p>
      </footer>
    </div>
  );
}
