export type Pen = CanvasRenderingContext2D;
export const W = 1920,
  H = 1080;
export const C = {
  ink: "#090e14",
  deep: "#101b26",
  paper: "#eee9df",
  white: "#faf6ee",
  muted: "#8d9ba7",
  orange: "#ff6947",
  cyan: "#71e3df",
  line: "#263642",
};
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const ease = (n: number) => 1 - Math.pow(1 - clamp(n), 3);
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const smooth = (f: number, a: number, b: number) =>
  ease((f - a) / (b - a));
export const noise = (i: number) => {
  const n = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
};
export function text(
  c: Pen,
  s: string,
  x: number,
  y: number,
  size = 48,
  color: string = C.white,
  weight = 400,
  align: CanvasTextAlign = "left",
) {
  c.fillStyle = color;
  c.font = `${weight} ${size}px "Framecraft Sans", sans-serif`;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillText(s, x, y);
}
export function line(
  c: Pen,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string = C.line,
  width = 2,
) {
  c.strokeStyle = color;
  c.lineWidth = width;
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}
export function circle(
  c: Pen,
  x: number,
  y: number,
  r: number,
  fill: string,
  stroke?: string,
  width = 2,
) {
  if (r <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
export function box(
  c: Pen,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  r = 0,
) {
  c.fillStyle = color;
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}
export function poly(
  c: Pen,
  ps: number[][],
  fill: string,
  stroke?: string,
  width = 1,
) {
  c.beginPath();
  ps.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
export function glow(
  c: Pen,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha = 0.2,
) {
  c.save();
  c.globalAlpha *= alpha;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "transparent");
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
  c.restore();
}
export function base(c: Pen, f: number, paper = false) {
  c.fillStyle = paper ? C.paper : C.ink;
  c.fillRect(0, 0, W, H);
  if (!paper) {
    glow(c, 1400, 360, 900, "#205253", 0.2);
    glow(c, 100, 850, 700, "#57322f", 0.13);
  }
  c.save();
  c.globalAlpha = paper ? 0.06 : 0.12;
  c.fillStyle = paper ? "#44515b" : "#9cb8c8";
  for (let i = 0; i < 110; i++) {
    const x = noise(i) * W,
      y = (noise(i + 1000) * H + f * (0.025 + noise(i + 2000) * 0.07)) % H;
    c.fillRect(x, y, 1.5, 1.5);
  }
  c.restore();
}
export function label(
  c: Pen,
  s: string,
  x: number,
  y: number,
  color: string = C.orange,
) {
  text(c, s, x, y, 24, color, 700);
}
export function ruled(
  c: Pen,
  x: number,
  y: number,
  w: number,
  n = 8,
  color = "#c1beb5",
) {
  for (let i = 0; i < n; i++)
    line(
      c,
      x,
      y + i * 26,
      x + w * (0.65 + noise(i) * 0.35),
      y + i * 26,
      color,
      3,
    );
}
export function cube(
  c: Pen,
  x: number,
  y: number,
  w: number,
  h: number,
  d: number,
  color: string = C.deep,
  accent: string = C.cyan,
) {
  poly(
    c,
    [
      [x, y],
      [x + w, y],
      [x + w, y - h],
      [x, y - h],
    ],
    color,
    "#344854",
    1.5,
  );
  poly(
    c,
    [
      [x, y - h],
      [x + d, y - h - d * 0.55],
      [x + w + d, y - h - d * 0.55],
      [x + w, y - h],
    ],
    "#253540",
    "#47606c",
    1.5,
  );
  poly(
    c,
    [
      [x + w, y],
      [x + w + d, y - d * 0.55],
      [x + w + d, y - h - d * 0.55],
      [x + w, y - h],
    ],
    "#0c141d",
    "#2a3c47",
    1.5,
  );
  for (let i = 0; i < Math.floor(h / 24) - 1; i++)
    line(c, x + 8, y - 18 - i * 24, x + w - 8, y - 18 - i * 24, "#30414d", 2);
  box(c, x + 8, y - h + 12, 4, Math.max(4, h - 25), accent);
}
export function person(
  c: Pen,
  x: number,
  y: number,
  s: number,
  color: string = C.white,
) {
  circle(c, x, y - 24 * s, 10 * s, color);
  c.strokeStyle = color;
  c.lineWidth = 9 * s;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(x, y - 7 * s);
  c.lineTo(x, y + 19 * s);
  c.moveTo(x - 18 * s, y + 8 * s);
  c.lineTo(x, y - 4 * s);
  c.lineTo(x + 18 * s, y + 8 * s);
  c.moveTo(x, y + 17 * s);
  c.lineTo(x - 12 * s, y + 39 * s);
  c.moveTo(x, y + 17 * s);
  c.lineTo(x + 12 * s, y + 39 * s);
  c.stroke();
  c.lineCap = "butt";
}
export function arrow(
  c: Pen,
  x: number,
  y: number,
  dx: number,
  dy: number,
  color: string = C.cyan,
) {
  line(c, x, y, x + dx, y + dy, color, 3);
  const a = Math.atan2(dy, dx);
  poly(
    c,
    [
      [x + dx, y + dy],
      [x + dx - 15 * Math.cos(a - 0.5), y + dy - 15 * Math.sin(a - 0.5)],
      [x + dx - 15 * Math.cos(a + 0.5), y + dy - 15 * Math.sin(a + 0.5)],
    ],
    color,
  );
}
export function stamp(c: Pen, s: string, x: number, y: number, scale = 1) {
  c.save();
  c.translate(x, y);
  c.rotate(-0.1);
  c.scale(scale, scale);
  c.strokeStyle = C.orange;
  c.lineWidth = 4;
  c.strokeRect(-185, -43, 370, 86);
  text(c, s, 0, 0, 46, C.orange, 700, "center");
  c.restore();
}
export function clock(
  c: Pen,
  x: number,
  y: number,
  r: number,
  f: number,
  accent: string = C.cyan,
) {
  circle(c, x, y, r, "#0f1922", "#344c58", 3);
  circle(c, x, y, r * 0.86, "transparent", "#31424c", 1);
  for (let i = 0; i < 60; i++) {
    const a = (i * Math.PI) / 30;
    line(
      c,
      x + Math.cos(a) * r * 0.89,
      y + Math.sin(a) * r * 0.89,
      x + Math.cos(a) * r * (i % 5 === 0 ? 0.99 : 0.94),
      y + Math.sin(a) * r * (i % 5 === 0 ? 0.99 : 0.94),
      i % 5 === 0 ? C.paper : "#58707a",
      i % 5 === 0 ? 3 : 1,
    );
  }
  const a = f * 0.013 - 1.5,
    b = f * 0.0017 - 1.5;
  line(
    c,
    x,
    y,
    x + Math.cos(a) * r * 0.76,
    y + Math.sin(a) * r * 0.76,
    accent,
    3,
  );
  line(
    c,
    x,
    y,
    x + Math.cos(b) * r * 0.5,
    y + Math.sin(b) * r * 0.5,
    C.paper,
    8,
  );
  circle(c, x, y, 8, accent);
}
export type Point = { x: number; y: number; z: number; k: number };
export function project(
  x: number,
  y: number,
  z: number,
  turn = 0,
  tilt = 0,
  cx = 960,
  cy = 480,
): Point {
  const xx = x * Math.cos(turn) + z * Math.sin(turn),
    zz = z * Math.cos(turn) - x * Math.sin(turn);
  const yy = y * Math.cos(tilt) - zz * Math.sin(tilt),
    zzz = zz * Math.cos(tilt) + y * Math.sin(tilt);
  const k = 1000 / (1000 + zzz);
  return { x: cx + xx * k, y: cy + yy * k, z: zzz, k };
}
export function globe(
  c: Pen,
  cx: number,
  cy: number,
  r: number,
  f: number,
  accent: string = C.cyan,
) {
  const turn = f * 0.0012;
  for (let j = -3; j <= 3; j++) {
    const lat = (j * Math.PI) / 8;
    c.beginPath();
    for (let i = 0; i <= 100; i++) {
      const a = (i * Math.PI) / 50;
      const p = project(
        r * Math.cos(lat) * Math.cos(a),
        r * Math.sin(lat),
        r * Math.cos(lat) * Math.sin(a),
        turn,
        -0.13,
        cx,
        cy,
      );
      if (i === 0) c.moveTo(p.x, p.y);
      else c.lineTo(p.x, p.y);
    }
    c.strokeStyle = "#2b515e";
    c.lineWidth = 1;
    c.stroke();
  }
  for (let j = 0; j < 12; j++) {
    const a = (j * Math.PI) / 6;
    c.beginPath();
    for (let i = 0; i <= 64; i++) {
      const b = (i * Math.PI) / 32;
      const p = project(
        r * Math.cos(b) * Math.cos(a),
        r * Math.sin(b),
        r * Math.cos(b) * Math.sin(a),
        turn,
        -0.13,
        cx,
        cy,
      );
      if (i === 0) c.moveTo(p.x, p.y);
      else c.lineTo(p.x, p.y);
    }
    c.strokeStyle = "#24424f";
    c.lineWidth = 1;
    c.stroke();
  }
  for (let i = 0; i < 160; i++) {
    const a = noise(i + 50) * Math.PI * 2,
      b = Math.acos(2 * noise(i + 750) - 1);
    const p = project(
      r * Math.sin(b) * Math.cos(a),
      r * Math.cos(b),
      r * Math.sin(b) * Math.sin(a),
      turn,
      -0.13,
      cx,
      cy,
    );
    c.globalAlpha = Math.max(0.15, p.k - 0.6);
    circle(c, p.x, p.y, 1.5 + p.k, accent);
  }
  c.globalAlpha = 1;
  glow(c, cx - r * 0.4, cy - r * 0.3, r * 0.9, accent, 0.09);
}
export function neural(
  c: Pen,
  f: number,
  cx = 960,
  cy = 480,
  r = 350,
  color: string = C.cyan,
) {
  const ps = Array.from({ length: 85 }, (_, i) => {
    const a = i * 2.39996,
      b = Math.acos(1 - (2 * (i + 0.5)) / 85);
    return project(
      r * Math.sin(b) * Math.cos(a),
      r * Math.cos(b),
      r * Math.sin(b) * Math.sin(a),
      f * 0.002,
      -0.15,
      cx,
      cy,
    );
  });
  for (let i = 0; i < ps.length; i++) {
    for (let j = i + 1; j < ps.length; j++) {
      const a = ps[i],
        b = ps[j],
        d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 135) {
        c.globalAlpha = 0.16 * Math.min(a.k, b.k);
        line(c, a.x, a.y, b.x, b.y, color, 1);
      }
    }
  }
  for (let i = 0; i < ps.length; i++) {
    const p = ps[i];
    c.globalAlpha = 0.35 + p.k * 0.35;
    circle(c, p.x, p.y, 2 + p.k * 2, color);
    if (i % 17 === 0)
      circle(
        c,
        p.x,
        p.y,
        8 + Math.sin(f * 0.04 + i) * 3,
        "transparent",
        color,
        1,
      );
  }
  c.globalAlpha = 1;
}
export function bands(c: Pen, f: number) {
  c.save();
  c.globalAlpha = 0.22;
  for (let i = 0; i < 5; i++) {
    const y = 250 + i * 110;
    c.beginPath();
    for (let x = 0; x <= 1920; x += 10) {
      const yy =
        y +
        Math.sin(x * 0.004 + f * 0.012 + i) * 40 +
        Math.sin(x * 0.009 - f * 0.008) * 10;
      if (x) c.lineTo(x, yy);
      else c.moveTo(x, yy);
    }
    c.strokeStyle = i % 2 ? C.cyan : C.orange;
    c.lineWidth = 1;
    c.stroke();
  }
  c.restore();
}
