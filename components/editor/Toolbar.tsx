"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Link2, Loader2, Save } from "lucide-react";

export interface ToolbarProps {
  tacticTitle: string;
  onTacticTitleChange: (t: string) => void;
  onSave: () => void;
  onExport: () => void;
  onCopyShare: () => void;
  saving: boolean;
  /** Link üretildi (yükleme beklenmiyor) */
  shareReady: boolean;
  message: string | null;
}

export function Toolbar({
  tacticTitle,
  onTacticTitleChange,
  onSave,
  onExport,
  onCopyShare,
  saving,
  shareReady,
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

      {message && (
        <p className="text-sm text-green-400" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
