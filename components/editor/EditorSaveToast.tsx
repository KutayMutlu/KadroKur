"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  message: string;
  onDismiss: () => void;
  /** Varsayılan 3000 ms */
  durationMs?: number;
};

/**
 * Bulut kaydı başarılı olduğunda sağ üst — slate/emerald KadroKur uyumu.
 */
export function EditorSaveToast({
  open,
  message,
  onDismiss,
  durationMs = 3000,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(t);
  }, [open, onDismiss, durationMs]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed top-[max(0.75rem,env(safe-area-inset-top,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))] z-[10060] w-[min(calc(100vw-1.5rem),22rem)] animate-in fade-in slide-in-from-top-2 duration-200 sm:top-4 sm:right-4"
    >
      <div
        className={cn(
          "pointer-events-auto flex items-start gap-3 rounded-2xl border border-emerald-500 bg-slate-900 px-4 py-3",
          "text-left text-[13px] font-medium leading-snug text-slate-50 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)]"
        )}
      >
        <CheckCircle2
          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
          strokeWidth={2.25}
          aria-hidden
        />
        <span className="min-w-0 flex-1">{message}</span>
      </div>
    </div>
  );
}
