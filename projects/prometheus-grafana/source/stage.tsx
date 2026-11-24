import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../../../tools/remotion/fonts";

export const C = {
  ink: "#1e2230",
  sub: "#5e6577",
  white: "#ffffff",
  promOrange: "#e6522c",
  promSoft: "#ffe7df",
  grafGold: "#f46800",
  grafAmber: "#f59e0b",
  grafSoft: "#fef3c7",
  sky: "#0ea5e9",
  skySoft: "#e0f2fe",
  mint: "#10b981",
  mintSoft: "#d1fae5",
  coral: "#f43f5e",
  coralSoft: "#ffe4e6",
  lavender: "#8b5cf6",
  lavenderSoft: "#ede9fe",
  cyan: "#06b6d4",
  darkBg: "#111217",
  darkCard: "#181b1f",
  darkBorder: "#2c3235",
};

export type StageTheme =
  | "night"
  | "amber"
  | "sky"
  | "coral"
  | "darkDash"
  | "lavender"
  | "cream";

const THEMES: Record<StageTheme, { bg: string; dot: string; dark: boolean }> = {
  night: {
    bg: "radial-gradient(circle at 50% 38%, #262238 0%, #171626 62%, #0e0e18 100%)",
    dot: "rgba(230, 82, 44, 0.2)",
    dark: true,
  },
  amber: {
    bg: "radial-gradient(circle at 50% 42%, #fffcf5 0%, #fff2dc 62%, #fde3ba 100%)",
    dot: "rgba(230, 82, 44, 0.14)",
    dark: false,
  },
  sky: {
    bg: "radial-gradient(circle at 50% 42%, #f4faff 0%, #e1f2ff 62%, #c9e6ff 100%)",
    dot: "rgba(14, 165, 233, 0.14)",
    dark: false,
  },
  coral: {
    bg: "radial-gradient(circle at 50% 42%, #fff8f8 0%, #ffe8ea 62%, #ffd4da 100%)",
    dot: "rgba(244, 63, 94, 0.14)",
    dark: false,
  },
  darkDash: {
    bg: "radial-gradient(circle at 50% 35%, #1d212b 0%, #111217 68%, #0a0b0f 100%)",
    dot: "rgba(244, 104, 0, 0.18)",
    dark: true,
  },
  lavender: {
    bg: "radial-gradient(circle at 50% 42%, #faf8ff 0%, #efe8ff 62%, #e0d4ff 100%)",
    dot: "rgba(139, 92, 246, 0.14)",
    dark: false,
  },
  cream: {
    bg: "radial-gradient(circle at 50% 42%, #fffdf8 0%, #fff5e1 62%, #fbe5bf 100%)",
    dot: "rgba(244, 104, 0, 0.13)",
    dark: false,
  },
};

export interface CueItem {
  cue: string;
  from: number;
  duration: number;
  display: string;
  highlight: string;
}

export interface SceneTiming {
  id: string;
  badge: string;
  title: string;
  theme: StageTheme;
  from: number;
  duration: number;
  cues: CueItem[];
}

export const getCue = (cues: CueItem[], name: string, fallbackFrom = 0, fallbackDur = 240) => {
  const f = cues.find((c) => c.cue === name);
  return f ?? { cue: name, from: fallbackFrom, duration: fallbackDur, display: "", highlight: "" };
};

export const usePulse = (offset = 0) => {
  const frame = useCurrentFrame();
  const f = frame + offset;
  // 124 BPM -> ~14.5 frames per beat
  const phase = (f % 14.5) / 14.5;
  const beat = Math.pow(1 - phase, 2.3);
  return { beat };
};

export const ObsStage: React.FC<{
  theme: StageTheme;
  children: React.ReactNode;
  shake?: number;
}> = ({ theme, children, shake = 0 }) => {
  const frame = useCurrentFrame();
  const t = THEMES[theme];
  const sx = shake > 0 ? Math.sin(frame * 3.1) * shake : 0;
  const sy = shake > 0 ? Math.cos(frame * 3.7) * shake * 0.7 : 0;

  return (
    <AbsoluteFill
      style={{
        background: t.bg,
        fontFamily: font,
        color: t.dark ? C.white : C.ink,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -60,
          backgroundImage: `radial-gradient(${t.dot} 3.5px, transparent 3.5px)`,
          backgroundSize: "48px 48px",
          transform: `translate(${(frame * 0.5) % 48}px, ${(frame * 0.28) % 48}px)`,
        }}
      />

      {[
        { x: 64, y: 120, g: "✦", c: C.promOrange },
        { x: 1825, y: 130, g: "◈", c: C.grafAmber },
        { x: 74, y: 890, g: "◆", c: C.sky },
        { x: 1815, y: 880, g: "★", c: C.mint },
      ].map((s, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y + Math.sin(frame * 0.08 + idx * 1.4) * 12,
            fontSize: 30,
            color: s.c,
            opacity: t.dark ? 0.65 : 0.35,
            transform: `rotate(${Math.sin(frame * 0.06 + idx) * 18}deg)`,
            pointerEvents: "none",
          }}
        >
          {s.g}
        </div>
      ))}

      <AbsoluteFill
        style={{
          transform: `translate(${sx}px, ${sy}px)`,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SceneTopBar: React.FC<{
  badge: string;
  title: string;
  accent?: string;
  dark?: boolean;
}> = ({ badge, title, accent = C.promOrange, dark = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 32,
        left: 60,
        right: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 60,
        transform: `translateY(${(1 - pop) * -28}px)`,
        opacity: pop,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          background: dark ? "rgba(24,27,31,0.92)" : "#ffffff",
          border: `3.5px solid ${dark ? accent : C.ink}`,
          borderRadius: 999,
          padding: "8px 26px 8px 12px",
          boxShadow: dark ? `0 8px 24px ${accent}33` : "0 8px 0 rgba(30,34,48,0.1)",
        }}
      >
        <span
          style={{
            background: accent,
            color: "#ffffff",
            fontSize: 22,
            fontWeight: 700,
            padding: "4px 16px",
            borderRadius: 999,
          }}
        >
          {badge}
        </span>
        <span style={{ fontSize: 27, fontWeight: 700, color: dark ? "#ffffff" : C.ink }}>
          {title}
        </span>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: dark ? "rgba(244,104,0,0.16)" : C.grafSoft,
          border: `3px solid ${C.grafGold}`,
          borderRadius: 999,
          padding: "8px 20px",
          fontSize: 21,
          fontWeight: 700,
          color: dark ? "#fdba74" : "#b45309",
        }}
      >
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: 99,
            background: C.mint,
            boxShadow: `0 0 12px ${C.mint}`,
          }}
        />
        <span>云原生监控 · 运维小牛马学堂</span>
      </div>
    </div>
  );
};

export const CandyPill: React.FC<{
  text: string;
  bg?: string;
  color?: string;
  size?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ text, bg = C.promOrange, color = "#ffffff", size = 28, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat } = usePulse();
  const pop = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 11, stiffness: 200 },
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        color,
        fontSize: size,
        fontWeight: 700,
        padding: `${Math.round(size * 0.28)}px ${Math.round(size * 0.62)}px`,
        borderRadius: 999,
        border: `3.5px solid ${C.ink}`,
        boxShadow: `0 7px 0 ${C.ink}`,
        transform: `scale(${pop * (1 + beat * 0.022)})`,
        opacity: pop,
        lineHeight: 1.15,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const SpeechBubble: React.FC<{
  children: React.ReactNode;
  bg?: string;
  borderColor?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, bg = "#ffffff", borderColor = C.ink, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  return (
    <div
      style={{
        background: bg,
        color: C.ink,
        border: `4px solid ${borderColor}`,
        borderRadius: 28,
        padding: "16px 28px",
        boxShadow: "0 10px 0 rgba(30,34,48,0.12)",
        transform: `scale(${pop})`,
        opacity: pop,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const GlobalCaptionBar: React.FC<{
  captions: Array<{ from: number; duration: number; text: string; highlight: string }>;
}> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = captions.find((c) => frame >= c.from && frame < c.from + c.duration);
  if (!active) return null;

  const enter = spring({
    frame: frame - active.from,
    fps,
    config: { damping: 12, stiffness: 240 },
  });
  const prog = interpolate(
    frame,
    [active.from, active.from + active.duration],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const renderText = () => {
    if (!active.highlight || !active.text.includes(active.highlight)) {
      return active.text;
    }
    const parts = active.text.split(active.highlight);
    return (
      <>
        {parts[0]}
        <span style={{ color: "#fbbf24" }}>{active.highlight}</span>
        {parts.slice(1).join(active.highlight)}
      </>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 26,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 85,
      }}
    >
      <div
        style={{
          fontFamily: font,
          position: "relative",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(17, 18, 23, 0.94)",
          color: "#ffffff",
          fontSize: 36,
          fontWeight: 700,
          padding: "14px 36px 18px",
          borderRadius: 999,
          border: `3.5px solid ${C.promOrange}`,
          boxShadow: "0 14px 36px rgba(0,0,0,0.34)",
          transform: `translateY(${(1 - enter) * 18}px) scale(${0.95 + enter * 0.05})`,
          opacity: enter,
          maxWidth: 1680,
        }}
      >
        <span style={{ color: C.grafAmber, fontSize: 28 }}>🔥</span>
        <span>{renderText()}</span>
        <div
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            bottom: 5,
            height: 4,
            borderRadius: 99,
            background: "rgba(255,255,255,0.14)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${prog}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${C.promOrange}, ${C.grafAmber})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
