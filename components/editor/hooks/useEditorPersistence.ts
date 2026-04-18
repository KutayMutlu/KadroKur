"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getMatchFormatForFormation, type MatchFormatKey } from "@/lib/formations";
import { formatJerseyNumber, normalizeCaptainFlags, normalizePlayerRole, sanitizePlayerName } from "@/lib/player-fields";
import { getLocalTacticById, upsertLocalTactic, type StoredTactic } from "@/lib/local-tactics";
import { generateShareId, shareUrl } from "@/lib/share";
import { shareHttpUrl } from "@/lib/share-web-url";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { normalizePresetKey, type TacticalPresetKey } from "@/lib/presets";
import type { CanvasState } from "@/types/tactic";
import type { Player } from "@/types/player";
import { DEFAULT_MATCH_FORMAT } from "../core/constants";
import { buildCanvasState } from "../core/board-state";

type MessageTone = "success" | "warning";

/** Eski projelerde tactics.owner_name yokken PostgREST şema hatası */
function isMissingOwnerNameColumnError(msg: string | undefined): boolean {
  if (!msg) return false;
  const m = msg.toLowerCase();
  return m.includes("owner_name") && (m.includes("schema cache") || m.includes("column"));
}

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
  /** Hesaba bulut yazımı başarılı — inline mesaj yerine toast */
  onTacticSavedToCloud?: () => void;
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
  onTacticSavedToCloud,
}: UseEditorPersistenceParams) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<MessageTone>("warning");
  const isAuthenticated = Boolean(authUser);
  const canCopyShare = isAuthenticated && didSaveOnce && Boolean(shareId);
  const ownerName = useMemo(() => {
    const metadata = (authUser?.user_metadata ?? {}) as Record<string, unknown>;
    const fromMeta =
      (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
      (typeof metadata.name === "string" && metadata.name.trim()) ||
      null;
    if (fromMeta) return fromMeta;
    const email = authUser?.email?.trim();
    if (email && email.includes("@")) return email.split("@")[0];
    return "KadroKur kullanıcısı";
  }, [authUser]);

  const copyBlockedMessage = !isAuthenticated
    ? "Paylaşım linki için lütfen giriş yapın."
    : "Paylaşım linkini kopyalamadan önce lütfen taktiği kaydedin.";

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
      setMessageTone("warning");
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
        setMessageTone("warning");
        setMessage(
          "Bu kayıt bu cihazda yok. Google ile giriş yaparsanız hesabınızdaki taktikleri de açabilirsiniz."
        );
        return;
      }
      const { data: cloud } = await sb
        .from("tactics")
        .select("id, title, share_id, canvas_state, updated_at, home_team_name, away_team_name")
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
      setMessageTone("warning");
      setMessage("Bu kayıt bulunamadı. Yeni taktik olarak devam edebilirsiniz.");
    });
  }, [initialTacticId, loadTactic, setDidSaveOnce, setShareId]);

  const handleSave = useCallback(async () => {
    const normalizedTitle = tacticTitle.trim();
    if (!normalizedTitle) {
      setMessageTone("warning");
      setMessage("Lütfen önce taktik adını girin.");
      return;
    }

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
        title: normalizedTitle,
        share_id: sid,
        canvas_state,
        updated_at: new Date().toISOString(),
      };
      upsertLocalTactic(row);
      setTacticId(id);
      setShareId(sid);
      setDidSaveOnce(true);

      let cloudAttempted = false;
      let cloudSaveFailed = false;
      const sb = getSupabase();
      const uid = authUser?.id;

      if (sb && uid) {
        cloudAttempted = true;
        const fullRow = {
          id,
          user_id: uid,
          team_id: null as string | null,
          owner_name: ownerName,
          title: row.title,
          home_team_name: teamName.trim(),
          away_team_name: opponentTeamName.trim(),
          formation_key: homeFormationKey,
          preset_key: homePresetKey === "default" ? null : homePresetKey,
          canvas_state,
          share_id: sid,
          is_public: true,
          updated_at: row.updated_at,
        };

        let { error } = await sb.from("tactics").upsert(fullRow, { onConflict: "id" });

        if (error && isMissingOwnerNameColumnError(error.message)) {
          const { owner_name, ...withoutOwner } = fullRow;
          void owner_name;
          ({ error } = await sb.from("tactics").upsert(withoutOwner, { onConflict: "id" }));
        }

        if (error) {
          cloudSaveFailed = true;
          console.warn("Supabase kayıt:", error.message, error);
        }
      }

      if (!isSupabaseConfigured()) {
        setMessageTone("success");
        setMessage("Kaydedildi (yalnız bu cihaz).");
      } else if (!authUser) {
        setMessageTone("warning");
        setMessage(
          "Kaydedildi (yalnız bu cihaz). Diğer cihazlarda görmek için giriş yapıp tekrar kaydedin."
        );
      } else if (cloudAttempted && cloudSaveFailed) {
        setMessageTone("warning");
        setMessage(
          "Bu cihazda kaydedildi; buluta yazılamadı. Bağlantınızı ve oturumunuzu kontrol edip yeniden deneyin."
        );
      } else if (cloudAttempted && !cloudSaveFailed) {
        setMessage(null);
        onTacticSavedToCloud?.();
      } else {
        setMessageTone("success");
        setMessage("Taktik bu cihazda kaydedildi.");
      }
    } catch (err) {
      console.error("handleSave:", err);
      setMessageTone("warning");
      setMessage("Kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
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
    ownerName,
    onTacticSavedToCloud,
  ]);

  const handleCopyShare = useCallback(async () => {
    if (!isAuthenticated) {
      setMessageTone("warning");
      setMessage("Paylaşım linki için lütfen giriş yapın.");
      return;
    }
    if (!didSaveOnce || !shareId) {
      setMessageTone("warning");
      setMessage("Paylaşım linkini kopyalamadan önce lütfen taktiği kaydedin.");
      return;
    }
    const url = shareUrl(shareId);
    await navigator.clipboard.writeText(url);
    setMessageTone("success");
    setMessage("Link panoya kopyalandı.");
  }, [didSaveOnce, isAuthenticated, shareId]);

  const handleShareLink = useCallback(async () => {
    if (!isAuthenticated) {
      setMessageTone("warning");
      setMessage("Paylaşım linki için lütfen giriş yapın.");
      return;
    }
    if (!didSaveOnce || !shareId) {
      setMessageTone("warning");
      setMessage("Paylaşım linkini paylaşmadan önce lütfen taktiği kaydedin.");
      return;
    }
    const url = shareUrl(shareId);
    const result = await shareHttpUrl(url, {
      title: "KadroKur taktik",
      text: "Taktik paylaşım linki:",
    });
    if (result === "shared") {
      setMessageTone("success");
      setMessage("Paylaşım menüsü açıldı.");
      return;
    }
    if (result === "cancelled") return;
    await navigator.clipboard.writeText(url);
    setMessageTone("success");
    setMessage("Link panoya kopyalandı.");
  }, [didSaveOnce, isAuthenticated, shareId]);

  return {
    saving,
    message,
    messageTone,
    canCopyShare,
    copyBlockedMessage,
    handleSave,
    handleCopyShare,
    handleShareLink,
  };
}
