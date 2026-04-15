"use client";

import { useCallback, useState } from "react";
import type { MatchFormatKey } from "@/lib/formations";
import type { TacticalPresetKey } from "@/lib/presets";
import type { Player } from "@/types/player";
import { HISTORY_LIMIT } from "../core/constants";
import { snapshotsEqual } from "../core/board-state";
import type { BoardSnapshot } from "../core/types";

interface UseEditorHistoryParams {
  matchFormat: MatchFormatKey;
  homeFormationKey: string;
  awayFormationKey: string;
  homePresetKey: TacticalPresetKey;
  awayPresetKey: TacticalPresetKey;
  players: Player[];
  opponentTeamName: string;
  attackFlip: boolean;
  setMatchFormat: (v: MatchFormatKey) => void;
  setHomeFormationKey: (v: string) => void;
  setAwayFormationKey: (v: string) => void;
  setHomePresetKey: (v: TacticalPresetKey) => void;
  setAwayPresetKey: (v: TacticalPresetKey) => void;
  setPlayers: (updater: Player[] | ((prev: Player[]) => Player[])) => void;
  setOpponentTeamName: (v: string) => void;
  setAttackFlip: (updater: boolean | ((prev: boolean) => boolean)) => void;
}

export function useEditorHistory({
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
}: UseEditorHistoryParams) {
  const [pastSnapshots, setPastSnapshots] = useState<BoardSnapshot[]>([]);
  const [futureSnapshots, setFutureSnapshots] = useState<BoardSnapshot[]>([]);

  const makeSnapshot = useCallback(
    (): BoardSnapshot => ({
      matchFormat,
      homeFormationKey,
      awayFormationKey,
      homePresetKey,
      awayPresetKey,
      players: players.map((p) => ({ ...p })),
      opponentTeamName,
      attackFlip,
    }),
    [
      attackFlip,
      awayFormationKey,
      awayPresetKey,
      homeFormationKey,
      homePresetKey,
      matchFormat,
      opponentTeamName,
      players,
    ]
  );

  const pushHistory = useCallback((snapshot: BoardSnapshot) => {
    setPastSnapshots((prev) => {
      const last = prev[prev.length - 1];
      if (last && snapshotsEqual(last, snapshot)) return prev;
      return [...prev.slice(-(HISTORY_LIMIT - 1)), snapshot];
    });
    setFutureSnapshots([]);
  }, []);

  const restoreSnapshot = useCallback(
    (snapshot: BoardSnapshot) => {
      setMatchFormat(snapshot.matchFormat);
      setHomeFormationKey(snapshot.homeFormationKey);
      setAwayFormationKey(snapshot.awayFormationKey);
      setHomePresetKey(snapshot.homePresetKey);
      setAwayPresetKey(snapshot.awayPresetKey);
      setPlayers(snapshot.players.map((p) => ({ ...p })));
      setOpponentTeamName(snapshot.opponentTeamName ?? "");
      setAttackFlip(snapshot.attackFlip ?? false);
    },
    [
      setAttackFlip,
      setAwayFormationKey,
      setAwayPresetKey,
      setHomeFormationKey,
      setHomePresetKey,
      setMatchFormat,
      setOpponentTeamName,
      setPlayers,
    ]
  );

  const onUndo = useCallback(() => {
    setPastSnapshots((prev) => {
      if (prev.length === 0) return prev;
      const previous = prev[prev.length - 1];
      setFutureSnapshots((future) => [makeSnapshot(), ...future].slice(0, HISTORY_LIMIT));
      restoreSnapshot(previous);
      return prev.slice(0, -1);
    });
  }, [makeSnapshot, restoreSnapshot]);

  const onRedo = useCallback(() => {
    setFutureSnapshots((prev) => {
      if (prev.length === 0) return prev;
      const [next, ...rest] = prev;
      setPastSnapshots((past) => [...past.slice(-(HISTORY_LIMIT - 1)), makeSnapshot()]);
      restoreSnapshot(next);
      return rest;
    });
  }, [makeSnapshot, restoreSnapshot]);

  return {
    pastSnapshots,
    futureSnapshots,
    makeSnapshot,
    pushHistory,
    onUndo,
    onRedo,
  };
}
