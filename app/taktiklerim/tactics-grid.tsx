"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TacticCard } from "@/components/kullanici-paneli/tactic-card";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";

type TacticRow = {
  id: string;
  title: string;
  home_team_name: string;
  away_team_name: string;
  formation_key: string;
  updated_at: string;
  created_at: string;
};

export function TacticsGrid({ tactics }: { tactics: TacticRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState<TacticRow[]>(tactics);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "destructive">("success");

  useEffect(() => {
    setItems(tactics);
  }, [tactics]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => {
      setToastMessage(null);
      setToastVariant("success");
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const selectedTactic = useMemo(
    () => items.find((item) => item.id === confirmDeleteId) ?? null,
    [confirmDeleteId, items]
  );

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteError(null);
    setDeletingId(confirmDeleteId);
    try {
      const response = await fetch("/taktiklerim/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: confirmDeleteId }),
      });

      if (response.status === 403) {
        setToastVariant("destructive");
        setToastMessage("Yetki Hatası: Bu taktik hesabınıza bağlı olmadığı için silinemedi.");
        setConfirmDeleteId(null);
        return;
      }

      if (!response.ok) {
        throw new Error("delete_failed");
      }

      setItems((prev) => prev.filter((item) => item.id !== confirmDeleteId));
      setToastVariant("success");
      setToastMessage("Başarıyla Silindi");
      setConfirmDeleteId(null);
      router.refresh();
    } catch {
      setDeleteError("Taktik silinirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {deleteError ? (
        <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {deleteError}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((tactic) => (
          <TacticCard
            key={tactic.id}
            id={tactic.id}
            name={tactic.title}
            homeTeamName={tactic.home_team_name}
            awayTeamName={tactic.away_team_name}
            createdAt={tactic.created_at || tactic.updated_at}
            updatedAt={tactic.updated_at}
            format={tactic.formation_key}
            editHref={`/editor?id=${encodeURIComponent(tactic.id)}`}
            onDelete={setConfirmDeleteId}
            deleting={deletingId === tactic.id}
          />
        ))}
      </div>

      <Modal
        open={Boolean(confirmDeleteId)}
        onClose={() => {
          if (!deletingId) setConfirmDeleteId(null);
        }}
        title="Taktiği Sil"
        description={`${
          selectedTactic?.title || "Bu taktik"
        } kalıcı olarak silinecek. Bu işlemi geri alamazsın.`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setConfirmDeleteId(null)}
              disabled={Boolean(deletingId)}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]/35 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={Boolean(deletingId)}
              className="rounded-lg border border-rose-400/40 bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingId ? "Siliniyor..." : "Taktiği Sil"}
            </button>
          </>
        }
      />

      {toastMessage ? <Toast message={toastMessage} variant={toastVariant} /> : null}
    </div>
  );
}
