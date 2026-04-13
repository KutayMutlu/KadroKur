"use client";

import { Group, Rect } from "react-konva";
import type { Player } from "@/types/player";
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

export interface PlayerNodeProps {
  player: Player;
  pitchWidth: number;
  pitchHeight: number;
  verticalLayout?: boolean;
  selected: boolean;
  interactive?: boolean;
  onDragEnd: (id: string, x: number, y: number) => void;
  onEdit?: (id: string) => void;
}

export function PlayerNode({
  player,
  pitchWidth,
  pitchHeight,
  verticalLayout = false,
  selected,
  interactive = true,
  onDragEnd,
  onEdit,
}: PlayerNodeProps) {
  const px = verticalLayout ? player.x * pitchWidth : player.y * pitchWidth;
  const py = verticalLayout
    ? (1 - player.y) * pitchHeight
    : (1 - player.x) * pitchHeight;
  const shortName =
    player.name.length > 6 ? `${player.name.slice(0, 6)}` : player.name;

  const kit = resolveJerseyKit(player);

  return (
    <Group
      x={px}
      y={py}
      draggable={interactive}
      dragBoundFunc={(pos) => {
        const minX = Math.min(DRAG_INSET_X, pitchWidth / 2);
        const maxX = Math.max(pitchWidth - DRAG_INSET_X, pitchWidth / 2);
        const minY = Math.min(DRAG_INSET_Y_TOP, pitchHeight / 2);
        const maxY = Math.max(pitchHeight - DRAG_INSET_Y_BOTTOM, pitchHeight / 2);
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
        const ny = verticalLayout
          ? 1 - node.y() / pitchHeight
          : node.x() / pitchWidth;
        onDragEnd(player.id, nx, ny);
      }}
      onDblClick={() => interactive && onEdit?.(player.id)}
      onDblTap={() => interactive && onEdit?.(player.id)}
    >
      <PlayerJerseyLayer
        kit={kit}
        selected={selected}
        number={player.number}
        shortName={shortName}
        isCaptain={Boolean(player.isCaptain)}
      />
      {/* Geniş dokunma / sürükleme alanı (görünmez, üstte) */}
      <Rect
        x={-DRAG_INSET_X}
        y={-DRAG_INSET_Y_TOP}
        width={DRAG_INSET_X * 2}
        height={DRAG_INSET_Y_TOP + DRAG_INSET_Y_BOTTOM}
        fill="transparent"
        listening={interactive}
      />
    </Group>
  );
}

/** Yaklaşık yatay yarı genişlik (geri uyumluluk / dışarı kullanım) */
export const PLAYER_NODE_RADIUS = DRAG_INSET_X;
