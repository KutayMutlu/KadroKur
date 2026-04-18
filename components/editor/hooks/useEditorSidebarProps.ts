"use client";

import { useMemo } from "react";
import { getFormationsByFormat, type MatchFormatKey } from "@/lib/formations";
import type { TacticalPresetKey } from "@/lib/presets";
import type { Player } from "@/types/player";
import type { EditorSidebarProps } from "../EditorSidebar";

interface UseEditorSidebarPropsParams {
  teamName: string;
  onTeamNameChange: (name: string) => void;
  opponentTeamName: string;
  onOpponentTeamNameChange: (name: string) => void;
  players: Player[];
  onAddOpponentLineup: () => void;
  onRemoveOpponentLineup: () => void;
  matchFormat: MatchFormatKey;
  onMatchFormatChange: (f: MatchFormatKey) => void;
  homeFormationKey: string;
  awayFormationKey: string;
  onHomeFormationChange: (key: string) => void;
  onAwayFormationChange: (key: string) => void;
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
}

export function useEditorSidebarProps({
  teamName,
  onTeamNameChange,
  opponentTeamName,
  onOpponentTeamNameChange,
  players,
  onAddOpponentLineup,
  onRemoveOpponentLineup,
  matchFormat,
  onMatchFormatChange,
  homeFormationKey,
  awayFormationKey,
  onHomeFormationChange,
  onAwayFormationChange,
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
}: UseEditorSidebarPropsParams): EditorSidebarProps {
  const availableFormations = getFormationsByFormat(matchFormat);
  const hasOpponentLineup = players.some((p) => p.side === "away");

  return useMemo(
    () => ({
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
    }),
    [
      attackFlip,
      availableFormations,
      awayFormationKey,
      awayPresetKey,
      hasOpponentLineup,
      homeFormationKey,
      homePresetKey,
      matchFormat,
      message,
      onAddOpponentLineup,
      onAttackDirectionToggle,
      onAwayFormationChange,
      onAwayPresetChange,
      onCopyShare,
      onExport,
      onShareLink,
      onHomeFormationChange,
      onHomePresetChange,
      onMatchFormatChange,
      onOpponentTeamNameChange,
      onRemoveOpponentLineup,
      onResetPlayerPositions,
      onSave,
      onTacticTitleChange,
      onTeamNameChange,
      opponentTeamName,
      pitchVertical,
      copyBlockedMessage,
      canCopyShare,
      messageTone,
      saving,
      tacticTitle,
      teamName,
    ]
  );
}
