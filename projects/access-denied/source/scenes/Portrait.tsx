import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, line, box, ease, glow } from "../draw";
const paint: Paint = (c, f, s, images) => {
  base(c, f);
  const q = stage(s, f);
  const e = ease(f / 40);
  const x = 960 + (1 - e) * 350,
    y = 150 - f * 0.015;
  c.save();
  c.beginPath();
  c.rect(x, y, 800, 710);
  c.clip();
  const img = images.dario;
  c.drawImage(img, 500, 100, 2700, 2500, x, y, 800, 740);
  c.restore();
  const g = c.createLinearGradient(x, 0, x + 200, 0);
  g.addColorStop(0, C.ink);
  g.addColorStop(1, "transparent");
  c.fillStyle = g;
  c.fillRect(x, y, 220, 740);
  text(c, "DARIO", 112, 250, 116, C.paper, 700);
  text(c, "AMODEI", 112, 380, 116, C.paper, 700);
  text(c, "达里奥 · 阿莫代伊", 120, 500, 48, C.orange, 700);
  text(c, "Anthropic 联合创始人 / CEO", 122, 575, 31, C.muted);
  line(c, 120, 640, 700, 640, C.orange, 2);
  if (q.index < 2) {
    text(c, "2014", 120, 745, 86, C.paper, 700);
    text(c, "百度 · 硅谷 AI 实验室", 385, 740, 36, C.paper);
  } else {
    box(c, 105, 684, 780, 102, "#342420");
    text(c, "后来：主张加强对华 AI 限制", 128, 738, 39, C.orange, 700);
  }
  glow(c, 950, 470, 300, C.orange, 0.08);
  text(
    c,
    "PHOTO  TechCrunch / CC BY 2.0 · 2023 · 镜头裁切",
    1050,
    875,
    19,
    C.muted,
  );
};
export const Portrait = () => <Shot id="portrait" paint={paint} />;
