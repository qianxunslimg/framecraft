import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, usePulse } from "./stage";

const TAU = Math.PI * 2;
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export type FxMode =
  | "nightAlarm"
  | "sunburst"
  | "flowStreams"
  | "arcadeGrid"
  | "confetti"
  | "techNodes";

/** High-craft Canvas 2D visual FX layer (sweeping radar, 3D synth grid, data packets, cue bursts, confetti) */
export const CanvasFXLayer: React.FC<{
  mode: FxMode;
  burstFrames?: number[];
  accent?: string;
}> = ({ mode, burstFrames = [], accent = C.k8sBlue }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { beat } = usePulse();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1920;
    const H = 1080;
    ctx.clearRect(0, 0, W, H);

    if (mode === "nightAlarm") {
      // Twinkling night sky stars + sweeping alarm/radar glow
      for (let i = 0; i < 42; i++) {
        const x = hash(i * 11) * W;
        const y = hash(i * 19) * H * 0.72;
        const r = 1.5 + hash(i * 7) * 3;
        const tw = 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.06 + i));
        ctx.fillStyle = `rgba(219, 232, 255, ${tw * 0.75})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
      }
      // Subtle scanning radar rings in center
      ctx.save();
      ctx.translate(W / 2, H * 0.48);
      for (let r = 1; r <= 3; r++) {
        const rad = ((frame * 3.5 + r * 170) % 520) + 60;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, TAU);
        ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - rad / 580) * 0.22})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();
    }

    if (mode === "sunburst") {
      ctx.save();
      ctx.translate(W / 2, H * 0.48);
      ctx.rotate(frame * 0.006);
      const rays = 16;
      for (let i = 0; i < rays; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const a0 = (i / rays) * TAU;
        const a1 = a0 + (0.44 / rays) * TAU;
        ctx.arc(0, 0, 1320, a0, a1);
        ctx.closePath();
        ctx.fillStyle =
          i % 2 === 0 ? "rgba(50, 108, 229, 0.05)" : "rgba(16, 185, 129, 0.045)";
        ctx.fill();
      }
      ctx.restore();
    }

    if (mode === "flowStreams") {
      // Smooth flowing network packet ribbons across background
      for (let lane = 0; lane < 5; lane++) {
        const yBase = 210 + lane * 165;
        ctx.save();
        ctx.beginPath();
        for (let x = 0; x <= W; x += 32) {
          const y = yBase + Math.sin(x * 0.005 + frame * 0.06 + lane) * 18;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = lane % 2 === 0 ? "rgba(139, 92, 246, 0.1)" : "rgba(0, 180, 216, 0.1)";
        ctx.lineWidth = 4;
        ctx.stroke();
        // Glowing packet dots zipping along each lane
        for (let p = 0; p < 3; p++) {
          const px = ((frame * (5 + lane) + p * 640 + lane * 210) % (W + 80)) - 40;
          const py = yBase + Math.sin(px * 0.005 + frame * 0.06 + lane) * 18;
          ctx.fillStyle = lane % 2 === 0 ? C.lavender : C.cyan;
          ctx.globalAlpha = 0.45;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    if (mode === "techNodes") {
      // Floating pastel Kubernetes hexagons & technical watermarks
      const labels = ["Pod", "Node", "YAML", "etcd", "HPA", "Service", "Ingress", "PV"];
      ctx.save();
      ctx.font = "700 20px monospace";
      for (let i = 0; i < 18; i++) {
        const x = (hash(i * 17) * W + frame * (0.5 + hash(i) * 0.6)) % (W + 120) - 60;
        const y = hash(i * 29) * (H - 180) + 80 + Math.sin(frame * 0.04 + i) * 14;
        ctx.fillStyle = i % 2 === 0 ? "rgba(50, 108, 229, 0.12)" : "rgba(16, 185, 129, 0.11)";
        ctx.fillText(labels[i % labels.length], x, y);
      }
      ctx.restore();
    }

    if (mode === "arcadeGrid") {
      // 3D perspective glowing tech floor + vertical searchlights for Act 6 Control Plane Relay!
      const drawBeam = (ox: number, angle: number, color: string) => {
        ctx.save();
        ctx.translate(ox, -20);
        ctx.rotate(angle);
        const grad = ctx.createLinearGradient(0, 0, 0, 1150);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.moveTo(-28, 0);
        ctx.lineTo(28, 0);
        ctx.lineTo(240, 1150);
        ctx.lineTo(-240, 1150);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      };
      drawBeam(320, -0.3 + Math.sin(frame * 0.035) * 0.18, "rgba(50, 108, 229, 0.2)");
      drawBeam(1600, 0.3 - Math.cos(frame * 0.035) * 0.18, "rgba(0, 180, 216, 0.18)");

      const horizonY = 720;
      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
      ctx.lineWidth = 2;
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(W / 2 + i * 75, horizonY);
        ctx.lineTo(W / 2 + i * 300, H + 40);
        ctx.stroke();
      }
      for (let r = 0; r < 9; r++) {
        const t = (r + ((frame * 0.07) % 1)) / 9;
        const y = horizonY + Math.pow(t, 2.0) * (H - horizonY + 40);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 + t * 0.25})`;
        ctx.stroke();
      }
      ctx.restore();
    }

    if (mode === "confetti") {
      const palette = [C.k8sBlue, C.mint, C.butter, C.cyan, C.pink, C.lavender];
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

    // Cue-triggered radial star bursts!
    const burstColors = [accent, C.mint, C.butter, C.cyan, C.pink];
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
  }, [frame, mode, beat, burstFrames, accent]);

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

/** 3D Extruded kinetic title with per-character spring bounce */
export const ExtrudedTitle: React.FC<{
  text: string;
  size?: number;
  color?: string;
  shadowColor?: string;
  startFrame?: number;
  stagger?: number;
}> = ({
  text,
  size = 76,
  color = C.ink,
  shadowColor = C.butter,
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

/** Diagonal candy wipe transition at start of each act */
export const SceneWipeIn: React.FC<{ color?: string; duration?: number }> = ({
  color = C.k8sBlue,
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
