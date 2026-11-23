import { CanvasShot, type Painter } from "./CanvasShot";
import {
  P,
  sat,
  mix,
  ease,
  smooth,
  enter,
  rand,
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
  face,
  burst,
  curvedText,
  heart,
  plane,
  project,
  glyphPoints,
  trail,
} from "./draw";

// Hundreds of punctuation marks assemble into the listener, then an embrace.
const particles: Painter = (c, f, bass) => {
  background(c, P.ink);
  const you = glyphPoints("你");
  const long = glyphPoints("太久");
  const morph = smooth((f - 57) / 17),
    embrace = smooth((f - 95) / 28),
    assemble = ease(f / 28);
  const turn = Math.sin(f * 0.028) * 0.15;
  for (let i = 0; i < 950; i++) {
    const a = you[i % you.length],
      b = long[i % long.length];
    const theta = i * 2.39996;
    const hx = 16 * Math.sin(theta) ** 3 * 20;
    const hy =
      -(
        13 * Math.cos(theta) -
        5 * Math.cos(2 * theta) -
        2 * Math.cos(3 * theta) -
        Math.cos(4 * theta)
      ) * 20;
    const spread = (1 - assemble) * 980;
    const x = mix(mix(a.x, b.x, morph), hx, embrace) + (rand(i) - 0.5) * spread;
    const y =
      mix(mix(a.y, b.y, morph), hy, embrace) + (rand(i + 991) - 0.5) * spread;
    const z =
      Math.sin(i * 0.7 + f * 0.03) * (24 + embrace * 120) +
      (1 - assemble) * (rand(i + 301) - 0.5) * 650;
    const p = project(x, y, z, 0.08, turn, 0);
    const color = i % 6 === 0 ? P.coral : i % 4 === 0 ? P.lime : P.paper;
    if (i % 7 === 0)
      text(c, i % 2 ? "?" : "♥", p.x, p.y, 14 * p.s, color, f * 0.005);
    else
      disk(
        c,
        p.x,
        p.y,
        (i % 5 === 0 ? 3.8 : 2.4) * p.s * (1 + bass * 0.16),
        color,
      );
  }
  for (let i = 0; i < 36; i++) {
    const a = i * 2.4 + f * 0.002;
    const r = 550 + rand(i) * 280;
    text(
      c,
      ["·", "+", "✦"][i % 3],
      540 + Math.cos(a) * r,
      960 + Math.sin(a) * r * 1.35,
      15 + rand(i + 2) * 15,
      "#828d9b",
      -a,
    );
  }
  if (f < 63) {
    text(c, "你只是", 540, 370, 85, P.paper);
    text(c, "( · _ · )", 540, 1435, 96, P.lime);
  } else {
    text(c, "没被稳稳接住", 540, 1490, 78, P.paper);
    text(c, "太久", 540, 374, 108, P.lime);
  }
  // The sad symbol face itself relaxes as the marks collect into a heart.
  local(c, 540, 1790, 0, 0.64, () => {
    face(c, 0, 0, 91, P.paper, f < 93 ? "sad" : "love");
  });
};

// The weight is literally punctuation; the explanation becomes an origami bird.
const unfold: Painter = (c, f, bass) => {
  background(c, P.paper, true);
  const fold = enter(f, 46, 32),
    flight = sat((f - 77) / 36) ** 2,
    relief = enter(f, 37, 12);
  if (f < 51) {
    const wobble = Math.sin(f * 0.8) * (1 - relief) * 6;
    text(c, "不用", 540, 350, 172, P.blue, -0.08);
    local(c, 540, 825 + relief * 1600, -0.08 + relief * 1.4, 1, () => {
      round(c, -425, -170, 850, 340, 10, P.ink);
      text(c, "硬撑", 0, -8, 285, P.paper);
      for (let i = 0; i < 5; i++)
        text(
          c,
          "!",
          -330 + i * 165,
          -275,
          135,
          P.ink,
          Math.sin(f * 0.12 + i) * 0.08,
        );
    });
    local(c, 540 + wobble, 1190 - relief * 75, 0, 1, () => {
      face(c, 0, 0, 137, P.lime, relief > 0.5 ? "happy" : "sad");
      text(c, "/", -215, -125, 225, P.blue, -0.3);
      text(c, "\\", 215, -125, 225, P.blue, 0.3);
      text(c, relief > 0.5 ? "( ᴗ )" : "( > _ < )", 0, 280, 80, P.ink);
    });
    burst(c, f, 37, 540, 840, P.blue, 30);
  }
  if (f >= 39) {
    const appear = enter(f, 39, 12);
    text(c, "不用解释", 540, 340, 160 * appear, P.ink, -0.06);
    local(
      c,
      540 + flight * 940,
      1030 - flight * 990,
      -0.12 + flight * 0.4,
      appear * (1 - flight * 0.53),
      () => {
        if (fold < 0.97) {
          const w = mix(760, 470, fold),
            h = mix(850, 320, fold);
          round(c, -w / 2 + 18, -h / 2 + 22, w, h, 8, P.ink);
          polygon(
            c,
            [
              { x: -w / 2, y: -h / 2 },
              { x: w / 2, y: -h / 2 },
              { x: w / 2, y: h / 2 },
              { x: -w / 2 + fold * w * 0.5, y: h / 2 },
            ],
            P.paper,
            P.ink,
            4,
          );
          c.save();
          c.globalAlpha = 1 - fold;
          for (let i = 0; i < 6; i++) {
            line(
              c,
              [
                { x: -270, y: -260 + i * 102 },
                { x: 260 - (i % 2) * 115, y: -260 + i * 102 },
              ],
              i === 2 ? P.blue : P.gray,
              16,
            );
          }
          text(c, "解释解释解释", 0, -340, 50, P.ink);
          c.restore();
          polygon(
            c,
            [
              { x: -w / 2, y: -h / 2 },
              { x: w / 2, y: -h / 2 },
              { x: mix(-w / 2, w * 0.05, fold), y: h / 2 },
            ],
            P.blue,
            P.ink,
            3,
          );
          polygon(
            c,
            [
              { x: w / 2, y: -h / 2 },
              { x: w / 2, y: h / 2 },
              { x: mix(w / 2, -w * 0.2, fold), y: h / 2 },
            ],
            P.lime,
            P.ink,
            3,
          );
        } else plane(c, 0, 0, 2.3, -0.1, P.blue);
      },
    );
    if (f > 75) {
      trail(
        c,
        f,
        (t) => ({
          x: 540 + enter(t, 77, 36) * 940,
          y: 1030 - enter(t, 77, 36) * 990,
        }),
        P.blue,
        6,
        25,
      );
      face(c, 340, 1480, 115, P.lime, "happy", -0.12);
      heart(c, 560, 1400, 68 + bass * 20, P.coral);
      text(c, "呼——", 665, 1560, 91, P.ink, 0.08);
    }
  }
};

const understand: Painter = (c, f, bass) => {
  background(c, P.blue);
  const join = enter(f, 13, 29);
  const pulse = 1 + bass * 0.055;
  for (let i = 0; i < 9; i++)
    ring(
      c,
      540,
      960,
      (i * 128 + f * 7) % 1100,
      i % 3 === 0 ? "#ffffff6a" : "#ffffff24",
      i % 3 === 0 ? 4 : 2,
    );
  const a = 1 - join;
  if (a > 0.01) {
    local(c, 540, 890, 0, 1, () => {
      text(c, "?", -190 * a, -90 * a, 660 * a + 100, P.paper, -a * 0.5);
      text(c, "?", 190 * a, 90 * a, 660 * a + 100, P.lime, Math.PI + a * 0.5);
    });
  }
  if (join > 0.02) {
    local(c, 540, 925, Math.sin(f * 0.04) * 0.08, pulse, () => {
      heart(c, 13, 20, 775 * join, P.ink);
      heart(c, 0, 0, 775 * join, P.coral);
      if (join > 0.5) {
        face(c, -127, -22, 80, P.paper, "love", -0.13);
        face(c, 127, -22, 80, P.lime, "love", 0.13);
        text(c, "懂", 0, 158, 167, P.paper);
      }
    });
  }
  type3(
    c,
    f < 35 ? "我懂了" : "真的懂了",
    540,
    370,
    180,
    P.paper,
    12,
    -0.045,
    P.ink,
  );
  curvedText(
    c,
    "♥ · 你说的每一句 · ♥",
    540,
    940,
    610,
    -0.17 + f * 0.006,
    0.17,
    48,
    P.paper,
  );
  if (f > 35) {
    text(c, "( ｡ •ᴗ• ) 人 ( •ᴗ• ｡ )", 540, 1590, 65, P.paper);
    burst(c, f, 35, 540, 920, P.lime, 32);
  }
};

const letter: Painter = (c, f, bass) => {
  background(c, P.paper, true);
  const close = enter(f, 29, 21),
    explode = enter(f, 54, 28),
    spin = f * 0.003;
  if (explode < 0.98) {
    c.save();
    c.globalAlpha = Math.max(0, 1 - explode * 3);
    local(c, 540, 1010, -0.18 + spin, 1 + close * 0.1 - explode * 0.45, () => {
      const rise = enter(f, 0, 18);
      round(c, -417, -300 - rise * 175, 834, 730, 15, P.ink);
      round(c, -430, -320 - rise * 175, 834, 730, 15, P.paper, P.ink, 4);
      text(c, "这一刻", -14, -225 - rise * 50, 172, P.blue);
      face(c, -18, -15, 98, P.lime, "love");
      polygon(
        c,
        [
          { x: -450, y: -90 },
          { x: 0, y: 230 },
          { x: 450, y: -90 },
          { x: 450, y: 470 },
          { x: -450, y: 470 },
        ],
        P.blue,
        P.ink,
        5,
      );
      polygon(
        c,
        [
          { x: -450, y: 470 },
          { x: 0, y: 100 },
          { x: 450, y: 470 },
        ],
        "#2a65ff",
        P.ink,
        4,
      );
      polygon(
        c,
        [
          { x: -450, y: -90 },
          { x: 450, y: -90 },
          { x: 0, y: mix(-520, 265, close) },
        ],
        P.lime,
        P.ink,
        4,
      );
      if (close > 0.7) heart(c, 0, 155, 140 * enter(f, 42, 8), P.coral);
    });
  }
  if (explode < 0.98) c.restore();
  if (f < 54) {
    type3(
      c,
      f < 30 ? "把这一刻" : "交给我",
      540,
      310,
      180,
      P.ink,
      8,
      -0.05,
      P.gray,
    );
  } else {
    for (let i = 0; i < 28; i++) {
      const a = i * 2.399 + f * 0.019,
        r = explode * (100 + rand(i) * 750);
      const x = 540 + Math.cos(a) * r,
        y = 985 + Math.sin(a) * r * 1.13;
      if (i % 4 === 0)
        face(
          c,
          x,
          y,
          28 + rand(i + 90) * 35,
          i % 2 ? P.lime : P.blue,
          "love",
          a,
        );
      else if (i % 3 === 0) heart(c, x, y, 50 + rand(i) * 45, P.coral, a);
      else plane(c, x, y, 0.25 + rand(i) * 0.22, a, i % 2 ? P.blue : P.lime);
    }
    type3(c, "我很", 540, 705, 160 * enter(f, 54, 8), P.ink, 9, -0.07, P.gray);
    type3(
      c,
      "感激",
      540,
      1020,
      320 * enter(f, 62, 9),
      P.blue,
      15,
      0.055,
      P.ink,
    );
    star(c, 760, 1340, 56 + bass * 23, P.coral, f * 0.07);
  }
  if (f > 82) {
    const p = enter(f, 82, 11);
    ring(c, 540, 960, p * 1350, P.blue, 60);
  }
};

export const RemixParticles = () => (
  <CanvasShot paint={particles} offset={357} />
);
export const RemixUnfold = () => <CanvasShot paint={unfold} offset={486} />;
export const RemixUnderstand = () => (
  <CanvasShot paint={understand} offset={600} />
);
export const RemixLetter = () => <CanvasShot paint={letter} offset={684} />;
