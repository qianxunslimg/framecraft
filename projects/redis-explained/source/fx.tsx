import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./stage";

const TAU = Math.PI * 2;
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export type FXMode = "memorySparks" | "dataFlow" | "speedGrid" | "sunburst" | "confetti";

export const CanvasFXLayer: React.FC<{
  mode: FXMode;
  burstFrames?: number[];
  accent?: string;
}> = ({ mode, burstFrames = [], accent = C.crimson }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1920;
    const H = 1080;
    ctx.clearRect(0, 0, W, H);

    if (mode === "memorySparks") {
      for (let i = 0; i < 24; i++) {
        const y = 130 + ((i * 39) % 820);
        const speed = 13 + (i % 5) * 6;
        const x = ((frame * speed + i * 163) % (W + 300)) - 150;
        const len = 70 + (i % 4) * 34;
        ctx.strokeStyle =
          i % 3 === 0
            ? "rgba(225,29,72,0.28)"
            : i % 3 === 1
              ? "rgba(245,158,11,0.24)"
              : "rgba(6,182,212,0.20)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len, y);
        ctx.stroke();
      }
    }

    if (mode === "dataFlow") {
      ctx.strokeStyle = "rgba(14,165,233,0.12)";
      ctx.lineWidth = 4;
      ctx.setLineDash([22, 18]);
      ctx.lineDashOffset = -frame * 4.2;
      for (const y of [220, 410, 600, 790]) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    if (mode === "speedGrid") {
      ctx.strokeStyle = "rgba(225, 29, 72, 0.19)";
      ctx.lineWidth = 2;
      const horizon = 650;
      for (let k = -10; k <= 10; k++) {
        ctx.beginPath();
        ctx.moveTo(W / 2 + k * 70, horizon);
        ctx.lineTo(W / 2 + k * 255, H + 40);
        ctx.stroke();
      }
      for (let r = 0; r < 10; r++) {
        const p = ((r / 10) + (frame * 0.025) % 0.1) % 1;
        const y = horizon + Math.pow(p, 1.9) * (H - horizon + 40);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    if (mode === "sunburst") {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(frame * 0.005);
      const rays = 18;
      for (let i = 0; i < rays; i++) {
        const a0 = (i / rays) * TAU;
        const a1 = ((i + 0.45) / rays) * TAU;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 1320, a0, a1);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? "rgba(220, 38, 38, 0.042)" : "rgba(245, 158, 11, 0.042)";
        ctx.fill();
      }
      ctx.restore();
    }

    if (mode === "confetti") {
      const palette = [C.red, C.amber, C.cyan, C.mint, C.indigo, C.lavender];
      for (let i = 0; i < 42; i++) {
        const x = hash(i * 13) * W + Math.sin(frame * 0.05 + i) * 28;
        const y = ((frame * (2.8 + hash(i * 19) * 3) + hash(i * 31) * H) % (H + 80)) - 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(frame * (0.06 + hash(i) * 0.07) + i);
        ctx.fillStyle = palette[i % palette.length];
        ctx.globalAlpha = 0.68;
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, 7, 0, TAU);
          ctx.fill();
        } else {
          ctx.fillRect(-9, -4, 18, 8);
        }
        ctx.restore();
      }
    }

    const burstColors = [accent, C.amber, C.cyan, C.mint, C.lavender];
    burstFrames.forEach((bf, bIdx) => {
      const age = frame - bf;
      if (age < 0 || age > 26) return;
      const p = age / 26;
      const easeOut = 1 - Math.pow(1 - p, 3);
      const cx = W * (0.25 + hash(bIdx * 43 + 7) * 0.5);
      const cy = H * (0.28 + hash(bIdx * 59 + 3) * 0.34);

      ctx.beginPath();
      ctx.arc(cx, cy, 26 + easeOut * 165, 0, TAU);
      ctx.strokeStyle = burstColors[bIdx % burstColors.length];
      ctx.globalAlpha = (1 - p) * 0.45;
      ctx.lineWidth = 5 * (1 - p);
      ctx.stroke();

      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * TAU + bIdx * 0.4;
        const dist = 20 + easeOut * (120 + hash(k * 17 + bIdx) * 110);
        ctx.fillStyle = burstColors[(k + bIdx) % burstColors.length];
        ctx.globalAlpha = (1 - p) * 0.85;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, (1 - p) * 8 + 2, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }, [frame, mode, burstFrames, accent]);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export const ExtrudedTitle: React.FC<{
  text: string;
  size?: number;
  color?: string;
  shadowColor?: string;
  startFrame?: number;
  stagger?: number;
}> = ({
  text,
  size = 66,
  color = C.ink,
  shadowColor = C.amber,
  startFrame = 0,
  stagger = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = [...text];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      {chars.map((ch, i) => {
        const p = spring({
          frame: Math.max(0, frame - startFrame - i * stagger),
          fps,
          config: { damping: 10, stiffness: 220 },
        });
        const rot = interpolate(p, [0, 1], [i % 2 === 0 ? -14 : 14, 0]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: size,
              fontWeight: 700,
              color,
              lineHeight: 1.08,
              textShadow: `0 4px 0 ${shadowColor}, 0 8px 0 rgba(28,32,48,0.22)`,
              WebkitTextStroke: "2.5px #1c2030",
              transform: `translateY(${(1 - p) * 42}px) rotate(${rot}deg) scale(${p})`,
              opacity: p,
              minWidth: ch === " " ? Math.round(size * 0.26) : undefined,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </div>
  );
};

export const SceneWipeIn: React.FC<{ color?: string; duration?: number }> = ({
  color = C.red,
  duration = 13,
}) => {
  const frame = useCurrentFrame();
  if (frame >= duration) return null;
  const p = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ease = 1 - Math.pow(1 - p, 3);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 95, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          left: -200 + ease * 2350,
          width: 2350,
          background: color,
          transform: "skewX(-14deg)",
          boxShadow: "-24px 0 0 rgba(255,255,255,0.45)",
        }}
      />
    </AbsoluteFill>
  );
};
