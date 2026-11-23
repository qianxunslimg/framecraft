import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import {
  C,
  base,
  text,
  cube,
  line,
  neural,
  glow,
  circle,
  noise,
  ease,
} from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  const z = 0.72 + 0.18 * ease(f / 300);
  c.save();
  c.translate(960, 590);
  c.scale(z, z);
  // A data centre becomes the centre of a city of dependent capabilities.
  for (let i = 0; i < 38; i++) {
    const a = i * 2.39996,
      r = 350 + noise(i) * 560;
    const x = Math.cos(a) * r,
      y = Math.sin(a) * r * 0.36 + 100;
    line(c, 0, -130, x, y, C.line, 1);
    cube(
      c,
      x,
      y,
      38 + noise(i + 50) * 32,
      45 + noise(i + 90) * 125,
      23,
      C.deep,
      i % 4 === 0 ? C.orange : C.cyan,
    );
    const t = (f * 0.008 + i * 0.2) % 1;
    circle(c, x * t, -130 + (y + 130) * t, 2.5, C.cyan);
  }
  neural(c, f, 0, -130, 185, C.cyan);
  glow(c, 0, -130, 210, C.cyan, 0.1);
  c.restore();
  if (q.index < 2) {
    text(c, "从一个账号", 110, 230, 73, C.paper, 700);
    text(c, "到一种基础能力", 110, 330, 73, C.orange, 700);
  } else {
    text(c, "如果 AGI 到来", 110, 230, 97, C.paper, 700);
    text(c, "科研 / 工业 / 国防", 115, 345, 39, C.orange);
  }
  text(c, "条件推演", 1730, 820, 26, C.muted, 400, "right");
};
export const Future = () => <Shot id="future" paint={paint} />;
