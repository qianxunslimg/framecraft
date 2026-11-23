import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { font } from "../../../tools/remotion/fonts";
import energy from "./audio-energy.json";

export const C = {
  cream: "#f4f1e9",
  ink: "#151b2a",
  blue: "#2254f5",
  lime: "#d6ff5f",
  coral: "#ff725e",
  lavender: "#c3bbff",
};
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const pop = (frame: number, delay = 0, damping = 13) =>
  spring({
    frame: frame - delay,
    fps: 30,
    config: { damping, stiffness: 180, mass: 0.65 },
  });
export function useBeat(offset: number) {
  const frame = useCurrentFrame();
  return energy[Math.max(0, Math.min(energy.length - 1, frame + offset))];
}

export const Stage: React.FC<{
  children: React.ReactNode;
  bg?: string;
  ink?: string;
  offset: number;
}> = ({ children, bg = C.cream, ink = C.ink, offset }) => {
  const { low } = useBeat(offset);
  return (
    <AbsoluteFill
      style={{
        background: bg,
        color: ink,
        fontFamily: font,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 84% 68%, ${ink === C.cream ? "#ffffff12" : "#ffffffaa"} 0%, transparent 53%)`,
        }}
      />
      <svg
        width="1080"
        height="1920"
        style={{
          position: "absolute",
          opacity: ink === C.cream ? 0.035 : 0.065,
        }}
      >
        <defs>
          <pattern
            id="paper-dot"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r=".65" fill={ink} />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#paper-dot)" />
      </svg>
      {children}
      <div
        style={{
          position: "absolute",
          left: 66,
          right: 140,
          bottom: 116,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0.65,
        }}
      >
        <span style={{ fontSize: 21, letterSpacing: 3, fontWeight: 700 }}>
          FRAMECRAFT
        </span>
        <div
          style={{ display: "flex", alignItems: "center", gap: 5, height: 28 }}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4 + low * (7 + Math.sin(i * 2) * 5),
                background: ink,
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Word: React.FC<{
  text: string;
  at?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  stagger?: number;
  cues?: number[];
  outline?: boolean;
  tilt?: number;
}> = ({
  text,
  at = 0,
  size = 220,
  color,
  style,
  stagger = 2,
  cues,
  outline = false,
  tilt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        right: 96,
        top: 270,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: -size * 0.055,
        fontWeight: 900,
        textAlign: "center",
        whiteSpace: "nowrap",
        color,
        transform: `rotate(${tilt}deg)`,
        ...style,
      }}
    >
      {[...text].map((char, i) => {
        const p = spring({
          frame: frame - at - (cues?.[i] ?? i * stagger),
          fps,
          config: { damping: 12, mass: 0.55, stiffness: 200 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - p) * 145}px) scale(${0.55 + p * 0.45}) rotate(${(1 - p) * (i % 2 ? -18 : 18)}deg)`,
              opacity: Math.min(1, p * 3),
              ...(outline
                ? {
                    WebkitTextStroke: `3px ${color ?? C.ink}`,
                    color: "transparent",
                  }
                : {}),
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export const Spark: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  angle?: number;
}> = ({ x, y, size = 50, color = C.lime, angle = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `rotate(${angle}deg)`,
    }}
  >
    <path
      d="M50 0L60 35L85 15L65 40L100 50L65 60L85 85L60 65L50 100L40 65L15 85L35 60L0 50L35 40L15 15L40 35Z"
      fill={color}
    />
  </svg>
);

export const Confetti: React.FC<{
  offset: number;
  count?: number;
  start?: number;
}> = ({ offset, count = 22, start = 0 }) => {
  const f = useCurrentFrame() - start;
  const { onset } = useBeat(offset);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const age = Math.max(0, f - i * 1.5);
        const a = i * 2.399;
        const r = 100 + age * (3 + (i % 4));
        return (
          <Spark
            key={i}
            x={510 + Math.cos(a) * r}
            y={1010 + Math.sin(a) * r + age * 0.6}
            size={22 + (i % 4) * 9 + onset * 4}
            color={[C.blue, C.lime, C.coral, C.lavender][i % 4]}
            angle={age * (i % 2 ? 2 : -2)}
          />
        );
      })}
    </>
  );
};

export const Heart: React.FC<{
  style?: React.CSSProperties;
  color?: string;
}> = ({ style, color = C.coral }) => (
  <svg
    viewBox="0 0 200 180"
    style={{ width: 200, position: "absolute", ...style }}
  >
    <path
      d="M100 165C75 140 12 102 12 52C12 5 78 -5 100 38C122 -5 188 5 188 52C188 102 125 140 100 165Z"
      fill={color}
    />
    <path
      d="M38 51C38 31 58 21 71 29"
      fill="none"
      stroke="#ffffff88"
      strokeWidth="9"
      strokeLinecap="round"
    />
  </svg>
);

export const Flash: React.FC<{ offset: number; color?: string }> = ({
  offset,
  color = C.lime,
}) => {
  const { onset } = useBeat(offset);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        boxShadow: `inset 0 0 ${70 + onset * 50}px ${color}${Math.round(
          Math.min(1, onset * 0.2) * 255,
        )
          .toString(16)
          .padStart(2, "0")}`,
      }}
    />
  );
};

export const Slip: React.FC<{
  text: string;
  x: number;
  y: number;
  angle?: number;
  color?: string;
  scale?: number;
}> = ({ text, x, y, angle = 0, color = C.cream, scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      background: color,
      color: C.ink,
      padding: "20px 32px",
      fontSize: 53,
      lineHeight: 1.1,
      fontWeight: 800,
      border: `3px solid ${C.ink}`,
      borderRadius: 22,
      boxShadow: `8px 10px 0 ${C.ink}`,
      transform: `rotate(${angle}deg) scale(${scale})`,
    }}
  >
    {text}
  </div>
);

export const fly = (
  f: number,
  a: number,
  b: number,
  start: number,
  end: number,
) => interpolate(f, [a, b], [start, end], clamp);
