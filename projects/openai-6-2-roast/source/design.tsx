import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { font } from "../../../tools/remotion/fonts";
import audioEnergy from "./audio-energy.json";

export const PALETTE = {
  paper: "#f7f4ec",
  paperDeep: "#efeae0",
  ink: "#1c1b19",
  subInk: "#6d6a63",
  card: "#ffffff",
  border: "rgba(28, 27, 25, 0.08)",
  sage: "#10a37f",
  sageSoft: "#e4f5ef",
  coral: "#e06d53",
  coralSoft: "#fcece8",
  butter: "#e6a832",
  butterSoft: "#fdf5e1",
  sky: "#4b7bec",
  skySoft: "#eaf0fd",
  plum: "#8b6cc1",
  plumSoft: "#f1ecfa",
};

export const useBeat = () => {
  const frame = useCurrentFrame();
  const idx = Math.max(0, Math.min(audioEnergy.length - 1, Math.floor(frame)));
  return audioEnergy[idx] ?? { level: 0.4, onset: 0 };
};

const FLOATING_SHAPES = [
  { x: 120, y: 150, s: 14, color: PALETTE.sage, p: 0.3 },
  { x: 1790, y: 170, s: 16, color: PALETTE.coral, p: 1.2 },
  { x: 165, y: 910, s: 12, color: PALETTE.butter, p: 2.1 },
  { x: 1730, y: 890, s: 18, color: PALETTE.sky, p: 2.9 },
  { x: 1520, y: 115, s: 11, color: PALETTE.plum, p: 0.8 },
  { x: 380, y: 120, s: 12, color: PALETTE.coral, p: 1.7 },
];

export const GalleryStage: React.FC<{
  children: React.ReactNode;
  tint?: string;
}> = ({ children, tint }) => {
  const frame = useCurrentFrame();
  const beat = useBeat();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 44%, ${tint ?? "#fcfaf5"} 0%, ${PALETTE.paper} 65%, ${PALETTE.paperDeep} 100%)`,
        fontFamily: font,
        color: PALETTE.ink,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(28, 27, 25, 0.045) 1.4px, transparent 1.4px)",
          backgroundSize: "40px 40px",
        }}
      />
      {FLOATING_SHAPES.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y + Math.sin(frame * 0.055 + d.p) * 9,
            width: i % 2 === 0 ? d.s : d.s * 1.9,
            height: d.s,
            borderRadius: 999,
            background: d.color,
            opacity: 0.24 + beat.level * 0.1,
            transform: `rotate(${frame * 0.45 + i * 40}deg) scale(${1 + beat.onset * 0.18})`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Cute, polite minimalist AI mascot with optional transparent safety helmet & bow tie */
export const PoliteBot: React.FC<{
  size?: number;
  helmet?: boolean;
  helmetProgress?: number;
  blink?: boolean;
  bow?: number;
}> = ({
  size = 170,
  helmet = false,
  helmetProgress = 1,
  blink = false,
  bow = 0,
}) => {
  const frame = useCurrentFrame();
  const beat = useBeat();
  const isBlinking = blink || frame % 95 > 90;
  const bob = Math.sin(frame * 0.12) * 4;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `translateY(${bob}px) rotate(${bow}deg) scale(${1 + beat.onset * 0.035})`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 180 180">
        {/* Soft drop shadow */}
        <ellipse cx="90" cy="162" rx="44" ry="9" fill="rgba(28,27,25,0.09)" />

        {/* Rounded cute body */}
        <rect
          x="36"
          y="42"
          width="108"
          height="104"
          rx="48"
          fill={PALETTE.sage}
        />
        {/* Warm cream face screen */}
        <rect
          x="50"
          y="60"
          width="80"
          height="58"
          rx="28"
          fill="#fcfaf5"
        />

        {/* Cute blinking eyes */}
        {isBlinking ? (
          <>
            <path
              d="M66 88 Q73 82 80 88"
              stroke={PALETTE.ink}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M100 88 Q107 82 114 88"
              stroke={PALETTE.ink}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <circle cx="73" cy="87" r="6.5" fill={PALETTE.ink} />
            <circle cx="107" cy="87" r="6.5" fill={PALETTE.ink} />
            <circle cx="75.5" cy="84.5" r="2" fill="#ffffff" />
            <circle cx="109.5" cy="84.5" r="2" fill="#ffffff" />
          </>
        )}

        {/* Rosy cheeks */}
        <ellipse cx="62" cy="99" rx="7" ry="4" fill={PALETTE.coral} opacity="0.35" />
        <ellipse cx="118" cy="99" rx="7" ry="4" fill={PALETTE.coral} opacity="0.35" />

        {/* Polite tiny smile */}
        <path
          d="M83 98 Q90 104 97 98"
          stroke={PALETTE.ink}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Little polite bow tie */}
        <g transform="translate(90, 134)">
          <polygon points="-16,-8 0,0 -16,8" fill={PALETTE.coral} />
          <polygon points="16,-8 0,0 16,8" fill={PALETTE.coral} />
          <circle cx="0" cy="0" r="4.5" fill="#c9563e" />
        </g>

        {/* Transparent glass safety helmet */}
        {helmet && (
          <g
            opacity={helmetProgress}
            transform={`translate(0, ${(1 - helmetProgress) * -45})`}
          >
            <circle
              cx="90"
              cy="92"
              r="72"
              fill="rgba(255,255,255,0.22)"
              stroke={PALETTE.sky}
              strokeWidth="4"
              strokeDasharray="10 6"
            />
            <path
              d="M46 56 A54 54 0 0 1 88 32"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export const SoftPill: React.FC<{
  text: string;
  bg?: string;
  color?: string;
  fontSize?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  bg = PALETTE.sage,
  color = "#ffffff",
  fontSize = 36,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 13, stiffness: 180 },
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: bg,
        color,
        fontSize,
        fontWeight: 700,
        padding: `${Math.round(fontSize * 0.28)}px ${Math.round(fontSize * 0.62)}px`,
        borderRadius: 999,
        lineHeight: 1.1,
        boxShadow: `0 12px 28px ${bg}33`,
        transform: `scale(${enter})`,
        opacity: enter,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const CleanCard: React.FC<{
  children: React.ReactNode;
  width?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, width = 1080, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  return (
    <div
      style={{
        width,
        background: PALETTE.card,
        borderRadius: 34,
        border: `1.5px solid ${PALETTE.border}`,
        boxShadow: "0 24px 64px rgba(28, 27, 25, 0.08)",
        padding: "38px 46px",
        transform: `translateY(${(1 - enter) * 34}px) scale(${0.96 + enter * 0.04})`,
        opacity: enter,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const VectorCursor: React.FC<{
  x: number;
  y: number;
  clickFrame?: number;
}> = ({ x, y, clickFrame }) => {
  const frame = useCurrentFrame();
  const clicking =
    clickFrame !== undefined && frame >= clickFrame && frame <= clickFrame + 9;
  const ripple =
    clickFrame !== undefined && frame >= clickFrame
      ? interpolate(frame, [clickFrame, clickFrame + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {ripple > 0 && ripple < 1 && (
        <div
          style={{
            position: "absolute",
            left: -20,
            top: -20,
            width: 48,
            height: 48,
            borderRadius: 999,
            border: `3.5px solid ${PALETTE.sage}`,
            transform: `scale(${0.4 + ripple * 1.8})`,
            opacity: 1 - ripple,
          }}
        />
      )}
      <svg
        width="48"
        height="48"
        viewBox="0 0 36 36"
        style={{
          transform: `scale(${clicking ? 0.85 : 1})`,
          filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.18))",
        }}
      >
        <path
          d="M6 4 L6 28 L13 21 L18 32 L22 30 L17 19 L27 19 Z"
          fill={PALETTE.ink}
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
