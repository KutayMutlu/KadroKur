"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { Download, Link2, Loader2, Share2 } from "lucide-react";
import type Konva from "konva";
import { TacticCard } from "@/components/kullanici-paneli/tactic-card";
import { Modal } from "@/components/ui/modal";
import { ShareSheet } from "@/components/ui/share-sheet";
import { Toast } from "@/components/ui/toast";
import { PitchCanvas, type PitchCanvasHandle } from "@/components/editor/PitchCanvas";
import { exportStageToPng } from "@/lib/canvas-export";
import { shareHttpUrl } from "@/lib/share-web-url";
import type { CanvasState } from "@/types/tactic";
import { useRef } from "react";

export type TacticRow = {
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

function sanitizeFileName(value: string, fallback: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return fallback;
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

function downloadBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function TacticsGrid({ tactics }: { tactics: TacticRow[] }) {
  const { strings: ui } = useLocale();
  const router = useRouter();
  const exportStageRef = useRef<PitchCanvasHandle>(null);
  const [items, setItems] = useState<TacticRow[]>(tactics);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "destructive">("success");
  const [selectedTacticForShare, setSelectedTacticForShare] = useState<string | null>(null);
  /** Yeşil buton: görsel üretilirken + paylaşım API çağrısı bitene kadar */
  const [shareImageLoading, setShareImageLoading] = useState(false);
  /** İndir: sanal sahne mount + export */
  const [isDownloading, setIsDownloading] = useState(false);

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
  const shareDisabledTitle = ui.myTacticsShareNeedPublic;
  const shareUrl = useMemo(() => {
    if (!shareTactic?.share_id || typeof window === "undefined") return "";
    return `${window.location.origin}/view/${shareTactic.share_id}`;
  }, [shareTactic?.share_id]);

  const showToast = (message: string, variant: "success" | "destructive" = "success") => {
    setToastVariant(variant);
    setToastMessage(message);
  };

  /** Editör ile aynı 1473×740 / scale 1 sanal sahne üzerinden stage al */
  const getExportStage = async () => {
    const getStage = async () => {
      for (let i = 0; i < 24; i += 1) {
        const stage = exportStageRef.current?.getStage();
        if (stage) return stage;
        await new Promise((resolve) => window.requestAnimationFrame(resolve));
      }
      throw new Error("export_stage_not_ready");
    };
    return withTimeout(getStage(), 8000, "export_stage_timeout");
  };

  const handleCopyLink = async () => {
    if (!shareUrl || shareDisabled) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast(ui.myTacticsCopySuccess, "success");
    } catch {
      showToast(ui.myTacticsCopyFail, "destructive");
    }
  };

  const handleShareLink = async () => {
    if (!shareUrl || shareDisabled) return;
    const result = await shareHttpUrl(shareUrl, {
      title: ui.editorPersistenceShareTitle,
      text: ui.editorPersistenceShareText,
    });
    if (result === "shared") {
      showToast(ui.myTacticsShareSuccessToast, "success");
      return;
    }
    if (result === "cancelled") return;
    await handleCopyLink();
  };

  const handleShareImage = async () => {
    if (!shareTactic || shareDisabled) return;
    const canvasState = shareTactic.canvas_state as CanvasState | null;
    if (!canvasState) {
      showToast(ui.myTacticsNoCanvasData, "destructive");
      return;
    }

    setShareImageLoading(true);
    try {
      // Sanal canvas mount + Konva draw döngüsü
      await new Promise((resolve) => setTimeout(resolve, 250));
      const stage = await getExportStage();
      const blob = await stageToPngBlob(stage);
      const filename = `${sanitizeFileName(shareTactic.title || "", ui.tacticFilenameFallback)}.png`;
      const file = new File([blob], filename, { type: "image/png" });

      // navigator.share en sonda — önce PNG hazır; görsel + public link birlikte
      if (!shareUrl) {
        throw new Error("missing_share_url");
      }

      const title = ui.myTacticsShareImageTitle;
      const textBody = ui.myTacticsShareImageText;
      const shareData: ShareData = {
        files: [file],
        title,
        text: textBody,
        url: shareUrl,
      };

      /** Çoğu masaüstü tarayıcıda yalnızca mobilde true; dosya yoksa buraya girme */
      const canShareFiles =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFiles && typeof navigator.share === "function") {
        try {
          if (navigator.canShare?.(shareData)) {
            await navigator.share(shareData);
          } else {
            await navigator.share({
              files: [file],
              title,
              text: `${textBody}\n${shareUrl}`,
              url: shareUrl,
            });
          }
          showToast(ui.myTacticsShareMenuOpened, "success");
        } catch (err: unknown) {
          const name = err && typeof err === "object" && "name" in err ? (err as { name?: string }).name : "";
          if (name === "AbortError") {
            return;
          }
          downloadBlobAsFile(blob, filename);
          try {
            await navigator.clipboard.writeText(`${textBody}\n\n${shareUrl}`);
            showToast(ui.myTacticsDownloadedClipboardOk, "success");
          } catch {
            showToast(ui.myTacticsDownloadedCopyLinkHint, "success");
          }
        }
      } else {
        downloadBlobAsFile(blob, filename);
        try {
          await navigator.clipboard.writeText(`${textBody}\n\n${shareUrl}`);
          showToast(ui.myTacticsDownloadedClipboardOk, "success");
        } catch {
          showToast(ui.myTacticsDownloadedCopyLinkHint, "success");
        }
      }
    } catch (err: unknown) {
      const name = err && typeof err === "object" && "name" in err ? (err as { name?: string }).name : "";
      if (name === "AbortError") {
        return;
      }
      showToast(ui.myTacticsImageShareFail, "destructive");
    } finally {
      setShareImageLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!shareTactic || shareDisabled) return;
    try {
      setIsDownloading(true);
      await new Promise((resolve) => setTimeout(resolve, 250));
      const stage = await getExportStage();
      const safe = (shareTactic.title || ui.tacticFilenameFallback).replace(/[^\w\-]+/g, "_");
      const result = await exportStageToPng(stage, `${safe}.png`, { pixelRatio: 2 });
      if (result === "shared") {
        showToast(ui.myTacticsPngGallery, "success");
      } else if (result === "downloaded") {
        showToast(ui.myTacticsPngDownloaded, "success");
      }
    } catch {
      showToast(ui.myTacticsPngFail, "destructive");
    } finally {
      setIsDownloading(false);
    }
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
        setToastMessage(ui.myTacticsDeleteForbidden);
        setConfirmDeleteId(null);
        return;
      }

      if (!response.ok) {
        throw new Error("delete_failed");
      }

      setItems((prev) => prev.filter((item) => item.id !== confirmDeleteId));
      setToastVariant("success");
      setToastMessage(ui.myTacticsDeleted);
      setConfirmDeleteId(null);
      router.refresh();
    } catch {
      setDeleteError(ui.myTacticsDeleteError);
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
        title={ui.myTacticsDeleteModalTitle}
        description={`${selectedTactic?.title || ui.myTacticsDeleteModalFallbackName} ${ui.myTacticsDeleteModalDesc}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setConfirmDeleteId(null)}
              disabled={Boolean(deletingId)}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]/35 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {ui.myTacticsCancel}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={Boolean(deletingId)}
              className="rounded-lg border border-rose-400/40 bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingId ? ui.myTacticsDeleting : ui.myTacticsDeleteConfirm}
            </button>
          </>
        }
      />

      {shareTactic && (shareImageLoading || isDownloading) ? (
        <div className="pointer-events-none fixed -left-[9999px] top-0 h-[740px] w-[1473px] opacity-0">
          <PitchCanvas
            ref={exportStageRef}
            players={(shareTactic.canvas_state as CanvasState)?.players ?? []}
            activePlayerId={null}
            attackFlip={Boolean((shareTactic.canvas_state as CanvasState)?.attack_flip)}
            homeTeamName={(shareTactic.canvas_state as CanvasState)?.teamName}
            opponentTeamName={(shareTactic.canvas_state as CanvasState)?.opponentTeamName}
            onPlayerMove={() => {}}
            interactive={false}
            dimensions={{ width: 1473, height: 740 }}
            scale={1}
          />
        </div>
      ) : null}

      {shareTactic ? (
      <ShareSheet
        open={true}
        onOpenChange={(open) => {
          if (!open) setSelectedTacticForShare(null);
        }}
        title={ui.myTacticsShareSheetTitle}
      >
        <div className="rounded-xl border border-[var(--border-subtle)] bg-slate-950/70 p-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShareImage}
              disabled={shareDisabled || shareImageLoading || isDownloading}
              title={shareDisabled ? shareDisabledTitle : undefined}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-400/45 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {shareImageLoading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : <Share2 className="h-4 w-4 shrink-0" />}
              {shareImageLoading ? ui.myTacticsPreparing : ui.myTacticsShareImageBtn}
            </button>
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={shareDisabled || shareImageLoading || isDownloading}
              title={shareDisabled ? shareDisabledTitle : undefined}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-slate-800/80 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-400/45 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDownloading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : <Download className="h-4 w-4 shrink-0" />}
              {isDownloading ? (
                <>
                  <span className="min-[1367px]:hidden">{ui.myTacticsSaving}</span>
                  <span className="hidden min-[1367px]:inline">{ui.myTacticsDownloading}</span>
                </>
              ) : (
                <>
                  <span className="min-[1367px]:hidden">{ui.myTacticsGallerySave}</span>
                  <span className="hidden min-[1367px]:inline">{ui.myTacticsDownloadImage}</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-slate-950/70 p-2">
          <div className="flex flex-col gap-2 min-[1367px]:flex-row min-[1367px]:items-center">
            <div className="flex h-[40px] w-full min-h-10 flex-1 items-center rounded-lg border border-[var(--border-subtle)] bg-slate-900/90 px-3 text-xs text-slate-200">
              <Link2 className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{shareUrl || ui.myTacticsNoShareLink}</span>
            </div>
            <div className="flex w-full gap-2 min-[1367px]:w-auto min-[1367px]:shrink-0">
              <button
                type="button"
                onClick={handleShareLink}
                disabled={shareDisabled}
                title={shareDisabled ? shareDisabledTitle : ui.myTacticsShareLinkTitle}
                className="inline-flex h-[40px] min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/25 px-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-50 min-[1367px]:hidden"
              >
                <Share2 className="h-4 w-4 shrink-0" aria-hidden />
                {ui.myTacticsShareLinkShort}
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={shareDisabled}
                title={shareDisabled ? shareDisabledTitle : ui.myTacticsCopyClipboardTitle}
                className="inline-flex h-[40px] min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-slate-800/90 px-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400/35 disabled:cursor-not-allowed disabled:opacity-50 min-[1367px]:hidden"
              >
                <Link2 className="h-4 w-4 shrink-0" aria-hidden />
                {ui.myTacticsCopyClipboardShort}
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={shareDisabled}
                title={shareDisabled ? shareDisabledTitle : ui.myTacticsCopyLinkDesktop}
                className="hidden h-[40px] min-h-10 w-full items-center justify-center rounded-lg border border-emerald-400/50 bg-emerald-500/25 px-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-50 min-[1367px]:inline-flex min-[1367px]:w-auto"
              >
                {ui.myTacticsCopyLinkDesktop}
              </button>
            </div>
          </div>
        </div>
        </div>
      </ShareSheet>
      ) : null}

      {toastMessage ? <Toast message={toastMessage} variant={toastVariant} /> : null}
    </div>
  );
}
