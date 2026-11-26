import React, { useEffect, useRef } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ForensicStage, GlassViewport, SceneTiming, getCue } from "../ForensicStage";
import {
  drawCoffeeMug,
  drawGamepad,
  drawHumanoidRobot,
  drawRobotArm,
  drawSpeedProofWidget,
  hexRgba,
} from "../kinematics";

/* ============================================================================
 * ACT 1: HOOK — Stage Spotlight vs X-Ray Curtain Reveal -> Forensic Main Title
 * ============================================================================ */
export const HookAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cXray = getCue(scene.cues, "xrayReveal");
  const cTitle = getCue(scene.cues, "titleSlam");

  const isXray = frame >= cXray.from && frame < cTitle.from;
  const isTitle = frame >= cTitle.from;
  const accent = isXray ? C.crimson : C.cyan;

  const xraySweep = spring({
    frame: Math.max(0, frame - cXray.from),
    fps,
    config: { damping: 16, stiffness: 70 },
  });
  const titlePop = spring({
    frame: Math.max(0, frame - cTitle.from),
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);

    const waveY = 420 + Math.sin(frame * 0.11) * 48;
    const waveX = 635 + Math.cos(frame * 0.11) * 34;

    if (!isTitle) {
      // Left Stage Robot (what viewers see in viral clip)
      drawHumanoidRobot(ctx, 480, 480, 1.05, {
        leftTarget: { x: 350, y: 560 + Math.sin(frame * 0.08) * 14 },
        rightTarget: { x: waveX, y: waveY },
        rightGrip: 0.3,
        headTilt: Math.sin(frame * 0.05) * 0.12,
        bodySway: Math.sin(frame * 0.06) * 8,
        accent: C.cyan,
        xray: false,
        frame,
      });
      drawCoffeeMug(ctx, 695, 575, C.gold, false, frame);

      // Right Curtain / X-Ray Revealed Hidden Operator
      const splitX = isXray ? interpolate(xraySweep, [0, 1], [1760, 960]) : 1760;

      // Draw X-Ray behind-the-curtain world on right half when xrayReveal activates
      if (isXray) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(splitX, 110, 1920 - splitX, 830);
        ctx.clip();

        // Dark X-Ray grid wash
        ctx.fillStyle = "rgba(24, 6, 16, 0.58)";
        ctx.fillRect(splitX, 110, 1920 - splitX, 830);

        // Hidden Operator wearing VR/Gamepad behind curtain
        drawHumanoidRobot(ctx, 1420, 480, 0.96, {
          leftTarget: { x: 1320, y: 540 },
          rightTarget: { x: 1520 + Math.cos(frame * 0.11) * 32, y: 425 + Math.sin(frame * 0.11) * 44 },
          headTilt: Math.sin(frame * 0.05) * 0.12,
          bodySway: Math.sin(frame * 0.06) * 6,
          accent: C.crimson,
          xray: true,
          frame,
        });
        drawGamepad(
          ctx,
          1215,
          650,
          0.55,
          { x: Math.sin(frame * 0.08), y: Math.cos(frame * 0.08) * 0.5 },
          { x: Math.cos(frame * 0.11), y: Math.sin(frame * 0.11) },
          Math.floor(frame / 18) % 2 === 0,
          C.crimson,
          frame,
        );

        ctx.restore();

        // Wireless crimson RF telemetry link cutting across the curtain!
        ctx.save();
        ctx.strokeStyle = C.crimson;
        ctx.lineWidth = 3.5;
        ctx.setLineDash([12, 10]);
        ctx.lineDashOffset = frame * 4;
        ctx.beginPath();
        ctx.moveTo(1360, 430);
        ctx.bezierCurveTo(1060, 290, 860, 290, 520, 415);
        ctx.stroke();

        // Vertical glowing X-Ray scanner beam at splitX
        const beamG = ctx.createLinearGradient(splitX - 35, 0, splitX + 35, 0);
        beamG.addColorStop(0, "transparent");
        beamG.addColorStop(0.5, hexRgba(C.crimson, 0.85));
        beamG.addColorStop(1, "transparent");
        ctx.fillStyle = beamG;
        ctx.fillRect(splitX - 35, 110, 70, 830);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(splitX, 110);
        ctx.lineTo(splitX, 940);
        ctx.stroke();
        ctx.restore();
      }
    } else {
      // Title Slam: Twin Symmetric Articulated Calibration Arms framing Main Title
      const t = frame - cTitle.from;
      drawRobotArm(
        ctx,
        { x: 160, y: 780 },
        { x: 420 + Math.sin(t * 0.05) * 45, y: 390 + Math.cos(t * 0.06) * 40 },
        { l1: 270, l2: 240, flip: -1, thickness: 32, accent: C.cyan, grip: 0.4, xray: true, wristCam: true },
      );
      drawRobotArm(
        ctx,
        { x: 1760, y: 780 },
        { x: 1500 - Math.sin(t * 0.05) * 45, y: 390 + Math.cos(t * 0.06) * 40 },
        { l1: 270, l2: 240, flip: 1, thickness: 32, accent: C.crimson, grip: 0.4, xray: true, wristCam: true },
      );
    }
  }, [frame, isXray, isTitle, xraySweep, cTitle.from]);

  return (
    <ForensicStage
      accent={accent}
      tag={scene.badge}
      telemetry={isTitle ? "FORENSIC INVESTIGATION // START" : isXray ? "X-RAY SCAN // RF TELEOP SIGNAL DETECTED" : "VIRAL EXPO DEMO // 10.8M VIEWS"}
    >
      {/* Split-screen labels */}
      {!isTitle && (
        <>
          <GlassViewport x={90} y={110} w={830} h={800} accent={C.cyan} label="你看到的爆火演示" badge="10.8M VIEWS · LIVE" glow={0.4} />
          {isXray && (
            <GlassViewport x={1000} y={110} w={830} h={800} accent={C.crimson} label="X 光透视：帷幕背后真相" badge="RF 2.4GHz · HUMAN TELEOP" glow={0.85} />
          )}
          {!isXray && (
            <GlassViewport x={1020} y={240} w={760} h={480} accent={C.cyan} label="舞台聚光灯下的完美表演" badge="AUTO OR TELEOP?" glow={0.5}>
              <div style={{ padding: "36px 40px", fontSize: 28, color: "#e2e8f0", lineHeight: 1.8 }}>
                <div style={{ color: C.cyan, fontWeight: 900, fontSize: 38, marginBottom: 18 }}>
                  倒咖啡 · 叠衣服 · 握手聊天
                </div>
                <div>丝滑得就像科幻电影走进现实——</div>
                <div style={{ marginTop: 14, color: C.gold, fontWeight: 800 }}>
                  可它脑子里跑的，真的是自主 AI 吗？
                </div>
              </div>
            </GlassViewport>
          )}
        </>
      )}

      <canvas ref={canvasRef} width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Hero Title Slam */}
      {isTitle && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 60,
            opacity: titlePop,
            transform: `scale(${0.92 + titlePop * 0.08})`,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, letterSpacing: "0.34em", color: C.cyan }}>
            EMBODIED AI FORENSIC LAB // 5-MINUTE DEEP DIVE
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: "#fff",
              marginTop: 18,
              textAlign: "center",
              lineHeight: 1.15,
              textShadow: `0 0 42px ${hexRgba(C.cyan, 0.55)}, 0 12px 32px rgba(0,0,0,0.95)`,
            }}
          >
            揭秘爆火机器人视频真相
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: C.gold, marginTop: 16, letterSpacing: "0.08em" }}>
            真 AI 自主决策  vs  幕后隐蔽遥控
          </div>
          <div
            style={{
              width: 620 * titlePop,
              height: 4,
              marginTop: 26,
              background: `linear-gradient(90deg, transparent, ${C.cyan}, #ffffff, ${C.crimson}, transparent)`,
            }}
          />
          <div style={{ display: "flex", gap: 22, marginTop: 34, fontFamily: "monospace", fontSize: 17 }}>
            {["01 四大隐蔽遥控流派", "02 四大工程法医铁证", "03 行业数据荒反转", "04 真 VLA 快慢大脑"].map((t, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  background: "rgba(10, 20, 40, 0.85)",
                  border: `1px solid ${hexRgba(C.cyan, 0.45)}`,
                  color: "#e2e8f0",
                  fontWeight: 700,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </ForensicStage>
  );
};

/* ============================================================================
 * ACT 2: FOUR MASKS — Gamepad+Macro -> ALOHA Leader-Follower ->
 *                     VR+Glove IK Retargeting -> Hybrid Wizard-of-Oz Shared Auto
 * ============================================================================ */
export const FourMasksAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cAloha = getCue(scene.cues, "leaderFollower");
  const cVr = getCue(scene.cues, "vrRetarget");
  const cShared = getCue(scene.cues, "sharedAuto");

  const mode =
    frame >= cShared.from ? "shared" : frame >= cVr.from ? "vr" : frame >= cAloha.from ? "aloha" : "gamepad";
  const accent = mode === "shared" ? C.crimson : mode === "vr" ? C.violet : mode === "aloha" ? C.cyan : C.orange;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);

    if (mode === "gamepad") {
      // Left: Animated Gamepad sending RF commands -> Right: Metronomic Preset Macro Humanoid
      const stickL = { x: Math.sin(frame * 0.08), y: -0.6 };
      const stickR = { x: Math.cos(frame * 0.12), y: Math.sin(frame * 0.12) };
      const btnFlash = Math.floor(frame / 22) % 2 === 0;
      drawGamepad(ctx, 480, 480, 1.15, stickL, stickR, btnFlash, C.orange, frame);

      // RF Packet Beam
      ctx.save();
      ctx.strokeStyle = C.orange;
      ctx.lineWidth = 4;
      ctx.setLineDash([14, 10]);
      ctx.lineDashOffset = -frame * 5;
      ctx.beginPath();
      ctx.moveTo(740, 480);
      ctx.lineTo(1180, 480);
      ctx.stroke();
      ctx.restore();

      const macroAng = Math.sin(frame * 0.16) * 58;
      drawHumanoidRobot(ctx, 1420, 505, 1.05, {
        leftTarget: { x: 1290, y: 585 },
        rightTarget: { x: 1555 + macroAng * 0.4, y: 365 + Math.abs(macroAng) * 0.45 },
        bodySway: stickL.x * 16,
        accent: C.orange,
        frame,
      });
    } else if (mode === "aloha") {
      // Live 1:1 Isomorphic Leader-Follower ALOHA / GELLO Kinematics Mirror!
      const t = frame - cAloha.from;
      const targetRelX = 215 + Math.sin(t * 0.06) * 85;
      const targetRelY = -40 + Math.cos(t * 0.08) * 65;
      const grip = 0.5 + 0.45 * Math.sin(t * 0.09);

      // Left Miniature Leader Arm (Operator holding it)
      const shL = { x: 260, y: 635 };
      const lRes = drawRobotArm(ctx, shL, { x: shL.x + targetRelX * 0.72, y: shL.y + targetRelY * 0.72 }, {
        l1: 170,
        l2: 150,
        flip: -1,
        thickness: 22,
        accent: C.cyan,
        grip,
        xray: true,
      });

      // Right Full-Size Follower Arm mirroring angles 1:1!
      const shR = { x: 1170, y: 675 };
      drawRobotArm(ctx, shR, { x: shR.x + targetRelX * 1.15, y: shR.y + targetRelY * 1.15 }, {
        l1: 255,
        l2: 225,
        flip: -1,
        thickness: 34,
        accent: C.emerald,
        grip,
        xray: false,
      });
      drawCoffeeMug(ctx, shR.x + targetRelX * 1.15 + 48, shR.y + targetRelY * 1.15 + 10, C.gold, false, frame);

      // Direct 1ms Joint Encoder Sync Lines
      ctx.save();
      ctx.strokeStyle = C.cyan;
      ctx.lineWidth = 3.2;
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -frame * 6;
      ctx.beginPath();
      ctx.moveTo(640, 480);
      ctx.lineTo(1140, 480);
      ctx.stroke();
      ctx.font = "800 18px monospace";
      ctx.fillStyle = C.cyan;
      ctx.textAlign = "center";
      ctx.fillText(
        `θ1=${((lRes.theta1 * 180) / Math.PI).toFixed(1)}°  θ2=${((lRes.theta2 * 180) / Math.PI).toFixed(1)}°  GRIP=${Math.round(grip * 100)}%`,
        890,
        452,
      );
      ctx.restore();
    } else if (mode === "vr") {
      // Left: Human Operator in VR + Data Gloves -> Center IK Solver -> Right Humanoid + Reverse Stereo Feed
      const t = frame - cVr.from;
      const hx = 135 + Math.sin(t * 0.07) * 55;
      const hy = -25 + Math.cos(t * 0.09) * 48;

      drawHumanoidRobot(ctx, 410, 520, 0.96, {
        leftTarget: { x: 410 - hx, y: 510 + hy },
        rightTarget: { x: 410 + hx, y: 465 - hy * 0.8 },
        headTilt: Math.sin(t * 0.06) * 0.16,
        accent: C.violet,
        xray: true,
        frame,
      });

      drawHumanoidRobot(ctx, 1510, 520, 1.02, {
        leftTarget: { x: 1510 - hx * 1.05, y: 510 + hy * 1.05 },
        rightTarget: { x: 1510 + hx * 1.05, y: 465 - hy * 0.85 },
        headTilt: Math.sin(t * 0.06) * 0.16,
        accent: C.cyan,
        xray: false,
        frame,
      });

      // Forward 6-DoF IK Retargeting Stream (top) & Reverse Stereo Camera Video Stream (bottom) — docked cleanly to center IK box!
      ctx.save();
      ctx.strokeStyle = C.violet;
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.lineDashOffset = -frame * 5;
      ctx.beginPath();
      ctx.moveTo(600, 440);
      ctx.lineTo(740, 440);
      ctx.moveTo(1180, 440);
      ctx.lineTo(1320, 440);
      ctx.stroke();

      ctx.strokeStyle = C.cyan;
      ctx.lineDashOffset = frame * 5;
      ctx.beginPath();
      ctx.moveTo(1320, 580);
      ctx.lineTo(1180, 580);
      ctx.moveTo(740, 580);
      ctx.lineTo(600, 580);
      ctx.stroke();
      ctx.restore();
    } else {
      // Hybrid Wizard-of-Oz Shared Autonomy: Green RL Legs + Cyan LLM Head + Crimson Human-Hijacked Arms!
      const t = frame - cShared.from;
      drawHumanoidRobot(ctx, 960, 505, 1.28, {
        leftTarget: { x: 780 + Math.sin(t * 0.08) * 35, y: 460 + Math.cos(t * 0.07) * 30 },
        rightTarget: { x: 1150 + Math.cos(t * 0.09) * 40, y: 430 + Math.sin(t * 0.08) * 35 },
        bodySway: Math.sin(t * 0.05) * 14,
        accent: C.cyan,
        legAccent: C.emerald,
        armAccent: C.crimson,
        xray: true,
        frame,
      });
    }
  }, [frame, mode, cAloha.from, cVr.from, cShared.from]);

  return (
    <ForensicStage
      accent={accent}
      tag={scene.badge}
      telemetry={
        mode === "shared"
          ? "MASK 04 // HYBRID WIZARD-OF-OZ"
          : mode === "vr"
            ? "MASK 03 // VR 6-DOF IK RETARGETING"
            : mode === "aloha"
              ? "MASK 02 // LEADER-FOLLOWER ALOHA"
              : "MASK 01 // GAMEPAD + PRESET MACRO"
      }
    >
      {/* Top 4-Pill Mode Stepper */}
      <div style={{ position: "absolute", top: 76, left: 100, right: 100, display: "flex", gap: 16 }}>
        {[
          { k: "gamepad", title: "01 游戏手柄 + 预设宏", col: C.orange },
          { k: "aloha", title: "02 同构主从臂 (ALOHA)", col: C.cyan },
          { k: "vr", title: "03 VR 头显 + 动捕手套", col: C.violet },
          { k: "shared", title: "04 半自主混合接管", col: C.crimson },
        ].map((item) => {
          const active = item.k === mode;
          return (
            <div
              key={item.k}
              style={{
                flex: 1,
                padding: "14px 20px",
                borderRadius: 12,
                background: active ? hexRgba(item.col, 0.22) : "rgba(10, 18, 36, 0.72)",
                border: `1.5px solid ${active ? item.col : "rgba(148,163,184,0.2)"}`,
                color: active ? "#fff" : C.muted,
                fontSize: 20,
                fontWeight: active ? 900 : 600,
                textAlign: "center",
                boxShadow: active ? `0 0 24px ${hexRgba(item.col, 0.35)}` : "none",
              }}
            >
              {item.title}
            </div>
          );
        })}
      </div>

      {/* Mode-Specific Forensic Viewports */}
      {mode === "gamepad" && (
        <>
          <GlassViewport x={100} y={165} w={760} h={725} accent={C.orange} label="幕后手柄 + 预设宏脚本" badge="2.4GHz RC · NO VISION">
            <div style={{ position: "absolute", bottom: 30, left: 32, right: 32, fontFamily: "monospace", fontSize: 16, color: "#fed7aa", lineHeight: 1.7 }}>
              <div>LEFT_STICK → 底盘移动速度 (vx, vy, yaw)</div>
              <div>BUTTON_B   → 触发录死动作: play_macro(&quot;WAVE_03&quot;)</div>
            </div>
          </GlassViewport>
          <GlassViewport x={1060} y={165} w={760} h={725} accent={C.orange} label="展会人形机器人（开环执行）" badge="PLAYING MACRO LOOP" />
        </>
      )}

      {mode === "aloha" && (
        <>
          <GlassViewport x={100} y={165} w={620} h={725} accent={C.cyan} label="主臂（人类握持微缩机械臂）" badge="LEADER · ENCODERS">
            <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, fontSize: 18, color: "#cbd5e1" }}>
              同构结构无需复杂解算，人类握持关节编码器直接输出精准角位移
            </div>
          </GlassViewport>
          <GlassViewport x={1080} y={165} w={740} h={725} accent={C.emerald} label="从臂（大机器人 1:1 实时镜像）" badge="FOLLOWER · 2ms SYNC" />
        </>
      )}

      {mode === "vr" && (
        <>
          <GlassViewport x={90} y={165} w={610} h={725} accent={C.violet} label="幕后操作员：VR + 动捕手套" badge="6-DOF + 20 FINGERS" />
          <GlassViewport x={740} y={320} w={440} h={370} accent={C.cyan} label="实时逆运动学解算" badge="IK RETARGETING" glow={0.85}>
            <div style={{ padding: "24px 26px", fontFamily: "monospace", fontSize: 15, lineHeight: 1.85, color: "#e2e8f0" }}>
              <div style={{ color: C.violet }}>→ 上行: 人手 6-DoF 位姿 → IK 解算电机角</div>
              <div style={{ color: C.cyan, marginTop: 18 }}>← 下行: 机器人双目立体画面回传 VR 镜片</div>
              <div style={{ color: C.gold, marginTop: 18 }}>体感：像坐进驾驶舱“开高达”附身演出</div>
            </div>
          </GlassViewport>
          <GlassViewport x={1220} y={165} w={610} h={725} accent={C.cyan} label="舞台异构人形机器人" badge="STEREO FPV LINK" />
        </>
      )}

      {mode === "shared" && (
        <>
          <GlassViewport x={110} y={205} w={510} h={210} accent={C.cyan} label="语音交互 · 真 AI" badge="LLM VOICE">
            <div style={{ padding: "22px 26px", fontSize: 19, color: "#cbd5e1" }}>现场自然问答确实接入了多模态语音大模型</div>
          </GlassViewport>
          <GlassViewport x={110} y={590} w={510} h={210} accent={C.emerald} label="双足站立与走路 · 真 AI" badge="RL LOCOMOTION">
            <div style={{ padding: "22px 26px", fontSize: 19, color: "#a7f3d0" }}>底盘与双腿确实靠强化学习策略自己稳住平衡</div>
          </GlassViewport>
          <GlassViewport x={1300} y={345} w={510} h={320} accent={C.crimson} label="关键抓握 3 秒 · 人工偷偷接管！" badge="HUMAN-IN-THE-LOOP" glow={1.0}>
            <div style={{ padding: "24px 28px", fontSize: 20, color: "#fecdd3", lineHeight: 1.7 }}>
              一到最容易翻车的抓杯子、选物体瞬间，后台工程师按住接管键悄悄完成操作，完事再交还系统——外行几乎无法察觉！
            </div>
          </GlassViewport>
        </>
      )}

      <canvas ref={canvasRef} width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
    </ForensicStage>
  );
};

/* ============================================================================
 * ACT 3: FORENSIC LAB PART 1 —
 *   Clue 1: Live 4x vs 1x Speed Comparison + 49/50 Cherry-Pick Filmstrip
 *   Clue 2: Live 8-12Hz Human Tremor vs AI Action Chunking Oscilloscope
 * ============================================================================ */
export const Forensic12Act: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cCherry = getCue(scene.cues, "cherryPick");
  const cJitter = getCue(scene.cues, "jitterWave");
  const cChunk = getCue(scene.cues, "aiChunkWave");

  const isSpeedSection = frame < cJitter.from;
  const isCherry = frame >= cCherry.from && frame < cJitter.from;
  const isChunk = frame >= cChunk.from;
  const accent = isSpeedSection ? C.gold : isChunk ? C.emerald : C.crimson;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);

    if (isSpeedSection) {
      // Left: Blazing 4x Sped-Up Arm + Hyper Wall Clock & Bouncing Ball!
      const fastT = frame * 0.24;
      drawRobotArm(
        ctx,
        { x: 250, y: 585 },
        { x: 540 + Math.sin(fastT) * 120, y: 410 + Math.cos(fastT * 1.4) * 75 },
        { l1: 215, l2: 195, flip: -1, thickness: 28, accent: C.crimson, grip: 0.5 + 0.4 * Math.sin(fastT) },
      );
      drawSpeedProofWidget(ctx, 725, 290, 4.0, frame, C.crimson);

      // Right: True 1x Slow Cautious Arm + Realistic Wall Clock & Gravity Ball!
      const slowT = frame * 0.06;
      drawRobotArm(
        ctx,
        { x: 1130, y: 585 },
        { x: 1420 + Math.sin(slowT) * 120, y: 410 + Math.cos(slowT * 1.4) * 75 },
        { l1: 215, l2: 195, flip: -1, thickness: 28, accent: C.emerald, grip: 0.5 + 0.4 * Math.sin(slowT) },
      );
      drawSpeedProofWidget(ctx, 1605, 290, 1.0, frame, C.emerald);
    } else {
      // Live Kinematic Fingerprint Oscilloscope: Human 10Hz Tremor vs AI Action Chunks!
      const t = frame - cJitter.from;

      // Left Arm: Human Teleop (with visible 10Hz micro-tremor & hesitation)
      const jitterX = Math.sin(t * 1.8) * 5.5 + Math.cos(t * 2.5) * 4.0;
      const jitterY = Math.cos(t * 2.1) * 5.0;
      drawRobotArm(
        ctx,
        { x: 230, y: 465 },
        { x: 540 + Math.sin(t * 0.06) * 90 + jitterX, y: 350 + Math.cos(t * 0.07) * 55 + jitterY },
        { l1: 180, l2: 165, flip: -1, thickness: 24, accent: C.crimson, grip: 0.35, xray: true },
      );

      // Right Arm: True AI Policy (smooth spline + crisp 0.5s action chunk stepping)
      const chunkT = Math.floor(t / 15) * 15 + Math.min(11, t % 15) * (15 / 11);
      drawRobotArm(
        ctx,
        { x: 1130, y: 465 },
        { x: 1440 + Math.sin(chunkT * 0.06) * 90, y: 350 + Math.cos(chunkT * 0.07) * 55 },
        { l1: 180, l2: 165, flip: -1, thickness: 24, accent: C.emerald, grip: 0.35, xray: true },
      );

      // Draw Live Scrolling Oscilloscope Waveforms (Bottom Left = Human Tremor, Bottom Right = AI Action Chunks)
      const drawScope = (ox: number, oy: number, w: number, h: number, col: string, isAi: boolean) => {
        ctx.save();
        ctx.fillStyle = "rgba(3, 6, 15, 0.88)";
        ctx.strokeStyle = hexRgba(col, 0.45);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(ox, oy, w, h, 14);
        ctx.fill();
        ctx.stroke();

        // Grid
        ctx.strokeStyle = "rgba(148,163,184,0.12)";
        ctx.lineWidth = 1;
        for (let g = 1; g < 4; g++) {
          ctx.beginPath();
          ctx.moveTo(ox + 16, oy + (h * g) / 4);
          ctx.lineTo(ox + w - 16, oy + (h * g) / 4);
          ctx.stroke();
        }

        // Waveform curve
        ctx.strokeStyle = col;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        for (let i = 0; i <= 140; i++) {
          const px = ox + 20 + (i / 140) * (w - 40);
          const s = i + t * 1.4;
          let val: number;
          if (!isAi) {
            // Human: organic wave + 8-12Hz micro-tremor noise + hesitation dip
            val = Math.sin(s * 0.09) * 34 + Math.sin(s * 0.85) * 14 + Math.cos(s * 1.35) * 9;
          } else {
            // AI: razor smooth spline + sharp periodic Action Chunk replan notches every 24 samples
            const notch = i % 24 < 3 ? 0 : 1;
            val = Math.sin(s * 0.09) * 38 * (0.85 + 0.15 * notch);
          }
          const py = oy + h * 0.52 - val;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Chunk marker ticks on AI side
        if (isAi) {
          for (let i = 24; i < 140; i += 24) {
            const px = ox + 20 + (i / 140) * (w - 40);
            ctx.strokeStyle = hexRgba(C.cyan, 0.55);
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(px, oy + 28);
            ctx.lineTo(px, oy + h - 20);
            ctx.stroke();
          }
          ctx.setLineDash([]);
        }
        ctx.restore();
      };

      drawScope(140, 585, 740, 230, C.crimson, false);
      drawScope(1040, 585, 740, 230, C.emerald, true);
    }
  }, [frame, isSpeedSection, cJitter.from]);

  return (
    <ForensicStage
      accent={accent}
      tag={scene.badge}
      telemetry={isSpeedSection ? "CLUE 01 // 4x SPEEDUP & CHERRY-PICKING" : "CLUE 02 // 8-12Hz TREMOR VS ACTION CHUNKING"}
    >
      {isSpeedSection ? (
        <>
          <GlassViewport x={100} y={108} w={830} h={isCherry ? 570 : 770} accent={C.crimson} label="你刷到的爆款剪辑（4× 加速）" badge="SPEED: 4.0× FAKE SMOOTH">
            <div style={{ position: "absolute", bottom: 26, left: 30, fontSize: 19, color: "#fda4af" }}>
              ⚠ 破绽：看右上角时钟秒针和弹跳小球——重力明显违背常识！
            </div>
          </GlassViewport>
          <GlassViewport x={990} y={108} w={830} h={isCherry ? 570 : 770} accent={C.emerald} label="还原 1× 真实原速" badge="REAL TIME: 1.0×">
            <div style={{ position: "absolute", bottom: 26, left: 30, fontSize: 19, color: "#a7f3d0" }}>
              真实状态：谨慎慢速试探，动作衔接往往停顿 1–2 秒
            </div>
          </GlassViewport>

          {/* 50-Take Cherry Picking Filmstrip */}
          {isCherry && (
            <GlassViewport x={100} y={705} w={1720} h={175} accent={C.gold} label="剪辑魔术：拍 50 条翻车 49 条，只放出唯一成功的 Take #47" badge="SURVIVORSHIP BIAS">
              <div style={{ padding: "22px 28px", display: "flex", gap: 8, alignItems: "center" }}>
                {Array.from({ length: 30 }).map((_, idx) => {
                  const win = idx === 26;
                  return (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: 62,
                        borderRadius: 6,
                        background: win ? C.emerald : hexRgba(C.crimson, 0.25),
                        border: `1.5px solid ${win ? "#ffffff" : hexRgba(C.crimson, 0.6)}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "monospace",
                        fontSize: 12,
                        fontWeight: 900,
                        color: win ? "#020617" : "#fda4af",
                        boxShadow: win ? `0 0 24px ${C.emerald}` : "none",
                      }}
                    >
                      {win ? "#47✓" : "✗"}
                    </div>
                  );
                })}
              </div>
            </GlassViewport>
          )}
        </>
      ) : (
        <>
          <GlassViewport x={100} y={108} w={820} h={760} accent={C.crimson} label="人类遥控运动学指纹" badge="8-12Hz TREMOR · 200ms LAG">
            <div style={{ position: "absolute", bottom: 20, left: 40, fontFamily: "monospace", fontSize: 16, color: "#fda4af" }}>
              高频生理微颤 + 视觉观察犹豫 + 不对称晃动
            </div>
          </GlassViewport>
          <GlassViewport x={1000} y={108} w={820} h={760} accent={C.emerald} label="真自主 AI 策略指纹" badge="SMOOTH SPLINE · ACTION CHUNK">
            <div style={{ position: "absolute", bottom: 20, left: 40, fontFamily: "monospace", fontSize: 16, color: "#a7f3d0" }}>
              数学优化冷峻平滑曲线 + 每 0.5s 固定节拍重规划
            </div>
          </GlassViewport>
        </>
      )}

      <canvas ref={canvasRef} width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
    </ForensicStage>
  );
};

/* ============================================================================
 * ACT 4: FORENSIC LAB PART 2 —
 *   Clue 3: LIVE ADVERSARIAL CUP-YANK TEST (Open-Loop Blind vs Closed-Loop Vision!)
 *   Clue 4: Sterile White Studio Overfit vs Messy Real Kitchen Generalization
 * ============================================================================ */
export const Forensic34Act: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cClosed = getCue(scene.cues, "yankClosedLoop");
  const cChaos = getCue(scene.cues, "chaosBench");

  const isChaos = frame >= cChaos.from;
  const isClosedFocus = frame >= cClosed.from && frame < cChaos.from;
  const accent = isChaos ? C.cyan : isClosedFocus ? C.emerald : C.crimson;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);

    if (!isChaos) {
      // 140-frame repeating physical cup-yank cycle so viewer sees both outcomes crystal clearly!
      const cyc = frame % 140;
      const yanked = cyc >= 48;
      const mugShift = yanked ? interpolate(cyc, [48, 66], [0, 195], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

      // Table baselines
      ctx.strokeStyle = "rgba(148,163,184,0.35)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(140, 740); ctx.lineTo(880, 740);
      ctx.moveTo(1040, 740); ctx.lineTo(1780, 740);
      ctx.stroke();

      // ---- LEFT: OPEN-LOOP BLIND SCRIPT (Grabs EMPTY AIR!) ----
      const leftMugX = 480 + mugShift;
      drawCoffeeMug(ctx, leftMugX, 710, C.gold, false, frame);
      if (yanked && cyc < 84) {
        // Red intruder yank arrow
        ctx.save();
        ctx.strokeStyle = C.crimson;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(490, 645);
        ctx.lineTo(leftMugX, 645);
        ctx.stroke();
        ctx.font = "800 18px sans-serif";
        ctx.fillStyle = C.crimson;
        ctx.fillText("现场捣乱：拖走 20cm →", 495, 632);
        ctx.restore();
      }
      // Blind arm ignores mugShift completely and grabs empty air at x=480!
      const blindProg = interpolate(cyc, [0, 95], [0, 1], { extrapolateRight: "clamp" });
      const blindX = interpolate(blindProg, [0, 0.7, 1], [300, 440, 455]);
      const blindY = interpolate(blindProg, [0, 0.7, 1], [470, 695, 620]);
      drawRobotArm(ctx, { x: 205, y: 740 }, { x: blindX, y: blindY }, {
        l1: 235,
        l2: 215,
        flip: -1,
        thickness: 28,
        accent: C.crimson,
        grip: cyc >= 72 ? 0.95 : 0.15,
      });
      if (cyc >= 76) {
        ctx.font = "900 28px sans-serif";
        ctx.fillStyle = C.crimson;
        ctx.textAlign = "center";
        ctx.fillText("✗ 抓了个寂寞（开环死脚本）", 515, 310);
      }

      // ---- RIGHT: CLOSED-LOOP VISION AI (Aborts mid-air, replans, catches mug!) ----
      const rightMugX = 1380 + mugShift;
      drawCoffeeMug(ctx, rightMugX, 710, C.gold, true, frame);
      if (yanked && cyc < 84) {
        ctx.save();
        ctx.strokeStyle = C.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(1390, 645);
        ctx.lineTo(rightMugX, 645);
        ctx.stroke();
        ctx.font = "800 18px sans-serif";
        ctx.fillStyle = C.gold;
        ctx.fillText("视觉重锁定 Δx=+20cm →", 1395, 632);
        ctx.restore();
      }
      const aiX =
        cyc < 52
          ? interpolate(cyc, [0, 52], [1200, 1335])
          : interpolate(cyc, [52, 108], [1335, rightMugX - 38], { extrapolateRight: "clamp" });
      const aiY =
        cyc < 52
          ? interpolate(cyc, [0, 52], [470, 630])
          : interpolate(cyc, [52, 80, 108], [630, 585, 705], { extrapolateRight: "clamp" });

      // Live dashed replanned trajectory arc
      if (yanked) {
        ctx.save();
        ctx.strokeStyle = C.emerald;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(1335, 630);
        ctx.quadraticCurveTo(1440, 550, rightMugX - 38, 705);
        ctx.stroke();
        ctx.restore();
      }

      drawRobotArm(ctx, { x: 1105, y: 740 }, { x: aiX, y: aiY }, {
        l1: 280,
        l2: 265,
        flip: -1,
        thickness: 28,
        accent: C.emerald,
        grip: cyc >= 104 ? 0.92 : 0.15,
        wristCam: true,
      });
      if (cyc >= 104) {
        ctx.font = "900 28px sans-serif";
        ctx.fillStyle = C.emerald;
        ctx.textAlign = "center";
        ctx.fillText("✓ 半空改道精准抓回（真视觉闭环）", 1405, 310);
      }
    }
  }, [frame, isChaos]);

  return (
    <ForensicStage
      accent={accent}
      tag={scene.badge}
      telemetry={isChaos ? "CLUE 04 // GENERALIZATION STRESS TEST" : "CLUE 03 // ADVERSARIAL DISTURBANCE TEST"}
    >
      {!isChaos ? (
        <>
          <GlassViewport x={100} y={108} w={830} h={770} accent={C.crimson} label="开环预设脚本：盲目抓空气" badge="OPEN-LOOP FAIL ✗" glow={isClosedFocus ? 0.25 : 0.85} />
          <GlassViewport x={990} y={108} w={830} h={770} accent={C.emerald} label="真视觉闭环 AI：半空刹停重规划" badge="CLOSED-LOOP PASS ✓" glow={isClosedFocus ? 0.95 : 0.35} />
        </>
      ) : (
        <>
          <GlassViewport x={100} y={135} w={820} h={725} accent={C.crimson} label="棚拍温室：纯白桌面 + 固定红杯" badge="MEMORIZED OVERFIT" glow={0.55}>
            <div style={{ padding: "36px 40px", display: "flex", flexDirection: "column", gap: 22, fontSize: 22, color: "#e2e8f0" }}>
              <div style={{ padding: "26px", borderRadius: 16, background: "rgba(255,255,255,0.08)", border: "1px dashed rgba(255,255,255,0.3)", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>恒定灯光 · 固定坐标 · 零杂物</div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.crimson, marginTop: 10 }}>
                  换个颜色或挪歪 5cm 立刻失明死机
                </div>
              </div>
              <div style={{ lineHeight: 1.7, color: C.muted }}>
                这种视频里即便真的是 AI 跑通，往往也只是在特定背景下的「死记硬背」，离真实家庭与工厂差着十万八千里。
              </div>
            </div>
          </GlassViewport>

          <GlassViewport x={1000} y={135} w={820} h={725} accent={C.emerald} label="真实考场：杂乱厨房 + 透明杯 + 陌生光影" badge="TRUE GENERALIZATION" glow={0.9}>
            <div style={{ padding: "36px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { title: "透明玻璃杯 / 反光金属", sub: "深度相机极易产生噪点空洞，考验真正的多模态空间理解", col: C.cyan },
                { title: "杂物堆叠 + 陌生形状", sub: "从未在训练集里见过的杯子、皱巴巴的抹布与随机遮挡", col: C.emerald },
                { title: "一镜到底长程连续任务", sub: "连续 5 分钟不剪辑完成收碗、擦桌、倒垃圾，失败后还能自主纠错", col: C.gold },
              ].map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "22px 26px",
                    borderRadius: 14,
                    background: "rgba(6, 18, 34, 0.85)",
                    border: `1.5px solid ${hexRgba(row.col, 0.45)}`,
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 900, color: row.col }}>{row.title}</div>
                  <div style={{ fontSize: 17, color: "#cbd5e1", marginTop: 8 }}>{row.sub}</div>
                </div>
              ))}
            </div>
          </GlassViewport>
        </>
      )}

      <canvas ref={canvasRef} width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
    </ForensicStage>
  );
};
