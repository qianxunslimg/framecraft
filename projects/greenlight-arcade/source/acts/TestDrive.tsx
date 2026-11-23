import { Stage, type Paint } from "../Stage";
import {
  C,
  TAU,
  background,
  bean,
  beat,
  clamp,
  cloud,
  disc,
  ease,
  ellipse,
  label,
  line,
  lyric,
  pop,
  ring,
  rr,
  scope,
  star,
  text,
  title,
} from "../draw";
import { car, cube, flower } from "../props";
const paint: Paint = (c, f, g) => {
  const { i, local } = lyric(g),
    n = clamp(i - 28, 0, 3),
    p = ease(local / 24),
    b = beat(g);
  background(c, f, "pink");
  cloud(c, 290 - f * 0.2, 210, 1.15);
  cloud(c, 1630 - f * 0.35, 160, 0.8);
  for (let j = 0; j < 6; j++)
    ellipse(c, j * 400, 815, 290, 160, j % 2 ? "#ead7f4" : "#efc5cf");
  if (n === 0) {
    for (let j = 0; j < 14; j++) {
      const xx = 50 + j * 145;
      const yy = 540 + Math.sin(j * 0.47) * 150;
      for (let k = 0; k < 3; k++)
        cube(c, xx, yy + k * 88, 133, 80, k % 2 ? C.lime : "#a2d47d", "", 17);
      cube(c, xx, yy - 75, 65, 70, C.green, "", 15);
      cube(c, xx + 75, yy - 75, 58, 70, C.green, "", 15);
    }
    car(c, 700, 360 + Math.sin(f * 0.07) * 20, 0.7, g, -0.08);
    label(c, "SIMULATION", 1400, 210, 420, C.paper, 38, 0.05);
  } else if (n === 1) {
    c.fillStyle = C.purple;
    c.fillRect(0, 715, 1920, 365);
    c.setLineDash([64, 46]);
    line(c, 0, 845, 1920, 845, C.paper, 9);
    c.setLineDash([]);
    car(
      c,
      800 + Math.sin(f * 0.035) * 110,
      610,
      1.4,
      g,
      Math.sin(f * 0.09) * 0.03,
    );
    scope(c, 1490, 460, 1, 0, () => {
      rr(c, -12, -50, 24, 295, 8, C.ink);
      pathTriangle(c);
      text(c, "?", 0, 0, 90, C.ink);
    });
    title(c, "实车上场", 690, 220, 100, C.ink, -0.04);
  } else if (n === 2) {
    c.fillStyle = C.purple;
    c.fillRect(0, 760, 1920, 320);
    for (let j = 0; j < 4; j++) {
      const x = 260 + j * 480 - ((f * 8) % 480);
      ellipse(c, x, 780, 110, 43, C.ink);
      ring(c, x, 780, 65, C.coral, 9);
    }
    const jump = Math.sin(clamp(local / 76) * Math.PI);
    car(c, 700 + p * 650, 610 - jump * 200, 1.06, g, -jump * 0.22);
    label(c, "未测分支", 410, 290, 390, C.yellow, 48, -0.06);
    title(c, "坑！", 1530, 460, 125, C.coral, 0.13);
    for (let j = 0; j < 3; j++) flower(c, 180 + j * 700, 700, 0.65, g);
  } else {
    disc(c, 960, 805, 580, C.purple);
    const t = pop(local / 25);
    bean(c, 960, 655, 1.22, g, {
      arms: 1,
      mood: "panic",
      bounce: Math.sin(g * 0.5) * 3,
    });
    scope(
      c,
      960,
      450 - (1 - t) * 400,
      1,
      -0.08 + Math.sin(g * 0.045) * 0.03,
      () => {
        car(c, 0, -35, 0.9, g);
        for (let j = 0; j < 3; j++)
          cube(
            c,
            -250 + j * 175,
            -210,
            145,
            90,
            [C.lime, C.yellow, C.pink][j],
            "TEST",
          );
      },
    );
    title(c, "我 硬 撑 ！", 960, 136, 96, C.coral, -0.035);
    for (let j = 0; j < 10; j++) {
      const a = (j * TAU) / 10;
      star(
        c,
        960 + Math.cos(a) * 630,
        490 + Math.sin(a) * 290,
        18 + 10 * b.pulse,
        C.yellow,
        a,
      );
    }
  }
};
function pathTriangle(c: CanvasRenderingContext2D) {
  c.beginPath();
  c.moveTo(0, -150);
  c.lineTo(140, 100);
  c.lineTo(-140, 100);
  c.closePath();
  c.fillStyle = C.yellow;
  c.fill();
  c.strokeStyle = C.coral;
  c.lineWidth = 14;
  c.lineJoin = "round";
  c.stroke();
}
export const TestDrive = () => (
  <Stage paint={paint} offset={3013} duration={375} />
);
