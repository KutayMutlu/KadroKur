"use client";

import { useRef, useState } from "react";
import { PitchCanvas, type PitchCanvasHandle } from "./PitchCanvas";
import { PlayerEditModal } from "./PlayerEditModal";
import { createPlayersForFormation } from "@/lib/players-factory";
import { type TacticalPresetKey } from "@/lib/presets";
import { type MatchFormatKey } from "@/lib/formations";
import { exportStageToPng } from "@/lib/canvas-export";
import { generateShareId } from "@/lib/share";
import type { Player } from "@/types/player";
import type { AdaptiveDropConfig } from "@/lib/player-node-scale";
import {
  DEFAULT_DROP_CONFIG,
  DEFAULT_FORMATION,
  DEFAULT_MATCH_FORMAT,
} from "./core/constants";
import { useResponsiveDrawer } from "./hooks/useResponsiveDrawer";
import { useSupabaseAuthUser } from "./hooks/useSupabaseAuthUser";
import { useUndoRedoHotkeys } from "./hooks/useUndoRedoHotkeys";
import { useEditorPersistence } from "./hooks/useEditorPersistence";
import { useEditorHistory } from "./hooks/useEditorHistory";
import { useEditorBoardActions } from "./hooks/useEditorBoardActions";
import { useEditorSidebarProps } from "./hooks/useEditorSidebarProps";
import { EditorHeader } from "./layout/EditorHeader";
import { EditorMobileUndoRedo } from "./layout/EditorMobileUndoRedo";
import { MobileSettingsDrawer } from "./layout/MobileSettingsDrawer";
import { EditorWorkspace } from "./layout/EditorWorkspace";

export interface EditorClientProps {
  initialTacticId?: string | null;
}

export function EditorClient({ initialTacticId }: EditorClientProps) {
  const stageRef = useRef<PitchCanvasHandle>(null);
  const authUser = useSupabaseAuthUser();
  const { isLg, mobileSettingsOpen, setMobileSettingsOpen } = useResponsiveDrawer();
  const [pitchVertical, setPitchVertical] = useState(false);
  const [matchFormat, setMatchFormat] =
    useState<MatchFormatKey>(DEFAULT_MATCH_FORMAT);
  const [homeFormationKey, setHomeFormationKey] = useState(DEFAULT_FORMATION);
  const [awayFormationKey, setAwayFormationKey] = useState(DEFAULT_FORMATION);
  const [homePresetKey, setHomePresetKey] = useState<TacticalPresetKey>("default");
  const [awayPresetKey, setAwayPresetKey] = useState<TacticalPresetKey>("default");
  const [teamName, setTeamName] = useState("");
  const [opponentTeamName, setOpponentTeamName] = useState("");
  const [tacticTitle, setTacticTitle] = useState("");
  const [players, setPlayers] = useState<Player[]>(() =>
    createPlayersForFormation(DEFAULT_FORMATION)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tacticId, setTacticId] = useState<string | null>(
    initialTacticId ?? null
  );
  const [shareId, setShareId] = useState<string | null>(() =>
    initialTacticId ? null : generateShareId()
  );
  /** Yerelde veya bulutta en az bir kez kaydedildi (paylaşım linkinin başka cihazda açılması için gerekli) */
  const [didSaveOnce, setDidSaveOnce] = useState(false);
  const [dropConfig, setDropConfig] = useState<AdaptiveDropConfig>(DEFAULT_DROP_CONFIG);
  const [attackFlip, setAttackFlip] = useState(false);

  const { pastSnapshots, futureSnapshots, makeSnapshot, pushHistory, onUndo, onRedo } =
    useEditorHistory({
      matchFormat,
      homeFormationKey,
      awayFormationKey,
      homePresetKey,
      awayPresetKey,
      players,
      opponentTeamName,
      attackFlip,
      setMatchFormat,
      setHomeFormationKey,
      setAwayFormationKey,
      setHomePresetKey,
      setAwayPresetKey,
      setPlayers,
      setOpponentTeamName,
      setAttackFlip,
    });

  const {
    onHomeFormationChange,
    onAwayFormationChange,
    onMatchFormatChange,
    onHomePresetChange,
    onAwayPresetChange,
    onResetPlayerPositions,
    onAddOpponentLineup,
    onRemoveOpponentLineup,
    onAttackDirectionToggle,
    onPlayerMove,
    onUpdatePlayer,
  } = useEditorBoardActions({
    matchFormat,
    homeFormationKey,
    awayFormationKey,
    homePresetKey,
    awayPresetKey,
    players,
    dropConfig,
    makeSnapshot,
    pushHistory,
    setMatchFormat,
    setHomeFormationKey,
    setAwayFormationKey,
    setHomePresetKey,
    setAwayPresetKey,
    setPlayers,
    setOpponentTeamName,
    setAttackFlip,
  });

  const handleExport = () => {
    const stage = stageRef.current?.getStage();
    if (!stage) return;
    const safe = (tacticTitle || "taktik").replace(/[^\w\-]+/g, "_");
    exportStageToPng(stage, `${safe}.png`);
  };

  const {
    saving,
    message,
    messageTone,
    canCopyShare,
    copyBlockedMessage,
    handleSave,
    handleCopyShare,
  } = useEditorPersistence({
    initialTacticId,
    authUser,
    teamName,
    opponentTeamName,
    homeFormationKey,
    awayFormationKey,
    homePresetKey,
    awayPresetKey,
    players,
    attackFlip,
    tacticTitle,
    tacticId,
    shareId,
    didSaveOnce,
    setTeamName,
    setOpponentTeamName,
    setMatchFormat,
    setHomeFormationKey,
    setAwayFormationKey,
    setHomePresetKey,
    setAwayPresetKey,
    setPlayers,
    setTacticTitle,
    setTacticId,
    setShareId,
    setDidSaveOnce,
  });

  const editingPlayer = players.find((p) => p.id === editingId) ?? null;
  const sidebarProps = useEditorSidebarProps({
    teamName,
    onTeamNameChange: setTeamName,
    opponentTeamName,
    onOpponentTeamNameChange: setOpponentTeamName,
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
    onTacticTitleChange: setTacticTitle,
    onSave: handleSave,
    onExport: handleExport,
    onCopyShare: handleCopyShare,
    saving,
    canCopyShare,
    copyBlockedMessage,
    message,
    messageTone,
  });

  useUndoRedoHotkeys(editingId, onUndo, onRedo);

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-pitch-night pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto flex min-h-0 w-full max-w-none flex-1 flex-col px-3 pb-4 pt-0 sm:px-4 sm:pb-6 xl:px-4 lg:h-full">
      <EditorHeader
        tacticTitle={tacticTitle}
        canUndo={pastSnapshots.length > 0}
        canRedo={futureSnapshots.length > 0}
        onUndo={onUndo}
        onRedo={onRedo}
        showUndoRedoInHeader={isLg}
      />

      {!isLg && (
        <EditorMobileUndoRedo
          canUndo={pastSnapshots.length > 0}
          canRedo={futureSnapshots.length > 0}
          onUndo={onUndo}
          onRedo={onRedo}
        />
      )}

      {!isLg && (
        <MobileSettingsDrawer
          open={mobileSettingsOpen}
          onToggle={() => setMobileSettingsOpen((o) => !o)}
          onClose={() => setMobileSettingsOpen(false)}
          sidebarProps={sidebarProps}
        />
      )}

      <EditorWorkspace isLg={isLg} sidebarProps={sidebarProps}>
        <PitchCanvas
          ref={stageRef}
          players={players}
          activePlayerId={editingId}
          attackFlip={attackFlip}
          homeTeamName={teamName}
          opponentTeamName={opponentTeamName}
          onLayoutChange={setPitchVertical}
          onAdaptiveDropChange={setDropConfig}
          onPlayerMove={onPlayerMove}
          onEditPlayer={(id) => {
            setEditingId(id);
          }}
        />
      </EditorWorkspace>
      <PlayerEditModal
        key={editingId ?? "closed"}
        player={editingPlayer}
        onClose={() => setEditingId(null)}
        onUpdatePlayer={onUpdatePlayer}
      />
      </div>
    </div>
  );
}
