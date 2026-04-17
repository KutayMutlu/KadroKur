"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const COOLDOWN_SECONDS = 8;

export function SaveProfileButton() {
  const { pending } = useFormStatus();
  const [cooldown, setCooldown] = useState(0);
  const [wasPending, setWasPending] = useState(false);

  useEffect(() => {
    if (pending && !wasPending) {
      setCooldown(COOLDOWN_SECONDS);
      setWasPending(true);
      return;
    }
    if (!pending && wasPending) {
      setWasPending(false);
    }
  }, [pending, wasPending]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const disabled = pending || cooldown > 0;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--on-accent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Kaydediliyor..." : cooldown > 0 ? `Tekrar deneme: ${cooldown}s` : "Kaydet"}
    </button>
  );
}
