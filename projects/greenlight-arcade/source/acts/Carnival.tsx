import { Stage, type Paint } from "../Stage";
import {
  C,
  TAU,
  background,
  ball,
  bean,
  beat,
  burst,
  clamp,
  cloud,
  confetti,
  disc,
  ease,
  ellipse,
  ground,
  label,
  line,
  pop,
  ring,
  rnd,
  rr,
  scope,
  star,
  text,
  title,
} from "../draw";
import { cube, flower } from "../props";
function ferris(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  f: number,
) {
  scope(c, x, y, s, 0, () => {
    line(c, 0, 0, -175, 420, C.purple, 30);
    line(c, 0, 0, 175, 420, C.purple, 30);
    disc(c, 0, 430, 230, C.coral);
    ring(c, 0, 0, 300, C.paper, 22);
    ring(c, 0, 0, 270, C.purple, 7);
    for (let j = 0; j < 10; j++) {
      const a = (j * TAU) / 10 + f * 0.008,
        xx = Math.cos(a) * 300,
        yy = Math.sin(a) * 300;
      line(c, 0, 0, xx, yy, C.purple, 8);
      ball(c, xx, yy, 13, C.yellow);
      line(c, xx, yy, xx, yy + 33, C.ink, 5);
      rr(
        c,
        xx - 42,
        yy + 28,
        84,
        65,
        27,
        [C.coral, C.lime, C.pink, C.blue][j % 4],
      );
      rr(c, xx - 27, yy + 37, 54, 25, 12, C.ink);
      ellipse(c, xx - 10, yy + 48, 4, 5, C.paper);
      ellipse(c, xx + 10, yy + 48, 4, 5, C.paper);
    }
    ball(c, 0, 0, 65, C.yellow);
    star(c, 0, 0, 41, C.coral, f * 0.008, 5);
  });
}
function town(c: CanvasRenderingContext2D, f: number, dark: boolean) {
  for (let j = 0; j < 8; j++) {
    const x = 120 + j * 260,
      y = 670 + Math.sin(j * 1.7) * 50;
    const h = 130 + (j % 3) * 70;
    cube(c, x, y - h, 180, h, [C.lime, C.pink, C.yellow][j % 3], "", 22);
    for (let k = 0; k < 3; k++)
      rr(c, x + 25 + k * 50, y - h + 40, 25, 35, 10, dark ? C.yellow : C.paper);
    ellipse(c, x + 91, y - h - 20, 92, 35, C.purple);
  }
  ferris(c, 1330, 395, 0.75, f);
  // Corkscrew track with tiny riders; its height changes smoothly with the music.
  c.beginPath();
  c.moveTo(-100, 610);
  c.bezierCurveTo(300, 200, 650, 880, 960, 430);
  c.bezierCurveTo(1240, 0, 1700, 950, 2050, 560);
  c.strokeStyle = C.ink;
  c.lineWidth = 35;
  c.stroke();
  c.strokeStyle = C.coral;
  c.lineWidth = 23;
  c.stroke();
  for (let j = 0; j < 4; j++) {
    const x = ((f * 5 + j * 450) % 2100) - 90;
    const yy = 530 + Math.sin(x * 0.004) * 120;
    bean(c, x, yy, 0.26, f + j * 5, {
      board: true,
      rotation: Math.cos(x * 0.004) * 0.12,
      bounce: 0,
    });
  }
  for (let j = 0; j < 8; j++) flower(c, j * 260 + 80, 780, 0.7, f);
}
const paint: Paint = (c, f, g) => {
  const b = beat(g);
  const dark = f >= 255 && f < 465;
  background(c, f, dark ? "night" : "cream");
  if (f < 465) {
    const zoom = 1.16 - 0.17 * ease(f / 200);
    scope(c, 960, 520, zoom, -0.018 * Math.sin(f * 0.015), () => {
      c.translate(-960, -520);
      town(c, f, dark);
    });
    ground(c, f, dark ? "#514679" : "#d9edb8");
    bean(c, 650 + Math.sin(f * 0.018) * 200, 760, 0.95, g, {
      board: true,
      arms: 1,
      rotation: Math.cos(f * 0.018) * 0.1,
    });
    for (let j = 0; j < 3; j++)
      bean(c, 1100 + j * 200, 785, 0.48, g + j * 7, {
        color: j === 1 ? C.pink : undefined,
        arms: 1,
      });
    if (dark) {
      for (let j = 0; j < 7; j++) {
        const age = (f + j * 17) % 65;
        const xx = 180 + rnd(j + 11) * 1560,
          yy = 110 + rnd(j + 8) * 340;
        burst(
          c,
          age,
          xx,
          yy,
          [C.lime, C.coral, C.pink][j % 3],
          20,
          120 + 70 * rnd(j),
        );
      }
      confetti(c, f, 65, 0.8);
      text(c, "绿灯亮着  /  快乐继续", 960, 115, 52, C.paper);
    } else {
      label(c, "下班前 · 再跳一曲", 580, 140, 590, C.yellow, 42, -0.045);
      cloud(c, 1700, 170, 0.7);
    }
  } else {
    const t = f - 465;
    const en = pop(t / 30);
    for (let j = 0; j < 3; j++) {
      ring(c, 1430, 515, 260 + j * 80, C.purple + (j === 0 ? "ff" : "55"), 15);
    }
    scope(c, 600, 440, Math.max(0.05, en), -0.035, () => {
      text(c, "绿灯游乐园", 0, -205, 35, C.purple);
      title(c, "绿灯了", 0, -60, 158, C.green);
      title(c, "但不代表", 0, 128, 143, C.coral);
      text(c, "快乐闯关 · 明天继续", 0, 278, 39, C.ink);
    });
    disc(c, 1450, 820, 310, C.purple);
    bean(c, 1440, 640, 1.15, g, { board: true, arms: 1 });
    for (let j = 0; j < 6; j++) {
      const a = (j * TAU) / 6 + f * 0.014;
      star(
        c,
        1450 + Math.cos(a) * 340,
        500 + Math.sin(a) * 290,
        25 + b.pulse * 12,
        [C.coral, C.lime, C.pink][j % 3],
        a,
      );
    }
    confetti(c, t, 40, 0.75);
    text(
      c,
      "音乐：海绵音乐 SeedMusic 1.0 · 用户创作 / 动画：Framecraft",
      960,
      1008,
      23,
      C.ink,
      400,
    );
  }
  if (f > 630) {
    c.globalAlpha = clamp((f - 630) / 29);
    c.fillStyle = C.cream;
    c.fillRect(0, 0, 1920, 1080);
    c.globalAlpha = 1;
  }
};
export const Carnival = () => (
  <Stage paint={paint} offset={4455} duration={660} lyrics={false} />
);
