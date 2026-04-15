import type { Player } from "@/types/player";

export type TacticalPresetKey =
  | "default"
  | "press"
  | "counter"
  | "possession"
  | "low_block";

export interface TacticalStyleProfile {
  /** Atak derinliği etkisi (ileri/geri). Derinlik ekseni: y */
  lineDepthBias: number;
  /** Takımın yatay genişliğini merkezde toplama etkisi. Genişlik ekseni: x */
  widthCompactnessBias: number;
  /** Top kazanıldıktan sonraki ileri çıkış niyeti (özellikle forvet/orta). */
  transitionDepthBias: number;
}

export interface TacticalPresetDefinition {
  key: TacticalPresetKey;
  label: string;
  description: string;
  style: TacticalStyleProfile;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** x = saha genişliği (sol-sağ); y = atak derinliği (geri-ileri) */
const ROLE_Y_BOUNDS: Record<Player["role"], { min: number; max: number }> = {
  kaleci: { min: 0.03, max: 0.18 },
  defans: { min: 0.12, max: 0.72 },
  orta: { min: 0.2, max: 0.82 },
  forvet: { min: 0.32, max: 0.95 },
};

/** Hazır taktik preset anahtarları + oyuncu yerleşim davranışı */
export const TACTIC_PRESETS: Record<TacticalPresetKey, TacticalPresetDefinition> = {
  default: {
    key: "default",
    label: "Standart",
    description: "Dengeli ve manuel düzenlenebilir yerleşim.",
    style: { lineDepthBias: 0, widthCompactnessBias: 0, transitionDepthBias: 0 },
  },
  press: {
    key: "press",
    label: "Yüksek pres",
    description: "Hatlar önde ve kompakt; top kaybında hızlı baskı.",
    style: { lineDepthBias: 0.08, widthCompactnessBias: 0.12, transitionDepthBias: 0.03 },
  },
  counter: {
    key: "counter",
    label: "Kontra",
    description: "Daha geride blok; geçişte hızlı çıkış.",
    style: { lineDepthBias: -0.06, widthCompactnessBias: 0.06, transitionDepthBias: 0.1 },
  },
  possession: {
    key: "possession",
    label: "Topa sahip olma",
    description: "Hatlar dengeli, pas açıları için daha geniş konumlanma.",
    style: { lineDepthBias: 0.02, widthCompactnessBias: -0.1, transitionDepthBias: -0.02 },
  },
  low_block: {
    key: "low_block",
    label: "Düşük blok",
    description: "Ceza sahası çevresinde derin ve dar savunma hattı.",
    style: { lineDepthBias: -0.11, widthCompactnessBias: 0.14, transitionDepthBias: -0.02 },
  },
};

export function normalizePresetKey(value: string | null | undefined): TacticalPresetKey {
  if (!value) return "default";
  return value in TACTIC_PRESETS ? (value as TacticalPresetKey) : "default";
}

/** Tek takım dilimi — kaleci (indeks 0) preset kaydırmaya girmez. */
function applyPresetTeamSlice(
  players: Player[],
  presetKey: TacticalPresetKey
): Player[] {
  const preset = TACTIC_PRESETS[presetKey];
  if (!preset || preset.key === "default") {
    return players;
  }
  const { lineDepthBias, widthCompactnessBias, transitionDepthBias } = preset.style;

  const roleLineFactor: Record<Player["role"], number> =
    presetKey === "press"
      ? { kaleci: 0.15, defans: 0.8, orta: 1, forvet: 1.15 }
      : presetKey === "low_block"
        ? { kaleci: 0.1, defans: 1, orta: 0.75, forvet: 0.35 }
        : { kaleci: 0.1, defans: 0.65, orta: 0.85, forvet: 0.95 };

  const roleTransitionFactor: Record<Player["role"], number> =
    presetKey === "counter"
      ? { kaleci: 0, defans: 0.15, orta: 0.6, forvet: 1.2 }
      : { kaleci: 0, defans: 0.2, orta: 0.55, forvet: 0.85 };

  return players.map((p, i) => {
    if (p.role === "kaleci" || i === 0) {
      return p;
    }

    const nextY = clamp01(
      clamp(
        p.y +
          lineDepthBias * roleLineFactor[p.role] +
          transitionDepthBias * roleTransitionFactor[p.role],
        ROLE_Y_BOUNDS[p.role].min,
        ROLE_Y_BOUNDS[p.role].max
      )
    );

    const nextX = clamp01(
      clamp(p.x + (0.5 - p.x) * widthCompactnessBias, 0.08, 0.92)
    );

    return { ...p, x: nextX, y: nextY };
  });
}

export function applyPresetToPlayers(
  players: Player[],
  presetKey: TacticalPresetKey
): Player[] {
  const preset = TACTIC_PRESETS[presetKey];
  if (!preset || preset.key === "default") {
    return players;
  }

  const home = players.filter((p) => (p.side ?? "home") === "home");
  const away = players.filter((p) => p.side === "away");

  const homeOut = applyPresetTeamSlice(home, presetKey);
  /* Rakip: önce “ev koordinatına” çevir, preset uygula, tekrar sahaya yansıt */
  const awayVirtual = away.map((p) => ({ ...p, y: 1 - p.y }));
  const awayVirtOut = applyPresetTeamSlice(awayVirtual, presetKey);
  const awayOut = awayVirtOut.map((p, i) => ({
    ...away[i],
    ...p,
    y: 1 - p.y,
    side: "away" as const,
  }));

  return [...homeOut, ...awayOut];
}
