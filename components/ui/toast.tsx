"use client";

type ToastProps = {
  message: string;
  variant?: "success" | "destructive";
};

export function Toast({ message, variant = "success" }: ToastProps) {
  const isDestructive = variant === "destructive";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className={`w-full max-w-xl rounded-xl border px-4 py-3 text-center text-sm font-medium backdrop-blur ${
          isDestructive
            ? "border-rose-500/85 bg-rose-950/95 text-rose-100 shadow-[0_14px_30px_-18px_rgba(244,63,94,0.8)]"
            : "border-emerald-500/80 bg-emerald-950/95 text-emerald-100 shadow-[0_14px_30px_-18px_rgba(16,185,129,0.8)]"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
