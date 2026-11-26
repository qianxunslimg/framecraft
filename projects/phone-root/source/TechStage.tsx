import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

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
  return cues.find((c) => c.cue === name) ?? { cue: name, from: fallback, duration: 120, display: "" };
}

export function hexRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/**
 * Live PCB micro-circuitry + volumetric glow + drifting light dust canvas backdrop.
 * Layered over a subtly blurred photorealistic CGI plate so every engineering scene
 * feels like a sleek Apple Keynote / Geekerwan hardware studio instead of a flat void.
 */
const LiveCircuitBackdrop: React.FC<{
  accent: string;
  frame: number;
  intensity?: number;
}> = ({ accent, frame, intensity = 1 }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const w = 1920;
    const h = 1080;
    ctx.clearRect(0, 0, w, h);

    // Precision architectural micro-grid (ultra subtle)
    ctx.strokeStyle = hexRgba(accent, 0.055 * intensity);
    ctx.lineWidth = 1;
    const step = 64;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Glowing PCB orthogonal traces radiating from edges with travelling light pulses
    const traces: Array<Array<[number, number]>> = [
      [[0, 180], [180, 180], [240, 240], [420, 240]],
      [[0, 860], [220, 860], [280, 800], [520, 800]],
      [[1920, 210], [1720, 210], [1660, 270], [1480, 270]],
      [[1920, 840], [1680, 840], [1620, 780], [1390, 780]],
      [[260, 0], [260, 120], [320, 180], [320, 320]],
      [[1660, 1080], [1660, 950], [1600, 890], [1600, 740]],
    ];

    ctx.save();
    traces.forEach((pts, idx) => {
      ctx.strokeStyle = hexRgba(accent, 0.14 * intensity);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();

      // Solder pads at ends
      const end = pts[pts.length - 1];
      ctx.fillStyle = hexRgba(accent, 0.35 * intensity);
      ctx.beginPath();
      ctx.arc(end[0], end[1], 4, 0, Math.PI * 2);
      ctx.fill();

      // Animated signal pulse racing along trace
      const t = ((frame * 0.015 + idx * 0.23) % 1 + 1) % 1;
      const segCount = pts.length - 1;
      const pos = t * segCount;
      const si = Math.min(segCount - 1, Math.floor(pos));
      const u = pos - si;
      const px = pts[si][0] + (pts[si + 1][0] - pts[si][0]) * u;
      const py = pts[si][1] + (pts[si + 1][1] - pts[si][1]) * u;
      const g = ctx.createRadialGradient(px, py, 1, px, py, 16);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.35, hexRgba(accent, 0.85 * intensity));
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, 16, 0, Math.PI * 2);
      ctx.fill();
    });

    // Floating depth bokeh motes
    for (let i = 0; i < 32; i++) {
      const px = (((i * 193 + frame * (0.35 + (i % 4) * 0.15)) % (w + 80)) + (w + 80)) % (w + 80) - 40;
      const py = (((i * 127 - frame * (0.2 + (i % 3) * 0.12)) % (h + 80)) + (h + 80)) % (h + 80) - 40;
      const r = 1.6 + (i % 4) * 0.9;
      const al = (0.14 + 0.22 * (0.5 + 0.5 * Math.sin(frame * 0.06 + i * 1.4))) * intensity;
      ctx.fillStyle = hexRgba(i % 4 === 0 ? "#ffffff" : accent, al);
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }, [accent, frame, intensity]);

  return (
    <canvas
      ref={ref}
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
};

/**
 * High-Craft Tech Stage Wrapper:
 * Softly blurred photorealistic CGI studio backdrop + live PCB micro-circuits +
 * volumetric ambient lighting + subtle camera push + clean minimal chapter marker.
 */
export const TechStage: React.FC<{
  plate: string;
  accent: string;
  tag: string;
  subTag?: string;
  plateOpacity?: number;
  plateBlur?: number;
  cameraZoom?: number;
  shake?: number;
  children: React.ReactNode;
}> = ({
  plate,
  accent,
  tag,
  subTag,
  plateOpacity = 0.38,
  plateBlur = 2.5,
  cameraZoom = 1.0,
  shake = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const t = Math.min(1, frame / Math.max(1, durationInFrames));
  const bgScale = interpolate(t, [0, 1], [1.04, 1.16]);
  const openFlash = interpolate(frame, [0, 6, 15], [0.36, 0.08, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sx = shake > 0 ? Math.sin(frame * 2.9) * shake : 0;
  const sy = shake > 0 ? Math.cos(frame * 3.4) * shake * 0.7 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        overflow: "hidden",
        opacity: fadeIn * fadeOut,
        fontFamily: "'Noto Sans CJK SC', 'PingFang SC', 'Inter', sans-serif",
      }}
    >
      {/* Layer 1: Photorealistic CGI Studio Atmospheric Backdrop */}
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale}) translate3d(${Math.sin(frame * 0.012) * 14}px, ${Math.cos(frame * 0.01) * 10}px, 0)`,
          opacity: plateOpacity,
          filter: plateBlur > 0 ? `blur(${plateBlur}px) saturate(1.15) contrast(1.08)` : "saturate(1.12) contrast(1.06)",
        }}
      >
        <Img
          src={staticFile(`phone-root/owned/plates/${plate}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Layer 2: Deep Obsidian Studio Light Wash & Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 72% 64% at 50% 46%, ${hexRgba(accent, 0.14)} 0%, rgba(4, 7, 15, 0.74) 60%, rgba(2, 4, 10, 0.94) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Layer 3: Live PCB Micro-Circuits & Bokeh Particles */}
      <LiveCircuitBackdrop accent={accent} frame={frame} intensity={plateOpacity > 0.5 ? 0.45 : 1} />

      {/* Layer 4: Main High-Craft Animated Engineering World with Camera Rig */}
      <AbsoluteFill
        style={{
          transform: `translate3d(${sx}px, ${sy}px, 0) scale(${cameraZoom})`,
          transformOrigin: "50% 48%",
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Layer 5: Ultra-Sleek Top-Left Micro Indicator (NOT a bulky PPT header) */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 42,
          display: "flex",
          alignItems: "center",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: accent,
            boxShadow: `0 0 14px ${accent}`,
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: accent,
            textShadow: `0 0 14px ${accent}88`,
          }}
        >
          {tag}
        </span>
        {subTag && (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              letterSpacing: "0.14em",
              color: "rgba(226, 232, 240, 0.58)",
              paddingLeft: 10,
              borderLeft: "1px solid rgba(148, 163, 184, 0.3)",
            }}
          >
            {subTag}
          </span>
        )}
      </div>

      {/* Optical scene-cut light flash */}
      {openFlash > 0.01 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(circle at 50% 48%, #ffffff, ${accent} 45%, transparent 75%)`,
            opacity: openFlash,
            mixBlendMode: "screen",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Brushed-Titanium & Optical-Glass Hardware Module Card.
 * Specular top bevel, soft deep shadow, animated diagonal glass sheen, zero ugly PPT borders.
 */
export const HardwareModule: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
  glow?: number;
  radius?: number;
  delay?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ x, y, w, h, accent, glow = 0.5, radius = 20, delay = 0, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 18, stiffness: 170 } });
  const sheen = ((frame * 0.012 + x * 0.001) % 2.4) - 0.6;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        background: `linear-gradient(155deg, rgba(16, 28, 52, 0.78) 0%, rgba(6, 12, 24, 0.86) 100%)`,
        border: `1.5px solid ${hexRgba(accent, 0.52 + glow * 0.4)}`,
        boxShadow: `0 24px 64px rgba(0, 0, 0, 0.68), 0 0 ${32 + glow * 38}px ${hexRgba(accent, 0.28 + glow * 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.28)`,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px) scale(${0.96 + p * 0.04})`,
        ...style,
      }}
    >
      {/* Subtle diagonal glass specular sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(115deg, transparent ${(sheen - 0.16) * 100}%, rgba(255,255,255,0.09) ${sheen * 100}%, transparent ${(sheen + 0.16) * 100}%)`,
        }}
      />
      {children}
    </div>
  );
};

/**
 * Animated SVG Optical Data Conduit with glowing travelling packets.
 */
export const DataConduit: React.FC<{
  d: string;
  color: string;
  width?: number;
  packets?: number;
  speed?: number;
  reverse?: boolean;
  dashed?: boolean;
  opacity?: number;
}> = ({ d, color, width = 3, packets = 3, speed = 0.02, reverse = false, dashed = false, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const dashOffset = (reverse ? 1 : -1) * frame * 3.5;

  return (
    <g opacity={opacity}>
      {/* Soft bloom under-stroke */}
      <path d={d} fill="none" stroke={color} strokeWidth={width * 3.6} strokeOpacity={0.22} strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "10 8" : undefined}
        strokeDashoffset={dashed ? dashOffset : undefined}
        strokeLinecap="round"
      />
      {/* Travelling bright signal beads via animated dash overlay */}
      {packets > 0 && (
        <path
          d={d}
          fill="none"
          stroke="#ffffff"
          strokeWidth={width + 2.2}
          strokeDasharray={`14 ${Math.max(90, Math.round(360 / packets))}`}
          strokeDashoffset={(reverse ? 1 : -1) * frame * (speed * 420)}
          strokeLinecap="round"
          strokeOpacity={0.92}
        />
      )}
    </g>
  );
};

/**
 * Clean Cinema-Style Subtitles (crisp contrast, zero clunky grey box).
 */
export const TechSubtitles: React.FC<{
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
          padding: "8px 26px",
          borderRadius: 12,
          background: "rgba(3, 6, 15, 0.78)",
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

export function easeOutCubic(v: number): number {
  return Easing.out(Easing.cubic)(Math.min(1, Math.max(0, v)));
}
