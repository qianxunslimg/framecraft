import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line, circle, box, neural, glow } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  text(c, "2026.02", 110, 207, 60, C.muted);
  text(c, "防蒸馏，成为限制理由", 110, 310, 67, C.paper, 700);
  neural(c, f, 490, 630, 185, C.cyan);
  neural(c, -f, 1430, 630, 138, C.orange);
  for (let i = 0; i < 11; i++) {
    const y = 460 + i * 31;
    c.beginPath();
    c.moveTo(660, y);
    c.bezierCurveTo(900, y - 60, 1000, y + 60, 1260, y);
    c.strokeStyle = "#283741";
    c.lineWidth = 1;
    c.stroke();
    const x = 660 + ((f * 4 + i * 61) % 600);
    circle(
      c,
      x,
      y + Math.sin(((x - 660) / 600) * Math.PI * 2) * 20,
      3,
      i % 3 ? C.cyan : C.orange,
    );
  }
  box(c, 948, 420, 8, 390, C.orange);
  glow(c, 951, 620, 180, C.orange, 0.13);
  text(c, "模型输出", 490, 865, 33, C.paper, 400, "center");
  text(c, "训练另一模型", 1430, 865, 33, C.paper, 400, "center");
  text(
    c,
    q.index < 2
      ? "公司指控 · 并非独立裁定"
      : "实验室竞争，与普通使用，怎样划界？",
    960,
    380,
    30,
    C.orange,
    700,
    "center",
  );
  line(c, 960, 440, 960, 800, C.orange, 3);
};
export const Distillation = () => <Shot id="distillation" paint={paint} />;
