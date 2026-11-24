import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../../../tools/remotion/fonts";

export const C = {
  ink: "#1e2230",
  sub: "#5e6577",
  white: "#ffffff",
  k8sBlue: "#326ce5",
  k8sLight: "#dbe8ff",
  cyan: "#00b4d8",
  cyanSoft: "#daf7ff",
  mint: "#10b981",
  mintSoft: "#d8faec",
  butter: "#f59e0b",
  butterSoft: "#fef3c7",
  coral: "#f43f5e",
  coralSoft: "#ffe4e8",
  pink: "#ec4899",
  pinkSoft: "#fce7f3",
  lavender: "#8b5cf6",
  lavenderSoft: "#ede9fe",
  cream: "#fffaf0",
  darkBg: "#141829",
  darkCard: "#1e243b",
};

export type StageTheme =
  | "night"
  | "sky"
  | "mint"
  | "lavender"
  | "peach"
  | "arcade"
  | "cream";

const THEMES: Record<StageTheme, { bg: string; dot: string; dark: boolean }> = {
  night: {
    bg: "radial-gradient(circle at 50% 38%, #252b48 0%, #171b30 62%, #0e1120 100%)",
    dot: "rgba(96, 165, 250, 0.18)",
    dark: true,
  },
  sky: {
    bg: "radial-gradient(circle at 50% 42%, #f4f9ff 0%, #e4f1ff 62%, #cde4ff 100%)",
    dot: "rgba(50, 108, 229, 0.13)",
    dark: false,
  },
  mint: {
    bg: "radial-gradient(circle at 50% 42%, #f2fff9 0%, #e1faef 62%, #c7f2e0 100%)",
    dot: "rgba(16, 185, 129, 0.14)",
    dark: false,
  },
  lavender: {
    bg: "radial-gradient(circle at 50% 42%, #faf8ff 0%, #efe8ff 62%, #dfd2fe 100%)",
    dot: "rgba(139, 92, 246, 0.14)",
    dark: false,
  },
  peach: {
    bg: "radial-gradient(circle at 50% 42%, #fffaf5 0%, #ffedd9 62%, #ffdab8 100%)",
    dot: "rgba(245, 158, 11, 0.16)",
    dark: false,
  },
  arcade: {
    bg: "radial-gradient(circle at 50% 38%, #1e2749 0%, #141a33 65%, #0c1021 100%)",
    dot: "rgba(56, 189, 248, 0.22)",
    dark: true,
  },
  cream: {
    bg: "radial-gradient(circle at 50% 42%, #fffdf8 0%, #fff5e1 62%, #fbe5bf 100%)",
    dot: "rgba(244, 63, 94, 0.12)",
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

export const getCueStart = (cues: CueItem[], name: string, fallback = 0): number => {
  const found = cues.find((c) => c.cue === name);
  return found ? found.from : fallback;
};

/** 120 BPM deterministic visual pulse for bouncy cue-synced animation */
export const usePulse = (offset = 0) => {
  const frame = useCurrentFrame();
  const f = frame + offset;
  // 15 frames per beat = 120 BPM at 30fps
  const phase = (f % 15) / 15;
  const beat = Math.pow(1 - phase, 2.4);
  const wave = 0.5 + 0.5 * Math.sin(f * 0.21);
  return { beat, wave };
};

export const K8sStage: React.FC<{
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
      {/* Animated playful blueprint dot grid */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          backgroundImage: `radial-gradient(${t.dot} 3.5px, transparent 3.5px)`,
          backgroundSize: "48px 48px",
          transform: `translate(${(frame * 0.55) % 48}px, ${(frame * 0.3) % 48}px)`,
        }}
      />

      {/* Ambient corner glyphs */}
      {[
        { x: 64, y: 120, g: "✦", c: C.k8sBlue },
        { x: 1825, y: 130, g: "⬡", c: C.cyan },
        { x: 74, y: 890, g: "◆", c: C.butter },
        { x: 1815, y: 880, g: "★", c: C.pink },
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
}> = ({ badge, title, accent = C.k8sBlue, dark = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 34,
        left: 64,
        right: 64,
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
          background: dark ? "rgba(30,36,59,0.9)" : "#ffffff",
          border: `3.5px solid ${dark ? accent : C.ink}`,
          borderRadius: 999,
          padding: "9px 26px 9px 14px",
          boxShadow: dark
            ? `0 8px 24px ${accent}33`
            : "0 8px 0 rgba(30,34,48,0.1)",
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
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: dark ? "#ffffff" : C.ink,
          }}
        >
          {title}
        </span>
      </div>

      {/* Live K8s Cluster Status Pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: dark ? "rgba(16,185,129,0.16)" : C.mintSoft,
          border: `3px solid ${C.mint}`,
          borderRadius: 999,
          padding: "8px 20px",
          fontSize: 22,
          fontWeight: 700,
          color: dark ? "#6ee7b7" : "#047857",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 99,
            background: C.mint,
            boxShadow: `0 0 12px ${C.mint}`,
          }}
        />
        <span>k8s-cluster · 运维小牛马学堂</span>
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
}> = ({ text, bg = C.k8sBlue, color = "#ffffff", size = 30, delay = 0, style }) => {
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
        padding: `${Math.round(size * 0.28)}px ${Math.round(size * 0.65)}px`,
        borderRadius: 999,
        border: `3.5px solid ${C.ink}`,
        boxShadow: `0 7px 0 ${C.ink}`,
        transform: `scale(${pop * (1 + beat * 0.025)})`,
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

/** Global bottom synced caption pill with keyword highlight & reading progress bar */
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
        bottom: 28,
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
          gap: 16,
          background: "rgba(20, 24, 41, 0.93)",
          color: "#ffffff",
          fontSize: 36,
          fontWeight: 700,
          padding: "15px 38px 19px",
          borderRadius: 999,
          border: `3.5px solid ${C.k8sBlue}`,
          boxShadow: "0 14px 36px rgba(15,23,42,0.32)",
          transform: `translateY(${(1 - enter) * 20}px) scale(${0.94 + enter * 0.06})`,
          opacity: enter,
          maxWidth: 1660,
        }}
      >
        <span style={{ color: C.cyan, fontSize: 30 }}>☸</span>
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
              background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
