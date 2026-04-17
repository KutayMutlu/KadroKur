"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Facebook, Link2, Loader2, MessageCircle, Share2, Twitter } from "lucide-react";
import type Konva from "konva";
import { TacticCard } from "@/components/kullanici-paneli/tactic-card";
import { Modal } from "@/components/ui/modal";
import { ShareSheet } from "@/components/ui/share-sheet";
import { Toast } from "@/components/ui/toast";
import { PitchCanvas, type PitchCanvasHandle } from "@/components/editor/PitchCanvas";
import { exportStageToPng } from "@/lib/canvas-export";
import type { CanvasState } from "@/types/tactic";
import { useRef } from "react";

type TacticRow = {
  id: string;
  title: string;
  share_id: string;
  is_public: boolean;
  canvas_state: unknown;
  home_team_name: string;
  away_team_name: string;
  formation_key: string;
  updated_at: string;
  created_at: string;
};

function sanitizeFileName(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "taktik";
  return normalized
    .replace(/[^a-z0-9\u00c0-\u024f\u1e00-\u1eff\s-]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    promise.finally(() => window.clearTimeout(timer)).then(resolve).catch(reject);
  });
}

async function stageToPngBlob(stage: Konva.Stage): Promise<Blob> {
  const dataUrl = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
  if (!dataUrl || dataUrl === "data:,") {
    throw new Error("empty_stage_data_url");
  }
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  if (!blob || blob.size === 0) throw new Error("empty_stage_blob");
  return blob;
}

export function TacticsGrid({ tactics }: { tactics: TacticRow[] }) {
  const router = useRouter();
  const shareStageRef = useRef<PitchCanvasHandle>(null);
  const [items, setItems] = useState<TacticRow[]>(tactics);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "destructive">("success");
  const [selectedTacticForShare, setSelectedTacticForShare] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);

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
  const shareTactic = useMemo(
    () => items.find((item) => item.id === selectedTacticForShare) ?? null,
    [items, selectedTacticForShare]
  );
  const shareDisabled = !shareTactic?.share_id || !shareTactic?.is_public;
  const shareDisabledTitle = "Önce taktiği herkese açık yapmalısın";
  const shareUrl = useMemo(() => {
    if (!shareTactic?.share_id || typeof window === "undefined") return "";
    return `${window.location.origin}/view/${shareTactic.share_id}`;
  }, [shareTactic?.share_id]);

  const showToast = (message: string, variant: "success" | "destructive" = "success") => {
    setToastVariant(variant);
    setToastMessage(message);
  };

  const buildPngBlob = async (tactic: TacticRow) => {
    const canvasState = tactic.canvas_state as CanvasState | null;
    if (!canvasState) throw new Error("missing_canvas_state");

    const getStage = async () => {
      // ShareSheet açıldıktan sonra gizli stage'in mount olması için kısa bekleme.
      for (let i = 0; i < 8; i += 1) {
        const stage = shareStageRef.current?.getStage();
        if (stage) return stage;
        await new Promise((resolve) => window.requestAnimationFrame(resolve));
      }
      throw new Error("share_stage_not_ready");
    };

    const stage = await withTimeout(getStage(), 5000, "share_stage_timeout");
    return stageToPngBlob(stage);
  };

  const handleCopyLink = async () => {
    if (!shareUrl || shareDisabled) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Bağlantı kopyalandı!", "success");
    } catch {
      showToast("Bağlantı kopyalanamadı. Lütfen tekrar deneyin.", "destructive");
    }
  };

  const handleShareImage = async () => {
    if (!shareTactic || shareDisabled) return;
    setShareLoading(true);
    try {
      const blob = await buildPngBlob(shareTactic);
      const filename = `${sanitizeFileName(shareTactic.title || "taktik")}.png`;
      const file = new File([blob], filename, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: shareTactic.title || "Taktik Görseli" });
      } else {
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(blobUrl);
      }

      showToast("Taktik görseli hazırlandı.", "success");
      setSelectedTacticForShare(null);
    } catch {
      showToast("Görsel oluşturulamadı", "destructive");
    } finally {
      setShareLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!shareTactic || shareDisabled) return;
    setShareLoading(true);
    try {
      const getStage = async () => {
        for (let i = 0; i < 8; i += 1) {
          const stage = shareStageRef.current?.getStage();
          if (stage) return stage;
          await new Promise((resolve) => window.requestAnimationFrame(resolve));
        }
        throw new Error("share_stage_not_ready");
      };
      const stage = await withTimeout(getStage(), 5000, "share_stage_timeout");
      const safe = (shareTactic.title || "taktik").replace(/[^\w\-]+/g, "_");
      exportStageToPng(stage, `${safe}.png`);
      showToast("Görsel indirildi.", "success");
    } catch {
      showToast("Görsel oluşturulamadı", "destructive");
    } finally {
      setShareLoading(false);
    }
  };

  const openSocialShare = (platform: "whatsapp" | "x" | "facebook") => {
    if (!shareTactic || shareDisabled || !shareUrl) return;
    const encoded = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`${shareTactic.title || "Taktik"} - KadroKur`);
    const map = {
      whatsapp: `https://wa.me/?text=${text}%20${encoded}`,
      x: `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    };
    window.open(map[platform], "_blank", "noopener,noreferrer");
  };

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
            onShare={setSelectedTacticForShare}
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

      {shareTactic ? (
      <div className="pointer-events-none fixed -left-[9999px] top-0 h-[560px] w-[760px] opacity-0">
        <PitchCanvas
          ref={shareStageRef}
          players={(shareTactic.canvas_state as CanvasState)?.players ?? []}
          activePlayerId={null}
          attackFlip={Boolean((shareTactic.canvas_state as CanvasState)?.attack_flip)}
          homeTeamName={(shareTactic.canvas_state as CanvasState)?.teamName}
          opponentTeamName={(shareTactic.canvas_state as CanvasState)?.opponentTeamName}
          onPlayerMove={() => {}}
          interactive={false}
        />
      </div>
      ) : null}

      {shareTactic ? (
      <ShareSheet
        open={true}
        onOpenChange={(open) => {
          if (!open) setSelectedTacticForShare(null);
        }}
        title="Paylaş"
      >
        <div className="rounded-xl border border-[var(--border-subtle)] bg-slate-950/70 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleShareImage}
              disabled={shareDisabled || shareLoading}
              title={shareDisabled ? shareDisabledTitle : undefined}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {shareLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
              Görseli Paylaş / Kaydet
            </button>
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={shareDisabled || shareLoading}
              title={shareDisabled ? shareDisabledTitle : undefined}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-slate-800/80 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-400/45 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Görseli İndir
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, onClick: () => openSocialShare("whatsapp") },
            { id: "x", label: "X", icon: Twitter, onClick: () => openSocialShare("x") },
            { id: "facebook", label: "Facebook", icon: Facebook, onClick: () => openSocialShare("facebook") },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={shareDisabled}
              title={shareDisabled ? shareDisabledTitle : item.label}
              onClick={item.onClick}
              className="rounded-xl border border-[var(--border-subtle)] bg-slate-950/70 px-2 py-3 text-slate-200 transition hover:border-emerald-400/45 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <item.icon className="mx-auto h-5 w-5" />
              <span className="mt-1 block text-[11px] text-slate-300">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-slate-950/70 p-2">
          <div className="flex items-center gap-2">
            <div className="flex h-[40px] w-full min-h-10 flex-1 items-center rounded-lg border border-[var(--border-subtle)] bg-slate-900/90 px-3 text-xs text-slate-200">
              <Link2 className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{shareUrl || "Paylaşım linki yok"}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={shareDisabled}
              title={shareDisabled ? shareDisabledTitle : "Bağlantıyı kopyala"}
              className="inline-flex h-[40px] min-h-10 items-center justify-center rounded-lg border border-emerald-400/50 bg-emerald-500/25 px-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Kopyala
            </button>
          </div>
        </div>
      </ShareSheet>
      ) : null}

      {toastMessage ? <Toast message={toastMessage} variant={toastVariant} /> : null}
    </div>
  );
}
