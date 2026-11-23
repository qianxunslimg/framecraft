import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line, box, globe, circle, ease } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  globe(c, 1250, 480, 310, f, C.cyan);
  text(c, "2023.07", 112, 240, 100, C.paper, 700);
  text(c, "第一道门：地区", 120, 390, 65, C.orange, 700);
  if (q.index === 0) {
    text(c, "Claude.ai 公测", 124, 510, 42, C.paper);
    text(c, "美国 / 英国", 124, 610, 66, C.paper, 700);
  } else {
    text(c, "中国大陆未获正式支持", 124, 510, 45, C.paper, 700);
    text(c, "能够访问 ≠ 官方开放", 124, 620, 37, C.muted);
  }
  // Traveling request packets meet a vertical filtering plane.
  const gate = 1525;
  box(c, gate, 180, 4, 620, C.orange);
  for (let i = 0; i < 18; i++) {
    const y = 220 + i * 31,
      x = 950 + ((f * 5 + i * 63) % 730);
    const allowed = i % 4 === 0 && q.index === 0;
    const xx = allowed ? x : Math.min(x, gate - 8);
    c.globalAlpha = x > gate && !allowed ? 0.3 : 1;
    line(c, xx - 18, y, xx, y, allowed ? C.cyan : C.orange, 3);
    if (x > gate && !allowed)
      circle(
        c,
        gate,
        y,
        3 + ease((x - gate) / 100) * 5,
        "transparent",
        C.orange,
        1,
      );
  }
  c.globalAlpha = 1;
  text(c, "REGION CHECK", 1430, 850, 24, C.muted, 400, "center");
};
export const Regions = () => <Shot id="regions" paint={paint} />;
