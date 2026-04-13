"use client";

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Stage, Layer, Rect, Line, Circle, Group, Text } from "react-konva";
import type Konva from "konva";
import { PlayerNode } from "./PlayerNode";
import type { Player } from "@/types/player";

const PITCH_W = 760;
const PITCH_H = 560;
const MOBILE_BREAKPOINT = 768;

export interface PitchCanvasProps {
  players: Player[];
  activePlayerId: string | null;
  onPlayerMove: (id: string, x: number, y: number) => void;
  onEditPlayer?: (id: string) => void;
  /** Salt okunur (paylaşım sayfası) */
  interactive?: boolean;
}

export type PitchCanvasHandle = {
  getStage: () => Konva.Stage | null;
};

export const PitchCanvas = forwardRef<PitchCanvasHandle, PitchCanvasProps>(
  function PitchCanvas(
    {
      players,
      activePlayerId,
      onPlayerMove,
      onEditPlayer,
      interactive = true,
    },
    ref
  ) {
    const stageRef = useRef<Konva.Stage>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ w: PITCH_W, h: PITCH_H });
    const [verticalLayout, setVerticalLayout] = useState(false);

    useImperativeHandle(ref, () => ({
      getStage: () => stageRef.current,
    }));

    useEffect(() => {
      const node = containerRef.current;
      if (!node) return;

      const updateSize = () => {
        const bounds = node.getBoundingClientRect();
        const availableW = Math.max(0, Math.floor(bounds.width));
        const availableH = Math.max(0, Math.floor(bounds.height));
        if (availableW <= 0 || availableH <= 0) return;

        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
        setVerticalLayout(isMobile);

        setCanvasSize({
          w: Math.floor(Math.max(1, availableW)),
          h: Math.floor(Math.max(1, availableH)),
        });
      };

      updateSize();
      requestAnimationFrame(() => updateSize());
      const handleViewportChange = () => updateSize();
      const observer = new ResizeObserver(() => {
        updateSize();
      });
      observer.observe(node);
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("orientationchange", handleViewportChange);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("orientationchange", handleViewportChange);
      };
    }, []);

    const margin = 8;
    const innerW = canvasSize.w - margin * 2;
    const innerH = canvasSize.h - margin * 2;

    return (
      <div className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/65 to-emerald-950/70 p-3 shadow-[0_20px_60px_-30px_rgba(16,185,129,0.45)] backdrop-blur-sm">
        <div
          ref={containerRef}
          className="h-full w-full max-w-full overflow-hidden"
        >
          <Stage
            width={canvasSize.w}
            height={canvasSize.h}
            ref={stageRef}
            className="rounded-xl"
          >
          <Layer>
            <Rect
              x={margin}
              y={margin}
              width={innerW}
              height={innerH}
              fillLinearGradientStartPoint={{ x: margin, y: margin }}
              fillLinearGradientEndPoint={{ x: margin + innerW, y: margin + innerH }}
              fillLinearGradientColorStops={[0, "#0f6a3f", 0.5, "#0d7a46", 1, "#0b5d35"]}
              stroke="#d1fae5"
              strokeWidth={2}
              cornerRadius={8}
            />
            {Array.from({ length: 12 }).map((_, i) => (
              <Rect
                key={`stripe-${i}`}
                x={margin + (innerW / 12) * i}
                y={margin}
                width={innerW / 12}
                height={innerH}
                fill={i % 2 === 0 ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.26)"}
                listening={false}
              />
            ))}
            {/* Orta çizgi (yatay saha) */}
            {verticalLayout ? (
              <Line
                points={[margin, margin + innerH / 2, margin + innerW, margin + innerH / 2]}
                stroke="#d1fae5"
                strokeWidth={2}
                opacity={0.9}
              />
            ) : (
              <Line
                points={[margin + innerW / 2, margin, margin + innerW / 2, margin + innerH]}
                stroke="#d1fae5"
                strokeWidth={2}
                opacity={0.9}
              />
            )}
            {/* Orta yuvarlak */}
            <Circle
              x={margin + innerW / 2}
              y={margin + innerH / 2}
              radius={Math.min(innerW, innerH) * 0.12}
              stroke="#d1fae5"
              strokeWidth={2}
              opacity={0.9}
            />
            {verticalLayout ? (
              <>
                {/* Üst ceza sahası */}
                <Rect
                  x={margin + innerW * 0.2}
                  y={margin}
                  width={innerW * 0.6}
                  height={innerH * 0.16}
                  stroke="#d1fae5"
                  strokeWidth={2}
                  opacity={0.85}
                />
                {/* Üst altıpas */}
                <Rect
                  x={margin + innerW * 0.35}
                  y={margin}
                  width={innerW * 0.3}
                  height={innerH * 0.065}
                  stroke="#d1fae5"
                  strokeWidth={2}
                  opacity={0.85}
                />
                <Circle
                  x={margin + innerW / 2}
                  y={margin + innerH * 0.11}
                  radius={2.5}
                  fill="#ecfdf5"
                  opacity={0.9}
                />
                {/* Alt ceza sahası */}
                <Rect
                  x={margin + innerW * 0.2}
                  y={margin + innerH * 0.84}
                  width={innerW * 0.6}
                  height={innerH * 0.16}
                  stroke="#d1fae5"
                  strokeWidth={2}
                  opacity={0.85}
                />
                {/* Alt altıpas */}
                <Rect
                  x={margin + innerW * 0.35}
                  y={margin + innerH * 0.935}
                  width={innerW * 0.3}
                  height={innerH * 0.065}
                  stroke="#d1fae5"
                  strokeWidth={2}
                  opacity={0.85}
                />
                <Circle
                  x={margin + innerW / 2}
                  y={margin + innerH * 0.89}
                  radius={2.5}
                  fill="#ecfdf5"
                  opacity={0.9}
                />
              </>
            ) : (
              <>
                {/* Sol ceza sahası */}
                <Rect
                  x={margin}
                  y={margin + innerH * 0.2}
                  width={innerW * 0.16}
                  height={innerH * 0.6}
                  stroke="#d1fae5"
                  strokeWidth={2}
                  opacity={0.85}
                />
                {/* Sol altıpas */}
                <Rect
                  x={margin}
                  y={margin + innerH * 0.35}
                  width={innerW * 0.065}
                  height={innerH * 0.3}
                  stroke="#d1fae5"
                  strokeWidth={2}
                  opacity={0.85}
                />
                <Circle
                  x={margin + innerW * 0.11}
                  y={margin + innerH / 2}
                  radius={2.5}
                  fill="#ecfdf5"
                  opacity={0.9}
                />
                {/* Sağ ceza sahası */}
                <Rect
                  x={margin + innerW * 0.84}
                  y={margin + innerH * 0.2}
                  width={innerW * 0.16}
                  height={innerH * 0.6}
                  stroke="#d1fae5"
                  strokeWidth={2}
                  opacity={0.85}
                />
                {/* Sağ altıpas */}
                <Rect
                  x={margin + innerW * 0.935}
                  y={margin + innerH * 0.35}
                  width={innerW * 0.065}
                  height={innerH * 0.3}
                  stroke="#d1fae5"
                  strokeWidth={2}
                  opacity={0.85}
                />
                <Circle
                  x={margin + innerW * 0.89}
                  y={margin + innerH / 2}
                  radius={2.5}
                  fill="#ecfdf5"
                  opacity={0.9}
                />
              </>
            )}
            <Group x={margin} y={margin}>
              <Text
                text={verticalLayout ? "ATAK ↑" : "ATAK →"}
                x={verticalLayout ? innerW / 2 - 36 : innerW - 72}
                y={verticalLayout ? 10 : innerH / 2 - 8}
                width={verticalLayout ? 72 : undefined}
                align={verticalLayout ? "center" : undefined}
                fontSize={11}
                fill="#ecfdf5"
                opacity={0.8}
              />
            </Group>
          </Layer>
          <Layer>
            <Group x={margin} y={margin}>
              {players.map((p) => (
                <PlayerNode
                  key={p.id}
                  player={p}
                  pitchWidth={innerW}
                  pitchHeight={innerH}
                  verticalLayout={verticalLayout}
                  selected={interactive && activePlayerId === p.id}
                  interactive={interactive}
                  onDragEnd={onPlayerMove}
                  onEdit={onEditPlayer}
                />
              ))}
            </Group>
          </Layer>
          </Stage>
        </div>
      </div>
    );
  }
);

export const PITCH_INNER = { w: PITCH_W - 16, h: PITCH_H - 16 };
