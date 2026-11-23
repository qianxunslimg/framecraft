import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, box, line, ruled, ease } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  const e = ease(f / 45);
  c.save();
  c.translate(980, 480);
  c.rotate(-0.025 + f * 0.000015);
  c.scale(0.94 + 0.06 * e, 0.94 + 0.06 * e);
  box(c, -785, -310, 1570, 690, C.paper);
  text(c, "ANTHROPIC / OFFICIAL POLICY", -715, -250, 22, "#686e70");
  text(c, "September 4, 2025", 705, -250, 24, "#686e70", 400, "right");
  ruled(c, -710, -175, 1390, 3);
  const words =
    q.index === 0
      ? "adversarial nations like China"
      : "serve US and allied strategic interests";
  const len = q.index === 0 ? 1010 : 1340;
  box(c, -715, -60, len * ease(q.frame / 28), 104, C.orange);
  text(c, words, -695, -8, q.index === 0 ? 67 : 53, C.ink, 700);
  text(
    c,
    q.index === 0 ? "“像中国这样的对手国家”" : "“服务美国及盟友的战略利益”",
    -710,
    132,
    59,
    C.ink,
    700,
  );
  line(c, -710, 240, 700, 240, "#c4bdb3", 2);
  text(c, "引文摘录 · 自主排版 · 非网页截图", -710, 300, 23, "#74756e");
  c.restore();
};
export const Adversary = () => <Shot id="adversary" paint={paint} />;
