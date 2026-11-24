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
  usePulse,
} from "../stage";

/** Act 1: 03:00 AM Overworked Niuma vs K8s Helm Hero + Docker Container Chaos */
export const OpeningScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat } = usePulse();

  const chaosStart = getCueStart(scene.cues, "dockerChaos", 200);
  const k8sEnterFrame = Math.round(chaosStart * 0.56);
  const isChaos = frame >= chaosStart;
  const k8sArrived = frame >= k8sEnterFrame;

  const k8sPop = spring({
    frame: Math.max(0, frame - k8sEnterFrame),
    fps,
    config: { damping: 10, stiffness: 190 },
  });
  const alarmFlash = !k8sArrived && !isChaos && Math.floor(frame / 8) % 2 === 0;
  const shake = !k8sArrived && frame < 45 ? interpolate(frame, [0, 45], [10, 0]) : 0;

  return (
    <K8sStage theme="night" shake={shake}>
      <CanvasFXLayer
        mode="nightAlarm"
        burstFrames={[k8sEnterFrame, chaosStart, chaosStart + 90]}
        accent={C.cyan}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.k8sBlue} dark />

      {!isChaos ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            marginBottom: 42,
            width: 1600,
          }}
        >
          {/* Main Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                background: alarmFlash ? C.coral : k8sArrived ? C.k8sBlue : "#334155",
                color: "#ffffff",
                fontSize: 44,
                fontWeight: 700,
                fontFamily: "monospace",
                padding: "12px 32px",
                borderRadius: 24,
                border: "4px solid #ffffff",
                boxShadow: alarmFlash
                  ? `0 0 42px ${C.coral}`
                  : `0 0 32px ${C.k8sBlue}88`,
              }}
            >
              {k8sArrived ? "☸ K8s 值班中" : "⏰ 03:00 AM · 告警!"}
            </div>
            <ExtrudedTitle
              text="一集彻底搞懂 K8s！"
              size={72}
              color="#ffffff"
              shadowColor={C.k8sBlue}
              startFrame={4}
              stagger={2}
            />
          </div>

          {/* Center Theater: Smoking Server -> Niuma -> K8s Helm Hero */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: 1460,
              marginTop: 10,
            }}
          >
            {/* Left: Server Rack (Smoking red -> Healthy green once K8s arrives) */}
            <div
              style={{
                width: 390,
                background: "#1e293b",
                border: `4.5px solid ${k8sArrived ? C.mint : C.coral}`,
                borderRadius: 28,
                padding: 24,
                boxShadow: `0 0 40px ${k8sArrived ? C.mint : C.coral}44`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 21, fontWeight: 700, color: "#cbd5e1", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                  prod-server-01
                </span>
                <span
                  style={{
                    background: k8sArrived ? C.mint : C.coral,
                    color: "#fff",
                    padding: "4px 14px",
                    borderRadius: 99,
                    fontSize: 18,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {k8sArrived ? "200 OK ✓" : "502 崩了!"}
                </span>
              </div>
              {[0, 1, 2].map((r) => (
                <div
                  key={r}
                  style={{
                    height: 44,
                    background: "#0f172a",
                    borderRadius: 12,
                    border: "2px solid #334155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 16px",
                  }}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    {[0, 1, 2].map((led) => (
                      <div
                        key={led}
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 99,
                          background: k8sArrived
                            ? C.mint
                            : (frame + r + led) % 6 < 3
                              ? C.coral
                              : "#475569",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 18, fontFamily: "monospace", color: k8sArrived ? C.mint : C.coral }}>
                    {k8sArrived ? "AUTO-HEALED" : r === 1 ? "OOM KILLED" : "RETRY..."}
                  </span>
                </div>
              ))}
            </div>

            {/* Center: Niuma Mascot */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <SpeechBubble
                bg={k8sArrived ? C.mintSoft : C.coralSoft}
                borderColor={k8sArrived ? C.mint : C.coral}
              >
                <div style={{ fontSize: 30, fontWeight: 700 }}>
                  {k8sArrived ? "太香了，终于能睡整觉了 Zzz" : "呜呜又崩了！咖啡续命重启中…"}
                </div>
              </SpeechBubble>
              <NiumaMascot
                size={290}
                mood={k8sArrived ? "sleep" : "panic"}
                prop={k8sArrived ? "none" : "coffee"}
              />
              <CandyPill text="运维小牛马" bg={C.butter} color={C.ink} size={24} />
            </div>

            {/* Right: K8s Helm Hero swoops in */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                transform: `scale(${k8sPop}) translateX(${(1 - k8sPop) * 180}px)`,
                opacity: k8sPop,
              }}
            >
              <K8sHelmBot size={280} spin scanBeam={k8sArrived} />
              <CandyPill text="K8s 船舵管家" bg={C.k8sBlue} size={24} delay={k8sEnterFrame} />
            </div>
          </div>
        </div>
      ) : (
        /* Cue 2: Docker 1 Container -> Explodes into Chaos of Dozens of Containers! */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            marginBottom: 46,
            width: 1620,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <CandyPill
              text="🐳 单个 Docker 很爽"
              bg={C.cyan}
              color={C.ink}
              size={30}
              delay={chaosStart}
            />
            <span style={{ fontSize: 40, fontWeight: 700, color: C.butter }}>→</span>
            <CandyPill
              text="🔥 几千个容器直接炸锅！"
              bg={C.coral}
              size={34}
              delay={chaosStart + 45}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: 1520,
              height: 500,
              position: "relative",
            }}
          >
            {/* Left: Single tidy Docker box */}
            <div
              style={{
                width: 340,
                background: "rgba(30,41,59,0.92)",
                border: `4px solid ${C.cyan}`,
                borderRadius: 28,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div style={{ fontSize: 64 }}>🐳</div>
              <div
                style={{
                  background: C.cyan,
                  color: C.ink,
                  padding: "14px 28px",
                  borderRadius: 18,
                  border: `3.5px solid ${C.ink}`,
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                📦 1 个容器
              </div>
              <div style={{ fontSize: 22, color: "#94a3b8", fontWeight: 700 }}>
                打包带走 · 轻松丝滑
              </div>
            </div>

            {/* Center: Chaotic bouncing grid of 9 overloaded containers + 3 pain-point alarms */}
            <div
              style={{
                width: 760,
                height: 470,
                background: "rgba(244,63,94,0.1)",
                border: `4px dashed ${C.coral}`,
                borderRadius: 34,
                padding: 26,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                }}
              >
                {Array.from({ length: 8 }).map((_, idx) => {
                  const localF = Math.max(0, frame - chaosStart - 30 - idx * 5);
                  const pop = spring({ frame: localF, fps, config: { damping: 9, stiffness: 210 } });
                  const broken = idx === 2 || idx === 5;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: broken ? C.coral : idx % 2 === 0 ? C.k8sBlue : C.cyan,
                        color: "#ffffff",
                        border: "3px solid #ffffff",
                        borderRadius: 18,
                        padding: "16px 10px",
                        textAlign: "center",
                        fontSize: 21,
                        fontWeight: 700,
                        transform: `scale(${pop}) rotate(${Math.sin(frame * 0.25 + idx) * (broken ? 9 : 4)}deg)`,
                        opacity: pop,
                      }}
                    >
                      {broken ? "💥 宕机" : `📦 app-${idx + 1}`}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
                {[
                  { t: "💥 挂了谁拉起？", d: 65, bg: C.coral },
                  { t: "🔥 流量爆了怎么扩？", d: 95, bg: C.butter },
                  { t: "🚧 发版怎么不断线？", d: 125, bg: C.pink },
                ].map((q) => (
                  <CandyPill
                    key={q.t}
                    text={q.t}
                    bg={q.bg}
                    color={q.bg === C.butter ? C.ink : "#ffffff"}
                    size={22}
                    delay={chaosStart + q.d}
                  />
                ))}
              </div>
            </div>

            {/* Right: Panicking Niuma steaming */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <NiumaMascot
                size={275}
                mood="panic"
                prop="coffee"
                jump={beat * 18}
              />
              <CandyPill text="小牛马快冒烟啦！" bg={C.coral} size={23} delay={chaosStart + 140} />
            </div>
          </div>
        </div>
      )}
    </K8sStage>
  );
};

/** Act 2: Automated Factory — Node Platforms, Pod Capsule Anatomy, Namespace Cubicles, Ephemeral Stamp */
export const StageNodesPodsScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const podStart = getCueStart(scene.cues, "pod", 170);
  const nsStart = getCueStart(scene.cues, "namespace", 430);
  const ephStart = getCueStart(scene.cues, "ephemeral", 700);

  const showPodZoom = frame >= podStart && frame < nsStart;
  const showNamespace = frame >= nsStart && frame < ephStart;
  const showEphemeral = frame >= ephStart;

  const stampPop = spring({
    frame: Math.max(0, frame - ephStart - 16),
    fps,
    config: { damping: 8, stiffness: 260 },
  });
  const shake =
    frame >= ephStart + 16 && frame < ephStart + 30
      ? interpolate(frame, [ephStart + 16, ephStart + 30], [16, 0])
      : 0;

  return (
    <K8sStage theme="sky" shake={shake}>
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[8, podStart, nsStart, ephStart + 16]}
        accent={C.k8sBlue}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.k8sBlue} />

      {/* Cue 1: 3 Worker Node Platforms */}
      {!showPodZoom && !showNamespace && !showEphemeral && (
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
            <K8sHelmBot size={150} spin />
            <ExtrudedTitle
              text="Node = 干活的服务器节点"
              size={64}
              color={C.k8sBlue}
              shadowColor="#ffffff"
            />
          </div>

          <div style={{ display: "flex", gap: 36, justifyContent: "center", width: 1520 }}>
            {["Node-01（北京机房）", "Node-02（上海机房）", "Node-03（广州机房）"].map((name, i) => {
              const p = spring({
                frame: Math.max(0, frame - 18 - i * 14),
                fps,
                config: { damping: 11, stiffness: 190 },
              });
              return (
                <div
                  key={name}
                  style={{
                    flex: 1,
                    background: "#ffffff",
                    border: `4.5px solid ${C.ink}`,
                    borderRadius: 32,
                    padding: "24px 26px",
                    boxShadow: `0 12px 0 ${C.k8sBlue}`,
                    transform: `translateY(${(1 - p) * 70}px) scale(${p})`,
                    opacity: p,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>🖥️ {name}</span>
                    <span
                      style={{
                        background: C.mintSoft,
                        color: "#047857",
                        fontSize: 18,
                        fontWeight: 700,
                        padding: "4px 12px",
                        borderRadius: 99,
                      }}
                    >
                      Ready ✓
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 14, justifyContent: "center", padding: "12px 0" }}>
                    <PodCapsule label={`app-${i * 2 + 1}`} />
                    <PodCapsule label={`app-${i * 2 + 2}`} />
                  </div>
                  {/* Resource bars */}
                  <div style={{ display: "flex", gap: 12, fontSize: 18, fontWeight: 700, color: C.sub }}>
                    <span>CPU 38%</span>
                    <div style={{ flex: 1, height: 14, borderRadius: 99, background: "#e2e8f0", overflow: "hidden", alignSelf: "center" }}>
                      <div style={{ width: `${35 + i * 12}%`, height: "100%", background: C.k8sBlue }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cue 2: Enlarged Pod Capsule Anatomy (Main App + Sidecar sharing IP & Volume) */}
      {showPodZoom && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: 1540,
            marginBottom: 42,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <NiumaMascot size={275} mood="wow" />
            <SpeechBubble bg="#ffffff" borderColor={C.k8sBlue}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>原来 Pod 是给容器套个小胶囊！</div>
            </SpeechBubble>
          </div>

          {/* Enlarged Detailed Pod Capsule */}
          <div
            style={{
              width: 860,
              background: "rgba(255,255,255,0.95)",
              border: `6px solid ${C.k8sBlue}`,
              borderRadius: 56,
              padding: "32px 44px",
              boxShadow: `0 18px 0 ${C.k8sBlue}44, 0 24px 50px rgba(50,108,229,0.18)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <CandyPill text="💊 Pod 胶囊 · 最小调度单位" bg={C.k8sBlue} size={32} />
            </div>

            <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
              <div
                style={{
                  background: C.k8sBlue,
                  color: "#ffffff",
                  border: `4.5px solid ${C.ink}`,
                  borderRadius: 26,
                  padding: "24px 36px",
                  boxShadow: `0 10px 0 ${C.ink}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 48 }}>🚀</div>
                <div style={{ fontSize: 32, fontWeight: 700 }}>主程序容器</div>
                <div style={{ fontSize: 20, opacity: 0.9 }}>nginx / api-server</div>
              </div>

              <span style={{ fontSize: 42, fontWeight: 700, color: C.mint }}>+</span>

              <div
                style={{
                  background: C.mint,
                  color: "#ffffff",
                  border: `4.5px solid ${C.ink}`,
                  borderRadius: 26,
                  padding: "24px 32px",
                  boxShadow: `0 10px 0 ${C.ink}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 48 }}>📝</div>
                <div style={{ fontSize: 30, fontWeight: 700 }}>日志小跟班</div>
                <div style={{ fontSize: 20, opacity: 0.9 }}>Sidecar 边车容器</div>
              </div>
            </div>

            {/* Shared Network & Volume bar */}
            <div style={{ display: "flex", gap: 22 }}>
              <div
                style={{
                  background: C.cyanSoft,
                  border: `3.5px solid ${C.cyan}`,
                  borderRadius: 20,
                  padding: "12px 26px",
                  fontSize: 23,
                  fontWeight: 700,
                  color: C.ink,
                }}
              >
                🌐 共享网络 IP（localhost 互通）
              </div>
              <div
                style={{
                  background: C.butterSoft,
                  border: `3.5px solid ${C.butter}`,
                  borderRadius: 20,
                  padding: "12px 26px",
                  fontSize: 23,
                  fontWeight: 700,
                  color: C.ink,
                }}
              >
                💾 共享声明的存储卷（Volume）
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cue 3: Namespace — 3 Transparent Office Cubicles (Dev / Staging / Prod) */}
      {showNamespace && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            marginBottom: 42,
            width: 1620,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <ExtrudedTitle
              text="Namespace = 逻辑隔间 · 权限与配额"
              size={58}
              color={C.k8sBlue}
              shadowColor="#ffffff"
              startFrame={nsStart}
            />
          </div>

          <div style={{ display: "flex", gap: 32, width: 1560 }}>
            {[
              {
                ns: "namespace: dev",
                cn: "💻 开发分组",
                color: C.cyan,
                bg: "rgba(218,247,255,0.8)",
                note: "独立命名 · 限额调试",
                pods: ["dev-api", "dev-web"],
              },
              {
                ns: "namespace: staging",
                cn: "🧪 测试分组",
                color: C.butter,
                bg: "rgba(254,243,199,0.85)",
                note: "资源配额 · 预发演练",
                pods: ["qa-api", "qa-web"],
              },
              {
                ns: "namespace: prod",
                cn: "🔒 生产分组",
                color: C.mint,
                bg: "rgba(216,250,236,0.85)",
                note: "RBAC 权限 · 防误操作",
                pods: ["prod-api", "prod-pay"],
              },
            ].map((room, i) => {
              const p = spring({
                frame: Math.max(0, frame - nsStart - i * 14),
                fps,
                config: { damping: 11, stiffness: 190 },
              });
              return (
                <div
                  key={room.ns}
                  style={{
                    flex: 1,
                    background: room.bg,
                    border: `5px dashed ${room.color}`,
                    borderRadius: 36,
                    padding: "24px 26px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                    transform: `scale(${p})`,
                    opacity: p,
                    boxShadow: "0 14px 32px rgba(30,34,48,0.08)",
                  }}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      border: `3.5px solid ${room.color}`,
                      borderRadius: 99,
                      padding: "6px 22px",
                      fontSize: 22,
                      fontWeight: 700,
                      fontFamily: "monospace",
                      color: C.ink,
                    }}
                  >
                    {room.ns}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: C.ink }}>{room.cn}</div>
                  <div style={{ display: "flex", gap: 14 }}>
                    {room.pods.map((pl) => (
                      <PodCapsule key={pl} label={pl} version={i === 2 ? "v2" : "v1"} />
                    ))}
                  </div>
                  <CandyPill
                    text={room.note}
                    bg={room.color}
                    color={room.color === C.butter ? C.ink : "#ffffff"}
                    size={22}
                    delay={nsStart + 25 + i * 12}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cue 4: Ephemeral Temp Worker Stamp! */}
      {showEphemeral && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 64,
            marginBottom: 42,
            width: 1520,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <NiumaMascot size={290} mood="chill" />
            <SpeechBubble bg="#ffffff" borderColor={C.coral}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>
                随时替换的是 Pod，不是咱小牛马！
              </div>
            </SpeechBubble>
          </div>

          <div
            style={{
              position: "relative",
              background: "#ffffff",
              border: `5px solid ${C.ink}`,
              borderRadius: 40,
              padding: "46px 64px",
              boxShadow: `0 16px 0 ${C.ink}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <PodCapsule label="web-pod-7f8a" ip="10.244.1.9" withSidecar scale={1.32} />
            <div style={{ fontSize: 28, fontWeight: 700, color: C.sub, marginTop: 14 }}>
              随时销毁 · 随时重建 · 无状态
            </div>

            {/* Giant slamming red rubber stamp */}
            <div
              style={{
                position: "absolute",
                top: -24,
                right: -36,
                background: C.coral,
                color: "#ffffff",
                border: `5px solid ${C.ink}`,
                borderRadius: 22,
                padding: "14px 30px",
                fontSize: 42,
                fontWeight: 700,
                boxShadow: `0 10px 0 ${C.ink}`,
                transform: `rotate(12deg) scale(${stampPop * 1.05})`,
                opacity: stampPop,
              }}
            >
              🏷️ 短命临时工
            </div>
          </div>
        </div>
      )}

      <SceneWipeIn color={C.k8sBlue} />
    </K8sStage>
  );
};
