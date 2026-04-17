"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { pickAvatarUrl, pickInitials } from "./user-helpers";

type Props = {
  user: User;
  loading: boolean;
  onSignOut: () => void | Promise<void>;
};

export function AccountDropdown({ user, loading, onSignOut }: Props) {
  const avatarUrl = pickAvatarUrl(user);
  const initials = pickInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={loading}
          className="group flex shrink-0 items-center gap-0.5 rounded-full border-2 border-[var(--border-subtle)] bg-[var(--bg-card)] p-0.5 pl-0.5 pr-1 shadow-sm transition hover:border-[var(--accent)]/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 disabled:opacity-60 data-[state=open]:border-[var(--accent)]/55 data-[state=open]:shadow-[0_0_0_1px_var(--accent)]/25"
          aria-label="Hesap menüsü: kullanıcı paneli, tema ve çıkış"
          title="Hesap menüsünü aç"
        >
          {avatarUrl ? (
            // OAuth sağlayıcı URL'leri çeşitli; next/image remotePatterns yerine img
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[11px] font-semibold text-[var(--accent)]"
              aria-hidden
            >
              {initials}
            </span>
          )}
          <ChevronDown
            className="h-3.5 w-3.5 shrink-0 text-[var(--muted)] transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-[min(calc(100vw-2rem),18rem)]">
        <DropdownMenuLabel className="space-y-1 font-normal">
          <span className="block text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Hesap
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/kullanici-paneli">
            <UserCircle2 className="h-4 w-4" />
            Kullanıcı Paneli
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div
          className="flex items-center justify-between gap-3 rounded-lg px-2 py-2"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="text-sm text-[var(--foreground)]">Tema</span>
          <ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-red-300 focus:bg-red-950/40 focus:text-red-200"
          disabled={loading}
          onSelect={(e) => {
            e.preventDefault();
            void onSignOut();
          }}
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
