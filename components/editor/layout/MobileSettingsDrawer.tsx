"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { EditorSidebar, type EditorSidebarProps } from "../EditorSidebar";

export interface MobileSettingsDrawerProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  sidebarProps: EditorSidebarProps;
}

export function MobileSettingsDrawer({
  open,
  onToggle,
  onClose,
  sidebarProps,
}: MobileSettingsDrawerProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
          aria-label="Editör panelini kapat"
          onClick={onClose}
        />
      )}

      <aside
        id="editor-settings-drawer"
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(100vw-1rem,22rem)] max-w-[calc(100vw-0.5rem)] flex-col border-l border-white/10 bg-[var(--card)]/95 shadow-[-12px_0_40px_-20px_rgba(0,0,0,0.85)] backdrop-blur transition-transform duration-200 ease-out pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="relative flex shrink-0 items-center justify-center border-b border-white/10 px-10 py-3">
          <h2
            className="text-center text-sm font-semibold tracking-[0.14em] text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            EDİTÖR
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute right-2 top-1/2 h-9 w-9 shrink-0 -translate-y-1/2 p-0"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          <EditorSidebar {...sidebarProps} embeddedInDrawer />
        </div>
      </aside>

      <Button
        type="button"
        size="lg"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 h-14 w-14 rounded-full p-0 shadow-lg touch-manipulation"
        style={{ right: "max(1rem, env(safe-area-inset-right, 0px))" }}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="editor-settings-drawer"
        title="Takım ve taktik ayarları"
      >
        <SlidersHorizontal className="h-6 w-6" aria-hidden />
      </Button>
    </>
  );
}
