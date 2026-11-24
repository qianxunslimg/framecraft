import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./stage";

const TAU = Math.PI * 2;
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export type FxMode =
  | "nightPulse"
  | "ecgWave"
  | "pullStreams"
  | "grafanaGrid"
  | "sunburst"
  | "confetti";

/** Canvas 2D visual FX layer with live ECG wave, Grafana telemetry grid, Pull streams, bursts & confetti */
export const CanvasFXLayer: React.FC<{
  mode: FxMode;
  burstFrames?: number[];
  accent?: string;
}> = ({ mode, burstFrames = [], accent = C.promOrange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1920;
    const H = 1080;
    ctx.clearRect(0, 0, W, H);

    if (mode === "nightPulse") {
      for (let i = 0; i < 36; i++) {
        const x = hash(i * 11) * W;
        const y = hash(i * 17) * H * 0.72;
        const tw = 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.06 + i));
        ctx.fillStyle = `rgba(253, 186, 116, ${tw * 0.65})`;
        ctx.beginPath();
        ctx.arc(x, y, 2 + hash(i) * 2.5, 0, TAU);
        ctx.fill();
      }
      // Subtle animated ECG monitor line along lower backdrop
      ctx.save();
      ctx.beginPath();
      const baseY = 815;
      for (let x = 0; x <= W; x += 8) {
        const p = ((x + frame * 7) % 240) / 240;
        let spike = 0;
        if (p > 0.42 && p < 0.48) spike = -68 * Math.sin(((p - 0.42) / 0.06) * Math.PI);
        else if (p >= 0.48 && p < 0.53) spike = 38 * Math.sin(((p - 0.48) / 0.05) * Math.PI);
        const y = baseY + spike;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(230, 82, 44, 0.35)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    if (mode === "ecgWave") {
      // Bright rolling oscilloscope waves for TSDB time-series background
      [
        { y: 240, col: "rgba(230, 82, 44, 0.14)", spd: 5, amp: 24 },
        { y: 800, col: "rgba(245, 158, 11, 0.18)", spd: 7, amp: 30 },
      ].forEach((row, rIdx) => {
        ctx.save();
        ctx.beginPath();
        for (let x = 0; x <= W; x += 14) {
          const y =
            row.y +
            Math.sin((x + frame * row.spd) * 0.012 + rIdx) * row.amp +
            Math.cos((x - frame * 3) * 0.025) * (row.amp * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = row.col;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
      });
    }

    if (mode === "pullStreams") {
      for (let lane = 0; lane < 4; lane++) {
        const yBase = 230 + lane * 185;
        ctx.save();
        ctx.beginPath();
        for (let x = 0; x <= W; x += 28) {
          const y = yBase + Math.sin(x * 0.005 + frame * 0.05 + lane) * 16;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = lane % 2 === 0 ? "rgba(14, 165, 233, 0.12)" : "rgba(230, 82, 44, 0.10)";
        ctx.lineWidth = 4;
        ctx.stroke();
        for (let p = 0; p < 3; p++) {
          const px = W - (((frame * (5 + lane) + p * 640 + lane * 190) % (W + 80)) - 40);
          const py = yBase + Math.sin(px * 0.005 + frame * 0.05 + lane) * 16;
          ctx.fillStyle = lane % 2 === 0 ? C.sky : C.promOrange;
          ctx.globalAlpha = 0.45;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    if (mode === "grafanaGrid") {
      // Sleek dark Grafana telemetry grid + glowing ambient beams
      ctx.save();
      ctx.strokeStyle = "rgba(244, 104, 0, 0.09)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x <= W; x += 96) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += 96) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (mode === "sunburst") {
      ctx.save();
      ctx.translate(W / 2, H * 0.48);
      ctx.rotate(frame * 0.005);
      const rays = 16;
      for (let i = 0; i < rays; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const a0 = (i / rays) * TAU;
        const a1 = a0 + (0.44 / rays) * TAU;
        ctx.arc(0, 0, 1320, a0, a1);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? "rgba(230, 82, 44, 0.045)" : "rgba(245, 158, 11, 0.045)";
        ctx.fill();
      }
      ctx.restore();
    }

    if (mode === "confetti") {
      const palette = [C.promOrange, C.grafAmber, C.mint, C.sky, C.coral, C.lavender];
      for (let i = 0; i < 40; i++) {
        const x = hash(i * 13) * W + Math.sin(frame * 0.05 + i) * 28;
        const y = ((frame * (2.6 + hash(i * 19) * 3) + hash(i * 31) * H) % (H + 80)) - 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(frame * (0.06 + hash(i) * 0.07) + i);
        ctx.fillStyle = palette[i % palette.length];
        ctx.globalAlpha = 0.65;
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

    const burstColors = [accent, C.grafAmber, C.mint, C.sky, C.coral];
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
  size = 70,
  color = C.ink,
  shadowColor = C.grafAmber,
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
              textShadow: `0 4px 0 ${shadowColor}, 0 8px 0 rgba(30,34,48,0.22)`,
              WebkitTextStroke: "2.5px #1e2230",
              transform: `translateY(${(1 - p) * 42}px) rotate(${rot}deg) scale(${p})`,
              opacity: p,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const SceneWipeIn: React.FC<{ color?: string; duration?: number }> = ({
  color = C.promOrange,
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
