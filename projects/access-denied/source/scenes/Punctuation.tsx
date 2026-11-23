import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, box, line, circle, ease, glow } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f),
    e = ease(q.frame / 35);
  text(c, "看起来相同，读起来不同。", 110, 220, 68, C.paper, 700);
  if (q.index <= 1) {
    box(c, 180, 345, 1560, 360, "#12212b", 12);
    text(c, "Today's date is", 245, 420, 45, C.muted);
    const changed = q.index === 1 && q.frame > 40;
    text(c, changed ? "2026/06/30" : "2026-06-30", 260, 565, 120, C.paper, 700);
    const x = 260 + c.measureText("2026").width - 5;
    const markerWidth = c.measureText(changed ? "/" : "-").width + 10;
    box(c, x, 474, markerWidth, 160, "rgba(255,105,71,.15)");
    line(c, x, 641, x + markerWidth, 641, C.orange, 4);
    text(
      c,
      changed ? "分隔符变化" : "正常日期文本",
      1470,
      565,
      37,
      changed ? C.orange : C.muted,
      700,
      "center",
    );
    if (changed) text(c, "—  →  /", 960, 815, 73, C.orange, 700, "center");
  } else if (q.index === 2) {
    const xs = [420, 960, 1500],
      marks = ["'", "’", "ʼ"],
      names = ["U+0027", "U+2019", "U+02BC"];
    for (let i = 0; i < 3; i++) {
      circle(c, xs[i], 520, 155, "#12212a", "#3b5963", 2);
      text(c, marks[i], xs[i], 590, 280, i ? C.orange : C.paper, 700, "center");
      text(c, names[i], xs[i], 755, 39, C.muted, 400, "center");
    }
    line(c, 600, 520, 775, 520, C.line, 2);
    line(c, 1145, 520, 1320, 520, C.line, 2);
    text(c, "不同字符编码", 960, 840, 34, C.orange, 700, "center");
  } else {
    text(c, "Today's date is 2026/06/30", 960, 375, 65, C.paper, 400, "center");
    for (let i = 0; i < 3; i++) {
      const xx = 510 + i * 450;
      line(c, 960, 425, xx, 590, C.line, 2);
      circle(c, xx, 650, 70, "#233239", C.orange, 2);
      text(
        c,
        ["时区", "域名", "关联"][i],
        xx,
        650,
        39,
        C.orange,
        700,
        "center",
      );
      text(
        c,
        ["环境线索", "端点线索", "分类信号"][i],
        xx,
        800,
        30,
        C.muted,
        400,
        "center",
      );
    }
    glow(c, 960, 400, 300, C.orange, 0.1 * e);
  }
  text(
    c,
    "依据公开分析绘制 · 不代表所有客户端或版本",
    960,
    885,
    24,
    C.muted,
    400,
    "center",
  );
};
export const Punctuation = () => <Shot id="punctuation" paint={paint} />;
