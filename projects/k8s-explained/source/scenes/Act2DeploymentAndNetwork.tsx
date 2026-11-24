import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { K8sHelmBot, NiumaMascot, PodCapsule } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import {
  C,
  CandyPill,
  K8sStage,
  SceneTiming,
  SceneTopBar,
  SpeechBubble,
  getCueStart,
} from "../stage";

/** Act 3: Deployment (Declarative YAML + Self-Healing + Rolling Update) + HPA Auto-Scaling */
export const DeploymentHpaScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const healCue1 = scene.cues.find((c) => c.cue === "selfHeal");
  const healCue2 = scene.cues.find((c) => c.cue === "selfHeal2");
  const rollCue = scene.cues.find((c) => c.cue === "rolling");
  const hpaCue = scene.cues.find((c) => c.cue === "hpa");

  const healStart = healCue1 ? healCue1.from : 180;
  const healActionStart = healCue2 ? healCue2.from : healStart + 180;
  const rollStart = rollCue ? rollCue.from : 490;
  const hpaStart = hpaCue ? hpaCue.from : 720;

  const healActionDur = healCue2 ? healCue2.duration : 240;
  const rollDur = rollCue ? rollCue.duration : 300;
  const hpaDur = hpaCue ? hpaCue.duration : 380;

  const stageIdx =
    frame >= hpaStart ? 3 : frame >= rollStart ? 2 : frame >= healStart ? 1 : 0;

  // Self-healing proportional timeline synced to selfHeal2
  const healLocal = frame - healActionStart;
  const podKilled = healLocal >= Math.round(healActionDur * 0.14);
  const podHealed = healLocal >= Math.round(healActionDur * 0.52);

  // Rolling update proportional timeline inside stage 2
  const rollLocal = frame - rollStart;
  const v2Count =
    rollLocal >= Math.round(rollDur * 0.65)
      ? 3
      : rollLocal >= Math.round(rollDur * 0.42)
        ? 2
        : rollLocal >= Math.round(rollDur * 0.18)
          ? 1
          : 0;

  // HPA proportional timeline inside stage 3
  const hpaLocal = frame - hpaStart;
  const spikeAt = Math.round(hpaDur * 0.25);
  const calmAt = Math.round(hpaDur * 0.72);
  const isSpike = hpaLocal >= spikeAt && hpaLocal < calmAt;
  const isNightCalm = hpaLocal >= calmAt;
  const cpuPct = isSpike
    ? Math.round(interpolate(hpaLocal, [spikeAt, spikeAt + 35], [28, 92], { extrapolateRight: "clamp" }))
    : isNightCalm
      ? Math.round(interpolate(hpaLocal, [calmAt, calmAt + 35], [92, 18], { extrapolateRight: "clamp" }))
      : 28;
  const hpaPods = isSpike ? 8 : 2;

  return (
    <K8sStage theme="mint">
      <CanvasFXLayer
        mode="techNodes"
        burstFrames={[10, healStart + 155, rollStart + 150, hpaStart + 70]}
        accent={C.mint}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.mint} />

      {/* Stage 0: Declarative YAML vs Imperative Scripts */}
      {stageIdx === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: 1560,
            marginBottom: 42,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <NiumaMascot size={275} mood="chill" prop="yaml" />
            <CandyPill text="小牛马只写目标清单" bg={C.mint} size={26} />
          </div>

          {/* Sleek Dark YAML Card */}
          <div
            style={{
              width: 660,
              background: "#181d31",
              border: `5px solid ${C.ink}`,
              borderRadius: 32,
              overflow: "hidden",
              boxShadow: `0 16px 0 ${C.mint}`,
            }}
          >
            <div
              style={{
                background: "#262e49",
                padding: "14px 26px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#93c5fd", fontSize: 24, fontWeight: 700, fontFamily: "monospace" }}>
                📄 deployment.yaml · 声明式管理
              </span>
              <span style={{ color: C.mint, fontSize: 20, fontWeight: 700 }}>✓ 目标态</span>
            </div>
            <div
              style={{
                padding: "24px 32px",
                fontFamily: "monospace",
                fontSize: 26,
                lineHeight: 1.6,
                color: "#e2e8f0",
              }}
            >
              <div><span style={{ color: "#60a5fa" }}>kind:</span> Deployment</div>
              <div><span style={{ color: "#60a5fa" }}>spec:</span></div>
              <div style={{ paddingLeft: 28 }}>
                <span style={{ color: "#34d399" }}>replicas:</span>{" "}
                <span style={{ color: "#fbbf24", fontWeight: 700 }}>3</span>{" "}
                <span style={{ color: "#94a3b8" }}># 永远保持3个在线</span>
              </div>
              <div style={{ paddingLeft: 28 }}>
                <span style={{ color: "#34d399" }}>image:</span>{" "}
                <span style={{ color: "#f472b6" }}>shop-app:v1</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <K8sHelmBot size={260} spin />
            <CandyPill text="K8s 自动盯死目标！" bg={C.k8sBlue} size={26} delay={24} />
          </div>
        </div>
      )}

      {/* Stage 1: Self-Healing Live Animation */}
      {stageIdx === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            marginBottom: 42,
            width: 1580,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <CandyPill text="📄 期望状态：replicas = 3" bg={C.k8sBlue} size={30} />
            <CandyPill
              text={
                podHealed
                  ? "✅ 实际状态：3 / 3 自愈完成！"
                  : podKilled
                    ? "⚠️ 实际状态：2 / 3 检测到宕机！秒补中…"
                    : "✅ 实际状态：3 / 3 健康运行"
              }
              bg={podHealed ? C.mint : podKilled ? C.coral : C.mint}
              size={30}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 36, width: 1520 }}>
            {[
              { name: "Node-01", pods: [{ l: "app-1", dead: false }] },
              { name: "Node-02", pods: [{ l: "app-2", dead: podKilled }] },
              {
                name: "Node-03",
                pods: podHealed
                  ? [
                      { l: "app-3", dead: false },
                      { l: "app-4 (新!)", dead: false, fresh: true },
                    ]
                  : [{ l: "app-3", dead: false }],
              },
            ].map((node, i) => (
              <div
                key={node.name}
                style={{
                  flex: 1,
                  minHeight: 330,
                  background: "#ffffff",
                  border: `4.5px solid ${i === 1 && podKilled ? C.coral : C.ink}`,
                  borderRadius: 32,
                  padding: 24,
                  boxShadow: `0 12px 0 ${i === 1 && podKilled ? C.coral : C.mint}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>
                  🖥️ {node.name} {i === 1 && podKilled ? "🔥" : ""}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
                  {node.pods.map((p) => (
                    <PodCapsule
                      key={p.l}
                      label={p.l}
                      status={p.dead ? "dead" : "running"}
                      stamp={"fresh" in p && p.fresh ? "3秒复活!" : undefined}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: i === 1 && podKilled ? C.coral : C.sub,
                  }}
                >
                  {i === 1 && podKilled
                    ? "🔨 手滑误删 / 节点宕机"
                    : i === 2 && podHealed
                      ? "✨ K8s 自动拉起补齐！"
                      : "运行正常 ✓"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage 2: Rolling Update v1 -> v2 Zero Downtime */}
      {stageIdx === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            marginBottom: 42,
            width: 1580,
          }}
        >
          <ExtrudedTitle
            text="滚动更新：起新停旧 · 零中断升级"
            size={58}
            color={C.ink}
            shadowColor={C.butter}
            startFrame={rollStart}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 42,
              background: "rgba(255,255,255,0.92)",
              border: `5px solid ${C.ink}`,
              borderRadius: 40,
              padding: "40px 56px",
              boxShadow: `0 16px 0 ${C.mint}`,
            }}
          >
            {[1, 2, 3].map((idx) => {
              const upgraded = v2Count >= idx;
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <PodCapsule
                    label={upgraded ? `app-v2 #${idx}` : `app-v1 #${idx}`}
                    version={upgraded ? "v2" : "v1"}
                    ip={`10.244.${idx}.${upgraded ? 22 : 10}`}
                    scale={1.15}
                  />
                  <CandyPill
                    text={upgraded ? "✅ 就绪探针通过" : "运行中 v1"}
                    bg={upgraded ? C.butter : C.k8sBlue}
                    color={upgraded ? C.ink : "#ffffff"}
                    size={21}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            <CandyPill text="👥 用户全程零感知" bg={C.mint} size={28} delay={rollStart + 30} />
            <CandyPill text="↩️ 翻车一键秒回滚" bg={C.pink} size={28} delay={rollStart + 90} />
          </div>
        </div>
      )}

      {/* Stage 3: HPA Auto-Scaling (Traffic Spike -> Scale 2 to 8 Pods -> Shrink back at night!) */}
      {stageIdx === 3 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            marginBottom: 42,
            width: 1580,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <CandyPill text="⚡ HPA · 水平自动扩缩容" bg={C.k8sBlue} size={34} />
            <CandyPill
              text={
                isSpike
                  ? "🔥 大促流量暴涨 → 秒扩 8 个 Pod 顶住！"
                  : isNightCalm
                    ? "🌙 半夜低峰 → 自动缩回 2 个省钱 💰"
                    : "📊 实时监控 CPU / 负载中…"
              }
              bg={isSpike ? C.coral : isNightCalm ? C.mint : C.butter}
              color={!isSpike && !isNightCalm ? C.ink : "#ffffff"}
              size={28}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 38, width: 1520 }}>
            {/* Left: Live CPU Gauge Card */}
            <div
              style={{
                width: 390,
                background: "#181d31",
                border: `4.5px solid ${isSpike ? C.coral : C.mint}`,
                borderRadius: 32,
                padding: 28,
                color: "#ffffff",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 700 }}>📈 集群 CPU 负载</div>
              <div
                style={{
                  fontSize: 82,
                  fontWeight: 700,
                  color: cpuPct > 70 ? C.coral : C.mint,
                  lineHeight: 1,
                }}
              >
                {cpuPct}%
              </div>
              <div style={{ height: 26, borderRadius: 99, background: "#334155", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${cpuPct}%`,
                    height: "100%",
                    background: cpuPct > 70 ? C.coral : C.mint,
                  }}
                />
              </div>
              <div style={{ fontSize: 22, color: "#94a3b8", fontWeight: 700 }}>
                阈值目标：CPU 60% · 范围：2 ~ 10 Pod
              </div>
            </div>

            {/* Right: Elastic Pod Grid */}
            <div
              style={{
                flex: 1,
                minHeight: 370,
                background: "rgba(255,255,255,0.92)",
                border: `5px solid ${C.ink}`,
                borderRadius: 36,
                padding: "28px 34px",
                boxShadow: `0 14px 0 ${isSpike ? C.coral : C.mint}`,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              {Array.from({ length: hpaPods }).map((_, i) => {
                const p = spring({
                  frame: Math.max(0, hpaLocal - (i < 2 ? 0 : spikeAt + 4 + (i - 2) * 5)),
                  fps,
                  config: { damping: 10, stiffness: 220 },
                });
                return (
                  <PodCapsule
                    key={i}
                    label={`pod-${i + 1}`}
                    version={i >= 2 ? "v2" : "v1"}
                    scale={p * 0.94}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      <SceneWipeIn color={C.mint} />
    </K8sStage>
  );
};

/** Act 4: Traffic Routing — Shuffling IPs -> Fixed Service Load Balancer -> Ingress Gateway */
export const NetworkServiceIngressScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const svcStart = getCueStart(scene.cues, "service", 150);
  const ingStart = getCueStart(scene.cues, "ingress", 450);

  const stageIdx = frame >= ingStart ? 2 : frame >= svcStart ? 1 : 0;
  const ipTick = Math.floor(frame / 18) % 3;

  return (
    <K8sStage theme="lavender">
      <CanvasFXLayer
        mode="flowStreams"
        burstFrames={[8, svcStart, ingStart]}
        accent={C.lavender}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.lavender} />

      {/* Stage 0: Shuffling Pod IPs Problem */}
      {stageIdx === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: 1520,
            marginBottom: 42,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <SpeechBubble bg="#ffffff" borderColor={C.coral}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>IP 又变了？！到底该连哪个地址呀！</div>
            </SpeechBubble>
            <NiumaMascot size={285} mood="panic" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
            <CandyPill text="❓ Pod 挂了重建 → IP 天天变" bg={C.coral} size={32} />
            <div style={{ display: "flex", gap: 28 }}>
              {[
                { l: "pod-a", ips: ["10.0.1.4", "10.0.2.8", "10.0.4.12"] },
                { l: "pod-b", ips: ["10.0.1.9", "10.0.3.5", "10.0.2.19"] },
                { l: "pod-c", ips: ["10.0.2.3", "10.0.5.7", "10.0.1.25"] },
              ].map((p, idx) => (
                <PodCapsule
                  key={p.l}
                  label={p.l}
                  ip={p.ips[(ipTick + idx) % 3]}
                  status={ipTick === idx ? "starting" : "running"}
                  scale={1.1}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stage 1: Fixed Service Signboard + Label Selector + Load Balancing */}
      {stageIdx === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            marginBottom: 42,
            width: 1560,
          }}
        >
          {/* Fixed Service Signboard */}
          <div
            style={{
              background: C.lavender,
              color: "#ffffff",
              border: `5px solid ${C.ink}`,
              borderRadius: 32,
              padding: "20px 48px",
              boxShadow: `0 12px 0 ${C.ink}`,
              display: "flex",
              alignItems: "center",
              gap: 26,
              transform: `scale(${spring({ frame: Math.max(0, frame - svcStart), fps, config: { damping: 10 } })})`,
            }}
          >
            <span style={{ fontSize: 46 }}>🪧</span>
            <div>
              <div style={{ fontSize: 38, fontWeight: 700 }}>Service：shop-svc（固定门牌号）</div>
              <div style={{ fontSize: 23, opacity: 0.92, fontFamily: "monospace" }}>
                ClusterIP: 10.96.0.10 · Selector: app=shop · 自动负载均衡
              </div>
            </div>
          </div>

          {/* Animated SVG Flow Lines from Service -> 3 Pods */}
          <svg width="1100" height="110" viewBox="0 0 1100 110">
            {[200, 550, 900].map((tx, idx) => {
              const t = ((frame * 0.04 + idx * 0.33) % 1);
              const px = 550 + (tx - 550) * t;
              const py = 8 + 94 * t;
              return (
                <g key={tx}>
                  <path
                    d={`M550 8 Q${(550 + tx) / 2} 55 ${tx} 102`}
                    stroke={C.lavender}
                    strokeWidth="5"
                    strokeDasharray="10 8"
                    fill="none"
                  />
                  <circle cx={px} cy={py} r="10" fill={C.butter} stroke={C.ink} strokeWidth="3" />
                </g>
              );
            })}
          </svg>

          {/* 3 Healthy Pods with matching label */}
          <div style={{ display: "flex", gap: 64 }}>
            {[
              { l: "shop-1", ip: `10.0.1.${10 + ipTick}` },
              { l: "shop-2", ip: `10.0.2.${20 + ipTick}` },
              { l: "shop-3", ip: `10.0.3.${30 + ipTick}` },
            ].map((p) => (
              <div key={p.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <PodCapsule label={p.l} ip={p.ip} scale={1.1} />
                <span
                  style={{
                    background: C.butterSoft,
                    border: `2.5px solid ${C.butter}`,
                    borderRadius: 99,
                    padding: "4px 14px",
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: C.ink,
                  }}
                >
                  🏷️ app=shop
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage 2: Full External Traffic Path — Browser -> Ingress Gate -> 2 Services -> Pods */}
      {stageIdx === 2 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: 1580,
            marginBottom: 42,
          }}
        >
          {/* External User */}
          <div
            style={{
              width: 260,
              background: "#ffffff",
              border: `4.5px solid ${C.ink}`,
              borderRadius: 30,
              padding: "24px 20px",
              boxShadow: `0 10px 0 ${C.ink}`,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 54 }}>🌐</div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>外网用户</div>
            <div style={{ fontSize: 18, fontFamily: "monospace", color: C.k8sBlue, fontWeight: 700 }}>
              https://demo.com
            </div>
          </div>

          <div style={{ fontSize: 44, fontWeight: 700, color: C.lavender }}>➔</div>

          {/* Ingress Gateway */}
          <div
            style={{
              width: 340,
              background: `linear-gradient(135deg, ${C.k8sBlue}, ${C.lavender})`,
              color: "#ffffff",
              border: `5px solid ${C.ink}`,
              borderRadius: 34,
              padding: "28px 26px",
              boxShadow: `0 14px 0 ${C.ink}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ fontSize: 50 }}>🛡️</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>Ingress + 控制器</div>
            <div style={{ fontSize: 20, opacity: 0.92 }}>统一域名 · HTTPS 证书</div>
            <div style={{ display: "flex", gap: 10, fontFamily: "monospace", fontSize: 19, fontWeight: 700 }}>
              <span style={{ background: "rgba(255,255,255,0.22)", padding: "5px 12px", borderRadius: 10 }}>/api ↗</span>
              <span style={{ background: "rgba(255,255,255,0.22)", padding: "5px 12px", borderRadius: 10 }}>/shop ↘</span>
            </div>
          </div>

          {/* Two Clean Branch Lanes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 34, width: 780 }}>
            {[
              { path: "/api", svc: "api-svc", pods: ["api-1", "api-2"], color: C.cyan },
              { path: "/shop", svc: "shop-svc", pods: ["shop-1", "shop-2"], color: C.mint },
            ].map((lane, idx) => (
              <div
                key={lane.path}
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: `4px solid ${lane.color}`,
                  borderRadius: 28,
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 10px 24px rgba(30,34,48,0.08)",
                }}
              >
                <CandyPill
                  text={lane.path}
                  bg={lane.color}
                  color={lane.color === C.cyan ? C.ink : "#ffffff"}
                  size={24}
                  delay={ingStart + idx * 14}
                />
                <span style={{ fontSize: 30, color: lane.color, fontWeight: 700 }}>➔</span>
                <div
                  style={{
                    background: C.lavenderSoft,
                    border: `3px solid ${C.lavender}`,
                    borderRadius: 16,
                    padding: "10px 18px",
                    fontSize: 22,
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  🪧 {lane.svc}
                </div>
                <span style={{ fontSize: 30, color: lane.color, fontWeight: 700 }}>➔</span>
                <div style={{ display: "flex", gap: 12 }}>
                  {lane.pods.map((pl) => (
                    <PodCapsule key={pl} label={pl} scale={0.92} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SceneWipeIn color={C.lavender} />
    </K8sStage>
  );
};
