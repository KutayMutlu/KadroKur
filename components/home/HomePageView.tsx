"use client";

import Link from "next/link";
import { ArrowRight, Download, LayoutGrid, Share2, Sparkles } from "lucide-react";
import { HomePitchPreview } from "@/components/home/HomePitchPreview";
import { SiteHeader } from "@/components/site-header";
import { useLocale } from "@/components/locale-provider";
import { ClientTactics } from "@/app/client-tactics";

export function HomePageView() {
  const { strings: s } = useLocale();

  const howSteps = [
    { step: 1, title: s.homeHow1Title, text: s.homeHow1Text },
    { step: 2, title: s.homeHow2Title, text: s.homeHow2Text },
    { step: 3, title: s.homeHow3Title, text: s.homeHow3Text },
  ] as const;

  const features = [
    { Icon: LayoutGrid, label: s.homeFeat1Label, sub: s.homeFeat1Sub },
    { Icon: Download, label: s.homeFeat2Label, sub: s.homeFeat2Sub },
    { Icon: Share2, label: s.homeFeat3Label, sub: s.homeFeat3Sub },
  ] as const;

  return (
    <div className="relative min-h-screen bg-pitch-night">
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />

      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-8 sm:px-6 sm:pb-24 sm:pt-12 md:pt-16">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)]/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)] shadow-[var(--card-inset-glow)] sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
              {s.homeBadge}
            </p>
            <h1
              className="text-[1.65rem] font-bold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.homeHeroLine1}
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hot)] bg-clip-text text-transparent">
                {s.homeHeroGradient}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:mt-5 sm:text-lg">
              {s.homeLead}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/editor"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--on-accent)] shadow-lg shadow-[var(--accent)]/22 transition hover:brightness-110 active:scale-[0.99] touch-manipulation"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.homeCtaStart}
                <ArrowRight className="h-4 w-4 opacity-90" aria-hidden />
              </Link>
              <Link
                href="/taktiklerim"
                className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 px-6 py-3.5 text-sm font-medium text-[var(--foreground)] backdrop-blur-sm transition hover:border-[var(--border-glow)] hover:bg-[var(--bg-elevated)]/80 active:scale-[0.99] touch-manipulation"
              >
                {s.homeCtaSaved}
              </Link>
            </div>
            <p className="mt-4 text-center text-[11px] text-[var(--muted)] sm:text-left sm:text-xs">
              <Link
                href="#nasil"
                className="font-medium text-[var(--accent)] underline-offset-4 transition hover:text-[var(--accent-dim)] hover:underline"
              >
                {s.homeAnchorHow}
              </Link>
              <span className="mx-2 text-[var(--border-subtle)]">·</span>
              <Link
                href="#kayitli"
                className="font-medium text-[var(--accent)] underline-offset-4 transition hover:text-[var(--accent-dim)] hover:underline"
              >
                {s.homeAnchorList}
              </Link>
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {features.map(({ Icon, label, sub }) => (
                <li
                  key={label}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/35 px-3 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:flex-col sm:items-center sm:text-center"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/12 text-[var(--accent)] ring-1 ring-[var(--accent)]/20 sm:mx-auto">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[var(--foreground)]">{label}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-[var(--muted)]">{sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <HomePitchPreview />
        </section>

        <section
          id="nasil"
          className="scroll-mt-28 border-t border-[var(--border-subtle)]/80 pt-14 sm:pt-16"
          aria-labelledby="nasil-baslik"
        >
          <div className="mb-8 text-center sm:mb-10 sm:text-left">
            <h2
              id="nasil-baslik"
              className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.homeHowTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:mx-0 sm:text-base">
              {s.homeHowIntro}
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {howSteps.map(({ step, title, text }) => (
              <li
                key={step}
                className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm transition hover:border-[var(--accent)]/25"
              >
                <span
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)]/15 text-sm font-bold text-[var(--accent)] ring-1 ring-[var(--accent)]/25"
                  aria-hidden
                >
                  {step}
                </span>
                <h3 className="text-base font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex justify-center sm:justify-start">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/18"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.homeHowCta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <div id="kayitli" className="scroll-mt-28">
          <ClientTactics />
        </div>
      </main>

      <footer className="relative z-10 border-t border-[var(--border-subtle)] px-4 py-10 text-center sm:px-6">
        <p className="text-xs text-[var(--muted)]">
          <span className="font-medium text-[var(--foreground)]/90">KadroKur</span> {s.footerAfterBrand}
        </p>
        <p className="mt-2 text-[11px] text-[var(--muted)]/90">{s.footerTagline}</p>
      </footer>
    </div>
  );
}
