import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ClientTactics } from "./client-tactics";
import { AuthControls } from "@/components/auth/AuthControls";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-pitch-night">
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />

      {/* Üst şerit — stadyum hissi */}
      <header className="relative z-10 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-row items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-glow)] bg-[var(--bg-card)] text-base font-bold text-[var(--accent)] sm:h-10 sm:w-10 sm:text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              KK
            </span>
            <div className="min-w-0">
              <p
                className="text-sm font-semibold leading-tight tracking-tight text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                KadroKur
              </p>
              <p
                className="truncate text-[10px] leading-tight text-[var(--muted)] sm:text-[11px]"
                title="Halı saha taktik tahtası"
              >
                Halı saha taktik tahtası
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-nowrap items-center gap-1.5 sm:gap-2">
            <AuthControls guestCompanion={<ThemeToggle />} />
            <Link
              href="/editor"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-1.5 text-[11px] font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/20 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="sm:hidden">Editör →</span>
              <span className="hidden sm:inline">Editöre git →</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--muted)] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-line" />
              Faz 1 · Canlı demo
            </p>
            <h1
              className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Taktik tahtası,
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hot)] bg-clip-text text-transparent">
                halı saha ritmiyle.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              Dizilişini seç, oyuncuları sahaya diz, sürükleyerek düzelt; kaydet,
              PNG al veya tek linkle paylaş — maç öncesi son şekil sende.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/editor"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--on-accent)] shadow-lg shadow-[var(--accent)]/25 transition hover:brightness-110"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Taktik kurmaya başla
              </Link>
              <a
                href="#kayitli"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-3.5 text-sm font-medium text-[var(--foreground)] backdrop-blur-sm transition hover:border-[var(--border-glow)]"
              >
                Kayıtlı taktikler
              </a>
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
