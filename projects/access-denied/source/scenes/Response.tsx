import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line, box, stamp, ease, ruled } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  if (q.index < 2) {
    c.save();
    c.translate(550, 510);
    c.rotate(-0.045);
    box(c, -360, -270, 720, 560, C.paper);
    text(c, "公司解释", -295, -175, 58, C.ink, 700);
    text(c, "反滥用实验", -295, -60, 60, "#ad4b36", 700);
    text(c, "未经授权的转售 / 防蒸馏", -290, 55, 30, "#5c666b");
    ruled(c, -290, 140, 540, 3);
    c.restore();
    c.save();
    c.translate(1390, 510);
    c.rotate(0.04);
    box(c, -300, -270, 600, 560, "#172630");
    text(c, "工程师回应", -245, -170, 51, C.paper, 700);
    text(c, "3 月上线", -245, -48, 61, C.muted, 700);
    stamp(c, "宣布撤回", 0, 118, ease(f / 45));
    c.restore();
  } else {
    const t = q.index === 2 ? "为什么需要隐蔽标记？" : "限制之外，还有信任。";
    for (let i = 0; i < 14; i++)
      line(c, 100, 170 + i * 48, 1820, 170 + i * 48, "#18252e", 1);
    text(c, t, 960, 440, q.index === 2 ? 104 : 75, C.paper, 700, "center");
    text(
      c,
      q.index === 2
        ? "访问限制的执行方式，也需要解释。"
        : "反滥用的理由，能否回答透明度的质疑？",
      960,
      610,
      43,
      C.orange,
      400,
      "center",
    );
    box(c, 690, 730, 540 * ease(q.frame / 50), 5, C.orange);
  }
};
export const Response = () => <Shot id="response" paint={paint} />;
