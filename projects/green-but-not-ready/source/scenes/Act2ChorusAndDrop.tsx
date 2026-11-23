import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ArmorBot,
  CandyIconBadge,
  ChatGPTActionBar,
  ChatGPTHeaderPill,
  ChatGPTKnot,
  EqualizerBars,
  MochiCat,
} from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, KawaiiStage, useAudioBeat } from "../stage";

/**
 * Upgraded Rich Chorus Scene (Chorus 1 & Chorus 2)
 * Features dynamic Canvas speedlines/confetti, ChatGPT UI footers, 3D typography, and 8 per-line interactive gags!
 */
export const ChorusScene: React.FC<{
  globalOffset: number;
  festive?: boolean;
}> = ({ globalOffset, festive = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(globalOffset);

  const step =
    frame >= 536
      ? 7
      : frame >= 452
        ? 6
        : frame >= 370
          ? 5
          : frame >= 303
            ? 4
            : frame >= 222
              ? 3
              : frame >= 152
                ? 2
                : frame >= 66
                  ? 1
                  : 0;

  const seesawTilt = Math.sin(frame * 0.16) * 9.5;
  const spinAngle = frame * 7.5;

  return (
    <KawaiiStage
      theme={step === 7 ? "arcade" : festive ? "peach" : "cream"}
      globalOffset={globalOffset}
    >
      <CanvasFXLayer
        mode={step === 7 ? "arcadeGrid" : festive ? "confetti" : "speedlines"}
        globalOffset={globalOffset}
        burstFrames={[0, 66, 152, 222, 303, 370, 452, 536]}
        waveColor={step === 7 ? C.butter : C.pink}
      />

      {/* Steps 0 & 1: Giant Pastel Seesaw with grass hill base + 3D title */}
      {(step === 0 || step === 1) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            marginBottom: 90,
          }}
        >
          <ExtrudedTitle
            text={step === 0 ? "不是这个 · 而是那个！" : "不能这样 · 不代表啦！"}
            size={68}
            color={step === 0 ? C.pink : C.coral}
            shadowColor="#ffffff"
            startFrame={step === 0 ? 0 : 66}
            stagger={2}
            beatOffset={globalOffset}
          />
          <div
            style={{
              width: 1180,
              height: 450,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              position: "relative",
            }}
          >
            {/* Soft meadow ground base */}
            <div
              style={{
                position: "absolute",
                bottom: -14,
                width: 960,
                height: 44,
                borderRadius: 999,
                background: C.mintSoft,
                border: `4px solid ${C.mint}`,
              }}
            />
            <div
              style={{
                width: 980,
                height: 24,
                borderRadius: 999,
                background: C.ink,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transform: `rotate(${seesawTilt}deg)`,
                zIndex: 5,
              }}
            >
              <div
                style={{
                  transform: `translate(-24px, -120px) rotate(${-seesawTilt}deg)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <CandyPill
                  text={step === 0 ? "不是这个" : "不能这样"}
                  bg={C.coral}
                  size={40}
                  beatOffset={globalOffset}
                />
                <MochiCat size={190} mood="dizzy" beatOffset={globalOffset} />
              </div>

              <div
                style={{
                  transform: `translate(24px, -120px) rotate(${-seesawTilt}deg)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <CandyPill
                  text={step === 0 ? "而是那个呀" : "不代表啦"}
                  bg={C.mint}
                  size={40}
                  beatOffset={globalOffset}
                />
                <ArmorBot size={195} armorLevel={3} beatOffset={globalOffset} />
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 6,
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "54px solid transparent",
                  borderRight: "54px solid transparent",
                  borderBottom: `76px solid ${C.butter}`,
                }}
              />
              <div style={{ position: "absolute", top: 24 }}>
                <ChatGPTKnot size={42} spin={frame * 3} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: ChatGPT message bubble armored in 3 clean non-overlapping shields + MochiCat & ArmorBot flanking! */}
      {step === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            marginBottom: 95,
            width: 1700,
          }}
        >
          <ChatGPTHeaderPill model="ChatGPT 叠甲气泡" thoughtSec={19} />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 36,
              width: 1680,
            }}
          >
            <MochiCat size={245} mood="sweat" beatOffset={globalOffset} />

            <div
              style={{
                position: "relative",
                width: 990,
                height: 515,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {[
                { w: 960, h: 495, top: 8, color: C.pink, label: "甲③：不承诺跨环境一致", d: 28 },
                { w: 790, h: 390, top: 72, color: C.butter, label: "甲②：仅限当前上下文", d: 14 },
                { w: 620, h: 285, top: 136, color: C.sky, label: "甲①：仅供参考", d: 2 },
              ].map((shield) => {
                const p = spring({
                  frame: Math.max(0, frame - 152 - shield.d),
                  fps,
                  config: { damping: 10, stiffness: 200 },
                });
                return (
                  <div
                    key={shield.label}
                    style={{
                      position: "absolute",
                      top: shield.top,
                      width: shield.w,
                      height: shield.h,
                      borderRadius: 48,
                      background: `${shield.color}1e`,
                      border: `5px dashed ${shield.color}`,
                      transform: `scale(${p * (1 + beat.onset * 0.03)})`,
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: 12,
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        height: 36,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "rgba(255,255,255,0.92)",
                        padding: "2px 18px",
                        borderRadius: 999,
                        border: `2.5px solid ${shield.color}`,
                        fontSize: 22,
                        fontWeight: 700,
                        color: shield.color === C.butter ? "#b57b00" : shield.color,
                      }}
                    >
                      🛡 {shield.label}
                    </span>
                  </div>
                );
              })}

              {/* Authentic ChatGPT reply bubble cleanly seated inside甲① with crisp monochrome SVG action icons */}
              <div
                style={{
                  position: "absolute",
                  top: 210,
                  background: "#ffffff",
                  border: `5px solid ${C.ink}`,
                  borderRadius: 32,
                  padding: "24px 44px 20px",
                  boxShadow: `0 10px 0 ${C.ink}`,
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <ChatGPTKnot size={44} />
                  <span style={{ fontSize: 44, fontWeight: 700, color: C.ink }}>“嗯，没问题。”</span>
                </div>
                <ChatGPTActionBar size={23} />
              </div>
            </div>

            <ArmorBot size={255} armorLevel={3} glassesGlint beatOffset={globalOffset} />
          </div>
        </div>
      )}

      {/* Step 3: 虽然但是绕圈说呀 — Swirling hypnotic carousel! */}
      {step === 3 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 90,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 780,
              height: 580,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Glowing orbital ring */}
            <div
              style={{
                position: "absolute",
                width: 520,
                height: 420,
                borderRadius: 999,
                border: `6px dashed ${C.pink}66`,
                transform: `rotate(${frame * 2}deg)`,
              }}
            />
            {["虽然", "但是", "诚然", "然而", "不过", "况且"].map((word, idx) => {
              const rad = ((idx * 60 + spinAngle) * Math.PI) / 180;
              const x = Math.cos(rad) * 265;
              const y = Math.sin(rad) * 210;
              const cols = [C.pink, C.mint, C.sky, C.butter, C.lavender, C.coral];
              return (
                <div
                  key={word}
                  style={{
                    position: "absolute",
                    transform: `translate(${x}px, ${y}px) scale(${1 + beat.onset * 0.1})`,
                    background: cols[idx],
                    color: "#fff",
                    fontSize: 42,
                    fontWeight: 700,
                    padding: "14px 34px",
                    borderRadius: 999,
                    border: `4px solid ${C.ink}`,
                    boxShadow: `0 8px 0 ${C.ink}`,
                  }}
                >
                  {word}
                </div>
              );
            })}
            <MochiCat size={265} mood="dizzy" beatOffset={globalOffset} />
          </div>
        </div>
      )}

      {/* Step 4: 结论藏进括号里啦 — Giant Peek-a-boo Parentheses + ChatGPT footnote! */}
      {step === 4 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            marginBottom: 90,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
            <MochiCat size={250} mood="shock" holding="magnifier" beatOffset={globalOffset} />
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span
                style={{
                  fontSize: 300,
                  fontWeight: 700,
                  color: C.lavender,
                  lineHeight: 0.82,
                  textShadow: `0 10px 0 ${C.ink}`,
                  transform: `translateX(${Math.sin(frame * 0.25) * 18}px)`,
                }}
              >
                (
              </span>
              <div
                style={{
                  background: "#ffffff",
                  border: `4.5px solid ${C.ink}`,
                  borderRadius: 30,
                  padding: "28px 38px",
                  boxShadow: "0 14px 0 rgba(38,34,40,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ fontSize: 24, color: C.sub, fontWeight: 700 }}>
                  * 仅在无外部变量干扰的前提下
                </div>
                <CandyPill text="微小结论：行吧" bg={C.mint} size={36} beatOffset={globalOffset} />
                <div style={{ fontSize: 22, color: C.sub }}>
                  ChatGPT can make mistakes. 请自行二次核验。
                </div>
              </div>
              <span
                style={{
                  fontSize: 300,
                  fontWeight: 700,
                  color: C.lavender,
                  lineHeight: 0.82,
                  textShadow: `0 10px 0 ${C.ink}`,
                  transform: `translateX(${-Math.sin(frame * 0.25) * 18}px)`,
                }}
              >
                )
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: 免责声明摞成高塔 — Tall 6-Floor Wobbling Skyscraper of Disclaimers! */}
      {step === 5 && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 64,
            marginBottom: 95,
          }}
        >
          <MochiCat size={240} mood="shock" beatOffset={globalOffset} />
          <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: 9 }}>
            {[
              { text: "① 不代表生产环境可用", bg: C.mintSoft, bd: C.mint },
              { text: "② 不承诺跨平台一致", bg: C.skySoft, bd: C.sky },
              { text: "③ 未覆盖分支风险自负", bg: C.butterSoft, bd: C.butter },
              { text: "④ ChatGPT 可能会犯错", bg: C.lavenderSoft, bd: C.lavender },
              { text: "⑤ 以上结论仅供参考", bg: C.pinkSoft, bd: C.pink },
              { text: "⑥ 最终解释权归边界所有", bg: C.coralSoft, bd: C.coral },
            ].map((b, i) => {
              const drop = spring({
                frame: Math.max(0, frame - 370 - i * 9),
                fps,
                config: { damping: 10, stiffness: 230 },
              });
              const sway = Math.sin(frame * 0.17 + i * 0.45) * (i * 3.4);
              return (
                <div
                  key={b.text}
                  style={{
                    width: 650,
                    background: b.bg,
                    border: `4px solid ${b.bd}`,
                    borderRadius: 22,
                    padding: "13px 30px",
                    fontSize: 30,
                    fontWeight: 700,
                    textAlign: "center",
                    boxShadow: "0 8px 0 rgba(38,34,40,0.1)",
                    transform: `translateY(${(1 - drop) * -130}px) translateX(${sway}px) rotate(${sway * 0.14}deg)`,
                    opacity: drop,
                  }}
                >
                  {b.text}
                </div>
              );
            })}
          </div>
          <ArmorBot size={245} armorLevel={3} beatOffset={globalOffset} />
        </div>
      )}

      {/* Step 6: 我就想问行不行 — Jumping MochiCat + giant 3D bouncing ??? rain */}
      {step === 6 && (
        <div
          style={{
            position: "relative",
            width: 1480,
            height: 620,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 80,
          }}
        >
          {[
            { x: -480, y: -150, s: 130, c: C.pink, r: -18 },
            { x: 480, y: -140, s: 145, c: C.butter, r: 16 },
            { x: -370, y: 120, s: 115, c: C.sky, r: 12 },
            { x: 380, y: 110, s: 125, c: C.coral, r: -14 },
            { x: -240, y: -210, s: 86, c: C.lavender, r: -8 },
            { x: 250, y: -200, s: 86, c: C.mint, r: 10 },
          ].map((q, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                fontSize: q.s,
                fontWeight: 700,
                color: q.c,
                textShadow: `0 6px 0 ${C.ink}`,
                transform: `translate(${q.x}px, ${q.y + Math.sin(frame * 0.35 + idx) * 20}px) rotate(${q.r}deg) scale(${1 + beat.onset * 0.18})`,
              }}
            >
              ？
            </div>
          ))}
          <MochiCat
            size={305}
            mood="shock"
            beatOffset={globalOffset}
            jump={Math.abs(Math.sin(frame * 0.35)) * 46}
          />
          <ExtrudedTitle
            text="到底行不行！？"
            size={74}
            color={C.coral}
            shadowColor="#ffffff"
            startFrame={452}
            stagger={2}
            beatOffset={globalOffset}
          />
        </div>
      )}

      {/* Step 7: Dramatic Neon Spotlight Freeze — 未核实 · 不应假定！ */}
      {step === 7 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            marginBottom: 90,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <ChatGPTKnot size={86} spin={frame * 3} />
            <ArmorBot size={315} armorLevel={3} glassesGlint beatOffset={globalOffset} />
            <ChatGPTKnot size={86} spin={-frame * 3} />
          </div>
          <div
            style={{
              background: C.butter,
              color: C.ink,
              fontSize: 82,
              fontWeight: 700,
              padding: "20px 64px",
              borderRadius: 999,
              border: "6px solid #ffffff",
              boxShadow: `0 0 70px ${C.butter}99`,
              transform: `scale(${spring({ frame: Math.max(0, frame - 536), fps, config: { damping: 9, stiffness: 210 } })})`,
            }}
          >
            ✨ 未核实 · 不应假定 ✨
          </div>
        </div>
      )}
      <SceneWipeIn color={festive ? C.pink : C.butter} />
    </KawaiiStage>
  );
};

/** Act 6 (1875..2431f / 62.5s-81.02s): 3D Perspective Neon 8-Bit Disco Stage + Spotlights + Juggling! */
export const InterludeDanceScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0..556
  const beat = useAudioBeat(1875);

  const bannerText =
    frame < 185
      ? "♪ 8-BIT 叠甲蹦迪时间 ♪"
      : frame < 370
        ? "ChatGPT 安全感指数：300% 🛡"
        : "⚠ 下午两点写代码预警…";

  const catJump = Math.max(0, Math.sin(frame * 0.34)) * 52 + beat.onset * 30;
  const botJump = Math.max(0, Math.cos(frame * 0.34)) * 52 + beat.low * 26;

  return (
    <KawaiiStage theme="arcade" globalOffset={1875}>
      <CanvasFXLayer
        mode="arcadeGrid"
        globalOffset={1875}
        burstFrames={[15, 110, 185, 290, 370, 480]}
        waveColor={C.sky}
        showWave={false}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          width: 1560,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <ChatGPTKnot size={58} spin={frame * 4} />
          <CandyPill
            text={bannerText}
            bg={frame < 185 ? C.pink : frame < 370 ? C.mint : C.butter}
            color={frame >= 370 ? C.ink : "#ffffff"}
            size={44}
            beatOffset={1875}
          />
          <ChatGPTKnot size={58} spin={-frame * 4} />
        </div>

        {/* Juggling arc of crisp glowing vector badges + shimmering center hologram */}
        <div
          style={{
            position: "relative",
            width: 1280,
            height: 400,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
          }}
        >
          {/* Glowing ChatGPT Disco Hologram behind center stage */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 125,
              transform: `translateX(-50%) scale(${1 + beat.low * 0.14})`,
              opacity: 0.24 + beat.onset * 0.18,
              filter: "drop-shadow(0 0 36px #10a37f)",
              pointerEvents: "none",
            }}
          >
            <ChatGPTKnot size={160} bg="#10a37f" spin={frame * 2.2} />
          </div>

          {(["shield", "heart", "coffee", "check", "chatgpt", "note"] as const).map((kind, i) => {
            const t = (frame * 0.025 + i / 6) % 1;
            const x = interpolate(t, [0, 1], [-235, 235]);
            const y = -Math.sin(t * Math.PI) * 145 - 105;
            return (
              <div
                key={kind}
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 84,
                  marginLeft: -31,
                  transform: `translate(${x}px, ${y}px) rotate(${Math.sin(frame * 0.14 + i) * 18}deg) scale(${0.95 + beat.onset * 0.2})`,
                }}
              >
                <CandyIconBadge kind={kind} size={62} />
              </div>
            );
          })}

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <MochiCat size={295} mood="cheer" beatOffset={1875} jump={catJump} />
            <div
              style={{
                width: 220,
                height: 20,
                borderRadius: 999,
                background: "radial-gradient(ellipse, rgba(255,107,157,0.55), transparent 72%)",
                marginTop: -12,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ArmorBot
              size={305}
              armorLevel={3}
              glassesGlint={beat.onset > 0.55}
              beatOffset={1875}
              jump={botJump}
            />
            <div
              style={{
                width: 230,
                height: 20,
                borderRadius: 999,
                background: "radial-gradient(ellipse, rgba(23,184,144,0.6), transparent 72%)",
                marginTop: -12,
              }}
            />
          </div>
        </div>

        <EqualizerBars beatOffset={1875} width={1420} height={185} />
      </div>
      <SceneWipeIn color={C.sky} />
    </KawaiiStage>
  );
};
