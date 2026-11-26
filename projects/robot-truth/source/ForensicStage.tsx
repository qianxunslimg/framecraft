import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { hexRgba } from "./kinematics";

export const C = {
  bg: "#04070f",
  cyan: "#00f0ff",
  emerald: "#00ff9d",
  blue: "#38bdf8",
  violet: "#a855f7",
  gold: "#ffb800",
  orange: "#ff7a18",
  crimson: "#ff2a5f",
  ink: "#f8fafc",
  muted: "#94a3b8",
  dim: "#475569",
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
  return cues.find((c) => c.cue === name) ?? { cue: name, from: fallback, duration: 150, display: "" };
}

/**
 * Animated Robotics Forensic Lab Background:
 * Architectural drafting grid + PCB edge pulses + volumetric light pools + subtle radar scan.
 */
const LabGridCanvas: React.FC<{ accent: string; frame: number }> = ({ accent, frame }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const w = 1920;
    const h = 1080;
    ctx.clearRect(0, 0, w, h);

    // Precision engineering drafting grid
    ctx.strokeStyle = hexRgba(accent, 0.055);
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Subtle moving horizontal X-ray calibration line
    const scanY = (frame * 2.4) % h;
    const sg = ctx.createLinearGradient(0, scanY - 36, 0, scanY + 36);
    sg.addColorStop(0, "transparent");
    sg.addColorStop(0.5, hexRgba(accent, 0.09));
    sg.addColorStop(1, "transparent");
    ctx.fillStyle = sg;
    ctx.fillRect(0, scanY - 36, w, 72);

    // Corner circuit pulses
    const traces: Array<Array<[number, number]>> = [
      [[0, 140], [160, 140], [210, 190], [340, 190]],
      [[1920, 140], [1760, 140], [1710, 190], [1580, 190]],
      [[0, 920], [180, 920], [240, 860], [400, 860]],
      [[1920, 920], [1740, 920], [1680, 860], [1520, 860]],
    ];
    traces.forEach((pts, idx) => {
      ctx.strokeStyle = hexRgba(accent, 0.16);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();

      const t = ((frame * 0.014 + idx * 0.28) % 1 + 1) % 1;
      const seg = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1)));
      const u = t * (pts.length - 1) - seg;
      const px = pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * u;
      const py = pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * u;
      const g = ctx.createRadialGradient(px, py, 1, px, py, 14);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.4, hexRgba(accent, 0.85));
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // Ambient floating data dust
    for (let i = 0; i < 36; i++) {
      const x = (((i * 197 + frame * (0.3 + (i % 4) * 0.14)) % (w + 80)) + (w + 80)) % (w + 80) - 40;
      const y = (((i * 131 - frame * (0.18 + (i % 3) * 0.1)) % (h + 80)) + (h + 80)) % (h + 80) - 40;
      const r = 1.4 + (i % 3) * 0.9;
      ctx.fillStyle = hexRgba(i % 4 === 0 ? "#ffffff" : accent, 0.15 + 0.18 * (0.5 + 0.5 * Math.sin(frame * 0.06 + i)));
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [accent, frame]);

  return (
    <canvas
      ref={ref}
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
};

export const ForensicStage: React.FC<{
  accent: string;
  tag: string;
  telemetry: string;
  shake?: number;
  children: React.ReactNode;
}> = ({ accent, tag, telemetry, shake = 0, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const openFlash = interpolate(frame, [0, 6, 14], [0.34, 0.08, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sx = shake > 0 ? Math.sin(frame * 3.1) * shake : 0;
  const sy = shake > 0 ? Math.cos(frame * 3.6) * shake * 0.7 : 0;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 76% 68% at 50% 45%, ${hexRgba(accent, 0.14)} 0%, #050a16 55%, #02040a 100%)`,
        overflow: "hidden",
        opacity: fadeIn * fadeOut,
        fontFamily: "'Noto Sans CJK SC', 'PingFang SC', 'Inter', sans-serif",
      }}
    >
      <LabGridCanvas accent={accent} frame={frame} />

      <AbsoluteFill style={{ transform: `translate3d(${sx}px, ${sy}px, 0)` }}>
        {children}
      </AbsoluteFill>

      {/* Ultra-sleek top telemetry bar */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }} />
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.2em", color: accent, textShadow: `0 0 14px ${accent}88` }}>
            {tag}
          </span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", color: "rgba(226,232,240,0.72)" }}>
          {telemetry}
        </span>
      </div>

      {openFlash > 0.01 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(circle at 50% 48%, #ffffff, ${accent} 45%, transparent 72%)`,
            opacity: openFlash,
            mixBlendMode: "screen",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export const GlassViewport: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
  label?: string;
  badge?: string;
  glow?: number;
  delay?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, accent, label, badge, glow = 0.55, delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 18, stiffness: 175 } });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 20,
        background: "linear-gradient(155deg, rgba(14, 24, 46, 0.80) 0%, rgba(5, 10, 22, 0.88) 100%)",
        border: `1.5px solid ${hexRgba(accent, 0.48 + glow * 0.4)}`,
        boxShadow: `0 22px 56px rgba(0, 0, 0, 0.65), 0 0 ${24 + glow * 32}px ${hexRgba(accent, 0.22 + glow * 0.2)}, inset 0 1px 0 rgba(255,255,255,0.22)`,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
      }}
    >
      {(label || badge) && (
        <div
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${hexRgba(accent, 0.22)}`,
            background: `linear-gradient(90deg, ${hexRgba(accent, 0.14)}, transparent)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "0.02em" }}>{label}</span>
          {badge && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                fontWeight: 800,
                color: accent,
                padding: "4px 12px",
                borderRadius: 8,
                background: hexRgba(accent, 0.16),
                border: `1px solid ${hexRgba(accent, 0.45)}`,
              }}
            >
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export const ForensicSubtitles: React.FC<{
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
        <span style={{ color: C.cyan, textShadow: `0 0 18px ${C.cyan}cc` }}>{active.highlight}</span>
        {parts.slice(1).join(active.highlight)}
      </>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
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
          padding: "8px 26px",
          borderRadius: 12,
          background: "rgba(3, 6, 15, 0.82)",
          border: "1px solid rgba(148, 163, 184, 0.16)",
          fontFamily: "'Noto Sans CJK SC', 'PingFang SC', sans-serif",
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "0.03em",
          color: "#f8fafc",
          textShadow: "0 3px 14px rgba(0,0,0,0.98)",
        }}
      >
        {renderText()}
      </div>
    </div>
  );
};
