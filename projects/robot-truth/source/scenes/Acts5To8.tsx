import React, { useEffect, useRef } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ForensicStage, GlassViewport, SceneTiming, getCue } from "../ForensicStage";
import { drawHumanoidRobot, drawRobotArm, hexRgba } from "../kinematics";

/* ============================================================================
 * ACT 5: PLOT TWIST — Physical Data Gap (15T Tokens vs Near Zero) ->
 *                     Live Teleop -> Imitation Learning Data Flywheel!
 * ============================================================================ */
export const PlotTwistAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cZero = getCue(scene.cues, "internetZero");
  const cLoop = getCue(scene.cues, "imitationLoop");

  const isLoop = frame >= cLoop.from;
  const isTomato = frame >= cZero.from && frame < cLoop.from;
  const accent = isLoop ? C.emerald : C.gold;

  const barGrow = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16, stiffness: 80 } });
  const loopLocal = Math.max(0, frame - cLoop.from);
  const demoCount = Math.min(10000, Math.floor(loopLocal * 38));

  // Tomato grip force demo in internetZero
  const forceWave = 3.2 + 3.2 * (0.5 + 0.5 * Math.sin(frame * 0.1));
  const squished = forceWave > 5.4;

  return (
    <ForensicStage
      accent={accent}
      tag={scene.badge}
      telemetry={isLoop ? "TELEOP -> IMITATION LEARNING -> AUTONOMY" : "THE BOTTLENECK // PHYSICAL INTERACTION DATA GAP"}
    >
      {!isLoop ? (
        <>
          <div style={{ position: "absolute", top: 82, left: 110 }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.gold, letterSpacing: "0.24em", fontWeight: 800 }}>
              PLOT TWIST // WHY TELEOPERATION ACTUALLY MATTERS
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              反转：遥操作不是丢人的作假，而是破解「数据荒」的唯一钥匙
            </div>
          </div>

          {/* Left: Colossal Scale Disparity Chart */}
          <GlassViewport x={110} y={225} w={960} h={650} accent={C.gold} label="大模型数据量 vs 机器人物理交互数据量" badge="10^6× DATA GAP">
            <div style={{ padding: "36px 50px", height: "86%", display: "flex", alignItems: "flex-end", gap: 90 }}>
              {/* LLM Bar */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 900, color: C.cyan, marginBottom: 12 }}>
                  15,000,000,000,000+ Tokens
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 365 * barGrow,
                    borderRadius: "16px 16px 6px 6px",
                    background: `linear-gradient(180deg, ${C.cyan}, rgba(0, 120, 180, 0.35))`,
                    boxShadow: `0 0 36px ${hexRgba(C.cyan, 0.4)}`,
                    border: `2px solid ${C.cyan}`,
                  }}
                />
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginTop: 16 }}>互联网文本 / 视频</div>
                <div style={{ fontSize: 15, color: C.muted, marginTop: 4 }}>免费躺在网上随便抓</div>
              </div>

              {/* Embodied Physical Action Data Bar */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 900, color: C.crimson, marginBottom: 12 }}>
                  几乎为 0（网上搜不到！）
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 18,
                    borderRadius: 6,
                    background: C.crimson,
                    boxShadow: `0 0 24px ${C.crimson}`,
                  }}
                />
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginTop: 16 }}>真机关节力矩 + 触觉数据</div>
                <div style={{ fontSize: 15, color: "#fda4af", marginTop: 4 }}>必须靠真人在物理世界一条条采</div>
              </div>
            </div>
          </GlassViewport>

          {/* Right: Ripe Tomato Force Control Meter */}
          <GlassViewport x={1110} y={225} w={700} h={650} accent={isTomato && squished ? C.crimson : C.emerald} label="维基百科里查不到的物理直觉" badge="FORCE FEEDBACK">
            <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: 26 }}>
              <div style={{ fontSize: 22, color: "#e2e8f0", lineHeight: 1.65 }}>
                拿一颗熟透的番茄，20 个指节每一毫秒该用多少牛顿的力？
              </div>

              {/* Dynamic Tomato Squeeze Visual */}
              <div
                style={{
                  padding: "32px 24px",
                  borderRadius: 18,
                  background: "rgba(3, 6, 15, 0.85)",
                  border: `1.5px solid ${squished ? C.crimson : C.emerald}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 112,
                    height: squished ? 76 : 108,
                    margin: "0 auto",
                    borderRadius: "50%",
                    background: squished
                      ? "radial-gradient(circle, #ff2a5f, #7f1d1d)"
                      : "radial-gradient(circle at 35% 35%, #fb7185, #dc2626)",
                    boxShadow: `0 0 32px ${hexRgba(squished ? C.crimson : "#ef4444", 0.5)}`,
                  }}
                />
                <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 900, color: squished ? C.crimson : C.emerald, marginTop: 22 }}>
                  GRIP FORCE: {forceWave.toFixed(1)} N · {squished ? "💥 捏爆了！" : "✓ 刚好稳稳托起"}
                </div>
              </div>

              <div style={{ fontFamily: "monospace", fontSize: 16, color: C.gold, lineHeight: 1.8 }}>
                <div>需要的数据格式：</div>
                <div style={{ color: "#e2e8f0" }}>[RGB-D 画面 + 20 关节角 + 6 维力矩 + 触觉矩阵]</div>
              </div>
            </div>
          </GlassViewport>
        </>
      ) : (
        /* IMITATION LEARNING DATA FLYWHEEL */
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", top: 82, left: 110 }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.emerald, letterSpacing: "0.24em", fontWeight: 800 }}>
              DATA FLYWHEEL // FROM HUMAN TELEOP TO FULL AUTONOMY
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              数采训练场 → 模仿学习 → 彻底甩掉人类自主泛化
            </div>
          </div>

          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {[0, 1, 2].map((i) => {
              const x1 = 110 + i * 445 + 375;
              const x2 = 110 + (i + 1) * 445;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={460}
                  x2={x2}
                  y2={460}
                  stroke={C.emerald}
                  strokeWidth="4.5"
                  strokeDasharray="12 8"
                  strokeDashoffset={-frame * 4}
                />
              );
            })}
          </svg>

          {[
            { num: "01", title: "人类专家示范", sub: "TELEOP TRAINING FARM", desc: `操作员用主从臂 / VR 示范叠衣洗碗，已采集 ${demoCount.toLocaleString()} 条真机成功轨迹`, col: C.gold },
            { num: "02", title: "多模态同步录制", sub: "VISION + JOINT + TORQUE", desc: "以 50–200Hz 同步记录双目画面、每个关节编码器角度与指尖压力反馈", col: C.cyan },
            { num: "03", title: "模仿学习策略", sub: "ACT / DIFFUSION / VLA", desc: "神经网络学习「看到这种画面 → 输出这段连续动作块」的深层物理规律", col: C.violet },
            { num: "04", title: "彻底脱离人类", sub: "TRUE AUTONOMOUS AI", desc: "拔掉遥控器！机器人在全新陌生环境里自己看、自己想、自己纠错完成任务", col: C.emerald },
          ].map((st, i) => (
            <GlassViewport key={i} x={110 + i * 445} y={265} w={375} h={390} accent={st.col} label={`${st.num} ${st.title}`} badge={st.sub} glow={i === 3 ? 0.95 : 0.55} delay={i * 6}>
              <div style={{ padding: "28px 26px", fontSize: 19, color: "#e2e8f0", lineHeight: 1.75 }}>
                {st.desc}
              </div>
            </GlassViewport>
          ))}

          {/* Bottom Verdict Callout */}
          <GlassViewport x={240} y={715} w={1440} h={135} accent={C.gold} glow={0.85}>
            <div style={{ padding: "0 44px", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#fff" }}>
                结论：<span style={{ color: C.emerald }}>用遥操作采集训练数据是正经科研</span>，只有<span style={{ color: C.crimson }}>拿遥控演示冒充全自主</span>才叫忽悠！
              </div>
            </div>
          </GlassViewport>
        </div>
      )}
    </ForensicStage>
  );
};

/* ============================================================================
 * ACT 6: VLA BRAIN — Fast-Slow Dual System (VLM 5Hz + Live Diffusion Policy Denoising 200Hz)
 *                    -> 24-Agent Parallel GPU Sim2Real Grid!
 * ============================================================================ */
export const VlaBrainAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cSim = getCue(scene.cues, "sim2Real");
  const isSim = frame >= cSim.from;
  const accent = isSim ? C.cyan : C.violet;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);

    if (!isSim) {
      // Live Diffusion Policy Denoising Visualization (cleanly contained inside viewport y=540..840)
      const ox = 1030;
      const oy = 735;
      const denoiseCycle = (frame % 75) / 75;
      const noiseScale = Math.pow(1 - Math.min(1, denoiseCycle * 1.35), 2);

      for (let k = 0; k < 14; k++) {
        ctx.save();
        ctx.strokeStyle = k === 0 ? C.emerald : hexRgba(C.violet, 0.25 + noiseScale * 0.45);
        ctx.lineWidth = k === 0 ? 4.5 : 1.8;
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
          const u = i / 40;
          const px = ox + u * 690;
          const idealY = oy - Math.sin(u * Math.PI) * 86 + Math.sin(u * Math.PI * 2) * 18;
          const jitter =
            k === 0
              ? 0
              : (Math.sin(k * 7.3 + i * 0.6) * 52 + Math.cos(k * 3.1 + i * 1.1) * 34) * noiseScale * Math.sin(u * Math.PI);
          if (i === 0) ctx.moveTo(px, idealY + jitter);
          else ctx.lineTo(px, idealY + jitter);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Live Articulated Arm driven by converged System 1 path (Bottom-Left Viewport)
      const reachU = Math.min(1, denoiseCycle * 1.1);
      drawRobotArm(
        ctx,
        { x: 240, y: 810 },
        { x: 460 + reachU * 230, y: 740 - Math.sin(reachU * Math.PI) * 115 },
        { l1: 240, l2: 220, flip: -1, thickness: 26, accent: C.emerald, grip: reachU > 0.85 ? 0.9 : 0.2, wristCam: true },
      );

      ctx.font = "800 17px monospace";
      ctx.fillStyle = C.emerald;
      ctx.fillText(
        `DIFFUSION STEP: ${Math.round(denoiseCycle * 10)} / 10  ·  NOISE=${(noiseScale * 100).toFixed(0)}%  ·  200Hz TORQUE OUT`,
        1030,
        845,
      );
    } else {
      // 24-Agent Parallel GPU Physics Sim2Real Training Grid (6 cols x 4 rows)
      const simLocal = frame - cSim.from;
      const skill = Math.min(1, simLocal / 190); // 0 = chaotic falling, 1 = synchronized parkour mastery!

      const floors = [C.cyan, C.gold, C.emerald, C.violet];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 6; c++) {
          const idx = r * 6 + c;
          const cx = 245 + c * 285;
          const cy = 285 + r * 172;
          const col = floors[(r + c) % floors.length];

          // Cell box
          ctx.fillStyle = "rgba(8, 16, 34, 0.82)";
          ctx.strokeStyle = hexRgba(col, 0.45);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(cx - 122, cy - 68, 244, 148, 12);
          ctx.fill();
          ctx.stroke();

          // Randomized ground friction strip
          ctx.strokeStyle = col;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx - 102, cy + 56);
          ctx.lineTo(cx + 102, cy + 56);
          ctx.stroke();

          // Miniature articulated learning robot inside each GPU cell
          const stumble = (1 - skill) * Math.sin(simLocal * 0.22 + idx * 1.7) * 32;
          const armSwing = Math.sin(simLocal * 0.16 + idx * 0.6) * 28;
          drawHumanoidRobot(ctx, cx, cy - 8 + Math.abs(stumble) * 0.25, 0.30, {
            leftTarget: { x: cx - 32, y: cy - 12 + armSwing },
            rightTarget: { x: cx + 32, y: cy - 12 - armSwing },
            bodySway: stumble * 0.5,
            headTilt: stumble * 0.015,
            accent: skill > 0.72 ? C.emerald : col,
            xray: true,
            frame: frame + idx * 3,
          });

          // Random domain-randomization red disturbance ball flying in!
          if (idx % 3 === 0) {
            const bx = cx - 95 + (((simLocal * 4 + idx * 19) % 190));
            ctx.fillStyle = C.crimson;
            ctx.beginPath();
            ctx.arc(bx, cy - 18, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
  }, [frame, isSim, cSim.from]);

  const episodes = Math.floor(Math.max(0, frame - cSim.from) * 4280);

  return (
    <ForensicStage
      accent={accent}
      tag={scene.badge}
      telemetry={isSim ? `GPU PARALLEL SIM2REAL // ${episodes.toLocaleString()} EPISODES` : "VLA ARCHITECTURE // SYSTEM 2 (5Hz) + SYSTEM 1 (200Hz)"}
    >
      {!isSim ? (
        <>
          {/* Top Full-Width System 2: Slow-Thinking VLM Brain */}
          <GlassViewport x={110} y={102} w={1700} h={310} accent={C.cyan} label="System 2 慢思考大脑 · 多模态视觉语言模型（VLM · 2–5 Hz）" badge="SEMANTIC REASONING" glow={0.7}>
            <div style={{ padding: "26px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: 520 }}>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.cyan }}>USER VOICE + STEREO RGB INPUT</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginTop: 8 }}>
                  “帮我把桌上的脏盘子收进水槽”
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {["1. 语义识别脏盘子", "2. 估算 3D 抓取点", "3. 避让旁边玻璃杯", "4. 下发隐空间目标向量"].map((step, k) => (
                  <div
                    key={k}
                    style={{
                      padding: "18px 20px",
                      borderRadius: 14,
                      background: hexRgba(C.cyan, 0.14),
                      border: `1.5px solid ${hexRgba(C.cyan, 0.55)}`,
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </GlassViewport>

          {/* Bottom-Left: Physical Arm Receiving 200Hz Torques */}
          <GlassViewport x={110} y={455} w={830} h={425} accent={C.emerald} label="机械臂高频闭环执行" badge="200Hz MOTOR TORQUE" glow={0.7} />

          {/* Bottom-Right: System 1 Diffusion Policy Denoising Window */}
          <GlassViewport x={980} y={455} w={830} h={425} accent={C.violet} label="System 1 快反射小脑 · 扩散策略实时去噪" badge="DIFFUSION / FLOW POLICY" glow={0.9} />
        </>
      ) : (
        <div style={{ position: "absolute", top: 82, left: 120, right: 120, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.cyan, letterSpacing: "0.24em", fontWeight: 800 }}>
              MASSIVELY PARALLEL GPU PHYSICS + DOMAIN RANDOMIZATION
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#fff", marginTop: 4 }}>
              虚拟世界 1 小时摔倒 100 万次 → 肌肉记忆迁移到真实机身
            </div>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 900, color: C.emerald, padding: "12px 24px", borderRadius: 12, background: hexRgba(C.emerald, 0.16), border: `1.5px solid ${C.emerald}` }}>
            SIM: {episodes.toLocaleString()} 次
          </div>
        </div>
      )}

      <canvas ref={canvasRef} width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
    </ForensicStage>
  );
};

/* ============================================================================
 * ACT 7: CHEATSHEET — 4-Step Viewer Forensic Scanner HUD
 * ============================================================================ */
export const CheatsheetAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeIdx = Math.min(3, Math.floor(frame / Math.max(1, scene.duration / 4)));

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);

    drawHumanoidRobot(ctx, 960, 520, 1.18, {
      leftTarget: { x: 800 + Math.sin(frame * 0.06) * 30, y: 460 + Math.cos(frame * 0.07) * 28 },
      rightTarget: { x: 1120 - Math.sin(frame * 0.06) * 30, y: 460 - Math.cos(frame * 0.07) * 28 },
      headTilt: Math.sin(frame * 0.05) * 0.12,
      accent: C.cyan,
      xray: true,
      frame,
    });
  }, [frame]);

  const cards = [
    { x: 100, y: 185, num: "01", title: "查倍速与一镜到底", desc: "死盯背景时钟、行人步速与重力下落，拒绝 4× 加速和 50 选 1 剪辑", col: C.gold },
    { x: 1290, y: 185, num: "02", title: "找幕后与隐蔽手柄", desc: "扫视镜头边缘幕布、工作人员手里的手柄/手机与 200ms 人工犹豫延迟", col: C.orange },
    { x: 100, y: 550, num: "03", title: "盯现场随机捣乱", desc: "杯子突然被拖走、东西掉在桌上，看它能不能半空改道自主捡回来", col: C.emerald },
    { x: 1290, y: 550, num: "04", title: "看真实杂乱环境", desc: "敢不敢离开纯白摄影棚，在杂乱厨房、透明玻璃杯与陌生光影下干活", col: C.cyan },
  ];

  return (
    <ForensicStage accent={C.cyan} tag={scene.badge} telemetry="VIEWER ANTI-HYPE DIAGNOSTIC // 4 CHECKS">
      <div style={{ position: "absolute", top: 76, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: "#fff" }}>
          三秒看穿机器人演示的「四步防忽悠体检表」
        </div>
      </div>

      {cards.map((c, idx) => {
        const lit = idx <= activeIdx;
        const current = idx === activeIdx;
        return (
          <GlassViewport
            key={idx}
            x={c.x}
            y={c.y}
            w={530}
            h={295}
            accent={lit ? c.col : C.dim}
            label={`${c.num}  ${c.title}`}
            badge={current ? "SCANNING" : lit ? "CHECKED ✓" : "STANDBY"}
            glow={current ? 1.0 : lit ? 0.5 : 0.15}
          >
            <div style={{ padding: "28px 30px", fontSize: 21, color: lit ? "#f1f5f9" : C.muted, lineHeight: 1.7 }}>
              {c.desc}
            </div>
          </GlassViewport>
        );
      })}

      <canvas ref={canvasRef} width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
    </ForensicStage>
  );
};

/* ============================================================================
 * ACT 8: FINALE — Real Progress Beyond Hype -> Snapping the Invisible Tether!
 * ============================================================================ */
export const FinaleAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cOutro = getCue(scene.cues, "outroCall");
  const isOutro = frame >= cOutro.from;
  const outroLocal = Math.max(0, frame - cOutro.from);
  const snapP = spring({ frame: outroLocal, fps, config: { damping: 16, stiffness: 85 } });

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);

    // Center Humanoid Robot snapping free of the crimson tether into serene emerald autonomy!
    const waveX = 1105 + Math.cos(frame * 0.09) * 32;
    const waveY = 390 + Math.sin(frame * 0.09) * 36;
    drawHumanoidRobot(ctx, 960, 535, 1.12, {
      leftTarget: { x: 830, y: 615 },
      rightTarget: { x: waveX, y: waveY },
      headTilt: Math.sin(frame * 0.05) * 0.08,
      accent: isOutro ? C.emerald : C.cyan,
      xray: false,
      frame,
    });

    // Crimson tether snapping and fading out as outro begins!
    const tetherAlpha = isOutro ? Math.max(0, 1 - snapP * 1.35) : 0.85;
    if (tetherAlpha > 0.02) {
      ctx.save();
      ctx.strokeStyle = hexRgba(C.crimson, tetherAlpha);
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(960, 440);
      ctx.quadraticCurveTo(600, 290, 160, 440);
      ctx.stroke();
      ctx.restore();
    }

    // Autonomous Emerald Halo expanding when tether breaks!
    if (isOutro) {
      ctx.save();
      ctx.strokeStyle = hexRgba(C.emerald, 0.55);
      ctx.lineWidth = 2.4;
      ctx.setLineDash([16, 12]);
      ctx.beginPath();
      ctx.arc(960, 520, 210 + snapP * 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }, [frame, isOutro, snapP]);

  return (
    <ForensicStage
      accent={isOutro ? C.emerald : C.cyan}
      tag={scene.badge}
      telemetry={isOutro ? "AUTONOMOUS VLA // TETHER DISCONNECTED" : "BEYOND THE MARKETING HYPE"}
    >
      <canvas ref={canvasRef} width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {!isOutro ? (
        <>
          <GlassViewport x={110} y={240} w={540} h={360} accent={C.crimson} label="剥离短期营销泡沫" badge="HYPE LAYER">
            <div style={{ padding: "28px 30px", fontSize: 21, color: "#fecdd3", lineHeight: 1.75 }}>
              靠隐蔽手柄、4× 加速和 50 选 1 剪辑吹出来的「伪全能」，终将被观众一眼识破。
            </div>
          </GlassViewport>
          <GlassViewport x={1270} y={240} w={540} h={360} accent={C.emerald} label="看见真实工程跃迁" badge="REAL SINGULARITY" glow={0.9}>
            <div style={{ padding: "28px 30px", fontSize: 21, color: "#d1fae5", lineHeight: 1.75 }}>
              端到端 VLA 大模型 + 触觉灵巧手 + GPU 百万次并行仿真，正在真实地改写物理世界的自动化边界。
            </div>
          </GlassViewport>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            top: 96,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: snapP,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: 19, fontWeight: 800, letterSpacing: "0.34em", color: C.emerald }}>
            EMBODIED AI // BEYOND THE CURTAIN
          </div>
          <div
            style={{
              fontSize: 74,
              fontWeight: 900,
              color: "#fff",
              marginTop: 14,
              textShadow: `0 0 42px ${hexRgba(C.emerald, 0.65)}, 0 10px 30px rgba(0,0,0,0.96)`,
            }}
          >
            看见幕后的线 · 才看得懂真未来
          </div>
          <div
            style={{
              width: 560 * snapP,
              height: 3.5,
              marginTop: 18,
              background: `linear-gradient(90deg, transparent, ${C.emerald}, #ffffff, ${C.cyan}, transparent)`,
            }}
          />
        </div>
      )}
    </ForensicStage>
  );
};
