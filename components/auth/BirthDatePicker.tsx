"use client";

import { DayPickerRadixDropdown } from "@/components/auth/DayPickerDropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isAfter, parseISO, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useMemo, useState } from "react";

import "react-day-picker/style.css";

export type BirthDatePickerProps = {
  value: string;
  onChange: (isoDate: string) => void;
  invalid?: boolean;
  /** Mobil modal (açık arka plan) veya masaüstü koyu panel */
  variant: "mobile" | "desktop";
  id?: string;
  "aria-label"?: string;
  /** Tarih seçilmediğinde tetikleyicide gösterilen metin (örn. zorunlu * ile) */
  emptyPlaceholder?: string;
};

function parseValue(iso: string): Date | undefined {
  if (!iso.trim()) return undefined;
  try {
    const d = parseISO(iso);
    return Number.isNaN(d.getTime()) ? undefined : d;
  } catch {
    return undefined;
  }
}

export function BirthDatePicker({
  value,
  onChange,
  invalid = false,
  variant,
  id,
  "aria-label": ariaLabel = "Doğum tarihi",
  emptyPlaceholder = "Doğum tarihi seçin",
}: BirthDatePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => parseValue(value), [value]);

  const todayStart = useMemo(() => startOfDay(new Date()), []);

  const displayLabel = useMemo(() => {
    if (!selected) return emptyPlaceholder;
    return format(selected, "d MMMM yyyy", { locale: tr });
  }, [selected, emptyPlaceholder]);

  const triggerClass =
    variant === "mobile"
      ? invalid
        ? "w-full rounded-lg border border-red-500 bg-red-950/25 px-3 py-2 text-left text-sm text-[var(--foreground)] outline-none ring-2 ring-red-500/45 transition focus:ring-2 focus:ring-red-500/55"
        : "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-left text-sm text-[var(--foreground)] outline-none ring-[var(--accent)]/50 transition focus:ring-2 focus:ring-[var(--accent)]/50"
      : invalid
        ? "w-full rounded-lg border border-red-500 bg-red-950/30 px-3 py-2 text-left text-sm text-white outline-none ring-2 ring-red-500/45 transition focus:ring-2 focus:ring-red-500/55"
        : "w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-left text-sm text-white outline-none ring-[var(--accent)]/50 transition focus:ring-2 focus:ring-[var(--accent)]/50";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          aria-label={ariaLabel}
          data-invalid={invalid || undefined}
          aria-haspopup="dialog"
          className={cn(
            "flex min-h-[2.5rem] w-full items-center justify-between gap-2 font-[family-name:var(--font-body)]",
            triggerClass,
            !selected && variant === "mobile" && "text-[var(--muted)]",
            !selected && variant === "desktop" && "text-white/60"
          )}
        >
          <span className={cn("min-w-0 flex-1 truncate", selected ? "" : "text-[var(--muted)]")}>{displayLabel}</span>
          <CalendarDays
            className={cn(
              "h-4 w-4 shrink-0 opacity-80",
              variant === "desktop" ? "text-[var(--accent)]" : "text-[var(--accent-dim)]"
            )}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-0 shadow-lg",
          variant === "mobile"
            ? "w-max max-w-[min(17.25rem,calc(100vw-1.25rem))]"
            : "w-max max-w-[min(20rem,calc(100vw-2rem))]"
        )}
        align="start"
        side="bottom"
        sideOffset={variant === "mobile" ? 6 : 8}
        collisionPadding={variant === "mobile" ? 8 : 12}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div
          className={cn(
            "border-b border-[var(--border-subtle)]",
            variant === "mobile" ? "px-2 py-1.5" : "px-3 py-2"
          )}
        >
          <p
            className={cn(
              "font-medium uppercase tracking-wider text-[var(--muted)]",
              variant === "mobile" ? "text-[10px]" : "text-[11px]"
            )}
          >
            Doğum tarihi
          </p>
        </div>
        <div className={variant === "mobile" ? "p-1.5" : "p-2"}>
          <DayPicker
            mode="single"
            locale={tr}
            weekStartsOn={1}
            captionLayout="dropdown"
            hideNavigation
            fromYear={1920}
            toYear={new Date().getFullYear()}
            selected={selected}
            defaultMonth={selected ?? todayStart}
            disabled={(date) => isAfter(startOfDay(date), todayStart)}
            onSelect={(d) => {
              if (!d) return;
              onChange(format(d, "yyyy-MM-dd"));
              setOpen(false);
            }}
            className={cn("kadrokur-rdp", variant === "mobile" && "kadrokur-rdp--compact")}
            components={{
              Dropdown: DayPickerRadixDropdown,
            }}
            classNames={{
              /* Varsayılan rdp-* sınıflarını koru; classNames tamamen üzerine yazıyor — tablo düzeni için tr’de flex kullanma */
              months: "rdp-months flex flex-col gap-2",
              month: "rdp-month space-y-2",
              month_grid: cn(
                "rdp-month_grid w-full table-fixed",
                variant === "mobile" ? "min-w-0 max-w-full" : "min-w-[min(100%,20.5rem)]"
              ),
              month_caption: cn(
                "rdp-month_caption flex items-center justify-center px-1",
                variant === "mobile" ? "min-h-8" : "min-h-9"
              ),
              caption_label: "rdp-caption_label hidden",
              dropdowns: cn(
                "rdp-dropdowns relative z-10 flex w-full flex-wrap items-center justify-center font-medium text-[var(--foreground)]",
                variant === "mobile" ? "gap-1.5 text-xs" : "gap-2 text-sm"
              ),
              dropdown:
                "rdp-dropdown max-w-[min(100%,11rem)] rounded-md border-0 bg-transparent p-0 text-sm text-[var(--foreground)]",
              weekday: cn(
                "rdp-weekday font-medium uppercase tracking-wide text-[var(--foreground)] opacity-80",
                variant === "mobile" ? "text-[10px]" : "text-[11px]"
              ),
              day: cn("rdp-day p-0 text-center align-middle", variant === "mobile" ? "text-xs" : "text-sm"),
              day_button:
                "rdp-day_button mx-auto font-normal text-[var(--foreground)] transition-[background-color,box-shadow,transform] duration-150 ease-out will-change-transform enabled:hover:z-[1] enabled:hover:-translate-y-px enabled:hover:bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] enabled:hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_45%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 disabled:cursor-not-allowed",
            }}
          />
        </div>
        <div
          className={cn(
            "flex items-center justify-between gap-2 border-t border-[var(--border-subtle)]",
            variant === "mobile" ? "px-2 py-1.5" : "px-2 py-2"
          )}
        >
          <button
            type="button"
            className="rounded-md px-2 py-1.5 text-xs text-[var(--muted)] transition hover:bg-white/10 hover:text-[var(--foreground)]"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            Temizle
          </button>
          <button
            type="button"
            className="rounded-md px-2 py-1.5 text-xs font-medium text-[var(--accent)] transition hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            Tamam
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
