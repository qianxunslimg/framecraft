import { Shot } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line, poly, glow, stamp, ease } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const p = f / s.duration,
    cx = 960 + Math.sin(f * 0.003) * 90,
    cy = 490;
  // A physical access tunnel: successive frames, light packets, an iris closing.
  for (let i = 13; i >= 0; i--) {
    const z = ((i * 95 + f * 3) % 1330) + 100,
      k = 640 / z,
      w = 350 * k,
      h = 260 * k;
    c.globalAlpha = Math.min(0.85, k * 0.3);
    c.strokeStyle = i % 3 === 0 ? C.orange : "#597481";
    c.lineWidth = 2;
    c.strokeRect(cx - w, cy - h, w * 2, h * 2);
    line(c, cx - w, cy - h, cx - w * 1.09, cy - h * 1.09, C.line, 1);
  }
  c.globalAlpha = 1;
  glow(c, cx, cy, 350, C.orange, 0.13);
  if (p < 0.36) {
    text(c, "2026.09", 960, 390, 145, C.paper, 700, "center");
    stamp(c, "ACCOUNT SUSPENDED", 960, 610, 1.15 * ease(f / 40));
    text(
      c,
      "中文开发者社区：封号反馈接连出现",
      960,
      790,
      49,
      C.paper,
      700,
      "center",
    );
  } else if (p < 0.68) {
    text(c, "多年老号 / 付费订阅", 960, 390, 83, C.paper, 700, "center");
    text(c, "访问，突然中断。", 960, 565, 110, C.orange, 700, "center");
    text(
      c,
      "公开用户报告 · 不推断所有个案的封禁原因",
      960,
      770,
      33,
      C.muted,
      400,
      "center",
    );
  } else {
    const k = ease((p - 0.68) / 0.1);
    poly(
      c,
      [
        [0, 0],
        [960 * k, 0],
        [770 * k, 1080],
        [0, 1080],
      ],
      "#0b121b",
    );
    text(c, "谁能进入", 180, 355, 120, C.white, 700);
    text(c, "AI 的未来？", 180, 510, 150, C.orange, 700);
    text(c, "从访问限制，到智能的控制权", 188, 675, 38, C.muted);
  }
};
export const Opening = () => <Shot id="opening" paint={paint} />;
