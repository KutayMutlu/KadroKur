"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PitchCanvas, type PitchCanvasHandle } from "./PitchCanvas";
import { PlayerEditModal } from "./PlayerEditModal";
import { FormationSelector } from "./FormationSelector";
import { MatchFormatSelector } from "./MatchFormatSelector";
import { TeamPanel } from "./TeamPanel";
import { Toolbar } from "./Toolbar";
import { createPlayersForFormation } from "@/lib/players-factory";
import {
  TACTIC_PRESETS,
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
import { Redo2, Undo2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const DEFAULT_MATCH_FORMAT: MatchFormatKey = "7v7";
const DEFAULT_FORMATION = "2-3-1";
const HISTORY_LIMIT = 50;

type BoardSnapshot = {
  matchFormat: MatchFormatKey;
  formationKey: string;
  presetKey: TacticalPresetKey;
  players: Player[];
};

function snapshotsEqual(a: BoardSnapshot, b: BoardSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function buildCanvasState(
  teamName: string,
  formationKey: string,
  presetKey: TacticalPresetKey,
  players: Player[]
): CanvasState {
  return {
    teamName,
    formation_key: formationKey,
    preset_key: presetKey === "default" ? null : presetKey,
    players,
    pitchVersion: 1,
  };
}

export interface EditorClientProps {
  initialTacticId?: string | null;
}

export function EditorClient({ initialTacticId }: EditorClientProps) {
  const stageRef = useRef<PitchCanvasHandle>(null);
  const [matchFormat, setMatchFormat] =
    useState<MatchFormatKey>(DEFAULT_MATCH_FORMAT);
  const [formationKey, setFormationKey] = useState(DEFAULT_FORMATION);
  const [presetKey, setPresetKey] = useState<TacticalPresetKey>("default");
  const [teamName, setTeamName] = useState("");
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

  const makeSnapshot = useCallback(
    (): BoardSnapshot => ({
      matchFormat,
      formationKey,
      presetKey,
      players: players.map((p) => ({ ...p })),
    }),
    [formationKey, matchFormat, players, presetKey]
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
    setFormationKey(snapshot.formationKey);
    setPresetKey(snapshot.presetKey);
    setPlayers(snapshot.players.map((p) => ({ ...p })));
  }, []);

  const loadTactic = useCallback((t: StoredTactic) => {
    const s = t.canvas_state;
    setTeamName(s.teamName);
    setMatchFormat(
      getMatchFormatForFormation(s.formation_key) ?? DEFAULT_MATCH_FORMAT
    );
    setFormationKey(s.formation_key);
    setPresetKey(normalizePresetKey(s.preset_key));
    setTacticTitle(t.title);
    setPlayers(
      normalizeCaptainFlags(
        s.players.map((p, i) => ({
          ...p,
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

  const onFormationChange = (key: string) => {
    if (key === formationKey) return;
    pushHistory(makeSnapshot());
    setFormationKey(key);
    setPlayers((prev) =>
      applyPresetToPlayers(createPlayersForFormation(key, prev), presetKey)
    );
  };

  const onMatchFormatChange = (format: MatchFormatKey) => {
    if (format === matchFormat) return;
    pushHistory(makeSnapshot());
    setMatchFormat(format);
    const formations = getFormationsByFormat(format);
    const nextFormation = formations[0]?.key;
    if (!nextFormation) return;
    setFormationKey(nextFormation);
    setPlayers((prev) =>
      applyPresetToPlayers(createPlayersForFormation(nextFormation, prev), presetKey)
    );
  };

  const onPresetChange = (nextPresetKey: string) => {
    pushHistory(makeSnapshot());
    const normalized = normalizePresetKey(nextPresetKey);
    if (normalized === presetKey) return;
    setPresetKey(normalized);
    setPlayers((prev) =>
      applyPresetToPlayers(createPlayersForFormation(formationKey, prev), normalized)
    );
  };

  const onResetPlayerPositions = () => {
    pushHistory(makeSnapshot());
    setPlayers((prev) =>
      applyPresetToPlayers(createPlayersForFormation(formationKey, prev), presetKey)
    );
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
          p.id === id ? { ...p, isCaptain: true } : { ...p, isCaptain: false }
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
        formationKey,
        presetKey,
        players
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
            formation_key: formationKey,
            preset_key: presetKey === "default" ? null : presetKey,
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
    <div className="min-h-screen overflow-x-hidden bg-pitch-night lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto w-full max-w-none px-3 py-6 xl:px-4 lg:flex lg:h-full lg:flex-col">
      <header className="mb-6 min-w-0 space-y-2">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <h1
            className="min-w-0 truncate text-xl font-semibold tracking-tight sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Taktik editörü
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <AuthControls guestCompanion={<ThemeToggle />} />
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] sm:text-sm">
          Halı saha dizilişi — sürükleyin, kaydedin, paylaşın.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onUndo}
            disabled={pastSnapshots.length === 0}
            className="h-9 w-9 p-0"
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
            className="h-9 w-9 p-0"
            title="Yinele (Ctrl/Cmd+Shift+Z)"
            aria-label="Yinele"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid items-stretch gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[350px_minmax(0,1fr)]">
        <aside className="order-2 h-fit rounded-2xl border border-white/10 bg-[var(--card)]/85 p-4 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur lg:order-1 lg:h-full lg:overflow-auto">
          <div className="space-y-4">
            <TeamPanel
              teamName={teamName}
              onTeamNameChange={setTeamName}
            />
            <div className="space-y-3 rounded-xl border border-white/10 bg-black/10 p-3">
              <MatchFormatSelector value={matchFormat} onChange={onMatchFormatChange} />
              <FormationSelector
                value={formationKey}
                onChange={onFormationChange}
                options={availableFormations}
              />
              <div>
                <Label>Preset taktik</Label>
                <Select value={presetKey} onValueChange={onPresetChange}>
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
            <Toolbar
              tacticTitle={tacticTitle}
              onTacticTitleChange={setTacticTitle}
              onSave={handleSave}
              onExport={handleExport}
              onCopyShare={handleCopyShare}
              saving={saving}
              shareReady={Boolean(shareId)}
              message={message}
            />
          </div>
        </aside>
        <div className="order-1 relative min-w-0 overflow-hidden h-[72dvh] lg:order-2 lg:h-full">
          <PitchCanvas
            ref={stageRef}
            players={players}
            activePlayerId={editingId}
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
