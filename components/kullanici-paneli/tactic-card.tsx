"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format as formatDate, formatDistanceToNow } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import { Clock3, Share2, Trash2 } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

type TacticCardProps = {
  id: string;
  name: string;
  homeTeamName?: string;
  awayTeamName?: string;
  createdAt: string;
  updatedAt?: string;
  format: string;
  editHref: string;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  deleting?: boolean;
};

export function TacticCard({
  id,
  name,
  homeTeamName,
  awayTeamName,
  createdAt,
  updatedAt,
  format,
  editHref,
  onDelete,
  onShare,
  deleting = false,
}: TacticCardProps) {
  const { locale, strings: ui } = useLocale();
  const dfnLocale = locale === "en" ? enUS : tr;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const updatedText = useMemo(() => {
    const date = new Date(updatedAt ?? createdAt);
    if (Number.isNaN(date.getTime())) return null;
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: dfnLocale,
    });
  }, [updatedAt, createdAt, dfnLocale]);

  const createdStaticText = useMemo(() => {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return null;
    return formatDate(date, "d MMMM yyyy", { locale: dfnLocale });
  }, [createdAt, dfnLocale]);

  const matchupText = useMemo(() => {
    const home = homeTeamName?.trim();
    const away = awayTeamName?.trim();
    if (home && away) return `${home} vs ${away}`;
    if (home) return home;
    if (away) return away;
    return null;
  }, [homeTeamName, awayTeamName]);

  const createdTooltip = createdStaticText
    ? ui.tacticCreatedTooltip.replace("{date}", createdStaticText)
    : ui.tacticCreatedUnknown;

  return (
    <article className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--accent)]/60 hover:shadow-[0_10px_30px_-18px_var(--accent)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)]">
            {name || ui.tacticUntitled}
          </h3>
          {matchupText ? (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
              <span className="truncate">{homeTeamName?.trim() || "-"}</span>
              <span className="rounded px-1 py-0.5 text-[10px] font-medium text-[var(--muted)] opacity-80">
                vs
              </span>
              <span className="truncate">{awayTeamName?.trim() || "-"}</span>
            </div>
          ) : null}
          <p
            className="mt-1 flex items-center gap-1.5 text-[11px] font-mono tabular-nums text-[var(--muted)]"
            title={createdTooltip}
          >
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-[var(--muted)] opacity-90" />
            <span>{mounted ? updatedText ?? "-" : "-"}</span>
          </p>
          <span className="mt-2 inline-flex items-center rounded-md border border-[var(--accent)]/45 bg-[var(--accent)]/15 px-2 py-1 text-[11px] font-semibold text-[var(--accent)]">
            {format}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title={ui.tacticShareTitle}
            aria-label={ui.tacticShareAria}
            onClick={() => onShare?.(id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--muted)] transition hover:border-emerald-400/40 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(id)}
            disabled={deleting}
            aria-label={ui.tacticDeleteAria}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--muted)] transition hover:border-rose-400/40 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={editHref}
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--on-accent)] transition hover:brightness-110"
        >
          {ui.tacticEdit}
        </Link>
      </div>
    </article>
  );
}
