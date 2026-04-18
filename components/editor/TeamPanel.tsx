"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface TeamPanelProps {
  teamName: string;
  onTeamNameChange: (name: string) => void;
  opponentTeamName: string;
  onOpponentTeamNameChange: (name: string) => void;
  hasOpponentLineup: boolean;
  onAddOpponentLineup: () => void;
  onRemoveOpponentLineup: () => void;
  showTeamName?: boolean;
  showOpponentSection?: boolean;
  /** Dışarıda EditorSection vb. kart varsa çerçeveyi kaldır */
  unstyled?: boolean;
}

export function TeamPanel({
  teamName,
  onTeamNameChange,
  opponentTeamName,
  onOpponentTeamNameChange,
  hasOpponentLineup,
  onAddOpponentLineup,
  onRemoveOpponentLineup,
  showTeamName = true,
  showOpponentSection = true,
  unstyled = false,
}: TeamPanelProps) {
  return (
    <div
      className={
        unstyled
          ? "flex flex-col gap-4"
          : "flex flex-col gap-4 rounded-xl border border-white/10 bg-black/10 p-3"
      }
    >
      {showTeamName && (
        <div>
          <Label htmlFor="teamName">Takım adı</Label>
          <Input
            id="teamName"
            className="mt-1"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder="Takımınızın adını giriniz"
          />
        </div>
      )}

      {showOpponentSection && (
        <div className={`space-y-2 ${showTeamName ? "border-t border-white/10 pt-3" : ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label className="text-[var(--foreground)]">Rakip takım</Label>
          {hasOpponentLineup ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={onRemoveOpponentLineup}
            >
              Rakibi kaldır
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={onAddOpponentLineup}
            >
              Rakip dizilişi ekle
            </Button>
          )}
        </div>
        {hasOpponentLineup && (
          <>
            <Input
              id="opponentTeamName"
              value={opponentTeamName}
              onChange={(e) => onOpponentTeamNameChange(e.target.value)}
              placeholder="Rakip takım adı (isteğe bağlı)"
              aria-label="Rakip takım adı"
            />
          </>
        )}
        </div>
      )}
    </div>
  );
}
