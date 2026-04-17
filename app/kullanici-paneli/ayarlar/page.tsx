"use client";

import { useUserPanelUser } from "../user-panel-context";

export default function UserPanelSettingsPage() {
  const user = useUserPanelUser();

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">Ayarlar</h2>
      <p className="mb-2 text-xs text-[var(--muted)]">
        Oturum: <span className="font-medium text-[var(--foreground)]">{user.email ?? "Bilinmiyor"}</span>
      </p>
      <p className="text-sm text-[var(--muted)]">Yakında: hesap ayarları ve tercihlerinizi buradan yönetebileceksiniz.</p>
    </section>
  );
}
