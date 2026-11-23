import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, globe, line, ease, glow } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  c.save();
  c.globalAlpha = 0.32;
  globe(c, 960, 600, 550, f * 0.5, C.cyan);
  c.restore();
  if (q.index < 2) {
    text(
      c,
      q.index === 0 ? "公司可以选择客户。" : "谁能划定所有人的未来？",
      960,
      440,
      q.index === 0 ? 78 : 86,
      C.paper,
      700,
      "center",
    );
    if (q.index === 1)
      text(
        c,
        "当一种技术，足以影响所有人",
        960,
        595,
        43,
        C.muted,
        400,
        "center",
      );
  } else {
    const shift = q.index === 3 ? ease(q.frame / 40) : 0;
    text(
      c,
      "智能",
      960 - 300 * shift,
      430,
      150,
      q.index === 3 ? C.muted : C.paper,
      700,
      "center",
    );
    if (q.index === 3) {
      text(c, "权力", 960 + 300 * shift, 430, 150, C.orange, 700, "center");
      line(c, 960, 320, 960, 560, C.line, 2);
    }
    text(
      c,
      q.index === 2 ? "AGI 会有多聪明？" : "谁掌握它？谁约束它？",
      960,
      670,
      65,
      C.paper,
      700,
      "center",
    );
  }
  glow(c, 960, 930, 650, C.orange, 0.07);
};
export const Finale = () => <Shot id="finale" paint={paint} />;
