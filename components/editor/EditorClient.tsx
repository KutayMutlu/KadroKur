"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PitchCanvas, type PitchCanvasHandle } from "./PitchCanvas";
import { PlayerEditModal } from "./PlayerEditModal";
import { EditorSidebar } from "./EditorSidebar";
import { createPlayersForFormation } from "@/lib/players-factory";
import {
  applyPresetToPlayers,
  normalizePresetKey,
  type TacticalPresetKey,
} from "@/lib/presets";
import {
  getFormationsByFormat,
  getMatchFormatForFormation,
  type MatchFormatKey,
} from "@/lib/formations";
import { exportStageToPng } from "@/lib/canvas-export";
import { generateShareId, shareUrl } from "@/lib/share";
import {
  getLocalTacticById,
  upsertLocalTactic,
  type StoredTactic,
} from "@/lib/local-tactics";
import {
  formatJerseyNumber,
  normalizeCaptainFlags,
  normalizePlayerRole,
  sanitizePlayerName,
} from "@/lib/player-fields";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { CanvasState } from "@/types/tactic";
import type { Player } from "@/types/player";
import { AuthControls } from "@/components/auth/AuthControls";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, Redo2, SlidersHorizontal, Undo2, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const DEFAULT_MATCH_FORMAT: MatchFormatKey = "7v7";
const DEFAULT_FORMATION = "2-3-1";
const HISTORY_LIMIT = 50;

type BoardSnapshot = {
  matchFormat: MatchFormatKey;
  homeFormationKey: string;
  awayFormationKey: string;
  homePresetKey: TacticalPresetKey;
  awayPresetKey: TacticalPresetKey;
  players: Player[];
  opponentTeamName: string;
  attackFlip: boolean;
};

function rebuildHomePlayers(
  formationKey: string,
  presetKey: TacticalPresetKey,
  prev: Player[],
  includeOpponent: boolean
): Player[] {
  const homePrev = prev.filter((p) => (p.side ?? "home") === "home");
  const awayPrev = includeOpponent ? prev.filter((p) => p.side === "away") : [];
  const home = applyPresetToPlayers(
    createPlayersForFormation(formationKey, homePrev, "home"),
    presetKey
  );
  return includeOpponent ? [...home, ...awayPrev] : home;
}

function rebuildAwayPlayers(
  formationKey: string,
  presetKey: TacticalPresetKey,
  prev: Player[]
): Player[] {
  const homePrev = prev.filter((p) => (p.side ?? "home") === "home");
  const awayPrev = prev.filter((p) => p.side === "away");
  const away = applyPresetToPlayers(
    createPlayersForFormation(formationKey, awayPrev, "away"),
    presetKey
  );
  return [...homePrev, ...away];
}

function snapshotsEqual(a: BoardSnapshot, b: BoardSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function buildCanvasState(
  teamName: string,
  opponentTeamName: string,
  homeFormationKey: string,
  awayFormationKey: string,
  homePresetKey: TacticalPresetKey,
  awayPresetKey: TacticalPresetKey,
  players: Player[],
  attackFlip: boolean
): CanvasState {
  const opp = opponentTeamName.trim();
  return {
    teamName,
    ...(opp ? { opponentTeamName: opp } : {}),
    formation_key: homeFormationKey,
    ...(awayFormationKey === homeFormationKey ? {} : { opponent_formation_key: awayFormationKey }),
    preset_key: homePresetKey === "default" ? null : homePresetKey,
    ...(awayPresetKey === "default" ? {} : { opponent_preset_key: awayPresetKey }),
    players,
    ...(attackFlip ? { attack_flip: true } : {}),
    pitchVersion: 1,
  };
}

export interface EditorClientProps {
  initialTacticId?: string | null;
}

export function EditorClient({ initialTacticId }: EditorClientProps) {
  const stageRef = useRef<PitchCanvasHandle>(null);
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
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pastSnapshots, setPastSnapshots] = useState<BoardSnapshot[]>([]);
  const [futureSnapshots, setFutureSnapshots] = useState<BoardSnapshot[]>([]);
  const [attackFlip, setAttackFlip] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

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

  const restoreSnapshot = useCallback((snapshot: BoardSnapshot) => {
    setMatchFormat(snapshot.matchFormat);
    setHomeFormationKey(snapshot.homeFormationKey);
    setAwayFormationKey(snapshot.awayFormationKey);
    setHomePresetKey(snapshot.homePresetKey);
    setAwayPresetKey(snapshot.awayPresetKey);
    setPlayers(snapshot.players.map((p) => ({ ...p })));
    setOpponentTeamName(snapshot.opponentTeamName ?? "");
    setAttackFlip(snapshot.attackFlip ?? false);
  }, []);

  const loadTactic = useCallback((t: StoredTactic) => {
    const s = t.canvas_state;
    setTeamName(s.teamName);
    setOpponentTeamName(s.opponentTeamName ?? "");
    setAttackFlip(Boolean(s.attack_flip));
    setMatchFormat(
      getMatchFormatForFormation(s.formation_key) ?? DEFAULT_MATCH_FORMAT
    );
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
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getUser().then(({ data }) => {
      setAuthUser(data.user ?? null);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      setIsLg(mq.matches);
      if (mq.matches) setMobileSettingsOpen(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!mobileSettingsOpen || isLg) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileSettingsOpen, isLg]);

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
      setMessage(
        "Bu kayıt bulunamadı. Yeni taktik olarak devam edebilirsiniz."
      );
    });
  }, [initialTacticId, loadTactic]);

  const onHomeFormationChange = (key: string) => {
    if (key === homeFormationKey) return;
    pushHistory(makeSnapshot());
    setHomeFormationKey(key);
    setPlayers((prev) =>
      rebuildHomePlayers(key, homePresetKey, prev, prev.some((p) => p.side === "away"))
    );
  };

  const onAwayFormationChange = (key: string) => {
    if (key === awayFormationKey) return;
    pushHistory(makeSnapshot());
    setAwayFormationKey(key);
    setPlayers((prev) => rebuildAwayPlayers(key, awayPresetKey, prev));
  };

  const onMatchFormatChange = (format: MatchFormatKey) => {
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
  };

  const onHomePresetChange = (nextPresetKey: string) => {
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
  };

  const onAwayPresetChange = (nextPresetKey: string) => {
    pushHistory(makeSnapshot());
    const normalized = normalizePresetKey(nextPresetKey);
    if (normalized === awayPresetKey) return;
    setAwayPresetKey(normalized);
    setPlayers((prev) =>
      rebuildAwayPlayers(awayFormationKey, normalized, prev)
    );
  };

  const onResetPlayerPositions = () => {
    pushHistory(makeSnapshot());
    setPlayers((prev) => {
      const includeOpponent = prev.some((p) => p.side === "away");
      const homeBuilt = rebuildHomePlayers(homeFormationKey, homePresetKey, prev, includeOpponent);
      return includeOpponent ? rebuildAwayPlayers(awayFormationKey, awayPresetKey, homeBuilt) : homeBuilt;
    });
  };

  const onAddOpponentLineup = () => {
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
  };

  const onRemoveOpponentLineup = () => {
    if (!players.some((p) => p.side === "away")) return;
    pushHistory(makeSnapshot());
    setPlayers((prev) => prev.filter((p) => (p.side ?? "home") === "home"));
    setOpponentTeamName("");
  };

  const onAttackDirectionToggle = () => {
    pushHistory(makeSnapshot());
    setAttackFlip((f) => !f);
  };

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

  const onPlayerMove = (id: string, x: number, y: number) => {
    const current = players.find((p) => p.id === id);
    if (current && Math.abs(current.x - x) < 0.0001 && Math.abs(current.y - y) < 0.0001) {
      return;
    }
    pushHistory(makeSnapshot());
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return { ...p, x, y };
      })
    );
  };

  const onUpdatePlayer = (
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
  };

  const handleSave = async () => {
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
  };

  const handleExport = () => {
    const stage = stageRef.current?.getStage();
    if (!stage) return;
    const safe = (tacticTitle || "taktik").replace(/[^\w\-]+/g, "_");
    exportStageToPng(stage, `${safe}.png`);
  };

  const handleCopyShare = async () => {
    if (!shareId) return;
    const url = shareUrl(shareId);
    await navigator.clipboard.writeText(url);
    if (isSupabaseConfigured() && !didSaveOnce) {
      setMessage("Link kopyalandı. Paylaşım için önce Kaydet’e basın.");
    } else {
      setMessage("Link panoya kopyalandı.");
    }
  };

  const availableFormations = getFormationsByFormat(matchFormat);
  const editingPlayer = players.find((p) => p.id === editingId) ?? null;

  const sidebarProps = {
    teamName,
    onTeamNameChange: setTeamName,
    opponentTeamName,
    onOpponentTeamNameChange: setOpponentTeamName,
    hasOpponentLineup: players.some((p) => p.side === "away"),
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
    onTacticTitleChange: setTacticTitle,
    onSave: handleSave,
    onExport: handleExport,
    onCopyShare: handleCopyShare,
    saving,
    shareReady: Boolean(shareId),
    message,
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (editingId) return;
      const isUndo = (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z";
      const isRedo =
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"));
      if (isUndo) {
        e.preventDefault();
        onUndo();
      } else if (isRedo) {
        e.preventDefault();
        onRedo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingId, onRedo, onUndo]);

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-pitch-night pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto flex min-h-0 w-full max-w-none flex-1 flex-col px-3 py-4 sm:px-4 sm:py-6 xl:px-4 lg:h-full">
      <header className="mb-4 shrink-0 min-w-0 space-y-2 sm:mb-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="secondary"
            className="h-9 w-9 shrink-0 p-0"
            title="Ana sayfa"
          >
            <Link href="/" aria-label="Ana sayfaya dön">
              <Home className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <h1
            className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Taktik editörü
          </h1>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onUndo}
              disabled={pastSnapshots.length === 0}
              className="h-9 w-9 p-0 touch-manipulation"
              title="Geri al (Ctrl/Cmd+Z)"
              aria-label="Geri al"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onRedo}
              disabled={futureSnapshots.length === 0}
              className="h-9 w-9 p-0 touch-manipulation"
              title="Yinele (Ctrl/Cmd+Shift+Z)"
              aria-label="Yinele"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <AuthControls guestCompanion={<ThemeToggle />} />
          </div>
        </div>
        <p className="line-clamp-2 text-[11px] leading-snug text-[var(--muted)] sm:text-sm sm:leading-normal">
          Halı saha dizilişi — sürükleyin, kaydedin, paylaşın.
        </p>
      </header>

      {!isLg && mobileSettingsOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
          aria-label="Ayarları kapat"
          onClick={() => setMobileSettingsOpen(false)}
        />
      )}

      {!isLg && (
        <aside
          id="editor-settings-drawer"
          className={`fixed inset-y-0 right-0 z-50 flex w-[min(100vw-1rem,22rem)] max-w-[calc(100vw-0.5rem)] flex-col border-l border-white/10 bg-[var(--card)]/95 shadow-[-12px_0_40px_-20px_rgba(0,0,0,0.85)] backdrop-blur transition-transform duration-200 ease-out pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] ${
            mobileSettingsOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
          aria-hidden={!mobileSettingsOpen}
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
            <span className="text-sm font-semibold tracking-tight">Ayarlar</span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 w-9 shrink-0 p-0"
              onClick={() => setMobileSettingsOpen(false)}
              aria-label="Kapat"
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
            <EditorSidebar {...sidebarProps} />
          </div>
        </aside>
      )}

      {!isLg && (
        <Button
          type="button"
          size="lg"
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 h-14 w-14 rounded-full p-0 shadow-lg touch-manipulation"
          onClick={() => setMobileSettingsOpen((o) => !o)}
          aria-expanded={mobileSettingsOpen}
          aria-controls="editor-settings-drawer"
          title="Takım ve taktik ayarları"
        >
          <SlidersHorizontal className="h-6 w-6" aria-hidden />
        </Button>
      )}

      <div
        className={
          isLg
            ? "grid min-h-0 flex-1 items-stretch gap-4 sm:gap-6 lg:grid-cols-[350px_minmax(0,1fr)]"
            : "flex min-h-0 flex-1 flex-col"
        }
      >
        {isLg && (
          <aside className="h-fit max-h-full overflow-auto rounded-xl border border-white/10 bg-[var(--card)]/85 p-3 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur sm:rounded-2xl sm:p-4 lg:h-full">
            <EditorSidebar {...sidebarProps} />
          </aside>
        )}
        <div
          className={`relative min-h-0 min-w-0 overflow-hidden ${
            isLg ? "lg:h-full" : "flex-1"
          }`}
        >
          <PitchCanvas
            ref={stageRef}
            players={players}
            activePlayerId={editingId}
            attackFlip={attackFlip}
            onLayoutChange={setPitchVertical}
            onPlayerMove={onPlayerMove}
            onEditPlayer={(id) => {
              setEditingId(id);
            }}
          />
        </div>
      </div>
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
