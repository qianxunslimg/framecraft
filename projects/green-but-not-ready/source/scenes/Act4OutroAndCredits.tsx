import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ArmorBot,
  ChatGPTHeaderPill,
  ChatGPTKnot,
  EqualizerBars,
  MochiCat,
} from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, KawaiiStage, SpeechBubble, useAudioBeat } from "../stage";

/** Act 11 (4078..4455f / 135.92s-148.50s): Cozy Sunset Window + City Skyline + 18:00 Twist */
export const OutroSunsetScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0..377
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(4078);

  const botPeeks = frame >= 66;
  const showLights = frame >= 146;
  const showCheck = frame >= 226;

  const botSlide = spring({
    frame: Math.max(0, frame - 66),
    fps,
    config: { damping: 11, stiffness: 180 },
  });

  return (
    <KawaiiStage theme="sunset" globalOffset={4078}>
      <CanvasFXLayer
        mode="sunsetBokeh"
        globalOffset={4078}
        burstFrames={[66, 146, 226]}
        waveColor={C.coral}
      />

      {/* Warm Glowing Setting Sun + Evening City Skyline Silhouette along the horizon */}
      <div
        style={{
          position: "absolute",
          bottom: 185,
          left: "50%",
          width: 420,
          height: 420,
          marginLeft: -210,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(255,244,200,0.92) 0%, rgba(255,183,3,0.45) 45%, transparent 72%)",
          pointerEvents: "none",
        }}
      />
      <svg
        width="1920"
        height="260"
        viewBox="0 0 1920 260"
        style={{ position: "absolute", bottom: 110, left: 0, opacity: 0.25, pointerEvents: "none" }}
      >
        <path
          d="M0 260 L0 150 L90 150 L90 110 L170 110 L170 175 L260 175 L260 80 L360 80 L360 160 L480 160 L480 120 L580 120 L580 190 L720 190 L720 95 L830 95 L830 165 L1020 165 L1020 75 L1130 75 L1130 150 L1290 150 L1290 105 L1410 105 L1410 170 L1560 170 L1560 88 L1690 88 L1690 145 L1810 145 L1810 115 L1920 115 L1920 260 Z"
          fill="#6d4c5b"
        />
        {/* Warm lit office windows */}
        {[
          [112, 130], [136, 130], [285, 105], [315, 105], [285, 132], [750, 120],
          [780, 120], [1050, 102], [1082, 102], [1050, 130], [1325, 130], [1590, 112], [1624, 112],
        ].map(([wx, wy], i) => (
          <rect key={i} x={wx} y={wy} width="16" height="16" rx="3" fill="#fff3b0" />
        ))}
      </svg>

      {/* String of glowing green/gold fairy lights with curved wire */}
      {showLights && (
        <div style={{ position: "absolute", top: 20, left: 80, right: 80, height: 110 }}>
          <svg width="1760" height="80" viewBox="0 0 1760 80" style={{ position: "absolute", top: 0, left: 0 }}>
            <path d="M0 16 Q440 72 880 26 Q1320 72 1760 16" stroke={C.ink} strokeWidth="4" fill="none" opacity="0.5" />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 36px 0" }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 999,
                  background: i % 2 === 0 ? C.mint : C.butter,
                  border: `4px solid ${C.ink}`,
                  boxShadow: `0 0 ${22 + beat.low * 28}px ${i % 2 === 0 ? C.mint : C.butter}`,
                  transform: `translateY(${Math.sin((i / 8) * Math.PI) * 18}px) scale(${1 + beat.onset * 0.14})`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          marginBottom: 95,
          width: 1500,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              background: "#ffffff",
              border: `4px solid ${C.ink}`,
              borderRadius: 999,
              padding: "10px 30px",
              fontSize: 32,
              fontWeight: 700,
              boxShadow: "0 8px 0 rgba(38,34,40,0.12)",
            }}
          >
            🌇 18:00 PM · 下班时间到啦？
          </div>
          <ChatGPTHeaderPill model="ChatGPT 下班审查" />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: 1380,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <SpeechBubble bg="#ffffff" borderColor={C.ink}>
              <div style={{ fontSize: 36, fontWeight: 700 }}>
                {showCheck ? "好好好，我再查一遍行了吧~" : "唱完啦！背上书包下班咯 ♪"}
              </div>
            </SpeechBubble>
            <MochiCat
              size={305}
              mood={showCheck ? "pout" : botPeeks ? "shock" : "cheer"}
              holding={showCheck ? "magnifier" : "bag"}
              beatOffset={4078}
            />
          </div>

          {botPeeks && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
                transform: `translateX(${(1 - botSlide) * 200}px)`,
                opacity: botSlide,
              }}
            >
              <SpeechBubble bg={C.mintSoft} borderColor={C.mint}>
                <div style={{ fontSize: 35, fontWeight: 700, color: C.ink }}>
                  {showCheck
                    ? "🔍 上线前请再查查清单哦～"
                    : "等等！时钟六点 ≠ 可以下班！"}
                </div>
              </SpeechBubble>
              <ArmorBot size={305} armorLevel={3} glassesGlint={showCheck} beatOffset={4078} />
            </div>
          )}
        </div>
      </div>
      <SceneWipeIn color={C.coral} />
    </KawaiiStage>
  );
};

/** Act 12 (4455..5115f / 148.50s-170.50s): Grand 8-Bit Arcade Curtain Call + Confetti Finale! */
export const FinalArcadeCurtainScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0..660
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(4455);

  const showCredits = frame >= 145 && frame < 445;
  const finalLockup = frame >= 445;

  const lockPop = spring({
    frame: Math.max(0, frame - 445),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  return (
    <KawaiiStage theme={finalLockup ? "cream" : "arcade"} globalOffset={4455}>
      <CanvasFXLayer
        mode={finalLockup ? "confetti" : "arcadeGrid"}
        globalOffset={4455}
        burstFrames={[15, 145, 300, 445, 580]}
        waveColor={C.pink}
        showWave={finalLockup}
      />

      {!finalLockup ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            width: 1500,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <ChatGPTKnot size={56} spin={frame * 3.5} />
            <CandyPill
              text={showCredits ? "🎬 趣味演职表 & 免责声明" : "♪ 欢快 8-BIT 谢幕返场 ♪"}
              bg={C.pink}
              size={42}
              beatOffset={4455}
            />
            <ChatGPTKnot size={56} spin={-frame * 3.5} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 76 }}>
            <MochiCat
              size={275}
              mood="cheer"
              beatOffset={4455}
              jump={Math.max(0, beat.onset * 42)}
            />

            {showCredits && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 690 }}>
                {[
                  "🐱 主演：打工人小奶猫 & ChatGPT 叠甲宝宝",
                  "🎵 音乐：海绵音乐 SeedMusic 1.0",
                  "🎬 动画：Framecraft × Remotion 1080p",
                  "🛡 免责：本片绿灯已亮，但不代表下次不叠甲 :)",
                ].map((line, i) => {
                  const p = spring({
                    frame: Math.max(0, frame - 145 - i * 24),
                    fps,
                    config: { damping: 12 },
                  });
                  return (
                    <div
                      key={line}
                      style={{
                        background: "rgba(255,255,255,0.96)",
                        color: C.ink,
                        border: `4px solid ${[C.mint, C.pink, C.sky, C.butter][i]}`,
                        borderRadius: 24,
                        padding: "16px 28px",
                        fontSize: 29,
                        fontWeight: 700,
                        boxShadow: "0 10px 0 rgba(0,0,0,0.22)",
                        transform: `scale(${p})`,
                        opacity: p,
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            )}

            <ArmorBot
              size={285}
              armorLevel={frame % 90 < 45 ? 3 : 1}
              glassesGlint={beat.onset > 0.5}
              beatOffset={4455}
              jump={Math.max(0, beat.low * 36)}
            />
          </div>

          <EqualizerBars beatOffset={4455} width={1380} height={155} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            transform: `scale(${lockPop})`,
            opacity: lockPop,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 58 }}>
            <MochiCat size={265} mood="cheer" beatOffset={4455} />
            <ChatGPTKnot size={88} spin={frame * 2.2} />
            <ArmorBot size={275} armorLevel={1} beatOffset={4455} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                background: C.mint,
                color: "#fff",
                fontSize: 94,
                fontWeight: 700,
                padding: "16px 46px",
                borderRadius: 999,
                border: `5px solid ${C.ink}`,
                boxShadow: `0 12px 0 ${C.ink}`,
              }}
            >
              绿灯了
            </div>
            <ExtrudedTitle
              text="，但不代表！"
              size={104}
              color={C.ink}
              shadowColor={C.butter}
              startFrame={455}
              stagger={3}
              beatOffset={4455}
            />
          </div>

          <CandyPill
            text="✨ ChatGPT 绿灯仅供参考 · 上线前请再查查哦 ✨"
            bg={C.pink}
            size={32}
            beatOffset={4455}
          />
        </div>
      )}
      <SceneWipeIn color={C.pink} />
    </KawaiiStage>
  );
};
