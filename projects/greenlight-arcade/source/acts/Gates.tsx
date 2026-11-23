import { Stage, type Paint } from "../Stage";
import {
  C,
  TAU,
  arrow,
  background,
  ball,
  bean,
  beat,
  clamp,
  cloud,
  disc,
  ease,
  ellipse,
  ground,
  label,
  line,
  lyric,
  ring,
  rr,
  scope,
  star,
  text,
  title,
} from "../draw";
const paint: Paint = (c, f, g) => {
  const { i, local } = lyric(g);
  const n = clamp(i - 8, 0, 3),
    p = ease(local / 24),
    b = beat(g);
  background(c, f, "purple");
  ground(c, f, "#d8c5fc");
  // A winding, receding road ties all four obstacles into one run.
  c.beginPath();
  c.moveTo(-200, 860);
  c.bezierCurveTo(380, 700, 1140, 1050, 1250, 300);
  c.strokeStyle = C.paper;
  c.lineWidth = 180;
  c.stroke();
  c.setLineDash([25, 28]);
  c.strokeStyle = "#c9c2e0";
  c.lineWidth = 4;
  c.stroke();
  c.setLineDash([]);
  for (let j = 0; j < 3; j++) {
    const s = 0.3 + j * 0.15;
    scope(c, 1510 + j * 115, 330 - j * 66, s, 0.05, () => {
      rr(c, -230, -220, 460, 500, 220, "#b5a1e8");
      rr(c, -182, -172, 364, 452, 182, "#eae2ff");
    });
  }
  cloud(c, 280, 230, 0.8);
  star(c, 1700, 650, 75, C.yellow, g * 0.01);
  if (n === 0) {
    scope(c, 1210, 510, 1, 0, () => {
      rr(c, -250, -255, 500, 535, 210, C.ink);
      rr(c, -250, -275, 500, 535, 210, C.green);
      rr(c, -186, -211, 372, 471, 165, C.cream);
      label(c, "通过", 0, -181, 270, C.lime, 58);
      line(c, -183, 70, 183, 70, C.coral, 35);
      for (let j = 0; j < 5; j++)
        line(c, -160 + j * 74, 48, -120 + j * 74, 90, C.cream, 15);
    });
    bean(c, 550 + p * 250, 610, 1.12, g, { board: true, mood: "wow" });
    label(c, "验收入口", 1545, 470, 260, C.pink, 37, 0.15);
    arrow(c, 970, 430, 0.56, 0, C.coral);
  } else if (n === 1) {
    disc(c, 1050, 750, 510, C.purple);
    rr(c, 610, 630, 880, 105, 50, C.ink);
    for (let j = 0; j < 12; j++) {
      const x = 635 + ((((j * 70 - f * 13) % 810) + 810) % 810);
      rr(c, x, 647, 37, 44, 12, C.purple);
    }
    bean(c, 1050, 545, 1.25, g, {
      bounce: Math.sin(b.phase * Math.PI) * 60,
      arms: 0.5,
    });
    title(c, "跑通 ≠ 走远", 960, 223, 100, C.purple, -0.035);
    cloud(c, 1650, 425, 1.4);
    for (let j = 0; j < 4; j++)
      line(
        c,
        520 - j * 75,
        490 + j * 45,
        610 - j * 75,
        490 + j * 45,
        C.coral,
        9,
      );
  } else if (n === 2) {
    scope(c, 1170, 430, 1, -0.08, () => {
      rr(c, -300, -110, 600, 200, 45, C.yellow);
      for (let j = 0; j < 7; j++) ellipse(c, -230 + j * 76, 0, 21, 21, C.cream);
      text(c, "TEST", 0, -55, 52, C.ink);
    });
    for (let j = 0; j < 15; j++) {
      const y = 455 + ((f * 5 + j * 49) % 300);
      star(
        c,
        970 + (j % 7) * 65,
        y,
        12 + (j % 3) * 4,
        [C.coral, C.purple, C.green][j % 3],
        f * 0.08,
      );
    }
    bean(c, 640, 650, 1.15, g, { mood: "panic" });
    label(c, "漏了一颗！", 1190, 760, 400, C.coral, 44, -0.04);
    ball(c, 1620, 655 - b.pulse * 30, 43, C.lime);
  } else {
    const r = 180 + p * 420;
    scope(c, 960, 490, 1, 0, () => {
      ring(c, 0, 0, r, C.purple, 18);
      ring(c, 0, 0, r + 35, C.paper, 5);
      for (let j = 0; j < 12; j++) {
        const a = (j * TAU) / 12 + f * 0.01;
        star(c, Math.cos(a) * r, Math.sin(a) * r * 0.65, 20, C.coral, a);
      }
    });
    bean(c, 960, 600, 1.3, g, { arms: 1 });
    label(c, "把 边 界 说 透", 960, 230, 580, C.lime, 47, -0.035);
    for (let j = 0; j < 4; j++) {
      const a = (j * TAU) / 4 + 0.4;
      arrow(
        c,
        960 + Math.cos(a) * 480,
        520 + Math.sin(a) * 230,
        0.53,
        a,
        [C.coral, C.purple][j % 2],
      );
    }
  }
};
export const Gates = () => <Stage paint={paint} offset={890} duration={309} />;
