import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NiumaMascot, PromTorchBot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import {
  C,
  CandyPill,
  ObsStage,
  SceneTiming,
  SceneTopBar,
  getCue,
} from "../stage";

/** Act 3: Pull Scraping Model + Exporter Translators + K8s Service Discovery & Pushgateway */
export const ScrapePullScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const expCue = getCue(scene.cues, "exporter", 180);
  const discCue = getCue(scene.cues, "discoveryPush", 480);
  const showDisc = frame >= discCue.from;
  const pullProgress = (frame % 45) / 45;

  return (
    <ObsStage theme="sky">
      <CanvasFXLayer
        mode="pullStreams"
        burstFrames={[10, expCue.from, discCue.from]}
        accent={C.sky}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.sky} />

      {!showDisc ? (
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
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <CandyPill text="⏱️ Pull 主动拉取 · 每 15 秒抓取一次" bg={C.sky} size={32} />
            {frame >= expCue.from && (
              <CandyPill text="🔌 Exporter = 指标翻译官" bg={C.promOrange} size={32} delay={expCue.from} />
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: 1520,
            }}
          >
            {/* Left: Prometheus pulling */}
            <div
              style={{
                width: 380,
                background: "#ffffff",
                border: `5px solid ${C.promOrange}`,
                borderRadius: 34,
                padding: "26px 24px",
                boxShadow: `0 14px 0 ${C.promOrange}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <PromTorchBot size={215} />
              <div style={{ fontSize: 30, fontWeight: 700, color: C.promOrange }}>Prometheus Server</div>
              <div
                style={{
                  background: C.skySoft,
                  color: "#0369a1",
                  padding: "6px 18px",
                  borderRadius: 99,
                  fontSize: 21,
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                GET /metrics ➔
              </div>
            </div>

            {/* Animated Pull arrows */}
            <svg width="260" height="360" viewBox="0 0 260 360">
              {[60, 180, 300].map((ty, idx) => {
                const px = 240 - pullProgress * 220;
                const py = ty + (180 - ty) * pullProgress;
                return (
                  <g key={ty}>
                    <line
                      x1="16"
                      y1="180"
                      x2="244"
                      y2={ty}
                      stroke={C.sky}
                      strokeWidth="5"
                      strokeDasharray="10 8"
                    />
                    <circle cx={px} cy={py} r="11" fill={idx === 0 ? C.mint : C.promOrange} stroke={C.ink} strokeWidth="3" />
                  </g>
                );
              })}
            </svg>

            {/* Right: 3 Targets with Exporters */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 820 }}>
              {[
                {
                  icon: "🚀",
                  name: "业务服务（Go / Java）",
                  badge: "原生暴露 /metrics",
                  sample: "http_requests_total 1024",
                  col: C.mint,
                },
                {
                  icon: "🖥️",
                  name: "Linux 服务器",
                  badge: "🔌 node_exporter",
                  sample: "node_cpu_seconds_total 421.8",
                  col: C.sky,
                },
                {
                  icon: "🗄️",
                  name: "MySQL / Redis",
                  badge: "🔌 mysqld_exporter",
                  sample: "mysql_threads_connected 68",
                  col: C.grafAmber,
                },
              ].map((t, i) => (
                <div
                  key={t.name}
                  style={{
                    background: "#ffffff",
                    border: `4.5px solid ${t.col}`,
                    borderRadius: 26,
                    padding: "18px 26px",
                    boxShadow: `0 10px 0 ${t.col}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transform: `scale(${spring({ frame: Math.max(0, frame - i * 12), fps, config: { damping: 12 } })})`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 42 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{t.name}</div>
                      <div style={{ fontSize: 19, fontFamily: "monospace", color: C.sub }}>{t.sample}</div>
                    </div>
                  </div>
                  <CandyPill
                    text={t.badge}
                    bg={t.col}
                    color={t.col === C.grafAmber ? C.ink : "#ffffff"}
                    size={21}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Cue 3: K8s Service Discovery + Pushgateway for short batch jobs */
        <div
          style={{
            display: "flex",
            gap: 44,
            width: 1520,
            marginBottom: 42,
          }}
        >
          {/* Left Panel: K8s Dynamic Service Discovery */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              border: `5px solid ${C.sky}`,
              borderRadius: 36,
              padding: "32px 36px",
              boxShadow: `0 16px 0 ${C.sky}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <CandyPill text="☸ K8s 自动服务发现" bg={C.sky} size={32} />
            <div style={{ fontSize: 25, fontWeight: 700, color: C.sub, textAlign: "center" }}>
              Pod 换新 IP？自动感知，免改配置！
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
              <div style={{ background: C.coralSoft, border: `3px dashed ${C.coral}`, borderRadius: 20, padding: "14px 20px", fontFamily: "monospace", fontSize: 22, fontWeight: 700, opacity: 0.55 }}>
                旧 Pod · 10.0.1.5 ✕
              </div>
              <span style={{ fontSize: 34, fontWeight: 700, color: C.sky, alignSelf: "center" }}>➔</span>
              <div style={{ background: C.mintSoft, border: `3.5px solid ${C.mint}`, borderRadius: 20, padding: "14px 20px", fontFamily: "monospace", fontSize: 22, fontWeight: 700 }}>
                新 Pod · 10.0.2.9 ✓
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0369a1", background: C.skySoft, padding: "10px 24px", borderRadius: 16 }}>
              🔍 Prometheus 自动锁定新目标继续拉取！
            </div>
          </div>

          {/* Right Panel: Pushgateway for short-lived batch jobs */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              border: `5px solid ${C.promOrange}`,
              borderRadius: 36,
              padding: "32px 36px",
              boxShadow: `0 16px 0 ${C.promOrange}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <CandyPill text="⚡ Pushgateway 中转站" bg={C.promOrange} size={32} />
            <div style={{ fontSize: 25, fontWeight: 700, color: C.sub, textAlign: "center" }}>
              跑 2 秒就结束的批处理任务，来不及被拉怎么办？
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
              <div style={{ background: C.grafSoft, border: `3.5px solid ${C.grafAmber}`, borderRadius: 18, padding: "12px 18px", fontSize: 22, fontWeight: 700 }}>
                ⏱️ 短任务 Push
              </div>
              <span style={{ fontSize: 30, fontWeight: 700, color: C.promOrange }}>➔</span>
              <div style={{ background: C.promSoft, border: `3.5px solid ${C.promOrange}`, borderRadius: 18, padding: "12px 18px", fontSize: 22, fontWeight: 700 }}>
                📮 Pushgateway
              </div>
              <span style={{ fontSize: 30, fontWeight: 700, color: C.sky }}>←</span>
              <div style={{ background: C.skySoft, border: `3.5px solid ${C.sky}`, borderRadius: 18, padding: "12px 18px", fontSize: 22, fontWeight: 700 }}>
                🔥 定时 Pull
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.promOrange, background: C.promSoft, padding: "10px 24px", borderRadius: 16 }}>
              先寄存再拉取，短任务指标绝不漏抓！
            </div>
          </div>
        </div>
      )}

      <SceneWipeIn color={C.sky} />
    </ObsStage>
  );
};

/** Act 4: PromQL Beginner Breakdown -> Alertmanager Storm Funnel -> Long-Term Storage */
export const PromqlAlertingScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const amCue = getCue(scene.cues, "alertmanager", 250);
  const ltCue = getCue(scene.cues, "longTerm", 580);
  const stageIdx = frame >= ltCue.from ? 2 : frame >= amCue.from ? 1 : 0;

  return (
    <ObsStage theme="coral">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[8, amCue.from, ltCue.from]}
        accent={C.coral}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.coral} />

      {/* Stage 0: PromQL Beginner Formula Breakdown */}
      {stageIdx === 0 && (
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
          <ExtrudedTitle
            text="PromQL 查询语言 · 一眼看懂！"
            size={60}
            color={C.ink}
            shadowColor={C.grafAmber}
          />

          <div
            style={{
              width: 1380,
              background: "#181b1f",
              border: `5px solid ${C.ink}`,
              borderRadius: 34,
              padding: "36px 46px",
              boxShadow: `0 16px 0 ${C.coral}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 26,
            }}
          >
            <div style={{ fontFamily: "monospace", fontSize: 42, fontWeight: 700, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
              <span style={{ color: "#fb7185" }}>rate(</span>
              <span style={{ color: "#38bdf8" }}>http_requests_total</span>
              <span style={{ color: "#34d399" }}>{"{service=\"shop\"}"}</span>
              <span style={{ color: "#fbbf24" }}>[5m]</span>
              <span style={{ color: "#fb7185" }}>)</span>
            </div>

            <div style={{ display: "flex", gap: 22 }}>
              <CandyPill text="rate() = 算每秒增速 (QPS)" bg={C.coral} size={23} delay={15} />
              <CandyPill text="{service='shop'} = 按标签过滤" bg={C.mint} size={23} delay={30} />
              <CandyPill text="[5m] = 取最近 5 分钟窗口" bg={C.grafAmber} color={C.ink} size={23} delay={45} />
            </div>

            <div
              style={{
                background: "rgba(16,185,129,0.16)",
                border: `3px solid ${C.mint}`,
                borderRadius: 20,
                padding: "12px 34px",
                fontSize: 30,
                fontWeight: 700,
                color: "#6ee7b7",
              }}
            >
              ➔ 查询结果：商城实时 QPS = 328 req/s ✓
            </div>
          </div>
        </div>
      )}

      {/* Stage 1: Alertmanager Compressing 100 Avalanche Alerts -> 1 Clean Message */}
      {stageIdx === 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: 1560,
            marginBottom: 42,
          }}
        >
          {/* Left: 100 chaotic avalanche alert pills */}
          <div
            style={{
              width: 430,
              background: "rgba(255,255,255,0.92)",
              border: `4.5px dashed ${C.coral}`,
              borderRadius: 32,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <CandyPill text="🚨 雪崩告警 × 100 条!" bg={C.coral} size={26} />
            {["CPU 95% (pod-1)", "CPU 96% (pod-2)", "接口超时 504", "连接池耗尽…"].map((a, i) => (
              <div
                key={a}
                style={{
                  width: "100%",
                  background: C.coralSoft,
                  border: `3px solid ${C.coral}`,
                  borderRadius: 16,
                  padding: "10px 18px",
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.coral,
                  transform: `translateX(${Math.sin(frame * 0.25 + i) * 5}px)`,
                }}
              >
                ⚠️ {a}
              </div>
            ))}
          </div>

          <span style={{ fontSize: 44, fontWeight: 700, color: C.coral }}>➔</span>

          {/* Center: Alertmanager Smart Filter */}
          <div
            style={{
              width: 430,
              background: `linear-gradient(135deg, ${C.promOrange}, ${C.coral})`,
              color: "#ffffff",
              border: `5px solid ${C.ink}`,
              borderRadius: 36,
              padding: "30px 28px",
              boxShadow: `0 14px 0 ${C.ink}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 54 }}>🔔</div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>Alertmanager</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%" }}>
              {["📦 分组", "🧹 去重", "🛑 抑制", "🔕 静默"].map((fn) => (
                <div
                  key={fn}
                  style={{
                    background: "rgba(255,255,255,0.22)",
                    borderRadius: 16,
                    padding: "10px 12px",
                    textAlign: "center",
                    fontSize: 23,
                    fontWeight: 700,
                  }}
                >
                  {fn}
                </div>
              ))}
            </div>
          </div>

          <span style={{ fontSize: 44, fontWeight: 700, color: C.mint }}>➔</span>

          {/* Right: 1 Clean Notification + Calm Niuma */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 450 }}>
            <div
              style={{
                width: "100%",
                background: "#ffffff",
                border: `4.5px solid ${C.mint}`,
                borderRadius: 28,
                padding: "20px 24px",
                boxShadow: `0 10px 0 ${C.mint}`,
                transform: `scale(${spring({ frame: Math.max(0, frame - amCue.from - 30), fps, config: { damping: 11 } })})`,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: "#047857" }}>
                💬 钉钉 / 飞书 · 合并为 1 条
              </div>
              <div style={{ fontSize: 21, fontWeight: 700, color: C.ink, marginTop: 8 }}>
                [高优] shop 集群异常（已聚合 100 条）
              </div>
            </div>
            <NiumaMascot size={215} mood="chill" />
          </div>
        </div>
      )}

      {/* Stage 2: Local Hot TSDB (15d) -> Thanos / VictoriaMetrics Long-Term Storage */}
      {stageIdx === 2 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 44,
            width: 1520,
            marginBottom: 42,
          }}
        >
          <div
            style={{
              width: 580,
              background: "#ffffff",
              border: `5px solid ${C.promOrange}`,
              borderRadius: 36,
              padding: "34px 38px",
              boxShadow: `0 14px 0 ${C.promOrange}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 58 }}>🔥</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.promOrange }}>
              Prometheus 本地 TSDB
            </div>
            <CandyPill text="默认保留 15 天近期热数据" bg={C.promOrange} size={25} />
            <div style={{ fontSize: 23, color: C.sub, fontWeight: 700 }}>
              查询极快 · 轻量简洁 · 单机即可起飞
            </div>
          </div>

          <div style={{ fontSize: 56, fontWeight: 700, color: C.grafAmber }}>➔</div>

          <div
            style={{
              width: 620,
              background: "#181b1f",
              color: "#ffffff",
              border: `5px solid ${C.sky}`,
              borderRadius: 36,
              padding: "34px 38px",
              boxShadow: `0 14px 0 ${C.ink}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 58 }}>🏛️</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: "#7dd3fc" }}>
              Thanos / VictoriaMetrics
            </div>
            <CandyPill text="数月 / 数年海量长期存储" bg={C.sky} size={25} />
            <div style={{ fontSize: 23, color: "#cbd5e1", fontWeight: 700 }}>
              对接对象存储 · 跨集群全局视图统一查询
            </div>
          </div>
        </div>
      )}

      <SceneWipeIn color={C.coral} />
    </ObsStage>
  );
};
