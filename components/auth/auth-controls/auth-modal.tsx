"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { AuthModalDesktop } from "./auth-modal-desktop";
import { AuthModalMobile } from "./auth-modal-mobile";
import type { AuthModalProps } from "./types";

export function AuthModal(props: AuthModalProps) {
  const { onClose, authMessage, authMessageTone, ...panelProps } = props;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div className="grid min-h-full place-items-center p-3 sm:p-6">
        <div
          className="relative isolate z-[10000] max-h-[min(92vh,900px)] w-[min(calc(100vw-1.5rem),42rem)] overflow-y-auto rounded-2xl border border-white/20 bg-[var(--card)]/95 p-4 shadow-[0_36px_90px_-34px_rgba(0,0,0,0.95)] ring-1 ring-white/10 backdrop-blur-xl sm:w-[min(calc(100vw-2rem),54rem)] sm:p-6 lg:w-[min(calc(100vw-3rem),60rem)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="absolute right-3 top-3 rounded-full p-1.5 text-[var(--muted)] transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>

          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">KadroKur</p>

          <AuthModalMobile {...panelProps} />
          <AuthModalDesktop {...panelProps} />

          {authMessage ? (
            <p className={`mt-4 text-sm ${authMessageTone === "success" ? "text-green-400" : "text-red-400"}`}>
              {authMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
