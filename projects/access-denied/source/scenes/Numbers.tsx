import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, box, line, circle, ease, glow } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f, true);
  const q = stage(s, f),
    p = ease(f / 80);
  text(c, "2026.09 / 一名付费用户的记录", 110, 210, 44, "#59636c");
  if (q.index === 0) {
    text(c, Math.round(20 * p).toString(), 140, 485, 270, C.ink, 700);
    text(c, "分钟", 580, 545, 86, C.ink, 700);
    text(c, "新开通 Pro 后，报告被停用", 120, 760, 64, "#a83e2e", 700);
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
      const x = 1370 + Math.cos(a) * 235,
        y = 490 + Math.sin(a) * 235;
      circle(c, x, y, 14, i < 20 * p ? "#ba4d35" : "#c7c1b5");
    }
    text(c, "ACCESS", 1370, 460, 52, "#59636c", 400, "center");
    text(c, "SUSPENDED", 1370, 540, 53, "#a83e2e", 700, "center");
  } else if (q.index === 1) {
    const xs = [270, 760, 1310];
    for (let i = 0; i < 3; i++) {
      if (i < 2) line(c, xs[i], 505, xs[i + 1], 505, "#b3a899", 4);
      circle(c, xs[i], 505, 17, i === 1 ? "#3f8c7a" : "#b74933");
      text(
        c,
        ["09.24", "09.25", "09.29—30"][i],
        xs[i],
        380,
        47,
        "#59636c",
        700,
        "center",
      );
      text(
        c,
        ["停用 / 申诉", "更新：已解封", "退款与访问变化"][i],
        xs[i],
        660,
        44,
        C.ink,
        700,
        "center",
      );
    }
    text(
      c,
      "原帖也记录了安全相关提示；具体风控记录并未公开",
      960,
      825,
      32,
      "#64594e",
      400,
      "center",
    );
  } else {
    text(c, "原本，只想稳定工作。", 960, 350, 84, C.ink, 700, "center");
    const labels = ["排查环境", "等待申诉", "确认访问"];
    labels.forEach((label, i) => {
      const x = 260 + i * 520;
      box(c, x - 90, 490, 425, 180, "#ded7cb", 8);
      text(c, label, x + 120, 580, 51, "#a83e2e", 700, "center");
      if (i < 2) line(c, x + 350, 580, x + 415, 580, "#a83e2e", 3);
    });
    glow(c, 960, 720, 280, C.orange, 0.03);
    text(
      c,
      "账号的不确定性，变成了额外的使用成本",
      960,
      830,
      43,
      "#59636c",
      400,
      "center",
    );
  }
};
export const Numbers = () => <Shot id="numbers" paint={paint} />;
