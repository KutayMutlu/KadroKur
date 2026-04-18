"use client";

import { Button } from "@/components/ui/button";
import { Redo2, Undo2 } from "lucide-react";

type Props = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};

/**
 * Mobil: üst çubuğu şişirmemek için geri al / yinele.
 * Saha solunu boş bırakır; ayar FAB’ı ile aynı sağ kenarda, onun hemen üstünde dikey pill.
 */
export function EditorMobileUndoRedo({ canUndo, canRedo, onUndo, onRedo }: Props) {
  return (
    <div
      className="pointer-events-auto fixed right-4 z-[32] flex w-11 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--card)]/88 shadow-md backdrop-blur-sm lg:hidden"
      style={{
        bottom: "max(5.75rem, calc(env(safe-area-inset-bottom, 0px) + 4.75rem))",
      }}
      role="toolbar"
      aria-label="Geri al ve yinele"
    >
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={!canUndo}
        onClick={onUndo}
        className="h-11 w-11 shrink-0 rounded-none border-0 bg-transparent p-0 text-[var(--foreground)] hover:bg-white/10 disabled:opacity-30"
        title="Geri al"
        aria-label="Geri al"
      >
        <Undo2 className="mx-auto h-[18px] w-[18px]" />
      </Button>
      <span className="h-px w-full shrink-0 bg-white/10" aria-hidden />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={!canRedo}
        onClick={onRedo}
        className="h-11 w-11 shrink-0 rounded-none border-0 bg-transparent p-0 text-[var(--foreground)] hover:bg-white/10 disabled:opacity-30"
        title="Yinele"
        aria-label="Yinele"
      >
        <Redo2 className="mx-auto h-[18px] w-[18px]" />
      </Button>
    </div>
  );
}
