"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Download, Link2, Loader2, Save } from "lucide-react";

export interface ToolbarProps {
  tacticTitle: string;
  onTacticTitleChange: (t: string) => void;
  onSave: () => void;
  onExport: () => void;
  onCopyShare: () => void;
  saving: boolean;
  canCopyShare: boolean;
  copyBlockedMessage: string;
  message: string | null;
  messageTone: "success" | "warning";
  /** EditorSection içinde kullanım — dış çerçeve yok */
  embedded?: boolean;
}

export function Toolbar({
  tacticTitle,
  onTacticTitleChange,
  onSave,
  onExport,
  onCopyShare,
  saving,
  canCopyShare,
  copyBlockedMessage,
  message,
  messageTone,
  embedded = false,
}: ToolbarProps) {
  return (
    <div className={embedded ? "flex flex-col gap-3" : "flex flex-col gap-3 rounded-xl border border-white/10 bg-black/10 p-3"}>
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
          <Button
            type="button"
            variant="secondary"
            onClick={onExport}
            className="min-h-[44px] w-full touch-manipulation sm:min-h-0"
          >
            <Download className="h-4 w-4" />
            PNG indir
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCopyShare}
            aria-disabled={!canCopyShare}
            className={`min-h-[44px] w-full touch-manipulation sm:min-h-0 ${
              canCopyShare ? "" : "opacity-50"
            }`}
            title={
              canCopyShare
                ? "Tam paylaşım URL’sini panoya kopyala"
                : copyBlockedMessage
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
          className="min-h-[48px] w-full touch-manipulation bg-green-800 text-white hover:bg-lime-600 sm:min-h-0"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Kaydet
        </Button>
      </div>

      {message ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "flex items-start gap-2.5 rounded-2xl border px-3 py-2.5 text-left shadow-[0_12px_40px_-28px_rgba(0,0,0,0.65)] backdrop-blur-sm animate-in fade-in slide-in-from-bottom-1 duration-200",
            messageTone === "success" &&
              "border-[var(--accent)]/40 bg-[var(--bg-elevated)]/95 text-[var(--foreground)] ring-1 ring-[var(--accent)]/12",
            messageTone === "warning" &&
              "border-amber-500/45 bg-amber-500/[0.11] text-[var(--foreground)] ring-1 ring-amber-500/18 dark:bg-amber-950/45 dark:text-amber-50 dark:ring-amber-500/22"
          )}
        >
          {messageTone === "success" ? (
            <CheckCircle2
              className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[var(--accent)]"
              strokeWidth={2}
              aria-hidden
            />
          ) : (
            <AlertTriangle
              className="mt-0.5 h-[18px] w-[18px] shrink-0 text-amber-600 dark:text-amber-300"
              strokeWidth={2}
              aria-hidden
            />
          )}
          <span className="min-w-0 flex-1 text-[13px] font-medium leading-snug">{message}</span>
        </div>
      ) : null}
    </div>
  );
}
