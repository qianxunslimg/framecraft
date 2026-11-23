import lyrics from "./lyrics.json";
import rhythm from "./rhythm.json";

export type Pen = CanvasRenderingContext2D;
export const C = {
  ink: "#222238",
  cream: "#fff7df",
  paper: "#fffdf5",
  lime: "#c5f66c",
  green: "#3cbd8c",
  coral: "#ff7956",
  pink: "#ffaad0",
  purple: "#8570ed",
  blue: "#69bce8",
  yellow: "#ffd261",
  pale: "#e5e5f7",
};
export const TAU = Math.PI * 2;
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
export const smooth = (v: number) => {
  const p = clamp(v);
  return p * p * (3 - 2 * p);
};
export const pop = (v: number) => {
  const p = clamp(v);
  return 1 - Math.exp(-7 * p) * Math.cos(10 * p);
};
export const rnd = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
export const band = (f: number) =>
  rhythm.energy[Math.max(0, Math.min(5114, Math.floor(f)))] ?? 0;
export function beat(f: number) {
  const a = rhythm.beatFrames;
  let l = 0,
    r = a.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (a[m] <= f) l = m + 1;
    else r = m;
  }
  const i = Math.max(0, l - 1),
    d = f - a[i];
  return {
    index: i,
    age: d,
    pulse: d >= 0 ? Math.exp(-d / 4.5) : 0,
    phase: clamp(d / ((a[i + 1] ?? a[i] + 19) - a[i])),
  };
}
export function lyric(f: number) {
  const i = lyrics.findIndex((q) => f >= q.from && f < q.to);
  return { i, q: lyrics[i], local: i < 0 ? 0 : f - lyrics[i].from };
}
export function scope(
  c: Pen,
  x: number,
  y: number,
  s = 1,
  r = 0,
  fn: () => void,
) {
  c.save();
  c.translate(x, y);
  c.rotate(r);
  c.scale(s, s);
  fn();
  c.restore();
}
export function path(
  c: Pen,
  pts: number[][],
  fill: string,
  stroke?: string,
  width = 3,
) {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
export function line(
  c: Pen,
  x: number,
  y: number,
  x2: number,
  y2: number,
  color: string,
  width = 4,
) {
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x2, y2);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = "round";
  c.stroke();
}
export function rr(
  c: Pen,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string | CanvasGradient,
  stroke?: string,
  lw = 2,
) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  if (
    typeof fill === "string" &&
    /^#[0-9a-f]{6}$/i.test(fill) &&
    h > 24 &&
    w > 24
  ) {
    const material = c.createLinearGradient(x, y, x + w * 0.2, y + h);
    material.addColorStop(0, tint(fill, 0.13));
    material.addColorStop(0.35, fill);
    material.addColorStop(1, tint(fill, -0.1));
    c.fillStyle = material;
  } else c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = lw;
    c.stroke();
  }
}
const tintCache = new Map<string, string>();
export function tint(hex: string, amount: number) {
  const key = `${hex}:${amount}`;
  const hit = tintCache.get(key);
  if (hit) return hit;
  const rgb = [1, 3, 5].map((at) => {
    const v = parseInt(hex.slice(at, at + 2), 16);
    return Math.round(amount > 0 ? v + (255 - v) * amount : v * (1 + amount));
  });
  const result = `rgb(${rgb.join(",")})`;
  tintCache.set(key, result);
  return result;
}
export function ellipse(
  c: Pen,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: string | CanvasGradient,
) {
  c.beginPath();
  c.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), 0, 0, TAU);
  c.fillStyle = color;
  c.fill();
}
export function ring(
  c: Pen,
  x: number,
  y: number,
  r: number,
  color: string,
  width = 10,
  start = 0,
  end = TAU,
) {
  c.beginPath();
  c.arc(x, y, Math.max(0.1, r), start, end);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = "round";
  c.stroke();
}
export function text(
  c: Pen,
  s: string,
  x: number,
  y: number,
  size = 52,
  color: string = C.ink,
  weight = 700,
  align: CanvasTextAlign = "center",
) {
  c.fillStyle = color;
  c.font = `${weight} ${size}px "Framecraft Sans",sans-serif`;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillText(s, x, y);
}
export function shadow(
  c: Pen,
  x: number,
  y: number,
  w: number,
  h: number,
  alpha = 0.13,
) {
  ellipse(c, x, y, w, h, `rgba(34,34,56,${alpha})`);
}
export function ball(c: Pen, x: number, y: number, r: number, color: string) {
  const g = c.createRadialGradient(x - r * 0.4, y - r * 0.5, r * 0.06, x, y, r);
  g.addColorStop(0, "#fffdef");
  g.addColorStop(0.23, tint(color, 0.2));
  g.addColorStop(0.68, color);
  g.addColorStop(1, tint(color, -0.2));
  ellipse(c, x, y, r, r, g);
  ellipse(c, x - r * 0.28, y - r * 0.35, r * 0.16, r * 0.08, "#ffffff95");
}
export function star(
  c: Pen,
  x: number,
  y: number,
  r: number,
  color: string,
  rot = 0,
  n = 4,
) {
  scope(c, x, y, 1, rot, () => {
    const a = [];
    for (let i = 0; i < n * 2; i++) {
      const q = (i * Math.PI) / n;
      const rr = i % 2 ? r * 0.28 : r;
      a.push([Math.sin(q) * rr, Math.cos(q) * rr]);
    }
    path(c, a, color);
  });
}
export function label(
  c: Pen,
  s: string,
  x: number,
  y: number,
  w: number,
  color: string = C.lime,
  size = 36,
  rotation = 0,
) {
  scope(c, x, y, 1, rotation, () => {
    rr(c, -w / 2, -32 + 9, w, 64, 22, C.ink);
    rr(c, -w / 2, -32, w, 64, 22, color);
    text(c, s, 0, 0, size, C.ink);
  });
}
export function title(
  c: Pen,
  s: string,
  x: number,
  y: number,
  size: number,
  color: string = C.ink,
  rotation = 0,
) {
  scope(c, x, y, 1, rotation, () => {
    for (let i = 10; i > 0; i -= 2)
      text(c, s, i * 0.5, i, size, color === C.ink ? "#d1c8b7" : C.ink);
    text(c, s, 0, 0, size, color);
  });
}
export function capsule(
  c: Pen,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  rr(c, x, y + 10, w, h, h / 2, C.ink);
  const g = c.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, color);
  g.addColorStop(1, color);
  rr(c, x, y, w, h, h / 2, g);
  rr(c, x + 14, y + 10, w - 28, 5, 3, "#ffffff65");
}
export function check(
  c: Pen,
  x: number,
  y: number,
  s = 1,
  color: string = C.ink,
) {
  scope(c, x, y, s, 0, () => {
    c.beginPath();
    c.moveTo(-22, 0);
    c.lineTo(-5, 17);
    c.lineTo(28, -22);
    c.lineWidth = 11;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.strokeStyle = color;
    c.stroke();
  });
}
export function burst(
  c: Pen,
  f: number,
  x: number,
  y: number,
  color: string = C.coral,
  count = 20,
  r = 220,
) {
  for (let i = 0; i < count; i++) {
    const p = clamp(f / 28);
    const a = (i * TAU) / count + rnd(i) * 0.4;
    const d = 20 + ease(p) * r * (0.6 + rnd(i + 44) * 0.4);
    c.globalAlpha = 1 - p;
    star(
      c,
      x + Math.cos(a) * d,
      y + Math.sin(a) * d,
      5 + 8 * rnd(i + 2),
      color,
      a + f * 0.05,
      i % 3 === 0 ? 5 : 4,
    );
  }
  c.globalAlpha = 1;
}
export function confetti(c: Pen, f: number, count = 45, alpha = 1) {
  c.save();
  c.globalAlpha = alpha;
  for (let i = 0; i < count; i++) {
    const x = rnd(i + 80) * 2060 - 70;
    const y = ((f * (1 + rnd(i) * 3) + rnd(i + 12) * 1300) % 1350) - 160;
    scope(
      c,
      x + Math.sin(f * 0.025 + i) * 32,
      y,
      1,
      f * 0.018 * (rnd(i + 13) > 0.5 ? 1 : -1),
      () => {
        if (i % 3 === 0)
          star(c, 0, 0, 9 + 8 * rnd(i), [C.coral, C.purple, C.lime][i % 3]);
        else
          rr(
            c,
            -5,
            -12,
            10,
            24,
            3,
            [C.coral, C.purple, C.lime, C.yellow, C.pink][i % 5],
          );
      },
    );
  }
  c.restore();
}
export function background(
  c: Pen,
  f: number,
  variant: "cream" | "pink" | "purple" | "night" | "mint" = "cream",
) {
  const colors = {
    cream: C.cream,
    pink: "#ffe5e8",
    purple: "#eae2ff",
    night: "#262441",
    mint: "#dff5e8",
  };
  c.fillStyle = colors[variant];
  c.fillRect(0, 0, 1920, 1080);
  const g = c.createRadialGradient(860, 380, 60, 960, 500, 1200);
  g.addColorStop(0, variant === "night" ? "#49416a70" : "#ffffff80");
  g.addColorStop(1, "#ffffff00");
  c.fillStyle = g;
  c.fillRect(0, 0, 1920, 1080);
  c.save();
  c.globalAlpha = variant === "night" ? 0.13 : 0.12;
  ring(
    c,
    1920 + Math.sin(f * 0.004) * 30,
    0,
    500,
    variant === "night" ? C.purple : C.coral,
    140,
  );
  ring(c, -160, 1000, 450, variant === "night" ? C.lime : C.purple, 100);
  c.restore();
  // Tiny off-register print flecks: deterministic and spatially anchored.
  c.save();
  c.globalAlpha = variant === "night" ? 0.12 : 0.045;
  c.fillStyle = variant === "night" ? C.paper : C.ink;
  for (let i = 0; i < 190; i++)
    c.fillRect(rnd(i + 345) * 1920, rnd(i + 888) * 1080, 1.5, 1.5);
  c.restore();
}
export function disc(
  c: Pen,
  x: number,
  y: number,
  w: number,
  color: string = C.purple,
) {
  ellipse(c, x, y + 26, w, w * 0.21, C.ink);
  ellipse(c, x, y, w, w * 0.21, color);
  ellipse(c, x, y - 7, w * 0.9, w * 0.16, "#ffffff18");
}
export function ground(c: Pen, f: number, color: string = C.lime) {
  c.save();
  c.beginPath();
  c.moveTo(0, 830);
  c.bezierCurveTo(540, 720, 1290, 950, 1920, 770);
  c.lineTo(1920, 1080);
  c.lineTo(0, 1080);
  c.closePath();
  c.fillStyle = color;
  c.fill();
  c.globalAlpha = 0.1;
  for (let i = 0; i < 10; i++) {
    c.beginPath();
    c.moveTo(i * 230 - 150, 1080);
    c.lineTo(960 + (i - 4) * 120, 780);
    c.strokeStyle = C.ink;
    c.lineWidth = 2;
    c.stroke();
  }
  c.restore();
  for (let i = 0; i < 8; i++)
    star(c, 100 + i * 240, 845 + Math.sin(i * 3 + f * 0.02) * 15, 6, C.paper);
}
export type Mood = "happy" | "wow" | "tired" | "smug" | "panic";
export function bean(
  c: Pen,
  x: number,
  y: number,
  s: number,
  f: number,
  opts: {
    rotation?: number;
    mood?: Mood;
    bounce?: number;
    color?: string;
    arms?: number;
    board?: boolean;
  } = {},
) {
  const pulse = beat(f).pulse;
  const hop = opts.bounce ?? Math.sin(beat(f).phase * Math.PI) * 18;
  shadow(c, x, y + 140 * s, 105 * s, 18 * s, 0.12);
  scope(
    c,
    x,
    y - hop * s,
    s,
    opts.rotation ?? Math.sin(f * 0.027) * 0.025,
    () => {
      if (opts.board) {
        capsule(c, -153, 126, 306, 22, C.purple);
        for (const xx of [-100, 100]) {
          ball(c, xx, 162, 21, C.coral);
          ellipse(c, xx, 162, 7, 7, C.cream);
        }
      }
      // Limbs and skate boots.
      for (const side of [-1, 1]) {
        line(c, side * 48, 75, side * 59, 118, C.ink, 18);
        rr(c, side * 58 - 38, 106, 79, 35, 17, C.coral);
        rr(c, side * 58 - 38, 130, 79, 10, 5, C.ink);
        line(
          c,
          side * 91,
          -9,
          side * (123 + 8 * Math.sin(f * 0.1)),
          26 - (opts.arms ?? 0) * 65,
          C.ink,
          17,
        );
        ball(
          c,
          side * (125 + 8 * Math.sin(f * 0.1)),
          27 - (opts.arms ?? 0) * 65,
          20,
          C.cream,
        );
      }
      c.save();
      c.scale(1 + pulse * 0.028, 1 - pulse * 0.03);
      const g = c.createLinearGradient(-90, -130, 100, 95);
      g.addColorStop(0, "#efffa8");
      g.addColorStop(0.48, opts.color ?? C.lime);
      g.addColorStop(1, opts.color ? C.purple : "#7acc68");
      rr(c, -96, -145, 192, 241, 83, g);
      c.save();
      c.globalAlpha = 0.45;
      ring(c, -5, -39, 78, C.paper, 4, 3.6, 4.8);
      c.restore();
      scope(c, 13, -150, 1, Math.sin(f * 0.07) * 0.12, () => {
        line(c, 0, 0, 0, -36, C.ink, 7);
        ellipse(c, 16, -36, 25, 10, C.green);
        ellipse(c, -12, -26, 17, 8, C.coral);
      });
      rr(c, -76, -98, 152, 91, 38, C.ink);
      rr(c, -63, -87, 126, 12, 6, "#ffffff15");
      const blink = Math.floor(f / 91) % 4 === 2 && f % 91 < 5;
      const mood = opts.mood ?? "happy";
      for (const xx of [-29, 29]) {
        if (blink || mood === "tired")
          line(c, xx - 10, -51, xx + 10, -51, C.paper, 7);
        else if (mood === "happy" || mood === "smug") {
          c.beginPath();
          c.arc(xx, -46, 12, Math.PI, TAU);
          c.lineWidth = 7;
          c.strokeStyle = C.paper;
          c.lineCap = "round";
          c.stroke();
        } else ellipse(c, xx, -51, 9, mood === "panic" ? 20 : 15, C.paper);
      }
      if (mood === "wow" || mood === "panic") ellipse(c, 0, -25, 7, 9, C.coral);
      else {
        c.beginPath();
        c.arc(0, -29, 8, 0, Math.PI);
        c.lineWidth = 3;
        c.strokeStyle = C.coral;
        c.stroke();
      }
      ellipse(c, -67, -20, 12, 5, C.pink);
      ellipse(c, 67, -20, 12, 5, C.pink);
      rr(c, -28, 21, 56, 31, 12, "#ffffff70");
      text(c, "<>", 0, 35, 23, C.ink);
      ellipse(c, -9, 70, 4, 4, C.green);
      ellipse(c, 9, 70, 4, 4, C.paper);
      c.restore();
    },
  );
}
export function shield(
  c: Pen,
  x: number,
  y: number,
  s: number,
  color: string = C.purple,
  rotation = 0,
) {
  scope(c, x, y, s, rotation, () => {
    const pts = [
      [-86, -90],
      [0, -120],
      [86, -90],
      [73, 30],
      [0, 105],
      [-73, 30],
    ];
    path(
      c,
      pts.map(([a, b]) => [a + 6, b + 12]),
      C.ink,
    );
    path(c, pts, color);
    path(
      c,
      pts.map(([a, b]) => [a * 0.78, b * 0.78]),
      "#ffffff30",
    );
    line(c, -59, -72, 0, -93, "#ffffffaa", 5);
    check(c, 0, -8, 1.1, C.paper);
  });
}
export function paper(
  c: Pen,
  x: number,
  y: number,
  s: number,
  rotation = 0,
  caption = "BUT",
) {
  scope(c, x, y, s, rotation, () => {
    rr(c, -85, -110 + 10, 170, 220, 10, "#22223825");
    rr(c, -85, -110, 170, 220, 10, C.paper);
    path(
      c,
      [
        [48, -110],
        [85, -75],
        [48, -75],
      ],
      "#d5d2ed",
    );
    for (let i = 0; i < 5; i++)
      rr(c, -61, -37 + i * 23, 96 - (i % 2) * 23, 5, 2, "#bcb6ca");
    text(c, caption, -59, -77, 26, C.purple, 700, "left");
  });
}
export function cloud(
  c: Pen,
  x: number,
  y: number,
  s = 1,
  color: string = C.paper,
) {
  scope(c, x, y, s, 0, () => {
    ellipse(c, 0, 0, 80, 26, color);
    ellipse(c, -25, -16, 38, 36, color);
    ellipse(c, 20, -22, 45, 44, color);
  });
}
export function arrow(
  c: Pen,
  x: number,
  y: number,
  s = 1,
  rotation = 0,
  color: string = C.coral,
) {
  scope(c, x, y, s, rotation, () =>
    path(
      c,
      [
        [-85, -23],
        [5, -23],
        [5, -65],
        [92, 0],
        [5, 65],
        [5, 23],
        [-85, 23],
      ],
      color,
    ),
  );
}
export function clock(c: Pen, x: number, y: number, r: number, f: number) {
  ball(c, x + 5, y + 12, r, C.purple);
  ellipse(c, x, y, r, r, C.paper);
  ring(c, x, y, r - 12, C.ink, 7);
  for (let i = 0; i < 12; i++) {
    const a = (i * TAU) / 12;
    line(
      c,
      x + Math.sin(a) * (r - 33),
      y - Math.cos(a) * (r - 33),
      x + Math.sin(a) * (r - 24),
      y - Math.cos(a) * (r - 24),
      C.ink,
      4,
    );
  }
  const a = -Math.PI / 3 + Math.sin(f * 0.02) * 0.08;
  line(
    c,
    x,
    y,
    x + Math.sin(a) * r * 0.48,
    y - Math.cos(a) * r * 0.48,
    C.ink,
    11,
  );
  line(c, x, y, x, y - r * 0.72, C.coral, 7);
  ball(c, x, y, 10, C.yellow);
}
export function caption(c: Pen, f: number) {
  const { q, local } = lyric(f);
  if (!q) return;
  const t = pop(local / 10);
  const size = 51;
  c.font = `700 ${size}px "Framecraft Sans"`;
  const w = c.measureText(q.text).width;
  scope(c, 960, 975 + (1 - t) * 38, Math.max(0.1, 0.96 + 0.04 * t), 0, () => {
    rr(c, -w / 2 - 39, -41, w + 78, 82, 30, "#222238f5");
    text(c, q.text, 0, 0, size, C.paper);
    c.save();
    c.beginPath();
    c.rect(-w / 2, -35, w * clamp(local / (q.to - q.from)), 70);
    c.clip();
    text(c, q.text, 0, 0, size, C.lime);
    c.restore();
    star(c, -w / 2 - 62, 0, 11, C.coral, f * 0.025);
    star(c, w / 2 + 62, 0, 11, C.purple, -f * 0.025);
  });
}
export function sweep(
  c: Pen,
  f: number,
  duration: number,
  color: string = C.lime,
) {
  if (f < 9) {
    const p = clamp(f / 9);
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(1920 * p - 380, 0);
    c.lineTo(1920, 0);
    c.lineTo(1920, 1080);
    c.lineTo(1920 * p + 380, 1080);
    c.fill();
  }
  if (f > duration - 9) {
    const p = clamp((f - duration + 9) / 9);
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(-380, 0);
    c.lineTo(1920 * p - 380, 0);
    c.lineTo(1920 * p + 380, 1080);
    c.lineTo(-380, 1080);
    c.fill();
  }
}
