"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();
  const [isSubmittingFallback, setIsSubmittingFallback] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const isPending = pending || isSubmittingFallback;

  useEffect(() => {
    const button = buttonRef.current;
    const form = button?.form;
    if (!form) return;

    const onSubmit = () => setIsSubmittingFallback(true);
    form.addEventListener("submit", onSubmit);

    return () => {
      form.removeEventListener("submit", onSubmit);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type="submit"
      disabled={isPending}
      aria-disabled={isPending}
      className="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--on-accent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Kaydediliyor...
        </>
      ) : (
        "Kaydet"
      )}
    </button>
  );
}

export function SaveProfileButton() {
  return <SubmitButton />;
}
