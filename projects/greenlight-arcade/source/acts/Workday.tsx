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
  clock,
  cloud,
  confetti,
  disc,
  ease,
  ellipse,
  ground,
  label,
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
function rocket(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  f: number,
) {
  scope(c, x, y, s, Math.sin(f * 0.03) * 0.04, () => {
    ellipse(c, 0, 125, 35, 85 + beat(f).pulse * 40, C.coral);
    ellipse(c, 0, 125, 19, 55, C.yellow);
    rr(c, -57, -140, 114, 270, 57, C.paper);
    ellipse(c, 0, -152, 56, 70, C.coral);
    rr(c, -57, -140, 114, 120, 30, C.paper);
    ring(c, 0, -35, 39, C.purple, 13);
    ball(c, 0, -35, 29, C.blue);
    text(c, "发", 0, 52, 45, C.ink);
    for (const k of [-1, 1]) {
      scope(c, k * 65, 85, 1, k * 0.3, () =>
        rr(c, -20, -55, 40, 130, 17, C.purple),
      );
    }
  });
}
const paint: Paint = (c, f, g) => {
  const { i, local } = lyric(g);
  const q = Math.max(0, Math.min(7, i));
  const p = ease(local / 18);
  background(c, f, q < 4 ? "cream" : "mint");
  ground(c, f, q < 4 ? "#eadfff" : "#c6eab3");
  cloud(c, 240, 210, 0.7);
  cloud(c, 1720, 170, 1);
  // Layered mechanical hills and a continuous conveyor establish the little world.
  for (let j = 0; j < 8; j++) {
    const x = j * 280 - 100 - ((f * 2) % 280);
    rr(c, x, 766, 210, 60, 18, j % 2 ? C.purple : C.pink);
    ellipse(c, x + 45, 832, 18, 18, C.ink);
    ellipse(c, x + 165, 832, 18, 18, C.ink);
  }
  if (q < 4) {
    clock(c, 360, 320, 132, g);
    label(c, "10:00", 360, 515, 210, C.yellow, 48, -0.07);
    disc(c, 1100, 765, 450, C.purple);
    if (q === 0) {
      bean(c, 920, 600, 1.18, g, { board: true });
      scope(c, 1430, 370, 1, 0.07 * Math.sin(g * 0.04), () => {
        rr(c, -180, -110, 360, 220, 55, C.paper);
        text(c, "今天能发吗？", 0, -15, 47, C.ink);
        pathTail(c);
      });
      for (let j = 0; j < 3; j++)
        ball(
          c,
          1220 + j * 65,
          610 - Math.sin((f + j * 10) * 0.05) * 20,
          17,
          C.coral,
        );
    } else if (q === 1) {
      bean(c, 820, 650, 1.05, g, { mood: "wow" });
      rocket(c, 1320, 480 - 60 * p, 1, g);
      arrow(c, 1095, 480, 0.6, -0.5, C.coral);
      label(c, "READY?", 1410, 210, 270, C.lime, 45, 0.09);
    } else if (q === 2) {
      bean(c, 1110, 625, 1.15, g, { mood: "panic" });
      for (let j = 0; j < 3; j++) {
        const pp = pop((local - j * 11) / 22);
        shield(
          c,
          1110 + (j - 1) * 240,
          460 - (1 - pp) * 700,
          0.68 * clamp(pp, 0, 1.2),
          [C.blue, C.purple, C.coral][j],
          (j - 1) * 0.15,
        );
      }
      label(c, "装备 +1 +1 +1", 1110, 210, 490, C.yellow, 39, -0.035);
    } else {
      for (let j = 0; j < 6; j++) {
        const a = (j * TAU) / 6 + f * 0.012;
        shield(
          c,
          1110 + Math.cos(a) * 370,
          540 + Math.sin(a) * 230,
          0.46,
          [C.blue, C.purple, C.coral][j % 3],
          a * 0.15,
        );
      }
      bean(c, 1110, 610, 1.2, g, {
        mood: "panic",
        bounce: Math.sin(g * 1.4) * 6,
      });
      title(c, "怕！", 1590, 320, 122, C.coral, -0.15);
      star(c, 1510, 495, 50, C.yellow, g * 0.04);
    }
  } else {
    const xx = 590;
    rr(c, 220, 240, 550, 345, 40, C.ink);
    rr(c, 240, 260, 510, 300, 28, C.paper);
    rr(c, 450, 585, 90, 110, 16, C.purple);
    disc(c, 495, 715, 155, C.purple);
    for (let j = 0; j < 4; j++) {
      rr(
        c,
        273,
        290 + j * 55,
        70 + j * 65,
        20,
        8,
        [C.purple, C.coral, C.blue, C.green][j],
      );
    }
    if (q === 4) {
      text(c, "BUILD", 600, 305, 27, C.ink);
      ball(c, 610, 437, 70, C.lime);
      text(c, "✓", 610, 438, 85, C.ink);
      bean(c, 1170, 620, 1.22, g, { arms: 1 });
      label(c, "编译成功", 1180, 280, 360, C.lime, 49, -0.06);
      confetti(c, f, 25);
    } else if (q === 5) {
      bean(c, 1110, 640, 1.03, g, {
        board: true,
        mood: "wow",
        rotation: -0.15,
      });
      const ex = local > 30;
      rocket(
        c,
        1490,
        ex ? 350 - 160 * ease((local - 30) / 25) : 470,
        ex ? 0.8 : 1,
        g,
      );
      if (ex) {
        burst(c, local - 30, 1490, 420, C.coral, 35, 320);
        title(c, "BOOM!", 1490, 320, 100, C.coral, -0.12);
      }
      text(c, "RUN", 620, 440, 65, C.green);
    } else if (q === 6) {
      for (let j = 0; j < 7; j++) {
        const yy = 235 + j * 77 - ((f * 2) % 77);
        paper(c, 1450 + Math.sin(j) * 60, yy, 0.44, j % 2 ? 0.1 : -0.1, "OK");
      }
      bean(c, 1100, 630, 1.1, g, { mood: "smug" });
      text(c, "ALL OK", xx, 440, 58, C.green);
      label(c, "日志：正常", 1250, 210, 350, C.lime, 42, 0.04);
    } else {
      bean(c, 1090, 630, 1.1, g, { mood: "tired" });
      const a = pop(local / 14);
      scope(c, 1450, 510, a, -0.14, () => {
        ball(c, 0, 0, 165, C.coral);
        text(c, "但", 0, -23, 126, C.paper);
        text(c, "是", 0, 88, 68, C.ink);
      });
      text(c, "…", xx, 440, 95, C.purple);
      paper(c, 1500, 755, 0.4, -0.2, "WAIT");
    }
  }
};
function pathTail(c: CanvasRenderingContext2D) {
  c.beginPath();
  c.moveTo(-75, 95);
  c.lineTo(-95, 155);
  c.lineTo(-15, 95);
  c.fillStyle = C.paper;
  c.fill();
}
export const Workday = () => (
  <Stage paint={paint} offset={308} duration={582} />
);
