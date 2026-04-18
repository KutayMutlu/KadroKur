"use client";

import { useState } from "react";
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
import { EditorPanelHeader } from "./EditorPanelHeader";
import { EditorSection } from "./EditorSection";
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
  onShareLink: () => void;
  saving: boolean;
  canCopyShare: boolean;
  copyBlockedMessage: string;
  message: string | null;
  messageTone: "success" | "warning";
  /** Mobil ayar çekmecesinde üst başlık drawer’da olduğu için iç panel başlığını gizle */
  embeddedInDrawer?: boolean;
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
  onShareLink,
  saving,
  canCopyShare,
  copyBlockedMessage,
  message,
  messageTone,
  embeddedInDrawer = false,
}: EditorSidebarProps) {
  /** 0 = hepsi kapalı; 1–4 = o adım açık. Aynı başlığa tekrar tıklanınca kapanır. */
  const [openStep, setOpenStep] = useState(1);

  const toggleStep = (step: number) => {
    setOpenStep((prev) => (prev === step ? 0 : step));
  };

  return (
    <div className="flex min-h-0 flex-col gap-3 sm:gap-4">
      {!embeddedInDrawer && (
        <EditorPanelHeader activeStep={openStep} onStepSelect={toggleStep} />
      )}

      <EditorSection
        title="Takım"
        step={1}
        expanded={openStep === 1}
        onSelect={() => toggleStep(1)}
      >
        <TeamPanel
          teamName={teamName}
          onTeamNameChange={onTeamNameChange}
          opponentTeamName={opponentTeamName}
          onOpponentTeamNameChange={onOpponentTeamNameChange}
          hasOpponentLineup={hasOpponentLineup}
          onAddOpponentLineup={onAddOpponentLineup}
          onRemoveOpponentLineup={onRemoveOpponentLineup}
          showOpponentSection={false}
          unstyled
        />
      </EditorSection>

      <EditorSection
        title="Maç ve diziliş"
        step={2}
        expanded={openStep === 2}
        onSelect={() => toggleStep(2)}
      >
        <MatchFormatSelector value={matchFormat} onChange={onMatchFormatChange} />
        <p className="text-xs leading-snug text-[var(--muted)]">
          Oyuncu: çift tıkla düzenle, sürükleyerek taşı.
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
          <p className="mt-1.5 hidden text-[10px] leading-snug text-[var(--muted)] sm:block">
            Sahayı hangi yönden görmek istediğinizi seçin. Kendi oyuncularınız ve rakip
            aynı anda döner; linke bakanlar da bu yönü görür.
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
      </EditorSection>

      <EditorSection
        title="Rakip (isteğe bağlı)"
        step={3}
        expanded={openStep === 3}
        onSelect={() => toggleStep(3)}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-[var(--foreground)]">Rakip dizilişi</span>
          {hasOpponentLineup ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 shrink-0 px-2 text-xs"
              onClick={onRemoveOpponentLineup}
            >
              Kaldır
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 w-8 shrink-0 rounded-full p-0 text-lg leading-none"
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
          <FormationSelector
            value={awayFormationKey}
            onChange={onAwayFormationChange}
            options={availableFormations}
          />
        )}
        {hasOpponentLineup && (
          <div>
            <Label>Hazır taktikler (rakip)</Label>
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
      </EditorSection>

      <EditorSection
        title="Kaydet ve paylaş"
        step={4}
        expanded={openStep === 4}
        onSelect={() => toggleStep(4)}
      >
        <Toolbar
          tacticTitle={tacticTitle}
          onTacticTitleChange={onTacticTitleChange}
          onSave={onSave}
          onExport={onExport}
          onCopyShare={onCopyShare}
          onShareLink={onShareLink}
          saving={saving}
          canCopyShare={canCopyShare}
          copyBlockedMessage={copyBlockedMessage}
          message={message}
          messageTone={messageTone}
          embedded
        />
      </EditorSection>
    </div>
  );
}
