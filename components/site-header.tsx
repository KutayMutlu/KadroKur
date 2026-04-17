import Link from "next/link";
import { AuthControls } from "@/components/auth/AuthControls";
import { ThemeToggle } from "@/components/theme-toggle";

type SiteHeaderProps = {
  /** Varsayılan true. Taktiklerim gibi sayfalarda false yapılabilir (sayfa zaten editöre yönlendiriyor). */
  showEditorLink?: boolean;
};

/**
 * Ana sayfa ve genel sayfalarda ortak üst şerit: logo → anasayfa, tema, hesap menüsü, isteğe bağlı editör linki.
 */
export function SiteHeader({ showEditorLink = true }: SiteHeaderProps) {
  return (
    <header className="relative z-10 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-row items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-glow)] bg-[var(--bg-card)] text-base font-bold text-[var(--accent)] sm:h-10 sm:w-10 sm:text-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            KK
          </span>
          <div className="min-w-0 text-left">
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
        </Link>
        <div className="flex shrink-0 flex-nowrap items-center gap-1.5 sm:gap-2">
          <AuthControls guestCompanion={<ThemeToggle />} />
          {showEditorLink ? (
            <Link
              href="/editor"
              className="inline-flex min-h-[40px] shrink-0 touch-manipulation items-center justify-center rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-1.5 text-[11px] font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/20 sm:min-h-0 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="sm:hidden">Editör →</span>
              <span className="hidden sm:inline">Editöre git →</span>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
