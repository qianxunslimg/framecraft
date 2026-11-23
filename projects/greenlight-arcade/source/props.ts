import {
  bean,
  C,
  ellipse,
  line,
  path,
  Pen,
  ring,
  rr,
  scope,
  shadow,
  text,
} from "./draw";
export function cube(
  c: Pen,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string = C.lime,
  word = "",
  d = 22,
) {
  path(
    c,
    [
      [x, y],
      [x + d, y - d],
      [x + w + d, y - d],
      [x + w, y],
    ],
    "#fff9e7",
  );
  path(
    c,
    [
      [x + w, y],
      [x + w + d, y - d],
      [x + w + d, y + h - d],
      [x + w, y + h],
    ],
    "#747197",
  );
  rr(c, x, y, w, h, 6, color);
  line(c, x + 9, y + 8, x + w - 9, y + 8, "#ffffff80", 3);
  if (word) text(c, word, x + w / 2, y + h / 2, Math.min(38, h * 0.5), C.ink);
}
export function car(
  c: Pen,
  x: number,
  y: number,
  s: number,
  f: number,
  rotation = 0,
) {
  scope(c, x, y, s, rotation, () => {
    shadow(c, 0, 105, 210, 26, 0.15);
    bean(c, -30, -50, 0.55, f, { bounce: 0, arms: 0.3 });
    rr(c, -210, -10, 420, 115, 55, C.coral);
    rr(c, -140, -47, 270, 70, 32, C.yellow);
    rr(c, 130, 0, 90, 55, 25, C.paper);
    rr(c, -235, 15, 53, 40, 15, C.purple);
    text(c, "GO", 0, 51, 45, C.ink);
    for (const xx of [-130, 130]) {
      ellipse(c, xx, 95, 54, 54, C.ink);
      ellipse(c, xx, 95, 33, 33, C.purple);
      scope(c, xx, 95, 1, f * 0.16, () => {
        for (let j = 0; j < 5; j++) {
          const a = (j * Math.PI * 2) / 5;
          line(c, 0, 0, Math.cos(a) * 23, Math.sin(a) * 23, C.paper, 5);
        }
      });
    }
  });
}
export function flower(c: Pen, x: number, y: number, s: number, f: number) {
  scope(c, x, y, s, f * 0.01, () => {
    for (let j = 0; j < 7; j++) {
      const a = (j * Math.PI * 2) / 7;
      ellipse(c, Math.cos(a) * 30, Math.sin(a) * 30, 22, 22, C.pink);
    }
    ellipse(c, 0, 0, 27, 27, C.yellow);
    ring(c, 0, 0, 10, C.ink, 3, 0, Math.PI);
  });
}
