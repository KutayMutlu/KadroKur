"use client";

export function SaveProfileButton() {
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--on-accent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Kaydet
    </button>
  );
}
