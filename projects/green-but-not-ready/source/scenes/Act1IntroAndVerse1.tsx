import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ArmorBot,
  ChatGPTHeaderPill,
  ChatGPTKnot,
  CozyDesk,
  EqualizerBars,
  MochiCat,
} from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import {
  C,
  CandyPill,
  KawaiiStage,
  SpeechBubble,
  useAudioBeat,
} from "../stage";

/** Act 1 (0..308f / 0:00-0:10.28): Rich Sunburst 8-Bit Intro with ChatGPT Emblem & 3D Typography */
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(0);

  const catIn = spring({ frame: Math.max(0, frame - 48), fps, config: { damping: 11, stiffness: 165 } });
  const botIn = spring({ frame: Math.max(0, frame - 72), fps, config: { damping: 11, stiffness: 165 } });
  const armorLvl: 0 | 1 | 2 | 3 =
    frame > 240 ? 3 : frame > 195 ? 2 : frame > 150 ? 1 : 0;
  const camZoom = interpolate(frame, [0, 308], [1.04, 1.0], { extrapolateRight: "clamp" });

  return (
    <KawaiiStage theme="cream" globalOffset={0}>
      <CanvasFXLayer
        mode="sunburst"
        globalOffset={0}
        burstFrames={[24, 96, 160, 240]}
        waveColor={C.pink}
      />

      {/* Subtle floating ChatGPT UI glass cards framing left & right edges */}
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 235 + Math.sin(frame * 0.06) * 10,
          background: "rgba(255,255,255,0.78)",
          border: `3px solid ${C.ink}22`,
          borderRadius: 22,
          padding: "14px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          transform: "rotate(-4deg)",
          boxShadow: "0 10px 24px rgba(38,34,40,0.06)",
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 700, color: C.ink }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, background: "#10a37f" }} />
          <span>New chat · 02:51</span>
        </div>
        <div style={{ fontSize: 16, color: C.sub, fontWeight: 700 }}>• 今天能发版吗？</div>
        <div style={{ fontSize: 16, color: C.sub, fontWeight: 700 }}>• 为什么改 3 行变 318？</div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 54,
          top: 245 + Math.cos(frame * 0.06) * 10,
          background: "rgba(255,255,255,0.78)",
          border: `3px solid ${C.ink}22`,
          borderRadius: 22,
          padding: "14px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          transform: "rotate(4deg)",
          boxShadow: "0 10px 24px rgba(38,34,40,0.06)",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "#10a37f" }}>🛡 免责声明已预热</div>
        <div style={{ fontSize: 16, color: C.sub, fontWeight: 700 }}>不是…而是… ✓</div>
        <div style={{ fontSize: 16, color: C.sub, fontWeight: 700 }}>未核实不应假定 ✓</div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          marginBottom: 24,
          transform: `scale(${camZoom})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <ChatGPTHeaderPill model="ChatGPT · Codex" thoughtSec={Math.min(42, Math.floor(frame / 6))} />
          <CandyPill text="♪ 8-BIT 叠甲吐槽 MV ♪" bg={C.pink} size={30} delay={10} />
        </div>

        {/* 3D Extruded Bouncing Main Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 4 }}>
          <div
            style={{
              background: C.mint,
              color: "#fff",
              fontSize: 94,
              fontWeight: 700,
              padding: "14px 44px",
              borderRadius: 999,
              border: `5px solid ${C.ink}`,
              boxShadow: `0 12px 0 ${C.ink}`,
              transform: `scale(${spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 10 } }) * (1 + beat.onset * 0.045)})`,
            }}
          >
            绿灯了
          </div>
          <ExtrudedTitle
            text="，但不代表！"
            size={104}
            color={C.ink}
            shadowColor={C.butter}
            startFrame={28}
            stagger={4}
          />
        </div>

        {/* Two characters + ChatGPT prompt preview card in the middle */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 64,
            marginTop: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translateX(${(1 - catIn) * -200}px)`,
              opacity: catIn,
            }}
          >
            <MochiCat
              size={255}
              mood={frame > 170 ? "sparkle" : "happy"}
              holding="coffee"
              jump={Math.max(0, beat.onset * 30)}
            />
            <CandyPill text="打工人小奶猫" bg={C.sky} size={24} delay={60} />
          </div>

          {/* Center ChatGPT-style mini disclaimer box */}
          <div
            style={{
              background: "#ffffff",
              border: `4.5px solid ${C.ink}`,
              borderRadius: 30,
              padding: "22px 32px",
              boxShadow: `0 12px 0 rgba(38,34,40,0.14)`,
              marginBottom: 42,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              transform: `scale(${1 + beat.onset * 0.04})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ChatGPTKnot size={46} spin={frame * 2.5} />
              <span style={{ fontSize: 32, fontWeight: 700, color: C.ink }}>
                ChatGPT 防御模式 ON
              </span>
            </div>
            <div
              style={{
                fontSize: 22,
                color: C.sub,
                background: "#f4f2ec",
                padding: "8px 20px",
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              ChatGPT 绿灯了，但不代表不会炸。请自行核实。
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translateX(${(1 - botIn) * 200}px)`,
              opacity: botIn,
            }}
          >
            <ArmorBot
              size={265}
              armorLevel={armorLvl}
              glassesGlint={frame > 225}
              jump={Math.max(0, beat.low * 22)}
            />
            <CandyPill text="ChatGPT 叠甲宝宝" bg={C.mint} size={24} delay={84} />
          </div>
        </div>

        <EqualizerBars width={1200} height={86} />
      </div>
    </KawaiiStage>
  );
};

/** Act 2 (308..599f / 10.28s-19.96s): Cozy Dev Desk + ChatGPT Prompt + 3-Layer Armor Stack */
export const Verse1MorningScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0..291
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(308);

  const showDeploy = frame >= 48;
  const armorLevel: 0 | 1 | 2 | 3 =
    frame >= 180 ? 3 : frame >= 154 ? 2 : frame >= 129 ? 1 : 0;
  const tremble = frame >= 203;
  const deployPop = spring({ frame: Math.max(0, frame - 48), fps, config: { damping: 10, stiffness: 200 } });

  return (
    <KawaiiStage theme="mint" globalOffset={308}>
      <CanvasFXLayer
        mode="sunburst"
        globalOffset={308}
        burstFrames={[48, 129, 154, 180, 203]}
        waveColor={C.mint}
      />

      {/* Cozy pastel morning office backdrop: soft wall horizon + sunny window behind desk */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 295,
          background: "linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(212,244,232,0.52) 100%)",
          borderTop: "4px solid rgba(23,184,144,0.16)",
          pointerEvents: "none",
        }}
      />
      <svg
        width="340"
        height="270"
        viewBox="0 0 340 270"
        style={{ position: "absolute", left: 105, top: 185, opacity: 0.55, pointerEvents: "none" }}
      >
        <rect x="10" y="10" width="320" height="230" rx="26" fill="#e6f7ff" stroke="#ffffff" strokeWidth="10" />
        {/* Warm morning sunbeam diagonal rays */}
        <polygon points="40,18 140,18 240,234 110,234" fill="#fff7d6" opacity="0.55" />
        {/* Cute floating clouds outside window */}
        <g transform={`translate(${110 + Math.sin(frame * 0.04) * 14}, 72)`}>
          <ellipse cx="0" cy="10" rx="34" ry="14" fill="#ffffff" />
          <circle cx="-12" cy="4" r="14" fill="#ffffff" />
          <circle cx="12" cy="2" r="16" fill="#ffffff" />
        </g>
        <g transform={`translate(${235 + Math.cos(frame * 0.03) * 12}, 135)`}>
          <ellipse cx="0" cy="8" rx="26" ry="11" fill="#ffffff" />
          <circle cx="8" cy="2" r="12" fill="#ffffff" />
        </g>
        {/* Window cross mullions + wooden sill */}
        <line x1="170" y1="14" x2="170" y2="236" stroke="#ffffff" strokeWidth="8" />
        <line x1="14" y1="125" x2="326" y2="125" stroke="#ffffff" strokeWidth="8" />
        <rect x="0" y="232" width="340" height="22" rx="11" fill="#f3d5b5" />
      </svg>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          marginBottom: 95,
          width: 1580,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              background: C.butterSoft,
              border: `4px solid ${C.ink}`,
              borderRadius: 999,
              padding: "10px 28px",
              fontSize: 32,
              fontWeight: 700,
              boxShadow: "0 8px 0 rgba(38,34,40,0.12)",
            }}
          >
            ☀️ 10:00 AM
          </div>
          <ChatGPTHeaderPill model="ChatGPT" thoughtSec={armorLevel * 12 + 4} />
          <CandyPill
            text={
              tremble
                ? "怕出问题实在怕！"
                : armorLevel > 0
                  ? `叠甲 Lv.${armorLevel} 🛡`
                  : "早安工位提问"
            }
            bg={tremble ? C.coral : armorLevel > 0 ? C.butter : C.mint}
            color={armorLevel > 0 && !tremble ? C.ink : "#fff"}
            size={30}
            beatOffset={308}
          />
        </div>

        {/* Rich 3-column scene: MochiCat at CozyDesk | ChatGPT Prompt Card | ArmorBot stacking shields */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: 1500,
          }}
        >
          {/* Left: MochiCat behind cozy desk */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <SpeechBubble bg="#ffffff" borderColor={C.ink} delay={4} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 34, fontWeight: 700 }}>
                {showDeploy ? "这版今天能发吗？🚀" : "早上十点问你句话～"}
              </div>
            </SpeechBubble>
            <div style={{ marginBottom: -70, zIndex: 5 }}>
              <MochiCat
                size={235}
                mood={tremble ? "sweat" : showDeploy ? "sparkle" : "happy"}
                holding="typing"
                beatOffset={308}
              />
            </div>
            <CozyDesk width={420} screenText={showDeploy ? "DEPLOY?" : "10:00 AM"} />
          </div>

          {/* Center: Interactive ChatGPT prompt bar + Deploy badge + Armor progress */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, marginBottom: 45 }}>
            {showDeploy && (
              <div
                style={{
                  background: `linear-gradient(135deg, ${C.pink}, ${C.coral})`,
                  color: "#fff",
                  fontSize: 42,
                  fontWeight: 700,
                  padding: "22px 46px",
                  borderRadius: 30,
                  border: `5px solid ${C.ink}`,
                  boxShadow: `0 12px 0 ${C.ink}`,
                  transform: `scale(${deployPop * (1 + beat.onset * 0.06)}) rotate(${tremble ? -5 : 2}deg)`,
                }}
              >
                DEPLOY 🚀
              </div>
            )}

            {/* ChatGPT-style input box */}
            <div
              style={{
                width: 440,
                background: "#ffffff",
                border: `4px solid ${C.ink}`,
                borderRadius: 28,
                padding: "16px 24px",
                boxShadow: "0 10px 0 rgba(38,34,40,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 25, fontWeight: 700, color: C.sub }}>
                {armorLevel > 0 ? "正在疯狂生成免责条款..." : "Ask ChatGPT anything..."}
              </span>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  background: C.ink,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                ↑
              </div>
            </div>

            {armorLevel > 0 && (
              <div style={{ display: "flex", gap: 10 }}>
                {[1, 2, 3].map((lvl) => (
                  <div
                    key={lvl}
                    style={{
                      background: armorLevel >= lvl ? C.butter : "#e9e5db",
                      border: `3.5px solid ${C.ink}`,
                      borderRadius: 16,
                      padding: "8px 16px",
                      fontSize: 23,
                      fontWeight: 700,
                      opacity: armorLevel >= lvl ? 1 : 0.35,
                    }}
                  >
                    {lvl === 1 ? "⛑ 安全帽" : lvl === 2 ? "🛟 救生圈" : "🛡 免责盾"}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: ChatGPT ArmorBot */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <SpeechBubble
              bg={tremble ? C.coralSoft : C.mintSoft}
              borderColor={tremble ? C.coral : C.ink}
              delay={129}
            >
              <div style={{ fontSize: 32, fontWeight: 700, color: C.ink }}>
                {tremble ? "呜呜万一炸了怎么办！" : "等等！我先叠满三层甲！"}
              </div>
            </SpeechBubble>
            <ArmorBot
              size={310}
              armorLevel={armorLevel}
              tremble={tremble}
              beatOffset={308}
            />
          </div>
        </div>
      </div>
      <SceneWipeIn color={C.mint} />
    </KawaiiStage>
  );
};

/** Act 3 (599..890f / 19.96s-29.66s): Glowing Traffic Light Bomb + Terminal Logs + Caution Tape */
export const Verse1GreenBombScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0..291
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(599);

  const exploded = frame >= 76;
  const showLogs = frame >= 136;
  const showTape = frame >= 213;

  const boomPop = spring({ frame: Math.max(0, frame - 76), fps, config: { damping: 9, stiffness: 220 } });
  const tapeSlide = spring({ frame: Math.max(0, frame - 213), fps, config: { damping: 12, stiffness: 180 } });
  const shake = frame >= 76 && frame < 94 ? interpolate(frame, [76, 94], [20, 0]) : 0;

  return (
    <KawaiiStage theme="peach" globalOffset={599} shake={shake}>
      <CanvasFXLayer
        mode={exploded && !showLogs ? "speedlines" : "codeRain"}
        globalOffset={599}
        burstFrames={[76, 213]}
        waveColor={exploded ? C.coral : C.mint}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          marginBottom: 95,
          width: 1520,
        }}
      >
        {!showLogs ? (
          <div style={{ display: "flex", alignItems: "center", gap: 76 }}>
            <MochiCat size={280} mood={exploded ? "shock" : "cheer"} beatOffset={599} />

            {/* Detailed Traffic Light Pillar turning into cartoon BOOM explosion */}
            <div style={{ position: "relative", width: 460, height: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {!exploded ? (
                <div
                  style={{
                    width: 220,
                    background: "#2d2a38",
                    border: `6px solid ${C.ink}`,
                    borderRadius: 48,
                    padding: "26px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 22,
                    boxShadow: `0 18px 0 rgba(38,34,40,0.18)`,
                    transform: `scale(${1 + beat.onset * 0.05})`,
                  }}
                >
                  <div style={{ width: 92, height: 92, borderRadius: 999, background: "#4a4458", border: `4px solid ${C.ink}` }} />
                  <div style={{ width: 92, height: 92, borderRadius: 999, background: "#4a4458", border: `4px solid ${C.ink}` }} />
                  <div
                    style={{
                      width: 112,
                      height: 112,
                      borderRadius: 999,
                      background: C.mint,
                      border: `5px solid #ffffff`,
                      boxShadow: `0 0 50px ${C.mint}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 54,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    ✓
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: 390,
                    height: 390,
                    borderRadius: 999,
                    background: `radial-gradient(circle, ${C.butter} 0%, ${C.coral} 68%, #d63031 100%)`,
                    border: `7px solid ${C.ink}`,
                    boxShadow: `0 18px 0 ${C.ink}, 0 0 90px ${C.coral}88`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${0.75 + boomPop * 0.35}) rotate(${Math.sin(frame * 0.4) * 5}deg)`,
                  }}
                >
                  <div style={{ fontSize: 102 }}>💥</div>
                  <div style={{ fontSize: 48, fontWeight: 700, color: "#fff", textShadow: "0 4px 0 #262228" }}>
                    BOOM! 炸啦!
                  </div>
                </div>
              )}
            </div>

            <ArmorBot size={290} armorLevel={3} glassesGlint={exploded} beatOffset={599} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 44, width: 1460 }}>
            <MochiCat size={240} mood={showTape ? "pout" : "happy"} beatOffset={599} />

            {/* Realistic Dark Terminal Window with marching green logs */}
            <div
              style={{
                flex: 1,
                background: "#1c1926",
                border: `5px solid ${C.ink}`,
                borderRadius: 30,
                overflow: "hidden",
                boxShadow: "0 18px 46px rgba(38,34,40,0.22)",
              }}
            >
              <div
                style={{
                  background: "#2d293d",
                  padding: "14px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 99, background: C.coral }} />
                  <div style={{ width: 16, height: 16, borderRadius: 99, background: C.butter }} />
                  <div style={{ width: 16, height: 16, borderRadius: 99, background: C.mint }} />
                </div>
                <span style={{ color: "#c9c4d6", fontSize: 22, fontWeight: 700 }}>
                  runtime.log — ChatGPT Verdict
                </span>
                <ChatGPTKnot size={30} />
              </div>
              <div style={{ padding: "24px 30px", display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "[INFO 10:01] 服务启动耗时 0.12s …… OK ✓",
                  "[INFO 10:02] 内存 / CPU 指标全绿 …… OK ✓",
                  "[INFO 10:03] 0 Error / 0 Warning …… OK ✓",
                ].map((line, i) => {
                  const p = spring({
                    frame: Math.max(0, frame - 136 - i * 14),
                    fps,
                    config: { damping: 12 },
                  });
                  return (
                    <div
                      key={line}
                      style={{
                        background: "rgba(23, 184, 144, 0.14)",
                        border: `2.5px solid ${C.mint}`,
                        borderRadius: 18,
                        padding: "14px 24px",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#9ef0d8",
                        fontFamily: "monospace",
                        transform: `translateX(${(1 - p) * -45}px)`,
                        opacity: p,
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>

            <ArmorBot size={250} armorLevel={3} glassesGlint={showTape} beatOffset={599} />
          </div>
        )}
      </div>

      {/* Double crossed caution tape slamming across on "但是不能保证啦" */}
      {showTape && (
        <>
          <div
            style={{
              position: "absolute",
              left: -120,
              right: -120,
              top: 390,
              height: 114,
              background: "repeating-linear-gradient(-45deg, #ffb703 0 36px, #262228 36px 72px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(-6deg) scaleX(${tapeSlide})`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.26)",
              zIndex: 40,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                color: C.coral,
                border: `5px solid ${C.ink}`,
                borderRadius: 999,
                padding: "12px 48px",
                fontSize: 46,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <ChatGPTKnot size={44} bg={C.coral} />
              <span>但是不能保证啦！免责声明生效！</span>
            </div>
          </div>
        </>
      )}
      <SceneWipeIn color={C.coral} />
    </KawaiiStage>
  );
};

/** Act 4 (890..1199f / 29.66s-39.98s): Pre-Chorus — 4-Panel Comic Spotlight Push-In! */
export const PreChorusScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0..309
  const { fps } = useVideoConfig();

  const cards = [
    { start: 0, left: "PASS ✓", op: "≠", right: "验收通过", color: C.mint, icon: "📋", note: "ChatGPT 批注：仅通过编译" },
    { start: 81, left: "能跑通", op: "≠", right: "可以发货", color: C.sky, icon: "🚧", note: "ChatGPT 批注：尚未压测" },
    { start: 159, left: "测过了", op: "≠", right: "没有漏虫", color: C.pink, icon: "🐛", note: "ChatGPT 批注：存在未知分支" },
    { start: 223, left: "边界线", op: "→", right: "全部说透！", color: C.butter, icon: "🔍", note: "ChatGPT 批注：免责完毕" },
  ];

  const activeIdx =
    frame >= 223 ? 3 : frame >= 159 ? 2 : frame >= 81 ? 1 : 0;

  return (
    <KawaiiStage theme="lavender" globalOffset={890}>
      <CanvasFXLayer
        mode="speedlines"
        globalOffset={890}
        burstFrames={[4, 81, 159, 223]}
        waveColor={C.lavender}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          marginBottom: 95,
          width: 1560,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <ChatGPTHeaderPill model="ChatGPT 免责引擎" thoughtSec={activeIdx * 9 + 11} />
          <CandyPill text="叠甲预备式 × 4" bg={C.lavender} size={34} beatOffset={890} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
            width: 1460,
          }}
        >
          {cards.map((card, i) => {
            const visible = frame >= card.start;
            const pop = spring({
              frame: Math.max(0, frame - card.start),
              fps,
              config: { damping: 10, stiffness: 220 },
            });
            const isCurrent = i === activeIdx;
            return (
              <div
                key={card.left}
                style={{
                  background: isCurrent ? "#ffffff" : "rgba(255,255,255,0.78)",
                  border: `5px solid ${isCurrent ? card.color : C.ink}`,
                  borderRadius: 34,
                  padding: "26px 34px",
                  boxShadow: isCurrent
                    ? `0 16px 0 ${card.color}, 0 24px 48px rgba(38,34,40,0.14)`
                    : "0 8px 0 rgba(38,34,40,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  transform: `scale(${visible ? pop * (isCurrent ? 1.04 : 0.96) : 0.65})`,
                  opacity: visible ? (isCurrent ? 1 : 0.72) : 0.12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <span style={{ fontSize: 52 }}>{card.icon}</span>
                  <span style={{ fontSize: 42, fontWeight: 700, color: C.ink }}>{card.left}</span>
                  <span
                    style={{
                      fontSize: 46,
                      fontWeight: 700,
                      color: C.coral,
                      background: C.coralSoft,
                      padding: "2px 16px",
                      borderRadius: 14,
                    }}
                  >
                    {card.op}
                  </span>
                  <span style={{ fontSize: 42, fontWeight: 700, color: card.color }}>{card.right}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.sub, paddingLeft: 70 }}>
                  {card.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <SceneWipeIn color={C.lavender} />
    </KawaiiStage>
  );
};
