"use client";

import { Circle, Group, Path, Ellipse, Text, Rect } from "react-konva";
import type { ResolvedJerseyKit } from "@/types/jersey";
import { contrastAccentForPrimary } from "@/lib/jersey-kit";

const shortSleevePath =
  "M 75,25 C 85,20 115,20 125,25 C 145,25 160,35 175,45 C 185,55 200,85 190,105 " +
  "C 185,115 165,120 155,110 C 150,105 150,90 150,85 L 150,200 L 50,200 L 50,85 " +
  "C 50,90 50,105 45,110 C 35,120 15,115 10,105 C 0,85 15,55 25,45 C 40,35 55,25 75,25 Z";

const collarPath =
  "M 75,25 C 85,45 115,45 125,25 L 125,32 C 110,52 90,52 75,32 Z";

const hemPath = "M 50,85 C 60,80 140,80 150,85";

const HOME_JERSEY_FILL = "#ffffff";
const HOME_COLLAR_FILL = "#2d3436";
const HEM_STROKE_LIGHT = "#f0f0f0";
const HOME_NUMBER_FILL = "#0a0a0a";
const NAME_TAG_BG = "#141414";
const NAME_TAG_TEXT = "#fafafa";

/** Örnekteki gibi: path’ler aynı x/y ve scale */
const PATH_OFF = 20;
const PATH_SCALE = 1.5;

/** Formayı yatayda biraz genişlet (rakamlar için alan + silüet) */
const JERSEY_STRETCH_X = 1.16;

/** Saha üzerinde gövde boyutu; biraz büyütüldü */
const OUTER_SCALE = 0.178;

/** İç koordinatlarda yaklaşık merkez — yatay stretch ile uyumlu */
const CENTER_X = PATH_OFF + 100 * PATH_SCALE * JERSEY_STRETCH_X;
const CENTER_Y = PATH_OFF + 113 * PATH_SCALE;

type Props = {
  kit: ResolvedJerseyKit;
  /** Kendi takım: klasik beyaz forma. Rakip: renkli kit (siyah vb.). */
  variant: "home" | "away";
  selected: boolean;
  number: string;
  shortName: string;
  /** İsim bandının sağında K rozeti; bant genişliği buna göre artar */
  isCaptain?: boolean;
  /** Saha boyutuna göre tüm forma + etiket (1 = tasarım referansı) */
  visualScale?: number;
  /** Forma gövdesini çiz */
  showJersey?: boolean;
  /** İsim etiketi + kaptan rozetini çiz */
  showLabel?: boolean;
};

const CAPTAIN_BADGE = 14;
const CAPTAIN_GAP = 5;

export function PlayerJerseyLayer({
  kit,
  variant,
  selected,
  number,
  shortName,
  isCaptain = false,
  visualScale = 1,
  showJersey = true,
  showLabel = true,
}: Props) {
  const isAwayKit = variant === "away";
  /** Sadece rakip formasında: koyu gövde + açık numara */
  const isDarkJersey =
    isAwayKit && contrastAccentForPrimary(kit.primary) === "#f8fafc";

  const bodyFill = isAwayKit ? kit.primary : HOME_JERSEY_FILL;
  const collarFill = isAwayKit ? kit.secondary : HOME_COLLAR_FILL;
  const hemStroke = isAwayKit
    ? isDarkJersey
      ? bodyFill
      : HEM_STROKE_LIGHT
    : HEM_STROKE_LIGHT;
  const numberFill = isAwayKit ? kit.accent : HOME_NUMBER_FILL;
  const numberShadowColor =
    isAwayKit && isDarkJersey ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.22)";
  const jerseyShadowOpacity = isAwayKit ? (isDarkJersey ? 0.35 : 0.1) : 0.1;

  const tagH = 22;
  const tagRadius = 9;
  const tagPadX = 16;
  const approxChar = 6.8;
  const nameInnerW = Math.ceil(shortName.length * approxChar);
  const captainExtra = isCaptain ? CAPTAIN_GAP + CAPTAIN_BADGE : 0;
  const tagW = Math.min(
    isCaptain ? 172 : 136,
    Math.max(52, tagPadX * 2 + nameInnerW + captainExtra)
  );
  const nameTagX = -tagW / 2;
  const nameSlotW = isCaptain
    ? tagW - tagPadX * 2 - CAPTAIN_GAP - CAPTAIN_BADGE
    : tagW;
  const captainCenterX = nameTagX + tagW - tagPadX - CAPTAIN_BADGE / 2;

  const bottomInner = PATH_OFF + 200 * PATH_SCALE;
  const nameTagY = (bottomInner - CENTER_Y) * OUTER_SCALE + 4;

  const stroke = selected
    ? "rgba(245, 200, 60, 0.98)"
    : isAwayKit && isDarkJersey
      ? bodyFill
      : isAwayKit
        ? "rgba(15, 23, 42, 0.45)"
        : "#333";
  const strokeW = selected ? 2.4 : 2;

  return (
    <Group listening={false} scaleX={visualScale} scaleY={visualScale}>
      {showJersey && (
        <>
          <Ellipse
            x={0}
            y={14}
            radiusX={30}
            radiusY={6}
            fill="rgba(0,0,0,0.08)"
            listening={false}
          />

          <Group
            offsetX={CENTER_X}
            offsetY={CENTER_Y}
            scaleX={OUTER_SCALE}
            scaleY={OUTER_SCALE}
            listening={false}
          >
            <Group
              x={PATH_OFF}
              y={PATH_OFF}
              scaleX={PATH_SCALE * JERSEY_STRETCH_X}
              scaleY={PATH_SCALE}
              listening={false}
            >
              <Path
                data={shortSleevePath}
                fill={bodyFill}
                stroke={stroke}
                strokeWidth={strokeW}
                lineJoin="round"
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={jerseyShadowOpacity}
                listening={false}
              />
              <Path data={collarPath} fill={collarFill} listening={false} />
              <Path
                data={hemPath}
                fill="transparent"
                stroke={hemStroke}
                strokeWidth={1}
                lineCap="round"
                listening={false}
              />
              <Text
                text={number}
                x={40}
                y={106}
                width={120}
                align="center"
                wrap="none"
                letterSpacing={1}
                fontSize={54}
                fontFamily="'Segoe UI', system-ui, sans-serif"
                fontStyle="bold"
                fill={numberFill}
                shadowColor={isDarkJersey ? "transparent" : numberShadowColor}
                shadowBlur={isDarkJersey ? 0 : 3}
                shadowOffset={isDarkJersey ? { x: 0, y: 0 } : { x: 0, y: 2 }}
                listening={false}
              />
            </Group>
          </Group>
        </>
      )}
      {showLabel && (
        <>
          <Rect
            x={nameTagX}
            y={nameTagY}
            width={tagW}
            height={tagH}
            cornerRadius={tagRadius}
            fill={NAME_TAG_BG}
            shadowColor="rgba(0,0,0,0.45)"
            shadowBlur={4}
            shadowOffset={{ x: 0, y: 1 }}
            listening={false}
          />
          <Text
            text={shortName}
            x={isCaptain ? nameTagX + tagPadX : nameTagX}
            y={nameTagY}
            width={nameSlotW}
            height={tagH}
            align={isCaptain ? "left" : "center"}
            verticalAlign="middle"
            fontSize={12}
            fontFamily="'Segoe UI', system-ui, sans-serif"
            fill={NAME_TAG_TEXT}
            listening={false}
          />
          {isCaptain ? (
            <>
              <Circle
                x={captainCenterX}
                y={nameTagY + tagH / 2}
                radius={CAPTAIN_BADGE / 2}
                fill="#fbbf24"
                stroke="#0a0a0a"
                strokeWidth={1}
                listening={false}
              />
              <Text
                text="K"
                x={nameTagX + tagW - tagPadX - CAPTAIN_BADGE}
                y={nameTagY}
                width={CAPTAIN_BADGE}
                height={tagH}
                align="center"
                verticalAlign="middle"
                fontSize={10}
                fontStyle="bold"
                fontFamily="'Segoe UI', system-ui, sans-serif"
                fill="#0a0a0a"
                listening={false}
              />
            </>
          ) : null}
        </>
      )}
    </Group>
  );
}
