import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ArmorBot,
  ChatGPTHeaderPill,
  ChatGPTKnot,
  CuteTruck,
  MochiCat,
} from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, KawaiiStage, SpeechBubble, useAudioBeat } from "../stage";

/** Act 7 (2431..2707f / 81.02s-90.24s): Codex CLI 3-Line Coding -> Shield Array -> Nested Matryoshka try/catch */
export const Verse2CodingScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0..276
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(2431);

  const showShields = frame >= 125;
  const showNest = frame >= 200;

  return (
    <KawaiiStage theme="mint" globalOffset={2431}>
      <CanvasFXLayer
        mode="codeRain"
        globalOffset={2431}
        burstFrames={[47, 125, 200]}
        waveColor={C.sky}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          marginBottom: 95,
          width: 1560,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              background: C.skySoft,
              border: `4px solid ${C.ink}`,
              borderRadius: 999,
              padding: "10px 26px",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            🕑 14:00 PM
          </div>
          <ChatGPTHeaderPill model="Codex CLI · ChatGPT" thoughtSec={Math.floor(frame / 5) + 8} />
          <CandyPill
            text={showNest ? "异常捕获俄罗斯套娃！" : showShields ? "防御护栏全员出动！" : "原本只要改 3 行"}
            bg={showNest ? C.coral : showShields ? C.sky : C.mint}
            size={32}
            beatOffset={2431}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 1460 }}>
          <MochiCat size={245} mood={showNest ? "sweat" : "happy"} holding="typing" beatOffset={2431} />

          <div
            style={{
              width: 850,
              height: 500,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showNest ? (
              <>
                {[
                  { w: 830, h: 480, top: 10, color: C.coral, label: "try { // 外层宇宙兜底 fallback", d: 24 },
                  { w: 690, h: 375, top: 72, color: C.butter, label: "try { // 路径防越界 & 兼容层", d: 12 },
                  { w: 550, h: 270, top: 134, color: C.sky, label: "try { // 判空类型校验护栏", d: 0 },
                ].map((box) => {
                  const p = spring({
                    frame: Math.max(0, frame - 200 - box.d),
                    fps,
                    config: { damping: 10, stiffness: 200 },
                  });
                  return (
                    <div
                      key={box.label}
                      style={{
                        position: "absolute",
                        top: box.top,
                        width: box.w,
                        height: box.h,
                        borderRadius: 34,
                        background: `${box.color}20`,
                        border: `4.5px solid ${box.color}`,
                        padding: "12px 24px",
                        fontSize: 24,
                        fontWeight: 700,
                        color: C.ink,
                        fontFamily: "monospace",
                        boxSizing: "border-box",
                        transform: `scale(${p * (1 + beat.onset * 0.025)})`,
                      }}
                    >
                      {box.label}
                    </div>
                  );
                })}
                <div
                  style={{
                    position: "absolute",
                    top: 230,
                    zIndex: 10,
                    background: C.mint,
                    color: "#fff",
                    padding: "18px 36px",
                    borderRadius: 22,
                    border: `4.5px solid ${C.ink}`,
                    boxShadow: `0 8px 0 ${C.ink}`,
                    fontSize: 30,
                    fontWeight: 700,
                  }}
                >
                  原本的 3 行小改动
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
                <div style={{ display: "flex", gap: 18 }}>
                  {["第 1 行", "第 2 行", "第 3 行"].map((t, i) => (
                    <div
                      key={t}
                      style={{
                        background: [C.mintSoft, C.butterSoft, C.pinkSoft][i],
                        border: `4.5px solid ${C.ink}`,
                        borderRadius: 24,
                        padding: "22px 34px",
                        fontSize: 34,
                        fontWeight: 700,
                        boxShadow: `0 10px 0 ${C.ink}`,
                        transform: `translateY(${Math.sin(frame * 0.22 + i) * 7}px)`,
                      }}
                    >
                      🧩 {t}
                    </div>
                  ))}
                </div>

                {showShields && (
                  <div style={{ display: "flex", gap: 18 }}>
                    {["🛡 判空盾", "🛡 校验盾", "🛡 防越界盾"].map((s, i) => {
                      const pop = spring({
                        frame: Math.max(0, frame - 125 - i * 10),
                        fps,
                        config: { damping: 10, stiffness: 220 },
                      });
                      return (
                        <div
                          key={s}
                          style={{
                            background: C.sky,
                            color: "#fff",
                            border: `4px solid ${C.ink}`,
                            borderRadius: 999,
                            padding: "14px 30px",
                            fontSize: 30,
                            fontWeight: 700,
                            boxShadow: `0 8px 0 ${C.ink}`,
                            transform: `scale(${pop})`,
                          }}
                        >
                          {s}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <ArmorBot size={265} armorLevel={frame >= 47 ? 3 : 1} glassesGlint={showShields} beatOffset={2431} />
        </div>
      </div>
      <SceneWipeIn color={C.mint} />
    </KawaiiStage>
  );
};

/** Act 8 (2707..3013f / 90.24s-100.44s): Codex Diff Explosion (+318) + Green Balloons + Warning Bonk */
export const Verse2ExplodeScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0..306
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(2707);

  const linesCount = Math.min(
    318,
    Math.floor(interpolate(frame, [0, 75], [3, 318], { extrapolateRight: "clamp" })),
  );
  const showTests = frame >= 81;
  const showBalloons = frame >= 153;
  const showWarning = frame >= 230;

  const warnDrop = spring({ frame: Math.max(0, frame - 230), fps, config: { damping: 9, stiffness: 240 } });
  const shake = frame >= 230 && frame < 246 ? interpolate(frame, [230, 246], [18, 0]) : 0;

  return (
    <KawaiiStage theme="cream" globalOffset={2707} shake={shake}>
      <CanvasFXLayer
        mode={showBalloons ? "confetti" : "codeRain"}
        globalOffset={2707}
        burstFrames={[81, 153, 230]}
        waveColor={C.mint}
      />

      {showBalloons &&
        [
          { x: 74, spd: 3.3, delay: 0 },
          { x: 240, spd: 3.9, delay: 12 },
          { x: 1470, spd: 3.7, delay: 5 },
          { x: 1645, spd: 3.2, delay: 14 },
        ].map((b, i) => {
          const y = 960 - (frame - 153 - b.delay) * b.spd * 1.9;
          const fadeTop = interpolate(y, [110, 240], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.x + Math.sin(frame * 0.1 + i) * 16,
                top: y,
                background: C.mint,
                color: "#fff",
                border: `4px solid ${C.ink}`,
                borderRadius: 999,
                padding: "12px 26px",
                fontSize: 28,
                fontWeight: 700,
                boxShadow: "0 10px 0 rgba(23,184,144,0.25)",
                opacity: fadeTop,
                zIndex: 5,
              }}
            >
              PASS ✓ 🎈
            </div>
          );
        })}

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          width: 1500,
          marginBottom: 95,
          zIndex: 15,
        }}
      >
        <MochiCat
          size={280}
          mood={showWarning ? "shock" : showBalloons ? "cheer" : "sweat"}
          beatOffset={2707}
        />

        {/* Dark Codex Git Diff Explosion Card */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 580,
              background: "#1c1926",
              border: `5px solid ${C.ink}`,
              borderRadius: 32,
              padding: "22px 36px",
              boxShadow: `0 14px 0 ${C.ink}`,
              textAlign: "center",
              transform: `scale(${1 + beat.onset * 0.05})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 6 }}>
              <ChatGPTKnot size={34} />
              <span style={{ fontSize: 26, color: "#c9c4d6", fontWeight: 700 }}>
                Codex Patch · 原本只改 3 行
              </span>
            </div>
            <div style={{ fontSize: 94, fontWeight: 700, color: "#4ade80", lineHeight: 1.05 }}>
              +{linesCount}
              <span style={{ fontSize: 40, color: C.coral, marginLeft: 16 }}>-1</span>
            </div>
          </div>

          {showTests && (
            <div style={{ display: "flex", flexDirection: "column-reverse", gap: 8 }}>
              {[
                "✓ test_boundary_null_case (0.01ms)",
                "✓ test_fallback_never_throws (0.01ms)",
                "✓ test_mock_universe_safe (0.01ms)",
                "✓ 48 / 48 ALL GREEN",
              ].map((t, i) => {
                const p = spring({
                  frame: Math.max(0, frame - 81 - i * 10),
                  fps,
                  config: { damping: 11, stiffness: 200 },
                });
                return (
                  <div
                    key={t}
                    style={{
                      width: 580,
                      background: i === 3 ? C.mint : C.mintSoft,
                      color: i === 3 ? "#fff" : C.ink,
                      border: `3.5px solid ${C.ink}`,
                      borderRadius: 18,
                      padding: "10px 28px",
                      fontSize: 26,
                      fontWeight: 700,
                      textAlign: "center",
                      transform: `scale(${p})`,
                    }}
                  >
                    {t}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <ArmorBot size={275} armorLevel={3} glassesGlint={showWarning} beatOffset={2707} />
      </div>

      {showWarning && (
        <div
          style={{
            position: "absolute",
            top: 84,
            background: C.butter,
            color: C.ink,
            border: `6px solid ${C.ink}`,
            borderRadius: 32,
            padding: "20px 50px",
            fontSize: 42,
            fontWeight: 700,
            boxShadow: `0 14px 0 ${C.ink}`,
            transform: `translateY(${(1 - warnDrop) * -180}px) scale(${warnDrop})`,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <ChatGPTKnot size={46} bg="#10a37f" />
          <span>⚠ 冷静警告：仅覆盖本地夹具，实车风险未核实！</span>
        </div>
      )}
      <SceneWipeIn color={C.butter} />
    </KawaiiStage>
  );
};

/** Act 9 (3013..3388f / 100.44s-112.94s): Panoramic Mint Great Wall + Autonomous Lidar Truck + Heroic Climax */
export const BridgeGreatWallScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0..375
  const { fps } = useVideoConfig();

  const showTruck = frame >= 76;
  const showPothole = frame >= 153;
  const climax = frame >= 228;

  const truckX = interpolate(frame, [76, 165], [-420, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wallEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <KawaiiStage theme={climax ? "peach" : "mint"} globalOffset={3013}>
      <CanvasFXLayer
        mode={climax ? "speedlines" : "sunburst"}
        globalOffset={3013}
        burstFrames={[0, 76, 153, 228]}
        waveColor={climax ? C.coral : C.mint}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          marginBottom: 85,
          width: 1920,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <ChatGPTHeaderPill model="ChatGPT 路测报告" thoughtSec={showPothole ? 52 : 24} />
          <CandyPill
            text={
              climax
                ? "🔥 最后还得——我硬撑！！"
                : showPothole
                  ? "⚠ 前方发现未测分支大坑！"
                  : showTruck
                    ? "驶出模拟长城 → 真实路面"
                    : "🏰 模拟绿得像万里长城"
            }
            bg={climax ? C.coral : showPothole ? C.butter : C.mint}
            color={showPothole && !climax ? C.ink : "#ffffff"}
            size={36}
            beatOffset={3013}
          />
        </div>

        {!climax ? (
          <div style={{ position: "relative", width: 1920, height: 550, overflow: "hidden" }}>
            {/* Full-Bleed 1920px Scenic Cartoon Great Wall + Fluffy Clouds + Stylized Pine Trees */}
            <svg
              width="1920"
              height="360"
              viewBox="0 0 1920 360"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translateY(${(1 - wallEnter) * 70}px)`,
                opacity: wallEnter,
              }}
            >
              {/* Drifting fluffy clouds */}
              {[180, 590, 1140, 1650].map((cx, idx) => (
                <g key={cx} transform={`translate(${cx + Math.sin(frame * 0.03 + idx) * 28}, ${34 + (idx % 2) * 18})`}>
                  <ellipse cx="0" cy="18" rx="52" ry="22" fill="#ffffff" opacity="0.9" />
                  <circle cx="-22" cy="10" r="20" fill="#ffffff" opacity="0.9" />
                  <circle cx="16" cy="8" r="24" fill="#ffffff" opacity="0.9" />
                </g>
              ))}

              {/* Distant misty mountains (full-bleed 0..1920) */}
              <path d="M0 360 L0 265 Q280 120 620 225 Q980 95 1340 205 Q1640 120 1920 235 L1920 360 Z" fill="#ccf5e6" />
              {/* Foreground lush rolling hills */}
              <path d="M0 360 L0 285 Q380 160 880 230 Q1380 140 1920 250 L1920 360 Z" fill="#9debd0" />
              {/* Cute pastel pine trees dotting the hills */}
              {[130, 490, 990, 1520, 1790].map((px, idx) => (
                <g key={px} transform={`translate(${px}, ${215 + (idx % 2) * 22})`}>
                  <rect x="-4" y="24" width="8" height="16" fill="#9c6644" />
                  <polygon points="0,-10 22,26 -22,26" fill="#2ec4b6" stroke={C.ink} strokeWidth="3" strokeLinejoin="round" />
                  <polygon points="0,-24 16,6 -16,6" fill="#52e3be" stroke={C.ink} strokeWidth="3" strokeLinejoin="round" />
                </g>
              ))}
              {/* Full-bleed Cartoon Great Wall ribbon with brick joints */}
              <path
                d="M-20 260 Q460 165 950 212 Q1440 140 1940 225 L1940 285 Q1440 200 950 272 Q460 225 -20 320 Z"
                fill={C.mint}
                stroke={C.ink}
                strokeWidth="5"
              />
              {/* 3 Detailed Crenellated Watchtowers with crisp PASS flags */}
              {[320, 910, 1490].map((tx, idx) => (
                <g key={tx} transform={`translate(${tx}, ${idx === 1 ? 142 : 118})`}>
                  {/* Battlement tower body */}
                  <rect x="0" y="28" width="94" height="70" rx="10" fill="#ffffff" stroke={C.ink} strokeWidth="4.5" />
                  {/* Twin mini windows */}
                  <rect x="14" y="42" width="14" height="16" rx="4" fill={C.skySoft} stroke={C.ink} strokeWidth="2.5" />
                  <rect x="66" y="42" width="14" height="16" rx="4" fill={C.skySoft} stroke={C.ink} strokeWidth="2.5" />
                  {/* Central arched gate */}
                  <rect x="34" y="54" width="26" height="44" rx="13" fill={C.mintSoft} stroke={C.ink} strokeWidth="3.5" />
                  {/* Crenellated mint battlements */}
                  <rect x="-8" y="14" width="110" height="18" rx="6" fill={C.mint} stroke={C.ink} strokeWidth="4" />
                  <rect x="4" y="4" width="18" height="12" rx="3" fill={C.mint} stroke={C.ink} strokeWidth="3.5" />
                  <rect x="38" y="4" width="18" height="12" rx="3" fill={C.mint} stroke={C.ink} strokeWidth="3.5" />
                  <rect x="72" y="4" width="18" height="12" rx="3" fill={C.mint} stroke={C.ink} strokeWidth="3.5" />
                  {/* Flagpole + bright PASS pennant */}
                  <line x1="47" y1="4" x2="47" y2="-36" stroke={C.ink} strokeWidth="4.5" />
                  <polygon points="47,-36 128,-20 47,-4" fill={C.butter} stroke={C.ink} strokeWidth="3.5" />
                  <text x="56" y="-15" fontSize="16" fontWeight="700" fill={C.ink}>PASS</text>
                </g>
              ))}
            </svg>

            {/* Full-bleed grass verge + real asphalt road */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 196,
                background: "#b7f0da",
                borderTop: `4px solid ${C.mint}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 0,
                right: 0,
                height: 146,
                background: "#353140",
                borderTop: `5px solid ${C.ink}`,
                borderBottom: `5px solid ${C.ink}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 0 rgba(38,34,40,0.14)",
              }}
            >
              <div
                style={{
                  width: "96%",
                  height: 8,
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #fff3cc 0 48px, transparent 48px 96px)",
                  opacity: 0.78,
                }}
              />
            </div>

            {/* Roadside ChatGPT Disclaimer Sign + Mini ArmorBot Traffic Cop beside the Pothole */}
            {showPothole && (
              <>
                <div
                  style={{
                    position: "absolute",
                    right: 112,
                    bottom: 174,
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 14,
                    zIndex: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        background: "#ffffff",
                        border: `4px solid ${C.ink}`,
                        borderRadius: 20,
                        padding: "10px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        boxShadow: "0 8px 0 rgba(38,34,40,0.14)",
                      }}
                    >
                      <ChatGPTKnot size={34} />
                      <span style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>
                        模拟绿 ≠ 实车不翻坑
                      </span>
                    </div>
                    <div style={{ width: 8, height: 32, background: C.ink }} />
                  </div>
                  <ArmorBot size={165} armorLevel={3} glassesGlint beatOffset={3013} />
                </div>

                {/* Pothole + cute orange safety cone */}
                <div
                  style={{
                    position: "absolute",
                    right: 330,
                    bottom: 54,
                    width: 280,
                    height: 84,
                    borderRadius: 999,
                    background: C.ink,
                    border: `5px dashed ${C.coral}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.butter,
                    fontSize: 30,
                    fontWeight: 700,
                    zIndex: 6,
                  }}
                >
                  🕳 未测分支坑
                </div>
              </>
            )}

            {/* Cute Autonomous Lidar Truck with MochiCat peeking inside */}
            {showTruck && (
              <div style={{ position: "absolute", left: 560 + truckX, bottom: 72, zIndex: 10 }}>
                <CuteTruck size={325} wobble={showPothole} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 58, marginTop: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <ExtrudedTitle
                text="还得我硬撑！"
                size={76}
                color={C.coral}
                shadowColor="#ffffff"
                startFrame={228}
                stagger={3}
                beatOffset={3013}
              />
              <SpeechBubble bg="#ffffff" borderColor={C.coral}>
                <div style={{ fontSize: 34, fontWeight: 700, color: C.ink }}>
                  ChatGPT 只负责叠甲，实车上线靠自己 💪
                </div>
              </SpeechBubble>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  background: C.mint,
                  color: "#fff",
                  border: `5px solid ${C.ink}`,
                  borderRadius: 28,
                  padding: "18px 42px",
                  fontSize: 36,
                  fontWeight: 700,
                  marginBottom: -22,
                  zIndex: 5,
                  boxShadow: `0 10px 0 ${C.ink}`,
                  transform: `rotate(${Math.sin(frame * 0.4) * 5}deg)`,
                }}
              >
                实车验收 + 318行代码 + 边界坑
              </div>
              <MochiCat size={325} mood="sweat" beatOffset={3013} />
            </div>
          </div>
        )}
      </div>
      <SceneWipeIn color={C.mint} />
    </KawaiiStage>
  );
};
