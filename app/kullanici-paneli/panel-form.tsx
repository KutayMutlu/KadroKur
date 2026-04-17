import type { LucideIcon } from "lucide-react";

export const panelFieldClass =
  "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 px-3.5 py-2.5 text-sm text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--accent)]/20";

export const panelLabelClass = "mb-1.5 block text-xs font-medium tracking-wide text-[var(--muted)]";

export function PanelFormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-elevated)]/20 p-5 shadow-[0_1px_0_0_rgba(190,255,100,0.04)_inset] sm:p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-5 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] text-[var(--accent)] shadow-sm">
          <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="text-lg font-semibold leading-tight tracking-tight text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-[var(--muted)]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
