export type Pen = CanvasRenderingContext2D;
export type Point = { x: number; y: number };
export const P = {
  paper: "#f2f1ea",
  ink: "#101114",
  blue: "#1755ff",
  lime: "#d5ff46",
  coral: "#ff6045",
  gray: "#b7b9b6",
};
export const TAU = Math.PI * 2;
export const sat = (x: number) => Math.max(0, Math.min(1, x));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const ease = (p: number) => 1 - Math.pow(1 - sat(p), 3);
export const smooth = (p: number) => {
  const t = sat(p);
  return t * t * (3 - 2 * t);
};
export const enter = (f: number, at = 0, duration = 12) =>
  ease((f - at) / duration);
export const bounce = (f: number, at = 0) =>
  f < at ? 0 : 1 - Math.exp(-(f - at) * 0.2) * Math.cos((f - at) * 0.43);
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export function local(
  c: Pen,
  x: number,
  y: number,
  angle: number,
  scale: number,
  draw: () => void,
) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  c.scale(scale, scale);
  draw();
  c.restore();
}
export function background(c: Pen, color: string, dots = false) {
  c.fillStyle = color;
  c.fillRect(0, 0, 1080, 1920);
  if (dots) {
    c.fillStyle = color === P.ink ? "#ffffff10" : "#0000000c";
    for (let y = 20; y < 1920; y += 38)
      for (let x = 20; x < 1080; x += 38) c.fillRect(x, y, 1.2, 1.2);
  }
}
export function text(
  c: Pen,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string = P.ink,
  angle = 0,
  outline = 0,
) {
  local(c, x, y, angle, 1, () => {
    c.font = `900 ${size}px "Framecraft Sans"`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineJoin = "round";
    if (outline) {
      c.strokeStyle = color;
      c.lineWidth = outline;
      c.strokeText(value, 0, 0);
    } else {
      c.fillStyle = color;
      c.fillText(value, 0, 0);
    }
  });
}
export function type3(
  c: Pen,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  depth = 16,
  angle = 0,
  side: string = P.ink,
) {
  local(c, x, y, angle, 1, () => {
    for (let i = depth; i > 0; i -= 3) text(c, value, i * 0.65, i, size, side);
    text(c, value, 0, 0, size, color);
  });
}
export function line(
  c: Pen,
  points: Point[],
  color: string,
  width = 3,
  closed = false,
) {
  if (!points.length) return;
  c.beginPath();
  c.moveTo(points[0].x, points[0].y);
  for (const p of points.slice(1)) c.lineTo(p.x, p.y);
  if (closed) c.closePath();
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.stroke();
}
export function polygon(
  c: Pen,
  points: Point[],
  fill: string,
  stroke?: string,
  width = 2,
) {
  c.beginPath();
  points.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
export function disk(
  c: Pen,
  x: number,
  y: number,
  r: number,
  color: string,
  stroke?: string,
  width = 2,
) {
  if (r <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fillStyle = color;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
export function ring(
  c: Pen,
  x: number,
  y: number,
  r: number,
  color: string,
  width = 3,
) {
  if (r <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.stroke();
}
export function round(
  c: Pen,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
  stroke?: string,
  width = 2,
) {
  if (w <= 0 || h <= 0) return;
  c.beginPath();
  c.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  c.fillStyle = color;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
export function star(
  c: Pen,
  x: number,
  y: number,
  r: number,
  color: string,
  rotation = 0,
  points = 8,
) {
  local(c, x, y, rotation, 1, () => {
    polygon(
      c,
      Array.from({ length: points * 2 }, (_, i) => ({
        x: Math.cos((i * Math.PI) / points) * (i % 2 ? r * 0.27 : r),
        y: Math.sin((i * Math.PI) / points) * (i % 2 ? r * 0.27 : r),
      })),
      color,
    );
  });
}
export function face(
  c: Pen,
  x: number,
  y: number,
  r: number,
  color: string = P.blue,
  mood: "happy" | "sad" | "surprised" | "love" = "happy",
  angle = 0,
) {
  local(c, x, y, angle, 1, () => {
    disk(c, 7, 12, r, P.ink);
    disk(c, 0, 0, r, color, P.ink, Math.max(2, r * 0.035));
    const fg = color === P.blue ? P.paper : P.ink;
    if (mood === "love") {
      heart(c, -r * 0.31, -r * 0.15, r * 0.38, P.coral);
      heart(c, r * 0.31, -r * 0.15, r * 0.38, P.coral);
    } else if (mood === "happy") {
      for (const side of [-1, 1]) {
        c.beginPath();
        c.arc(side * r * 0.3, -r * 0.08, r * 0.13, Math.PI, TAU);
        c.strokeStyle = fg;
        c.lineWidth = r * 0.08;
        c.lineCap = "round";
        c.stroke();
      }
    } else {
      disk(c, -r * 0.3, -r * 0.15, r * 0.065, fg);
      disk(c, r * 0.3, -r * 0.15, r * 0.065, fg);
    }
    if (mood === "surprised") ring(c, 0, r * 0.3, r * 0.13, fg, r * 0.06);
    else {
      c.beginPath();
      c.moveTo(-r * 0.27, r * 0.26);
      c.quadraticCurveTo(
        0,
        mood === "sad" ? r * 0.02 : r * 0.65,
        r * 0.27,
        r * 0.26,
      );
      c.strokeStyle = fg;
      c.lineWidth = r * 0.065;
      c.lineCap = "round";
      c.stroke();
    }
    disk(c, -r * 0.58, r * 0.19, r * 0.105, P.coral);
    disk(c, r * 0.58, r * 0.19, r * 0.105, P.coral);
    if (mood === "sad") {
      polygon(
        c,
        [
          { x: r * 0.46, y: r * 0.03 },
          { x: r * 0.37, y: r * 0.33 },
          { x: r * 0.56, y: r * 0.33 },
        ],
        P.blue,
      );
      disk(c, r * 0.465, r * 0.31, r * 0.1, P.blue);
    }
  });
}
export function ball(
  c: Pen,
  x: number,
  y: number,
  r: number,
  color: string = P.blue,
  sx = 1,
  sy = 1,
) {
  local(c, x, y, 0, 1, () => {
    c.scale(sx, sy);
    face(c, 0, 0, r, color);
  });
}
export function burst(
  c: Pen,
  f: number,
  at: number,
  x: number,
  y: number,
  color: string,
  count = 15,
) {
  const t = f - at;
  if (t < 0 || t > 34) return;
  for (let i = 0; i < count; i++) {
    const a = (i * TAU) / count + 0.1;
    const r = 30 + t * (7 + rand(i) * 8);
    c.globalAlpha = Math.max(0, 1 - t / 34);
    star(
      c,
      x + Math.cos(a) * r,
      y + Math.sin(a) * r,
      8 + rand(i + 10) * 18,
      color,
      a + t * 0.06,
      4,
    );
  }
  c.globalAlpha = 1;
}
export function curvedText(
  c: Pen,
  value: string,
  cx: number,
  cy: number,
  r: number,
  start: number,
  step: number,
  size: number,
  color: string,
) {
  [...value].forEach((s, i) => {
    const a = start + i * step;
    text(
      c,
      s,
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r,
      size,
      color,
      a + Math.PI / 2,
    );
  });
}
export function heart(
  c: Pen,
  x: number,
  y: number,
  size: number,
  color: string,
  rotation = 0,
) {
  local(c, x, y, rotation, size / 200, () => {
    c.beginPath();
    c.moveTo(0, 80);
    c.bezierCurveTo(-160, -20, -65, -140, 0, -53);
    c.bezierCurveTo(65, -140, 160, -20, 0, 80);
    c.fillStyle = color;
    c.fill();
  });
}
export function plane(
  c: Pen,
  x: number,
  y: number,
  s: number,
  angle: number,
  color: string = P.blue,
) {
  local(c, x, y, angle, s, () => {
    polygon(
      c,
      [
        { x: -150, y: 60 },
        { x: 170, y: -70 },
        { x: 5, y: 118 },
        { x: -28, y: 40 },
      ],
      color,
      P.ink,
      3,
    );
    polygon(
      c,
      [
        { x: -28, y: 40 },
        { x: 170, y: -70 },
        { x: 5, y: 118 },
      ],
      P.paper,
      P.ink,
      3,
    );
    line(
      c,
      [
        { x: -28, y: 40 },
        { x: -12, y: 110 },
        { x: 30, y: 76 },
      ],
      P.ink,
      3,
    );
  });
}
export function project(
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  focal = 1150,
) {
  let yy = y * Math.cos(rx) - z * Math.sin(rx),
    zz = y * Math.sin(rx) + z * Math.cos(rx);
  let xx = x * Math.cos(ry) + zz * Math.sin(ry);
  zz = -x * Math.sin(ry) + zz * Math.cos(ry);
  const x2 = xx * Math.cos(rz) - yy * Math.sin(rz);
  yy = xx * Math.sin(rz) + yy * Math.cos(rz);
  xx = x2;
  const s = focal / (focal + zz);
  return { x: 540 + xx * s, y: 960 + yy * s, s, z: zz };
}
export function arrow(
  c: Pen,
  x: number,
  y: number,
  size: number,
  rotation: number,
  color: string = P.paper,
) {
  local(c, x, y, rotation, size / 100, () =>
    polygon(
      c,
      [
        { x: 0, y: 0 },
        { x: 65, y: 83 },
        { x: 38, y: 86 },
        { x: 60, y: 132 },
        { x: 38, y: 141 },
        { x: 17, y: 95 },
        { x: 0, y: 118 },
      ],
      color,
      P.ink,
      5,
    ),
  );
}
export function trail(
  c: Pen,
  f: number,
  fn: (t: number) => Point,
  color: string,
  width = 10,
  length = 18,
) {
  for (let i = length; i > 0; i--) {
    const p = fn(Math.max(0, f - i));
    const q = fn(Math.max(0, f - i + 1));
    c.globalAlpha = (1 - i / length) * 0.55;
    line(c, [p, q], color, width * (1 - i / length));
  }
  c.globalAlpha = 1;
}

const masks = new Map<string, Point[]>();
export function glyphPoints(value: string): Point[] {
  const found = masks.get(value);
  if (found) return found;
  const cv = document.createElement("canvas");
  cv.width = 1000;
  cv.height = 1000;
  const c = cv.getContext("2d")!;
  c.fillStyle = "white";
  c.font = `900 ${value.length > 1 ? 390 : 760}px "Framecraft Sans"`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(value, 500, 500);
  const data = c.getImageData(0, 0, 1000, 1000).data;
  const pts: Point[] = [];
  for (let y = 90; y < 930; y += 16)
    for (let x = 65; x < 950; x += 16)
      if (data[(y * 1000 + x) * 4 + 3] > 160)
        pts.push({ x: x - 500, y: y - 500 });
  masks.set(value, pts);
  return pts;
}
