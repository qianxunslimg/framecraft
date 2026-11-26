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
 * ACT 4: CENTIMETER LOCALIZATION — 3D Y-FORK GPS DRIFT -> 3D NEON TUNNEL DIVE -> SPINNING IMU GYRO & SLAM RAYS!
 */
export const LocalizationScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cDrift = getCue(scene.cues, "gpsDrift", 10);
  const cTun = getCue(scene.cues, "tunnelBlock", 130);
  const cImu = getCue(scene.cues, "rtkImu", 220);
  const cSlam = getCue(scene.cues, "slamLock", 360);

  const stage =
    frame >= cSlam.from ? 3
    : frame >= cImu.from ? 2
    : frame >= cTun.from ? 1
    : 0;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // STAGE 0: High 3D Highway Y-Fork where red GPS ghost erratically teleports across main road vs exit ramp!
    if (stage === 0) {
      const cam: Cam3D = { x: 1.5, y: 12.5, z: -12, yaw: 0.05, pitch: -0.45, fov: 960 };
      drawCyberHighwayWorld(ctx, cam, frame, { speed: 1.6, accent: C.blue, showGantries: false, showCity: true });

      // Draw diverging right exit ramp!
      const rampPts: Array<[number, number]> = [];
      for (let i = 0; i <= 14; i++) {
        const z = 8 + i * 7;
        const x = 5.7 + Math.pow(i / 14, 1.5) * 14;
        rampPts.push([x, z]);
      }
      for (let i = 0; i < rampPts.length - 1; i++) {
        const [x1, z1] = rampPts[i];
        const [x2, z2] = rampPts[i + 1];
        drawPoly3D(ctx, [[x1, 0.04, z1], [x1 + 5.2, 0.04, z1], [x2 + 5.2, 0.04, z2], [x2, 0.04, z2]], cam, "rgba(10, 20, 42, 0.92)");
        drawLine3D(ctx, [x1, 0.06, z1], [x2, 0.06, z2], cam, C.amber, 3);
        drawLine3D(ctx, [x1 + 5.2, 0.06, z1], [x2 + 5.2, 0.06, z2], cam, C.amber, 3);
      }

      // Real Ego Car cleanly in right main lane
      drawVehicle3D(ctx, { x: 2.2, z: 14 }, cam, { kind: "ego", accent: C.cyan, headlights: true, frame });

      // Erratic jumping Crimson GPS Ghost Hologram teleporting onto the wrong ramp!
      const errX = 2.2 + Math.sin(frame * 0.25) * 5.6 + Math.cos(frame * 0.43) * 2.4;
      const errZ = 14 + Math.cos(frame * 0.21) * 4.5;
      const gp = project3D(errX, 0.5, errZ, cam);
      if (gp.visible) {
        const r = 54 + Math.sin(frame * 0.4) * 14;
        ctx.fillStyle = "rgba(255, 42, 95, 0.22)";
        ctx.strokeStyle = C.crimson;
        ctx.lineWidth = 3;
        ctx.shadowColor = C.crimson;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.ellipse(gp.sx, gp.sy, r * 1.4, r * 0.72, 0, 0, TAU);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = C.crimson;
        ctx.fillText("GPS ±6.2m DRIFT!", gp.sx - 82, gp.sy - 48);
      }
      return;
    }

    // STAGES 1, 2, 3: CONTINUOUS 3D NEON MOUNTAIN TUNNEL DIVE -> SPINNING 3D IMU GYRO -> SLAM WALL LOCK!
    ctx.fillStyle = "#02050c";
    ctx.fillRect(0, 0, W, H);
    const local = frame - cTun.from;
    const cam: Cam3D = {
      x: Math.sin(local * 0.025) * 0.9,
      y: 2.9,
      z: -8.5,
      yaw: -Math.sin(local * 0.025) * 0.05,
      pitch: -0.09,
      fov: 960,
    };

    // Tunnel road floor
    drawPoly3D(ctx, [[-6.5, 0, 1], [6.5, 0, 1], [6.5, 0, 180], [-6.5, 0, 180]], cam, "#070f20");
    drawLine3D(ctx, [-6.2, 0.05, 1], [-6.2, 0.05, 180], cam, stage >= 2 ? C.cyan : C.crimson, 3.5);
    drawLine3D(ctx, [6.2, 0.05, 1], [6.2, 0.05, 180], cam, stage >= 2 ? C.cyan : C.crimson, 3.5);

    // Rushing dashed lane lines
    const scrollZ = frame * 2.1;
    for (const lx of [-2.1, 2.1]) {
      for (let d = 0; d < 20; d++) {
        const dz = 2 + ((d * 9 - (scrollZ % 9) + 180) % 180);
        drawLine3D(ctx, [lx, 0.03, dz], [lx, 0.03, dz + 4], cam, "rgba(148, 226, 255, 0.6)", 2.2);
      }
    }

    // Monumental 3D Concrete-and-Neon Arched Tunnel Ribs rushing over the camera!
    const archStep = 11;
    const archCols = stage === 1 ? C.crimson : stage === 2 ? C.violet : C.emerald;
    for (let i = 15; i >= 0; i--) {
      const az = 3 + ((i * archStep - (scrollZ % archStep) + archStep * 16) % (archStep * 16));
      const fade = clamp(1 - az / 165, 0, 1);
      const segs = 16;
      let prev: [number, number, number] | null = null;
      for (let s = 0; s <= segs; s++) {
        const ang = (s / segs) * Math.PI;
        const ax = Math.cos(ang) * 7.8;
        const ay = Math.sin(ang) * 6.8;
        const cur: [number, number, number] = [ax, ay, az];
        if (prev) {
          drawLine3D(
            ctx,
            prev,
            cur,
            cam,
            `${archCols}${Math.round(fade * 195).toString(16).padStart(2, "0")}`,
            s === 7 || s === 8 ? 5 : 2.6,
          );
        }
        prev = cur;
      }
    }

    // Stage 1: Blocked Orbital Satellite Beams slamming into the tunnel roof & sparking red!
    if (stage === 1) {
      for (let b = 0; b < 3; b++) {
        const bx = 560 + b * 400;
        ctx.strokeStyle = "rgba(245, 158, 11, 0.72)";
        ctx.lineWidth = 3;
        ctx.setLineDash([12, 10]);
        ctx.beginPath();
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx + 20, 215);
        ctx.stroke();
        ctx.setLineDash([]);

        // Shatter sparks at tunnel roof!
        ctx.fillStyle = C.crimson;
        ctx.shadowColor = C.crimson;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(bx + 20, 215, 10 + Math.sin(frame * 0.4 + b) * 4, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Stage 3: Crisp Cyan/Emerald SLAM Feature-Matching Laser Rays shooting from car to tunnel arches!
    const egoZ = 10;
    if (stage === 3) {
      for (let k = 0; k < 10; k++) {
        const side = k % 2 === 0 ? -1 : 1;
        const tz = 12 + ((k * 14 - (scrollZ % 14) + 140) % 100);
        const target: [number, number, number] = [side * 7.4, 2.2 + (k % 3) * 1.4, tz];
        drawLine3D(ctx, [0, 1.55, egoZ], target, cam, `${C.emerald}bb`, 2);
        const tp = project3D(target[0], target[1], target[2], cam);
        if (tp.visible) {
          ctx.strokeStyle = C.cyan;
          ctx.lineWidth = 2;
          ctx.strokeRect(tp.sx - 8, tp.sy - 8, 16, 16);
        }
      }
    }

    // Hero Ego Car racing dead-center inside tunnel
    drawVehicle3D(ctx, { x: 0, z: egoZ }, cam, {
      kind: "ego",
      accent: stage === 1 ? C.crimson : stage === 2 ? C.violet : C.emerald,
      xray: stage >= 2 ? 0.65 : 0.1,
      headlights: true,
      taillightTrail: true,
      frame,
    });

    // Stage 2 & 3: Large Glowing 3D Rotating Gyroscope IMU Hologram projected above the EV!
    if (stage >= 2) {
      const gp = project3D(0, 3.3, egoZ, cam);
      if (gp.visible) {
        ctx.save();
        ctx.translate(gp.sx, gp.sy);
        const rings = [
          { rx: 86, ry: 28, rot: frame * 0.07, col: C.violet },
          { rx: 86, ry: 34, rot: -frame * 0.05 + 1.1, col: C.cyan },
          { rx: 62, ry: 62, rot: frame * 0.09, col: C.emerald },
        ];
        for (const rg of rings) {
          ctx.save();
          ctx.rotate(rg.rot);
          ctx.strokeStyle = rg.col;
          ctx.lineWidth = 3;
          ctx.shadowColor = rg.col;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.ellipse(0, 0, rg.rx, rg.ry, 0, 0, TAU);
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }
    }
  }, [frame, stage, cTun.from]);

  return (
    <CinemaStage
      badge={scene.badge}
      telemetry={
        ["GPS // ±6.2m DRIFT", "TUNNEL // GPS SIGNAL LOST", "IMU GYRO // DEAD RECKONING", "SLAM FUSION // ±2.0cm LOCKED"][stage]
      }
      accent={[C.crimson, C.crimson, C.violet, C.emerald][stage]}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{ width: W, height: H }} />

      {stage === 0 && (
        <KineticSlam title="普通 GPS · 漂移三到十米" sub="MAIN ROAD OR EXIT RAMP?" accent={C.crimson} startFrame={cDrift.from} holdFrames={110} y={85} size={74} />
      )}
      {stage === 1 && (
        <KineticSlam title="进入隧道 · 卫星信号瞬间断连" sub="SATELLITE OCCLUSION" accent={C.crimson} startFrame={cTun.from} holdFrames={85} y={90} size={72} />
      )}
      {stage === 2 && (
        <>
          <KineticSlam title="RTK 差分 + IMU 惯导无缝接力" sub="INERTIAL MEASUREMENT UNIT" accent={C.violet} startFrame={cImu.from} holdFrames={130} y={82} size={66} />
          <ArPin tx={960} ty={390} lx={1270} ly={290} label="IMU 三轴陀螺仪推算" sub="ACCELERATION + YAW RATE" accent={C.violet} startFrame={cImu.from + 12} />
        </>
      )}
      {stage === 3 && (
        <>
          <KineticSlam title="视觉与点云校验 · 全天候 ±2cm 锁死" sub="MULTI-SOURCE FUSION LOCK" accent={C.emerald} startFrame={cSlam.from} holdFrames={130} y={82} size={66} />
          <ArPin tx={960} ty={610} lx={1290} ly={480} label="特征比对消除累积漂移" sub="±2.0cm LANE LOCKED ✓" accent={C.emerald} startFrame={cSlam.from + 12} />
        </>
      )}
    </CinemaStage>
  );
};

/**
 * ACT 5: PNC & DRIVE-BY-WIRE — TACTICAL 3D INTERSECTION 28-SPLINE PLANNER -> 3D CHASSIS X-RAY & CROSSWIND MPC!
 */
export const PncControlScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cPred = getCue(scene.cues, "predictCutin", 10);
  const cPlan = getCue(scene.cues, "planSplines", 160);
  const cDbw = getCue(scene.cues, "dbwXray", 310);
  const cMpc = getCue(scene.cues, "mpcWind", 460);

  const stage =
    frame >= cMpc.from ? 3
    : frame >= cDbw.from ? 2
    : frame >= cPlan.from ? 1
    : 0;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // STAGES 0 & 1: FULL-SCREEN TACTICAL 3D ISOMETRIC CITY INTERSECTION (TESLA/WAYMO STYLE!)
    if (stage <= 1) {
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, W, H);
      const cam: Cam3D = {
        x: Math.sin(frame * 0.014) * 2.2,
        y: 23.5,
        z: -25.5,
        yaw: -Math.sin(frame * 0.014) * 0.06,
        pitch: -0.71,
        fov: 1040,
        cy: H * 0.54,
      };

      // Crossroad asphalt deck
      drawPoly3D(ctx, [[-34, 0, -6], [34, 0, -6], [34, 0, 6], [-34, 0, 6]], cam, "#0a1326");
      drawPoly3D(ctx, [[-6, 0, -30], [6, 0, -30], [6, 0, 30], [-6, 0, 30]], cam, "#0a1326");
      // Glowing intersection border lines
      for (const s of [-6, 6]) {
        drawLine3D(ctx, [-34, 0.04, s], [-6, 0.04, s], cam, `${C.cyan}77`, 2.5);
        drawLine3D(ctx, [6, 0.04, s], [34, 0.04, s], cam, `${C.cyan}77`, 2.5);
        drawLine3D(ctx, [s, 0.04, -30], [s, 0.04, -6], cam, `${C.cyan}77`, 2.5);
        drawLine3D(ctx, [s, 0.04, 6], [s, 0.04, 30], cam, `${C.cyan}77`, 2.5);
      }
      // Crosswalk zebra bars
      for (let z = -4.8; z <= 4.8; z += 1.6) {
        drawPoly3D(ctx, [[6.4, 0.05, z - 0.35], [8.8, 0.05, z - 0.35], [8.8, 0.05, z + 0.35], [6.4, 0.05, z + 0.35]], cam, "rgba(226,232,240,0.22)");
      }

      // 4 Dark Glass Corner City Blocks framing the intersection
      const corners: Array<[number, number, number]> = [
        [-14, -14, 9], [14, -14, 12], [-14, 14, 11], [14, 14, 14],
      ];
      for (const [bx, bz, bh] of corners) {
        drawPoly3D(ctx, [[bx - 5.5, 0, bz - 5.5], [bx + 5.5, 0, bz - 5.5], [bx + 5.5, bh, bz - 5.5], [bx - 5.5, bh, bz - 5.5]], cam, "rgba(8, 17, 36, 0.92)", "rgba(0,229,255,0.22)", 1.5);
        drawPoly3D(ctx, [[bx - 5.5, 0, bz - 5.5], [bx - 5.5, 0, bz + 5.5], [bx - 5.5, bh, bz + 5.5], [bx - 5.5, bh, bz - 5.5]], cam, "rgba(13, 27, 54, 0.92)", "rgba(0,229,255,0.22)", 1.5);
        drawPoly3D(ctx, [[bx - 5.5, bh, bz - 5.5], [bx + 5.5, bh, bz - 5.5], [bx + 5.5, bh, bz + 5.5], [bx - 5.5, bh, bz + 5.5]], cam, "rgba(16, 35, 68, 0.95)", "rgba(0,229,255,0.35)", 1.5);
      }

      // Occluding parked truck on near-right corner casting a Crimson Blind-Spot Shadow Cone!
      drawVehicle3D(ctx, { x: 4.0, z: -9.5 }, cam, { kind: "truck", bboxLabel: "OCCLUSION", bboxColor: C.muted, frame });
      drawPoly3D(ctx, [[5.3, 0.08, -6.5], [14, 0.08, -1.5], [14, 0.08, -9.5]], cam, "rgba(255, 42, 95, 0.16)", `${C.crimson}55`, 1.5);

      // Darting E-Bike emerging from behind the parked truck with pulsing Amber Multi-Modal Prediction Cone!
      const bikeT = (frame * 0.018) % 1;
      const bikeX = 7.2 - bikeT * 5.2;
      const bikeZ = -4.2 + bikeT * 5.8;
      // Probability prediction fan
      drawPoly3D(
        ctx,
        [
          [bikeX, 0.12, bikeZ],
          [bikeX - 5.2, 0.12, bikeZ + 3.2],
          [bikeX - 2.4, 0.12, bikeZ + 7.2],
        ],
        cam,
        "rgba(245, 158, 11, 0.28)",
        C.amber,
        2.2,
      );
      const bp = project3D(bikeX, 1.0, bikeZ, cam);
      if (bp.visible) {
        ctx.fillStyle = C.amber;
        ctx.shadowColor = C.amber;
        ctx.shadowBlur = 22;
        ctx.beginPath();
        ctx.arc(bp.sx, bp.sy, 13, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = "bold 17px monospace";
        ctx.fillText("E-BIKE CUT-IN // 86%", bp.sx - 80, bp.sy - 24);
      }

      // Ego EV approaching from left along main avenue
      const egoX = stage === 1 ? -11 + easeInOutCubic((frame - cPlan.from) / 120) * 14 : -11;
      const egoZ = stage === 1 ? 2.4 + Math.sin(easeInOutCubic((frame - cPlan.from) / 120) * Math.PI) * 2.2 : 2.4;

      // Stage 1: 28 ELECTRIC CANDIDATE TRAJECTORY SPLINES PRUNING IN REAL TIME TO 1 EMERALD OPTIMAL PATH!
      const pruneT = stage === 1 ? easeOutCubic((frame - cPlan.from) / 40) : 0.2;
      for (let s = -10; s <= 10; s++) {
        const isBest = s === 4;
        const collides = s <= 1 && s >= -5;
        const alpha = isBest ? 1.0 : Math.max(0.08, (1 - pruneT) * 0.65);
        const col = isBest
          ? C.emerald
          : collides
            ? `rgba(255, 42, 95, ${alpha})`
            : `rgba(245, 158, 11, ${alpha * 0.7})`;
        if (isBest) {
          ctx.shadowColor = C.emerald;
          ctx.shadowBlur = 20;
        }
        let prev: [number, number, number] = [egoX + 2.4, 0.2, egoZ];
        for (let k = 1; k <= 14; k++) {
          const u = k / 14;
          const nx = egoX + 2.4 + u * 22;
          const nz = egoZ + s * 0.42 * Math.sin(u * Math.PI * 0.85);
          const cur: [number, number, number] = [nx, 0.16, nz];
          drawLine3D(ctx, prev, cur, cam, col, isBest ? 6 : 1.8);
          prev = cur;
        }
        ctx.shadowBlur = 0;
      }

      drawVehicle3D(ctx, { x: egoX, z: egoZ, yaw: Math.PI / 2 }, cam, {
        kind: "ego",
        accent: C.cyan,
        headlights: true,
        frame,
      });
      return;
    }

    // STAGE 2: FULL-SCREEN CLOSE-UP ORBITING 3D TRANSPARENT DRIVE-BY-WIRE CHASSIS X-RAY!
    if (stage === 2) {
      ctx.fillStyle = "#020611";
      ctx.fillRect(0, 0, W, H);
      const local = frame - cDbw.from;
      const orb = -0.58 + local * 0.012;
      const cam: Cam3D = {
        x: Math.sin(orb) * 8.4,
        y: 3.1,
        z: -Math.cos(orb) * 8.4,
        yaw: -orb,
        pitch: -0.28,
        fov: 1120,
      };
      // Studio turntable concentric cyan floor rings
      for (let r = 2.5; r <= 7.5; r += 1.25) {
        let prev: [number, number, number] | null = null;
        for (let a = 0; a <= 36; a++) {
          const ang = (a / 36) * TAU;
          const cur: [number, number, number] = [Math.cos(ang) * r, 0, Math.sin(ang) * r];
          if (prev) drawLine3D(ctx, prev, cur, cam, "rgba(0, 229, 255, 0.22)", 1.5);
          prev = cur;
        }
      }
      drawVehicle3D(ctx, { x: 0, z: 0 }, cam, {
        kind: "ego",
        accent: C.cyan,
        xray: 0.95,
        wheelSteer: Math.sin(local * 0.16) * 0.52,
        brakeGlow: Math.floor(local / 22) % 2 === 0,
        frame,
      });
      return;
    }

    // STAGE 3: 3D WET HIGHWAY CROSSWIND ARENA + LIVE MPC 100Hz CONVERGENCE OSCILLOSCOPE!
    const local = frame - cMpc.from;
    const cam: Cam3D = { x: 0, y: 3.2, z: -9.5, yaw: 0, pitch: -0.15, fov: 960 };
    drawCyberHighwayWorld(ctx, cam, frame, { speed: 2.0, accent: C.emerald, stormRain: 0.65 });

    // Glowing emerald ideal centerline path
    const idealPts: Array<{ x: number; z: number }> = [];
    for (let i = 0; i <= 18; i++) idealPts.push({ x: 0, z: 3 + i * 2.5 });
    drawFsdRibbon3D(ctx, idealPts, cam, C.emerald, 1.0, frame);

    // Damped crosswind lateral displacement quickly crushed to 0.00m by MPC!
    const damp = Math.exp(-local * 0.032) * Math.sin(local * 0.24) * 1.4;
    drawVehicle3D(ctx, { x: damp, z: 6.5, yaw: -damp * 0.12 }, cam, {
      kind: "ego",
      accent: C.emerald,
      xray: 0.45,
      headlights: true,
      taillightTrail: true,
      wheelSteer: -damp * 0.4,
      frame,
    });

    // Dramatic Sweeping Sideways Crosswind Force Streamlines blasting left-to-right!
    for (let w = 0; w < 18; w++) {
      const wy = 240 + hash(w * 29) * 580;
      const wx = ((frame * 28 + hash(w * 13) * W) % (W + 300)) - 150;
      const wlen = 160 + hash(w * 7) * 140;
      const g = ctx.createLinearGradient(wx, wy, wx + wlen, wy);
      g.addColorStop(0, "transparent");
      g.addColorStop(0.7, "rgba(0, 229, 255, 0.55)");
      g.addColorStop(1, "#ffffffaa");
      ctx.strokeStyle = g;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wx + wlen, wy + 18);
      ctx.stroke();
    }

    // Floating translucent MPC 100Hz error-convergence oscilloscope in upper-right!
    const ox = 1280;
    const oy = 180;
    const ow = 540;
    const oh = 150;
    ctx.strokeStyle = `${C.cyan}88`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(ox, oy + oh / 2);
    ctx.lineTo(ox + ow, oy + oh / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = C.emerald;
    ctx.lineWidth = 4;
    ctx.shadowColor = C.emerald;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const px = ox + (i / 60) * ow;
      const env = Math.exp(-i * 0.068);
      const py = oy + oh / 2 - Math.sin(i * 0.34 - local * 0.2) * 58 * env;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.font = "bold 17px monospace";
    ctx.fillStyle = C.emerald;
    ctx.fillText("MPC 100Hz // LATERAL ERR → 0.00m", ox, oy - 12);
  }, [frame, stage, cPlan.from, cDbw.from, cMpc.from]);

  return (
    <CinemaStage
      badge={scene.badge}
      telemetry={["INTERSECTION // MULTI-AGENT GAME", "PLANNER // 28 SPLINES PRUNED", "DRIVE-BY-WIRE // 5ms BUS", "MPC 100Hz // CROSSWIND LOCK"][stage]}
      accent={[C.amber, C.emerald, C.cyan, C.emerald][stage]}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{ width: W, height: H }} />

      {stage === 0 && (
        <KineticSlam title="意图预测 · 提前看穿鬼探头" sub="MULTI-AGENT PREDICTION" accent={C.amber} startFrame={cPred.from} holdFrames={130} y={84} size={70} />
      )}
      {stage === 1 && (
        <KineticSlam title="瞬时博弈 · 选出丝滑最优轨迹" sub="28 CANDIDATES → 1 OPTIMAL SPLINE" accent={C.emerald} startFrame={cPlan.from} holdFrames={130} y={84} size={70} />
      )}
      {stage === 2 && (
        <>
          <KineticSlam title="线控底盘 · 5ms 纯电信号直驱" sub="STEER · DRIVE · BRAKE BY WIRE" accent={C.cyan} startFrame={cDbw.from} holdFrames={130} y={84} size={70} />
          <ArPin tx={810} ty={610} lx={420} ly={390} label="电信号直驱转向电机" sub="NO MECHANICAL DELAY" accent={C.cyan} startFrame={cDbw.from + 12} align="right" />
          <ArPin tx={1110} ty={560} lx={1320} ly={380} label="双冗余电子液压柔刹" sub="DUAL-REDUNDANT BRAKE" accent={C.crimson} startFrame={cDbw.from + 24} />
        </>
      )}
      {stage === 3 && (
        <KineticSlam title="MPC 模型预测控制 · 抗风稳跑不画龙" sub="100Hz REAL-TIME DYNAMICS CORRECTION" accent={C.emerald} startFrame={cMpc.from} holdFrames={130} y={84} size={64} />
      )}
    </CinemaStage>
  );
};

/**
 * ACT 6: TECH EVOLUTION 1.0 -> 2.0 — 3D BLUEPRINT SHATTER -> BEV TILT-UP -> FULL-SCREEN 3D OCCUPANCY VOXEL UNIVERSE!
 */
export const EvoMapBevScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cHd = getCue(scene.cues, "hdBlueprint", 10);
  const cShat = getCue(scene.cues, "hdShatter", 170);
  const cBev = getCue(scene.cues, "bevStitch", 310);
  const cOcc = getCue(scene.cues, "occVoxels", 480);

  const stage =
    frame >= cOcc.from ? 3
    : frame >= cBev.from ? 2
    : frame >= cShat.from ? 1
    : 0;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // STAGE 0 & 1: 1.0 HD MAP BLUEPRINT -> SUDDEN CONSTRUCTION BARRICADE GLITCH & SHATTER!
    if (stage <= 1) {
      const shatT = stage === 1 ? easeOutCubic((frame - cShat.from) / 36) : 0;
      const glitchShake = stage === 1 && frame - cShat.from < 24 ? (hash(frame * 19) - 0.5) * 28 : 0;
      ctx.save();
      ctx.translate(glitchShake, 0);

      const cam: Cam3D = { x: 0, y: 4.5, z: -8, yaw: 0, pitch: -0.22, fov: 960 };
      drawCyberHighwayWorld(ctx, cam, frame, {
        speed: stage === 1 ? Math.max(0.15, 1.8 * (1 - shatT)) : 1.8,
        accent: stage === 1 ? C.crimson : C.cyan,
        blueprint: true,
        showGantries: true,
        showCity: true,
      });

      // Deterministic HD Map green pre-baked spline
      const pts: Array<{ x: number; z: number }> = [];
      for (let i = 0; i <= 16; i++) pts.push({ x: 0, z: 4 + i * 2.4 });
      drawFsdRibbon3D(ctx, pts, cam, stage === 1 ? C.crimson : C.emerald, 0.9, frame);

      // Sudden 3D Orange Construction Barricade + Cones blocking the pre-baked HD Map lane!
      if (stage === 1) {
        const dropY = Math.max(0, (1 - easeOutCubic((frame - cShat.from) / 14)) * 12);
        // Striped construction barrier wall across center lane
        drawPoly3D(ctx, [[-2.6, dropY, 22], [2.6, dropY, 22], [2.6, dropY + 1.8, 22], [-2.6, dropY + 1.8, 22]], cam, "rgba(255, 122, 24, 0.88)", "#ffffff", 3);
        for (const cx of [-3.4, -1.6, 0, 1.6, 3.4]) {
          drawPoly3D(ctx, [[cx - 0.35, dropY, 19.5], [cx + 0.35, dropY, 19.5], [cx, dropY + 1.2, 19.5]], cam, C.orange, "#ffffff", 1.8);
        }
        // Flying shattered blue wireframe shards exploding across the screen!
        for (let i = 0; i < 65; i++) {
          const sx = W * 0.5 + (hash(i * 13) - 0.5) * 1400 * shatT;
          const sy = H * 0.52 + (hash(i * 29) - 0.5) * 820 * shatT;
          const sz = 14 + hash(i * 41) * 34;
          ctx.strokeStyle = i % 3 === 0 ? C.crimson : C.cyan;
          ctx.lineWidth = 2;
          ctx.globalAlpha = clamp(1 - shatT * 0.55, 0.15, 1);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + sz, sy + sz * 0.4);
          ctx.lineTo(sx + sz * 0.3, sy + sz);
          ctx.closePath();
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      drawVehicle3D(ctx, { x: 0, z: 6 }, cam, { kind: "ego", accent: stage === 1 ? C.crimson : C.cyan, frame });
      ctx.restore();
      return;
    }

    // STAGE 2: 2.0 BEV + TRANSFORMER — SMOOTH CAMERA TILT UP INTO 360° GOD'S-EYE ONLINE MAPPING!
    if (stage === 2) {
      ctx.fillStyle = "#030816";
      ctx.fillRect(0, 0, W, H);
      const local = frame - cBev.from;
      const tilt = easeInOutCubic(local / 42);
      const cam: Cam3D = {
        x: Math.sin(local * 0.018) * 3,
        y: 4.5 + tilt * 24.0,
        z: -10 + tilt * 8.5,
        yaw: -Math.sin(local * 0.018) * 0.1,
        pitch: -0.24 - tilt * 1.12,
        fov: 980,
      };

      // Live BEV Radar Grid expanding outward from the ego EV
      const expand = easeOutCubic(local / 48) * 28;
      for (let g = -28; g <= 28; g += 4) {
        drawLine3D(ctx, [g, 0, -28], [g, 0, 28], cam, "rgba(0, 229, 255, 0.16)", 1.4);
        drawLine3D(ctx, [-28, 0, g], [28, 0, g], cam, "rgba(0, 229, 255, 0.16)", 1.4);
      }

      // 6 Surround Camera FOV Wedges stitching live into unified BEV topology!
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * TAU + local * 0.008;
        drawPoly3D(
          ctx,
          [
            [0, 1.4, 0],
            [Math.cos(ang - 0.42) * expand, 0.1, Math.sin(ang - 0.42) * expand],
            [Math.cos(ang + 0.42) * expand, 0.1, Math.sin(ang + 0.42) * expand],
          ],
          cam,
          "rgba(0, 229, 255, 0.13)",
          `${C.cyan}88`,
          1.8,
        );
      }

      // Live-drawn glowing online highway lanes emerging outward as car drives!
      for (const lx of [-6, -2, 2, 6]) {
        drawLine3D(ctx, [lx, 0.08, -expand], [lx, 0.08, expand], cam, lx === -6 || lx === 6 ? C.cyan : `${C.teal}99`, lx === -6 || lx === 6 ? 3.5 : 2.2);
      }

      // Surrounding tracked vehicles in BEV space
      drawVehicle3D(ctx, { x: -4.0, z: 9.5 }, cam, { kind: "sedan", bboxLabel: "BEV CAR 9.5m", bboxColor: C.teal, frame });
      drawVehicle3D(ctx, { x: 4.1, z: -7.0 }, cam, { kind: "truck", bboxLabel: "BEV TRUCK 7.0m", bboxColor: C.amber, frame });
      drawVehicle3D(ctx, { x: 0, z: 0 }, cam, { kind: "ego", accent: C.cyan, frame });
      return;
    }

    // STAGE 3: FULL-1920x1080 ORBITING 3D ISOMETRIC OCCUPANCY VOXEL UNIVERSE!!
    ctx.fillStyle = "#020612";
    ctx.fillRect(0, 0, W, H);
    const local = frame - cOcc.from;
    const cx = W * 0.5;
    const cy = H * 0.62;
    const tileW = 46;
    const tileH = 23;
    const cubeH = 34;

    const iso = (gx: number, gy: number, gz: number) => ({
      x: cx + (gx - gy) * tileW,
      y: cy + (gx + gy) * tileH - gz * cubeH,
    });

    // Colossal glowing cyan BEV floor grid covering entire 1920x1080 screen
    ctx.strokeStyle = "rgba(0, 229, 255, 0.18)";
    ctx.lineWidth = 1.4;
    for (let i = -14; i <= 14; i++) {
      const a = iso(i, -14, 0);
      const b = iso(i, 14, 0);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      const c = iso(-14, i, 0);
      const d = iso(14, i, 0);
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.stroke();
    }

    const voxels: Array<{ x: number; y: number; z: number; top: string; left: string; right: string }> = [];

    // 1) Ego EV Voxel Cluster (glowing electric cyan)
    for (let x = -1; x <= 1; x++) {
      for (let y = 2; y <= 6; y++) {
        voxels.push({ x, y, z: 0, top: "#38bdf8", left: "#0284c7", right: "#0369a1" });
        if (y >= 3 && y <= 5) {
          voxels.push({ x, y, z: 1, top: "#67e8f9", left: "#06b6d4", right: "#0891b2" });
        }
      }
    }

    // 2) Dramatic Overturned Truck + Spilled Irregular Cargo Pile ahead! (blazing amber/crimson voxels!)
    const bob = Math.sin(local * 0.08) * 0.12;
    const irregular: Array<[number, number, number]> = [
      [-6, -4, 0], [-5, -4, 0], [-4, -4, 0], [-3, -4, 0], [-2, -4, 0], [-1, -3, 0],
      [-5, -3, 0], [-4, -3, 0], [-3, -3, 0], [-2, -3, 0],
      [-5, -4, 1], [-4, -4, 1], [-3, -4, 1], [-4, -3, 1], [-3, -3, 1],
      [-4, -4, 2], [-3, -4, 2], [-4, -3, 2],
      [0, -5, 0], [1, -5, 0], [2, -5, 0], [1, -5, 1], [3, -4, 0], [4, -4, 0], [3, -3, 0],
    ];
    for (const [vx, vy, vz] of irregular) {
      voxels.push({
        x: vx,
        y: vy,
        z: vz + bob,
        top: vz >= 2 ? "#ff2a5f" : vz >= 1 ? "#fb7185" : "#fbbf24",
        left: vz >= 2 ? "#be123c" : vz >= 1 ? "#e11d48" : "#d97706",
        right: vz >= 2 ? "#881337" : vz >= 1 ? "#9f1239" : "#b45309",
      });
    }

    // 3) Flanking Guardrails & Roadside Trees (violet & emerald voxels!)
    for (let y = -10; y <= 8; y += 2) {
      voxels.push({ x: 7, y, z: 0, top: "#c084fc", left: "#9333ea", right: "#6b21a8" });
      voxels.push({ x: -8, y, z: 0, top: "#c084fc", left: "#9333ea", right: "#6b21a8" });
    }
    for (const [tx, ty] of [[9, -6], [9, 2], [-10, -2]]) {
      voxels.push({ x: tx, y: ty, z: 0, top: "#92400e", left: "#78350f", right: "#451a03" });
      voxels.push({ x: tx, y: ty, z: 1, top: "#34d399", left: "#059669", right: "#047857" });
      voxels.push({ x: tx, y: ty, z: 2, top: "#6ee7b7", left: "#10b981", right: "#059669" });
    }

    voxels.sort((a, b) => a.x + a.y + a.z * 0.25 - (b.x + b.y + b.z * 0.25));

    for (const v of voxels) {
      const p = iso(v.x, v.y, v.z);
      ctx.fillStyle = v.top;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - cubeH);
      ctx.lineTo(p.x + tileW, p.y - cubeH + tileH);
      ctx.lineTo(p.x, p.y - cubeH + tileH * 2);
      ctx.lineTo(p.x - tileW, p.y - cubeH + tileH);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = v.left;
      ctx.beginPath();
      ctx.moveTo(p.x - tileW, p.y - cubeH + tileH);
      ctx.lineTo(p.x, p.y - cubeH + tileH * 2);
      ctx.lineTo(p.x, p.y + tileH * 2);
      ctx.lineTo(p.x - tileW, p.y + tileH);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = v.right;
      ctx.beginPath();
      ctx.moveTo(p.x + tileW, p.y - cubeH + tileH);
      ctx.lineTo(p.x, p.y - cubeH + tileH * 2);
      ctx.lineTo(p.x, p.y + tileH * 2);
      ctx.lineTo(p.x + tileW, p.y + tileH);
      ctx.closePath();
      ctx.fill();
    }

    // Colossal glowing cyan volumetric laser scan plane sweeping across the entire 3D voxel world!
    const scanY = 170 + ((local * 7.5) % 720);
    ctx.strokeStyle = C.cyan;
    ctx.lineWidth = 4;
    ctx.shadowColor = C.cyan;
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.moveTo(120, scanY);
    ctx.lineTo(W - 120, scanY);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [frame, stage, cShat.from, cBev.from, cOcc.from]);

  return (
    <CinemaStage
      badge={scene.badge}
      telemetry={["ERA 1.0 // HD MAP + RULES", "ALERT // MAP MISMATCH", "ERA 2.0 // BEV + TRANSFORMER", "OCCUPANCY // 3D VOXEL GRID"][stage]}
      accent={[C.cyan, C.crimson, C.teal, C.amber][stage]}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{ width: W, height: H }} />

      {stage === 0 && (
        <KineticSlam title="1.0 高精地图 + 白盒规则" sub="PRE-MAPPED LANES · DETERMINISTIC" accent={C.cyan} startFrame={cHd.from} holdFrames={140} y={84} size={74} />
      )}
      {stage === 1 && (
        <KineticSlam title="修路失效 · 规则天花板崩塌！" sub="EXPENSIVE MAPPING · IF-ELSE OVERFLOW" accent={C.crimson} startFrame={cShat.from} holdFrames={120} y={96} size={76} />
      )}
      {stage === 2 && (
        <KineticSlam title="2.0 BEV + Transformer · 边开边建图" sub="MAPLESS GOD'S-EYE VIEW // 全国都能开" accent={C.teal} startFrame={cBev.from} holdFrames={140} y={82} size={66} />
      )}
      {stage === 3 && (
        <>
          <KineticSlam title="占用网络 · 3D 体素专治异形障碍" sub="OCCUPANCY NETWORK // CLASS-AGNOSTIC" accent={C.amber} startFrame={cOcc.from} holdFrames={180} y={76} size={68} />
          <ArPin tx={860} ty={490} lx={1300} ly={340} label="侧翻货车 / 掉落纸箱" sub="UNKNOWN OBSTACLE VOXELIZED" accent={C.crimson} startFrame={cOcc.from + 20} />
        </>
      )}
    </CinemaStage>
  );
};
