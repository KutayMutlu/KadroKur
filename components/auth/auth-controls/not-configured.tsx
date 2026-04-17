"use client";

import { Button } from "@/components/ui/button";

const envHint =
  "Kökte .env.local (URL + publishable/anon key). Vercel'den: npm run env:pull — sonra npm run dev yeniden.";

export function AuthNotConfigured() {
  return (
    <div className="flex shrink-0 flex-col items-end gap-1 text-right sm:max-w-[260px]">
      <Button type="button" variant="secondary" disabled size="sm" className="shrink-0" title={envHint}>
        Giriş Yap
      </Button>
      <span className="hidden text-[10px] leading-snug text-amber-200/90 break-words sm:block">
        Kökte <code className="rounded bg-black/25 px-0.5">.env.local</code> (URL + publishable/anon key). Vercel&apos;den
        çekmek için: <code className="rounded bg-black/25 px-0.5">npm run env:pull</code> — sonra{" "}
        <code className="rounded bg-black/25 px-0.5">npm run dev</code> yeniden.
      </span>
    </div>
  );
}
