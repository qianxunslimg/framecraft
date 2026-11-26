import React, { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";
import { ArPin, C, CinemaStage, getCue, KineticSlam, SceneTiming } from "../hud";
import {
  Cam3D,
  clamp,
  drawCyberHighwayWorld,
  drawFsdRibbon3D,
  drawLine3D,
  drawPoly3D,
  drawVehicle3D,
  easeInOutCubic,
  easeOutCubic,
  H,
  hash,
  project3D,
  TAU,
  W,
} from "../engine3d";

/**
 * ACT 7: ERA 3.0 -> 4.0 — NEURAL PARTICLE VORTEX + HEX FORCE-FIELD GUARDRAIL -> VLA LIVING STREET -> DR. STRANGE 3-WAY MULTIVERSE!
 */
export const EvoE2eVlaScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cVort = getCue(scene.cues, "e2eVortex", 10);
  const cGuard = getCue(scene.cues, "e2eGuardrail", 180);
  const cVla1 = getCue(scene.cues, "vlaSignCop", 320);
  const cVla2 = getCue(scene.cues, "vlaVoicePark", 460);
  const cWm1 = getCue(scene.cues, "wmFreeze", 630);
  const cWm2 = getCue(scene.cues, "wmBranchPick", 780);

  const stage =
    frame >= cWm2.from ? 5
    : frame >= cWm1.from ? 4
    : frame >= cVla2.from ? 3
    : frame >= cVla1.from ? 2
    : frame >= cGuard.from ? 1
    : 0;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // STAGE 0: 3.0 END-TO-END — 4 MODULAR BOXES SHATTER INTO COLOSSAL 3D FLOWING NEURAL SYNAPTIC RIVER!
    if (stage === 0) {
      ctx.fillStyle = "#030510";
      ctx.fillRect(0, 0, W, H);
      const local = frame - cVort.from;
      const mergeT = easeInOutCubic((local - 24) / 36);

      // Ambient violet-cyan vortex radial glow
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.54, 40, W * 0.5, H * 0.54, 760);
      glow.addColorStop(0, "rgba(168, 85, 247, 0.28)");
      glow.addColorStop(0.5, "rgba(0, 229, 255, 0.12)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // First 24 frames: 4 rigid modular blocks slam into center & dissolve!
      if (mergeT < 0.95) {
        const labels = ["感知", "预测", "规划", "控制"];
        ctx.globalAlpha = 1 - mergeT;
        for (let i = 0; i < 4; i++) {
          const baseX = 360 + i * 400;
          const x = baseX + (W * 0.5 - baseX) * mergeT;
          const y = H * 0.54 + Math.sin(local * 0.2 + i) * 10;
          ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
          ctx.strokeStyle = C.muted;
          ctx.lineWidth = 3;
          ctx.strokeRect(x - 95, y - 55, 190, 110);
          ctx.fillRect(x - 95, y - 55, 190, 110);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 32px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(labels[i], x, y + 12);
        }
        ctx.textAlign = "left";
        ctx.globalAlpha = 1;
      }

      // Colossal 1920x1080 Flowing 3D Neural Synaptic River (Raw Sensor Photons -> Unified Vortex -> Golden Splines!)
      const pCount = 420;
      for (let i = 0; i < pCount; i++) {
        const u = ((hash(i * 17.3) + local * (0.008 + hash(i * 5.1) * 0.006)) % 1);
        const px = 80 + u * (W - 160);
        const ribbonSpread = Math.sin(u * Math.PI) * 260 + 28;
        const laneOff = (hash(i * 29.7) - 0.5) * 2 * ribbonSpread * (0.35 + 0.65 * mergeT);
        const waveY = Math.sin(u * 10 - local * 0.14 + hash(i * 11) * TAU) * 58;
        const py = H * 0.55 + laneOff + waveY;

        const col = u < 0.3 ? C.cyan : u < 0.7 ? C.violet : C.amber;
        ctx.fillStyle = col;
        ctx.globalAlpha = (0.35 + 0.65 * mergeT) * Math.sin(u * Math.PI);
        const sz = u > 0.7 ? 5.2 : 3.5;
        ctx.fillRect(px, py, sz * 2.8, sz);
      }
      ctx.globalAlpha = 1;

      // Glowing unified spline outputs streaming right out of the neural core!
      if (mergeT > 0.35) {
        for (let k = -2; k <= 2; k++) {
          ctx.strokeStyle = k === 0 ? C.amber : `${C.violet}66`;
          ctx.lineWidth = k === 0 ? 6 : 2;
          if (k === 0) {
            ctx.shadowColor = C.amber;
            ctx.shadowBlur = 24;
          }
          ctx.beginPath();
          for (let s = 0; s <= 40; s++) {
            const u = s / 40;
            const x = 140 + u * (W - 280);
            const y = H * 0.55 + Math.sin(u * 4.5 - local * 0.12 + k * 0.5) * (75 + k * 24) * Math.sin(u * Math.PI);
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
      return;
    }

    // STAGE 1: SAFETY GUARDRAIL — 3D HEXAGONAL ENERGY FORCE-FIELD SHIELD DEFLECTING RED HALLUCINATED SPLINE!
    if (stage === 1) {
      const local = frame - cGuard.from;
      const cam: Cam3D = { x: 0, y: 3.4, z: -9, yaw: 0, pitch: -0.16, fov: 960 };
      drawCyberHighwayWorld(ctx, cam, frame, { speed: 1.75, accent: C.violet });

      // Shimmering 3D Hexagonal Force-Field Walls lining BOTH sides of the safe driving corridor!
      for (const side of [-3.8, 3.8]) {
        for (let z = 6; z <= 54; z += 4.5) {
          const p1 = project3D(side, 0.2, z, cam);
          const p2 = project3D(side, 2.6, z + 3, cam);
          if (!p1.visible || !p2.visible) continue;
          drawPoly3D(
            ctx,
            [
              [side, 0.1, z],
              [side, 0.1, z + 3.8],
              [side, 2.5, z + 3.8],
              [side, 2.5, z],
            ],
            cam,
            "rgba(0, 229, 255, 0.11)",
            `${C.cyan}88`,
            1.6,
          );
        }
      }

      // Erratic Red Hallucinated Trajectory shooting toward right barrier -> SPARKING IMPACT -> DEFLECTED TO EMERALD!
      let prev: [number, number, number] = [0, 0.2, 8];
      for (let k = 1; k <= 20; k++) {
        const u = k / 20;
        const z = 8 + u * 42;
        const x = u < 0.45 ? (u / 0.45) * 3.7 : 3.7 - ((u - 0.45) / 0.55) * 3.5;
        const cur: [number, number, number] = [x, 0.22, z];
        const col = u < 0.45 ? C.crimson : C.emerald;
        ctx.shadowColor = col;
        ctx.shadowBlur = 18;
        drawLine3D(ctx, prev, cur, cam, col, 6);
        prev = cur;
      }
      ctx.shadowBlur = 0;

      // Glowing spark burst right at the guardrail impact point (x=3.7, z=27)!
      const imp = project3D(3.7, 0.8, 27, cam);
      if (imp.visible) {
        const pulse = 1 + 0.35 * Math.sin(local * 0.4);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = C.cyan;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(imp.sx, imp.sy, 14 * pulse, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
        for (let sp = 0; sp < 14; sp++) {
          const ang = hash(sp * 19 + Math.floor(local / 2)) * TAU;
          const len = 24 + hash(sp * 37) * 52;
          ctx.strokeStyle = sp % 2 === 0 ? C.cyan : C.crimson;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(imp.sx, imp.sy);
          ctx.lineTo(imp.sx + Math.cos(ang) * len, imp.sy + Math.sin(ang) * len);
          ctx.stroke();
        }
      }

      drawVehicle3D(ctx, { x: 0, z: 6 }, cam, { kind: "ego", accent: C.cyan, headlights: true, frame });
      return;
    }

    // STAGES 2 & 3: 4.0 VLA LIVING TWILIGHT STREET — ROAD SIGN + WAVING TRAFFIC COP + VOICE WAVEFORM CURB PARK!
    if (stage === 2 || stage === 3) {
      const local = stage === 3 ? frame - cVla2.from : frame - cVla1.from;
      const parkT = stage === 3 ? easeInOutCubic(local / 110) : 0;
      const cam: Cam3D = {
        x: -1.2 + parkT * 2.4,
        y: 3.1,
        z: -8 + parkT * 3,
        yaw: -0.06 + parkT * 0.16,
        pitch: -0.11,
        fov: 960,
      };
      drawCyberHighwayWorld(ctx, cam, frame, { speed: stage === 3 ? Math.max(0.1, 0.8 * (1 - parkT)) : 0.75, accent: C.violet, showGantries: false });

      // Warm Amber Illuminated 3D Convenience Store on Right Curb!
      drawPoly3D(ctx, [[7.2, 0, 14], [7.2, 0, 30], [7.2, 6.2, 30], [7.2, 6.2, 14]], cam, "rgba(245, 158, 11, 0.24)", C.amber, 3);
      drawPoly3D(ctx, [[7.2, 4.4, 14], [7.2, 4.4, 30], [7.2, 5.8, 30], [7.2, 5.8, 14]], cam, "rgba(245, 158, 11, 0.65)", "#ffffff", 2);
      const storeP = project3D(7.2, 5.1, 21, cam);
      if (storeP.visible) {
        ctx.font = "bold 24px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = C.amber;
        ctx.shadowBlur = 16;
        ctx.fillText("24H 便利店", storeP.sx - 54, storeP.sy + 8);
        ctx.shadowBlur = 0;
      }

      // Illuminated Overhead School-Zone Text Road Sign!
      const signP = project3D(-4.8, 4.6, 20, cam);
      if (signP.visible) {
        drawLine3D(ctx, [-4.8, 0, 20], [-4.8, 4.0, 20], cam, "#94a3b8", 4);
        ctx.fillStyle = "rgba(10, 22, 48, 0.94)";
        ctx.strokeStyle = C.cyan;
        ctx.lineWidth = 3;
        ctx.fillRect(signP.sx - 120, signP.sy - 46, 240, 74);
        ctx.strokeRect(signP.sx - 120, signP.sy - 46, 240, 74);
        ctx.fillStyle = C.amber;
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("前方学校路段", signP.sx, signP.sy - 16);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px monospace";
        ctx.fillText("7:30-8:30 禁左", signP.sx, signP.sy + 14);
        ctx.textAlign = "left";
      }

      // Animated Gesturing Traffic Officer Hologram ahead center-left!
      const copP = project3D(-1.6, 0.1, 24, cam);
      if (copP.visible) {
        const s = copP.scale * 0.045;
        const armWave = Math.sin(frame * 0.22) * 28 * s;
        ctx.strokeStyle = C.cyan;
        ctx.lineWidth = 4;
        ctx.shadowColor = C.cyan;
        ctx.shadowBlur = 18;
        // Head + Torso + Waving Arm
        ctx.beginPath();
        ctx.arc(copP.sx, copP.sy - 88 * s, 12 * s, 0, TAU);
        ctx.moveTo(copP.sx, copP.sy - 74 * s);
        ctx.lineTo(copP.sx, copP.sy - 32 * s);
        ctx.moveTo(copP.sx, copP.sy - 64 * s);
        ctx.lineTo(copP.sx + 34 * s, copP.sy - 72 * s + armWave);
        ctx.moveTo(copP.sx, copP.sy - 64 * s);
        ctx.lineTo(copP.sx - 26 * s, copP.sy - 46 * s);
        ctx.moveTo(copP.sx, copP.sy - 32 * s);
        ctx.lineTo(copP.sx - 14 * s, copP.sy);
        ctx.moveTo(copP.sx, copP.sy - 32 * s);
        ctx.lineTo(copP.sx + 14 * s, copP.sy);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Glowing Emerald Curb Parking Target & Smooth Yield-to-Curb Path in Stage 3!
      if (stage === 3) {
        drawPoly3D(ctx, [[3.2, 0.08, 17], [5.8, 0.08, 17], [5.8, 0.08, 25], [3.2, 0.08, 25]], cam, "rgba(16, 185, 129, 0.25)", C.emerald, 3.5);
        const pts: Array<{ x: number; z: number }> = [];
        for (let i = 0; i <= 14; i++) {
          const u = i / 14;
          pts.push({ x: easeInOutCubic(u) * 4.4, z: 7 + u * 14 });
        }
        drawFsdRibbon3D(ctx, pts, cam, C.emerald, 0.85, frame);

        // Live Glowing Multi-Band Voice Waveform Ribbon across upper-center!
        const wy = 282;
        ctx.strokeStyle = C.violet;
        ctx.lineWidth = 4;
        ctx.shadowColor = C.violet;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        for (let x = 560; x <= 1360; x += 8) {
          const env = Math.sin(((x - 560) / 800) * Math.PI);
          const amp = (Math.sin(x * 0.06 + frame * 0.35) * 26 + Math.cos(x * 0.11 - frame * 0.28) * 14) * env;
          if (x === 560) ctx.moveTo(x, wy + amp);
          else ctx.lineTo(x, wy + amp);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.font = "bold 24px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("“前面便利店门口帮我靠边停”", W * 0.5, wy - 36);
        ctx.textAlign = "left";
      }

      // Ego EV signaling right and smoothly parking into the convenience store bay!
      const ex = parkT * 4.3;
      const ez = 6 + parkT * 13;
      drawVehicle3D(ctx, { x: ex, z: ez, yaw: Math.sin(parkT * Math.PI) * 0.28 }, cam, {
        kind: "ego",
        accent: C.violet,
        headlights: true,
        rightBlinker: stage === 3,
        frame,
      });
      return;
    }

    // STAGES 4 & 5: DR. STRANGE TIME-FREEZE 3-WAY MULTIVERSE WORLD MODEL SPLIT!!
    const splitT = stage === 4 ? easeOutCubic((frame - cWm1.from) / 22) : 1;
    const expandCenter = stage === 5 ? easeInOutCubic((frame - cWm2.from) / 30) : 0;

    const panels = [
      { id: "A", title: "推演 A · 强行左变道", stat: "82% 碰撞风险", col: C.crimson, x0: 0, w: W / 3 * (1 - expandCenter), egoX: -3.2, truckZ: 15, safe: false },
      { id: "B", title: "推演 B · 减速礼让跟行", stat: "99.6% 物理安全 ✓", col: C.emerald, x0: (W / 3) * (1 - expandCenter), w: W / 3 + (2 * W / 3) * expandCenter, egoX: 0, truckZ: 28, safe: true },
      { id: "C", title: "推演 C · 向右急切盲区", stat: "46% 盲区风险", col: C.amber, x0: (2 * W / 3) + (W / 3) * expandCenter, w: W / 3 * (1 - expandCenter), egoX: 3.4, truckZ: 19, safe: false },
    ];

    for (const p of panels) {
      if (p.w < 10) continue;
      ctx.save();
      ctx.beginPath();
      ctx.rect(p.x0, 0, p.w, H);
      ctx.clip();

      const cam: Cam3D = {
        x: p.egoX * 0.5,
        y: 3.3,
        z: -8.5,
        yaw: 0,
        pitch: -0.14,
        fov: 760 + expandCenter * 200,
        cx: p.x0 + p.w * 0.5,
        cy: H * 0.5,
      };
      drawCyberHighwayWorld(ctx, cam, frame, { speed: p.safe ? 2.1 : 0.8, accent: p.col, showCity: true, showGantries: true });

      const pts: Array<{ x: number; z: number }> = [];
      for (let i = 0; i <= 14; i++) pts.push({ x: p.egoX, z: 6 + i * 2.2 });
      drawFsdRibbon3D(ctx, pts, cam, p.col, 0.9, frame);

      // Threat truck in Left / Right worlds
      if (p.id === "A") {
        drawVehicle3D(ctx, { x: -3.4, z: 16 - Math.sin(frame * 0.12) * 2 }, cam, { kind: "truck", bboxLabel: "IMPACT 82%", bboxColor: C.crimson, frame });
      } else if (p.id === "C") {
        drawVehicle3D(ctx, { x: 3.8, z: 15 }, cam, { kind: "sedan", bboxLabel: "BLIND SPOT 46%", bboxColor: C.amber, frame });
      }
      drawVehicle3D(ctx, { x: p.egoX, z: 6.5 }, cam, { kind: "ego", accent: p.col, headlights: true, frame });

      // Clean floating multiverse branch label (zero card box!)
      ctx.font = "bold 30px sans-serif";
      ctx.fillStyle = p.col;
      ctx.shadowColor = p.col;
      ctx.shadowBlur = 18;
      ctx.textAlign = "center";
      ctx.fillText(p.title, p.x0 + p.w * 0.5, 245);
      ctx.font = "bold 22px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(p.stat, p.x0 + p.w * 0.5, 282);
      ctx.shadowBlur = 0;
      ctx.textAlign = "left";

      // Glowing vertical divider beam
      ctx.strokeStyle = p.col;
      ctx.lineWidth = 4;
      ctx.strokeRect(p.x0 + 2, 2, p.w - 4, H - 4);
      ctx.restore();
    }

    // Time-Freeze Violet Shockwave Ring right at the start of Stage 4!
    if (stage === 4 && splitT < 0.98) {
      ctx.strokeStyle = C.violet;
      ctx.lineWidth = 10 * (1 - splitT);
      ctx.shadowColor = C.violet;
      ctx.shadowBlur = 32;
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.5, splitT * 1100, 0, TAU);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [frame, stage, cVort.from, cGuard.from, cVla1.from, cVla2.from, cWm1.from, cWm2.from]);

  return (
    <CinemaStage
      badge={scene.badge}
      telemetry={
        ["ERA 3.0 // END-TO-END NEURAL", "GUARDRAIL // FORCE FIELD", "ERA 4.0 // VLA REASONING", "VLA // FAST-SLOW DUAL SYS", "WORLD MODEL // t = 0.00s SPLIT", "REALITY B LOCKED // 99.6%"][stage]
      }
      accent={[C.violet, C.cyan, C.violet, C.emerald, C.violet, C.emerald][stage]}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{ width: W, height: H }} />

      {stage === 0 && (
        <KineticSlam title="3.0 端到端大模型 · 信息无损直通" sub="PHOTONS → UNIFIED NEURAL NET → TRAJECTORY" accent={C.violet} startFrame={cVort.from} holdFrames={140} y={84} size={68} />
      )}
      {stage === 1 && (
        <>
          <KineticSlam title="外层规则安全护栏 · 守住物理底线" sub="BLACK-BOX NEURAL + HARD SAFETY GUARDRAIL" accent={C.cyan} startFrame={cGuard.from} holdFrames={130} y={84} size={66} />
          <ArPin tx={1160} ty={545} lx={1320} ly={360} label="硬性护栏实时纠偏" sub="HALLUCINATION DEFLECTED" accent={C.cyan} startFrame={cGuard.from + 14} />
        </>
      )}
      {stage === 2 && (
        <KineticSlam title="4.0 VLA 模型 · 读路牌、懂交警手势" sub="VISION · LANGUAGE · ACTION" accent={C.violet} startFrame={cVla1.from} holdFrames={120} y={82} size={68} />
      )}
      {stage === 3 && (
        <KineticSlam title="听懂自然语言 · 快慢双系统直控" sub="SLOW REASONING + FAST MILLISECOND CONTROL" accent={C.emerald} startFrame={cVla2.from} holdFrames={130} y={76} size={66} />
      )}
      {stage === 4 && (
        <KineticSlam title="4.0 世界模型 · 时间静止预演多重未来" sub="PHYSICAL CAUSALITY MULTIVERSE" accent={C.violet} startFrame={cWm1.from} holdFrames={130} y={78} size={68} />
      )}
      {stage === 5 && (
        <KineticSlam title="云端超级仿真 + 车端轻量化落地" sub="REALITY B SELECTED // SAFE MERGE" accent={C.emerald} startFrame={cWm2.from} holdFrames={130} y={84} size={68} />
      )}
    </CinemaStage>
  );
};

/**
 * ACT 8: LAST 1% LONG-TAIL ACTION MONTAGE -> 3D ROTATING NEON EARTH & ORBITAL CLOUD DATA FLYWHEEL!
 */
export const LongTailScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const c99 = getCue(scene.cues, "ratio99", 10);
  const cTire = getCue(scene.cues, "caseTire", 130);
  const cBike = getCue(scene.cues, "caseNightBike", 180);
  const cStorm = getCue(scene.cues, "caseStorm", 240);
  const cGlobe = getCue(scene.cues, "globeFlywheel", 300);

  const stage =
    frame >= cGlobe.from ? 4
    : frame >= cStorm.from ? 3
    : frame >= cBike.from ? 2
    : frame >= cTire.from ? 1
    : 0;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // STAGE 0: DRAMATIC KINETIC 99% vs 1% DATA ZOOM BAR!
    if (stage === 0) {
      ctx.fillStyle = "#030610";
      ctx.fillRect(0, 0, W, H);
      const local = frame - c99.from;
      const fillP = easeOutCubic(local / 36);
      const barX = 160;
      const barY = 470;
      const barW = 1600;
      const barH = 120;

      // Giant glowing 99% cyan bar
      ctx.fillStyle = "rgba(0, 229, 255, 0.16)";
      ctx.strokeStyle = C.cyan;
      ctx.lineWidth = 3;
      ctx.fillRect(barX, barY, barW * 0.94 * fillP, barH);
      ctx.strokeRect(barX, barY, barW * 0.94 * fillP, barH);

      // Blazing pulsing crimson 1% sliver!
      const redX = barX + barW * 0.95;
      const pulse = 1 + 0.18 * Math.sin(local * 0.35);
      ctx.fillStyle = C.crimson;
      ctx.shadowColor = C.crimson;
      ctx.shadowBlur = 36 * pulse;
      ctx.fillRect(redX, barY - 18, barW * 0.05, barH + 36);
      ctx.shadowBlur = 0;

      ctx.font = "900 96px monospace";
      ctx.fillStyle = C.cyan;
      ctx.fillText("99.0%", barX + 40, barY - 36);
      ctx.fillStyle = C.crimson;
      ctx.textAlign = "right";
      ctx.fillText("1.0%", barX + barW, barY - 36);
      ctx.textAlign = "left";
      return;
    }

    // STAGES 1, 2, 3: HIGH-DRAMA RAPID 3-BEAT CORNER CASE ACTION MONTAGE!
    if (stage >= 1 && stage <= 3) {
      const cam: Cam3D = { x: 0, y: 2.0, z: -2, yaw: 0, pitch: -0.06, fov: 980 };
      drawCyberHighwayWorld(ctx, cam, frame, {
        speed: stage === 3 ? 0.9 : 2.3,
        accent: C.crimson,
        stormRain: stage === 3 ? 1.4 : stage === 1 ? 0.3 : 0.1,
        fogDensity: stage === 2 ? 0.35 : 0,
        showGantries: stage !== 2,
        showCity: stage === 1,
      });

      if (stage === 1) {
        // Bouncing Spinning Runaway Black Tire flying across headlight beams!
        const lt = (frame - cTire.from) / 48;
        const tx = -5.5 + lt * 11;
        const ty = 0.65 + Math.abs(Math.sin(lt * Math.PI * 2.5)) * 2.6;
        const tz = 18 - lt * 6;
        const tp = project3D(tx, ty, tz, cam);
        if (tp.visible) {
          const r = tp.scale * 0.68;
          ctx.fillStyle = "#111827";
          ctx.strokeStyle = C.crimson;
          ctx.lineWidth = 6;
          ctx.shadowColor = C.crimson;
          ctx.shadowBlur = 24;
          ctx.beginPath();
          ctx.arc(tp.sx, tp.sy, r, 0, TAU);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(tp.sx, tp.sy, r * 0.45, 0, TAU);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      } else if (stage === 2) {
        // Dark Unlit Wrong-Way Tricycle Silhouette rushing toward headlights!
        const lt = (frame - cBike.from) / 56;
        const bz = 26 - lt * 14;
        drawVehicle3D(ctx, { x: -1.4, z: bz, yaw: Math.PI }, cam, {
          kind: "sedan",
          accent: C.crimson,
          bboxLabel: "UNLIT WRONG-WAY!",
          bboxColor: C.crimson,
          frame,
        });
      } else if (stage === 3) {
        // Torrential Storm Flood + Flashing Temporary Roadblock Beacons!
        for (const bx of [-3.6, -1.2, 1.2, 3.6]) {
          drawPoly3D(ctx, [[bx - 0.5, 0, 18], [bx + 0.5, 0, 18], [bx, 1.4, 18]], cam, C.orange, "#ffffff", 2);
          const bp = project3D(bx, 1.5, 18, cam);
          if (bp.visible && Math.floor(frame / 4) % 2 === 0) {
            ctx.fillStyle = C.amber;
            ctx.shadowColor = C.amber;
            ctx.shadowBlur = 32;
            ctx.beginPath();
            ctx.arc(bp.sx, bp.sy, 11, 0, TAU);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
      return;
    }

    // STAGE 4: LOW-EARTH ORBIT 3D ROTATING NEON GLOBE & ORBITAL CLOUD DATA FLYWHEEL!!
    ctx.fillStyle = "#02040b";
    ctx.fillRect(0, 0, W, H);
    const local = frame - cGlobe.from;
    const gx = W * 0.5;
    const gy = H * 0.55;
    const R = 310;
    const rotY = local * 0.015;

    // Deep orbital starfield
    ctx.fillStyle = "rgba(226,232,240,0.6)";
    for (let i = 0; i < 110; i++) {
      ctx.fillRect(hash(i * 19) * W, hash(i * 43) * H, hash(i * 7) > 0.8 ? 2.4 : 1.3, hash(i * 7) > 0.8 ? 2.4 : 1.3);
    }

    // Atmospheric Cyan-Blue Planetary Halo
    const halo = ctx.createRadialGradient(gx, gy, R * 0.72, gx, gy, R * 1.48);
    halo.addColorStop(0, "rgba(0, 229, 255, 0.16)");
    halo.addColorStop(0.6, "rgba(59, 130, 246, 0.12)");
    halo.addColorStop(1, "transparent");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    // True 3D Mathematically Projected Rotating Wireframe Sphere (Latitude & Longitude Lines!)
    const projSphere = (lat: number, lon: number, rad = R) => {
      const cl = Math.cos(lat);
      const x3 = rad * cl * Math.sin(lon + rotY);
      const y3 = rad * Math.sin(lat);
      const z3 = rad * cl * Math.cos(lon + rotY);
      return { sx: gx + x3, sy: gy - y3, z: z3 };
    };

    // Dark planetary sphere base
    const sphGrad = ctx.createRadialGradient(gx - 90, gy - 90, 40, gx, gy, R);
    sphGrad.addColorStop(0, "#0b1e3f");
    sphGrad.addColorStop(1, "#020714");
    ctx.fillStyle = sphGrad;
    ctx.beginPath();
    ctx.arc(gx, gy, R, 0, TAU);
    ctx.fill();

    // Longitude meridians & latitude parallels
    ctx.lineWidth = 1.4;
    for (let lonI = 0; lonI < 12; lonI++) {
      const lon = (lonI / 12) * TAU;
      ctx.beginPath();
      let started = false;
      for (let latI = -16; latI <= 16; latI++) {
        const p = projSphere((latI / 16) * (Math.PI / 2), lon);
        if (p.z > -40) {
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
          else ctx.lineTo(p.sx, p.sy);
        } else started = false;
      }
      ctx.strokeStyle = "rgba(0, 229, 255, 0.25)";
      ctx.stroke();
    }
    for (let latI = -4; latI <= 4; latI++) {
      const lat = (latI / 5) * (Math.PI / 2);
      ctx.beginPath();
      let started = false;
      for (let s = 0; s <= 48; s++) {
        const p = projSphere(lat, (s / 48) * TAU);
        if (p.z > -20) {
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
          else ctx.lineTo(p.sx, p.sy);
        } else started = false;
      }
      ctx.strokeStyle = "rgba(0, 229, 255, 0.22)";
      ctx.stroke();
    }

    // Glowing Illuminated Fleet City Nodes + Data Uplink Arcs firing into Orbit!
    for (let c = 0; c < 18; c++) {
      const lat = (hash(c * 17) - 0.5) * 1.9;
      const lon = hash(c * 31) * TAU;
      const p = projSphere(lat, lon);
      if (p.z < 10) continue;
      // Glowing city dot
      ctx.fillStyle = c % 2 === 0 ? C.orange : C.cyan;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, 4.5, 0, TAU);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Data beam shooting from fleet city up to Orbital Cloud Ring!
      const orbP = projSphere(lat * 0.4, lon + 0.25, R * 1.44);
      ctx.strokeStyle = c % 2 === 0 ? `${C.orange}66` : `${C.cyan}66`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(p.sx, p.sy);
      ctx.quadraticCurveTo((p.sx + orbP.sx) * 0.5, (p.sy + orbP.sy) * 0.5 - 40, orbP.sx, orbP.sy);
      ctx.stroke();
    }

    // Blazing Tilted Orbital Cloud Supercomputer Data Flywheel Ring!
    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(-0.26);
    ctx.strokeStyle = C.cyan;
    ctx.lineWidth = 4;
    ctx.shadowColor = C.cyan;
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.56, R * 0.42, 0, 0, TAU);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // High-speed orbiting Cloud Simulation & OTA Data Packets!
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * TAU + local * 0.055;
      const px = Math.cos(a) * R * 1.56;
      const py = Math.sin(a) * R * 0.42;
      ctx.fillStyle = i % 3 === 0 ? C.emerald : i % 2 === 0 ? C.orange : C.cyan;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(px, py, 6.5, 0, TAU);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.restore();

    // Expanding Emerald OTA Firmware Shockwave Ring pulsing across the globe!
    const otaR = ((local * 9) % (R * 1.6));
    ctx.strokeStyle = `rgba(16, 185, 129, ${clamp(1 - otaR / (R * 1.6), 0, 1) * 0.7})`;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(gx, gy, otaR, 0, TAU);
    ctx.stroke();
  }, [frame, stage, c99.from, cTire.from, cBike.from, cGlobe.from]);

  return (
    <CinemaStage
      badge={scene.badge}
      telemetry={["LONG-TAIL // 99% vs 1%", "HAZARD // RUNAWAY TIRE", "HAZARD // UNLIT WRONG-WAY", "HAZARD // STORM FLOOD", "CLOUD SIM // 5,000,000 KM/DAY"][stage]}
      accent={[C.crimson, C.crimson, C.crimson, C.orange, C.cyan][stage]}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{ width: W, height: H }} />

      {stage === 0 && (
        <KineticSlam title="真正卡脖子的 · 是最后 1% 长尾" sub="99% ROUTINE DRIVING SOLVED" accent={C.crimson} startFrame={c99.from} holdFrames={105} y={110} size={74} />
      )}
      {stage === 1 && (
        <KineticSlam title="高速滚落轮胎" sub="CORNER CASE 01" accent={C.crimson} startFrame={cTire.from} holdFrames={45} y={110} size={86} />
      )}
      {stage === 2 && (
        <KineticSlam title="暗夜无灯逆行三轮" sub="CORNER CASE 02" accent={C.crimson} startFrame={cBike.from} holdFrames={55} y={110} size={82} />
      )}
      {stage === 3 && (
        <KineticSlam title="暴雨突发临时封路" sub="CORNER CASE 03" accent={C.orange} startFrame={cStorm.from} holdFrames={55} y={110} size={82} />
      )}
      {stage === 4 && (
        <>
          <KineticSlam title="数据飞轮 · 云端日跑百万公里" sub="FLEET UPLINK → WORLD MODEL SIM → OTA EVOLUTION" accent={C.cyan} startFrame={cGlobe.from} holdFrames={220} y={66} size={66} />
          <ArPin tx={1280} ty={450} lx={1420} ly={310} label="车端捕获长尾回流" sub="FLEET EDGE CASES" accent={C.orange} startFrame={cGlobe.from + 15} />
          <ArPin tx={620} ty={700} lx={420} ly={820} label="OTA 推送全车队进化" sub="CONTINUOUS OVER-THE-AIR" accent={C.emerald} startFrame={cGlobe.from + 35} align="right" />
        </>
      )}
    </CinemaStage>
  );
};

/**
 * ACT 9: FINALE — 3D WARP-SPEED EVOLUTION PORTAL TUNNEL -> BREATHTAKING NEON CYBER-DAWN CINEMA CLOSE!
 */
export const FinaleScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cWarp = getCue(scene.cues, "warpPortals", 10);
  const cEnd = getCue(scene.cues, "cinemaEnd", 220);
  const isEnd = frame >= cEnd.from;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    const cam: Cam3D = {
      x: 0,
      y: isEnd ? 3.2 : 2.6,
      z: 0,
      yaw: 0,
      pitch: isEnd ? -0.08 : -0.05,
      fov: 960,
    };

    const dawnT = isEnd ? easeOutCubic((frame - cEnd.from) / 45) : 0;
    drawCyberHighwayWorld(ctx, cam, frame, {
      speed: isEnd ? 1.45 : 3.4,
      accent: C.cyan,
      sunrise: dawnT,
      showGantries: !isEnd,
      showCity: true,
    });

    // Emerald FSD highway trajectory flowing into the dawn horizon
    const pts: Array<{ x: number; z: number }> = [];
    for (let i = 0; i <= 18; i++) pts.push({ x: Math.sin(i * 0.25 + frame * 0.04) * (isEnd ? 0.5 : 0), z: 6 + i * 2.5 });
    drawFsdRibbon3D(ctx, pts, cam, C.emerald, 1.0, frame);

    drawVehicle3D(ctx, { x: 0, z: 11 }, cam, {
      kind: "ego",
      accent: C.cyan,
      headlights: true,
      taillightTrail: true,
      frame,
    });

    // STAGE 0: 4 COLOSSAL ILLUMINATED 3D HOLOGRAPHIC ERA PORTALS RUSHING OVER THE CAMERA!
    if (!isEnd) {
      const local = frame - cWarp.from;
      const portals = [
        { label: "1.0 高精地图 + 规则", col: C.cyan, baseZ: 38 },
        { label: "2.0 BEV + 占用网络", col: C.amber, baseZ: 102 },
        { label: "3.0 端到端 + 安全护栏", col: C.violet, baseZ: 166 },
        { label: "4.0 VLA & 世界模型", col: C.emerald, baseZ: 230 },
      ];
      for (let i = portals.length - 1; i >= 0; i--) {
        const pt = portals[i];
        const pz = pt.baseZ - local * 1.05;
        if (pz < 2 || pz > 210) continue;
        const fade = clamp(1 - pz / 195, 0, 1);
        const w = 7.4;
        const h = 6.8;
        ctx.shadowColor = pt.col;
        ctx.shadowBlur = 24;
        drawLine3D(ctx, [-w, 0, pz], [-w, h, pz], cam, pt.col, 6 * fade + 1.5);
        drawLine3D(ctx, [w, 0, pz], [w, h, pz], cam, pt.col, 6 * fade + 1.5);
        drawLine3D(ctx, [-w, h, pz], [w, h, pz], cam, pt.col, 6 * fade + 1.5);
        ctx.shadowBlur = 0;

        if (pz < 125) {
          const topP = project3D(0, h + 0.75, pz, cam);
          if (topP.visible) {
            const labelAlpha = clamp((125 - pz) / 38, 0, 1);
            const fs = clamp(topP.scale * 0.72, 18, 62);
            ctx.globalAlpha = labelAlpha;
            ctx.font = `900 ${fs}px sans-serif`;
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = pt.col;
            ctx.shadowBlur = 22;
            ctx.textAlign = "center";
            ctx.fillText(pt.label, topP.sx, topP.sy);
            ctx.shadowBlur = 0;
            ctx.textAlign = "left";
            ctx.globalAlpha = 1;
          }
        }
      }
    }
  }, [frame, isEnd, cWarp.from, cEnd.from]);

  return (
    <CinemaStage
      badge={scene.badge}
      telemetry={isEnd ? "SAFE JOURNEY // L2 STAY ALERT" : "WARP // ERA 1.0 → 4.0"}
      accent={C.cyan}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{ width: W, height: H }} />

      {isEnd && (
        <KineticSlam
          title="感知定位看清路 · 规控线控开得稳"
          sub="L2 辅助莫松手 · 安全永远排第一"
          accent={C.cyan}
          startFrame={cEnd.from}
          holdFrames={300}
          y={112}
          size={66}
        />
      )}
    </CinemaStage>
  );
};
