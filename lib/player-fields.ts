import type { Player, PlayerRole } from "@/types/player";

const ROLES: PlayerRole[] = ["kaleci", "defans", "orta", "forvet"];

/** JSON / eski veride bozuk rol gelirse Select boş kalmasın */
export function normalizePlayerRole(value: unknown): PlayerRole {
  if (typeof value === "string" && ROLES.includes(value as PlayerRole)) {
    return value as PlayerRole;
  }
  return "orta";
}

/** Takım başına en fazla bir kaptan (kendi takım / rakip ayrı). */
export function normalizeCaptainFlags(players: Player[]): Player[] {
  let homeCaptain = false;
  let awayCaptain = false;
  return players.map((p) => {
    const side = p.side ?? "home";
    const wants = Boolean(p.isCaptain);
    if (!wants) return { ...p, isCaptain: false };
    if (side === "away") {
      if (awayCaptain) return { ...p, isCaptain: false };
      awayCaptain = true;
      return { ...p, isCaptain: true };
    }
    if (homeCaptain) return { ...p, isCaptain: false };
    homeCaptain = true;
    return { ...p, isCaptain: true };
  });
}

/** Oyuncu adı ve forma numarası alanları — editör ve yükleme için ortak */

/** İsim: kayıt ve gösterim üst sınırı */
export const PLAYER_NAME_MAX_LEN = 24;

/**
 * Yazarken: izin verilen karakterler dışındakileri atar, çift boşlukları sadeleştirir, uzunluk keser.
 * (Unicode harfler: Türkçe İ, ğ vb. dahil.)
 */
export function filterPlayerNameInput(value: string): string {
  return value
    .replace(/[^\p{L}\p{N}\s.'-]/gu, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, PLAYER_NAME_MAX_LEN);
}

export function sanitizeJerseyInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 2);
}

export function formatJerseyNumber(value: string): string {
  const digits = sanitizeJerseyInput(value);
  if (!digits) return "01";
  if (digits.length === 1) return `0${digits}`;
  return digits === "00" ? "01" : digits;
}

export function sanitizePlayerName(value: string): string {
  return filterPlayerNameInput(value).trim();
}
