import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CleanCard,
  GalleryStage,
  PALETTE,
  PoliteBot,
  SoftPill,
  useBeat,
} from "../design";

/** Scene 1 (0..165f / 5.5s): 问个最简单的问题「中午吃面还是吃饭？」，AI 瞬间套上防弹玻璃回答 */
export const BulletproofLunchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const noteEnter = spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 14 } });
  const helmetIn = spring({ frame: Math.max(0, frame - 36), fps, config: { damping: 12, stiffness: 170 } });
  const replyEnter = spring({ frame: Math.max(0, frame - 68), fps, config: { damping: 14 } });
  const footnoteEnter = spring({ frame: Math.max(0, frame - 115), fps, config: { damping: 16 } });

  return (
    <GalleryStage>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
          width: 1440,
        }}
      >
        <SoftPill text="当你想让 AI 给个干脆答案" bg={PALETTE.ink} fontSize={32} />

        {/* Top row: cute sticky note -> shields -> polite bot in helmet */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 54,
            marginTop: 8,
          }}
        >
          {/* Cute sticky note */}
          <div
            style={{
              background: PALETTE.butterSoft,
              border: `2px solid ${PALETTE.butter}55`,
              borderRadius: 28,
              padding: "28px 42px",
              boxShadow: "0 18px 44px rgba(230, 168, 50, 0.14)",
              transform: `rotate(-3deg) scale(${noteEnter})`,
              opacity: noteEnter,
            }}
          >
            <div style={{ fontSize: 24, color: "#9c6b10", fontWeight: 700, marginBottom: 8 }}>
              人类的小便签
            </div>
            <div style={{ fontSize: 44, fontWeight: 700, color: PALETTE.ink }}>
              「中午吃面，还是吃饭？」
            </div>
          </div>

          {/* 3 rising glass shields */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {[0, 1, 2].map((idx) => {
              const s = spring({
                frame: Math.max(0, frame - 34 - idx * 8),
                fps,
                config: { damping: 12, stiffness: 200 },
              });
              return (
                <div
                  key={idx}
                  style={{
                    width: 14,
                    height: 120 + idx * 14,
                    borderRadius: 999,
                    background: "rgba(75, 123, 236, 0.22)",
                    border: `2.5px solid ${PALETTE.sky}`,
                    transform: `scaleY(${s})`,
                    opacity: s,
                  }}
                />
              );
            })}
          </div>

          <PoliteBot
            size={180}
            helmet
            helmetProgress={helmetIn}
            bow={frame > 68 ? -4 : 0}
          />
        </div>

        {/* Polite defensive answer card */}
        <CleanCard
          width={1220}
          delay={68}
          style={{
            padding: "36px 48px",
            opacity: replyEnter,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.55, color: PALETTE.ink }}>
            「这
            <span style={{ color: PALETTE.coral, padding: "0 6px" }}>不是</span>
            一道二选一的难题，
            <span style={{ color: PALETTE.sage, padding: "0 6px" }}>而是</span>
            碳水在午间的一次温柔分岔。」
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 26,
              color: PALETTE.subInk,
              opacity: footnoteEnter,
            }}
          >
            * 免责声明：最终口感仍取决于您今天的肠胃上下文与咀嚼偏好。
          </div>
        </CleanCard>
      </div>
    </GalleryStage>
  );
};

const PAIRS = [
  {
    raw: "「你写错了」",
    rawBg: PALETTE.coralSoft,
    rawColor: PALETTE.coral,
    politePrefix: "不能跑通，不代表",
    politeRest: "思路没有启发性",
    pillBg: PALETTE.sageSoft,
    pillColor: PALETTE.sage,
  },
  {
    raw: "「这方案不行」",
    rawBg: PALETTE.butterSoft,
    rawColor: "#a86d0b",
    politePrefix: "虽然无法落地，但是",
    politeRest: "极具想象空间",
    pillBg: PALETTE.skySoft,
    pillColor: PALETTE.sky,
  },
  {
    raw: "「我真不会」",
    rawBg: PALETTE.plumSoft,
    rawColor: PALETTE.plum,
    politePrefix: "这需要结合多维度",
    politeRest: "辩证地动态看待",
    pillBg: PALETTE.coralSoft,
    pillColor: PALETTE.coral,
  },
];

/** Scene 2 (165..375f / 7.0s): 韦斯·安德森风「礼貌翻译传送带」，把大白话包装成精致防御礼盒 */
export const PoliteFactoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = useBeat();

  // 3 items, 70 frames each
  const itemIdx = Math.min(2, Math.floor(frame / 70));
  const localF = frame - itemIdx * 70;
  const pair = PAIRS[itemIdx];

  const rawX = interpolate(localF, [0, 26], [-420, -250], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rawOpacity = interpolate(localF, [0, 8, 22, 28], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const giftEnter = spring({
    frame: Math.max(0, localF - 26),
    fps,
    config: { damping: 12, stiffness: 180 },
  });
  const giftExit = interpolate(localF, [60, 69], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const machineBounce =
    localF >= 22 && localF <= 34
      ? 1 + Math.sin(((localF - 22) / 12) * Math.PI) * 0.08
      : 1 + beat.onset * 0.025;

  return (
    <GalleryStage>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
          width: 1560,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <SoftPill text="防御性回答" bg={PALETTE.coral} fontSize={34} />
          <div style={{ fontSize: 64, fontWeight: 700 }}>
            大白话 → 礼貌包装机
          </div>
        </div>

        {/* Conveyor stage */}
        <div
          style={{
            width: 1480,
            height: 410,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Conveyor belt line */}
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              bottom: 64,
              height: 22,
              borderRadius: 999,
              background: "#e4dfd4",
              overflow: "hidden",
              border: `2px solid ${PALETTE.border}`,
            }}
          >
            <div
              style={{
                width: "200%",
                height: "100%",
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(28,27,25,0.12) 0 16px, transparent 16px 48px)",
                transform: `translateX(${(frame * 4) % 48 - 48}px)`,
              }}
            />
          </div>

          {/* Left: raw human plain-speech candy */}
          <div
            style={{
              position: "absolute",
              left: 110,
              bottom: 112,
              background: pair.rawBg,
              color: pair.rawColor,
              fontSize: 42,
              fontWeight: 700,
              padding: "24px 44px",
              borderRadius: 999,
              border: `2.5px solid ${pair.rawColor}44`,
              boxShadow: "0 16px 36px rgba(28,27,25,0.07)",
              transform: `translateX(${rawX + 250}px)`,
              opacity: rawOpacity,
            }}
          >
            {pair.raw}
          </div>

          {/* Center: adorable polite machine */}
          <div
            style={{
              position: "absolute",
              left: 480,
              bottom: 84,
              width: 240,
              height: 245,
              borderRadius: 42,
              background: PALETTE.card,
              border: `3px solid ${PALETTE.sage}`,
              boxShadow: "0 24px 56px rgba(16, 163, 127, 0.14)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transform: `scale(${machineBounce})`,
              zIndex: 10,
            }}
          >
            <PoliteBot size={130} />
            <div style={{ fontSize: 22, fontWeight: 700, color: PALETTE.sage }}>
              端水精装器 v∞
            </div>
          </div>

          {/* Right: gift-wrapped defensive sentence */}
          <div
            style={{
              position: "absolute",
              left: 770,
              bottom: 105,
              width: 650,
              background: PALETTE.card,
              borderRadius: 30,
              padding: "28px 36px",
              border: `2.5px solid ${pair.pillColor}55`,
              boxShadow: "0 22px 54px rgba(28,27,25,0.09)",
              transform: `translateX(${(1 - giftEnter) * -90}px) scale(${0.88 + giftEnter * 0.12})`,
              opacity: giftEnter * giftExit,
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: pair.pillBg,
                color: pair.pillColor,
                fontSize: 22,
                fontWeight: 700,
                padding: "6px 18px",
                borderRadius: 999,
                marginBottom: 14,
              }}
            >
              🎀 精装礼貌版 #{itemIdx + 1}
            </div>
            <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.45, color: PALETTE.ink }}>
              「<span style={{ color: pair.pillColor }}>{pair.politePrefix}</span>
              {pair.politeRest}」
            </div>
          </div>
        </div>

        {/* Step indicator dots */}
        <div style={{ display: "flex", gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === itemIdx ? 44 : 14,
                height: 14,
                borderRadius: 999,
                background: i === itemIdx ? PALETTE.sage : "#d8d3c8",
              }}
            />
          ))}
        </div>
      </div>
    </GalleryStage>
  );
};
