"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";
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
  const { strings: ui } = useLocale();
  return (
    <header
      className="sticky top-0 z-30 -mx-3 mb-2 shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/92 px-3 pb-2.5 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-md sm:-mx-4 sm:mb-3 sm:px-4 sm:pb-3"
      role="banner"
    >
      <h1 className="sr-only">{ui.editorSrTitle}</h1>

      {/*
        Mobil: iki satır — logo|hesap üstte, taktik rozeti altta tam genişlik (dar ekranda sıkışmayı önler).
        lg+: tek satır — logo | rozet (orta) | geri al + hesap
      */}
      <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
        <div className="flex min-w-0 items-center justify-between gap-2 lg:contents">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
            aria-label={ui.editorHomeAria}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border-glow)] bg-[var(--bg-card)] text-sm font-bold text-[var(--accent)] sm:h-9 sm:w-9 sm:text-base"
              style={{ fontFamily: "var(--font-display)" }}
              aria-hidden
            >
              KK
            </span>
            <div className="hidden min-w-0 text-left leading-tight sm:block">
              <p
                className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                KadroKur
              </p>
              <p className="mt-0.5 text-[10px] text-[var(--muted)] sm:text-[11px]">
                {ui.editorBrandSubtitle}
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:order-3">
          {showUndoRedoInHeader ? (
            <div
              className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-black/[0.12] p-0.5 dark:bg-black/25"
              role="group"
              aria-label={ui.editorUndoRedoAria}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-8 w-8 p-0 text-[var(--foreground)] hover:bg-white/10 disabled:opacity-35"
                title={ui.editorUndoTitle}
                aria-label={ui.editorUndoAria}
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
                title={ui.editorRedoTitle}
                aria-label={ui.editorRedoAria}
              >
                <Redo2 className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          ) : null}
            <AuthControls />
          </div>
        </div>

        <div className="flex w-full min-w-0 justify-center px-0 sm:px-2 lg:flex-1 lg:order-2">
          <EditorHeaderPitchBar tacticTitle={tacticTitle} />
        </div>
      </div>
    </header>
  );
}
