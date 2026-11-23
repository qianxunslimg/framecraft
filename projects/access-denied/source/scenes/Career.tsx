import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line, circle, cube, ease, glow, neural } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f),
    progress = ease(f / 180);
  if (q.index === 0) {
    text(c, "从研究员，到公司掌舵人", 110, 220, 65, C.paper, 700);
    const xs = [240, 700, 1160, 1620],
      names = ["百度", "Google Brain", "OpenAI", "Anthropic"];
    for (let i = 0; i < 4; i++) {
      line(c, xs[i], 560, i === 3 ? 1810 : xs[i + 1], 560, "#293e49", 4);
      const a = ease((progress * 4 - i) * 2);
      c.globalAlpha = 0.3 + 0.7 * a;
      cube(
        c,
        xs[i] - 55,
        495,
        110,
        110 + i * 25,
        45,
        C.deep,
        i === 3 ? C.orange : C.cyan,
      );
      circle(c, xs[i], 560, 9, i === 3 ? C.orange : C.cyan);
      text(c, names[i], xs[i], 660, 38, C.paper, 700, "center");
      text(
        c,
        ["2014", "研究", "GPT-2 / GPT-3", "2021"][i],
        xs[i],
        715,
        24,
        C.muted,
        400,
        "center",
      );
    }
    c.globalAlpha = 1;
    const xx = 240 + 1380 * ((f * 0.003) % 1);
    glow(c, xx, 560, 60, C.cyan, 0.5);
    circle(c, xx, 560, 6, C.white);
  } else if (q.index === 1) {
    for (let i = 0; i < 13; i++)
      line(c, 100, 260 + i * 34, 1820, 260 + i * 34, "#182730", 1);
    text(c, "2014 / 百度硅谷实验室", 960, 440, 82, C.paper, 700, "center");
    text(
      c,
      "本人公开回忆 · 语音识别研究 · 与吴恩达共事",
      960,
      600,
      43,
      C.muted,
      400,
      "center",
    );
    line(c, 290, 680, 1630, 680, C.orange, 3);
  } else {
    neural(c, f, 1360, 510, 280, C.orange);
    text(c, "可追踪的，是", 120, 360, 58, C.muted);
    text(c, "观点如何变成规则", 120, 500, 88, C.paper, 700);
    text(c, "技术能力 → 国家竞争 → 产品限制", 125, 650, 36, C.orange);
  }
};
export const Career = () => <Shot id="career" paint={paint} />;
