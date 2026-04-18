"use client";

import { PitchCanvas } from "@/components/editor/PitchCanvas";
import type { CanvasState } from "@/types/tactic";

type Props = {
  title: string;
  formationKey: string;
  ownerName: string;
  state: CanvasState;
};

export function PublicTacticViewer({ title, formationKey, ownerName, state }: Props) {
  return (
    <div className="min-h-screen bg-pitch-night">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-4 sm:px-5 sm:py-6">
        <header className="mb-3 shrink-0">
          <h1 className="text-balance text-xl font-semibold text-[var(--foreground)] sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Diziliş: {formationKey}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Bu taktik {ownerName} tarafından KadroKur üzerinde oluşturulmuştur.
          </p>
        </header>

        <section className="relative min-h-[72vh] flex-1">
          <PitchCanvas
            players={state.players}
            activePlayerId={null}
            attackFlip={Boolean(state.attack_flip)}
            homeTeamName={state.teamName}
            opponentTeamName={state.opponentTeamName}
            onPlayerMove={() => {}}
            interactive={false}
          />
        </section>
      </main>
    </div>
  );
}
