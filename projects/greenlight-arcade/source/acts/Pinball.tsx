import { Stage, type Paint } from "../Stage";
import {
  C,
  TAU,
  background,
  ball,
  bean,
  beat,
  ellipse,
  label,
  line,
  ring,
  rr,
  scope,
  star,
  text,
  title,
} from "../draw";
const bumpers = Array.from({ length: 12 }, (_, j) =>
  j < 9
    ? [Math.cos((j * TAU) / 9) * 520, Math.sin((j * TAU) / 9) * 270]
    : [(j - 10) * 180, j === 10 ? -95 : 70],
);
const route = [0, 4, 9, 2, 6, 10, 1, 7, 11, 3, 5, 8];
function ballPosition(frame: number) {
  const b = beat(frame),
    a = bumpers[route[b.index % route.length]],
    next = bumpers[route[(b.index + 1) % route.length]];
  return [
    a[0] + (next[0] - a[0]) * b.phase,
    a[1] + (next[1] - a[1]) * b.phase - Math.sin(b.phase * Math.PI) * 55,
  ];
}
const paint: Paint = (c, f, g) => {
  const b = beat(g);
  background(c, f, "night");
  if (f < 205) {
    // Full arcade table with live bumpers and a bean-shaped silver ball.
    scope(c, 960, 520, 0.96, -0.035, () => {
      rr(c, -825, -425 + 25, 1650, 850, 120, "#121326");
      rr(c, -825, -425, 1650, 850, 120, C.purple);
      rr(c, -785, -385, 1570, 770, 95, "#302c52");
      ring(c, 0, 0, 330, "#5c4b9f", 9);
      ring(c, 0, 0, 265, "#5c4b9f", 3);
      for (let j = 0; j < 26; j++) {
        for (const side of [-1, 1])
          ball(
            c,
            -685 + j * 55,
            side * 350,
            5 + (j % 4 === b.index % 4 ? b.pulse * 3 : 0),
            [C.lime, C.pink, C.yellow][j % 3],
          );
      }
      for (const side of [-1, 1]) {
        line(c, side * 690, -260, side * 690, 210, C.pink, 11);
        for (let j = 0; j < 8; j++)
          line(
            c,
            side * 705,
            -240 + j * 45,
            side * 672,
            -220 + j * 45,
            C.purple,
            5,
          );
      }
      for (let j = 0; j < bumpers.length; j++) {
        const [xx, yy] = bumpers[j];
        const hit = route[b.index % route.length] === j ? b.pulse : 0;
        ellipse(c, xx, yy + 15, 70, 43, C.ink);
        ellipse(
          c,
          xx,
          yy,
          70 + hit * 10,
          47 + hit * 8,
          [C.coral, C.lime, C.pink][j % 3],
        );
        ring(c, xx, yy, 40 + hit * 35, [C.coral, C.lime, C.pink][j % 3], 3);
        text(c, ["!", "()", "✓"][j % 3], xx, yy, 46, C.ink);
        if (hit > 0.02) {
          c.save();
          c.globalAlpha = hit;
          ring(c, xx, yy, 85 + (1 - hit) * 50, C.paper, 4);
          text(c, "+100", xx, yy - 100 - (1 - hit) * 40, 32, C.lime);
          c.restore();
        }
      }
      scope(c, -310, 280, 1, Math.sin(f * 0.16) * 0.3, () =>
        rr(c, -135, -24, 270, 48, 24, C.coral),
      );
      scope(c, 310, 280, 1, -Math.sin(f * 0.16) * 0.3, () =>
        rr(c, -135, -24, 270, 48, 24, C.lime),
      );
      for (let j = 8; j > 0; j--) {
        const pt = ballPosition(g - j * 0.65);
        c.save();
        c.globalAlpha = (1 - j / 9) * 0.36;
        ball(c, pt[0], pt[1], 14 - j, C.lime);
        c.restore();
      }
      const pt = ballPosition(g);
      bean(c, pt[0], pt[1] - 40, 0.43, g, {
        rotation: Math.sin(f * 0.05) * 0.6,
        bounce: 0,
      });
    });
    label(c, "BONUS  /  叠甲弹珠", 960, 87, 650, C.lime, 40);
    text(c, String(b.index * 100).padStart(6, "0"), 1670, 115, 37, C.paper);
  } else if (f < 390) {
    const t = f - 205;
    // Deep parallax tunnel; rings and grammar marks accelerate toward the camera.
    for (let j = 12; j >= 0; j--) {
      const z = (j / 13 + t / 110) % 1;
      const r = 60 + Math.pow(z, 2) * 1300;
      scope(
        c,
        960 + Math.sin(t * 0.015) * 140 * z,
        510 + Math.cos(t * 0.02) * 70 * z,
        1,
        t * 0.005,
        () => {
          ring(c, 0, 0, r, [C.purple, C.coral, C.lime][j % 3], 12 + z * 38);
          for (let k = 0; k < 4; k++) {
            const a = (k * TAU) / 4 + j;
            star(
              c,
              Math.cos(a) * r,
              Math.sin(a) * r,
              12 + z * 27,
              [C.pink, C.yellow][j % 2],
              a + t * 0.03,
            );
          }
        },
      );
    }
    bean(
      c,
      960 + Math.sin(t * 0.04) * 200,
      520 + Math.cos(t * 0.055) * 90,
      1.12,
      g,
      { rotation: Math.sin(t * 0.024) * 0.7, arms: 1, board: true, bounce: 0 },
    );
    for (let j = 0; j < 5; j++) {
      const a = (j * TAU) / 5 - t * 0.02;
      text(
        c,
        ["{", "}", "(", ")", "!"][j],
        960 + Math.cos(a) * 600,
        510 + Math.sin(a) * 360,
        100,
        C.paper,
      );
    }
  } else {
    const t = f - 390;
    for (let j = 0; j < 3; j++) {
      c.beginPath();
      for (let x = -100; x < 2040; x += 20) {
        const y = 430 + j * 135 + Math.sin(x * 0.004 + t * 0.04 + j) * 100;
        if (x === -100) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.strokeStyle = [C.purple, C.coral, C.lime][j];
      c.lineWidth = 26;
      c.stroke();
    }
    for (let j = 0; j < 12; j++) {
      const x = 2100 - ((j * 235 + t * 17) % 2400);
      const y =
        400 + (j % 3) * 135 + Math.sin(x * 0.004 + t * 0.04 + (j % 3)) * 100;
      ball(c, x, y - 80, 27, [C.lime, C.pink, C.yellow][j % 3]);
    }
    bean(
      c,
      760 + Math.sin(t * 0.04) * 110,
      430 + Math.sin(t * 0.075) * 70,
      0.94,
      g,
      { board: true, rotation: Math.cos(t * 0.075) * 0.22, arms: 1, bounce: 0 },
    );
    title(c, "NEXT LEVEL", 1120, 190, 100, C.lime, -0.045);
    label(c, "下午场 →", 1520, 750, 380, C.pink, 44, 0.1);
  }
};
export const Pinball = () => (
  <Stage paint={paint} offset={1875} duration={556} lyrics={false} />
);
