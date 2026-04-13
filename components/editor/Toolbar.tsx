"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shareUrl } from "@/lib/share";
import { Download, Link2, Loader2, Save } from "lucide-react";

export interface ToolbarProps {
  tacticTitle: string;
  onTacticTitleChange: (t: string) => void;
  onSave: () => void;
  onExport: () => void;
  onCopyShare: () => void;
  saving: boolean;
  shareId: string | null;
  /** Link üretildi (yükleme beklenmiyor) */
  shareReady: boolean;
  supabaseConfigured: boolean;
  /** En az bir kez Kaydet ile yazıldı — paylaşım linki başka cihazda açılabilir */
  didSaveOnce: boolean;
  message: string | null;
}

export function Toolbar({
  tacticTitle,
  onTacticTitleChange,
  onSave,
  onExport,
  onCopyShare,
  saving,
  shareId,
  shareReady,
  supabaseConfigured,
  didSaveOnce,
  message,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/10 p-3">
      <div className="grid gap-3">
        <div>
          <Label htmlFor="title">Taktik adı</Label>
          <Input
            id="title"
            className="mt-1"
            value={tacticTitle}
            onChange={(e) => onTacticTitleChange(e.target.value)}
            placeholder="Taktik adını giriniz"
          />
        </div>
      </div>

      <div className="grid w-full gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="secondary" onClick={onExport} className="w-full">
            <Download className="h-4 w-4" />
            PNG indir
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCopyShare}
            disabled={!shareReady}
            className="w-full"
            title={
              shareReady
                ? "Tam paylaşım URL’sini panoya kopyala"
                : "Paylaşım linki hazırlanıyor…"
            }
          >
            <Link2 className="h-4 w-4" />
            Linki kopyala
          </Button>
        </div>
        <Button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="w-full bg-green-800 text-white hover:bg-lime-600"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Kaydet
        </Button>
      </div>

      {shareId && (
        <div className="space-y-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-deep)]/50 px-2.5 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Paylaşım linki
          </p>
          <p className="break-all font-mono text-[11px] leading-snug text-[var(--foreground)]">
            {shareUrl(shareId)}
          </p>
          {supabaseConfigured ? (
            didSaveOnce ? (
              <p className="text-[11px] text-emerald-400/90">
                Supabase ile kayıtlı; link başka cihazlarda da açılır.
              </p>
            ) : (
              <p className="text-[11px] text-amber-200/80">
                Başkalarının görmesi için bir kez{" "}
                <span className="font-medium">Kaydet</span>’e basın.
              </p>
            )
          ) : (
            <p className="text-[11px] text-[var(--muted)]">
              Bulutta paylaşım için ortamda{" "}
              <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_*</code>{" "}
              tanımlı olmalı.
            </p>
          )}
        </div>
      )}
      {message && (
        <p className="text-sm text-green-400" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
