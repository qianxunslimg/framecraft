import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { K8sHelmBot, NiumaMascot, PodCapsule } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import {
  C,
  CandyPill,
  K8sStage,
  SceneTiming,
  SceneTopBar,
  getCueStart,
  usePulse,
} from "../stage";

/** Act 5: ConfigMap & Secret (Plug-in USB/Safe) + PV / PVC (Persistent Data Warehouse) */
export const ConfigStorageScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const secretNoteStart = getCueStart(scene.cues, "secretNote", 240);
  const pvStart = getCueStart(scene.cues, "pvPvc", 420);
  const pvSwapStart = getCueStart(scene.cues, "pvSwap", 680);
  const showPv = frame >= pvStart;
  const showSecretNote = frame >= secretNoteStart && !showPv;
  const podSwapped = frame >= pvSwapStart + 18;

  const plugIn = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { damping: 11, stiffness: 170 },
  });

  return (
    <K8sStage theme="peach">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[90, pvStart, pvStart + 165]}
        accent={C.butter}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.butter} />

      {!showPv ? (
        /* Cue 1: ConfigMap USB & Secret Safe plugging dynamically into Pod */
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: 1560,
            marginBottom: 42,
          }}
        >
          {/* Left: ConfigMap & Secret cards sliding right to plug in */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              transform: `translateX(${(1 - plugIn) * -90}px)`,
            }}
          >
            <div
              style={{
                width: 480,
                background: "#ffffff",
                border: `4.5px solid ${C.k8sBlue}`,
                borderRadius: 28,
                padding: "20px 26px",
                boxShadow: `0 12px 0 ${C.k8sBlue}`,
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <span style={{ fontSize: 50 }}>💾</span>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.k8sBlue, whiteSpace: "nowrap" }}>
                  ConfigMap（普通配置）
                </div>
                <div style={{ fontSize: 19, fontFamily: "monospace", color: C.sub }}>
                  DB_HOST=prod.db · LOG=info
                </div>
              </div>
            </div>

            <div
              style={{
                width: 480,
                background: "#ffffff",
                border: `4.5px solid ${C.coral}`,
                borderRadius: 28,
                padding: "20px 26px",
                boxShadow: `0 12px 0 ${C.coral}`,
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <span style={{ fontSize: 50 }}>🔐</span>
              <div>
                <div style={{ fontSize: 29, fontWeight: 700, color: C.coral }}>Secret（密码密钥）</div>
                <div style={{ fontSize: 19, fontFamily: "monospace", color: C.sub }}>
                  默认仅 Base64 编码！
                </div>
                {showSecretNote && (
                  <div
                    style={{
                      marginTop: 6,
                      background: C.coralSoft,
                      color: C.coral,
                      fontSize: 17,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 10,
                    }}
                  >
                    ⚠️ 生产需配 etcd 静态加密 + RBAC
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 52, fontWeight: 700, color: C.butter }}>
            ⚡➔
          </div>

          {/* Center: Pod receiving hot-mounted config */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <PodCapsule label="app-pod" ip="10.244.1.18" withSidecar scale={1.32} />
            <CandyPill text="🔌 像插 U 盘一样热挂载 · 不用重打镜像！" bg={C.mint} size={24} delay={110} />
          </div>

          <NiumaMascot size={255} mood="chill" />
        </div>
      ) : (
        /* Cue 2: PV Warehouse + PVC Claim + Pod Swapping While Data Stays Intact! */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            marginBottom: 42,
            width: 1520,
          }}
        >
          {/* Top Row: Old Pod Dies -> New Pod Takes Over Seamlessly */}
          <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <PodCapsule
              label="db-pod 旧"
              status={podSwapped ? "dead" : "running"}
              scale={1.12}
            />
            <span style={{ fontSize: 46, fontWeight: 700, color: C.butter }}>
              {podSwapped ? "🔄 换班接管!" : "➔"}
            </span>
            <PodCapsule
              label="db-pod 新"
              version="v2"
              status={podSwapped ? "running" : "starting"}
              stamp={podSwapped ? "无缝挂载!" : undefined}
              scale={1.12}
            />
          </div>

          {/* Middle Bridge: PVC Claim Ticket */}
          <div
            style={{
              background: C.butter,
              color: C.ink,
              border: `4.5px solid ${C.ink}`,
              borderRadius: 24,
              padding: "12px 38px",
              fontSize: 28,
              fontWeight: 700,
              boxShadow: `0 8px 0 ${C.ink}`,
            }}
          >
            🎫 PVC（存储申请单）：我要 50Gi 持久化磁盘 ↕
          </div>

          {/* Bottom Tier: Independent Persistent Storage Vault (PV) */}
          <div
            style={{
              width: 1060,
              background: "#1e243b",
              color: "#ffffff",
              border: `5px solid ${C.mint}`,
              borderRadius: 34,
              padding: "24px 40px",
              boxShadow: `0 14px 0 ${C.ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontSize: 56 }}>🗄️</span>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.mint, whiteSpace: "nowrap" }}>
                  PV（独立持久化硬盘仓库）
                </div>
                <div style={{ fontSize: 22, color: "#cbd5e1" }}>
                  Pod 换了好几茬 · 订单与数据库文件 100% 毫发无损！
                </div>
              </div>
            </div>
            <CandyPill text="💾 50Gi 完好 ✓" bg={C.mint} size={24} />
          </div>
        </div>
      )}

      <SceneWipeIn color={C.butter} />
    </K8sStage>
  );
};

/** Act 6 (SHOWSTOPPER): Control Plane 5-Baton Relay Race on `kubectl apply`! */
export const BrainRelayScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat } = usePulse();

  const applyStart = getCueStart(scene.cues, "apply", 170);
  const apiStart = getCueStart(scene.cues, "apiEtcd", 300);
  const ctrlStart = getCueStart(scene.cues, "controller", 500);
  const schedStart = getCueStart(scene.cues, "scheduler", 760);
  const kubStart = getCueStart(scene.cues, "kubelet", 930);

  const etcdStart = apiStart + Math.round((ctrlStart - apiStart) * 0.5);

  const activeStep =
    frame >= kubStart
      ? 5
      : frame >= schedStart
        ? 4
        : frame >= ctrlStart
          ? 3
          : frame >= etcdStart
            ? 2
            : frame >= apiStart
              ? 1
              : 0;

  // Order puts etcd solely adjacent to API Server (ONLY API Server accesses etcd),
  // while Controller Manager and Scheduler Watch API Server on the right!
  const stations = [
    { id: 2, name: "② etcd", role: "键值账本 · 仅 API 读写", icon: "📒", color: C.butter },
    { id: 1, name: "① API Server", role: "唯一中心枢纽 · 鉴权校验", icon: "🚪", color: C.cyan },
    { id: 3, name: "③ Controller", role: "Watch API · 调谐循环", icon: "🔁", color: C.pink },
    { id: 4, name: "④ Scheduler", role: "Watch API · 算力绑定", icon: "🧭", color: C.lavender },
  ];

  return (
    <K8sStage theme="arcade">
      <CanvasFXLayer
        mode="arcadeGrid"
        burstFrames={[applyStart, apiStart, etcdStart, ctrlStart, schedStart, kubStart]}
        accent={C.cyan}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.cyan} dark />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          marginBottom: 42,
          width: 1680,
        }}
      >
        {/* Top Command Terminal + Niuma */}
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <NiumaMascot size={145} mood={activeStep >= 5 ? "chill" : "wow"} />
          <div
            style={{
              background: "#0f172a",
              border: `4px solid ${frame >= applyStart ? C.mint : C.k8sBlue}`,
              borderRadius: 24,
              padding: "16px 34px",
              fontFamily: "monospace",
              fontSize: 30,
              fontWeight: 700,
              color: "#6ee7b7",
              boxShadow: `0 0 32px ${C.cyan}33`,
            }}
          >
            $ kubectl apply -f app.yaml{" "}
            <span style={{ color: "#fbbf24" }}># replicas: 3</span>
          </div>
          <K8sHelmBot size={145} spin scanBeam={activeStep >= 1} />
        </div>

        {/* TRUE Kubernetes Hub-and-Spoke Control Plane: API Server is the ONLY center hub & ONLY etcd accessor! */}
        <div
          style={{
            width: 1620,
            background: "rgba(30, 36, 59, 0.88)",
            border: `4px solid ${C.k8sBlue}`,
            borderRadius: 34,
            padding: "18px 28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            boxShadow: `0 0 40px ${C.k8sBlue}33`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 25, fontWeight: 700, color: "#93c5fd" }}>
              🧠 Control Plane（星型架构：所有组件均通过 Watch 与 API Server 通信）
            </span>
            {activeStep >= 3 && (
              <span
                style={{
                  background: C.pink,
                  color: "#ffffff",
                  padding: "4px 18px",
                  borderRadius: 99,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                🔁 仅 API Server 直接读写 etcd · Watch 驱动调谐循环
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            {stations.map((st, idx) => {
              const lit = activeStep >= st.id;
              const isCurrent = activeStep === st.id;
              return (
                <React.Fragment key={st.id}>
                  <div
                    style={{
                      flex: st.id === 1 ? 1.18 : 1,
                      background: lit ? "#111827" : "rgba(15,23,42,0.5)",
                      border: `4px solid ${lit ? st.color : "#334155"}`,
                      borderRadius: 24,
                      padding: "16px 16px",
                      boxShadow: isCurrent ? `0 0 36px ${st.color}88` : "none",
                      transform: `scale(${isCurrent ? 1.05 + beat * 0.03 : 1})`,
                      opacity: lit ? 1 : 0.42,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 7,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 38,
                        transform: st.id === 3 && lit ? `rotate(${frame * 4}deg)` : "none",
                      }}
                    >
                      {st.icon}
                    </div>
                    <div style={{ fontSize: 25, fontWeight: 700, color: lit ? st.color : "#94a3b8" }}>
                      {st.name}
                    </div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: "#e2e8f0" }}>
                      {st.role}
                    </div>
                  </div>
                  {idx < stations.length - 1 && (
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: activeStep > st.id ? C.mint : "#475569",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {idx === 0 ? "⇄" : "⇠Watch⇢"}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Bottom Worker Node Execution (Station 5: kubelet + kube-proxy -> 3 Live Pods!) */}
        <div
          style={{
            width: 1620,
            background: activeStep >= 5 ? "rgba(16, 185, 129, 0.14)" : "rgba(30, 36, 59, 0.65)",
            border: `4px solid ${activeStep >= 5 ? C.mint : "#334155"}`,
            borderRadius: 34,
            padding: "20px 34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: activeStep >= 5 ? `0 0 42px ${C.mint}44` : "none",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: activeStep >= 5 ? C.mint : "#94a3b8" }}>
              ⑤ Worker Nodes（现场执行层）
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <CandyPill
                text="👷 kubelet：拉起容器"
                bg={activeStep >= 5 ? C.mint : "#475569"}
                size={23}
              />
              <CandyPill
                text="🌐 kube-proxy：打通网络"
                bg={activeStep >= 5 ? C.cyan : "#475569"}
                color={activeStep >= 5 ? C.ink : "#cbd5e1"}
                size={23}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {[1, 2, 3].map((n) => {
              const p = spring({
                frame: Math.max(0, frame - kubStart - n * 12),
                fps,
                config: { damping: 10, stiffness: 210 },
              });
              return (
                <div key={n} style={{ opacity: activeStep >= 5 ? p : 0.18 }}>
                  <PodCapsule label={`app-${n}`} ip={`10.244.${n}.6`} scale={activeStep >= 5 ? p : 0.85} />
                </div>
              );
            })}
          </div>

          {activeStep >= 5 && (
            <CandyPill text="✅ 状态回传 · 闭环!" bg={C.butter} color={C.ink} size={24} delay={kubStart + 50} />
          )}
        </div>
      </div>

      <SceneWipeIn color={C.cyan} />
    </K8sStage>
  );
};

/** Act 7: 14-Component Master Blueprint Card + Golden Philosophy Quote + Niuma Off-Work Celebration! */
export const FinalePanoramaScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat } = usePulse();

  const quoteStart = getCueStart(scene.cues, "quote", 360);
  const signoffStart = getCueStart(scene.cues, "signoff", 580);
  const phase = frame >= signoffStart ? 2 : frame >= quoteStart ? 1 : 0;

  return (
    <K8sStage theme="cream">
      <CanvasFXLayer
        mode={phase >= 2 ? "confetti" : "sunburst"}
        burstFrames={[8, quoteStart, signoffStart]}
        accent={C.k8sBlue}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.k8sBlue} />

      {/* Phase 0: Bookmark-worthy 14-Component K8s Panorama Map */}
      {phase === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            marginBottom: 44,
            width: 1620,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 700, color: C.ink }}>
            🗺️ 一图收藏 · K8s 14 大核心组件全景图
          </div>

          {/* Layer 1: Control Plane */}
          <div
            style={{
              width: 1540,
              background: C.k8sLight,
              border: `4.5px solid ${C.k8sBlue}`,
              borderRadius: 28,
              padding: "18px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 700, color: C.k8sBlue }}>🧠 大脑层（Control Plane）</span>
            <div style={{ display: "flex", gap: 16 }}>
              {["🚪 API Server", "📒 etcd", "🔁 Controller Manager", "🧭 Scheduler"].map((t, i) => (
                <CandyPill key={t} text={t} bg={C.k8sBlue} size={23} delay={6 + i * 8} />
              ))}
            </div>
          </div>

          {/* Layer 2: Worker Nodes & Isolation */}
          <div
            style={{
              width: 1540,
              background: C.cyanSoft,
              border: `4.5px solid ${C.cyan}`,
              borderRadius: 28,
              padding: "18px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 700, color: "#0369a1" }}>🏗️ 节点与隔离层（Worker Node）</span>
            <div style={{ display: "flex", gap: 16 }}>
              {["🖥️ Node", "💊 Pod", "🪟 Namespace", "👷 kubelet", "🌐 kube-proxy"].map((t, i) => (
                <CandyPill key={t} text={t} bg={C.cyan} color={C.ink} size={23} delay={36 + i * 8} />
              ))}
            </div>
          </div>

          {/* Layer 3: Four Pillars */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, width: 1540 }}>
            {[
              { title: "⚙️ 生死与扩缩", items: "Deployment · 自愈 · 滚动更新 · HPA", color: C.mint, bg: C.mintSoft },
              { title: "🚦 内外流量入口", items: "Service（门牌）· Ingress（大门）", color: C.lavender, bg: C.lavenderSoft },
              { title: "💾 配置与持久存储", items: "ConfigMap · Secret · PV / PVC", color: C.butter, bg: C.butterSoft },
            ].map((card, i) => {
              const p = spring({ frame: Math.max(0, frame - 75 - i * 12), fps, config: { damping: 11 } });
              return (
                <div
                  key={card.title}
                  style={{
                    background: card.bg,
                    border: `4.5px solid ${card.color}`,
                    borderRadius: 28,
                    padding: "22px 26px",
                    boxShadow: `0 10px 0 ${card.color}44`,
                    transform: `scale(${p})`,
                    opacity: p,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>{card.title}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.sub }}>{card.items}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 1: Golden Philosophy Quote */}
      {phase === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            marginBottom: 46,
            width: 1560,
          }}
        >
          <K8sHelmBot size={185} spin />
          <div
            style={{
              background: "#ffffff",
              border: `6px solid ${C.ink}`,
              borderRadius: 42,
              padding: "42px 64px",
              boxShadow: `0 18px 0 ${C.k8sBlue}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 700, color: C.sub }}>
              💡 学 K8s 别死背命令，记住这一句就通了：
            </div>
            <ExtrudedTitle
              text="你只管声明你想要的世界"
              size={66}
              color={C.k8sBlue}
              shadowColor={C.k8sLight}
              startFrame={quoteStart + 8}
              stagger={2}
            />
            <ExtrudedTitle
              text="K8s 永远帮你把现实追平到理想"
              size={66}
              color={C.mint}
              shadowColor={C.mintSoft}
              startFrame={quoteStart + 42}
              stagger={2}
            />
          </div>
        </div>
      )}

      {/* Phase 2: Niuma Off-Work Celebration! */}
      {phase === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            marginBottom: 42,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 68 }}>
            <NiumaMascot
              size={310}
              mood="chill"
              prop="bag"
              jump={Math.abs(Math.sin(frame * 0.25)) * 34 + beat * 16}
            />
            <K8sHelmBot size={285} spin jump={beat * 20} />
          </div>

          <ExtrudedTitle
            text="脏活交给 K8s，小牛马准点下班！"
            size={66}
            color={C.ink}
            shadowColor={C.butter}
            startFrame={signoffStart}
            stagger={2}
          />

          <div style={{ display: "flex", gap: 24 }}>
            <CandyPill text="🕒 18:00 准点打卡 ✓" bg={C.mint} size={32} delay={signoffStart + 18} />
            <CandyPill text="⭐ 点赞收藏 · 随时复习" bg={C.pink} size={32} delay={signoffStart + 34} />
          </div>
        </div>
      )}

      <SceneWipeIn color={C.k8sBlue} />
    </K8sStage>
  );
};
