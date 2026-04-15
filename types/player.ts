import type { JerseyKitRef } from "./jersey";

export type PlayerRole = "kaleci" | "defans" | "orta" | "forvet";

/** Kendi takım (siz) veya rakip — yoksa home kabul edilir (eski kayıtlar). */
export type PlayerTeamSide = "home" | "away";

export interface Player {
  id: string;
  name: string;
  number: string;
  role: PlayerRole;
  /** Takım kaptanı; takımda en fazla biri true olmalı */
  isCaptain?: boolean;
  /** Ana forma rengi */
  color: string;
  /**
   * İsteğe bağlı forma şablonu / ikincil renkler.
   * İleride: kullanıcı kitleri, özel SVG, takım setleri.
   */
  kit?: JerseyKitRef;
  /** 0–1 normalized, origin top-left of pitch */
  x: number;
  y: number;
  /** Hangi takım — rakip dizilişi için away */
  side?: PlayerTeamSide;
}
