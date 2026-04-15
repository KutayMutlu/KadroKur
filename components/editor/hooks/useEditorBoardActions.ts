"use client";

import { useCallback } from "react";
import { createPlayersForFormation } from "@/lib/players-factory";
import {
  applyPresetToPlayers,
  normalizePresetKey,
  type TacticalPresetKey,
} from "@/lib/presets";
import { getFormationsByFormat, type MatchFormatKey } from "@/lib/formations";
import { sanitizePlayerName, normalizePlayerRole } from "@/lib/player-fields";
import type { Player } from "@/types/player";
import type { AdaptiveDropConfig } from "@/lib/player-node-scale";
import { EPS } from "../core/constants";
import { rebuildAwayPlayers, rebuildHomePlayers } from "../core/board-state";
import { resolveDropPosition } from "../core/drop-resolver";
import type { BoardSnapshot } from "../core/types";

interface UseEditorBoardActionsParams {
  matchFormat: MatchFormatKey;
  homeFormationKey: string;
  awayFormationKey: string;
  homePresetKey: TacticalPresetKey;
  awayPresetKey: TacticalPresetKey;
  players: Player[];
  dropConfig: AdaptiveDropConfig;
  makeSnapshot: () => BoardSnapshot;
  pushHistory: (snapshot: BoardSnapshot) => void;
  setMatchFormat: (v: MatchFormatKey) => void;
  setHomeFormationKey: (v: string) => void;
  setAwayFormationKey: (v: string) => void;
  setHomePresetKey: (v: TacticalPresetKey) => void;
  setAwayPresetKey: (v: TacticalPresetKey) => void;
  setPlayers: (updater: Player[] | ((prev: Player[]) => Player[])) => void;
  setOpponentTeamName: (v: string) => void;
  setAttackFlip: (updater: boolean | ((prev: boolean) => boolean)) => void;
}

export function useEditorBoardActions({
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
}: UseEditorBoardActionsParams) {
  const onHomeFormationChange = useCallback(
    (key: string) => {
      if (key === homeFormationKey) return;
      pushHistory(makeSnapshot());
      setHomeFormationKey(key);
      setPlayers((prev) =>
        rebuildHomePlayers(key, homePresetKey, prev, prev.some((p) => p.side === "away"))
      );
    },
    [homeFormationKey, homePresetKey, makeSnapshot, pushHistory, setHomeFormationKey, setPlayers]
  );

  const onAwayFormationChange = useCallback(
    (key: string) => {
      if (key === awayFormationKey) return;
      pushHistory(makeSnapshot());
      setAwayFormationKey(key);
      setPlayers((prev) => rebuildAwayPlayers(key, awayPresetKey, prev));
    },
    [awayFormationKey, awayPresetKey, makeSnapshot, pushHistory, setAwayFormationKey, setPlayers]
  );

  const onMatchFormatChange = useCallback(
    (format: MatchFormatKey) => {
      if (format === matchFormat) return;
      pushHistory(makeSnapshot());
      setMatchFormat(format);
      const formations = getFormationsByFormat(format);
      const nextFormation = formations[0]?.key;
      if (!nextFormation) return;
      setHomeFormationKey(nextFormation);
      setAwayFormationKey(nextFormation);
      setPlayers((prev) =>
        rebuildAwayPlayers(
          nextFormation,
          awayPresetKey,
          rebuildHomePlayers(
            nextFormation,
            homePresetKey,
            prev,
            prev.some((p) => p.side === "away")
          )
        )
      );
    },
    [
      awayPresetKey,
      homePresetKey,
      makeSnapshot,
      matchFormat,
      pushHistory,
      setAwayFormationKey,
      setHomeFormationKey,
      setMatchFormat,
      setPlayers,
    ]
  );

  const onHomePresetChange = useCallback(
    (nextPresetKey: string) => {
      pushHistory(makeSnapshot());
      const normalized = normalizePresetKey(nextPresetKey);
      if (normalized === homePresetKey) return;
      setHomePresetKey(normalized);
      setPlayers((prev) =>
        rebuildHomePlayers(
          homeFormationKey,
          normalized,
          prev,
          prev.some((p) => p.side === "away")
        )
      );
    },
    [homeFormationKey, homePresetKey, makeSnapshot, pushHistory, setHomePresetKey, setPlayers]
  );

  const onAwayPresetChange = useCallback(
    (nextPresetKey: string) => {
      pushHistory(makeSnapshot());
      const normalized = normalizePresetKey(nextPresetKey);
      if (normalized === awayPresetKey) return;
      setAwayPresetKey(normalized);
      setPlayers((prev) => rebuildAwayPlayers(awayFormationKey, normalized, prev));
    },
    [awayFormationKey, awayPresetKey, makeSnapshot, pushHistory, setAwayPresetKey, setPlayers]
  );

  const onResetPlayerPositions = useCallback(() => {
    pushHistory(makeSnapshot());
    setPlayers((prev) => {
      const includeOpponent = prev.some((p) => p.side === "away");
      const homeBuilt = rebuildHomePlayers(homeFormationKey, homePresetKey, prev, includeOpponent);
      return includeOpponent ? rebuildAwayPlayers(awayFormationKey, awayPresetKey, homeBuilt) : homeBuilt;
    });
  }, [
    awayFormationKey,
    awayPresetKey,
    homeFormationKey,
    homePresetKey,
    makeSnapshot,
    pushHistory,
    setPlayers,
  ]);

  const onAddOpponentLineup = useCallback(() => {
    if (players.some((p) => p.side === "away")) return;
    pushHistory(makeSnapshot());
    setAwayFormationKey(homeFormationKey);
    setPlayers((prev) => {
      const home = prev.filter((p) => (p.side ?? "home") === "home");
      const away = applyPresetToPlayers(
        createPlayersForFormation(homeFormationKey, undefined, "away"),
        awayPresetKey
      );
      return [...home, ...away];
    });
  }, [
    awayPresetKey,
    homeFormationKey,
    makeSnapshot,
    players,
    pushHistory,
    setAwayFormationKey,
    setPlayers,
  ]);

  const onRemoveOpponentLineup = useCallback(() => {
    if (!players.some((p) => p.side === "away")) return;
    pushHistory(makeSnapshot());
    setPlayers((prev) => prev.filter((p) => (p.side ?? "home") === "home"));
    setOpponentTeamName("");
  }, [makeSnapshot, players, pushHistory, setOpponentTeamName, setPlayers]);

  const onAttackDirectionToggle = useCallback(() => {
    pushHistory(makeSnapshot());
    setAttackFlip((f) => !f);
  }, [makeSnapshot, pushHistory, setAttackFlip]);

  const onPlayerMove = useCallback(
    (id: string, x: number, y: number) => {
      const current = players.find((p) => p.id === id);
      if (!current) return;

      const resolved = resolveDropPosition(id, x, y, players, dropConfig);
      if (
        Math.abs(current.x - resolved.x) < EPS &&
        Math.abs(current.y - resolved.y) < EPS
      ) {
        return;
      }
      pushHistory(makeSnapshot());
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          return { ...p, x: resolved.x, y: resolved.y };
        })
      );
    },
    [dropConfig, makeSnapshot, players, pushHistory, setPlayers]
  );

  const onUpdatePlayer = useCallback(
    (
      id: string,
      patch: Partial<Pick<Player, "name" | "number" | "role" | "isCaptain">>
    ) => {
      setPlayers((prev) => {
        const targetSide = prev.find((x) => x.id === id)?.side ?? "home";
        const next = prev.map((p) => {
          if (p.id !== id) return p;
          return {
            ...p,
            ...patch,
            ...(patch.name !== undefined
              ? { name: sanitizePlayerName(patch.name) }
              : {}),
            ...(patch.role !== undefined
              ? { role: normalizePlayerRole(patch.role) }
              : {}),
          };
        });
        if (patch.isCaptain === true) {
          return next.map((p) =>
            p.id === id
              ? { ...p, isCaptain: true }
              : (p.side ?? "home") === targetSide
                ? { ...p, isCaptain: false }
                : p
          );
        }
        return next;
      });
    },
    [setPlayers]
  );

  return {
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
  };
}
