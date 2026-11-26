/**
 * Real-Time Articulated Robotics Kinematics, X-Ray Skeleton & Forensic Lab Canvas Engine.
 * Analytical 2-link IK solver + metallic servo rendering + VR/Gamepad/ALOHA rigs + physics props.
 */

export interface Pt {
  x: number;
  y: number;
}

export function hexRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/**
 * Exact 2-link analytical Inverse Kinematics solver.
 */
export function solveIK2D(
  shoulder: Pt,
  target: Pt,
  l1: number,
  l2: number,
  flip = 1,
): { elbow: Pt; wrist: Pt; theta1: number; theta2: number } {
  const dx = target.x - shoulder.x;
  const dy = target.y - shoulder.y;
  const rawDist = Math.hypot(dx, dy);
  const maxReach = l1 + l2 - 2;
  const minReach = Math.abs(l1 - l2) + 4;
  const d = Math.max(minReach, Math.min(maxReach, rawDist));

  const baseAngle = Math.atan2(dy, dx);
  const cosA = Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  const angleA = Math.acos(cosA);
  const theta1 = baseAngle + flip * angleA;

  const elbow: Pt = {
    x: shoulder.x + Math.cos(theta1) * l1,
    y: shoulder.y + Math.sin(theta1) * l1,
  };
  const wrist: Pt = {
    x: shoulder.x + Math.cos(baseAngle) * d,
    y: shoulder.y + Math.sin(baseAngle) * d,
  };
  const theta2 = Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x);
  return { elbow, wrist, theta1, theta2 };
}

/**
 * High-craft brushed-titanium servo link segment with specular highlight & piston line.
 */
export function drawMechanicalLink(
  ctx: CanvasRenderingContext2D,
  a: Pt,
  b: Pt,
  thickness: number,
  accent: string,
  xray = false,
) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const len = Math.hypot(b.x - a.x, b.y - a.y);

  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(ang);

  // Outer shadow / volumetric glow
  ctx.shadowColor = hexRgba(accent, xray ? 0.65 : 0.35);
  ctx.shadowBlur = xray ? 18 : 10;

  // Tapered metallic arm housing
  const r0 = thickness * 0.52;
  const r1 = thickness * 0.40;
  ctx.beginPath();
  ctx.moveTo(0, -r0);
  ctx.lineTo(len, -r1);
  ctx.arc(len, 0, r1, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(0, r0);
  ctx.arc(0, 0, r0, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();

  if (xray) {
    ctx.fillStyle = hexRgba(accent, 0.14);
    ctx.fill();
    ctx.strokeStyle = hexRgba(accent, 0.9);
    ctx.lineWidth = 2.0;
    ctx.stroke();
    // Internal hydraulic actuator rod & encoder wire
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(len - 10, 0);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.2;
    ctx.stroke();
  } else {
    const grad = ctx.createLinearGradient(0, -r0, 0, r0);
    grad.addColorStop(0, "#334155");
    grad.addColorStop(0.35, "#1e293b");
    grad.addColorStop(0.8, "#0f172a");
    grad.addColorStop(1, "#020617");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = hexRgba(accent, 0.65);
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Glowing cyan/accent energy strip along link spine
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(len - 12, 0);
    ctx.strokeStyle = hexRgba(accent, 0.8);
    ctx.lineWidth = 2.6;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Precision robotic rotary servo joint with encoder tick rings.
 */
export function drawServoJoint(
  ctx: CanvasRenderingContext2D,
  p: Pt,
  radius: number,
  accent: string,
  angle = 0,
  xray = false,
) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.shadowColor = accent;
  ctx.shadowBlur = xray ? 18 : 10;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = xray ? hexRgba(accent, 0.18) : "#0b1324";
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Encoder ticks rotating with joint angle
  ctx.rotate(angle);
  ctx.strokeStyle = hexRgba("#ffffff", 0.72);
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (radius * 0.45), Math.sin(a) * (radius * 0.45));
    ctx.lineTo(Math.cos(a) * (radius * 0.82), Math.sin(a) * (radius * 0.82));
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.34, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
}

/**
 * Full 2-Link Articulated Robotic Arm with animated parallel/dexterous gripper & optional wrist camera cone.
 */
export function drawRobotArm(
  ctx: CanvasRenderingContext2D,
  shoulder: Pt,
  target: Pt,
  opts: {
    l1: number;
    l2: number;
    flip?: number;
    thickness?: number;
    accent: string;
    grip?: number; // 0 = open, 1 = closed
    xray?: boolean;
    wristCam?: boolean;
    wristAngle?: number;
  },
) {
  const {
    l1,
    l2,
    flip = 1,
    thickness = 26,
    accent,
    grip = 0.25,
    xray = false,
    wristCam = false,
    wristAngle,
  } = opts;

  const { elbow, wrist, theta1, theta2 } = solveIK2D(shoulder, target, l1, l2, flip);
  const handAng = wristAngle ?? theta2;

  // Optional glowing stereo vision cone mounted on wrist
  if (wristCam) {
    ctx.save();
    ctx.translate(wrist.x, wrist.y);
    ctx.rotate(handAng);
    const cone = ctx.createLinearGradient(0, 0, 175, 0);
    cone.addColorStop(0, hexRgba(accent, 0.36));
    cone.addColorStop(1, "transparent");
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(185, -72);
    ctx.lineTo(185, 72);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawMechanicalLink(ctx, shoulder, elbow, thickness, accent, xray);
  drawMechanicalLink(ctx, elbow, wrist, thickness * 0.82, accent, xray);
  drawServoJoint(ctx, shoulder, thickness * 0.62, accent, theta1, xray);
  drawServoJoint(ctx, elbow, thickness * 0.50, accent, theta2, xray);
  drawServoJoint(ctx, wrist, thickness * 0.38, accent, handAng, xray);

  // Articulated pincer / dexterous gripper (scaled proportionally to arm thickness!)
  const gs = thickness / 26;
  ctx.save();
  ctx.translate(wrist.x, wrist.y);
  ctx.rotate(handAng);
  const spread = (22 - grip * 14) * gs;
  ctx.strokeStyle = accent;
  ctx.lineWidth = Math.max(1.8, 4.0 * gs);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(7 * gs, -5 * gs);
  ctx.lineTo(22 * gs, -spread);
  ctx.lineTo(40 * gs, -spread * 0.55);
  ctx.moveTo(7 * gs, 5 * gs);
  ctx.lineTo(22 * gs, spread);
  ctx.lineTo(40 * gs, spread * 0.55);
  ctx.stroke();
  ctx.restore();

  return { elbow, wrist, theta1, theta2 };
}

/**
 * Sleek High-Craft Humanoid Robot with live articulated IK arms, visor, reactor core & X-ray overlay.
 */
export function drawHumanoidRobot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  opts: {
    leftTarget: Pt;
    rightTarget: Pt;
    leftGrip?: number;
    rightGrip?: number;
    headTilt?: number;
    bodySway?: number;
    accent: string;
    legAccent?: string;
    armAccent?: string;
    xray?: boolean;
    frame: number;
  },
) {
  const {
    leftTarget,
    rightTarget,
    leftGrip = 0.2,
    rightGrip = 0.2,
    headTilt = 0,
    bodySway = 0,
    accent,
    legAccent,
    armAccent,
    xray = false,
    frame,
  } = opts;

  const legCol = legAccent ?? accent;
  const armCol = armAccent ?? accent;
  const sx = cx + bodySway;

  // Pelvis & Articulated Legs (natural athletic stance — knees bend slightly outward, never knock-kneed!)
  const hipL = { x: sx - 28 * scale, y: cy + 56 * scale };
  const hipR = { x: sx + 28 * scale, y: cy + 56 * scale };
  const footL = { x: cx - 44 * scale, y: cy + 202 * scale };
  const footR = { x: cx + 44 * scale, y: cy + 202 * scale };
  const legL = solveIK2D(hipL, footL, 76 * scale, 76 * scale, 1);
  const legR = solveIK2D(hipR, footR, 76 * scale, 76 * scale, -1);

  drawMechanicalLink(ctx, hipL, legL.elbow, 22 * scale, legCol, xray);
  drawMechanicalLink(ctx, legL.elbow, legL.wrist, 18 * scale, legCol, xray);
  drawMechanicalLink(ctx, hipR, legR.elbow, 22 * scale, legCol, xray);
  drawMechanicalLink(ctx, legR.elbow, legR.wrist, 18 * scale, legCol, xray);
  drawServoJoint(ctx, legL.elbow, 11 * scale, legCol, legL.theta2, xray);
  drawServoJoint(ctx, legR.elbow, 11 * scale, legCol, legR.theta2, xray);

  // Feet pads
  for (const ft of [legL.wrist, legR.wrist]) {
    ctx.save();
    ctx.fillStyle = xray ? hexRgba(legCol, 0.2) : "#1e293b";
    ctx.strokeStyle = legCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(ft.x - 22 * scale, ft.y - 4 * scale, 44 * scale, 14 * scale, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Sculpted Cyber Torso Chassis
  ctx.save();
  ctx.translate(sx, cy);
  ctx.shadowColor = accent;
  ctx.shadowBlur = xray ? 24 : 14;
  ctx.beginPath();
  ctx.moveTo(-58 * scale, -64 * scale);
  ctx.lineTo(58 * scale, -64 * scale);
  ctx.lineTo(40 * scale, 60 * scale);
  ctx.lineTo(-40 * scale, 60 * scale);
  ctx.closePath();
  if (xray) {
    ctx.fillStyle = hexRgba(accent, 0.12);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.4;
    ctx.stroke();
  } else {
    const tg = ctx.createLinearGradient(0, -64 * scale, 0, 60 * scale);
    tg.addColorStop(0, "#1e293b");
    tg.addColorStop(1, "#090f1d");
    ctx.fillStyle = tg;
    ctx.fill();
    ctx.strokeStyle = hexRgba(accent, 0.78);
    ctx.lineWidth = 2.2;
    ctx.stroke();
  }

  // Chest Compute Core Reactor Pulse
  const pulse = 0.72 + 0.28 * Math.sin(frame * 0.14);
  ctx.beginPath();
  ctx.arc(0, -14 * scale, 18 * scale, 0, Math.PI * 2);
  ctx.fillStyle = hexRgba(accent, 0.35 * pulse);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -14 * scale, 7 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  // Head & Stereo Camera Visor
  ctx.save();
  ctx.translate(sx, cy - 96 * scale);
  ctx.rotate(headTilt);
  ctx.fillStyle = xray ? hexRgba(accent, 0.15) : "#0f172a";
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.roundRect(-34 * scale, -28 * scale, 68 * scale, 52 * scale, 18 * scale);
  ctx.fill();
  ctx.stroke();
  // Glowing Stereo Optic Strip
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.roundRect(-24 * scale, -9 * scale, 48 * scale, 12 * scale, 6 * scale);
  ctx.fill();
  ctx.restore();

  // Articulated Dual IK Arms
  const shL = { x: sx - 58 * scale, y: cy - 48 * scale };
  const shR = { x: sx + 58 * scale, y: cy - 48 * scale };
  drawRobotArm(ctx, shL, leftTarget, {
    l1: 86 * scale,
    l2: 80 * scale,
    flip: -1,
    thickness: 20 * scale,
    accent: armCol,
    grip: leftGrip,
    xray,
  });
  drawRobotArm(ctx, shR, rightTarget, {
    l1: 86 * scale,
    l2: 80 * scale,
    flip: 1,
    thickness: 20 * scale,
    accent: armCol,
    grip: rightGrip,
    xray,
  });
}

/**
 * Animated Xbox/PS Style Gamepad emitting RF radio packets.
 */
export function drawGamepad(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  stickL: Pt,
  stickR: Pt,
  btnFlash: boolean,
  accent: string,
  frame: number,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Emitting RF Waves from top edge
  for (let i = 0; i < 3; i++) {
    const p = ((frame * 0.04 + i / 3) % 1 + 1) % 1;
    ctx.beginPath();
    ctx.arc(0, -68, 22 + p * 85, -Math.PI * 0.78, -Math.PI * 0.22);
    ctx.strokeStyle = hexRgba(accent, (1 - p) * 0.85);
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Ergonomic controller body
  ctx.shadowColor = accent;
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#0e172a";
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(-105, -55);
  ctx.lineTo(105, -55);
  ctx.quadraticCurveTo(155, -55, 165, 25);
  ctx.quadraticCurveTo(170, 92, 122, 92);
  ctx.quadraticCurveTo(86, 92, 62, 34);
  ctx.lineTo(-62, 34);
  ctx.quadraticCurveTo(-86, 92, -122, 92);
  ctx.quadraticCurveTo(-170, 92, -165, 25);
  ctx.quadraticCurveTo(-155, -55, -105, -55);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Left & Right Analog Sticks tilting live
  const sticks = [
    { bx: -72, by: -8, v: stickL },
    { bx: 52, by: 16, v: stickR },
  ];
  for (const s of sticks) {
    ctx.beginPath();
    ctx.arc(s.bx, s.by, 24, 0, Math.PI * 2);
    ctx.fillStyle = "#020617";
    ctx.fill();
    ctx.strokeStyle = hexRgba(accent, 0.55);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(s.bx + s.v.x * 11, s.by + s.v.y * 11, 14, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
  }

  // ABXY Buttons flashing on macro trigger
  const btns = [
    { x: 102, y: -24, col: "#ffb800", active: false },
    { x: 124, y: -4, col: "#ff2a5f", active: btnFlash },
    { x: 102, y: 16, col: "#00ff9d", active: !btnFlash },
    { x: 80, y: -4, col: "#00f0ff", active: false },
  ];
  for (const b of btns) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = b.active ? b.col : hexRgba(b.col, 0.28);
    ctx.fill();
    ctx.strokeStyle = b.col;
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Stylized Physical Coffee Mug with optional AI Vision Target Lock Reticle.
 */
export function drawCoffeeMug(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  accent: string,
  locked: boolean,
  frame: number,
) {
  ctx.save();
  ctx.translate(x, y);

  // Steam wisps
  ctx.strokeStyle = hexRgba("#ffffff", 0.35);
  ctx.lineWidth = 2.2;
  for (let i = -1; i <= 1; i++) {
    const wave = Math.sin(frame * 0.1 + i * 1.4) * 5;
    ctx.beginPath();
    ctx.moveTo(i * 11, -34);
    ctx.quadraticCurveTo(i * 11 + wave, -50, i * 11 - wave, -64);
    ctx.stroke();
  }

  // Mug handle
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(24, 0, 14, -Math.PI * 0.45, Math.PI * 0.45);
  ctx.stroke();

  // Mug cylinder
  const mg = ctx.createLinearGradient(-24, 0, 24, 0);
  mg.addColorStop(0, "#1e293b");
  mg.addColorStop(0.5, "#334155");
  mg.addColorStop(1, "#0f172a");
  ctx.fillStyle = mg;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.roundRect(-24, -28, 48, 56, 8);
  ctx.fill();
  ctx.stroke();

  // AI Stereo Vision Lock Reticle
  if (locked) {
    const s = 40 + Math.sin(frame * 0.2) * 3;
    ctx.strokeStyle = "#00ff9d";
    ctx.lineWidth = 2.4;
    const c = 12;
    ctx.beginPath();
    ctx.moveTo(-s, -s + c); ctx.lineTo(-s, -s); ctx.lineTo(-s + c, -s);
    ctx.moveTo(s - c, -s); ctx.lineTo(s, -s); ctx.lineTo(s, -s + c);
    ctx.moveTo(s, s - c); ctx.lineTo(s, s); ctx.lineTo(s - c, s);
    ctx.moveTo(-s + c, s); ctx.lineTo(-s, s); ctx.lineTo(-s, s - c);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Forensic Wall Clock + Physics Bouncing Ball to visually expose 4x speedup vs 1x real speed!
 */
export function drawSpeedProofWidget(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  speedMult: number,
  frame: number,
  accent: string,
) {
  const tSec = (frame / 30) * speedMult;

  // Analog Wall Clock
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(6, 12, 26, 0.9)";
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.6;
  ctx.stroke();

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 34, Math.sin(a) * 34);
    ctx.lineTo(Math.cos(a) * 40, Math.sin(a) * 40);
    ctx.strokeStyle = hexRgba("#ffffff", 0.55);
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }
  const secAng = (tSec / 60) * Math.PI * 2 * 10 - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(secAng) * 33, Math.sin(secAng) * 33);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();

  // Bouncing Gravity Ball next to clock (free-fall parabola exposes video speed immediately!)
  const bouncePhase = (tSec * 1.1) % 1;
  const height = 4 * bouncePhase * (1 - bouncePhase); // exact gravity parabola
  const bx = cx + 82;
  const floorY = cy + 38;
  const by = floorY - height * 68;
  ctx.save();
  ctx.strokeStyle = hexRgba(accent, 0.4);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx - 18, floorY + 8);
  ctx.lineTo(bx + 18, floorY + 8);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(bx, by, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
