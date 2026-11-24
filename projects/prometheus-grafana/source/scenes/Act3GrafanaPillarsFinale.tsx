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
  getCue,
  usePulse,
} from "../stage";

/** Act 5: Authentic Dark-Mode Grafana Live Dashboard + Data Sources + Template ID 1860 */
export const GrafanaDashboardScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dashCue = getCue(scene.cues, "dashboard", 220);
  const tplCue = getCue(scene.cues, "templates", 480);

  const showDash = frame >= dashCue.from;
  const showTpl = frame >= tplCue.from;
  const cpuVal = Math.round(58 + Math.sin(frame * 0.09) * 24);
  const podIdx = Math.floor(frame / 35) % 3;
  const podNames = ["shop-api-01", "shop-api-02", "pay-svc-01"];

  return (
    <ObsStage theme="darkDash">
      <CanvasFXLayer
        mode="grafanaGrid"
        burstFrames={[8, dashCue.from, tplCue.from]}
        accent={C.grafGold}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.grafGold} dark />

      {!showDash ? (
        /* Cue 1: Key Fact — Grafana Does NOT Store Business Monitoring Data! */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            marginBottom: 42,
            width: 1560,
          }}
        >
          <CandyPill
            text="⚠️ 划重点：Grafana 自己不存业务监控数据！"
            bg={C.grafGold}
            size={38}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: 1460,
            }}
          >
            {/* Left: Multiple Data Sources */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 440 }}>
              {[
                { label: "🔥 Prometheus（指标）", col: C.promOrange },
                { label: "📝 Loki（日志）", col: C.sky },
                { label: "🐬 MySQL / PostgreSQL", col: C.mint },
                { label: "🔍 Elasticsearch / ClickHouse", col: C.lavender },
              ].map((ds, i) => (
                <div
                  key={ds.label}
                  style={{
                    background: C.darkCard,
                    border: `3.5px solid ${ds.col}`,
                    borderRadius: 20,
                    padding: "14px 24px",
                    fontSize: 25,
                    fontWeight: 700,
                    color: "#f8fafc",
                    transform: `translateX(${(1 - spring({ frame: Math.max(0, frame - i * 10), fps, config: { damping: 12 } })) * -45}px)`,
                  }}
                >
                  {ds.label}
                </div>
              ))}
            </div>

            <div style={{ fontSize: 48, fontWeight: 700, color: C.grafAmber }}>
              🔌 Data Sources ➔
            </div>

            {/* Right: Grafana Cockpit */}
            <div
              style={{
                width: 440,
                background: C.darkCard,
                border: `5px solid ${C.grafAmber}`,
                borderRadius: 36,
                padding: "28px 26px",
                boxShadow: `0 0 46px ${C.grafGold}44`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              <GrafanaSunBot size={235} />
              <div style={{ fontSize: 34, fontWeight: 700, color: C.grafAmber }}>
                Grafana 统一驾驶舱
              </div>
              <div style={{ fontSize: 22, color: "#cbd5e1", fontWeight: 700 }}>
                连接万物数据源 · 专注极致可视化
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Cue 2 & 3: Live Authentic Dark-Mode Grafana Dashboard UI + Template ID 1860 */
        <div
          style={{
            width: 1640,
            background: "#14161b",
            border: `4px solid ${C.grafGold}`,
            borderRadius: 32,
            padding: "22px 28px 28px",
            marginBottom: 42,
            boxShadow: `0 0 50px ${C.grafGold}33`,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Authentic Grafana Top Variable Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: C.grafAmber }}>📊 Grafana Live</span>
              {[
                { k: "Cluster", v: "prod-k8s" },
                { k: "Namespace", v: "shop" },
                { k: "Pod", v: showTpl ? podNames[podIdx] : "shop-api-01" },
              ].map((v) => (
                <div
                  key={v.k}
                  style={{
                    background: "#1f232c",
                    border: `2.5px solid ${showTpl ? C.mint : "#334155"}`,
                    borderRadius: 12,
                    padding: "6px 16px",
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  <span style={{ color: "#94a3b8" }}>{v.k}: </span>
                  <span style={{ color: "#6ee7b7" }}>{v.v} ▾</span>
                </div>
              ))}
            </div>

            {showTpl && (
              <CandyPill
                text="📥 一键导入模板 ID: 1860（3秒出大屏！）"
                bg={C.grafGold}
                size={23}
                delay={tplCue.from}
              />
            )}
          </div>

          {/* 3 Live Animated Grafana Panels */}
          <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.9fr 1fr", gap: 22 }}>
            {/* Panel 1: Live Dual-Line Time Series Chart */}
            <div
              style={{
                background: C.darkCard,
                border: `2.5px solid ${C.darkBorder}`,
                borderRadius: 22,
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700 }}>
                <span style={{ color: "#f8fafc" }}>📈 实时 QPS & 延迟曲线</span>
                <span style={{ color: C.mint }}>328 req/s</span>
              </div>
              <svg width="560" height="240" viewBox="0 0 560 240">
                {[50, 110, 170, 220].map((y) => (
                  <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#262b33" strokeWidth="1.5" />
                ))}
                {/* Emerald QPS line */}
                <polyline
                  fill="none"
                  stroke={C.mint}
                  strokeWidth="4.5"
                  points={Array.from({ length: 24 })
                    .map((_, i) => {
                      const x = i * 24;
                      const y = 135 - Math.sin((i + frame * 0.14) * 0.4) * 58 - Math.cos(i * 0.7) * 18;
                      return `${x},${y.toFixed(1)}`;
                    })
                    .join(" ")}
                />
                {/* Amber latency line */}
                <polyline
                  fill="none"
                  stroke={C.grafAmber}
                  strokeWidth="4"
                  points={Array.from({ length: 24 })
                    .map((_, i) => {
                      const x = i * 24;
                      const y = 175 - Math.cos((i + frame * 0.11) * 0.35) * 42;
                      return `${x},${y.toFixed(1)}`;
                    })
                    .join(" ")}
                />
              </svg>
            </div>

            {/* Panel 2: Circular CPU Gauge */}
            <div
              style={{
                background: C.darkCard,
                border: `2.5px solid ${C.darkBorder}`,
                borderRadius: 22,
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc", alignSelf: "flex-start" }}>
                ⚡ CPU 使用率仪表盘
              </div>
              <svg width="260" height="175" viewBox="0 0 260 175">
                <path d="M35 150 A95 95 0 0 1 225 150" fill="none" stroke="#2c3235" strokeWidth="24" strokeLinecap="round" />
                <path
                  d="M35 150 A95 95 0 0 1 225 150"
                  fill="none"
                  stroke={cpuVal > 75 ? C.coral : cpuVal > 55 ? C.grafAmber : C.mint}
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeDasharray="298"
                  strokeDashoffset={298 * (1 - cpuVal / 100)}
                />
                <text x="130" y="138" textAnchor="middle" fontSize="54" fontWeight="700" fill="#ffffff">
                  {cpuVal}%
                </text>
              </svg>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.mint }}>状态：健康运行 ●</div>
            </div>

            {/* Panel 3: Glowing Latency Heatmap */}
            <div
              style={{
                background: C.darkCard,
                border: `2.5px solid ${C.darkBorder}`,
                borderRadius: 22,
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc" }}>
                🔥 接口耗时热力图 (P99)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 7, marginTop: 10 }}>
                {Array.from({ length: 40 }).map((_, idx) => {
                  const v = Math.abs(Math.sin(idx * 0.7 + frame * 0.07));
                  const bg =
                    v > 0.82 ? C.coral : v > 0.55 ? C.grafGold : v > 0.28 ? C.grafAmber : "#1e3a3a";
                  return (
                    <div
                      key={idx}
                      style={{
                        height: 30,
                        borderRadius: 6,
                        background: bg,
                        opacity: 0.4 + v * 0.6,
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#94a3b8", fontFamily: "monospace", marginTop: 10 }}>
                <span>10ms</span>
                <span>P95: 62ms</span>
                <span style={{ color: C.grafAmber }}>P99: 140ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <SceneWipeIn color={C.grafGold} />
    </ObsStage>
  );
};

/** Act 6: Observability Three Pillars (Metrics + Logs + Traces) Converging in Grafana! */
export const ThreePillarsScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const corr = getCue(scene.cues, "correlation", 190);
  const unif = getCue(scene.cues, "unified", 500);
  const showUnified = frame >= unif.from;

  return (
    <ObsStage theme="lavender">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[8, corr.from, unif.from]}
        accent={C.lavender}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.lavender} />

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
        <ExtrudedTitle
          text="云原生可观测性 · 三驾马车"
          size={60}
          color={C.lavender}
          shadowColor="#ffffff"
        />

        {/* 3 Pillar Cards */}
        <div style={{ display: "flex", gap: 30, width: 1540 }}>
          {[
            {
              icon: "📊",
              en: "Metrics（指标）",
              tool: "Prometheus",
              q: "❓ 系统是不是出事了？",
              ex: "延迟飙升 · 错误率 8%",
              col: C.promOrange,
              bg: C.promSoft,
              delay: corr.from,
            },
            {
              icon: "📝",
              en: "Logs（日志）",
              tool: "Loki / ELK",
              q: "❓ 具体报了什么错？",
              ex: "ERROR: DB connection timeout",
              col: C.sky,
              bg: C.skySoft,
              delay: corr.from + Math.round(corr.duration * 0.33),
            },
            {
              icon: "🔗",
              en: "Traces（链路追踪）",
              tool: "Tempo / Jaeger",
              q: "❓ 到底卡在哪个微服务？",
              ex: "网关 → 订单 → 支付(2.4s!)",
              col: C.lavender,
              bg: C.lavenderSoft,
              delay: corr.from + Math.round(corr.duration * 0.66),
            },
          ].map((p) => {
            const lit = frame >= p.delay;
            const pop = spring({
              frame: Math.max(0, frame - p.delay),
              fps,
              config: { damping: 11, stiffness: 190 },
            });
            return (
              <div
                key={p.en}
                style={{
                  flex: 1,
                  background: "#ffffff",
                  border: `5px solid ${lit ? p.col : "#cbd5e1"}`,
                  borderRadius: 34,
                  padding: "26px 28px",
                  boxShadow: lit ? `0 14px 0 ${p.col}` : "0 6px 0 rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  transform: `scale(${lit ? pop : 0.94})`,
                  opacity: lit ? 1 : 0.45,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 52 }}>{p.icon}</div>
                <div style={{ fontSize: 31, fontWeight: 700, color: p.col }}>{p.en}</div>
                <CandyPill text={p.tool} bg={p.col} size={23} />
                <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{p.q}</div>
                <div
                  style={{
                    background: p.bg,
                    borderRadius: 14,
                    padding: "8px 16px",
                    fontSize: 19,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: C.ink,
                  }}
                >
                  {p.ex}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Unified Grafana Correlation Banner */}
        {showUnified && (
          <div
            style={{
              width: 1540,
              background: "#181b1f",
              color: "#ffffff",
              border: `4.5px solid ${C.grafAmber}`,
              borderRadius: 28,
              padding: "20px 36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: `0 12px 0 ${C.grafGold}`,
              transform: `scale(${spring({ frame: Math.max(0, frame - unif.from), fps, config: { damping: 11 } })})`,
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 700, color: C.grafAmber }}>
              📊 全部统一收进 Grafana：
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 25, fontWeight: 700 }}>
              <span style={{ color: C.coral }}>📈 延迟飙升</span>
              <span>➔</span>
              <span style={{ color: "#7dd3fc" }}>📝 一键看日志</span>
              <span>➔</span>
              <span style={{ color: "#c4b5fd" }}>🔗 钻进调用链</span>
              <span>➔</span>
              <span style={{ color: C.mint }}>🎯 几十秒抓出真凶！</span>
            </div>
          </div>
        )}
      </div>

      <SceneWipeIn color={C.lavender} />
    </ObsStage>
  );
};

/** Act 7: End-to-End Monitoring Blueprint + Golden Mantra + Trio Off-Work Finale */
export const FinaleBlueprintScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat } = usePulse();

  const quoteCue = getCue(scene.cues, "quote", 340);
  const signCue = getCue(scene.cues, "signoff", 560);
  const phase = frame >= signCue.from ? 2 : frame >= quoteCue.from ? 1 : 0;

  return (
    <ObsStage theme="cream">
      <CanvasFXLayer
        mode={phase >= 2 ? "confetti" : "sunburst"}
        burstFrames={[8, quoteCue.from, signCue.from]}
        accent={C.promOrange}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.promOrange} />

      {/* Phase 0: End-to-End Monitoring Blueprint */}
      {phase === 0 && (
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
          <div style={{ fontSize: 42, fontWeight: 700, color: C.ink }}>
            🗺️ 一图收藏 · Prometheus + Grafana 完整架构
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: 1560,
            }}
          >
            {/* Col 1: Exporters & Targets */}
            <div
              style={{
                width: 350,
                background: C.skySoft,
                border: `4.5px solid ${C.sky}`,
                borderRadius: 30,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: "#0369a1" }}>① 数据采集源</div>
              <CandyPill text="🚀 应用 /metrics" bg={C.sky} size={22} delay={6} />
              <CandyPill text="🔌 Exporter 翻译官" bg={C.sky} size={22} delay={14} />
              <CandyPill text="📮 Pushgateway" bg={C.sky} size={22} delay={22} />
            </div>

            <div style={{ fontSize: 38, fontWeight: 700, color: C.sky }}>← Pull</div>

            {/* Col 2: Prometheus Core */}
            <div
              style={{
                width: 440,
                background: C.promSoft,
                border: `5px solid ${C.promOrange}`,
                borderRadius: 34,
                padding: "24px 26px",
                boxShadow: `0 12px 0 ${C.promOrange}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <PromTorchBot size={155} />
              <div style={{ fontSize: 30, fontWeight: 700, color: C.promOrange }}>② Prometheus 核心</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: C.ink, textAlign: "center" }}>
                自动服务发现 · TSDB 时序库 · PromQL
              </div>
              <div style={{ fontSize: 19, color: C.sub, fontWeight: 700 }}>
                长期存储：Thanos / VictoriaMetrics
              </div>
            </div>

            <div style={{ fontSize: 38, fontWeight: 700, color: C.promOrange }}>➔</div>

            {/* Col 3: Alertmanager + Grafana */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 525 }}>
              <div
                style={{
                  background: C.coralSoft,
                  border: `4.5px solid ${C.coral}`,
                  borderRadius: 28,
                  padding: "20px 24px",
                  transform: `scale(${spring({ frame: Math.max(0, frame - 42), fps, config: { damping: 12 } })})`,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 700, color: C.coral }}>③ Alertmanager 告警</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginTop: 6, whiteSpace: "nowrap" }}>
                  分组 · 去重 · 抑制 · 静默 → 钉钉 / 飞书
                </div>
              </div>

              <div
                style={{
                  background: "#181b1f",
                  color: "#ffffff",
                  border: `4.5px solid ${C.grafAmber}`,
                  borderRadius: 28,
                  padding: "20px 24px",
                  boxShadow: `0 10px 0 ${C.grafGold}`,
                  transform: `scale(${spring({ frame: Math.max(0, frame - 58), fps, config: { damping: 12 } })})`,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 700, color: C.grafAmber }}>④ Grafana 可视化大屏</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#cbd5e1", marginTop: 6, whiteSpace: "nowrap" }}>
                  统一大屏（ID 1860）+ Loki 日志 + Tempo 链路
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 1: Golden Mantra Quote */}
      {phase === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            marginBottom: 42,
            width: 1560,
          }}
        >
          <div style={{ display: "flex", gap: 40 }}>
            <PromTorchBot size={165} />
            <GrafanaSunBot size={165} />
          </div>
          <div
            style={{
              background: "#ffffff",
              border: `6px solid ${C.ink}`,
              borderRadius: 42,
              padding: "38px 58px",
              boxShadow: `0 18px 0 ${C.promOrange}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: C.sub }}>
              💡 一句口诀彻底记住它们：
            </div>
            <ExtrudedTitle
              text="Prometheus 记下系统每次心跳"
              size={58}
              color={C.promOrange}
              shadowColor={C.promSoft}
              startFrame={quoteCue.from + 6}
              stagger={2}
            />
            <ExtrudedTitle
              text="Alertmanager 精准喊你 · Grafana 看透全局"
              size={52}
              color={C.grafGold}
              shadowColor={C.grafSoft}
              startFrame={quoteCue.from + 36}
              stagger={2}
            />
          </div>
        </div>
      )}

      {/* Phase 2: Celebration Sign-Off */}
      {phase === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            marginBottom: 42,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 56 }}>
            <PromTorchBot size={250} jump={beat * 18} />
            <NiumaMascot
              size={295}
              mood="chill"
              prop="coffee"
              jump={Math.abs(Math.sin(frame * 0.25)) * 30 + beat * 14}
            />
            <GrafanaSunBot size={250} jump={beat * 18} />
          </div>

          <ExtrudedTitle
            text="告别黑盒排障，小牛马天天准点下班！"
            size={62}
            color={C.ink}
            shadowColor={C.grafAmber}
            startFrame={signCue.from}
            stagger={2}
          />

          <div style={{ display: "flex", gap: 24 }}>
            <CandyPill text="🔥 一集搞懂监控双雄" bg={C.promOrange} size={30} delay={signCue.from + 14} />
            <CandyPill text="⭐ 点赞收藏 · 随时复习" bg={C.mint} size={30} delay={signCue.from + 28} />
          </div>
        </div>
      )}

      <SceneWipeIn color={C.promOrange} />
    </ObsStage>
  );
};
