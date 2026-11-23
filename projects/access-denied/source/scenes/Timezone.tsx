import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line, box, clock, ease, circle, glow } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  const scan = (f * 2.6) % 640;
  clock(c, 565, 520, 250, f * 1.2, C.orange);
  text(c, "DEVICE TIMEZONE", 565, 845, 27, C.muted, 400, "center");
  const x = 1040;
  line(c, 890, 270, 890, 830, C.line, 1);
  text(c, "设备环境", x, 275, 75, C.paper, 700);
  text(c, "Asia/Shanghai", x, 415, 48, q.index >= 2 ? C.orange : C.paper, 700);
  text(c, "Asia/Urumqi", x, 505, 48, q.index >= 2 ? C.orange : C.paper, 700);
  text(c, "代理端点 hostname", x, 625, 35, C.muted);
  box(c, x, 690, 660, 64, "#172b35");
  text(c, "特定第三方端点路径", x + 22, 720, 33, C.cyan);
  if (q.index === 3) {
    text(c, "时区 ≠ 国籍", x, 835, 43, C.orange, 700);
  }
  c.save();
  c.globalAlpha = 0.7;
  line(c, 275, 200 + scan, 835, 200 + scan, C.orange, 2);
  glow(c, 550, 200 + scan, 160, C.orange, 0.09);
  c.restore();
  const k = ease(q.frame / 35);
  circle(c, 900, 520, 8, C.cyan);
  line(c, 900, 520, 1020, 520, C.cyan, 2 * k);
};
export const Timezone = () => <Shot id="timezone" paint={paint} />;
