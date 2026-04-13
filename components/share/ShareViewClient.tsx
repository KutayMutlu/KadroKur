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
    <div className="min-h-screen bg-pitch-night">
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-xl font-semibold text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title || "Paylaşılan taktik"}
          </h1>
          <p className="text-sm text-[var(--muted)]">Salt okunur görünüm</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle />
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              const stage = stageRef.current?.getStage();
              if (!stage) return;
              exportStageToPng(stage, "taktik.png");
            }}
          >
            PNG indir
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Ana sayfa</Link>
          </Button>
        </div>
      </header>
      <PitchCanvas
        ref={stageRef}
        players={state.players}
        activePlayerId={null}
        onPlayerMove={() => {}}
        interactive={false}
      />
    </div>
    </div>
  );
}
