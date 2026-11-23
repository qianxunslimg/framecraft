import { Stage, type Paint } from "../Stage";
import {
  C,
  TAU,
  arrow,
  background,
  ball,
  bean,
  beat,
  burst,
  clamp,
  confetti,
  disc,
  ease,
  label,
  line,
  lyric,
  paper,
  pop,
  ring,
  rr,
  scope,
  shield,
  star,
  text,
  title,
} from "../draw";
const makePaint =
  (second: boolean): Paint =>
  (c, f, g) => {
    const { i, local } = lyric(g);
    const n = clamp(i - (second ? 32 : 12), 0, 7);
    const b = beat(g);
    const dark = second;
    background(c, f, dark ? "night" : n % 3 === 0 ? "pink" : "cream");
    if (second) {
      c.save();
      c.globalAlpha = 0.12;
      for (let j = 0; j < 4; j++) {
        const x = 230 + j * 490;
        c.beginPath();
        c.moveTo(x, -30);
        c.lineTo(x - 210 + Math.sin(f * 0.023 + j) * 180, 910);
        c.lineTo(x + 210 + Math.sin(f * 0.023 + j) * 180, 910);
        c.closePath();
        c.fillStyle = [C.lime, C.pink, C.blue, C.purple][j];
        c.fill();
      }
      c.restore();
      for (let j = 0; j < 20; j++)
        ball(
          c,
          80 + j * 93,
          75 + Math.sin(j * 0.4) * 20,
          8 + b.pulse * 3,
          [C.yellow, C.pink, C.lime][j % 3],
        );
      confetti(c, f, 22, 0.5);
    }
    const fg = dark ? C.paper : C.ink;
    const cam = 1 + 0.018 * Math.sin(f * 0.025) + 0.012 * b.pulse;
    scope(c, 960, 510, cam, 0.012 * Math.sin(f * 0.015), () => {
      c.translate(-960, -510);
      for (let j = 0; j < 8; j++) {
        const a = (j * TAU) / 8 + f * 0.004;
        star(
          c,
          960 + Math.cos(a) * 820,
          480 + Math.sin(a) * 360,
          16 + 9 * b.pulse,
          [C.coral, C.purple, C.lime][j % 3],
          a,
        );
      }
      if (n === 0) {
        // A giant two-way sign swings like a mechanical seesaw.
        const flip = Math.sin(local * 0.075);
        disc(c, 960, 750, 650, C.purple);
        scope(c, 960, 440, 1, flip * 0.15, () => {
          line(c, -510, 0, 510, 0, C.ink, 34);
          arrow(c, -390, 0, 1.5, Math.PI, C.coral);
          arrow(c, 390, 0, 1.5, 0, C.lime);
          title(c, "这个", -390, -135, 100, fg, -0.03);
          title(c, "那个", 390, 135, 100, fg, 0.03);
          bean(c, flip * 260, 10, 0.86, g, {
            board: true,
            rotation: -flip * 0.2,
            mood: "wow",
          });
        });
        label(c, "不是  ↔  而是", 960, 205, 510, C.yellow, 45, -0.04);
      } else if (n === 1) {
        title(c, "≠", 960, 460, 440, C.coral, Math.sin(f * 0.04) * 0.08);
        for (let j = 0; j < 5; j++) {
          ring(c, 960, 490, 180 + j * 52, C.purple, 3);
        }
        bean(c, 460, 615, 1.12, g, {
          mood: "wow",
          board: true,
          rotation: -0.15,
        });
        bean(c, 1490, 615, 0.82, g, { mood: "tired", color: C.pink });
        label(c, "不能这样", 440, 280, 350, C.lime, 47, -0.12);
        label(c, "不代表啦", 1460, 300, 350, C.pink, 47, 0.12);
      } else if (n === 2) {
        disc(c, 960, 790, 420, second ? C.coral : C.pink);
        bean(c, 960, 640, 1.15, g, { arms: 1, mood: "panic" });
        for (let j = 0; j < 3; j++) {
          const t = pop((local - j * 11) / 19),
            angle = (j - 1) * 0.7;
          const xx = 960 + Math.sin(angle) * 400,
            yy = 460 - Math.cos(angle) * 90;
          shield(
            c,
            xx,
            yy - (1 - t) * 600,
            0.82 * clamp(t, 0, 1.3),
            [C.blue, C.purple, C.coral][j],
            angle * 0.3,
          );
        }
        title(c, "叠！叠！叠！", 960, 160, 94, fg, -0.02);
        if (second) confetti(c, f, 30, 0.8);
      } else if (n === 3) {
        // Fully occupied carousel, with foreground/background occlusion.
        disc(c, 960, 720, 530, C.purple);
        const a = f * 0.055;
        for (let back = 0; back < 2; back++) {
          for (let j = 0; j < 8; j++) {
            const q = a + (j * TAU) / 8,
              z = Math.sin(q);
            if ((z < 0 ? 0 : 1) !== back) continue;
            const x = 960 + Math.cos(q) * 510,
              y = 510 + z * 180;
            if (j % 2 === 0) {
              label(
                c,
                j % 4 === 0 ? "虽然" : "但是",
                x,
                y,
                210,
                j % 4 === 0 ? C.yellow : C.pink,
                42,
                q * 0.12,
              );
            } else
              bean(c, x, y, 0.4 + z * 0.1, g, {
                board: true,
                rotation: Math.sin(q) * 0.15,
              });
          }
          if (back === 0) {
            ball(c, 960, 440, 140, C.lime);
            text(c, "绕", 960, 435, 115, C.ink);
            line(c, 960, 580, 960, 720, C.ink, 15);
          }
        }
        text(c, "ROUND & ROUND", 960, 170, 42, second ? C.pink : C.purple);
        ring(c, 960, 450, 320, "#8570ed30", 3);
      } else if (n === 4) {
        const close = clamp(local / 40);
        const gap = 320 - 120 * close;
        text(c, "(", 960 - gap, 510, 580, C.purple);
        text(c, ")", 960 + gap, 510, 580, C.coral);
        const hide = ease((local - 25) / 38);
        scope(c, 960, 470, 1 - hide * 0.96, hide * 0.4, () => {
          ball(c, 0, 0, 120, C.lime);
          text(c, "结论", 0, -5, 68, C.ink);
        });
        bean(c, 1510, 675, 0.94, g, { mood: "wow", rotation: 0.12 });
        label(c, "藏起来了", 500, 280, 350, C.pink, 45, -0.12);
        for (let j = 0; j < 6; j++)
          paper(
            c,
            310 + j * 250,
            780 + Math.sin(j + f * 0.1) * 15,
            0.25,
            j * 0.15,
            "(...)",
          );
      } else if (n === 5) {
        const level = Math.min(9, Math.floor(local / 6) + 2);
        const sway = Math.sin(f * 0.055) * 0.045;
        scope(c, 1110, 800, 1, sway, () => {
          for (let j = 0; j < level; j++) {
            scope(
              c,
              Math.sin(j * 0.8) * 25,
              -j * 65,
              0.95,
              Math.sin(j + f * 0.02) * 0.025,
              () => {
                rr(c, -240, -51, 480, 65, 12, j % 2 ? C.paper : C.pale);
                rr(c, -240, 0, 480, 13, 5, "#c6beda");
                text(c, j % 2 ? "但是…" : "免责声明", 0, -24, 26, C.purple);
              },
            );
          }
        });
        bean(c, 540, 660, 1.08, g, { mood: "wow" });
        title(c, "高——塔", 520, 295, 95, fg, -0.1);
        label(c, `${level} 层`, 1570, 505, 210, C.yellow, 48, 0.13);
        for (let j = 0; j < 4; j++)
          paper(c, 1540 + j * 45, 200 + j * 100, 0.3, 0.1 * j, "BUT");
      } else if (n === 6) {
        const bounce = Math.sin(b.phase * Math.PI) * 20;
        title(c, "行", 560, 390 + bounce, 210, C.green, -0.12);
        title(c, "不行", 1390, 390 - bounce, 180, C.coral, 0.1);
        ball(c, 960, 445, 170, C.yellow);
        text(c, "?", 960, 435, 270, C.ink);
        bean(c, 960, 760, 0.66, g, { mood: "tired", arms: 1 });
        for (let j = 0; j < 12; j++) {
          const a = (j * TAU) / 12 + f * 0.01;
          ball(
            c,
            960 + Math.cos(a) * 660,
            480 + Math.sin(a) * 290,
            11,
            C.purple,
          );
        }
      } else {
        const t = pop(local / 14);
        disc(c, 960, 760, 620, C.lime);
        bean(c, 500, 660, 1, g, { mood: "panic", rotation: -0.12 });
        scope(c, 1130, 465 + (1 - t) * -450, 1.1, -0.14, () => {
          rr(c, -120, -290, 240, 145, 70, C.purple);
          rr(c, -55, -160, 110, 100, 25, C.ink);
          rr(c, -420, -50 + 19, 840, 245, 32, C.ink);
          rr(c, -420, -50, 840, 245, 32, C.coral);
          rr(c, -392, -22, 784, 190, 20, C.paper);
          text(c, "未 核 实", 0, 75, 110, C.coral);
        });
        if (local > 9 && local < 37)
          burst(c, local - 9, 1140, 720, C.coral, 28, 450);
        label(c, "不应假定！", 1220, 795, 460, C.yellow, 55, 0.06);
        if (second) confetti(c, f, 45);
      }
    });
  };
const paint1 = makePaint(false),
  paint2 = makePaint(true);
export const ChorusOne = () => (
  <Stage paint={paint1} offset={1199} duration={676} />
);
export const ChorusTwo = () => (
  <Stage paint={paint2} offset={3388} duration={690} />
);
