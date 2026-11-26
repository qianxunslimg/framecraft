/**
 * Full-bleed 1920x1080 Real-Time Procedural 3D Projection, Shaded Vehicles,
 * Cyber-City Skyline, Volumetric Lighting & VFX Rendering Engine!
 */
import { C } from "./hud";

export const W = 1920;
export const H = 1080;
export const TAU = Math.PI * 2;

export function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function easeOutCubic(t: number): number {
  const u = clamp(t, 0, 1);
  return 1 - Math.pow(1 - u, 3);
}

export function easeInOutCubic(t: number): number {
  const u = clamp(t, 0, 1);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}

export interface Cam3D {
  x: number;
  y: number;
  z: number;
  yaw: number;   // radians
  pitch: number; // radians
  fov: number;   // focal length px (~950 for 1920w)
  cx?: number;
  cy?: number;
}

export interface ProjPt {
  sx: number;
  sy: number;
  depth: number;
  scale: number;
  visible: boolean;
}

export function project3D(wx: number, wy: number, wz: number, cam: Cam3D): ProjPt {
  const dx = wx - cam.x;
  const dy = wy - cam.y;
  const dz = wz - cam.z;

  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  const rx = dx * cy - dz * sy;
  const rz1 = dx * sy + dz * cy;

  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const ry = dy * cp - rz1 * sp;
  const rz = dy * sp + rz1 * cp;

  if (rz <= 0.4) {
    return { sx: -9999, sy: -9999, depth: rz, scale: 0, visible: false };
  }
  const scale = cam.fov / rz;
  const sx = (cam.cx ?? W * 0.5) + rx * scale;
  const syScreen = (cam.cy ?? H * 0.5) - ry * scale;
  return { sx, sy: syScreen, depth: rz, scale, visible: true };
}

export function drawPoly3D(
  ctx: CanvasRenderingContext2D,
  pts: Array<[number, number, number]>,
  cam: Cam3D,
  fill?: string,
  stroke?: string,
  lineWidth = 1.5,
) {
  const proj = pts.map(([x, y, z]) => project3D(x, y, z, cam));
  if (proj.some((p) => !p.visible)) return;
  ctx.beginPath();
  ctx.moveTo(proj[0].sx, proj[0].sy);
  for (let i = 1; i < proj.length; i++) ctx.lineTo(proj[i].sx, proj[i].sy);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

export function drawLine3D(
  ctx: CanvasRenderingContext2D,
  a: [number, number, number],
  b: [number, number, number],
  cam: Cam3D,
  stroke: string,
  width = 2,
) {
  const pa = project3D(a[0], a[1], a[2], cam);
  const pb = project3D(b[0], b[1], b[2], cam);
  if (!pa.visible || !pb.visible) return;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(pa.sx, pa.sy);
  ctx.lineTo(pb.sx, pb.sy);
  ctx.stroke();
}

/**
 * Draw atmospheric deep-space cyber horizon, starfield, 3D extruded skyscrapers,
 * rushing overhead neon highway gantries, wet specular road & speed particles.
 */
export function drawCyberHighwayWorld(
  ctx: CanvasRenderingContext2D,
  cam: Cam3D,
  frame: number,
  opts: {
    speed?: number;
    accent?: string;
    blueprint?: boolean;
    stormRain?: number;
    fogDensity?: number;
    sunrise?: number;
    showGantries?: boolean;
    showCity?: boolean;
  } = {},
) {
  const speed = opts.speed ?? 1.4;
  const accent = opts.accent ?? C.cyan;
  const blueprint = opts.blueprint ?? false;
  const stormRain = opts.stormRain ?? 0;
  const fogDensity = opts.fogDensity ?? 0;
  const sunrise = opts.sunrise ?? 0;
  const showGantries = opts.showGantries ?? true;
  const showCity = opts.showCity ?? true;

  // 1) Sky Gradient + Horizon Volumetric Glow
  const horizonPt = project3D(cam.x, 0, cam.z + 250, cam);
  const hy = clamp(horizonPt.visible ? horizonPt.sy : H * 0.44, 180, 740);

  const sky = ctx.createLinearGradient(0, 0, 0, hy + 80);
  if (sunrise > 0) {
    sky.addColorStop(0, "#040818");
    sky.addColorStop(0.55, "#0d1b3e");
    sky.addColorStop(0.85, "#1b3a5c");
    sky.addColorStop(1, "#ff9e5e55");
  } else if (blueprint) {
    sky.addColorStop(0, "#020a1c");
    sky.addColorStop(1, "#061f42");
  } else {
    sky.addColorStop(0, "#02050d");
    sky.addColorStop(0.65, "#060e22");
    sky.addColorStop(1, "#0c1c38");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Horizon volumetric nebula orb
  const orb = ctx.createRadialGradient(W * 0.5, hy, 10, W * 0.5, hy, 780);
  orb.addColorStop(0, sunrise > 0 ? "rgba(255, 168, 76, 0.42)" : `${accent}30`);
  orb.addColorStop(0.45, sunrise > 0 ? "rgba(0, 229, 255, 0.16)" : "rgba(59, 130, 246, 0.12)");
  orb.addColorStop(1, "transparent");
  ctx.fillStyle = orb;
  ctx.fillRect(0, 0, W, H);

  // Subtle crisp stars in upper sky
  ctx.fillStyle = "rgba(226, 232, 240, 0.55)";
  for (let i = 0; i < 75; i++) {
    const sx = hash(i * 17.3) * W;
    const sy = hash(i * 41.7) * (hy - 40);
    const sz = hash(i * 9.1) > 0.78 ? 2.2 : 1.2;
    ctx.globalAlpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(frame * 0.06 + i));
    ctx.fillRect(sx, sy, sz, sz);
  }
  ctx.globalAlpha = 1;

  // 2) Ground plane / distant wet reflective floor
  const gnd = ctx.createLinearGradient(0, hy, 0, H);
  gnd.addColorStop(0, blueprint ? "#041630" : "#070e1d");
  gnd.addColorStop(1, "#02050b");
  ctx.fillStyle = gnd;
  ctx.fillRect(0, hy, W, H - hy);

  // 3) 3D Extruded Cyber-City Skyscrapers on both flanks (back-to-front!)
  const scrollZ = frame * speed;
  if (showCity) {
    const bCount = 26;
    const spacing = 14;
    const maxZ = bCount * spacing;
    for (let i = bCount - 1; i >= 0; i--) {
      const baseZ = ((i * spacing - (scrollZ % spacing)) + maxZ) % maxZ;
      const wz = cam.z + 10 + baseZ;
      if (wz - cam.z > 240 || wz - cam.z < 5) continue;
      const fade = clamp(1 - (wz - cam.z) / 230, 0, 1);

      for (const side of [-1, 1]) {
        const seed = Math.floor((scrollZ + baseZ) / spacing) * 13 + (side > 0 ? 7 : 3);
        const bw = 6 + hash(seed) * 7;
        const bh = 14 + hash(seed + 1) * 34;
        const bx = side * (16 + hash(seed + 2) * 18);
        const bd = 7;

        const frontFill = blueprint
          ? `rgba(0, 180, 255, ${0.09 * fade})`
          : `rgba(8, 17, 36, ${0.92 * fade})`;
        const sideFill = blueprint
          ? `rgba(0, 120, 220, ${0.14 * fade})`
          : `rgba(13, 27, 56, ${0.92 * fade})`;
        const edgeStroke = blueprint
          ? `rgba(0, 229, 255, ${0.62 * fade})`
          : `rgba(0, 229, 255, ${0.18 * fade})`;

        // Front face
        drawPoly3D(
          ctx,
          [
            [bx - bw / 2, 0, wz],
            [bx + bw / 2, 0, wz],
            [bx + bw / 2, bh, wz],
            [bx - bw / 2, bh, wz],
          ],
          cam,
          frontFill,
          edgeStroke,
          1.2,
        );
        // Inner road-facing side wall
        const innerX = side > 0 ? bx - bw / 2 : bx + bw / 2;
        drawPoly3D(
          ctx,
          [
            [innerX, 0, wz],
            [innerX, 0, wz + bd],
            [innerX, bh, wz + bd],
            [innerX, bh, wz],
          ],
          cam,
          sideFill,
          edgeStroke,
          1.2,
        );

        // Glowing skyscraper neon roof strip & lit windows!
        const neonCol = hash(seed + 5) > 0.66 ? C.violet : hash(seed + 5) > 0.33 ? C.cyan : C.amber;
        drawLine3D(
          ctx,
          [innerX, bh, wz],
          [innerX, bh, wz + bd],
          cam,
          `${neonCol}${Math.round(fade * 190).toString(16).padStart(2, "0")}`,
          2.2,
        );
        if (!blueprint && wz - cam.z < 150) {
          for (let wy = 3; wy < bh - 2; wy += 3.8) {
            if (hash(seed * 11 + wy) > 0.45) {
              drawLine3D(
                ctx,
                [innerX, wy, wz + 0.8],
                [innerX, wy, wz + bd - 0.8],
                cam,
                `rgba(186, 230, 253, ${0.32 * fade})`,
                1.6,
              );
            }
          }
        }
      }
    }
  }

  // 4) 3D Multi-Lane Wet Asphalt Highway Deck
  const roadW = 11.4; // 4 wide lanes (-5.7 .. +5.7)
  const zNear = cam.z + 1.5;
  const zFar = cam.z + 230;
  drawPoly3D(
    ctx,
    [
      [-roadW / 2, 0, zNear],
      [roadW / 2, 0, zNear],
      [roadW / 2, 0, zFar],
      [-roadW / 2, 0, zFar],
    ],
    cam,
    blueprint ? "rgba(4, 26, 56, 0.88)" : "rgba(7, 13, 27, 0.94)",
  );

  // Subtle wet road grid lines in blueprint mode
  if (blueprint) {
    for (let k = 0; k < 32; k++) {
      const gz = cam.z + 2 + ((k * 7 - (scrollZ % 7) + 224) % 224);
      drawLine3D(ctx, [-roadW / 2, 0.02, gz], [roadW / 2, 0.02, gz], cam, "rgba(0, 229, 255, 0.22)", 1);
    }
  }

  // Glowing outer highway curb rails
  ctx.shadowColor = accent;
  ctx.shadowBlur = 16;
  drawLine3D(ctx, [-roadW / 2, 0.05, zNear], [-roadW / 2, 0.05, zFar], cam, accent, 3.5);
  drawLine3D(ctx, [roadW / 2, 0.05, zNear], [roadW / 2, 0.05, zFar], cam, accent, 3.5);
  ctx.shadowBlur = 0;

  // Dashed lane lines streaming rapidly
  const dashStep = 10;
  for (const lx of [-roadW / 6, roadW / 6]) {
    for (let d = 0; d < 24; d++) {
      const dz1 = cam.z + 2 + ((d * dashStep - (scrollZ % dashStep) + 240) % 240);
      const dz2 = dz1 + 4.2;
      if (dz1 > zFar) continue;
      const alpha = clamp(1 - (dz1 - cam.z) / 210, 0, 1) * 0.72;
      drawLine3D(ctx, [lx, 0.02, dz1], [lx, 0.02, dz2], cam, `rgba(148, 226, 255, ${alpha})`, 2.4);
    }
  }

  // 5) Overhead Glowing Neon Highway Arches / Gantries rushing past camera!
  if (showGantries) {
    const gStep = 34;
    for (let g = 6; g >= 0; g--) {
      const gz = cam.z + 6 + ((g * gStep - (scrollZ % gStep) + gStep * 7) % (gStep * 7));
      if (gz > zFar || gz < cam.z + 2) continue;
      const fade = clamp(1 - (gz - cam.z) / 210, 0, 1);
      const col = blueprint ? `rgba(0, 229, 255, ${0.55 * fade})` : `rgba(56, 189, 248, ${0.38 * fade})`;
      const gx = roadW / 2 + 1.2;
      const gh = 6.2;
      drawLine3D(ctx, [-gx, 0, gz], [-gx, gh, gz], cam, col, 3);
      drawLine3D(ctx, [gx, 0, gz], [gx, gh, gz], cam, col, 3);
      drawLine3D(ctx, [-gx, gh, gz], [gx, gh, gz], cam, col, 3.2);
      // Glowing overhead lamp bar
      drawLine3D(
        ctx,
        [-gx * 0.5, gh - 0.15, gz],
        [gx * 0.5, gh - 0.15, gz],
        cam,
        `rgba(255, 255, 255, ${0.55 * fade})`,
        2.5,
      );
    }
  }

  // 6) High-speed radial motion-streak particles
  if (speed > 0.5) {
    for (let i = 0; i < 28; i++) {
      const pz = cam.z + 4 + ((hash(i * 19) * 140 - scrollZ * 1.4) % 140 + 140) % 140;
      const px = (hash(i * 31) - 0.5) * 30;
      const py = 0.6 + hash(i * 47) * 8;
      if (Math.abs(px) < 4 && py < 2.2) continue;
      drawLine3D(ctx, [px, py, pz], [px, py, pz + 3.2], cam, `${accent}44`, 1.4);
    }
  }

  // 7) Optional pouring rain & atmospheric fog
  if (stormRain > 0) {
    ctx.strokeStyle = `rgba(186, 230, 253, ${0.36 * stormRain})`;
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 140; i++) {
      const rx = ((hash(i * 23) * W - frame * 11) % W + W) % W;
      const ry = ((hash(i * 43) * H + frame * 38) % H);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 14, ry + 42);
      ctx.stroke();
    }
  }
  if (fogDensity > 0) {
    const fg = ctx.createRadialGradient(W * 0.5, hy, 40, W * 0.5, hy, 980);
    fg.addColorStop(0, `rgba(226, 238, 255, ${0.82 * fogDensity})`);
    fg.addColorStop(0.5, `rgba(148, 175, 215, ${0.42 * fogDensity})`);
    fg.addColorStop(1, "transparent");
    ctx.fillStyle = fg;
    ctx.fillRect(0, 0, W, H);
  }
}

/**
 * Draw a true multi-polygon 3D shaded futuristic vehicle (EV sedan / heavy truck),
 * complete with wet asphalt reflection, volumetric headlight cones, LED light bars,
 * optional X-Ray wireframe core, and optional 3D projected AR bounding box!
 */
export function drawVehicle3D(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; z: number; yaw?: number },
  cam: Cam3D,
  opts: {
    kind?: "ego" | "sedan" | "truck";
    accent?: string;
    xray?: number; // 0 = sleek solid EV, 1 = full glowing internal wireframe chassis!
    headlights?: boolean;
    taillightTrail?: boolean;
    bboxLabel?: string;
    bboxColor?: string;
    wheelSteer?: number;
    brakeGlow?: boolean;
    rightBlinker?: boolean;
    frame?: number;
  } = {},
) {
  const kind = opts.kind ?? "ego";
  const accent = opts.accent ?? C.cyan;
  const xray = opts.xray ?? 0;
  const f = opts.frame ?? 0;
  const yaw = pos.yaw ?? 0;

  const w = kind === "truck" ? 2.55 : 2.05;
  const l = kind === "truck" ? 7.6 : 4.75;
  const bodyH = kind === "truck" ? 2.95 : 0.88;
  const cabH = kind === "truck" ? 3.2 : 1.48;

  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const pt = (lx: number, ly: number, lz: number): [number, number, number] => [
    pos.x + lx * cy + lz * sy,
    ly,
    pos.z - lx * sy + lz * cy,
  ];

  // 1) Wet asphalt soft underbody glow + reflection
  const centerP = project3D(pos.x, 0.05, pos.z, cam);
  if (!centerP.visible) return;
  const rad = Math.max(24, centerP.scale * (kind === "truck" ? 2.8 : 2.2));
  const glow = ctx.createRadialGradient(centerP.sx, centerP.sy, 4, centerP.sx, centerP.sy, rad);
  glow.addColorStop(0, kind === "ego" ? `${accent}48` : "rgba(255, 42, 95, 0.25)");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(centerP.sx, centerP.sy + 4, rad * 1.15, rad * 0.42, 0, 0, TAU);
  ctx.fill();

  // 2) Volumetric Headlight Cones on Wet Road
  if (opts.headlights) {
    for (const side of [-0.68, 0.68]) {
      drawPoly3D(
        ctx,
        [
          pt(side - 0.15, 0.08, l / 2),
          pt(side + 0.15, 0.08, l / 2),
          pt(side + 2.4, 0.08, l / 2 + 18),
          pt(side - 2.4, 0.08, l / 2 + 18),
        ],
        cam,
        "rgba(186, 240, 255, 0.13)",
      );
    }
  }

  // 3) Glowing Taillight Light-Trails on fast moving cars
  if (opts.taillightTrail) {
    const trailCol = kind === "ego" ? "rgba(255, 42, 95, 0.26)" : "rgba(255, 42, 95, 0.18)";
    for (const side of [-w * 0.38, w * 0.38]) {
      drawPoly3D(
        ctx,
        [
          pt(side - 0.08, 0.55, -l / 2),
          pt(side + 0.08, 0.55, -l / 2),
          pt(side + 0.04, 0.45, -l / 2 - 7.5),
          pt(side - 0.04, 0.45, -l / 2 - 7.5),
        ],
        cam,
        trailCol,
      );
    }
  }

  // 4) 3D Vehicle Body Polygons (solid or translucent X-Ray!)
  const bodyAlpha = 1 - xray * 0.78;
  const sideColor =
    kind === "truck"
      ? `rgba(26, 38, 62, ${bodyAlpha})`
      : kind === "ego"
        ? `rgba(11, 24, 48, ${bodyAlpha})`
        : `rgba(19, 31, 56, ${bodyAlpha})`;
  const topColor =
    kind === "truck"
      ? `rgba(38, 55, 86, ${bodyAlpha})`
      : kind === "ego"
        ? `rgba(18, 42, 78, ${bodyAlpha})`
        : `rgba(29, 45, 76, ${bodyAlpha})`;
  const rearColor =
    kind === "truck"
      ? `rgba(20, 30, 50, ${bodyAlpha})`
      : `rgba(8, 17, 36, ${bodyAlpha})`;
  const wireCol = xray > 0.2 ? accent : kind === "ego" ? `${accent}bb` : "rgba(148, 163, 184, 0.55)";
  const wireW = xray > 0.2 ? 2.2 : 1.4;

  const y0 = 0.28;
  const hw = w / 2;
  const hl = l / 2;

  // Determine visible side wall relative to camera
  const leftSide = cam.x < pos.x;
  const sxWall = leftSide ? -hw : hw;

  // Side lower hull
  drawPoly3D(
    ctx,
    [pt(sxWall, y0, -hl), pt(sxWall, y0, hl), pt(sxWall, bodyH, hl), pt(sxWall, bodyH, -hl)],
    cam,
    sideColor,
    wireCol,
    wireW,
  );
  // Roof / Top deck
  drawPoly3D(
    ctx,
    [pt(-hw, bodyH, -hl), pt(hw, bodyH, -hl), pt(hw, bodyH, hl), pt(-hw, bodyH, hl)],
    cam,
    topColor,
    wireCol,
    wireW,
  );
  // Rear bumper face
  drawPoly3D(
    ctx,
    [pt(-hw, y0, -hl), pt(hw, y0, -hl), pt(hw, bodyH, -hl), pt(-hw, bodyH, -hl)],
    cam,
    rearColor,
    wireCol,
    wireW,
  );

  // Sleek aerodynamic glass cabin (sedans / ego)
  if (kind !== "truck") {
    const cw = hw * 0.80;
    const czBack = -hl * 0.52;
    const czFront = hl * 0.34;
    const glassFill = xray > 0.3 ? "rgba(0, 229, 255, 0.14)" : "rgba(6, 20, 44, 0.88)";
    // Side cabin glass
    drawPoly3D(
      ctx,
      [
        pt(leftSide ? -hw * 0.92 : hw * 0.92, bodyH, czBack - 0.45),
        pt(leftSide ? -hw * 0.92 : hw * 0.92, bodyH, czFront + 0.55),
        pt(leftSide ? -cw : cw, cabH, czFront),
        pt(leftSide ? -cw : cw, cabH, czBack),
      ],
      cam,
      glassFill,
      wireCol,
      wireW,
    );
    // Rear sloped glass
    drawPoly3D(
      ctx,
      [
        pt(-hw * 0.92, bodyH, czBack - 0.45),
        pt(hw * 0.92, bodyH, czBack - 0.45),
        pt(cw, cabH, czBack),
        pt(-cw, cabH, czBack),
      ],
      cam,
      glassFill,
      wireCol,
      wireW,
    );
    // Cabin roof glass
    drawPoly3D(
      ctx,
      [pt(-cw, cabH, czBack), pt(cw, cabH, czBack), pt(cw, cabH, czFront), pt(-cw, cabH, czFront)],
      cam,
      topColor,
      wireCol,
      wireW,
    );
    // Roof LiDAR turret on ego vehicle
    if (kind === "ego") {
      const turretP = project3D(...pt(0, cabH + 0.14, 0.15), cam);
      if (turretP.visible) {
        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.ellipse(turretP.sx, turretP.sy, Math.max(5, turretP.scale * 0.22), Math.max(3, turretP.scale * 0.1), 0, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  // 5) Glowing Full-Width LED Tail-Light Bar + Optional Right Turn Blinker
  ctx.shadowColor = C.crimson;
  ctx.shadowBlur = 16;
  drawLine3D(
    ctx,
    pt(-hw * 0.84, kind === "truck" ? 0.85 : 0.66, -hl - 0.02),
    pt(hw * 0.84, kind === "truck" ? 0.85 : 0.66, -hl - 0.02),
    cam,
    C.crimson,
    kind === "ego" ? 5 : 3.5,
  );
  ctx.shadowBlur = 0;

  if (opts.rightBlinker && Math.floor(f / 8) % 2 === 0) {
    ctx.shadowColor = C.amber;
    ctx.shadowBlur = 22;
    drawLine3D(ctx, pt(hw * 0.45, 0.66, -hl - 0.04), pt(hw * 0.92, 0.66, -hl - 0.04), cam, C.amber, 7);
    ctx.shadowBlur = 0;
  }

  // 6) Internal X-Ray Drive-by-Wire Harness, Central Neural Core & Glowing Wheels!
  if (xray > 0.15) {
    const corePos = pt(0, 0.65, 0.1);
    const wheels: Array<[number, number, number]> = [
      pt(-hw * 0.95, 0.34, hl * 0.62),
      pt(hw * 0.95, 0.34, hl * 0.62),
      pt(-hw * 0.95, 0.34, -hl * 0.62),
      pt(hw * 0.95, 0.34, -hl * 0.62),
    ];
    // Glowing internal drive-by-wire conduits from neural core to every wheel!
    for (let wi = 0; wi < wheels.length; wi++) {
      const wp = wheels[wi];
      drawLine3D(ctx, corePos, wp, cam, `${C.cyan}cc`, 2.5);
      // Animated travelling electric voltage pulse packet along each conduit!
      const tP = ((f * 0.065 + wi * 0.25) % 1);
      const px = corePos[0] + (wp[0] - corePos[0]) * tP;
      const py = corePos[1] + (wp[1] - corePos[1]) * tP;
      const pz = corePos[2] + (wp[2] - corePos[2]) * tP;
      const pp = project3D(px, py, pz, cam);
      if (pp.visible) {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = C.cyan;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(pp.sx, pp.sy, 5, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      // Glowing wheel hub / brake caliper ring
      const wProj = project3D(wp[0], wp[1], wp[2], cam);
      if (wProj.visible) {
        const wr = Math.max(8, wProj.scale * 0.34);
        ctx.strokeStyle = opts.brakeGlow && wi < 2 ? C.crimson : C.emerald;
        ctx.lineWidth = 3;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.ellipse(wProj.sx, wProj.sy, wr * 0.68, wr, (opts.wheelSteer ?? 0) * (wi < 2 ? 0.5 : 0), 0, TAU);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
    // Glowing central compute SoC core
    const cProj = project3D(corePos[0], corePos[1], corePos[2], cam);
    if (cProj.visible) {
      const pulse = 1 + 0.2 * Math.sin(f * 0.25);
      ctx.fillStyle = C.violet;
      ctx.shadowColor = C.violet;
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(cProj.sx, cProj.sy, Math.max(10, cProj.scale * 0.24) * pulse, 0, TAU);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // 7) Optional 3D Projected AR Bounding Box & Floating Distance Tag
  if (opts.bboxLabel) {
    const bc = opts.bboxColor ?? C.cyan;
    const bh = kind === "truck" ? 3.2 : 1.65;
    const corners: Array<[number, number, number]> = [
      pt(-hw - 0.15, 0.1, -hl - 0.15),
      pt(hw + 0.15, 0.1, -hl - 0.15),
      pt(hw + 0.15, 0.1, hl + 0.15),
      pt(-hw - 0.15, 0.1, hl + 0.15),
      pt(-hw - 0.15, bh, -hl - 0.15),
      pt(hw + 0.15, bh, -hl - 0.15),
      pt(hw + 0.15, bh, hl + 0.15),
      pt(-hw - 0.15, bh, hl + 0.15),
    ];
    const edges: Array<[number, number]> = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    for (const [a, b] of edges) {
      drawLine3D(ctx, corners[a], corners[b], cam, bc, 1.8);
    }
    const topP = project3D(pos.x, bh + 0.45, pos.z, cam);
    if (topP.visible) {
      ctx.font = "bold 15px monospace";
      const tw = ctx.measureText(opts.bboxLabel).width + 18;
      ctx.fillStyle = "rgba(3, 8, 20, 0.85)";
      ctx.fillRect(topP.sx - tw / 2, topP.sy - 20, tw, 24);
      ctx.strokeStyle = bc;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(topP.sx - tw / 2, topP.sy - 20, tw, 24);
      ctx.fillStyle = bc;
      ctx.textAlign = "center";
      ctx.fillText(opts.bboxLabel, topP.sx, topP.sy - 3);
      ctx.textAlign = "left";
    }
  }
}

/**
 * Tesla FSD / Waymo style volumetric curved 3D driving trajectory ribbon on the road.
 */
export function drawFsdRibbon3D(
  ctx: CanvasRenderingContext2D,
  pts: Array<{ x: number; z: number }>,
  cam: Cam3D,
  color = C.emerald,
  halfW = 0.88,
  frame = 0,
) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const fade = 1 - i / pts.length;
    drawPoly3D(
      ctx,
      [
        [a.x - halfW, 0.08, a.z],
        [a.x + halfW, 0.08, a.z],
        [b.x + halfW, 0.08, b.z],
        [b.x - halfW, 0.08, b.z],
      ],
      cam,
      `${color}${Math.round(fade * 88).toString(16).padStart(2, "0")}`,
    );
    drawLine3D(
      ctx,
      [a.x - halfW, 0.09, a.z],
      [b.x - halfW, 0.09, b.z],
      cam,
      `${color}${Math.round(fade * 230).toString(16).padStart(2, "0")}`,
      2.6,
    );
    drawLine3D(
      ctx,
      [a.x + halfW, 0.09, a.z],
      [b.x + halfW, 0.09, b.z],
      cam,
      `${color}${Math.round(fade * 230).toString(16).padStart(2, "0")}`,
      2.6,
    );
    // Animated flowing chevron pulse forward along path
    if ((i - Math.floor(frame * 0.45)) % 4 === 0) {
      drawLine3D(ctx, [a.x - halfW * 0.65, 0.1, a.z], [a.x, 0.1, a.z + 1.2], cam, "#ffffffaa", 2.2);
      drawLine3D(ctx, [a.x + halfW * 0.65, 0.1, a.z], [a.x, 0.1, a.z + 1.2], cam, "#ffffffaa", 2.2);
    }
  }
}
