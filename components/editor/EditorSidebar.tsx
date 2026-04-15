"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormationSelector } from "./FormationSelector";
import { MatchFormatSelector } from "./MatchFormatSelector";
import { TeamPanel } from "./TeamPanel";
import { Toolbar } from "./Toolbar";
import {
  TACTIC_PRESETS,
  type TacticalPresetKey,
} from "@/lib/presets";
import type { MatchFormatKey } from "@/lib/formations";
import type { FormationDefinition } from "@/types/formation";

export interface EditorSidebarProps {
  teamName: string;
  onTeamNameChange: (name: string) => void;
  opponentTeamName: string;
  onOpponentTeamNameChange: (name: string) => void;
  hasOpponentLineup: boolean;
  onAddOpponentLineup: () => void;
  onRemoveOpponentLineup: () => void;
  matchFormat: MatchFormatKey;
  onMatchFormatChange: (f: MatchFormatKey) => void;
  formationKey: string;
  onFormationChange: (key: string) => void;
  availableFormations: FormationDefinition[];
  presetKey: TacticalPresetKey;
  onPresetChange: (key: string) => void;
  attackFlip: boolean;
  onAttackDirectionToggle: () => void;
  onResetPlayerPositions: () => void;
  tacticTitle: string;
  onTacticTitleChange: (t: string) => void;
  onSave: () => void;
  onExport: () => void;
  onCopyShare: () => void;
  saving: boolean;
  shareReady: boolean;
  message: string | null;
}

export function EditorSidebar({
  teamName,
  onTeamNameChange,
  opponentTeamName,
  onOpponentTeamNameChange,
  hasOpponentLineup,
  onAddOpponentLineup,
  onRemoveOpponentLineup,
  matchFormat,
  onMatchFormatChange,
  formationKey,
  onFormationChange,
  availableFormations,
  presetKey,
  onPresetChange,
  attackFlip,
  onAttackDirectionToggle,
  onResetPlayerPositions,
  tacticTitle,
  onTacticTitleChange,
  onSave,
  onExport,
  onCopyShare,
  saving,
  shareReady,
  message,
}: EditorSidebarProps) {
  return (
    <div className="space-y-4">
      <TeamPanel
        teamName={teamName}
        onTeamNameChange={onTeamNameChange}
        opponentTeamName={opponentTeamName}
        onOpponentTeamNameChange={onOpponentTeamNameChange}
        hasOpponentLineup={hasOpponentLineup}
        onAddOpponentLineup={onAddOpponentLineup}
        onRemoveOpponentLineup={onRemoveOpponentLineup}
      />
      <div className="space-y-3 rounded-xl border border-white/10 bg-black/10 p-3">
        <MatchFormatSelector value={matchFormat} onChange={onMatchFormatChange} />
        <p className="text-xs leading-snug text-[var(--muted)]">
          Oyuncuları düzenlemek için çift tıklayın, taşımak için sürükleyin.
        </p>
        <FormationSelector
          value={formationKey}
          onChange={onFormationChange}
          options={availableFormations}
        />
        <div>
          <Label>Atak yönü (görünüm)</Label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-1 w-full"
            onClick={onAttackDirectionToggle}
            title="Takımınız ve rakip aynı anda döner; paylaşılan linkte de bu görünüm kullanılır."
          >
            {attackFlip ? "← Sola atak" : "Sağa atak →"}
          </Button>
          <p className="mt-1.5 text-[10px] leading-snug text-[var(--muted)]">
            Sahayı hangi yönden görmek istediğinizi seçin. Kendi oyuncularınız ve
            rakip aynı anda döner; linke bakanlar da bu yönü görür.
          </p>
        </div>
        <div>
          <Label>Preset taktik</Label>
          <Select value={presetKey} onValueChange={onPresetChange}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TACTIC_PRESETS).map((p) => (
                <SelectItem key={p.key} value={p.key}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onResetPlayerPositions}
            className="mt-2 w-full"
          >
            Oyuncu konumlarını sıfırla
          </Button>
        </div>
      </div>
      <Toolbar
        tacticTitle={tacticTitle}
        onTacticTitleChange={onTacticTitleChange}
        onSave={onSave}
        onExport={onExport}
        onCopyShare={onCopyShare}
        saving={saving}
        shareReady={shareReady}
        message={message}
      />
    </div>
  );
}
