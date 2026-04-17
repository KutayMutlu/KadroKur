"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

type ShareSheetProps = {
  open: boolean;
  title?: string;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export function ShareSheet({ open, title = "Paylaş", onOpenChange, children }: ShareSheetProps) {
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.removeAttribute("data-scroll-locked");
    };
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur" />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-[101] max-h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-slate-900/90 p-4 backdrop-blur md:w-[500px]"
        >
          <div className="mb-3 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-white/95">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-slate-800/80 text-slate-200 transition hover:border-emerald-400/50"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
