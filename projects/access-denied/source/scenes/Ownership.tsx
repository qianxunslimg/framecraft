import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line, circle, cube, ease, glow } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  text(c, "2025.09.04", 110, 210, 57, C.muted);
  text(c, "海外注册，也可能被限制", 110, 315, 64, C.paper, 700);
  const root = { x: 960, y: 505 };
  const children = [
    { x: 420, y: 750 },
    { x: 960, y: 750 },
    { x: 1500, y: 750 },
  ];
  for (let i = 0; i < 3; i++) {
    const ch = children[i];
    c.beginPath();
    c.moveTo(root.x, root.y);
    c.bezierCurveTo(root.x, 640, ch.x, 590, ch.x, ch.y);
    c.strokeStyle = C.line;
    c.lineWidth = 4;
    c.stroke();
    const t = (f * 0.004 + i * 0.24) % 1;
    const x = root.x + (ch.x - root.x) * t,
      y = root.y + (ch.y - root.y) * t;
    circle(c, x, y, 7, C.orange);
    glow(c, x, y, 35, C.orange, 0.3);
    cube(
      c,
      ch.x - 45,
      ch.y,
      90,
      110,
      35,
      C.deep,
      q.index >= 1 ? C.orange : C.cyan,
    );
    text(
      c,
      ["海外实体 A", "海外实体 B", "海外实体 C"][i],
      ch.x,
      ch.y + 67,
      31,
      C.paper,
      400,
      "center",
    );
    if (q.index >= 1) {
      const a = ease((q.frame - i * 12) / 25);
      line(c, ch.x - 75, ch.y - 155, ch.x + 105, ch.y + 20, C.orange, 4 * a);
    }
  }
  cube(c, root.x - 65, root.y, 130, 100, 40, C.deep, C.orange);
  text(c, "控制主体", root.x + 210, root.y - 45, 35, C.orange, 700);
  text(
    c,
    q.index < 2 ? "限制沿控制关系延伸" : "不仅看在哪里，还看由谁控制",
    120,
    870,
    35,
    C.muted,
  );
};
export const Ownership = () => <Shot id="ownership" paint={paint} />;
