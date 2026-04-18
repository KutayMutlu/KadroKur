"use client";

import { AlertTriangle, CheckCircle2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type AuthSessionToastTone = "success" | "warning" | "neutral";

type Props = {
  message: string;
  tone: AuthSessionToastTone;
};

/**
 * Giriş / kayıt / çıkış geri bildirimi — alt orta.
 * Mobil: home indicator üstünde (safe-area). Masaüstü: alta yakın (sm:bottom-4); daha büyük sm:bottom değeri bildirimi yukarı iter.
 */
export function AuthSessionToast({ message, tone }: Props) {
  if (!message) return null;

  const Icon =
    tone === "success" ? CheckCircle2 : tone === "warning" ? AlertTriangle : LogOut;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] left-1/2 z-[10050] w-[min(calc(100vw-1.5rem),22rem)] -translate-x-1/2 px-3 animate-in fade-in slide-in-from-bottom-2 duration-200 sm:bottom-4 sm:max-w-sm sm:px-0"
    >
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border px-4 py-3 text-left shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md",
          tone === "success" &&
            "border-[var(--accent)]/40 bg-[var(--bg-elevated)]/96 text-[var(--foreground)] ring-1 ring-[var(--accent)]/15",
          tone === "warning" &&
            "border-amber-500/45 bg-amber-500/[0.12] text-[var(--foreground)] ring-1 ring-amber-500/20 dark:bg-amber-950/50 dark:text-amber-50 dark:ring-amber-500/25",
          tone === "neutral" &&
            "border-[var(--border-subtle)] bg-[var(--bg-card)]/96 text-[var(--foreground)] ring-1 ring-white/[0.06]"
        )}
      >
        <Icon
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            tone === "success" && "text-[var(--accent)]",
            tone === "warning" && "text-amber-600 dark:text-amber-300",
            tone === "neutral" && "text-[var(--muted)]"
          )}
          strokeWidth={2}
          aria-hidden
        />
        <span className="min-w-0 flex-1 text-sm font-medium leading-snug">{message}</span>
      </div>
    </div>
  );
}
