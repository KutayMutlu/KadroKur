"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PitchCanvas, type PitchCanvasHandle } from "@/components/editor/PitchCanvas";
import { getLocalTacticByShareId } from "@/lib/local-tactics";
import { getSupabase } from "@/lib/supabase";
import type { CanvasState } from "@/types/tactic";
import { Button } from "@/components/ui/button";
import { exportStageToPng } from "@/lib/canvas-export";
import { Download, Home } from "lucide-react";

interface ShareViewClientProps {
  shareId: string;
}

export function ShareViewClient({ shareId }: ShareViewClientProps) {
  const stageRef = useRef<PitchCanvasHandle>(null);
  const [state, setState] = useState<CanvasState | null>(null);
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const local = getLocalTacticByShareId(shareId);
      if (local) {
        if (!cancelled) {
          setState(local.canvas_state);
          setTitle(local.title);
          setLoading(false);
        }
        return;
      }
      const sb = getSupabase();
      if (sb) {
        const { data, error: e } = await sb
          .from("tactics")
          .select("title, canvas_state")
          .eq("share_id", shareId)
          .eq("is_public", true)
          .maybeSingle();
        if (!cancelled && !e && data?.canvas_state) {
          setState(data.canvas_state as CanvasState);
          setTitle(data.title);
          setLoading(false);
          return;
        }
      }
      if (!cancelled) {
        setError("Bu taktik bulunamadı.");
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pitch-night">
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-lg text-[var(--foreground)]">Yükleniyor…</p>
        </div>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="min-h-screen bg-pitch-night">
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg text-[var(--foreground)]">
          {error ?? "Bu taktik bulunamadı."}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Link aynı tarayıcıda kayıtlıysa veya Supabase üzerinde yayınlandıysa
          görüntülenir.
        </p>
        <Button asChild className="mt-6" variant="secondary">
          <Link href="/editor">Editöre git</Link>
        </Button>
      </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-pitch-night pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[min(100%,1400px)] flex-1 flex-col px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pb-3 sm:pt-4">
        <header className="mb-2 shrink-0 flex flex-col gap-3 sm:mb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1
              className="text-lg font-semibold leading-snug text-[var(--foreground)] sm:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title || "Paylaşılan taktik"}
            </h1>
            {(state.teamName || state.opponentTeamName) && (
              <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
                {[state.teamName?.trim(), state.opponentTeamName?.trim()]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            <p className="mt-0.5 text-[11px] text-[var(--muted)] sm:text-sm">
              Salt okunur görünüm
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:justify-start">
            <ThemeToggle />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="touch-manipulation min-h-[40px] min-w-[40px] px-0 sm:min-h-0 sm:min-w-0 sm:px-3"
              onClick={() => {
                const stage = stageRef.current?.getStage();
                if (!stage) return;
                exportStageToPng(stage, "taktik.png");
              }}
              title="PNG indir"
              aria-label="PNG indir"
            >
              <Download className="h-4 w-4 sm:mr-1.5" aria-hidden />
              <span className="hidden sm:inline">PNG indir</span>
            </Button>
            <Button asChild variant="ghost" size="sm" className="touch-manipulation">
              <Link href="/" className="inline-flex min-h-[40px] items-center gap-1.5 sm:min-h-0">
                <Home className="h-4 w-4 shrink-0 sm:hidden" aria-hidden />
                <span>Ana sayfa</span>
              </Link>
            </Button>
          </div>
        </header>
        <div className="min-h-0 w-full flex-1">
          <PitchCanvas
            ref={stageRef}
            players={state.players}
            activePlayerId={null}
            attackFlip={Boolean(state.attack_flip)}
            homeTeamName={state.teamName}
            opponentTeamName={state.opponentTeamName}
            onPlayerMove={() => {}}
            interactive={false}
          />
        </div>
      </div>
    </div>
  );
}
