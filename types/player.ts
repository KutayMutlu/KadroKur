import type { JerseyKitRef } from "./jersey";

export type PlayerRole = "kaleci" | "defans" | "orta" | "forvet";

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
}
