"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Trash2 } from "lucide-react";

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
          <h3 className="truncate text-sm font-semibold text-[var(--foreground)]">{name || "İsimsiz Taktik"}</h3>
          {matchupText ? <p className="mt-1 text-xs text-[var(--muted)]">{matchupText}</p> : null}
          <p
            className="mt-1 text-[11px] text-[var(--muted)]"
            title={createdStaticText ? `Oluşturulma: ${createdStaticText}` : "Oluşturulma tarihi bilinmiyor"}
          >
            Son düzenleme: {mounted ? `${updatedText ?? "-"} düzenlendi` : "-"}
          </p>
          <span className="mt-2 inline-flex items-center rounded-md border border-emerald-400/50 bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-100">
            {format}
          </span>
        </div>

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
