"use client";

import { Group, Rect } from "react-konva";
import type { Player } from "@/types/player";
import { visualAttackY, storedAttackYFromVisual } from "@/lib/attack-direction";
import { getPlayerNameMaxChars } from "@/lib/player-node-scale";
import { resolveJerseyKit } from "@/lib/jersey-kit";
import { PlayerJerseyLayer } from "./PlayerJerseyLayer";

/**
 * Sürükleme: Group merkezi sahada; ikon + hafif gölge kadar iç boşluk.
 * (Eski 70px yarı genişlik gerçek çizimden büyüktü → kenarlarda gereksiz boşluk.)
 */
const DRAG_INSET_X = 46;
/** Üst: gölge/omuz çizgisi taşmasın diye biraz fazla pay */
const DRAG_INSET_Y_TOP = 34;
const DRAG_INSET_Y_BOTTOM = 34;

/** Yaklaşık yarı genişlik; küçük ekranda ~44px minimum dokunma için taban */
const MIN_HIT_HALF = 22;

export interface PlayerNodeProps {
  player: Player;
  pitchWidth: number;
  pitchHeight: number;
  verticalLayout?: boolean;
  selected: boolean;
  interactive?: boolean;
  /** true: atak ekseni yatay/dikeyde aynalanır (home + away birlikte) */
  attackFlip?: boolean;
  onDragEnd: (id: string, x: number, y: number) => void;
  onEdit?: (id: string) => void;
  /** Forma çizimi ölçeği (1 = referans); dokunma alanı bundan küçülmez */
  visualScale?: number;
}

export function PlayerNode({
  player,
  pitchWidth,
  pitchHeight,
  verticalLayout = false,
  selected,
  interactive = true,
  attackFlip = false,
  onDragEnd,
  onEdit,
  visualScale = 1,
}: PlayerNodeProps) {
  const yVis = visualAttackY(player.y, attackFlip);
  const px = verticalLayout ? player.x * pitchWidth : yVis * pitchWidth;
  const py = verticalLayout
    ? (1 - yVis) * pitchHeight
    : (1 - player.x) * pitchHeight;
  const nameMax = getPlayerNameMaxChars(visualScale);
  const shortName =
    player.name.length > nameMax ? `${player.name.slice(0, nameMax)}` : player.name;

  const kit = resolveJerseyKit(player);

  const hitInsetX = Math.max(DRAG_INSET_X * visualScale, MIN_HIT_HALF);
  const hitInsetYTop = Math.max(DRAG_INSET_Y_TOP * visualScale, MIN_HIT_HALF);
  const hitInsetYBottom = Math.max(DRAG_INSET_Y_BOTTOM * visualScale, MIN_HIT_HALF);

  return (
    <Group
      x={px}
      y={py}
      draggable={interactive}
      dragBoundFunc={(pos) => {
        const minX = Math.min(hitInsetX, pitchWidth / 2);
        const maxX = Math.max(pitchWidth - hitInsetX, pitchWidth / 2);
        const minY = Math.min(hitInsetYTop, pitchHeight / 2);
        const maxY = Math.max(pitchHeight - hitInsetYBottom, pitchHeight / 2);
        return {
          x: Math.max(minX, Math.min(maxX, pos.x)),
          y: Math.max(minY, Math.min(maxY, pos.y)),
        };
      }}
      onDragEnd={(e) => {
        const node = e.target;
        const nx = verticalLayout
          ? node.x() / pitchWidth
          : 1 - node.y() / pitchHeight;
        const yVisual = verticalLayout
          ? 1 - node.y() / pitchHeight
          : node.x() / pitchWidth;
        const ny = storedAttackYFromVisual(yVisual, attackFlip);
        onDragEnd(player.id, nx, ny);
      }}
      onDblClick={() => interactive && onEdit?.(player.id)}
      onDblTap={() => interactive && onEdit?.(player.id)}
    >
      <PlayerJerseyLayer
        kit={kit}
        variant={(player.side ?? "home") === "away" ? "away" : "home"}
        selected={selected}
        number={player.number}
        shortName={shortName}
        isCaptain={Boolean(player.isCaptain)}
        visualScale={visualScale}
      />
      {/* Geniş dokunma / sürükleme alanı (görünmez, üstte) */}
      <Rect
        x={-hitInsetX}
        y={-hitInsetYTop}
        width={hitInsetX * 2}
        height={hitInsetYTop + hitInsetYBottom}
        fill="transparent"
        listening={interactive}
      />
    </Group>
  );
}

/** Yaklaşık yatay yarı genişlik (geri uyumluluk / dışarı kullanım) */
export const PLAYER_NODE_RADIUS = DRAG_INSET_X;
