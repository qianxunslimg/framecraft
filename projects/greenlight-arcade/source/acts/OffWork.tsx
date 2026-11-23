import { Stage, type Paint } from "../Stage";
import {
  C,
  arrow,
  background,
  ball,
  bean,
  clamp,
  confetti,
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
  const { i, local } = lyric(g),
    n = i < 0 ? 3 : clamp(i - 40, 0, 3),
    p = ease(local / 24);
  background(c, f, "cream");
  ground(c, f, "#e7dcf4");
  // One continuous exit scene: the door keeps moving away from our hero.
  const doorX = 1450 + (n === 1 ? Math.sin(local * 0.06) * 160 : 0);
  scope(c, doorX, 490, 1, 0, () => {
    rr(c, -200, -310, 400, 625, 190, C.purple);
    rr(c, -157, -267, 314, 582, 150, C.lime);
    rr(c, -138, -248, 276, 560, 135, "#c5f66c");
    text(c, "EXIT", 0, -190, 68, C.ink);
    line(c, -30, -10, 65, -10, C.ink, 16);
    arrow(c, 40, -10, 0.45, 0, C.ink);
    rr(c, -210, 300, 420, 28, 12, C.ink);
  });
  if (n === 0) {
    bean(c, 700 + p * 220, 640, 1.12, g, { board: true, arms: 1 });
    title(c, "唱完啦！", 650, 250, 119, C.coral, -0.08);
    confetti(c, f, 24);
  } else if (n === 1) {
    const pull = Math.sin(local * 0.035) * 110;
    bean(c, 900 - pull, 650, 1.12, g, {
      board: true,
      mood: "wow",
      rotation: -0.13,
    });
    // Elastic tether is visibly stretched back to a huge keyboard key.
    c.beginPath();
    c.moveTo(190, 650);
    c.bezierCurveTo(400, 430, 620, 860, 900 - pull, 650);
    c.strokeStyle = C.coral;
    c.lineWidth = 17;
    c.stroke();
    rr(c, 80, 550, 260, 180, 38, C.purple);
    text(c, "CTRL", 210, 633, 48, C.paper);
    title(c, "还不能走？", 770, 230, 102, C.purple, -0.03);
  } else if (n === 2) {
    for (let j = 0; j < 7; j++) {
      ball(c, 210 + j * 240, 200 + Math.sin(f * 0.05 + j) * 40, 46, C.lime);
      text(c, "✓", 210 + j * 240, 200 + Math.sin(f * 0.05 + j) * 40, 48, C.ink);
    }
    bean(c, 850, 640, 1.18, g, { mood: "tired" });
    label(c, "灯 是 绿 的", 810, 385, 470, C.yellow, 49, -0.06);
  } else {
    const ax = 970 + Math.sin(local * 0.04) * 180,
      ay = 485 + Math.cos(local * 0.035) * 60;
    bean(c, 880, 650, 1.12, g, { mood: "wow" });
    line(c, ax + 90, ay + 100, ax + 230, ay + 260, C.coral, 47);
    ellipse(c, ax, ay, 150, 150, "#69bce83a");
    ring(c, ax, ay, 151, C.purple, 26);
    ring(c, ax, ay, 125, C.paper, 5);
    title(c, "再 查 查", 600, 245, 119, C.coral, -0.055);
    star(c, ax - 45, ay - 65, 25, C.paper);
  }
};
export const OffWork = () => (
  <Stage paint={paint} offset={4078} duration={377} />
);
