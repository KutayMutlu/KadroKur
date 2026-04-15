"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthControls } from "@/components/auth/AuthControls";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, Redo2, Undo2 } from "lucide-react";

export interface EditorHeaderProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function EditorHeader({ canUndo, canRedo, onUndo, onRedo }: EditorHeaderProps) {
  return (
    <header className="mb-4 shrink-0 min-w-0 space-y-2 sm:mb-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Button
          asChild
          variant="secondary"
          className="h-9 w-9 shrink-0 p-0"
          title="Ana sayfa"
        >
          <Link href="/" aria-label="Ana sayfaya dön">
            <Home className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
        <h1
          className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight sm:text-2xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Taktik editörü
        </h1>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-9 w-9 p-0 touch-manipulation"
            title="Geri al (Ctrl/Cmd+Z)"
            aria-label="Geri al"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-9 w-9 p-0 touch-manipulation"
            title="Yinele (Ctrl/Cmd+Shift+Z)"
            aria-label="Yinele"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <AuthControls guestCompanion={<ThemeToggle />} />
        </div>
      </div>
      <p className="line-clamp-2 text-[11px] leading-snug text-[var(--muted)] sm:text-sm sm:leading-normal">
        Halı saha dizilişi — sürükleyin, kaydedin, paylaşın.
      </p>
    </header>
  );
}
