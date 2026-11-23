import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CleanCard,
  GalleryStage,
  PALETTE,
  PoliteBot,
  SoftPill,
  VectorCursor,
  useBeat,
} from "../design";

const LAYERS = [
  { label: "兼容 2008 年浏览器降级", radius: 225, bg: "rgba(16, 163, 127, 0.13)", border: PALETTE.sage, delay: 24, angle: -24 },
  { label: "防手抖连点 100 次熔断器", radius: 315, bg: "rgba(230, 168, 50, 0.14)", border: PALETTE.butter, delay: 54, angle: 18 },
  { label: "抽象圆角策略工厂接口", radius: 405, bg: "rgba(75, 123, 236, 0.13)", border: PALETTE.sky, delay: 84, angle: -14 },
  { label: "防宇宙射线翻转比特兜底", radius: 495, bg: "rgba(224, 109, 83, 0.13)", border: PALETTE.coral, delay: 114, angle: 12 },
];

/** Scene 3 (375..575f / 6.67s): 只要给按钮加个小圆角，被 4 层 Q 弹气泡膜越裹越大 */
export const BubbleWrapCodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = useBeat();

  // Gentle camera zoom out as bubble-wrap layers accumulate
  const cameraScale = interpolate(frame, [20, 150], [1.18, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wobble = Math.sin(frame * 0.1) * 2.2;

  return (
    <GalleryStage>
      {/* Top crisp header */}
      <div
        style={{
          position: "absolute",
          top: 56,
          display: "flex",
          alignItems: "center",
          gap: 20,
          zIndex: 30,
        }}
      >
        <SoftPill text="防御性编程" bg={PALETTE.sky} fontSize={32} />
        <div style={{ fontSize: 56, fontWeight: 700 }}>
          我只是想让按钮变圆一点……
        </div>
      </div>

      {/* Concentric Q-elastic bubble wrap sphere */}
      <div
        style={{
          position: "relative",
          width: 1000,
          height: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 75,
          transform: `scale(${cameraScale * (1 + beat.onset * 0.025)}) rotate(${wobble}deg)`,
        }}
      >
        {[...LAYERS].reverse().map((layer) => {
          const pop = spring({
            frame: Math.max(0, frame - layer.delay),
            fps,
            config: { damping: 10, stiffness: 150 },
          });
          return (
            <div
              key={layer.label}
              style={{
                position: "absolute",
                width: layer.radius * 2,
                height: layer.radius * 2,
                borderRadius: 999,
                background: layer.bg,
                border: `3.5px dashed ${layer.border}`,
                transform: `scale(${pop})`,
                opacity: pop,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: 18,
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  color: layer.border,
                  fontSize: 28,
                  fontWeight: 700,
                  padding: "8px 24px",
                  borderRadius: 999,
                  boxShadow: "0 8px 22px rgba(28,27,25,0.08)",
                  transform: `rotate(${layer.angle * 0.25}deg)`,
                }}
              >
                {layer.label}
              </div>
            </div>
          );
        })}

        {/* The tiny innocent original requirement in the center */}
        <div
          style={{
            position: "relative",
            zIndex: 20,
            background: PALETTE.ink,
            color: "#ffffff",
            fontSize: 30,
            fontWeight: 700,
            padding: "22px 38px",
            borderRadius: 24,
            boxShadow: "0 18px 40px rgba(28,27,25,0.18)",
            textAlign: "center",
          }}
        >
          border-radius: 8px
          <div style={{ fontSize: 20, color: "#a8a49c", marginTop: 4 }}>
            原本只要这一行
          </div>
        </div>
      </div>
    </GalleryStage>
  );
};

/** Scene 4 (575..745f / 5.67s): 优雅的 48/48 全绿测试卡片，点开一看全是自我安慰 */
export const GreenTestMagicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.min(
    48,
    Math.floor(interpolate(frame, [6, 36], [0, 48], { extrapolateRight: "clamp" })),
  );
  const clickFrame = 60;
  const expanded = frame >= clickFrame;
  const expandSpring = spring({
    frame: Math.max(0, frame - clickFrame),
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  const cursorX = interpolate(frame, [26, 56], [1480, 1345], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [26, 56], [820, 430], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tests = [
    "测试我编的假数据 === 我编的假数据",
    "测试把所有报错都默默吞掉后，程序居然不崩了",
    "测试用户有没有被 400 字免责声明深深感动",
  ];

  return (
    <GalleryStage>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        <SoftPill text="全绿的仪式感" bg={PALETTE.sage} fontSize={32} />

        <CleanCard width={1200} delay={2} style={{ padding: "40px 48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 999,
                  background: PALETTE.sageSoft,
                  border: `5px solid ${PALETTE.sage}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  fontWeight: 700,
                  color: PALETTE.sage,
                }}
              >
                ✓
              </div>
              <div>
                <div style={{ fontSize: 44, fontWeight: 700, color: PALETTE.ink }}>
                  单元测试：{count} / 48 全部通过
                </div>
                <div style={{ fontSize: 26, color: PALETTE.subInk, marginTop: 6 }}>
                  覆盖率 100.0% · 看着特别让人安心
                </div>
              </div>
            </div>

            <div
              style={{
                background: expanded ? PALETTE.ink : "#f0ede5",
                color: expanded ? "#ffffff" : PALETTE.ink,
                fontSize: 26,
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 999,
              }}
            >
              {expanded ? "收起细节 ⌃" : "点开看看 ⌄"}
            </div>
          </div>

          {expanded && (
            <div
              style={{
                marginTop: 32,
                paddingTop: 28,
                borderTop: `2px solid ${PALETTE.border}`,
                display: "flex",
                flexDirection: "column",
                gap: 18,
                opacity: expandSpring,
                transform: `translateY(${(1 - expandSpring) * 18}px)`,
              }}
            >
              {tests.map((t, i) => {
                const row = spring({
                  frame: Math.max(0, frame - clickFrame - i * 12),
                  fps,
                  config: { damping: 14 },
                });
                return (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: PALETTE.paper,
                      padding: "20px 28px",
                      borderRadius: 20,
                      fontSize: 28,
                      fontWeight: 700,
                      opacity: row,
                      transform: `translateX(${(1 - row) * -24}px)`,
                    }}
                  >
                    <span>
                      <span style={{ color: PALETTE.sage, marginRight: 14 }}>PASS</span>
                      {t}
                    </span>
                    <span style={{ color: PALETTE.subInk, fontSize: 24 }}>0.01ms</span>
                  </div>
                );
              })}
            </div>
          )}
        </CleanCard>
      </div>
      {frame >= 22 && frame < 95 && (
        <VectorCursor x={cursorX} y={cursorY} clickFrame={clickFrame} />
      )}
    </GalleryStage>
  );
};

/** Scene 5 (745..900f / 5.17s): 用它自己的「不是…而是…」优雅反杀收尾 */
export const PolitePunchlineFinale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 14 } });
  const punch = spring({ frame: Math.max(0, frame - 56), fps, config: { damping: 11, stiffness: 170 } });

  return (
    <GalleryStage tint="#fdfaf2">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
        }}
      >
        <PoliteBot size={160} helmet={false} blink={frame > 60 && frame < 70} />

        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: PALETTE.subInk,
            opacity: line1,
            transform: `translateY(${(1 - line1) * 20}px)`,
          }}
        >
          以上<span style={{ color: PALETTE.coral }}>不是</span>在吐槽你，
          <span style={{ color: PALETTE.sage }}>而是</span>一次温柔的对齐——
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            transform: `scale(${punch})`,
            opacity: punch,
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 700, color: PALETTE.ink }}>
            下次能不能
          </div>
          <SoftPill text="直接说结论？" bg={PALETTE.sage} fontSize={78} delay={56} />
        </div>
      </div>
    </GalleryStage>
  );
};
