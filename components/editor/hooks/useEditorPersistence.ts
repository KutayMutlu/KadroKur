"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getMatchFormatForFormation, type MatchFormatKey } from "@/lib/formations";
import { formatJerseyNumber, normalizeCaptainFlags, normalizePlayerRole, sanitizePlayerName } from "@/lib/player-fields";
import { getLocalTacticById, upsertLocalTactic, type StoredTactic } from "@/lib/local-tactics";
import { generateShareId, shareUrl } from "@/lib/share";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { normalizePresetKey, type TacticalPresetKey } from "@/lib/presets";
import type { CanvasState } from "@/types/tactic";
import type { Player } from "@/types/player";
import { DEFAULT_MATCH_FORMAT } from "../core/constants";
import { buildCanvasState } from "../core/board-state";

interface UseEditorPersistenceParams {
  initialTacticId?: string | null;
  authUser: User | null;
  teamName: string;
  opponentTeamName: string;
  homeFormationKey: string;
  awayFormationKey: string;
  homePresetKey: TacticalPresetKey;
  awayPresetKey: TacticalPresetKey;
  players: Player[];
  attackFlip: boolean;
  tacticTitle: string;
  tacticId: string | null;
  shareId: string | null;
  didSaveOnce: boolean;
  setTeamName: (v: string) => void;
  setOpponentTeamName: (v: string) => void;
  setMatchFormat: (v: MatchFormatKey) => void;
  setHomeFormationKey: (v: string) => void;
  setAwayFormationKey: (v: string) => void;
  setHomePresetKey: (v: TacticalPresetKey) => void;
  setAwayPresetKey: (v: TacticalPresetKey) => void;
  setPlayers: (updater: Player[] | ((prev: Player[]) => Player[])) => void;
  setTacticTitle: (v: string) => void;
  setTacticId: (v: string | null) => void;
  setShareId: (v: string | null) => void;
  setDidSaveOnce: (v: boolean) => void;
}

export function useEditorPersistence({
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
}: UseEditorPersistenceParams) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadTactic = useCallback(
    (t: StoredTactic) => {
      const s = t.canvas_state;
      setTeamName(s.teamName);
      setOpponentTeamName(s.opponentTeamName ?? "");
      setMatchFormat(getMatchFormatForFormation(s.formation_key) ?? DEFAULT_MATCH_FORMAT);
      setHomeFormationKey(s.formation_key);
      setAwayFormationKey(s.opponent_formation_key ?? s.formation_key);
      setHomePresetKey(normalizePresetKey(s.preset_key));
      setAwayPresetKey(normalizePresetKey(s.opponent_preset_key));
      setTacticTitle(t.title);
      setPlayers(
        normalizeCaptainFlags(
          s.players.map((p, i) => ({
            ...p,
            side: p.side === "away" ? "away" : "home",
            name: sanitizePlayerName(String(p.name ?? `Oyuncu ${i + 1}`)),
            number: formatJerseyNumber(String(p.number ?? i + 1)),
            role: normalizePlayerRole(p.role),
          }))
        )
      );
      setTacticId(t.id);
      setShareId(t.share_id);
      setDidSaveOnce(true);
    },
    [
      setAwayFormationKey,
      setAwayPresetKey,
      setDidSaveOnce,
      setHomeFormationKey,
      setHomePresetKey,
      setMatchFormat,
      setOpponentTeamName,
      setPlayers,
      setShareId,
      setTacticId,
      setTacticTitle,
      setTeamName,
    ]
  );

  useEffect(() => {
    if (!initialTacticId) return;
    const t = getLocalTacticById(initialTacticId);
    if (t) {
      loadTactic(t);
      return;
    }
    const sb = getSupabase();
    if (!sb) {
      setShareId(generateShareId());
      setDidSaveOnce(false);
      setMessage(
        "Bu kayıt bu cihazda yok. Paylaşım için yeni bir link oluşturuldu — düzenleyip Kaydet ile buluta yazın."
      );
      return;
    }
    sb.auth.getUser().then(async ({ data }) => {
      const userId = data.user?.id;
      if (!userId) {
        setShareId(generateShareId());
        setDidSaveOnce(false);
        setMessage(
          "Bu kayıt bu cihazda yok. Google ile giriş yaparsanız hesabınızdaki taktikleri de açabilirsiniz."
        );
        return;
      }
      const { data: cloud } = await sb
        .from("tactics")
        .select("id, title, share_id, canvas_state, updated_at")
        .eq("id", initialTacticId)
        .eq("user_id", userId)
        .maybeSingle();
      if (cloud?.canvas_state) {
        loadTactic({
          id: cloud.id,
          title: cloud.title,
          share_id: cloud.share_id,
          canvas_state: cloud.canvas_state as CanvasState,
          updated_at: cloud.updated_at,
        });
        return;
      }
      setShareId(generateShareId());
      setDidSaveOnce(false);
      setMessage("Bu kayıt bulunamadı. Yeni taktik olarak devam edebilirsiniz.");
    });
  }, [initialTacticId, loadTactic, setDidSaveOnce, setShareId]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setMessage(null);
    try {
      const id = tacticId ?? crypto.randomUUID();
      const sid = shareId ?? generateShareId();
      const canvas_state = buildCanvasState(
        teamName,
        opponentTeamName,
        homeFormationKey,
        awayFormationKey,
        homePresetKey,
        awayPresetKey,
        players,
        attackFlip
      );
      const row: StoredTactic = {
        id,
        title: tacticTitle.trim() || "İsimsiz taktik",
        share_id: sid,
        canvas_state,
        updated_at: new Date().toISOString(),
      };
      upsertLocalTactic(row);
      setTacticId(id);
      setShareId(sid);
      setDidSaveOnce(true);

      const sb = getSupabase();
      if (sb) {
        const { error } = await sb.from("tactics").upsert(
          {
            id,
            user_id: authUser?.id ?? null,
            team_id: null,
            title: row.title,
            formation_key: homeFormationKey,
            preset_key: homePresetKey === "default" ? null : homePresetKey,
            canvas_state,
            share_id: sid,
            is_public: true,
            updated_at: row.updated_at,
          },
          { onConflict: "id" }
        );
        if (error) {
          console.warn("Supabase kayıt:", error.message);
        }
      }

      if (!isSupabaseConfigured()) {
        setMessage("Kaydedildi (yalnız bu cihaz).");
      } else if (!authUser) {
        setMessage(
          "Kaydedildi (yalnız bu cihaz). Diğer cihazlarda görmek için giriş yapıp tekrar kaydedin."
        );
      } else {
        setMessage(null);
      }
    } finally {
      setSaving(false);
    }
  }, [
    attackFlip,
    authUser,
    awayFormationKey,
    awayPresetKey,
    homeFormationKey,
    homePresetKey,
    opponentTeamName,
    players,
    setDidSaveOnce,
    setShareId,
    setTacticId,
    shareId,
    tacticId,
    tacticTitle,
    teamName,
  ]);

  const handleCopyShare = useCallback(async () => {
    if (!shareId) return;
    const url = shareUrl(shareId);
    await navigator.clipboard.writeText(url);
    if (isSupabaseConfigured() && !didSaveOnce) {
      setMessage("Link kopyalandı. Paylaşım için önce Kaydet’e basın.");
    } else {
      setMessage("Link panoya kopyalandı.");
    }
  }, [didSaveOnce, shareId]);

  return { saving, message, handleSave, handleCopyShare };
}
