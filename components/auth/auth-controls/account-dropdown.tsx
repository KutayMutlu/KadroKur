"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { ChevronDown, LayoutGrid, LogOut, UserRound } from "lucide-react";
import {
  pickAvatarUrl,
  pickDisplayName,
  pickInitials,
  type ProfileNameFields,
} from "./user-helpers";

type Props = {
  user: User;
  loading: boolean;
  onSignOut: () => void | Promise<void>;
  /** `user_profiles` — yoksa kayıt metadata’sındaki ad/soyad kullanılır */
  profile?: ProfileNameFields | null;
  onMenuOpenChange?: (open: boolean) => void;
};

export function AccountDropdown({
  user,
  loading,
  onSignOut,
  profile = null,
  onMenuOpenChange,
}: Props) {
  const avatarUrl = pickAvatarUrl(user);
  const initials = pickInitials(user, profile);
  const displayName = pickDisplayName(user, profile);
  const emailLine = user.email?.trim() ?? null;

  return (
    <DropdownMenu onOpenChange={onMenuOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={loading}
          className="group relative flex max-w-[min(100%,13rem)] shrink-0 items-center gap-2.5 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 py-1.5 pl-1.5 pr-2 shadow-[var(--card-inset-glow)] backdrop-blur-sm transition hover:border-[var(--accent)]/35 hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_22%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 disabled:opacity-60 data-[state=open]:border-[var(--accent)]/45 data-[state=open]:shadow-[0_0_24px_-8px_color-mix(in_srgb,var(--accent)_35%,transparent)] sm:max-w-[16.5rem]"
          aria-label={`Hesap menüsü: ${displayName}`}
          title={displayName}
        >
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/25 to-transparent opacity-0 transition group-hover:opacity-100 group-data-[state=open]:opacity-100"
            aria-hidden
          />
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              width={34}
              height={34}
              className="relative z-[1] h-[34px] w-[34px] shrink-0 rounded-xl object-cover ring-1 ring-white/12"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span
              className="relative z-[1] flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)]/30 via-[var(--accent)]/15 to-transparent text-[12px] font-bold tracking-tight text-[var(--accent)] ring-1 ring-[var(--accent)]/25"
              aria-hidden
            >
              {initials}
            </span>
          )}
          <span
            className="min-w-0 flex-1 truncate text-left text-[13px] font-semibold leading-tight text-[var(--foreground)] sm:text-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {displayName}
          </span>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/15 text-[var(--muted)] transition group-hover:text-[var(--accent-dim)] group-data-[state=open]:bg-[var(--accent)]/10 group-data-[state=open]:text-[var(--accent)]">
            <ChevronDown
              className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(calc(100vw-1.25rem),20rem)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-0 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      >
        {/* Üst: kimlik */}
        <div className="relative border-b border-white/[0.06] bg-gradient-to-b from-[var(--accent)]/[0.09] via-[var(--bg-elevated)] to-[var(--bg-elevated)] px-4 pb-3.5 pt-4">
          <div
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/35 to-transparent"
            aria-hidden
          />
          <div className="flex gap-3">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-1 ring-white/12"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)]/35 to-[var(--accent)]/10 text-sm font-bold text-[var(--accent)] ring-1 ring-[var(--accent)]/20"
                aria-hidden
              >
                {initials}
              </span>
            )}
            <div className="min-w-0 flex-1 pt-0.5">
              <p
                className="truncate text-[15px] font-semibold leading-snug text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {displayName}
              </p>
              {emailLine ? (
                <p
                  className="mt-0.5 truncate text-xs leading-relaxed text-[var(--muted)]"
                  title={emailLine}
                >
                  {emailLine}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-2">
          <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Kısayollar
          </p>
          <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-2 py-1.5 focus:bg-white/[0.04]">
            <Link
              href="/kullanici-paneli"
              className="flex w-full items-center gap-3 rounded-xl outline-none"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/[0.12] text-[var(--accent)] ring-1 ring-[var(--accent)]/15">
                <UserRound className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-sm font-medium text-[var(--foreground)]">Kullanıcı paneli</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-2 py-1.5 focus:bg-white/[0.04]">
            <Link href="/taktiklerim" className="flex w-full items-center gap-3 rounded-xl outline-none">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/[0.12] text-[var(--accent)] ring-1 ring-[var(--accent)]/15">
                <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-sm font-medium text-[var(--foreground)]">Taktiklerim</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-0 bg-white/[0.06]" />

        <div
          className="flex items-center justify-between gap-3 px-4 py-2.5"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">Görünüm</p>
            <p className="text-[11px] text-[var(--muted)]">Açık / koyu tema</p>
          </div>
          <ThemeToggle />
        </div>

        <DropdownMenuSeparator className="my-0 bg-white/[0.06]" />

        <div className="p-1.5">
          <DropdownMenuItem
            className="cursor-pointer rounded-xl px-2.5 py-2.5 text-red-300/95 focus:bg-red-950/35 focus:text-red-200"
            disabled={loading}
            onSelect={(e) => {
              e.preventDefault();
              void onSignOut();
            }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-300 ring-1 ring-red-500/15">
              <LogOut className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
            </span>
            <span className="text-sm font-medium">Çıkış yap</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
