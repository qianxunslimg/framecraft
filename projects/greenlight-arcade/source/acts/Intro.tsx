import { Stage, type Paint } from "../Stage";
import {
  C,
  TAU,
  background,
  ball,
  bean,
  beat,
  cloud,
  confetti,
  disc,
  ease,
  ellipse,
  label,
  line,
  pop,
  ring,
  rr,
  scope,
  star,
  text,
  title,
} from "../draw";
const paint: Paint = (c, f, g) => {
  background(c, f, "cream");
  const b = beat(g);
  // An enormous traffic-light lens becomes the entrance arch of the park.
  const p = ease((f - 24) / 65);
  const x = 960 + 390 * p,
    y = 510 - 140 * p,
    s = 1.8 - 1.04 * p;
  for (let j = 0; j < 3; j++) {
    c.beginPath();
    c.ellipse(1120, 690, 790 - j * 80, 260 - j * 26, -0.25, 0, TAU);
    c.strokeStyle = [C.purple, C.coral, C.lime][j];
    c.lineWidth = 25;
    c.stroke();
  }
  cloud(c, 260 + f * 0.17, 170, 0.8);
  cloud(c, 1700 - f * 0.12, 150, 0.65);
  scope(c, x, y, s, -0.08 * p, () => {
    rr(c, -160, -245 + 19, 320, 490, 150, C.ink);
    rr(c, -160, -245, 320, 490, 150, C.purple);
    rr(c, -137, -223, 274, 445, 132, "#a593ff");
    for (let i = 0; i < 3; i++) {
      const yy = -145 + i * 145;
      ellipse(c, 0, yy, 60, 60, C.ink);
      ball(c, 0, yy, 49, i === 2 ? C.lime : i === 0 ? "#e0a8ad" : "#ddd0b5");
      if (i === 2) {
        ring(c, 0, yy, 67 + b.pulse * 10, C.lime, 5);
        star(c, 20, yy - 22, 12, C.paper);
      }
    }
  });
  const enter = pop((f - 50) / 45);
  scope(c, 500 - (1 - enter) * 800, 425, Math.max(0.05, enter), -0.04, () => {
    text(c, "WELCOME TO", 0, -230, 28, C.purple);
    title(c, "绿灯", 0, -95, 166, C.ink);
    title(c, "游乐园", 0, 90, 166, C.coral);
    text(c, "绿灯了，但不代表", 0, 225, 46, C.ink);
    label(c, "95 BPM  /  快乐闯关", 0, 320, 430, C.lime, 29);
  });
  disc(c, 1350, 810, 330, C.pink);
  const exit = ease((f - 272) / 36);
  bean(c, 1350 + exit * 950, 695 - exit * 480, 0.94, g, {
    board: true,
    rotation: -0.1 - exit * 0.8,
    arms: 1,
  });
  for (let i = 0; i < 14; i++) {
    const a = (i * TAU) / 14 + f * 0.004;
    star(
      c,
      1350 + Math.cos(a) * 390,
      510 + Math.sin(a) * 350,
      13 + 9 * b.pulse,
      [C.coral, C.purple, C.lime][i % 3],
      a,
    );
  }
  if (f > 110) confetti(c, f, 18, 0.65);
  line(c, 100, 91, 180, 91, C.ink, 3);
  text(c, "A FRAMECRAFT MUSIC FILM", 200, 91, 22, C.ink, 400, "left");
};
export const Intro = () => (
  <Stage paint={paint} offset={0} duration={308} lyrics={false} />
);
