"use client";

import { useEffect, useId, useRef, useState, useCallback } from "react";
import { useLocale } from "@/components/locale-provider";
import type { Player, PlayerRole } from "@/types/player";
import type { UiStrings } from "@/lib/ui-strings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PLAYER_NAME_MAX_LEN,
  filterPlayerNameInput,
  formatJerseyNumber,
  normalizePlayerRole,
  sanitizeJerseyInput,
  sanitizePlayerName,
} from "@/lib/player-fields";

const ROLE_ORDER: PlayerRole[] = ["kaleci", "defans", "orta", "forvet"];

function roleLabel(ui: UiStrings, role: PlayerRole): string {
  const m: Record<PlayerRole, string> = {
    kaleci: ui.editorRoleKaleci,
    defans: ui.editorRoleDefans,
    orta: ui.editorRoleOrta,
    forvet: ui.editorRoleForvet,
  };
  return m[role];
}

export type PlayerEditModalProps = {
  player: Player | null;
  onClose: () => void;
  onUpdatePlayer: (
    id: string,
    patch: Partial<Pick<Player, "name" | "number" | "role" | "isCaptain">>
  ) => void;
};

export function PlayerEditModal({
  player,
  onClose,
  onUpdatePlayer,
}: PlayerEditModalProps) {
  const { strings: ui } = useLocale();
  const titleId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const jerseyDraftRef = useRef("");
  const roleDraftRef = useRef<PlayerRole>("orta");
  const [nameDraft, setNameDraft] = useState("");
  const [roleDraft, setRoleDraft] = useState<PlayerRole>("orta");
  const [jerseyDraft, setJerseyDraft] = useState("");
  const [jerseyError, setJerseyError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [captainDraft, setCaptainDraft] = useState(false);

  const setJerseyDraftBoth = useCallback((value: string) => {
    jerseyDraftRef.current = value;
    setJerseyDraft(value);
  }, []);

  /* Oyuncu değişince veya modal kapanınca taslakları yükle / temizle */
  useEffect(() => {
    if (!player) {
      setNameDraft("");
      setRoleDraft("orta");
      roleDraftRef.current = "orta";
      jerseyDraftRef.current = "";
      setJerseyDraft("");
      setJerseyError(null);
      setNameError(null);
      setCaptainDraft(false);
      return;
    }
    const r = normalizePlayerRole(player.role);
    setNameDraft(player.name);
    setRoleDraft(r);
    roleDraftRef.current = r;
    jerseyDraftRef.current = player.number;
    setJerseyDraft(player.number);
    setCaptainDraft(Boolean(player.isCaptain));
    setJerseyError(null);
    setNameError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- alanları izliyoruz; player nesnesinin tamamı her render değişebilir
  }, [player?.id, player?.name, player?.number, player?.role, player?.isCaptain]);

  /* Modal açıldığında isim alanına odak */
  useEffect(() => {
    if (!player) return;
    const id = requestAnimationFrame(() => nameInputRef.current?.focus());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player?.id]);

  const discardClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const save = useCallback(() => {
    if (!player) return;
    const formatted = formatJerseyNumber(jerseyDraftRef.current);
    const raw = sanitizeJerseyInput(jerseyDraftRef.current);
    if (!raw) {
      setJerseyError(ui.editorJerseyErrorRange);
      return;
    }
    if (raw === "00") {
      setJerseyError(ui.editorJerseyErrorLeadingZero);
      return;
    }
    const name = sanitizePlayerName(nameDraft);
    if (!name) {
      setNameError(ui.editorNameErrorEmpty);
      return;
    }
    setNameError(null);
    const role = normalizePlayerRole(roleDraftRef.current);
    onUpdatePlayer(player.id, {
      name,
      number: formatted,
      role,
      isCaptain: captainDraft,
    });
    onClose();
  }, [captainDraft, nameDraft, onClose, onUpdatePlayer, player, ui]);

  useEffect(() => {
    if (!player) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      discardClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [player, discardClose]);

  if (!player) return null;

  return (
    <>
      <div
        className="animate-player-edit-backdrop fixed inset-0 z-40 bg-[var(--bg-deep)]/55 backdrop-blur-sm"
        onClick={discardClose}
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="animate-player-edit-panel pointer-events-auto flex w-full max-w-[min(92vw,420px)] flex-col rounded-t-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/96 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.65)] max-sm:max-h-[min(88dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-0.5rem))] max-sm:overflow-hidden sm:max-h-none sm:overflow-visible sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5 sm:pb-3.5 sm:pt-5">
              <div className="min-w-0">
                <p
                  id={titleId}
                  className="text-base font-semibold tracking-tight text-[var(--foreground)]"
                >
                  {ui.editorPlayerEditTitle}
                </p>
                {player.side === "away" && (
                  <p className="mt-1 text-xs font-medium text-sky-400/90">
                    {ui.editorPlayerOpponentTeam}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={discardClose}
              >
                {ui.editorPlayerClose}
              </Button>
            </div>

            <div className="min-h-0 touch-pan-y overflow-x-hidden px-4 max-sm:flex-1 max-sm:overflow-y-auto max-sm:overscroll-y-contain max-sm:[scrollbar-width:thin] sm:flex-none sm:overflow-visible sm:px-5">
              <div className="space-y-3 pb-1 sm:space-y-3.5 sm:pb-0">
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <Label htmlFor="player-edit-name">{ui.editorNameLabel}</Label>
                  <span
                    className="text-xs tabular-nums text-[var(--muted)]"
                    aria-live="polite"
                  >
                    {nameDraft.length}/{PLAYER_NAME_MAX_LEN}
                  </span>
                </div>
                <Input
                  ref={nameInputRef}
                  id="player-edit-name"
                  className={`mt-1.5 ${nameError ? "border-red-500/80 focus-visible:ring-red-500/50" : ""}`}
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={PLAYER_NAME_MAX_LEN}
                  value={nameDraft}
                  onChange={(e) => {
                    setNameDraft(filterPlayerNameInput(e.target.value));
                    if (nameError) setNameError(null);
                  }}
                />
                <p className="mt-1.5 text-xs text-[var(--muted)]">
                  {nameError ?? ui.editorNameHint}
                </p>
              </div>
              <div>
                <Label htmlFor="player-edit-role">{ui.editorRoleLabel}</Label>
                <select
                  id="player-edit-role"
                  className="mt-1.5 flex h-9 w-full rounded-md border border-slate-600 bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  value={roleDraft}
                  onChange={(e) => {
                    const v = normalizePlayerRole(e.target.value);
                    roleDraftRef.current = v;
                    setRoleDraft(v);
                  }}
                >
                  {ROLE_ORDER.map((key) => (
                    <option key={key} value={key}>
                      {roleLabel(ui, key)}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-[var(--muted)]">
                  {ui.editorRoleHelp}
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-deep)]/40 px-3 py-2.5">
                <input
                  id="player-edit-captain"
                  type="checkbox"
                  checked={captainDraft}
                  onChange={(e) => setCaptainDraft(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-600 accent-[var(--accent)]"
                />
                <div className="min-w-0 flex-1">
                  <Label
                    htmlFor="player-edit-captain"
                    className="cursor-pointer text-[var(--foreground)]"
                  >
                    {ui.editorCaptainLabel}
                  </Label>
                  <p className="mt-1 text-xs leading-snug text-[var(--muted)]">
                    {ui.editorCaptainHelp}
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor="player-edit-number">{ui.editorJerseyLabel}</Label>
                <Input
                  id="player-edit-number"
                  type="text"
                  inputMode="numeric"
                  placeholder={ui.editorJerseyPlaceholder}
                  className="mt-1.5"
                  value={jerseyDraft}
                  onChange={(e) => {
                    const next = sanitizeJerseyInput(e.target.value);
                    setJerseyDraftBoth(next);
                    if (!next) {
                      setJerseyError(ui.editorJerseyErrorRange);
                      return;
                    }
                    setJerseyError(
                      next === "00" ? ui.editorJerseyErrorLeadingZero : null
                    );
                  }}
                  onBlur={() => {
                    const formatted = formatJerseyNumber(jerseyDraftRef.current);
                    jerseyDraftRef.current = formatted;
                    setJerseyDraft(formatted);
                    setJerseyError(null);
                  }}
                />
                <p className="mt-1.5 text-xs text-[var(--muted)]">
                  {jerseyError ?? ui.editorJerseyHint}
                </p>
              </div>
              </div>
            </div>

            <div className="flex shrink-0 justify-end border-t border-[var(--border-subtle)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-4 sm:pt-4">
              <Button
                type="submit"
                className="bg-green-800 text-white hover:bg-lime-600"
              >
                {ui.editorSave}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
