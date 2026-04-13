"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listLocalTactics, type StoredTactic } from "@/lib/local-tactics";

export function ClientTactics() {
  const [items, setItems] = useState<StoredTactic[]>([]);

  useEffect(() => {
    setItems(listLocalTactics());
  }, []);

  if (items.length === 0) {
    return (
      <section className="mt-16 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 text-center backdrop-blur-sm">
        <p
          className="text-sm text-[var(--muted)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Henüz kayıtlı taktik yok. Editörde bir diziliş kaydettiğinde burada
          listelenecek — tamamen bu tarayıcıda saklanır.
        </p>
        <Link
          href="/editor"
          className="mt-4 inline-block text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          İlk taktikini oluştur →
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kayıtlı taktikler
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Bu cihazdaki kayıtlar — paylaşım linki aynı makinede açılır.
          </p>
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((t) => (
          <li key={t.id}>
            <Link
              href={`/editor?id=${encodeURIComponent(t.id)}`}
              className="group flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 transition hover:border-[var(--border-glow)] hover:bg-[var(--bg-elevated)]/80"
            >
              <span
                className="font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.title}
              </span>
              <span className="mt-1 font-mono text-xs text-[var(--muted)]">
                /t/{t.share_id}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
