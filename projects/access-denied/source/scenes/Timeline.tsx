import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line, circle, box, ease, glow } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  text(c, "从规则，到用户的日常。", 110, 240, 90, C.paper, 700);
  const names = [
      "地区与控制关系",
      "集中封号反馈",
      "标记机制争议",
      "停用与申诉",
    ],
    dates = ["2025.09", "2026.06", "2026.07", "2026.09"];
  for (let i = 0; i < 4; i++) {
    const x = 250 + i * 470;
    const h = 150 + i * 57;
    box(c, x - 60, 790 - h, 120, h, i === 3 ? "#49312d" : "#142b35");
    line(c, x, 450, x, 825, C.line, 2);
    circle(c, x, 510, 12, C.orange);
    text(c, dates[i], x, 420, 39, C.muted, 400, "center");
    text(c, names[i], x, 875, 33, C.paper, 700, "center");
    if (i < 3) line(c, x + 16, 510, x + 454, 510, C.orange, 2);
  }
  const xx = 250 + 1410 * ease(f / (s.duration * 0.65));
  glow(c, xx, 510, 85, C.orange, 0.35);
  circle(c, xx, 510, 8, C.paper);
  if (q.index === 2) {
    box(c, 520, 575, 900, 75, C.paper);
    text(
      c,
      "7 月机制争议 → 9 月用户继续报告封号",
      970,
      612,
      37,
      C.ink,
      700,
      "center",
    );
  } else if (q.index === 3) {
    text(c, "谁来解释，谁来纠错？", 960, 620, 57, C.orange, 700, "center");
  }
};
export const Timeline = () => <Shot id="timeline" paint={paint} />;
