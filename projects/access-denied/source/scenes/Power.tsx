import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import {
  C,
  base,
  text,
  line,
  circle,
  glow,
  poly,
  neural,
  box,
  ease,
} from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  const cx = 960,
    cy = 560;
  neural(c, f, cx, cy, 190, C.orange);
  // Six apertures around a single hub: decisions alter the flow outward.
  const labels = ["科学", "医疗", "能源", "工业", "教育", "安全"];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 2,
      x = cx + Math.cos(a) * 650,
      y = cy + Math.sin(a) * 285;
    const blocked = i % 2 === 1;
    line(c, cx, cy, x, y, blocked ? "#584036" : "#284b50", 3);
    const t = (f * 0.005 + i * 0.2) % 1;
    if (!blocked || t < 0.55)
      circle(
        c,
        cx + (x - cx) * t,
        cy + (y - cy) * t,
        5,
        blocked ? C.orange : C.cyan,
      );
    circle(c, x, y, 58, "#12212b", blocked ? C.orange : C.cyan, 2);
    text(c, labels[i], x, y, 31, C.paper, 700, "center");
    if (blocked) {
      const mx = cx + (x - cx) * 0.58,
        my = cy + (y - cy) * 0.58;
      line(c, mx - 15, my - 15, mx + 15, my + 15, C.orange, 5);
      line(c, mx - 15, my + 15, mx + 15, my - 15, C.orange, 5);
    }
  }
  const words = [
    "谁被允许？谁被排除？",
    "谁的立场，成为规则？",
    "谁来约束这种权力？",
  ];
  text(c, words[q.index], 960, 200, 81, C.paper, 700, "center");
  if (q.index === 2) {
    const k = ease(q.frame / 60);
    poly(
      c,
      [
        [910, 0],
        [1010, 0],
        [990, cy - 175 * k],
        [930, cy - 175 * k],
      ],
      "#2f3d46",
    );
    box(c, 908, cy - 200, 104, 55, C.paper, 9);
    glow(c, 960, cy - 155, 120, C.orange, 0.22);
  }
};
export const Power = () => <Shot id="power" paint={paint} />;
