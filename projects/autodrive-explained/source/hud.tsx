import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const C = {
  bg: "#03060f",
  cyan: "#00e5ff",
  teal: "#00f5c4",
  blue: "#3b82f6",
  violet: "#a855f7",
  amber: "#f59e0b",
  orange: "#ff7a18",
  crimson: "#ff2a5f",
  emerald: "#10b981",
  ink: "#f8fafc",
  muted: "#94a3b8",
};

export interface SceneCue {
  cue: string;
  from: number;
  duration: number;
  display: string;
  highlight?: string;
}

export interface SceneTiming {
  id: string;
  badge: string;
  title: string;
  theme: string;
  from: number;
  duration: number;
  cues: SceneCue[];
}

export function getCue(cues: SceneCue[], name: string, fallback = 0): SceneCue {
  return cues.find((c) => c.cue === name) ?? { cue: name, from: fallback, duration: 90, display: "" };
}

export function activeCueIndex(cues: SceneCue[], frame: number): number {
  let idx = 0;
  for (let i = 0; i < cues.length; i++) {
    if (frame >= cues[i].from) idx = i;
  }
  return idx;
}

/**
 * Full-bleed Cinema Frame wrapper: NO bulky headers, NO PPT cards — just sleek
 * subtle cinema letterbox vignette, razor-thin telemetry corners, and laser cut transitions.
 */
export const CinemaStage: React.FC<{
  badge: string;
  telemetry: string;
  accent?: string;
  children: React.ReactNode;
}> = ({ badge, telemetry, accent = C.cyan, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const openFlash = interpolate(frame, [0, 8, 18], [0.55, 0.12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        overflow: "hidden",
        opacity: fadeOut,
        fontFamily: "'Noto Sans CJK SC', 'PingFang SC', 'Inter', sans-serif",
      }}
    >
      {/* Full-bleed 1920x1080 animated visual world */}
      {children}

      {/* Cinema edge vignette for contrast without boxing the world */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 88% 82% at 50% 50%, transparent 58%, rgba(2, 4, 12, 0.72) 100%)",
        }}
      />

      {/* Minimalist cinema top-left chapter marker (ultra-light, non-intrusive) */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 38,
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: accent,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: accent,
            textShadow: `0 0 14px ${accent}88`,
          }}
        >
          {badge}
        </span>
      </div>

      {/* Minimalist top-right live telemetry readout */}
      <div
        style={{
          position: "absolute",
          top: 26,
          right: 38,
          fontFamily: "monospace",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: "rgba(226, 232, 240, 0.78)",
          textShadow: "0 2px 10px rgba(0,0,0,0.85)",
          pointerEvents: "none",
        }}
      >
        {telemetry}
      </div>

      {/* Subtle cinema viewfinder corner brackets */}
      {[
        { top: 14, left: 14, borderTop: `1.5px solid ${accent}55`, borderLeft: `1.5px solid ${accent}55` },
        { top: 14, right: 14, borderTop: `1.5px solid ${accent}55`, borderRight: `1.5px solid ${accent}55` },
        { bottom: 14, left: 14, borderBottom: `1.5px solid ${accent}55`, borderLeft: `1.5px solid ${accent}55` },
        { bottom: 14, right: 14, borderBottom: `1.5px solid ${accent}55`, borderRight: `1.5px solid ${accent}55` },
      ].map((s, i) => (
        <div
          key={i}
          style={{ position: "absolute", width: 18, height: 18, pointerEvents: "none", ...s }}
        />
      ))}

      {/* Crisp scene-cut optical energy flash */}
      {openFlash > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(circle at 50% 50%, ${accent}, transparent 72%)`,
            opacity: openFlash,
            mixBlendMode: "screen",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Iron-Man / Tesla FSD style floating AR leader-line pin.
 * Zero bullet boxes — just a sharp vector pointer + 2-5 word kinetic callout.
 */
export const ArPin: React.FC<{
  tx: number;
  ty: number;
  lx: number;
  ly: number;
  label: string;
  sub?: string;
  accent?: string;
  startFrame?: number;
  align?: "left" | "right";
}> = ({ tx, ty, lx, ly, label, sub, accent = C.cyan, startFrame = 0, align = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 18, stiffness: 200 },
  });
  if (frame < startFrame) return null;

  const midX = tx + (lx - tx) * 0.45;
  const lineEnd = align === "left" ? lx + 210 : lx - 210;
  const pulse = 0.7 + 0.3 * Math.sin(frame * 0.2);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: p }}>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <circle cx={tx} cy={ty} r={10 * pulse} fill="none" stroke={accent} strokeWidth="2" opacity={0.6} />
        <circle cx={tx} cy={ty} r="4.5" fill={accent} />
        <polyline
          points={`${tx},${ty} ${midX},${ly} ${lx},${ly} ${lineEnd},${ly}`}
          fill="none"
          stroke={accent}
          strokeWidth="2"
          opacity={0.9}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: align === "left" ? lx + 8 : lx - 320,
          top: ly - 44,
          width: 312,
          textAlign: align === "left" ? "left" : "right",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "0.02em",
            textShadow: `0 0 18px ${accent}aa, 0 3px 12px rgba(0,0,0,0.95)`,
          }}
        >
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "monospace",
              color: accent,
              letterSpacing: "0.08em",
              marginTop: 8,
              textShadow: "0 2px 8px rgba(0,0,0,0.95)",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Giant cinema impact title that slams/dissolves across the 3D scene on key narrative beats.
 */
export const KineticSlam: React.FC<{
  title: string;
  sub?: string;
  accent?: string;
  startFrame: number;
  holdFrames?: number;
  y?: number;
  size?: number;
}> = ({ title, sub, accent = C.cyan, startFrame, holdFrames = 110, y = 130, size = 86 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0 || local > holdFrames + 20) return null;

  const enter = spring({ frame: local, fps, config: { damping: 16, stiffness: 210 } });
  const exit = interpolate(local, [holdFrames, holdFrames + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(enter, [0, 1], [1.18, 1.0]);
  const flareW = interpolate(local, [0, 16, 40], [0, 1100, 520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        opacity: enter * exit,
        transform: `scale(${scale})`,
      }}
    >
      {sub && (
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.28em",
            color: accent,
            textShadow: `0 0 18px ${accent}`,
            marginBottom: 8,
          }}
        >
          {sub}
        </div>
      )}
      <div
        style={{
          fontSize: size,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "0.04em",
          textAlign: "center",
          textShadow: `0 0 38px ${accent}cc, 0 8px 32px rgba(0,0,0,0.95)`,
          lineHeight: 1.12,
        }}
      >
        {title}
      </div>
      {/* Anamorphic horizontal light flare */}
      <div
        style={{
          width: flareW,
          height: 3,
          marginTop: 14,
          background: `linear-gradient(90deg, transparent, ${accent}, #ffffff, ${accent}, transparent)`,
          boxShadow: `0 0 22px ${accent}`,
          opacity: 0.85,
        }}
      />
    </div>
  );
};

/**
 * Clean cinema-style floating bottom subtitle (no clunky glass box obstructing the 3D scene).
 */
export const CinemaCaptionBar: React.FC<{
  captions: Array<{ from: number; duration: number; text: string; highlight: string }>;
}> = ({ captions }) => {
  const frame = useCurrentFrame();
  const active = captions.find((c) => frame >= c.from && frame < c.from + c.duration);
  if (!active) return null;

  const local = frame - active.from;
  const opacity =
    interpolate(local, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(local, [active.duration - 5, active.duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const renderText = () => {
    if (!active.highlight || !active.text.includes(active.highlight)) return active.text;
    const parts = active.text.split(active.highlight);
    return (
      <>
        {parts[0]}
        <span style={{ color: C.cyan, textShadow: `0 0 18px ${C.cyan}` }}>{active.highlight}</span>
        {parts.slice(1).join(active.highlight)}
      </>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 34,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
      }}
    >
      <div
        style={{
          padding: "9px 28px",
          borderRadius: 12,
          background: "rgba(3, 6, 15, 0.80)",
          color: "#ffffff",
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "0.03em",
          textShadow: "0 3px 14px rgba(0,0,0,0.98), 0 0 2px rgba(0,0,0,1)",
          fontFamily: "'Noto Sans CJK SC', 'PingFang SC', sans-serif",
        }}
      >
        {renderText()}
      </div>
    </div>
  );
};
