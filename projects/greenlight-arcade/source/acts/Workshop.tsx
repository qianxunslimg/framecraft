import { Stage, type Paint } from "../Stage";
import {
  C,
  TAU,
  background,
  ball,
  bean,
  beat,
  clamp,
  confetti,
  disc,
  ellipse,
  ground,
  label,
  line,
  lyric,
  pop,
  rr,
  scope,
  text,
  title,
} from "../draw";
import { cube } from "../props";
const paint: Paint = (c, f, g) => {
  const { i, local } = lyric(g),
    n = clamp(i - 20, 0, 7),
    b = beat(g);
  background(c, f, n > 4 ? "mint" : "cream");
  ground(c, f, n > 4 ? "#e3e8be" : "#ddd5f4");
  // Back wall pipes and giant pegboard pegs give the workshop real depth.
  c.beginPath();
  c.moveTo(-40, 200);
  c.lineTo(230, 200);
  c.quadraticCurveTo(300, 200, 300, 270);
  c.lineTo(300, 460);
  c.strokeStyle = C.purple;
  c.lineWidth = 36;
  c.stroke();
  for (let j = 0; j < 5; j++) {
    ball(c, 1700, 210 + j * 112, 10, C.coral);
    line(c, 1660, 210 + j * 112, 1730, 210 + j * 112, "#22223818", 3);
  }
  if (n === 0) {
    title(c, "小 改 动", 740, 225, 100, C.ink, -0.055);
    for (let j = 0; j < 3; j++)
      cube(
        c,
        650 + j * 240,
        470 - Math.sin(b.phase * Math.PI) * 20,
        190,
        135,
        [C.lime, C.coral, C.purple][j],
        `0${j + 1}`,
        30,
      );
    bean(c, 420, 655, 0.92, g, { board: true });
    scope(c, 1420, 340, 1, Math.sin(f * 0.03) * 0.08, () => {
      line(c, 0, -300, 0, -10, C.ink, 14);
      line(c, 0, 0, -90, 90, C.purple, 25);
      line(c, 0, 0, 90, 90, C.purple, 25);
      ball(c, 0, 0, 32, C.yellow);
    });
    label(c, "14:00", 1470, 720, 250, C.yellow, 46, 0.1);
  } else if (n === 1) {
    bean(c, 960, 580, 1.03, g, { mood: "panic" });
    for (let j = 3; j >= 0; j--) {
      const span = 230 + j * 160,
        yy = 730 - j * 105,
        pp = pop((local - j * 6) / 22);
      scope(c, 960, yy + (1 - pp) * 400, 1, 0, () => {
        for (let k = -1; k <= 1; k += 2)
          rr(c, k * span - 15, -115, 30, 195, 13, C.purple);
        rr(c, -span, -90, span * 2, 40, 16, j % 2 ? C.yellow : C.coral);
        for (let k = 0; k < Math.floor(span / 50); k++)
          line(
            c,
            -span + 40 + k * 100,
            -85,
            -span + 65 + k * 100,
            -55,
            C.paper,
            10,
          );
      });
    }
    label(c, "护栏 × 4", 1520, 245, 340, C.pink, 49, 0.1);
  } else if (n === 2) {
    disc(c, 1020, 750, 520, C.purple);
    rr(c, 650, 230, 760, 470, 70, C.ink);
    rr(c, 675, 255, 710, 420, 50, "#41415e");
    const scan = (f * 5) % 380;
    rr(c, 680, 267 + scan, 700, 9, 4, C.lime);
    for (let j = 0; j < 5; j++) {
      const x = 760 + j * 128,
        y = 420 + Math.sin(f * 0.05 + j) * 70;
      ball(c, x, y, 44, C.lime);
      text(c, j % 2 ? "0" : "∅", x, y, 52, C.ink);
    }
    bean(c, 440, 640, 0.83, g, { mood: "wow" });
    label(c, "NULL CHECK", 1040, 760, 450, C.lime, 43);
  } else if (n === 3) {
    for (let j = 3; j >= 0; j--) {
      const r = 150 + j * 82;
      const pp = pop((local - (3 - j) * 6) / 20);
      scope(c, 1050, 590 + (1 - pp) * -650, 1, 0, () => {
        c.beginPath();
        c.arc(0, 0, r, Math.PI, TAU);
        c.lineTo(r, 110);
        c.lineTo(-r, 110);
        c.closePath();
        c.fillStyle = [
          C.pink + "88",
          C.blue + "55",
          C.purple + "44",
          C.yellow + "66",
        ][j];
        c.fill();
        c.strokeStyle = [C.pink, C.blue, C.purple, C.yellow][j];
        c.lineWidth = 12;
        c.stroke();
        ball(c, 0, -r - 15, 20, [C.pink, C.blue, C.purple, C.yellow][j]);
      });
    }
    bean(c, 1050, 575, 0.8, g, { mood: "tired" });
    title(c, "套 娃", 400, 320, 112, C.purple, -0.12);
    label(c, "TRY → CATCH → TRY", 1050, 790, 590, C.paper, 35);
  } else if (n === 4) {
    rr(c, 220, 300, 520, 350, 50, C.purple);
    rr(c, 250, 330, 460, 150, 26, "#a897ff");
    rr(c, 290, 535, 380, 35, 12, C.ink);
    label(c, "3 行需求", 480, 230, 340, C.yellow, 44, -0.05);
    // Unspooling receipt physically becomes a road.
    c.beginPath();
    c.moveTo(480, 553);
    c.bezierCurveTo(540, 770, 980, 220, 1200, 530);
    c.bezierCurveTo(1370, 820, 1500, 700, 1870, 390);
    c.strokeStyle = C.paper;
    c.lineWidth = 150;
    c.stroke();
    for (let j = 0; j < 15; j++) {
      const xx = 700 + j * 77,
        yy = 520 + Math.sin(j * 0.65 + f * 0.05) * 90;
      rr(c, xx, yy, 40, 8, 3, C.purple);
    }
    bean(c, 1300, 590, 0.95, g, { board: true, rotation: -0.12, mood: "wow" });
    title(c, "写到爆", 1440, 200, 100, C.coral, 0.07);
  } else if (n === 5) {
    for (let j = 0; j < 7; j++) {
      const h = 3 + (j % 3);
      for (let k = 0; k < h; k++)
        cube(
          c,
          500 + j * 150,
          740 - k * 110,
          130,
          96,
          [C.lime, C.purple, C.pink][(j + k) % 3],
          k === h - 1 ? "✓" : "",
          18,
        );
    }
    bean(c, 1040, 330 - b.pulse * 30, 0.75, g, { board: true, arms: 1 });
    label(c, "边界测试：再加一层", 960, 160, 640, C.paper, 40, -0.03);
  } else if (n === 6) {
    for (let j = 0; j < 18; j++) {
      const x = 130 + (j % 9) * 205,
        y = 220 + Math.floor(j / 9) * 250 + Math.sin(f * 0.04 + j) * 40;
      line(c, x, y + 50, x + Math.sin(j) * 30, 750, C.purple + "55", 2);
      ball(c, x, y, 45 + (j % 3) * 12, C.lime);
      text(c, "✓", x, y, 54, C.ink);
    }
    bean(c, 960, 650, 1.15, g, { arms: 1 });
    confetti(c, f, 38);
    label(c, "全 绿 了 ！", 960, 150, 440, C.yellow, 52, -0.03);
  } else {
    bean(c, 700, 630, 1.13, g, { mood: "tired" });
    const sc = pop(local / 16);
    scope(c, 1250, 435, sc, -0.1, () => {
      ellipse(c, 0, 135, 180, 40, C.purple);
      rr(c, -145, -135, 290, 280, 135, C.coral);
      rr(c, -115, -105, 47, 150, 24, "#ffffff75");
      text(c, "!", 15, 10, 200, C.paper);
      for (let j = 0; j < 7; j++) {
        const a = Math.PI + (j * Math.PI) / 6;
        line(
          c,
          Math.cos(a) * 210,
          Math.sin(a) * 210,
          Math.cos(a) * (240 + 30 * b.pulse),
          Math.sin(a) * (240 + 30 * b.pulse),
          C.coral,
          10,
        );
      }
    });
    label(c, "新警告 +1", 1250, 755, 410, C.yellow, 51, 0.045);
  }
};
export const Workshop = () => (
  <Stage paint={paint} offset={2431} duration={582} />
);
