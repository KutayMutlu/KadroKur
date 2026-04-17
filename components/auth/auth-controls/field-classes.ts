export function emailInputClassMobile(emailInvalid: boolean): string {
  return emailInvalid
    ? "w-full rounded-lg border border-red-500 bg-red-950/25 px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-2 ring-red-500/45 transition focus:ring-2 focus:ring-red-500/55"
    : "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2";
}

export function emailInputClassDesktop(emailInvalid: boolean): string {
  return emailInvalid
    ? "w-full rounded-lg border border-red-500 bg-red-950/30 px-3 py-2 text-sm text-white outline-none ring-2 ring-red-500/45 transition placeholder:text-white/70 focus:ring-2 focus:ring-red-500/55"
    : "w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/70 outline-none ring-[var(--accent)]/50 transition focus:ring-2";
}

export function textFieldClassMobile(invalid: boolean): string {
  return invalid
    ? "w-full rounded-lg border border-red-500 bg-red-950/25 px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-2 ring-red-500/45 transition focus:ring-2 focus:ring-red-500/55"
    : "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2";
}

export function textFieldClassDesktop(invalid: boolean): string {
  return invalid
    ? "w-full rounded-lg border border-red-500 bg-red-950/30 px-3 py-2 text-sm text-white outline-none ring-2 ring-red-500/45 transition placeholder:text-white/70 focus:ring-2 focus:ring-red-500/55"
    : "w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/70 outline-none ring-[var(--accent)]/50 transition focus:ring-2";
}

export function passwordMainClassMobile(passwordMainInvalid: boolean): string {
  return passwordMainInvalid
    ? "w-full rounded-lg border border-red-500 bg-red-950/25 px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-2 ring-red-500/45 transition focus:ring-2 focus:ring-red-500/55"
    : "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2";
}

export function passwordMainClassDesktop(passwordMainInvalid: boolean): string {
  return passwordMainInvalid
    ? "w-full rounded-lg border border-red-500 bg-red-950/30 px-3 py-2 text-sm text-white outline-none ring-2 ring-red-500/45 transition placeholder:text-white/70 focus:ring-2 focus:ring-red-500/55"
    : "w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/70 outline-none ring-[var(--accent)]/50 transition focus:ring-2";
}

export function passwordConfirmClassMobile(passwordConfirmInvalid: boolean): string {
  return passwordConfirmInvalid
    ? "w-full rounded-lg border border-red-500 bg-red-950/25 px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-2 ring-red-500/45 transition focus:ring-2 focus:ring-red-500/55"
    : "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2";
}

export function passwordConfirmClassDesktop(passwordConfirmInvalid: boolean): string {
  return passwordConfirmInvalid
    ? "w-full rounded-lg border border-red-500 bg-red-950/30 px-3 py-2 text-sm text-white outline-none ring-2 ring-red-500/45 transition placeholder:text-white/70 focus:ring-2 focus:ring-red-500/55"
    : "w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/70 outline-none ring-[var(--accent)]/50 transition focus:ring-2";
}
