"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { AuthModalBody } from "./auth-modal-body";
import type { AuthModalProps } from "./types";

export function AuthModal(props: AuthModalProps) {
  const { onClose, authMessage, authMessageTone, ...panelProps } = props;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex min-h-0 items-end justify-center bg-black/60 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:max-h-[min(90vh,680px)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-heading"
      >
        <div className="relative shrink-0 border-b border-[var(--border-subtle)]/90 bg-gradient-to-b from-[var(--accent)]/[0.07] via-[var(--bg-card)] to-[var(--bg-card)] px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/35 to-transparent"
            aria-hidden
          />
          <button
            type="button"
            className="absolute right-2 top-2 rounded-xl p-2 text-[var(--muted)] transition hover:bg-white/10 hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 sm:right-3 sm:top-3"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center px-8 text-center sm:px-10">
            <p
              id="auth-modal-heading"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]"
            >
              KadroKur
            </p>
            <p
              className="mt-1.5 max-w-[18rem] text-pretty text-sm leading-snug text-[var(--muted)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Oturum aç veya kayıt ol
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pb-8 sm:pt-6">
          <AuthModalBody {...panelProps} />
          {authMessage ? (
            <p
              className={`mt-5 rounded-xl border px-3 py-2.5 text-center text-sm leading-snug ${
                authMessageTone === "success"
                  ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-200"
                  : "border-red-500/40 bg-red-500/10 text-red-200"
              }`}
              role="status"
            >
              {authMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
