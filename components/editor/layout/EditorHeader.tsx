"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthControls } from "@/components/auth/AuthControls";
import { Redo2, Undo2 } from "lucide-react";
import { EditorHeaderPitchBar } from "./EditorHeaderPitchBar";

export interface EditorHeaderProps {
  tacticTitle: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /** false: mobilde geri al / yinele sahada; üst çubuk sade kalır */
  showUndoRedoInHeader?: boolean;
}

export function EditorHeader({
  tacticTitle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  showUndoRedoInHeader = true,
}: EditorHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 -mx-3 mb-2 shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/92 px-3 pb-2.5 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-md sm:-mx-4 sm:mb-3 sm:px-4 sm:pb-3"
      role="banner"
    >
      <h1 className="sr-only">KadroKur taktik editörü</h1>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
          aria-label="Ana sayfaya dön"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border-glow)] bg-[var(--bg-card)] text-sm font-bold text-[var(--accent)] sm:h-9 sm:w-9 sm:text-base"
            style={{ fontFamily: "var(--font-display)" }}
            aria-hidden
          >
            KK
          </span>
          <div className="min-w-0 text-left leading-tight">
            <p
              className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              KadroKur
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--muted)] sm:text-[11px]">Taktik editörü</p>
          </div>
        </Link>

        <div className="min-w-0 flex-1 flex justify-center px-0.5 sm:px-2">
          <EditorHeaderPitchBar tacticTitle={tacticTitle} />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {showUndoRedoInHeader ? (
            <div
              className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-black/[0.12] p-0.5 dark:bg-black/25"
              role="group"
              aria-label="Geri al ve yinele"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-8 w-8 p-0 text-[var(--foreground)] hover:bg-white/10 disabled:opacity-35"
                title="Geri al (Ctrl+Z)"
                aria-label="Geri al"
              >
                <Undo2 className="h-4 w-4" aria-hidden />
              </Button>
              <span className="h-5 w-px shrink-0 bg-[var(--border-subtle)]" aria-hidden />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="h-8 w-8 p-0 text-[var(--foreground)] hover:bg-white/10 disabled:opacity-35"
                title="Yinele (Ctrl+Shift+Z)"
                aria-label="Yinele"
              >
                <Redo2 className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          ) : null}
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
