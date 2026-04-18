"use client";

import { useMemo, memo } from "react";
import { Group, Rect } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Vector2d } from "konva/lib/types";
import type { Player } from "@/types/player";
import { visualAttackY, storedAttackYFromVisual } from "@/lib/attack-direction";
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
  /** jersey: forma katmanı (drag + etkileşim), label: isim etiketi katmanı */
  renderMode?: "jersey" | "label";
  onDragStart?: (id: string) => void;
  hitInsetX?: number;
  hitInsetYTop?: number;
  hitInsetYBottom?: number;
}

function PlayerNodeInner({
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
  renderMode = "jersey",
  onDragStart,
  hitInsetX,
  hitInsetYTop,
  hitInsetYBottom,
}: PlayerNodeProps) {
  const yVis = visualAttackY(player.y, attackFlip);
  const px = verticalLayout ? player.x * pitchWidth : yVis * pitchWidth;
  const py = verticalLayout
    ? (1 - yVis) * pitchHeight
    : (1 - player.x) * pitchHeight;

  const kit = resolveJerseyKit(player);

  const insetX = hitInsetX ?? Math.max(DRAG_INSET_X * visualScale, MIN_HIT_HALF);
  const insetYTop = hitInsetYTop ?? Math.max(DRAG_INSET_Y_TOP * visualScale, MIN_HIT_HALF);
  const insetYBottom =
    hitInsetYBottom ?? Math.max(DRAG_INSET_Y_BOTTOM * visualScale, MIN_HIT_HALF);

  const dragBoundFunc = useMemo(() => {
    if (renderMode !== "jersey") return undefined;
    const minX = Math.min(insetX, pitchWidth / 2);
    const maxX = Math.max(pitchWidth - insetX, pitchWidth / 2);
    const minY = Math.min(insetYTop, pitchHeight / 2);
    const maxY = Math.max(pitchHeight - insetYBottom, pitchHeight / 2);
    return (pos: Vector2d) => ({
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    });
  }, [renderMode, insetX, pitchWidth, insetYTop, pitchHeight, insetYBottom]);

  return (
    <Group
      x={px}
      y={py}
      draggable={interactive && renderMode === "jersey"}
      dragBoundFunc={dragBoundFunc}
      onDragEnd={
        renderMode === "jersey"
          ? (e: KonvaEventObject<DragEvent>) => {
              const node = e.target;
              const nx = verticalLayout
                ? node.x() / pitchWidth
                : 1 - node.y() / pitchHeight;
              const yVisual = verticalLayout
                ? 1 - node.y() / pitchHeight
                : node.x() / pitchWidth;
              const ny = storedAttackYFromVisual(yVisual, attackFlip);
              onDragEnd(player.id, nx, ny);
            }
          : undefined
      }
      onDragStart={
        renderMode === "jersey" ? () => interactive && onDragStart?.(player.id) : undefined
      }
      onDblClick={
        renderMode === "jersey" ? () => interactive && onEdit?.(player.id) : undefined
      }
      onDblTap={
        renderMode === "jersey" ? () => interactive && onEdit?.(player.id) : undefined
      }
      listening={renderMode === "jersey"}
    >
      <PlayerJerseyLayer
        kit={kit}
        variant={(player.side ?? "home") === "away" ? "away" : "home"}
        selected={selected}
        number={player.number}
        name={player.name}
        isCaptain={Boolean(player.isCaptain)}
        visualScale={visualScale}
        showJersey={renderMode === "jersey"}
        showLabel={renderMode === "label"}
      />
      {/* Geniş dokunma / sürükleme alanı (görünmez, üstte) */}
      {renderMode === "jersey" && (
        <Rect
          x={-insetX}
          y={-insetYTop}
          width={insetX * 2}
          height={insetYTop + insetYBottom}
          fill="transparent"
          listening={interactive}
        />
      )}
    </Group>
  );
}

export const PlayerNode = memo(PlayerNodeInner);

/** Yaklaşık yatay yarı genişlik (geri uyumluluk / dışarı kullanım) */
export const PLAYER_NODE_RADIUS = DRAG_INSET_X;
