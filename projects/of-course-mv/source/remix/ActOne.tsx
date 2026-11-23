import { CanvasShot, type Painter } from "./CanvasShot";
import {
  P,
  sat,
  mix,
  ease,
  enter,
  bounce,
  local,
  background,
  text,
  type3,
  line,
  polygon,
  disk,
  ring,
  round,
  star,
  ball,
  burst,
  curvedText,
  project,
  arrow,
  trail,
  face,
} from "./draw";

const impact: Painter = (c, f, bass) => {
  background(c, P.paper, true);
  const shift = ease((f - 31) / 17);
  const zoom = mix(1, 0.78, shift);
  local(c, 540, 890 - shift * 580, Math.sin(f * 0.04) * 0.035, zoom, () => {
    const chars = [..."当然可以"];
    const cues = [-3, 9, 22, 27];
    chars.forEach((s, i) => {
      const p = bounce(f, cues[i]);
      if (p <= 0) return;
      local(
        c,
        (i % 2 ? 230 : -230) * p,
        (i < 2 ? -215 : 215) * p,
        Math.max(0, 1 - p) * (i % 2 ? 1 : -1) * 1.4,
        1,
        () => {
          c.scale(1 + (1 - p) * 1.4, p);
          type3(
            c,
            s,
            0,
            0,
            400,
            i === 3 ? P.blue : P.ink,
            14,
            0,
            i === 3 ? P.ink : P.gray,
          );
        },
      );
    });
  });
  if (f >= 31) {
    const z = mix(3.8, 1, enter(f, 31, 17));
    local(
      c,
      540,
      1110 + Math.sin(f * 0.075) * 25,
      -0.09 + enter(f, 31) * 0.035,
      z,
      () => {
        [..."好问题"].forEach((s, i) => {
          const p = bounce(f, [31, 42, 52][i]);
          if (p > 0)
            local(c, (i - 1) * 302, mix(350, 0, p), mix(-0.8, 0, p), p, () =>
              type3(c, s, 0, 0, 300, P.blue, 18, 0, P.ink),
            );
        });
      },
    );
  }
  const path = (t: number) => ({
    x: -140 + (t - 51) * 43,
    y: 1540 - 330 * Math.sin(sat((t - 51) / 42) * Math.PI),
  });
  if (f > 51) {
    trail(c, f, path, P.blue, 48, 17);
    const p = path(f);
    ball(c, p.x, p.y, 50 + Math.sin(f * 0.21) * 6, P.blue);
  }
  burst(c, f, 31, 540, 730, P.blue, 24);
  burst(c, f, 54, 824, 1120, P.coral, 13);
  if (f < 31) {
    face(
      c,
      800,
      1520 + Math.sin(f * 0.15) * 45,
      95,
      P.lime,
      "happy",
      Math.sin(f * 0.13) * 0.18,
    );
    text(c, "?", 960, 1390, 90, P.blue, 0.2);
    star(c, 900, 332, 46 + bass * 20, P.blue, f * 0.045);
    line(
      c,
      [
        { x: 95, y: 1430 },
        { x: 990, y: 1430 },
      ],
      P.ink,
      3,
    );
    text(c, "!", 156, 1540, 170, P.blue, -0.15);
  }
  if (f > 75) {
    const s = ease((f - 75) / 20);
    local(c, 540, 1600 - s * 500, -s * 0.12, 1, () => {
      round(c, -290, -68, 580, 136, 68, P.lime, P.ink, 3);
      text(c, "✓  当然可以", 0, 0, 58);
    });
  }
};

const machine: Painter = (c, f, bass) => {
  background(c, P.blue);
  const push = ease((f - 51) / 19);
  const rz = -0.3 + Math.sin(f * 0.036) * 0.08;
  for (let i = 0; i < 15; i++) {
    const y = 100 + i * 137 - ((f * 5) % 137);
    line(
      c,
      [
        { x: 0, y },
        { x: 1080, y },
      ],
      "#ffffff19",
      2,
    );
  }
  const chars = [..."当然可以好问题"];
  const cues = [0, 18, 23, 27, 33, 44, 54];
  const camScale = 1 + push * 1.9;
  local(c, 540, 960, 0, camScale, () => {
    c.translate(-540, -960);
    const keys = chars.map((s, i) => {
      const x = i < 4 ? (i - 1.5) * 228 : (i - 5) * 253;
      const y = i < 4 ? -200 : 150;
      const hit = Math.max(0, 1 - (f - cues[i]) / 11);
      const press =
        f >= cues[i] ? Math.sin(sat((f - cues[i]) / 11) * Math.PI) * 73 : 0;
      return { s, i, x, y, z: -75 - press, hit: f >= cues[i] ? hit : 0 };
    });
    keys.forEach((k) => {
      const pts = [
        [-99, -99],
        [99, -99],
        [99, 99],
        [-99, 99],
      ].map(([x, y]) => project(k.x + x, k.y + y, k.z, 0.64, 0.05, rz));
      const bot = [
        [-99, -99],
        [99, -99],
        [99, 99],
        [-99, 99],
      ].map(([x, y]) => project(k.x + x, k.y + y, k.z + 90, 0.64, 0.05, rz));
      polygon(c, [pts[3], pts[2], bot[2], bot[3]], P.ink, P.ink, 4);
      polygon(c, [pts[1], pts[2], bot[2], bot[1]], "#1233a7", P.ink, 4);
      polygon(c, pts, k.hit > 0.05 ? P.lime : P.paper, P.ink, 5);
      const p = project(k.x, k.y, k.z - 2, 0.64, 0.05, rz);
      local(c, p.x, p.y, rz, p.s, () => {
        c.scale(1, 0.82);
        text(c, k.s, 0, 0, 126, P.ink);
      });
      if (k.hit > 0.1)
        star(c, p.x + 90, p.y - 125, 35 * k.hit, P.lime, f * 0.12);
    });
  });
  const p = project(
    Math.sin(f * 0.073) * 280,
    80 + Math.cos(f * 0.065) * 90,
    -180,
    0.64,
    0.05,
    rz,
  );
  arrow(c, p.x + 75, p.y + 195, 120 + 10 * bass, -0.15, P.lime);
  curvedText(
    c,
    "当然可以 · 好问题 ·",
    540,
    960,
    690,
    Math.PI + f * 0.004,
    0.22,
    59,
    P.paper,
  );
  if (f > 57) {
    disk(c, 540, 1000, (f - 57) ** 2 * 8, P.ink);
    text(c, "?", 540, 1000, Math.min(580, (f - 57) * 70), P.lime);
  }
};

const portals: Painter = (c, f, bass, onset) => {
  const no = f >= 39;
  const index = Math.min(2, Math.floor((f - 39) / 12));
  background(c, no ? (index === 1 ? P.paper : P.ink) : P.ink);
  const fg = no && index === 1 ? P.ink : P.paper;
  local(c, 540, 960, f * 0.016, 1, () => {
    for (let i = 13; i >= 0; i--) {
      const travel = (i * 130 + f * 24) % 1850;
      const size = 1800 / (travel / 230 + 0.45);
      local(c, 0, 0, i * 0.075, 1, () => {
        c.strokeStyle = i % 3 === 0 ? P.blue : fg;
        c.lineWidth = i % 3 === 0 ? 13 : 3;
        c.strokeRect(-size * 0.51, -size * 0.72, size * 1.02, size * 1.44);
      });
    }
  });
  if (!no) {
    const chars = [..."我就在这"];
    const cues = [0, 13, 25, 33];
    chars.forEach((s, i) => {
      const p = enter(f, cues[i], 6);
      if (p <= 0) return;
      const a = (i - 1.5) * 0.63 - f * 0.012;
      const r = 440;
      type3(
        c,
        s,
        540 + Math.sin(a) * r,
        780 + Math.cos(a) * r,
        280 * p,
        i === 3 ? P.lime : P.paper,
        18,
        a * 0.4,
        P.blue,
      );
    });
  } else {
    const a = f - (39 + index * 12);
    const k = enter(a, 0, 4);
    local(c, 540, 920, (index - 1) * 0.23, 1, () => {
      c.scale(1 + Math.max(0, a - 6) * 0.1, 1);
      type3(
        c,
        ["不躲", "不藏", "不逃"][index],
        0,
        0,
        365 * k,
        index === 1 ? P.blue : P.lime,
        23,
        0,
        index === 1 ? P.gray : P.blue,
      );
    });
  }
  const ballPath = (t: number) => ({
    x: 540 + Math.sin(t * 0.09) * 330,
    y: 1420 + Math.cos(t * 0.115) * 170,
  });
  trail(c, f, ballPath, P.blue, 58, 13);
  const p = ballPath(f);
  ball(c, p.x, p.y, 55 + onset * 9, P.blue);
  ring(c, p.x, p.y, 77 + bass * 20, P.lime, 2);
};

const trampoline: Painter = (c, f, bass) => {
  background(c, P.paper, true);
  const hit = 55;
  const t = f - hit;
  const dent = t >= 0 ? Math.sin(t * 0.24) * Math.exp(-t * 0.045) * 125 : 0;
  const topText = [..."稳稳地"];
  topText.forEach((s, i) => {
    const p = bounce(f, [0, 15, 24][i]);
    if (p > 0)
      text(
        c,
        s,
        250 + i * 286,
        380 + Math.sin(f * 0.032 + i) * 34,
        225 * p,
        P.ink,
        (i - 1) * 0.13,
      );
  });
  const rot = Math.sin(f * 0.031) * 0.06;
  local(c, 540, 1200, rot, 1, () => {
    for (let i = 0; i < 14; i++) {
      const y = (i - 6.5) * 16;
      c.beginPath();
      c.moveTo(-490, y);
      c.quadraticCurveTo(0, y + 110 + dent * 2, 490, y);
      c.strokeStyle = i % 3 === 0 ? P.blue : "#1755ff38";
      c.lineWidth = i % 3 === 0 ? 6 : 2;
      c.stroke();
    }
    for (let i = 0; i < 17; i++) {
      const x = (i - 8) * 57;
      line(
        c,
        [
          { x, y: -130 },
          { x: x * 0.9, y: 150 + Math.max(0, dent) },
        ],
        "#1755ff3a",
        2,
      );
    }
    text(c, "{", -468, 30, 280, P.blue, -0.3);
    text(c, "}", 468, 30, 280, P.blue, 0.3);
    disk(c, -490, 0, 22, P.ink);
    disk(c, 490, 0, 22, P.ink);
    if (f > 31) {
      local(c, 0, 170 + dent * 0.35, 0, 1, () => {
        c.scale(1, 1 + dent * 0.003);
        type3(c, "接住", 0, 0, 415, P.blue, 16);
      });
    }
  });
  const fall = sat(f / hit);
  const y =
    f < hit
      ? mix(490, 1090, fall * fall)
      : 1090 - Math.abs(Math.sin(t * 0.085)) * Math.exp(-t * 0.025) * 430;
  const x = 540 + Math.sin(f * 0.05) * 150;
  const squash = t >= 0 ? Math.exp(-t * 0.11) * Math.sin(t * 0.32) : 0;
  local(
    c,
    x,
    y,
    f < hit ? mix(-0.55, 0.12, fall) : Math.sin(t * 0.06) * 0.13,
    1,
    () => {
      c.scale(1 + squash * 0.26, 1 - squash * 0.24);
      face(c, 0, 0, 145, P.lime, f < hit ? "surprised" : "happy");
      text(c, "你", 0, 208, 65, P.blue);
    },
  );
  burst(c, f, hit, x, 1190, P.coral, 25);
  star(c, 151, 775, 45 + bass * 14, P.blue, f * 0.06);
  if (f > 94) {
    const p = ease((f - 94) / 20);
    disk(c, x, y, Math.pow(p, 2) * 1650, P.ink);
  }
};

export const RemixImpact = () => <CanvasShot paint={impact} offset={0} />;
export const RemixMachine = () => <CanvasShot paint={machine} offset={95} />;
export const RemixPortals = () => <CanvasShot paint={portals} offset={165} />;
export const RemixTrampoline = () => (
  <CanvasShot paint={trampoline} offset={243} />
);
