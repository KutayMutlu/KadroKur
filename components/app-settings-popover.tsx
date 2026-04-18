"use client";

import { useTheme } from "next-themes";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";

export type AppSettingsPopoverProps = {
  /** Giriş/hesap ile aynı rounded-2xl çerçevede sağ segment (sol tarafta giriş/hesap) */
  variant?: "default" | "embedded";
};

export function AppSettingsPopover({ variant = "default" }: AppSettingsPopoverProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale, strings: s } = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return variant === "embedded" ? (
      <span
        className="inline-flex min-h-[44px] w-11 shrink-0 self-stretch items-center justify-center rounded-r-2xl border-0 bg-[var(--bg-card)]/40 sm:min-h-0 sm:min-h-9 sm:w-10"
        aria-hidden
      />
    ) : (
      <span
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] sm:h-9 sm:w-9"
        aria-hidden
      />
    );
  }

  const effectiveDark =
    theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            variant === "embedded"
              ? "inline-flex min-h-[44px] w-11 shrink-0 self-stretch touch-manipulation items-center justify-center rounded-none rounded-r-2xl border-0 bg-[var(--bg-card)]/35 text-[var(--foreground)] transition hover:bg-white/[0.1] hover:text-[var(--accent)] sm:min-h-0 sm:min-h-9 sm:w-10"
              : "inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--foreground)] transition hover:border-[var(--border-glow)] hover:text-[var(--accent)] sm:h-9 sm:w-9",
            variant === "default" && open && "border-[var(--accent)]/40 text-[var(--accent)]",
            variant === "embedded" && open && "bg-[var(--accent)]/[0.09] text-[var(--accent)]"
          )}
          title={s.settingsTitle}
          aria-label={s.settingsAria}
        >
          <Palette
            className="h-[19px] w-[19px] text-[var(--accent)] [filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--accent)_28%,transparent))]"
            strokeWidth={1.65}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(calc(100vw-1.5rem),20rem)] space-y-4 p-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div>
          <Label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {s.theme}
          </Label>
          <div
            className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-[var(--border-subtle)] bg-black/[0.12] p-1 dark:bg-black/20"
            role="group"
            aria-label={s.themeSelectionAria}
          >
            {(
              [
                { id: "light" as const, label: s.themeLight },
                { id: "dark" as const, label: s.themeDark },
                { id: "system" as const, label: s.themeSystem },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                className={cn(
                  "rounded-lg px-2 py-2 text-center text-xs font-medium transition",
                  theme === id
                    ? "bg-[var(--accent)]/18 text-[var(--accent)] ring-1 ring-[var(--accent)]/35"
                    : "text-[var(--muted)] hover:bg-white/[0.06] hover:text-[var(--foreground)]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {theme === "system" ? (
            <p className="mt-1.5 text-[10px] leading-snug text-[var(--muted)]">
              {s.themeSystemHint.replace(
                "{mode}",
                effectiveDark ? s.themeModeDark : s.themeModeLight
              )}
            </p>
          ) : null}
        </div>

        <div>
          <Label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {s.language}
          </Label>
          <div
            className="mt-2 grid grid-cols-2 gap-1 rounded-xl border border-[var(--border-subtle)] bg-black/[0.12] p-1 dark:bg-black/20"
            role="group"
            aria-label={s.languageSelectionAria}
          >
            <button
              type="button"
              onClick={() => {
                setLocale("tr");
              }}
              className={cn(
                "rounded-lg px-2 py-2 text-center text-xs font-medium transition",
                locale === "tr"
                  ? "bg-[var(--accent)]/18 text-[var(--accent)] ring-1 ring-[var(--accent)]/35"
                  : "text-[var(--muted)] hover:bg-white/[0.06] hover:text-[var(--foreground)]"
              )}
            >
              {s.langTr}
            </button>
            <button
              type="button"
              onClick={() => {
                setLocale("en");
              }}
              className={cn(
                "rounded-lg px-2 py-2 text-center text-xs font-medium transition",
                locale === "en"
                  ? "bg-[var(--accent)]/18 text-[var(--accent)] ring-1 ring-[var(--accent)]/35"
                  : "text-[var(--muted)] hover:bg-white/[0.06] hover:text-[var(--foreground)]"
              )}
            >
              {s.langEn}
            </button>
          </div>
          <p className="mt-1.5 text-[10px] leading-snug text-[var(--muted)]">
            {s.langFootnote}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
