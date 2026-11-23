import { CanvasShot, type Painter } from "./CanvasShot";
import {
  P,
  TAU,
  sat,
  mix,
  enter,
  bounce,
  local,
  background,
  text,
  type3,
  line,
  polygon,
  disk,
  ring,
  round,
  star,
  face,
  burst,
  curvedText,
  heart,
  plane,
  project,
} from "./draw";

// A literal game of hide, conceal, escape. The same little face refuses all three.
const race: Painter = (c, f, bass) => {
  const chapter = Math.min(2, Math.max(0, Math.floor(f / 35))),
    t = f - chapter * 35;
  background(
    c,
    chapter === 1 ? P.blue : chapter === 2 ? P.ink : P.paper,
    chapter === 0,
  );
  const camera = Math.sin(t * 0.08) * 0.035;
  local(c, 540, 960, camera, 1, () => {
    c.translate(-540, -960);
    type3(
      c,
      ["不躲", "不藏", "不逃"][chapter],
      540,
      410,
      300,
      chapter === 1 ? P.lime : P.blue,
      16,
      -0.09,
      chapter === 0 ? P.gray : P.ink,
    );
    if (chapter === 0) {
      const open = enter(t, 0, 25);
      face(c, 540, 1040, 190, P.lime, t < 12 ? "surprised" : "happy", -0.1);
      const width = mix(430, 65, open);
      round(c, 100, 740, width, 670, 12, P.blue, P.ink, 5);
      round(c, 980 - width, 740, width, 670, 12, P.blue, P.ink, 5);
      text(c, "[", 160, 1080, 560, P.paper);
      text(c, "]", 920, 1080, 560, P.paper);
      text(c, "( •̀ᴗ•́ )و", 540, 1540, 85, P.ink);
    } else if (chapter === 1) {
      face(
        c,
        540 + Math.sin(t * 0.12) * 130,
        1020,
        195,
        P.paper,
        "happy",
        Math.sin(t * 0.1) * 0.15,
      );
      for (let i = 0; i < 8; i++) {
        const retract = enter(t, i * 1.8, 16);
        local(c, 540, 745 + i * 83, 0, 1, () => {
          c.scale(1, 1 - retract * 0.99);
          round(c, -450, -40, 900, 78, 4, P.lime, P.ink, 4);
          text(c, "——", 0, 0, 60, P.ink);
        });
      }
      text(c, "找到你啦", 540, 1530, 90, P.paper, -0.08);
    } else {
      for (let i = 0; i < 7; i++) {
        const x = ((((i * 250 - t * 34) % 1600) + 1600) % 1600) - 260;
        line(
          c,
          [
            { x, y: 1490 },
            { x: x + 190, y: 1490 },
          ],
          P.paper,
          8,
        );
      }
      const x = 540 + Math.sin(t * 0.12) * 120,
        y = 1030 - Math.abs(Math.sin(t * 0.25)) * 160;
      local(c, x, y, t * 0.045, 1, () => {
        face(c, 0, 0, 175, P.lime, "happy");
        text(c, "/", -150, 235, 180, P.lime, -0.35);
        text(c, "\\", 140, 235, 180, P.lime, 0.35);
      });
      for (let i = 0; i < 4; i++)
        line(
          c,
          [
            { x: 70, y: 920 + i * 100 },
            { x: 310 - i * 35, y: 920 + i * 100 },
          ],
          P.blue,
          13,
        );
      text(c, "就在这里", 540, 1600, 95, P.paper);
    }
  });
  star(c, 860, 665, 35 + bass * 18, chapter === 0 ? P.coral : P.lime, f * 0.13);
  burst(
    c,
    f,
    chapter * 35 + 8,
    540,
    1080,
    chapter === 1 ? P.paper : P.coral,
    12,
  );
};

const gravity: Painter = (c, f, bass) => {
  background(c, P.lime);
  const flip = enter(f, 35, 26) * Math.PI * 0.5;
  if (f < 48) {
    for (let i = 12; i >= 0; i--) {
      const a = i * 0.8 + f * 0.045;
      const z = Math.cos(a) * 370;
      const p = project(
        Math.sin(a) * 440,
        (i - 6) * 170,
        z,
        0.1,
        f * 0.005,
        -0.13,
      );
      ring(c, p.x, p.y, 130 * p.s, "#10111430", 2);
    }
    local(c, 540, 960, flip, 1, () => {
      [..."我就在这"].forEach((s, i) => {
        const a = (i * TAU) / 4 + f * 0.022;
        const p = project(
          Math.cos(a) * 365,
          Math.sin(a) * 460,
          Math.sin(a) * 80,
          0.15,
          0.2,
          0,
        );
        local(
          c,
          p.x - 540,
          p.y - 960,
          -flip + 0.12 * Math.sin(a),
          bounce(f, i * 7),
          () => {
            round(c, -136, -145, 272, 290, 27, P.paper, P.ink, 5);
            text(c, s, 0, 0, 207, P.ink);
          },
        );
      });
      face(c, 0, 0, 125, P.blue, "happy", -flip);
    });
  }
  if (f >= 40) {
    const catchAt = 78,
      t = f - catchAt;
    const arrive = enter(f, 40, 10);
    text(c, "稳稳地", 540, 400, 205 * arrive, P.ink, -0.045);
    const dent = t < 0 ? 0 : Math.sin(t * 0.28) * Math.exp(-t * 0.065) * 90;
    text(c, "{", 195, 1130 + dent, 530, P.blue, -0.8);
    text(c, "}", 885, 1130 + dent, 530, P.blue, 0.8);
    for (let i = 0; i < 9; i++) {
      c.beginPath();
      c.moveTo(170, 1100 + i * 16);
      c.quadraticCurveTo(540, 1390 + dent * 3, 910, 1100 + i * 16);
      c.lineWidth = i % 3 === 0 ? 6 : 2;
      c.strokeStyle = i % 3 === 0 ? P.blue : "#1755ff60";
      c.stroke();
    }
    const drop = sat((f - 43) / 35);
    const y =
      f < catchAt
        ? 520 + 590 * drop * drop
        : 1110 - Math.abs(Math.sin(t * 0.11)) * 190;
    face(
      c,
      540 + Math.sin(f * 0.06) * 40,
      y,
      110,
      P.paper,
      f < catchAt ? "surprised" : "love",
    );
    if (f > 72)
      type3(
        c,
        "接住你",
        540,
        1590,
        228 * enter(f, 72, 8),
        P.blue,
        13,
        0,
        P.ink,
      );
    burst(c, f, catchAt, 540, 1160, P.coral, 22);
  }
  star(c, 900, 195, 46 + bass * 9, P.blue, f * 0.04);
};

// Glyphs ride a dimensional ribbon; the repeat dives into an infinite poster.
const reprise: Painter = (c, f, bass) => {
  if (f < 88) {
    background(c, P.ink);
    const rx = 0.55 + Math.sin(f * 0.02) * 0.2,
      ry = -0.4 + f * 0.014,
      rz = -0.3;
    const segments = [];
    for (let i = 0; i < 80; i++) {
      const a = (i * TAU) / 80 + f * 0.018;
      const b = a + TAU / 80;
      const get = (v: number, side: number) =>
        project(
          Math.cos(v) * (390 + side * 62 * Math.cos(v * 0.5)),
          Math.sin(v) * 530 + side * 95 * Math.sin(v * 0.5),
          Math.sin(v) * 200 + side * 55 * Math.cos(v * 0.5),
          rx,
          ry,
          rz,
        );
      const pts = [get(a, -1), get(b, -1), get(b, 1), get(a, 1)];
      segments.push({ pts, z: pts.reduce((s, p) => s + p.z, 0) / 4, i });
    }
    segments
      .sort((a, b) => b.z - a.z)
      .forEach(({ pts, i }) =>
        polygon(c, pts, i % 10 < 5 ? P.blue : P.lime, P.ink, 2),
      );
    const words = [..."当然可以好问题"];
    const tiles = words.map((s, i) => {
      const a = (i * TAU) / 7 + f * 0.018;
      return {
        s,
        i,
        a,
        p: project(
          Math.cos(a) * 405,
          Math.sin(a) * 530,
          Math.sin(a) * 200,
          rx,
          ry,
          rz,
        ),
      };
    });
    tiles
      .sort((a, b) => b.p.z - a.p.z)
      .forEach(({ s, i, a, p }) => {
        local(c, p.x, p.y, Math.sin(a) * 0.24, p.s, () => {
          round(c, -94, -110, 188, 220, 19, i > 3 ? P.lime : P.paper, P.ink, 4);
          text(c, s, 0, 0, 144, P.ink);
        });
      });
    const a = f * 0.09,
      p = project(
        Math.cos(a) * 400,
        Math.sin(a) * 530,
        Math.sin(a) * 200,
        rx,
        ry,
        rz,
      );
    face(c, p.x, p.y - 115 * p.s, 69 * p.s, P.coral, "happy", a * 0.2);
    if (f < 28) text(c, "当然可以", 540, 235, 137, P.paper, -0.04);
    else type3(c, "好问题", 540, 962, 180, P.paper, 13, -0.08, P.blue);
    curvedText(
      c,
      "✦  ?  ✓  ♥  ✦  ?  ✓  ♥",
      540,
      960,
      815,
      -f * 0.012,
      0.16,
      55,
      P.paper,
    );
  } else {
    background(c, P.blue);
    const t = f - 88;
    const dive = t / 23;
    const frac = dive - Math.floor(dive);
    local(c, 540, 960, t * 0.006, 1, () => {
      for (let i = -2; i <= 7; i++) {
        const s = Math.pow(0.56, i - frac);
        if (s > 6) continue;
        local(c, 0, 0, i * 0.065, s, () => {
          round(
            c,
            -470,
            -800,
            940,
            1600,
            44,
            i % 2 === 0 ? P.paper : P.lime,
            P.ink,
            10,
          );
          text(c, "当然可以", 0, -590, 176, P.ink);
          text(c, "好问题", 0, 600, 235, P.blue);
          face(c, -330, -290, 64, P.coral, "happy", -0.3);
          text(c, "✓", 330, 260, 115, P.blue);
          round(c, -278, -418, 556, 836, 24, P.blue, P.ink, 6);
        });
      }
    });
    const a = t * 0.12;
    face(
      c,
      540 + Math.cos(a) * 330,
      960 + Math.sin(a) * 540,
      55 + bass * 11,
      P.paper,
      "happy",
      a,
    );
  }
};

const universe: Painter = (c, f, bass) => {
  background(c, P.paper, true);
  const ending = enter(f, 151, 27);
  const scale = mix(1, 0.19, ending);
  const centerY = mix(980, 1370, ending);
  if (ending > 0) {
    c.save();
    c.globalAlpha = ending;
    c.beginPath();
    c.moveTo(290, 575);
    c.bezierCurveTo(295, 245, 835, 260, 805, 575);
    c.bezierCurveTo(790, 765, 545, 780, 540, 1020);
    c.lineCap = "round";
    c.lineWidth = 145;
    c.strokeStyle = P.blue;
    c.stroke();
    c.restore();
  }
  local(c, 540, centerY, -f * 0.0015 * (1 - ending), scale, () => {
    const sphere = enter(f, 85, 40),
      r = 405;
    // Everything from the film comes back as a tiny world in the question dot.
    disk(c, 8, 20, 458, P.ink);
    disk(c, 0, 0, 458, P.blue, P.ink, 4);
    for (let i = 0; i < 14; i++) {
      local(c, 0, 0, (i * Math.PI) / 14 + f * 0.006, 1, () => {
        c.beginPath();
        c.ellipse(
          0,
          0,
          440,
          Math.max(9, Math.abs(Math.sin(i * 0.21 + f * 0.01)) * 440),
          0,
          0,
          TAU,
        );
        c.strokeStyle = "#f2f1ea25";
        c.lineWidth = 2;
        c.stroke();
      });
    }
    const objects = Array.from({ length: 26 }, (_, i) => {
      const a = i * 2.399 + f * 0.018;
      const yy = (i / 25 - 0.5) * 740;
      const rr = Math.sqrt(Math.max(0, r * r - yy * yy));
      const p = project(
        Math.cos(a) * rr,
        yy,
        Math.sin(a) * rr,
        0.17,
        f * 0.009,
        0.08,
      );
      return { i, p, a };
    }).sort((a, b) => b.p.z - a.p.z);
    objects.forEach(({ i, p, a }) => {
      const x = p.x - 540,
        y = p.y - 960;
      const s = p.s * (0.7 + sphere * 0.3);
      if (i % 5 === 0)
        face(c, x, y, 48 * s, i % 2 ? P.lime : P.paper, "happy", a * 0.15);
      else if (i % 5 === 1) heart(c, x, y, 67 * s, P.coral, a * 0.12);
      else if (i % 5 === 2) plane(c, x, y, 0.27 * s, -a, P.paper);
      else if (i % 5 === 3)
        text(c, i % 2 ? "?" : "✓", x, y, 91 * s, P.lime, a * 0.2);
      else star(c, x, y, 40 * s, P.paper, a, 4);
    });
    if (f < 44) {
      const chars = [..."我就在这"];
      chars.forEach((s, i) => {
        const q = enter(f, [0, 20, 30, 38][i], 5);
        if (q > 0)
          type3(
            c,
            s,
            (i % 2 ? 1 : -1) * 265,
            (i < 2 ? -1 : 1) * 230,
            234 * q,
            P.paper,
            12,
            i % 2 ? 0.07 : -0.07,
            P.ink,
          );
      });
    }
    if (f >= 44 && f < 85) {
      const k = Math.min(2, Math.floor((f - 44) / 12));
      type3(
        c,
        ["不躲", "不藏", "不逃"][k],
        0,
        0,
        302,
        P.lime,
        17,
        (k - 1) * 0.13,
      );
    }
    if (f >= 85 && f < 117) type3(c, "稳稳地", 0, -35, 238, P.paper, 14, -0.07);
    if (f >= 117) {
      face(c, 0, -35, 148, P.lime, "love");
      text(c, "你", 0, 207, 104, P.paper);
    }
  });
  if (f < 151) {
    const arrive = enter(f, 110, 20);
    const spread = mix(590, 422, arrive);
    text(c, "{", 540 - spread, centerY + 30, 620, P.blue, -0.18);
    text(c, "}", 540 + spread, centerY + 30, 620, P.blue, 0.18);
    if (f >= 117) {
      type3(
        c,
        "接住你",
        540,
        360,
        234 * enter(f, 117, 8),
        P.ink,
        12,
        -0.04,
        P.gray,
      );
      burst(c, f, 132, 540, 1030, P.coral, 28);
    } else if (f < 44) text(c, "( •ᴗ• )  ♡  ( •ᴗ• )", 540, 1625, 76, P.ink);
  } else {
    text(c, "当然可以。", 540, 1680, 91 * ending, P.ink);
    for (let i = 0; i < 6; i++) {
      const a = (i * TAU) / 6 - f * 0.01;
      star(
        c,
        540 + Math.cos(a) * 320,
        1370 + Math.sin(a) * 190,
        15 * (1 + bass * 0.3) * ending,
        P.coral,
        a,
        4,
      );
    }
  }
};

export const RemixRace = () => <CanvasShot paint={race} offset={777} />;
export const RemixGravity = () => <CanvasShot paint={gravity} offset={881} />;
export const RemixReprise = () => <CanvasShot paint={reprise} offset={977} />;
export const RemixUniverse = () => (
  <CanvasShot paint={universe} offset={1130} />
);
