"use client";

import { useLocale } from "@/components/locale-provider";
import { useUserPanelUser } from "../user-panel-context";

export default function UserPanelSettingsPage() {
  const user = useUserPanelUser();
  const { strings: ui } = useLocale();

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
        {ui.panelSettingsTitle}
      </h2>
      <p className="mb-2 text-xs text-[var(--muted)]">
        {ui.panelSettingsSession}{" "}
        <span className="font-medium text-[var(--foreground)]">{user.email ?? ui.panelSettingsUnknown}</span>
      </p>
      <p className="text-sm text-[var(--muted)]">{ui.panelSettingsComingSoon}</p>
    </section>
  );
}
