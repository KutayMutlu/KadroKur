"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  homeFormationKey: string;
  awayFormationKey: string;
  onHomeFormationChange: (key: string) => void;
  onAwayFormationChange: (key: string) => void;
  availableFormations: FormationDefinition[];
  homePresetKey: TacticalPresetKey;
  awayPresetKey: TacticalPresetKey;
  onHomePresetChange: (key: string) => void;
  onAwayPresetChange: (key: string) => void;
  attackFlip: boolean;
  pitchVertical: boolean;
  onAttackDirectionToggle: () => void;
  onResetPlayerPositions: () => void;
  tacticTitle: string;
  onTacticTitleChange: (t: string) => void;
  onSave: () => void;
  onExport: () => void;
  onCopyShare: () => void;
  saving: boolean;
  canCopyShare: boolean;
  copyBlockedMessage: string;
  message: string | null;
  messageTone: "success" | "warning";
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
  homeFormationKey,
  awayFormationKey,
  onHomeFormationChange,
  onAwayFormationChange,
  availableFormations,
  homePresetKey,
  awayPresetKey,
  onHomePresetChange,
  onAwayPresetChange,
  attackFlip,
  pitchVertical,
  onAttackDirectionToggle,
  onResetPlayerPositions,
  tacticTitle,
  onTacticTitleChange,
  onSave,
  onExport,
  onCopyShare,
  saving,
  canCopyShare,
  copyBlockedMessage,
  message,
  messageTone,
}: EditorSidebarProps) {
  return (
    <div className="space-y-4">
      <header className="border-b border-white/10 pb-3 text-center">
        <h2
          className="text-base font-semibold leading-tight tracking-[0.12em] text-[var(--foreground)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          EDİTÖR
        </h2>
      </header>
      <TeamPanel
        teamName={teamName}
        onTeamNameChange={onTeamNameChange}
        opponentTeamName={opponentTeamName}
        onOpponentTeamNameChange={onOpponentTeamNameChange}
        hasOpponentLineup={hasOpponentLineup}
        onAddOpponentLineup={onAddOpponentLineup}
        onRemoveOpponentLineup={onRemoveOpponentLineup}
        showOpponentSection={false}
      />
      <div className="space-y-3 rounded-xl border border-white/10 bg-black/10 p-3">
        <MatchFormatSelector value={matchFormat} onChange={onMatchFormatChange} />
        <p className="text-xs leading-snug text-[var(--muted)]">
          Oyuncuları düzenlemek için çift tıklayın, taşımak için sürükleyin.
        </p>
        <FormationSelector
          value={homeFormationKey}
          onChange={onHomeFormationChange}
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
            {pitchVertical
              ? attackFlip
                ? "↓ Aşağı atak"
                : "Yukarı atak ↑"
              : attackFlip
                ? "← Sola atak"
                : "Sağa atak →"}
          </Button>
          <p className="mt-1.5 text-[10px] leading-snug text-[var(--muted)]">
            Sahayı hangi yönden görmek istediğinizi seçin. Kendi oyuncularınız ve
            rakip aynı anda döner; linke bakanlar da bu yönü görür.
          </p>
        </div>
        <div>
          <Label>Hazır taktikler</Label>
          <Select value={homePresetKey} onValueChange={onHomePresetChange}>
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
      <div className="space-y-3 rounded-xl border border-white/10 bg-black/10 p-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Rakip takım</Label>
          {hasOpponentLineup ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={onRemoveOpponentLineup}
            >
              Rakibi kaldır
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 w-8 rounded-full p-0 text-lg leading-none"
              onClick={onAddOpponentLineup}
              title="Rakip dizilişi ekle"
              aria-label="Rakip dizilişi ekle"
            >
              +
            </Button>
          )}
        </div>
        {hasOpponentLineup && (
          <Input
            id="opponentTeamName"
            value={opponentTeamName}
            onChange={(e) => onOpponentTeamNameChange(e.target.value)}
            placeholder="Rakip takım adı (isteğe bağlı)"
            aria-label="Rakip takım adı"
          />
        )}
        {hasOpponentLineup && (
          <div>
            <FormationSelector
              value={awayFormationKey}
              onChange={onAwayFormationChange}
              options={availableFormations}
            />
          </div>
        )}
        {hasOpponentLineup && (
          <div>
            <Label>Hazır taktikler</Label>
            <Select value={awayPresetKey} onValueChange={onAwayPresetChange}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TACTIC_PRESETS).map((p) => (
                  <SelectItem key={`away-${p.key}`} value={p.key}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <Toolbar
        tacticTitle={tacticTitle}
        onTacticTitleChange={onTacticTitleChange}
        onSave={onSave}
        onExport={onExport}
        onCopyShare={onCopyShare}
        saving={saving}
        canCopyShare={canCopyShare}
        copyBlockedMessage={copyBlockedMessage}
        message={message}
        messageTone={messageTone}
      />
    </div>
  );
}
