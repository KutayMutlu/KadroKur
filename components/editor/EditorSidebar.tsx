"use client";

import { useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { presetLabel } from "@/lib/editor-i18n";
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
  const { strings: ui } = useLocale();
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
        title={ui.editorSectionTeam}
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
        title={ui.editorSectionMatch}
        step={2}
        expanded={openStep === 2}
        onSelect={() => toggleStep(2)}
      >
        <MatchFormatSelector value={matchFormat} onChange={onMatchFormatChange} />
        <p className="text-xs leading-snug text-[var(--muted)]">
          {ui.editorHintPlayerEdit}
        </p>
        <FormationSelector
          value={homeFormationKey}
          onChange={onHomeFormationChange}
          options={availableFormations}
        />
        <div>
          <Label>{ui.editorAttackDirectionLabel}</Label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-1 w-full"
            onClick={onAttackDirectionToggle}
            title={ui.editorAttackFlipTitle}
          >
            {pitchVertical
              ? attackFlip
                ? ui.editorAttackDown
                : ui.editorAttackUp
              : attackFlip
                ? ui.editorAttackLeft
                : ui.editorAttackRight}
          </Button>
          <p className="mt-1.5 hidden text-[10px] leading-snug text-[var(--muted)] sm:block">
            {ui.editorAttackDirectionHelp}
          </p>
        </div>
        <div>
          <Label>{ui.editorPresetsLabel}</Label>
          <Select value={homePresetKey} onValueChange={onHomePresetChange}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TACTIC_PRESETS).map((p) => (
                <SelectItem key={p.key} value={p.key}>
                  {presetLabel(ui, p.key)}
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
            {ui.editorResetPositions}
          </Button>
        </div>
      </EditorSection>

      <EditorSection
        title={ui.editorSectionOpponent}
        step={3}
        expanded={openStep === 3}
        onSelect={() => toggleStep(3)}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-[var(--foreground)]">
            {ui.editorOpponentFormationLabel}
          </span>
          {hasOpponentLineup ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 shrink-0 px-2 text-xs"
              onClick={onRemoveOpponentLineup}
            >
              {ui.editorRemove}
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 w-8 shrink-0 rounded-full p-0 text-lg leading-none"
              onClick={onAddOpponentLineup}
              title={ui.editorAddOpponentLineup}
              aria-label={ui.editorAddOpponentLineup}
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
            placeholder={ui.editorOpponentPlaceholder}
            aria-label={ui.editorOpponentAria}
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
            <Label>{ui.editorAwayPresetsLabel}</Label>
            <Select value={awayPresetKey} onValueChange={onAwayPresetChange}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TACTIC_PRESETS).map((p) => (
                  <SelectItem key={`away-${p.key}`} value={p.key}>
                    {presetLabel(ui, p.key)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </EditorSection>

      <EditorSection
        title={ui.editorSectionSaveShare}
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
