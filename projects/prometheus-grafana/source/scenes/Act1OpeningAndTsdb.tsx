import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GrafanaSunBot, NiumaMascot, PromTorchBot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import {
  C,
  CandyPill,
  ObsStage,
  SceneTiming,
  SceneTopBar,
  SpeechBubble,
  getCue,
  usePulse,
} from "../stage";

/** Act 1: K8s Black-Box Crisis -> Prometheus + Grafana Golden Duo Hero Entrance */
export const OpeningScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat } = usePulse();

  const introPair = getCue(scene.cues, "introPair", 200);
  const roles = getCue(scene.cues, "roles", 420);
  const showDuo = frame >= introPair.from;
  const showRoles = frame >= roles.from;

  const duoPop = spring({
    frame: Math.max(0, frame - introPair.from),
    fps,
    config: { damping: 10, stiffness: 190 },
  });

  return (
    <ObsStage theme="night">
      <CanvasFXLayer
        mode="nightPulse"
        burstFrames={[8, introPair.from, roles.from]}
        accent={C.promOrange}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.promOrange} dark />

      {!showDuo ? (
        /* Cue 1: Black-box Pod mystery crisis */
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
            <CandyPill text="💬 客服急报：用户下单卡爆了！" bg={C.coral} size={32} />
            <ExtrudedTitle
              text="上百个 Pod，到底谁在发烧？"
              size={60}
              color="#ffffff"
              shadowColor={C.promOrange}
              startFrame={10}
              stagger={2}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: 1480,
            }}
          >
            {/* Mystery Pod Grid */}
            <div
              style={{
                width: 820,
                background: "rgba(24,27,31,0.92)",
                border: `4px dashed ${C.coral}`,
                borderRadius: 34,
                padding: 28,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
              }}
            >
              {["order-1", "pay-2", "cart-3", "api-4", "auth-5", "db-6"].map((name, idx) => {
                const hot = idx === 1;
                return (
                  <div
                    key={name}
                    style={{
                      background: hot ? "rgba(244,63,94,0.22)" : "#1e2433",
                      border: `3.5px solid ${hot ? C.coral : "#475569"}`,
                      borderRadius: 22,
                      padding: "20px 18px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div style={{ fontSize: 38 }}>{hot ? "❓🔥" : "📦❓"}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace", color: "#e2e8f0" }}>
                      {name}
                    </div>
                    <div style={{ fontSize: 18, color: hot ? C.coral : "#94a3b8", fontWeight: 700 }}>
                      {hot ? "暗中发烧中..." : "状态未知黑盒"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <SpeechBubble bg={C.coralSoft} borderColor={C.coral}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>总不能一台台 SSH 敲 top 吧！</div>
              </SpeechBubble>
              <NiumaMascot size={280} mood="panic" prop="magnifier" jump={beat * 14} />
            </div>
          </div>
        </div>
      ) : (
        /* Cue 2 & 3: Prometheus + Grafana Golden Duo Hero Reveal */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            marginBottom: 44,
            width: 1580,
          }}
        >
          <ExtrudedTitle
            text="一集搞懂 Prometheus + Grafana！"
            size={68}
            color="#ffffff"
            shadowColor={C.promOrange}
            startFrame={introPair.from}
            stagger={2}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: 1460,
              transform: `scale(${duoPop})`,
              opacity: duoPop,
            }}
          >
            {/* Prometheus Card */}
            <div
              style={{
                width: 470,
                background: "rgba(24,27,31,0.92)",
                border: `4.5px solid ${C.promOrange}`,
                borderRadius: 34,
                padding: "24px 28px",
                boxShadow: `0 0 36px ${C.promOrange}44`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              <PromTorchBot size={220} />
              <CandyPill text="🔥 Prometheus" bg={C.promOrange} size={30} />
              {showRoles && (
                <div style={{ fontSize: 24, fontWeight: 700, color: "#fed7aa", textAlign: "center" }}>
                  负责把运行指标采集并存进时序库
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 56, fontWeight: 700, color: C.grafAmber }}>+</div>
              <NiumaMascot size={200} mood="wow" />
              <CandyPill text="云原生监控 CP" bg={C.mint} size={23} />
            </div>

            {/* Grafana Card */}
            <div
              style={{
                width: 470,
                background: "rgba(24,27,31,0.92)",
                border: `4.5px solid ${C.grafAmber}`,
                borderRadius: 34,
                padding: "24px 28px",
                boxShadow: `0 0 36px ${C.grafAmber}44`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              <GrafanaSunBot size={220} />
              <CandyPill text="📊 Grafana" bg={C.grafGold} size={30} />
              {showRoles && (
                <div style={{ fontSize: 24, fontWeight: 700, color: "#fef08a", textAlign: "center" }}>
                  把枯燥数字变成一眼看透全局的大屏
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ObsStage>
  );
};

/** Act 2: What is TSDB (ECG time-series data model) + 4 Core Metric Types */
export const TsdbAndMetricsScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modelCue = getCue(scene.cues, "dataModel", 170);
  const t1 = getCue(scene.cues, "fourTypes1", 390);
  const t2 = getCue(scene.cues, "fourTypes2", 600);
  const t3 = getCue(scene.cues, "fourTypes3", 780);

  const showTypes = frame >= t1.from;
  const activeType =
    frame >= t3.from + Math.round(t3.duration * 0.5)
      ? 3
      : frame >= t3.from
        ? 2
        : frame >= t2.from
          ? 1
          : 0;

  const counterVal = 1024 + Math.floor(frame / 4);
  const gaugeVal = Math.round(55 + Math.sin(frame * 0.08) * 32);

  return (
    <ObsStage theme="amber">
      <CanvasFXLayer
        mode="ecgWave"
        burstFrames={[8, modelCue.from, t1.from, t2.from, t3.from]}
        accent={C.promOrange}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.promOrange} />

      {!showTypes ? (
        /* TSDB Heartbeat Curve + Anatomy of a Metric Line */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            marginBottom: 42,
            width: 1580,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <PromTorchBot size={150} />
            <ExtrudedTitle
              text="时序数据库 TSDB = 系统心电图"
              size={60}
              color={C.promOrange}
              shadowColor="#ffffff"
            />
          </div>

          {/* Live animated ECG sample strip */}
          <div
            style={{
              width: 1460,
              background: "#181b1f",
              border: `4.5px solid ${C.ink}`,
              borderRadius: 30,
              padding: "22px 34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: `0 12px 0 ${C.promOrange}55`,
            }}
          >
            <svg width="760" height="110" viewBox="0 0 760 110">
              <line x1="0" y1="88" x2="760" y2="88" stroke="#334155" strokeWidth="2" />
              <polyline
                fill="none"
                stroke={C.mint}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={Array.from({ length: 26 })
                  .map((_, i) => {
                    const x = i * 30;
                    const y = 74 - Math.abs(Math.sin((i + frame * 0.14) * 0.48)) * 54;
                    return `${x},${y.toFixed(1)}`;
                  })
                  .join(" ")}
              />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "monospace", fontSize: 22, color: "#cbd5e1" }}>
              <div>14:00:00 → <span style={{ color: C.mint }}>CPU 35%</span></div>
              <div>14:00:15 → <span style={{ color: C.grafAmber }}>CPU 52%</span></div>
              <div>14:00:30 → <span style={{ color: C.coral }}>CPU 89% 🔥</span></div>
            </div>
          </div>

          {/* 4-Part Metric Anatomy */}
          {frame >= modelCue.from && (
            <div
              style={{
                width: 1460,
                background: "#ffffff",
                border: `5px solid ${C.ink}`,
                borderRadius: 32,
                padding: "24px 36px",
                boxShadow: `0 14px 0 ${C.ink}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "monospace", display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                <span style={{ background: C.promSoft, color: C.promOrange, padding: "6px 14px", borderRadius: 12 }}>
                  http_requests_total
                </span>
                <span style={{ background: C.skySoft, color: "#0369a1", padding: "6px 14px", borderRadius: 12 }}>
                  {"{service=\"shop\", status=\"200\"}"}
                </span>
                <span style={{ background: C.lavenderSoft, color: C.lavender, padding: "6px 14px", borderRadius: 12 }}>
                  @14:00:15
                </span>
                <span style={{ background: C.mintSoft, color: "#047857", padding: "6px 14px", borderRadius: 12 }}>
                  1024
                </span>
              </div>
              <div style={{ display: "flex", gap: 28, fontSize: 23, fontWeight: 700 }}>
                <span style={{ color: C.promOrange }}>① 指标名</span>
                <span style={{ color: "#0369a1" }}>② 标签键值对</span>
                <span style={{ color: C.lavender }}>③ 时间戳</span>
                <span style={{ color: "#047857" }}>④ 具体数值</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 2x2 Live Interactive 4 Core Metric Types */
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
          <CandyPill text="📊 Prometheus 四大核心指标类型" bg={C.promOrange} size={34} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, width: 1520 }}>
            {[
              {
                idx: 0,
                title: "① Counter（计数器）",
                sub: "只增不减（重启归零）· 统计请求总数、报错次数",
                color: C.promOrange,
                widget: (
                  <div style={{ fontSize: 44, fontWeight: 700, fontFamily: "monospace", color: C.promOrange }}>
                    📈 {counterVal} ↑
                  </div>
                ),
              },
              {
                idx: 1,
                title: "② Gauge（仪表盘）",
                sub: "可升可降的瞬时值 · CPU、内存、当前在线人数",
                color: C.sky,
                widget: (
                  <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
                    <span style={{ fontSize: 38, fontWeight: 700, fontFamily: "monospace", color: C.sky }}>
                      {gaugeVal}%
                    </span>
                    <div style={{ flex: 1, height: 22, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${gaugeVal}%`, height: "100%", background: C.sky }} />
                    </div>
                  </div>
                ),
              },
              {
                idx: 2,
                title: "③ Histogram（直方图）",
                sub: "按区间分桶 · 支持多机聚合计算 P95 / P99 延迟",
                color: C.mint,
                widget: (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 58 }}>
                    {[28, 54, 40, 18].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          width: 48,
                          height: h,
                          background: C.mint,
                          borderRadius: "8px 8px 4px 4px",
                          border: `2.5px solid ${C.ink}`,
                        }}
                      />
                    ))}
                    <span style={{ fontSize: 22, fontWeight: 700, color: "#047857", marginLeft: 10 }}>
                      可跨机聚合 ✓
                    </span>
                  </div>
                ),
              },
              {
                idx: 3,
                title: "④ Summary（摘要）",
                sub: "客户端直接算分位数 · 无法跨多机直接相加汇总",
                color: C.lavender,
                widget: (
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "monospace", color: C.lavender }}>
                    p50=40ms · p99=180ms（单机算好）
                  </div>
                ),
              },
            ].map((card) => {
              const isCurrent = activeType === card.idx;
              const unlocked = activeType >= card.idx;
              const pop = spring({
                frame: Math.max(0, frame - (card.idx === 0 ? t1.from : card.idx === 1 ? t2.from : t3.from)),
                fps,
                config: { damping: 11, stiffness: 200 },
              });
              return (
                <div
                  key={card.title}
                  style={{
                    background: "#ffffff",
                    border: `5px solid ${isCurrent ? card.color : C.ink}`,
                    borderRadius: 32,
                    padding: "24px 32px",
                    boxShadow: isCurrent ? `0 14px 0 ${card.color}` : "0 8px 0 rgba(30,34,48,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    transform: `scale(${unlocked ? pop * (isCurrent ? 1.03 : 0.97) : 0.88})`,
                    opacity: unlocked ? (isCurrent ? 1 : 0.72) : 0.25,
                  }}
                >
                  <div style={{ fontSize: 32, fontWeight: 700, color: card.color }}>{card.title}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: C.sub }}>{card.sub}</div>
                  <div style={{ marginTop: 4 }}>{card.widget}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <SceneWipeIn color={C.promOrange} />
    </ObsStage>
  );
};
