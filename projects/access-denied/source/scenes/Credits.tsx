import { Shot } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line } from "../draw";
const paint: Paint = (c, f) => {
  base(c, f);
  text(c, "事实有出处，未来是追问。", 110, 220, 65, C.paper, 700);
  const a = [
    "Lex Fridman #452 · Dario 本人访谈",
    "Anthropic · Claude 2 / 2023.07.11",
    "LINUX DO · 用户自述 / 2026.06—09",
    "Anthropic · 销售限制 / 2025.09.04",
  ];
  const b = [
    "Anthropic · 蒸馏指控 / 2026.02.23",
    "Reuters / AFP · 2026 年 7 月报道",
    "公开复现 · shellus/claude-cn-flag-check",
    "完整链接、旁白与证据说明随成片提供",
  ];
  a.forEach((s, i) => text(c, s, 115, 380 + i * 77, 30, C.muted));
  b.forEach((s, i) => text(c, s, 1010, 380 + i * 77, 30, C.muted));
  line(c, 115, 715, 1800, 715, C.line, 2);
  text(
    c,
    "AI 合成配音：Qwen3-TTS · 原创程序配乐 / 动画：Framecraft",
    115,
    770,
    28,
    C.paper,
  );
  text(c, "人物照片：TechCrunch · CC BY 2.0 · 镜头裁切", 115, 823, 26, C.muted);
  text(c, "creativecommons.org/licenses/by/2.0", 115, 867, 24, C.muted);
};
export const Credits = () => <Shot id="credits" paint={paint} />;
