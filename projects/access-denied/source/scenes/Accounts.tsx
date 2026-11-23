import { Shot, stage } from "../Shot";
import type { Paint } from "../Shot";
import { C, base, text, box, line, person, stamp, noise, ease } from "../draw";
const paint: Paint = (c, f, s) => {
  base(c, f);
  const q = stage(s, f);
  // Accounts move through a diagonal industrial conveyor and go dark.
  c.save();
  c.translate(1190, 470);
  c.rotate(-0.16);
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 6; col++) {
      const xx = ((col * 180 + f * (row % 2 ? -0.5 : 0.5) + 1600) % 1080) - 530,
        yy = row * 130 - 290;
      const shut = noise(row * 6 + col) < Math.min(0.86, 0.2 + f / 700);
      box(c, xx, yy, 142, 105, shut ? "#241b1e" : "#152b35", 7);
      person(c, xx + 31, yy + 41, 0.52, shut ? "#73504b" : C.cyan);
      line(
        c,
        xx + 65,
        yy + 35,
        xx + 125,
        yy + 35,
        shut ? C.orange : C.muted,
        2,
      );
      line(c, xx + 65, yy + 56, xx + 110, yy + 56, C.line, 2);
      if (shut) {
        line(c, xx + 12, yy + 90, xx + 130, yy + 12, C.orange, 2);
      }
    }
  c.restore();
  const g = c.createLinearGradient(0, 0, 1080, 0);
  g.addColorStop(0, C.ink);
  g.addColorStop(0.65, C.ink);
  g.addColorStop(1, "transparent");
  c.fillStyle = g;
  c.fillRect(0, 140, 1080, 700);
  text(c, q.index < 2 ? "2026.06" : "2026.09", 110, 235, 82, C.muted, 700);
  text(c, "普通用户的封号经历", 115, 385, 58, C.paper, 700);
  text(
    c,
    q.index === 0
      ? "从六月，到九月"
      : q.index === 1
        ? "多年老号报告停用"
        : "停用 / 申诉 / 退款",
    120,
    525,
    46,
    C.orange,
    700,
  );
  stamp(c, "ACCESS DENIED", 350, 720, 0.9 * ease(f / 30));
  text(c, "用户报告 · 不代表所有封禁原因", 1100, 842, 26, C.muted);
};
export const Accounts = () => <Shot id="accounts" paint={paint} />;
