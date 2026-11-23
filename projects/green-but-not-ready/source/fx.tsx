import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, useAudioBeat } from "./stage";

const TAU = Math.PI * 2;
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export type FxMode =
  | "sunburst"
  | "speedlines"
  | "arcadeGrid"
  | "confetti"
  | "sunsetBokeh"
  | "codeRain";

/** High-craft Canvas 2D visual effects layer (particles, bursts, 3D perspective floor, speed lines, audio wave ribbon) */
export const CanvasFXLayer: React.FC<{
  mode: FxMode;
  globalOffset?: number;
  burstFrames?: number[];
  waveColor?: string;
  showWave?: boolean;
}> = ({
  mode,
  globalOffset = 0,
  burstFrames = [],
  waveColor = C.mint,
  showWave = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const beat = useAudioBeat(globalOffset);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1920;
    const H = 1080;
    ctx.clearRect(0, 0, W, H);

    // 1. Mode-specific rich dynamic background scenery
    if (mode === "sunburst") {
      ctx.save();
      ctx.translate(W / 2, H * 0.48);
      ctx.rotate(frame * 0.008);
      const rays = 18;
      for (let i = 0; i < rays; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const a0 = (i / rays) * TAU;
        const a1 = a0 + (0.45 / rays) * TAU;
        ctx.arc(0, 0, 1300, a0, a1);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? "rgba(255, 183, 3, 0.065)" : "rgba(255, 107, 157, 0.05)";
        ctx.fill();
      }
      ctx.restore();
    }

    if (mode === "speedlines") {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      const count = 48;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * TAU + Math.sin(frame * 0.03 + i) * 0.02;
        const inner = 540 - beat.onset * 90 + (hash(i + Math.floor(frame / 2)) * 180);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
        ctx.lineTo(Math.cos(a) * 1250, Math.sin(a) * 1250);
        ctx.strokeStyle =
          i % 3 === 0
            ? "rgba(255, 107, 157, 0.22)"
            : i % 3 === 1
              ? "rgba(23, 184, 144, 0.18)"
              : "rgba(255, 183, 3, 0.2)";
        ctx.lineWidth = 2 + hash(i * 7) * 5;
        ctx.stroke();
      }
      ctx.restore();
    }

    if (mode === "arcadeGrid") {
      // Sweeping stage spotlights from top corners
      const drawBeam = (ox: number, angle: number, color: string) => {
        ctx.save();
        ctx.translate(ox, -20);
        ctx.rotate(angle);
        const grad = ctx.createLinearGradient(0, 0, 0, 1200);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(30, 0);
        ctx.lineTo(260, 1200);
        ctx.lineTo(-260, 1200);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      };
      drawBeam(280, -0.35 + Math.sin(frame * 0.04) * 0.22, "rgba(255, 107, 157, 0.18)");
      drawBeam(1640, 0.35 - Math.cos(frame * 0.045) * 0.22, "rgba(78, 168, 222, 0.18)");
      drawBeam(960, Math.sin(frame * 0.03) * 0.28, "rgba(23, 184, 144, 0.14)");

      // 3D perspective synthwave floor grid
      const horizonY = 690;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 107, 157, 0.28)";
      ctx.lineWidth = 2;
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(W / 2 + i * 75, horizonY);
        ctx.lineTo(W / 2 + i * 310, H + 40);
        ctx.stroke();
      }
      for (let r = 0; r < 10; r++) {
        const t = ((r + (frame * 0.09) % 1) / 10);
        const y = horizonY + Math.pow(t, 2.1) * (H - horizonY + 40);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = `rgba(78, 168, 222, ${0.12 + t * 0.28})`;
        ctx.stroke();
      }
      ctx.restore();
    }

    if (mode === "codeRain") {
      const tokens = ["if()", "try{}", "catch", "guard", "assert", "PASS✓", "!=null", "mock()"];
      ctx.save();
      ctx.font = '700 22px monospace';
      for (let i = 0; i < 24; i++) {
        const x = 60 + i * 80;
        const speed = 1.4 + hash(i * 3) * 2.2;
        const y = ((frame * speed * 3 + hash(i * 11) * H) % (H + 120)) - 60;
        ctx.fillStyle =
          i % 3 === 0
            ? "rgba(23, 184, 144, 0.14)"
            : i % 3 === 1
              ? "rgba(78, 168, 222, 0.13)"
              : "rgba(155, 114, 207, 0.12)";
        ctx.fillText(tokens[i % tokens.length], x, y);
      }
      ctx.restore();
    }

    if (mode === "sunsetBokeh") {
      // Soft glowing sunset bokeh circles + drifting warm petals
      for (let i = 0; i < 22; i++) {
        const x = (hash(i * 5) * W + frame * (0.5 + hash(i) * 0.8)) % (W + 100) - 50;
        const y = (hash(i * 9) * H + Math.sin(frame * 0.04 + i) * 24 + H) % H;
        const r = 16 + hash(i * 13) * 44;
        ctx.beginPath();
        ctx.arc(x, y, r * (1 + beat.low * 0.12), 0, TAU);
        ctx.fillStyle =
          i % 2 === 0 ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 183, 3, 0.15)";
        ctx.fill();
      }
    }

    if (mode === "confetti" || mode === "arcadeGrid") {
      // Continuous vibrant confetti shower
      const palette = [C.pink, C.mint, C.butter, C.sky, C.coral, C.lavender];
      const pieces = mode === "confetti" ? 42 : 24;
      for (let i = 0; i < pieces; i++) {
        const x = hash(i * 17) * W + Math.sin(frame * 0.06 + i) * 32;
        const y = ((frame * (3.2 + hash(i * 23) * 3.5) + hash(i * 31) * H) % (H + 80)) - 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(frame * (0.07 + hash(i) * 0.08) + i);
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

    // 2. Beat-synced & cue-triggered radial sparkle bursts
    const burstColors = [C.pink, C.mint, C.butter, C.sky, C.coral];
    burstFrames.forEach((bf, bIdx) => {
      const age = frame - bf;
      if (age < 0 || age > 28) return;
      const p = age / 28;
      const easeOut = 1 - Math.pow(1 - p, 3);
      const cx = W * (0.28 + hash(bIdx * 41) * 0.44);
      const cy = H * (0.25 + hash(bIdx * 53) * 0.35);

      // Expanding ring
      ctx.beginPath();
      ctx.arc(cx, cy, 30 + easeOut * 190, 0, TAU);
      ctx.strokeStyle = burstColors[bIdx % burstColors.length];
      ctx.globalAlpha = (1 - p) * 0.55;
      ctx.lineWidth = 6 * (1 - p);
      ctx.stroke();

      // 14 star particles shooting out
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * TAU + bIdx * 0.5;
        const dist = 24 + easeOut * (140 + hash(k * 19 + bIdx) * 140);
        const px = cx + Math.cos(a) * dist;
        const py = cy + Math.sin(a) * dist;
        ctx.fillStyle = burstColors[(k + bIdx) % burstColors.length];
        ctx.globalAlpha = 1 - p;
        ctx.beginPath();
        ctx.arc(px, py, (1 - p) * 10 + 2, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });

    // 3. Smooth reactive audio wave ribbon across lower backdrop
    if (showWave) {
      ctx.save();
      ctx.beginPath();
      const baseY = H - 145;
      for (let x = 0; x <= W; x += 24) {
        const amp = 12 + beat.low * 32 + beat.onset * 22;
        const y =
          baseY +
          Math.sin(x * 0.008 + frame * 0.16) * amp +
          Math.cos(x * 0.015 - frame * 0.11) * (amp * 0.45);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = waveColor;
      ctx.globalAlpha = 0.25 + beat.low * 0.18;
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    }
  }, [frame, mode, beat.low, beat.onset, burstFrames, waveColor, showWave]);

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

/** 3D Extruded per-character bouncing typography (inspired by high-craft kinetic MVs) */
export const ExtrudedTitle: React.FC<{
  text: string;
  size?: number;
  color?: string;
  shadowColor?: string;
  startFrame?: number;
  stagger?: number;
  beatOffset?: number;
}> = ({
  text,
  size = 104,
  color = C.ink,
  shadowColor = C.pink,
  startFrame = 0,
  stagger = 3,
  beatOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(beatOffset);
  const chars = [...text];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {chars.map((ch, i) => {
        const p = spring({
          frame: Math.max(0, frame - startFrame - i * stagger),
          fps,
          config: { damping: 10, stiffness: 210 },
        });
        const rot = interpolate(p, [0, 1], [i % 2 === 0 ? -18 : 18, 0]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: size,
              fontWeight: 700,
              color,
              lineHeight: 1.05,
              textShadow: `0 4px 0 ${shadowColor}, 0 8px 0 ${shadowColor}, 0 12px 0 rgba(38,34,40,0.2)`,
              WebkitTextStroke: "3px #262228",
              transform: `translateY(${(1 - p) * 55}px) rotate(${rot}deg) scale(${p * (1 + beat.onset * 0.04)})`,
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

/** Smooth candy diagonal wipe / iris transition on scene entrance so cuts feel cinematic instead of PPT */
export const SceneWipeIn: React.FC<{
  color?: string;
  duration?: number;
}> = ({ color = C.mint, duration = 14 }) => {
  const frame = useCurrentFrame();
  if (frame >= duration) return null;

  const p = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ease = 1 - Math.pow(1 - p, 3);
  const offset = ease * 2300;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 95, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          left: -200 + offset,
          width: 2300,
          background: color,
          transform: "skewX(-14deg)",
          boxShadow: "-24px 0 0 rgba(255,255,255,0.45)",
        }}
      />
    </AbsoluteFill>
  );
};
