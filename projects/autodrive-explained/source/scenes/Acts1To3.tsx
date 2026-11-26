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
 * ACT 1: FULL-BLEED 3D CHASE-CAM CYBER HIGHWAY -> ORBITAL TITLE SLAM -> 3D X-RAY 4-STEP LOOP!
 */
export const IntroScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cTitle = getCue(scene.cues, "titleSlam", 150);
  const cPerc = getCue(scene.cues, "xrayPerception", 250);
  const cLoc = getCue(scene.cues, "xrayLocalization", 440);
  const cPlan = getCue(scene.cues, "xrayPlanning", 560);
  const cCtrl = getCue(scene.cues, "xrayControl", 700);

  const stage =
    frame >= cCtrl.from ? 5
    : frame >= cPlan.from ? 4
    : frame >= cLoc.from ? 3
    : frame >= cPerc.from ? 2
    : frame >= cTitle.from ? 1
    : 0;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // Smooth continuous 3D camera choreography across all 6 shots!
    const tOrb = easeInOutCubic((frame - cTitle.from) / 45);
    const tXray = easeInOutCubic((frame - cPerc.from) / 36);
    const tCtrl = easeInOutCubic((frame - cCtrl.from) / 30);

    // Ego car gracefully weaves lane on open chase shot, then holds center-left for X-Ray showcase
    const egoX =
      stage < 2
        ? Math.sin(frame * 0.032) * 3.1
        : Math.sin(frame * 0.032) * 3.1 * (1 - tXray);
    const egoZ = 12;

    // Continuous orbiting 3D camera rig
    const orbitAngle =
      stage >= 2
        ? -0.45 + Math.sin((frame - cPerc.from) * 0.016) * 0.35 + tCtrl * 0.38
        : -0.04 + tOrb * -0.22;
    const camDist = stage >= 2 ? 10.5 - tCtrl * 2.4 : 11.2 - tOrb * 1.4;
    const cam: Cam3D = {
      x: egoX + Math.sin(orbitAngle) * camDist,
      y: stage >= 2 ? 3.8 - tCtrl * 1.3 : 2.9 + tOrb * 1.5,
      z: egoZ - Math.cos(orbitAngle) * camDist,
      yaw: -orbitAngle * 0.92,
      pitch: stage >= 2 ? -0.22 + tCtrl * 0.08 : -0.11 - tOrb * 0.06,
      fov: 960,
    };

    const roadAccent = stage === 4 ? C.violet : stage === 5 ? C.emerald : C.cyan;
    drawCyberHighwayWorld(ctx, cam, frame, {
      speed: stage >= 2 ? 1.15 : 2.1,
      accent: roadAccent,
      showGantries: true,
      showCity: true,
    });

    // Traffic vehicles ahead during open highway chase & planning shot
    if (stage < 2 || stage === 4) {
      const t1z = 36 + ((frame * 0.35) % 45);
      const t2z = 26 + (((frame + 60) * 0.25) % 35);
      drawVehicle3D(ctx, { x: 3.7, z: t1z }, cam, {
        kind: "truck",
        taillightTrail: true,
        bboxLabel: `TRUCK ${(t1z - egoZ).toFixed(1)}m`,
        bboxColor: C.amber,
        frame,
      });
      drawVehicle3D(ctx, { x: -3.6, z: t2z }, cam, {
        kind: "sedan",
        taillightTrail: true,
        bboxLabel: `SEDAN ${(t2z - egoZ).toFixed(1)}m`,
        bboxColor: C.cyan,
        frame,
      });
    }

    // Glowing 3D FSD trajectory ribbon
    if (stage < 2) {
      const pts: Array<{ x: number; z: number }> = [];
      for (let i = 0; i <= 18; i++) {
        const dz = egoZ + 2.5 + i * 2.2;
        const frac = i / 18;
        const tx = egoX + Math.sin(frame * 0.032 + 1.1) * 3.1 * frac - egoX * frac * 0.4;
        pts.push({ x: tx, z: dz });
      }
      drawFsdRibbon3D(ctx, pts, cam, C.emerald, 0.92, frame);
    }

    // STAGE 4 (Planning): 16 glowing electric candidate splines erupting from the neural core!
    if (stage === 4) {
      for (let s = -7; s <= 7; s++) {
        const isBest = s === 0;
        const col = isBest ? C.emerald : Math.abs(s) > 4 ? `${C.crimson}55` : `${C.violet}66`;
        const lw = isBest ? 5 : 1.8;
        if (isBest) {
          ctx.shadowColor = C.emerald;
          ctx.shadowBlur = 18;
        }
        let prev: [number, number, number] = [egoX, 0.25, egoZ + 2.3];
        for (let step = 1; step <= 14; step++) {
          const u = step / 14;
          const nx = egoX + s * 0.72 * Math.sin(u * Math.PI * 0.65) + Math.sin(frame * 0.08) * 0.2 * u;
          const nz = egoZ + 2.3 + u * 34;
          const cur: [number, number, number] = [nx, 0.14, nz];
          drawLine3D(ctx, prev, cur, cam, col, lw);
          prev = cur;
        }
        ctx.shadowBlur = 0;
      }
    }

    // STAGE 2 (Perception): Expanding 360° volumetric LiDAR & Camera scan rings erupting from roof!
    if (stage === 2) {
      for (let r = 0; r < 5; r++) {
        const rr = 2.5 + ((frame * 0.28 + r * 3.8) % 19);
        const alpha = clamp(1 - rr / 21, 0, 1) * 0.75;
        let last: [number, number, number] | null = null;
        for (let a = 0; a <= 36; a++) {
          const ang = (a / 36) * TAU;
          const cur: [number, number, number] = [egoX + Math.cos(ang) * rr, 0.18, egoZ + Math.sin(ang) * rr];
          if (last) drawLine3D(ctx, last, cur, cam, `rgba(0, 229, 255, ${alpha})`, 2.4);
          last = cur;
        }
      }
      // Forward camera FOV light pyramid
      drawPoly3D(
        ctx,
        [
          [egoX, 1.5, egoZ + 0.5],
          [egoX - 7.5, 0.2, egoZ + 22],
          [egoX + 7.5, 0.2, egoZ + 22],
        ],
        cam,
        "rgba(0, 245, 196, 0.16)",
        `${C.teal}aa`,
        2,
      );
    }

    // Draw hero 3D Shaded Ego EV (morphing into X-Ray Wireframe Core in stages 2..5!)
    drawVehicle3D(ctx, { x: egoX, z: egoZ, yaw: stage < 2 ? Math.cos(frame * 0.032) * 0.09 : 0 }, cam, {
      kind: "ego",
      accent: roadAccent,
      xray: stage >= 2 ? tXray : 0,
      headlights: true,
      taillightTrail: true,
      wheelSteer: stage === 5 ? Math.sin(frame * 0.18) * 0.45 : 0,
      brakeGlow: stage === 5,
      frame,
    });

    // STAGE 3 (Localization): Vertical golden satellite laser beam locking dead onto roof antenna!
    if (stage === 3) {
      const roofP = project3D(egoX, 1.55, egoZ, cam);
      const skyP = project3D(egoX, 24, egoZ, cam);
      if (roofP.visible && skyP.visible) {
        const beamGrad = ctx.createLinearGradient(skyP.sx, 0, roofP.sx, roofP.sy);
        beamGrad.addColorStop(0, "rgba(245, 158, 11, 0)");
        beamGrad.addColorStop(0.6, "rgba(0, 229, 255, 0.55)");
        beamGrad.addColorStop(1, "rgba(245, 158, 11, 0.95)");
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 6;
        ctx.shadowColor = C.amber;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.moveTo(skyP.sx, 0);
        ctx.lineTo(roofP.sx, roofP.sy);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Rotating precision crosshair on roof
        const rr = 38 + Math.sin(frame * 0.25) * 6;
        ctx.strokeStyle = C.amber;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(roofP.sx, roofP.sy, rr, 0, TAU);
        ctx.stroke();
      }
    }
  }, [frame, stage, cTitle.from, cPerc.from, cCtrl.from]);

  return (
    <CinemaStage
      badge={scene.badge}
      telemetry={
        stage >= 2
          ? `X-RAY DIAGNOSTIC // LOOP STEP 0${stage - 1}/04`
          : `SPEED 118 KM/H // AUTOPILOT ENGAGED`
      }
      accent={stage === 4 ? C.violet : stage === 5 ? C.emerald : C.cyan}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{ width: W, height: H }} />

      {stage === 1 && (
        <KineticSlam
          title="自动驾驶 · 全栈解剖"
          sub="PERCEPTION · LOCALIZATION · PLANNING · CONTROL"
          accent={C.cyan}
          startFrame={cTitle.from}
          holdFrames={cPerc.from - cTitle.from - 16}
          y={110}
          size={92}
        />
      )}

      {stage === 2 && (
        <ArPin
          tx={960}
          ty={460}
          lx={1260}
          ly={270}
          label="01 感知 · 千里眼"
          sub="CAMERA + RADAR + LIDAR 360°"
          accent={C.cyan}
          startFrame={cPerc.from}
        />
      )}
      {stage === 3 && (
        <ArPin
          tx={960}
          ty={430}
          lx={1270}
          ly={250}
          label="02 定位 · 厘米锁死"
          sub="GNSS + RTK + IMU // ±2.0cm"
          accent={C.amber}
          startFrame={cLoc.from}
        />
      )}
      {stage === 4 && (
        <ArPin
          tx={960}
          ty={510}
          lx={1280}
          ly={280}
          label="03 预测与规划 · 博弈大脑"
          sub="MULTI-AGENT TRAJECTORY TREE"
          accent={C.violet}
          startFrame={cPlan.from}
        />
      )}
      {stage === 5 && (
        <ArPin
          tx={860}
          ty={610}
          lx={1260}
          ly={320}
          label="04 精准控制 · 线控执行"
          sub="DRIVE-BY-WIRE // 100Hz MPC"
          accent={C.emerald}
          startFrame={cCtrl.from}
        />
      )}
    </CinemaStage>
  );
};

/**
 * ACT 2: SAE L0-L5 — FULL-SCREEN 3D COCKPIT & STEERING WHEEL METAMORPHOSIS (ZERO PPT CARDS!)
 */
export const LevelsScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const c01 = getCue(scene.cues, "lv01", 10);
  const c2 = getCue(scene.cues, "lv2Warn", 220);
  const c3 = getCue(scene.cues, "lv3Laser", 470);
  const c4 = getCue(scene.cues, "lv4Dissolve", 660);
  const c5 = getCue(scene.cues, "lv5Shatter", 840);

  const stage =
    frame >= c5.from ? 4
    : frame >= c4.from ? 3
    : frame >= c3.from ? 2
    : frame >= c2.from ? 1
    : 0;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // Subtle dramatic camera impact shake right when L3 crimson laser wall hits!
    const hitT = frame - c3.from;
    const shakeX = hitT >= 0 && hitT < 18 ? (hash(frame * 17) - 0.5) * 26 * (1 - hitT / 18) : 0;
    const shakeY = hitT >= 0 && hitT < 18 ? (hash(frame * 31) - 0.5) * 18 * (1 - hitT / 18) : 0;

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // 1) First-person panoramic windshield view out onto live 3D highway!
    const steerAngle = Math.sin(frame * 0.04) * (stage >= 1 ? 0.16 : 0.05);
    const cam: Cam3D = {
      x: Math.sin(frame * 0.04) * (stage >= 1 ? 2.4 : 0.4),
      y: 1.55,
      z: 0,
      yaw: -steerAngle * 0.35,
      pitch: -0.04,
      fov: 940,
      cy: H * 0.43,
    };

    const accent =
      stage === 0 ? C.blue
      : stage === 1 ? C.amber
      : stage === 2 ? C.crimson
      : stage === 3 ? C.emerald
      : C.violet;

    drawCyberHighwayWorld(ctx, cam, frame, {
      speed: 1.85,
      accent,
      stormRain: stage === 4 ? 0.55 : 0,
      sunrise: stage === 4 ? 0.65 : 0,
      showGantries: true,
      showCity: stage < 4,
    });

    // Lead car ahead with AEB pulse in L0/L1, or glowing emerald FSD path in L2+
    if (stage === 0) {
      drawVehicle3D(ctx, { x: 0, z: 24 + Math.sin(frame * 0.06) * 4 }, cam, {
        kind: "sedan",
        bboxLabel: "AEB COLLISION ALERT",
        bboxColor: C.crimson,
        frame,
      });
    } else {
      const pts: Array<{ x: number; z: number }> = [];
      for (let i = 0; i <= 16; i++) {
        pts.push({ x: cam.x * (1 - i / 20), z: 5 + i * 2.4 });
      }
      drawFsdRibbon3D(ctx, pts, cam, stage === 1 ? C.amber : C.cyan, 1.05, frame);
    }

    // 2) Sleek Panoramic EV Dashboard Cowling & Ambient Trim Strip (lower silhouette framing the road)
    const dashGrad = ctx.createLinearGradient(0, H * 0.72, 0, H);
    dashGrad.addColorStop(0, "rgba(4, 9, 20, 0.0)");
    dashGrad.addColorStop(0.28, "rgba(4, 9, 20, 0.92)");
    dashGrad.addColorStop(1, "#02050c");
    ctx.fillStyle = dashGrad;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.78);
    ctx.quadraticCurveTo(W * 0.5, H * 0.69, W, H * 0.78);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Glowing ambient dashboard horizon light strip
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(60, H * 0.78);
    ctx.quadraticCurveTo(W * 0.5, H * 0.70, W - 60, H * 0.78);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3) HERO CENTERPIECE: 3D Futuristic Steering Yoke -> AI Halo -> Particle Disintegration at L4!
    const wx = W * 0.5;
    const wy = H * 0.76;
    const dissolveT = stage >= 3 ? clamp((frame - c4.from) / 55, 0, 1) : 0;

    if (dissolveT < 0.92) {
      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(steerAngle * 1.4);
      ctx.globalAlpha = 1 - dissolveT;

      const wheelCol =
        stage === 0 ? "#64748b"
        : stage === 1 ? C.amber
        : C.cyan;

      // Outer futuristic steering yoke ring
      ctx.strokeStyle = wheelCol;
      ctx.lineWidth = 18;
      ctx.shadowColor = wheelCol;
      ctx.shadowBlur = stage >= 1 ? 26 : 6;
      ctx.beginPath();
      ctx.arc(0, 0, 145, -0.35, Math.PI + 0.35);
      ctx.stroke();

      // Top sculpted yoke grip wings
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(-136, -50);
      ctx.lineTo(-92, -108);
      ctx.moveTo(136, -50);
      ctx.lineTo(92, -108);
      // Inner spokes to central hub
      ctx.moveTo(-132, 8);
      ctx.lineTo(132, 8);
      ctx.moveTo(0, 8);
      ctx.lineTo(0, 140);
      ctx.stroke();

      // Central steering hub badge
      ctx.fillStyle = "#081226";
      ctx.strokeStyle = wheelCol;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 6, 46, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // L2 Hands-On-Wheel pulsing amber warning ring!
      if (stage === 1) {
        const pulse = 1 + 0.08 * Math.sin(frame * 0.3);
        ctx.strokeStyle = C.amber;
        ctx.lineWidth = 3.5;
        ctx.setLineDash([14, 10]);
        ctx.beginPath();
        ctx.arc(0, 0, 184 * pulse, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // L3 AI Neural Takeover orbiting cyan rings around yoke!
      if (stage === 2) {
        for (let k = 0; k < 2; k++) {
          ctx.strokeStyle = k === 0 ? C.cyan : C.crimson;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, 178 + k * 24, frame * 0.08 + k * 2, frame * 0.08 + k * 2 + 2.4);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    // L4 Particle Disintegration of the Steering Wheel! (600 shimmering rising cyan particles!)
    if (stage >= 3 && dissolveT > 0.02) {
      const pCount = 320;
      for (let i = 0; i < pCount; i++) {
        const ang = hash(i * 19.7) * TAU;
        const rad = 110 + hash(i * 7.3) * 55;
        const speed = 1.4 + hash(i * 31.1) * 3.8;
        const t = clamp(dissolveT * 1.4 - hash(i * 13.9) * 0.35, 0, 1);
        if (t <= 0) continue;
        const px = wx + Math.cos(ang) * rad * (1 + t * 1.2) + Math.sin(frame * 0.08 + i) * 14 * t;
        const py = wy + Math.sin(ang) * rad - t * 340 * speed * 0.45;
        const alpha = (1 - t) * 0.9;
        ctx.fillStyle = i % 3 === 0 ? C.emerald : C.cyan;
        ctx.globalAlpha = clamp(alpha, 0, 1);
        ctx.fillRect(px, py, 4.5, 4.5);
      }
      ctx.globalAlpha = 1;
    }

    // L3 DRAMATIC CRIMSON LASER FIREWALL SLICING ACROSS THE ENTIRE SCREEN!
    if (stage === 2) {
      const slash = easeOutCubic((frame - c3.from) / 14);
      const sx1 = W * 0.5 + 140;
      const sy1 = 0;
      const sx2 = W * 0.5 - 140;
      const sy2 = H * slash;
      ctx.strokeStyle = C.crimson;
      ctx.lineWidth = 8;
      ctx.shadowColor = C.crimson;
      ctx.shadowBlur = 36;
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx1 + (sx2 - sx1) * slash, sy2);
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // L4 Shimmering Holographic Geodesic Dome (Geo-fenced ODD) -> L5 Shattering into flying shards!
    if (stage === 3 || stage === 4) {
      const shatT = stage === 4 ? easeOutCubic((frame - c5.from) / 40) : 0;
      const domeR = 480;
      ctx.strokeStyle = stage === 3 ? `${C.emerald}77` : `${C.violet}${Math.round((1 - shatT) * 180).toString(16).padStart(2, "0")}`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 16; i++) {
        const a1 = (i / 16) * Math.PI;
        const a2 = ((i + 1) / 16) * Math.PI;
        const drift = shatT * (140 + hash(i * 29) * 320);
        const dx = Math.cos((a1 + a2) / 2) * drift;
        const dy = -Math.sin((a1 + a2) / 2) * drift;
        ctx.beginPath();
        ctx.moveTo(W * 0.5 + Math.cos(a1) * domeR + dx, H * 0.64 - Math.sin(a1) * domeR * 0.72 + dy);
        ctx.lineTo(W * 0.5 + Math.cos(a2) * domeR + dx, H * 0.64 - Math.sin(a2) * domeR * 0.72 + dy);
        ctx.lineTo(W * 0.5 + Math.cos((a1 + a2) / 2) * domeR * 0.68 + dx, H * 0.64 - Math.sin((a1 + a2) / 2) * domeR * 0.5 + dy);
        ctx.closePath();
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [frame, stage, c3.from, c4.from, c5.from]);

  // Clean horizontal Level Timeline HUD Bar floating discreetly near top (zero boxes!)
  const levels = [
    { lv: "L0", active: stage === 0, col: "#94a3b8" },
    { lv: "L1", active: stage === 0, col: C.blue },
    { lv: "L2", active: stage === 1, col: C.amber },
    { lv: "REDLINE", active: stage === 2, col: C.crimson },
    { lv: "L3", active: stage === 2, col: C.crimson },
    { lv: "L4", active: stage === 3, col: C.emerald },
    { lv: "L5", active: stage === 4, col: C.violet },
  ];

  return (
    <CinemaStage
      badge={scene.badge}
      telemetry={`SAE J3016 // ACTIVE LEVEL: ${["L0-L1", "L2 NOA (HUMAN)", "L3 TAKEOVER", "L4 DRIVERLESS", "L5 INFINITE"][stage]}`}
      accent={[C.blue, C.amber, C.crimson, C.emerald, C.violet][stage]}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{ width: W, height: H }} />

      {/* Sleek floating horizontal SAE level progress rail (top-center, borderless!) */}
      <div
        style={{
          position: "absolute",
          top: 66,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          pointerEvents: "none",
          fontFamily: "monospace",
        }}
      >
        {levels.map((item) =>
          item.lv === "REDLINE" ? (
            <div
              key="rl"
              style={{
                width: 3,
                height: 36,
                background: C.crimson,
                boxShadow: `0 0 18px ${C.crimson}`,
              }}
            />
          ) : (
            <div
              key={item.lv}
              style={{
                fontSize: item.active ? 42 : 24,
                fontWeight: 900,
                color: item.active ? item.col : "rgba(148,163,184,0.38)",
                textShadow: item.active ? `0 0 26px ${item.col}` : "none",
              }}
            >
              {item.lv}
            </div>
          ),
        )}
      </div>

      {stage === 0 && (
        <KineticSlam title="L0 预警 · L1 单维辅助" sub="HUMAN FULL CONTROL" accent={C.blue} startFrame={c01.from} holdFrames={180} y={150} size={68} />
      )}
      {stage === 1 && (
        <>
          <KineticSlam title="L2 法律责任仍在驾驶员！" sub="MOST NOA SYSTEMS TODAY = L2" accent={C.amber} startFrame={c2.from} holdFrames={220} y={145} size={74} />
          <ArPin tx={960} ty={790} lx={1240} ly={610} label="双手不可脱离接管" sub="DRIVER REMAINS LIABLE" accent={C.amber} startFrame={c2.from + 15} />
        </>
      )}
      {stage === 2 && (
        <KineticSlam title="L3 · 法定责任分水岭" sub="SYSTEM ASSUMES DRIVING & LIABILITY" accent={C.crimson} startFrame={c3.from} holdFrames={170} y={155} size={82} />
      )}
      {stage === 3 && (
        <KineticSlam title="L4 限定区全无人 · 可无方向盘" sub="ROBOTAXI · PORTS · HIGHWAYS" accent={C.emerald} startFrame={c4.from} holdFrames={160} y={155} size={72} />
      )}
      {stage === 4 && (
        <KineticSlam title="L5 全场景终极无人" sub="ANY ROAD · ANY WEATHER · ANYTIME" accent={C.violet} startFrame={c5.from} holdFrames={150} y={155} size={78} />
      )}
    </CinemaStage>
  );
};

/**
 * ACT 3: 3 SENSORS + ROUTE DUEL — FULL-SCREEN SCANNER WIPE, 4D RADAR, 4500-PT 3D LIDAR & PLASMA SPLIT!
 */
export const SensorsScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cCam = getCue(scene.cues, "camScan", 10);
  const cGlare = getCue(scene.cues, "camGlare", 150);
  const cRad = getCue(scene.cues, "radarRain", 270);
  const cRad4 = getCue(scene.cues, "radar4d", 420);
  const cLid = getCue(scene.cues, "lidarCloud", 560);
  const cDuel = getCue(scene.cues, "routeDuel", 790);

  const stage =
    frame >= cDuel.from ? 5
    : frame >= cLid.from ? 4
    : frame >= cRad4.from ? 3
    : frame >= cRad.from ? 2
    : frame >= cGlare.from ? 1
    : 0;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // STAGES 0, 1, 2: Continuous full-screen 3D highway reality transformed by Glare -> Amber Radar Laser Wipe!
    if (stage <= 2) {
      const cam: Cam3D = { x: 0, y: 2.3, z: 0, yaw: 0, pitch: -0.07, fov: 960 };
      const glareAmt = stage === 1 ? easeOutCubic((frame - cGlare.from) / 28) : 0;
      drawCyberHighwayWorld(ctx, cam, frame, {
        speed: 1.55,
        accent: stage === 2 ? C.amber : C.cyan,
        stormRain: stage === 2 ? 1.0 : 0.15,
        fogDensity: glareAmt * 0.92,
      });

      const truckZ = 28 + Math.sin(frame * 0.05) * 4;
      const sedanZ = 19 + Math.cos(frame * 0.04) * 2.5;
      drawVehicle3D(ctx, { x: 2.8, z: truckZ }, cam, {
        kind: "truck",
        taillightTrail: true,
        bboxLabel: stage === 2 ? "77GHz LOCK // Δv -16.4 km/h" : stage === 0 ? "TRUCK 99.1%" : undefined,
        bboxColor: stage === 2 ? C.amber : C.cyan,
        frame,
      });
      drawVehicle3D(ctx, { x: -3.2, z: sedanZ }, cam, {
        kind: "sedan",
        taillightTrail: true,
        bboxLabel: stage === 0 ? "SEDAN 98.7%" : undefined,
        bboxColor: C.emerald,
        frame,
      });

      // Stage 0: Overhead Semantic Traffic Light & Speed Limit Sign AR Locks
      if (stage === 0) {
        const tlP = project3D(0, 6.0, 22, cam);
        if (tlP.visible) {
          ctx.fillStyle = "rgba(3,10,22,0.88)";
          ctx.strokeStyle = C.emerald;
          ctx.lineWidth = 2.5;
          ctx.fillRect(tlP.sx - 68, tlP.sy - 30, 136, 48);
          ctx.strokeRect(tlP.sx - 68, tlP.sy - 30, 136, 48);
          ctx.fillStyle = C.emerald;
          ctx.shadowColor = C.emerald;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(tlP.sx - 40, tlP.sy - 6, 11, 0, TAU);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.font = "bold 18px monospace";
          ctx.fillText("GREEN 99%", tlP.sx - 18, tlP.sy);
        }
      }

      // Stage 1: Blinding Oncoming Volumetric High-Beam Lens Flare!
      if (stage === 1) {
        const bx = W * 0.42;
        const by = H * 0.47;
        const fl = ctx.createRadialGradient(bx, by, 10, bx, by, 680 * glareAmt + 60);
        fl.addColorStop(0, `rgba(255, 255, 255, ${0.95 * glareAmt})`);
        fl.addColorStop(0.28, `rgba(200, 235, 255, ${0.62 * glareAmt})`);
        fl.addColorStop(1, "transparent");
        ctx.fillStyle = fl;
        ctx.fillRect(0, 0, W, H);
      }

      // Stage 2: Volumetric 77GHz Amber Radar Wavefronts Bursting Through Rain + Vertical Scanner Wipe!
      if (stage === 2) {
        const wipeX = easeOutCubic((frame - cRad.from) / 22) * W;
        for (let wv = 0; wv < 6; wv++) {
          const p = ((frame * 0.042 + wv / 6) % 1);
          const wz = 4 + p * 34;
          const fade = (1 - p) * 0.9;
          let prev: [number, number, number] | null = null;
          for (let a = -7; a <= 7; a++) {
            const ang = (a / 7) * 0.45;
            const cur: [number, number, number] = [Math.sin(ang) * wz, 0.9, Math.cos(ang) * wz];
            if (prev) drawLine3D(ctx, prev, cur, cam, `rgba(245, 158, 11, ${fade})`, 4.2);
            prev = cur;
          }
        }
        if (wipeX < W - 10) {
          ctx.strokeStyle = C.amber;
          ctx.lineWidth = 6;
          ctx.shadowColor = C.amber;
          ctx.shadowBlur = 28;
          ctx.beginPath();
          ctx.moveTo(wipeX, 0);
          ctx.lineTo(wipeX, H);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    }

    // STAGE 3: FULL-SCREEN 4D MILLIMETER-WAVE SIDE-ELEVATION HEIGHT MATRIX!
    if (stage === 3) {
      ctx.fillStyle = "#030816";
      ctx.fillRect(0, 0, W, H);
      // Blueprint height grid
      ctx.strokeStyle = "rgba(245, 158, 11, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 64) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const groundY = 790;
      ctx.strokeStyle = C.cyan;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(100, groundY); ctx.lineTo(W - 100, groundY); ctx.stroke();

      const localT = frame - cRad4.from;
      const is4D = localT > 55;

      // Side-profile Ego EV on left
      ctx.fillStyle = "#0e2242";
      ctx.strokeStyle = C.cyan;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(210, groundY - 22);
      ctx.lineTo(440, groundY - 22);
      ctx.lineTo(420, groundY - 82);
      ctx.lineTo(350, groundY - 128);
      ctx.lineTo(255, groundY - 128);
      ctx.lineTo(210, groundY - 78);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Overhead Highway Gantry at H=5.4m (top right) & Stopped Truck at H=2.6m (far right)
      const gantryX = 1120;
      const gantryY = groundY - 360;
      ctx.fillStyle = is4D ? "rgba(16, 185, 129, 0.22)" : "rgba(255, 42, 95, 0.28)";
      ctx.strokeStyle = is4D ? C.emerald : C.crimson;
      ctx.lineWidth = 3;
      ctx.fillRect(gantryX - 24, gantryY - 56, 48, 86);
      ctx.strokeRect(gantryX - 24, gantryY - 56, 48, 86);
      // Gantry support line
      ctx.strokeStyle = "rgba(148,163,184,0.35)";
      ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.moveTo(gantryX, gantryY + 30); ctx.lineTo(gantryX, groundY); ctx.stroke();
      ctx.setLineDash([]);

      // Stopped Truck further right
      const truckX = 1480;
      ctx.fillStyle = "rgba(245, 158, 11, 0.22)";
      ctx.strokeStyle = C.amber;
      ctx.lineWidth = 3;
      ctx.fillRect(truckX, groundY - 210, 240, 186);
      ctx.strokeRect(truckX, groundY - 210, 240, 186);

      // Radar beam sweep! Flat horizontal fan (3D) vs full vertical height-slice fan (4D)!
      const ex = 445;
      const ey = groundY - 62;
      if (!is4D) {
        // 3D Radar flat blind beam confusing gantry & truck
        const grad = ctx.createLinearGradient(ex, ey, truckX, ey);
        grad.addColorStop(0, "rgba(255, 42, 95, 0.55)");
        grad.addColorStop(1, "rgba(255, 42, 95, 0.08)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(truckX, groundY - 430);
        ctx.lineTo(truckX, groundY);
        ctx.closePath();
        ctx.fill();
      } else {
        // 4D Radar crisp elevation matrix rays separating height cleanly!
        for (let ray = 0; ray < 14; ray++) {
          const ang = -0.44 + (ray / 13) * 0.48;
          const dist = 1060 + Math.sin(frame * 0.2 + ray) * 40;
          const rx = ex + Math.cos(ang) * dist;
          const ry = ey + Math.sin(ang) * dist;
          const hitsGantry = Math.abs(ry - gantryY) < 70;
          ctx.strokeStyle = hitsGantry ? C.emerald : `${C.cyan}88`;
          ctx.lineWidth = hitsGantry ? 3.5 : 1.8;
          ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(rx, ry); ctx.stroke();
        }
      }

      // Crisp elevation height labels
      ctx.font = "bold 22px monospace";
      ctx.fillStyle = is4D ? C.emerald : C.crimson;
      ctx.fillText(is4D ? "H = 5.4m 龙门架 · 放行 ✓" : "3D 缺高度 · 误判障碍!", gantryX - 110, gantryY - 76);
      ctx.fillStyle = C.amber;
      ctx.fillText("H = 2.6m 静止货车 · 锁定", truckX - 10, groundY - 230);
    }

    // STAGE 4: FULL-SCREEN 1920x1080 ORBITING 4,500-POINT 3D CITY INTERSECTION LiDAR POINT CLOUD!
    if (stage === 4) {
      ctx.fillStyle = "#02050c";
      ctx.fillRect(0, 0, W, H);
      const local = frame - cLid.from;
      const rot = local * 0.018 + 0.4;
      const cam: Cam3D = {
        x: Math.sin(rot) * 26,
        y: 12.5 + Math.sin(local * 0.03) * 2.2,
        z: -Math.cos(rot) * 26,
        yaw: -rot,
        pitch: -0.42,
        fov: 1050,
      };

      const sweepAng = (local * 0.16) % TAU;

      // Concentric 360° LiDAR ground laser scan rings (2,200 points!)
      for (let r = 2; r <= 24; r += 1.0) {
        const ptsN = Math.floor(r * 7);
        for (let k = 0; k < ptsN; k++) {
          const a = (k / ptsN) * TAU;
          const px = Math.cos(a) * r;
          const pz = Math.sin(a) * r;
          const pr = project3D(px, 0, pz, cam);
          if (!pr.visible || pr.sx < 0 || pr.sx > W || pr.sy < 0 || pr.sy > H) continue;
          const diff = Math.abs((((a - sweepAng) % TAU) + TAU) % TAU - Math.PI);
          const bright = diff > 2.75 ? 0.96 : 0.28;
          ctx.fillStyle = diff > 2.75 ? "#ffffff" : `rgba(0, 229, 255, ${bright})`;
          ctx.fillRect(pr.sx, pr.sy, diff > 2.75 ? 3.5 : 2.2, diff > 2.75 ? 3.5 : 2.2);
        }
      }

      // Glowing rotating volumetric LiDAR laser fan wedge
      drawPoly3D(
        ctx,
        [
          [0, 1.8, 0],
          [Math.cos(sweepAng) * 25, 0.2, Math.sin(sweepAng) * 25],
          [Math.cos(sweepAng + 0.34) * 25, 0.2, Math.sin(sweepAng + 0.34) * 25],
        ],
        cam,
        "rgba(0, 229, 255, 0.18)",
      );

      // 3D Point-Cloud City Buildings, Vehicles & Pedestrians!
      const drawCloudBox = (ox: number, oz: number, bw: number, bh: number, bl: number, col: string, nx: number, ny: number) => {
        ctx.fillStyle = col;
        for (let ix = 0; ix <= nx; ix++) {
          for (let iz = 0; iz <= nx; iz++) {
            for (let iy = 0; iy <= ny; iy++) {
              if (ix !== 0 && ix !== nx && iz !== 0 && iz !== nx && iy !== ny) continue;
              const wx = ox + (ix / nx - 0.5) * bw;
              const wy = (iy / ny) * bh;
              const wz = oz + (iz / nx - 0.5) * bl;
              const pr = project3D(wx, wy, wz, cam);
              if (pr.visible) ctx.fillRect(pr.sx, pr.sy, 3.2, 3.2);
            }
          }
        }
      };

      // Center Ego EV + surrounding cars + heavy truck + pedestrians + corner high-rise buildings!
      drawCloudBox(0, 0, 2.1, 1.5, 4.6, C.cyan, 7, 4);
      drawCloudBox(5.2, -3.5, 2.2, 1.7, 4.8, C.amber, 6, 4);
      drawCloudBox(-5.6, 5.2, 2.6, 3.2, 8.2, C.violet, 8, 6);
      drawCloudBox(6.8, 6.0, 0.7, 1.8, 0.7, C.crimson, 3, 5);
      drawCloudBox(-6.4, -4.8, 0.7, 1.8, 0.7, C.crimson, 3, 5);
      // 4 Towering corner skyscrapers in shimmering deep-blue/teal point clouds!
      drawCloudBox(-16, -15, 7, 12, 7, "#38bdf899", 8, 9);
      drawCloudBox(16, -15, 7, 15, 7, "#818cf899", 8, 10);
      drawCloudBox(-16, 16, 7, 11, 7, "#2dd4bf99", 8, 9);
      drawCloudBox(16, 16, 7, 14, 7, "#38bdf899", 8, 10);
    }

    // STAGE 5: FULL-SCREEN DIAGONAL PLASMA SPLIT DUEL — VISION-ONLY vs MULTI-SENSOR FUSION!
    if (stage === 5) {
      const local = frame - cDuel.from;
      const orb = local * 0.022;

      const drawDuelHalf = (clipLeft: boolean) => {
        ctx.save();
        ctx.beginPath();
        if (clipLeft) {
          ctx.moveTo(0, 0); ctx.lineTo(W * 0.54, 0); ctx.lineTo(W * 0.46, H); ctx.lineTo(0, H);
        } else {
          ctx.moveTo(W * 0.54, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(W * 0.46, H);
        }
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = clipLeft ? "#0c0614" : "#030c18";
        ctx.fillRect(0, 0, W, H);

        const cam: Cam3D = {
          x: Math.sin(orb) * 14,
          y: 9.2,
          z: -Math.cos(orb) * 14,
          yaw: -orb,
          pitch: -0.54,
          fov: 960,
          cx: clipLeft ? W * 0.27 : W * 0.73,
          cy: H * 0.56,
        };

        // Ground radial sonar grid
        for (let r = 3; r <= 12; r += 3) {
          let prev: [number, number, number] | null = null;
          for (let a = 0; a <= 32; a++) {
            const ang = (a / 32) * TAU;
            const pt: [number, number, number] = [Math.cos(ang) * r, 0, Math.sin(ang) * r];
            if (prev) drawLine3D(ctx, prev, pt, cam, clipLeft ? "rgba(255,42,95,0.20)" : "rgba(0,229,255,0.22)", 1.5);
            prev = pt;
          }
        }

        // Left: 8 Overlapping Pure-Vision Camera Frustum Cones!
        if (clipLeft) {
          for (let k = 0; k < 8; k++) {
            const ang = (k / 8) * TAU + Math.sin(local * 0.04) * 0.06;
            const spread = 0.34;
            const dist = 10.5;
            drawPoly3D(
              ctx,
              [
                [0, 1.35, 0],
                [Math.cos(ang - spread) * dist, 0.1, Math.sin(ang - spread) * dist],
                [Math.cos(ang + spread) * dist, 0.1, Math.sin(ang + spread) * dist],
              ],
              cam,
              "rgba(255, 42, 95, 0.16)",
              `${C.crimson}aa`,
              1.8,
            );
          }
        } else {
          // Right: Tri-Color Heterogeneous Fusion (Camera Teal + Radar Amber Waves + 360° LiDAR Cyan Dots!)
          // Camera cones
          for (const ang of [Math.PI / 2, -Math.PI / 2, 0, Math.PI]) {
            drawPoly3D(
              ctx,
              [
                [0, 1.35, 0],
                [Math.cos(ang - 0.35) * 9.5, 0.1, Math.sin(ang - 0.35) * 9.5],
                [Math.cos(ang + 0.35) * 9.5, 0.1, Math.sin(ang + 0.35) * 9.5],
              ],
              cam,
              "rgba(0, 245, 196, 0.14)",
              `${C.teal}99`,
              1.5,
            );
          }
          // Pulsing Amber Radar wavefronts
          for (let wv = 0; wv < 4; wv++) {
            const rr = 2 + ((local * 0.25 + wv * 3) % 12);
            let prev: [number, number, number] | null = null;
            for (let a = -5; a <= 5; a++) {
              const ang = Math.PI / 2 + (a / 5) * 0.52;
              const pt: [number, number, number] = [Math.cos(ang) * rr, 0.65, Math.sin(ang) * rr];
              if (prev) drawLine3D(ctx, prev, pt, cam, `rgba(245,158,11,${clamp(1 - rr / 13, 0, 1)})`, 3.5);
              prev = pt;
            }
          }
          // 360° Spinning Cyan LiDAR point cloud halo
          for (let i = 0; i < 160; i++) {
            const a = (i / 160) * TAU + local * 0.05;
            const r = 4.5 + (i % 5) * 1.4;
            const pr = project3D(Math.cos(a) * r, 0.25 + (i % 3) * 0.35, Math.sin(a) * r, cam);
            if (pr.visible) {
              ctx.fillStyle = C.cyan;
              ctx.fillRect(pr.sx, pr.sy, 3, 3);
            }
          }
        }

        drawVehicle3D(ctx, { x: 0, z: 0 }, cam, {
          kind: "ego",
          accent: clipLeft ? C.crimson : C.cyan,
          xray: 0.35,
          frame,
        });

        ctx.restore();
      };

      drawDuelHalf(true);
      drawDuelHalf(false);

      // Glowing diagonal plasma divider slicing screen (fades softly before bottom subtitle)
      const divGrad = ctx.createLinearGradient(W * 0.54, 0, W * 0.46, H);
      divGrad.addColorStop(0, "#ffffff");
      divGrad.addColorStop(0.84, "#ffffff");
      divGrad.addColorStop(0.93, "rgba(0, 229, 255, 0)");
      ctx.strokeStyle = divGrad;
      ctx.lineWidth = 4;
      ctx.shadowColor = C.cyan;
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.moveTo(W * 0.54, 0);
      ctx.lineTo(W * 0.46, H);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [frame, stage, cGlare.from, cRad.from, cRad4.from, cLid.from, cDuel.from]);

  return (
    <CinemaStage
      badge={scene.badge}
      telemetry={
        ["CAMERA // RGB SEMANTIC", "CAMERA // GLARE OVERLOAD", "77GHz RADAR // STORM PIERCE", "4D RADAR // ELEVATION Z-AXIS", "LIDAR 128-CH // 4500 PTS", "VISION-ONLY vs FUSION"][stage]
      }
      accent={[C.cyan, C.crimson, C.amber, C.emerald, C.cyan, C.teal][stage]}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{ width: W, height: H }} />

      {stage === 0 && (
        <KineticSlam title="01 摄像头 · 高清语义之眼" sub="COLOR · TRAFFIC LIGHTS · OCR SIGNS" accent={C.cyan} startFrame={cCam.from} holdFrames={120} y={88} size={66} />
      )}
      {stage === 1 && (
        <KineticSlam title="怕黑夜 · 怕强逆光 · 怕浓雾" sub="OPTICAL LIMITATION" accent={C.crimson} startFrame={cGlare.from} holdFrames={100} y={130} size={72} />
      )}
      {stage === 2 && (
        <KineticSlam title="02 毫米波雷达 · 穿雨雪雾霾" sub="77GHz DOPPLER VELOCITY LOCK" accent={C.amber} startFrame={cRad.from} holdFrames={130} y={88} size={68} />
      )}
      {stage === 3 && (
        <KineticSlam title="4D 毫米波 · 补齐高度维度" sub="3D AMBIGUITY → 4D ELEVATION" accent={C.emerald} startFrame={cRad4.from} holdFrames={120} y={88} size={66} />
      )}
      {stage === 4 && (
        <>
          <KineticSlam title="03 激光雷达 · 厘米级 3D 点云" sub="ACTIVE LASER // ZERO-LIGHT NIGHT VISION" accent={C.cyan} startFrame={cLid.from} holdFrames={180} y={80} size={66} />
          <ArPin tx={960} ty={560} lx={1320} ly={340} label="主动光源 · 无惧漆黑" sub="128,400 PTS/SEC // ±2cm" accent={C.cyan} startFrame={cLid.from + 20} />
        </>
      )}
      {stage === 5 && (
        <>
          <div style={{ position: "absolute", top: 105, left: 100, pointerEvents: "none" }}>
            <div style={{ fontSize: 54, fontWeight: 900, color: C.crimson, textShadow: `0 0 28px ${C.crimson}` }}>纯视觉派</div>
            <div style={{ fontSize: 22, fontFamily: "monospace", color: "#f8fafc", marginTop: 6 }}>8× CAMERA + NEURAL NET · 极致降本</div>
          </div>
          <div style={{ position: "absolute", top: 105, right: 100, textAlign: "right", pointerEvents: "none" }}>
            <div style={{ fontSize: 54, fontWeight: 900, color: C.cyan, textShadow: `0 0 28px ${C.cyan}` }}>多传感器融合</div>
            <div style={{ fontSize: 22, fontFamily: "monospace", color: "#f8fafc", marginTop: 6 }}>CAMERA + RADAR + LIDAR · 异构安全冗余</div>
          </div>
        </>
      )}
    </CinemaStage>
  );
};
