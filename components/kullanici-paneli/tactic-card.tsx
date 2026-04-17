"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock3, Share2, Trash2 } from "lucide-react";

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

function toRelativeTime(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: tr,
  });
}

function toStaticDate(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return format(date, "d MMMM yyyy", { locale: tr });
}

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const updatedText = useMemo(() => toRelativeTime(updatedAt ?? createdAt), [updatedAt, createdAt]);
  const createdStaticText = useMemo(() => toStaticDate(createdAt), [createdAt]);
  const matchupText = useMemo(() => {
    const home = homeTeamName?.trim();
    const away = awayTeamName?.trim();
    if (home && away) return `${home} vs ${away}`;
    if (home) return home;
    if (away) return away;
    return null;
  }, [homeTeamName, awayTeamName]);

  return (
    <article className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--accent)]/60 hover:shadow-[0_10px_30px_-18px_var(--accent)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight text-white/95">
            {name || "İsimsiz Taktik"}
          </h3>
          {matchupText ? (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="truncate">{homeTeamName?.trim() || "-"}</span>
              <span className="rounded px-1 py-0.5 text-[10px] font-medium text-white/45">vs</span>
              <span className="truncate">{awayTeamName?.trim() || "-"}</span>
            </div>
          ) : null}
          <p
            className="mt-1 flex items-center gap-1.5 text-[11px] font-mono tabular-nums text-white/40"
            title={createdStaticText ? `Oluşturulma: ${createdStaticText}` : "Oluşturulma tarihi bilinmiyor"}
          >
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-white/35" />
            <span>{mounted ? updatedText ?? "-" : "-"}</span>
          </p>
          <span className="mt-2 inline-flex items-center rounded-md border border-emerald-400/50 bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-100">
            {format}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Paylaşım panelini aç"
            aria-label="Paylaşım panelini aç"
            onClick={() => onShare?.(id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--muted)] transition hover:border-emerald-400/40 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(id)}
            disabled={deleting}
            aria-label="Taktiği sil"
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
          Düzenle
        </Link>
      </div>
    </article>
  );
}
