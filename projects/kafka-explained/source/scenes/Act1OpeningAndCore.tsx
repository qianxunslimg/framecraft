import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { KafkaBeltBot, NiumaMascot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import {
  C,
  CandyPill,
  KafkaStage,
  SceneTiming,
  SceneTopBar,
  SpeechBubble,
  getCue,
  usePulse,
} from "../stage";

/** Act 1: 100k QPS Flash-Sale Spike -> Peak Shaving Buffer -> Async Decoupling */
export const OpeningScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat } = usePulse();

  const rolesCue = getCue(scene.cues, "twoRoles", 220);
  const decCue = getCue(scene.cues, "decouple", 480);
  const stageIdx = frame >= decCue.from ? 2 : frame >= rolesCue.from ? 1 : 0;

  return (
    <KafkaStage theme="night">
      <CanvasFXLayer
        mode="floodStream"
        burstFrames={[8, rolesCue.from, decCue.from]}
        accent={C.indigo}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.indigo} dark />

      {/* Stage 0: 100k QPS Spike Crushing MySQL */}
      {stageIdx === 0 && (
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
            <CandyPill text="🔥 双十一 00:00 · 10 万 QPS!" bg={C.coral} size={32} />
            <ExtrudedTitle
              text="一集彻底搞懂 Apache Kafka！"
              size={64}
              color="#ffffff"
              shadowColor={C.indigo}
              startFrame={8}
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
            {/* Left: Flooding red request waves */}
            <div
              style={{
                width: 400,
                background: "rgba(244,63,94,0.16)",
                border: `4px dashed ${C.coral}`,
                borderRadius: 30,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 700, color: "#fda4af" }}>🌊 突发秒杀洪峰</div>
              {["🛒 下单 × 30,000/s", "💳 支付 × 40,000/s", "🎁 领券 × 30,000/s"].map((r, i) => (
                <div
                  key={r}
                  style={{
                    width: "100%",
                    background: C.coral,
                    color: "#ffffff",
                    borderRadius: 16,
                    padding: "10px 18px",
                    fontSize: 23,
                    fontWeight: 700,
                    textAlign: "center",
                    transform: `translateX(${Math.sin(frame * 0.3 + i) * 8}px)`,
                  }}
                >
                  {r}
                </div>
              ))}
            </div>

            <div style={{ fontSize: 54, fontWeight: 700, color: C.coral }}>💥➔</div>

            {/* Center: Overloaded Database */}
            <div
              style={{
                width: 360,
                background: "#1e2438",
                border: `5px solid ${C.coral}`,
                borderRadius: 32,
                padding: 28,
                boxShadow: `0 0 42px ${C.coral}55`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 64 }}>🗄️💥</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#ffffff" }}>MySQL 数据库</div>
              <CandyPill text="连接爆满 · 当场宕机!" bg={C.coral} size={23} />
            </div>

            {/* Right: Panicking Niuma + Hero Kafka */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <NiumaMascot size={235} mood="panic" prop="coffee" jump={beat * 14} />
              <CandyPill text="快请 Kafka 救场！" bg={C.indigo} size={24} delay={55} />
            </div>
          </div>
        </div>
      )}

      {/* Stage 1: Peak Shaving (削峰填谷) */}
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
          <CandyPill text="⚡ 绝招 ①：削峰填谷（保护下游数据库）" bg={C.cyan} color={C.ink} size={36} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: 1520,
            }}
          >
            <div
              style={{
                width: 340,
                background: "rgba(244,63,94,0.18)",
                border: `4px solid ${C.coral}`,
                borderRadius: 28,
                padding: 26,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48 }}>🌊</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#fda4af" }}>10 万 QPS 洪峰</div>
              <div style={{ fontSize: 21, color: "#cbd5e1", marginTop: 6 }}>瞬间涌入</div>
            </div>

            <span style={{ fontSize: 44, fontWeight: 700, color: C.coral }}>➔</span>

            {/* Kafka Reservoir */}
            <div
              style={{
                width: 470,
                background: C.darkCard,
                border: `5px solid ${C.indigo}`,
                borderRadius: 34,
                padding: "22px 28px",
                boxShadow: `0 0 46px ${C.indigo}55`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <KafkaBeltBot size={185} />
              <div style={{ fontSize: 32, fontWeight: 700, color: "#a5b4fc" }}>Kafka 缓冲蓄水池</div>
              <div style={{ fontSize: 21, color: "#67e8f9", fontWeight: 700 }}>
                稳稳接住 · 按顺序排队缓存
              </div>
            </div>

            <span style={{ fontSize: 44, fontWeight: 700, color: C.mint }}>➔</span>

            <div
              style={{
                width: 390,
                background: "rgba(16,185,129,0.14)",
                border: `4.5px solid ${C.mint}`,
                borderRadius: 28,
                padding: 26,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 48 }}>🗄️✨</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#6ee7b7" }}>平稳匀速落库</div>
              <CandyPill text="5,000/s 毫无压力 ✓" bg={C.mint} size={23} />
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Async Decoupling (异步解耦) */}
      {stageIdx === 2 && (
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
          <CandyPill text="🔗 绝招 ②：异步解耦（下单秒返回，下游互不拖累）" bg={C.indigo} size={34} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: 1520,
            }}
          >
            <div
              style={{
                width: 340,
                background: C.darkCard,
                border: `4.5px solid ${C.mint}`,
                borderRadius: 30,
                padding: 26,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 52 }}>🛒</div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>订单服务</div>
              <CandyPill text="丢进 Kafka 秒返回 ✓" bg={C.mint} size={22} />
            </div>

            <span style={{ fontSize: 44, fontWeight: 700, color: C.cyan }}>➔</span>

            <div
              style={{
                width: 340,
                background: C.darkCard,
                border: `5px solid ${C.indigo}`,
                borderRadius: 32,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <KafkaBeltBot size={175} />
              <div style={{ fontSize: 26, fontWeight: 700, color: "#c7d2fe" }}>Topic: order-events</div>
            </div>

            <span style={{ fontSize: 44, fontWeight: 700, color: C.cyan }}>➔</span>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 520 }}>
              {[
                { icon: "📱", name: "短信服务", note: "慢一点也不影响下单", col: C.sky },
                { icon: "🎁", name: "积分服务", note: "按需异步加分", col: C.amber },
                { icon: "📦", name: "仓储物流", note: "挂了重启继续读", col: C.mint },
              ].map((s, i) => (
                <div
                  key={s.name}
                  style={{
                    background: C.darkCard,
                    border: `4px solid ${s.col}`,
                    borderRadius: 22,
                    padding: "16px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transform: `scale(${spring({ frame: Math.max(0, frame - decCue.from - i * 12), fps, config: { damping: 12 } })})`,
                  }}
                >
                  <span style={{ fontSize: 26, fontWeight: 700, color: "#ffffff" }}>
                    {s.icon} {s.name}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: s.col }}>{s.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </KafkaStage>
  );
};

/** Act 2: Express Sorting Hub — Broker / Topic / Partition Conveyor Lanes / Offset & Key Hashing */
export const CoreModelScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const partCue = getCue(scene.cues, "partition", 220);
  const ordCue = getCue(scene.cues, "orderOffset", 470);
  const showPartitions = frame >= partCue.from;
  const showOrder = frame >= ordCue.from;

  return (
    <KafkaStage theme="sky">
      <CanvasFXLayer
        mode="beltTracks"
        burstFrames={[8, partCue.from, ordCue.from]}
        accent={C.sky}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.sky} />

      {!showPartitions ? (
        /* Cue 1: Brokers & Topics overview */
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
            text="超级快递分拣中心：Broker 与 Topic"
            size={58}
            color={C.indigo}
            shadowColor="#ffffff"
          />

          <div style={{ display: "flex", gap: 34, width: 1500 }}>
            {["Broker-1（机器 A）", "Broker-2（机器 B）", "Broker-3（机器 C）"].map((b, i) => (
              <div
                key={b}
                style={{
                  flex: 1,
                  background: "#ffffff",
                  border: `4.5px solid ${C.ink}`,
                  borderRadius: 32,
                  padding: "26px 28px",
                  boxShadow: `0 12px 0 ${C.sky}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 18,
                  transform: `scale(${spring({ frame: Math.max(0, frame - i * 12), fps, config: { damping: 11 } })})`,
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>🖥️ {b}</div>
                <CandyPill text="Topic: order-events" bg={C.indigo} size={22} />
                <CandyPill text="Topic: pay-events" bg={C.mint} size={22} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Cue 2 & 3: 3 Parallel Partition Conveyor Lanes + Offset Numbers + Same-Key Hashing */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            marginBottom: 42,
            width: 1600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <CandyPill text="📦 Topic: order-events（拆为 3 条并行分区）" bg={C.indigo} size={30} />
            {showOrder && (
              <CandyPill
                text="🔑 相同 Key(order_88) 哈希进同一分区 → 严格有序！"
                bg={C.amber}
                color={C.ink}
                size={27}
                delay={ordCue.from}
              />
            )}
          </div>

          <div
            style={{
              width: 1520,
              background: "#ffffff",
              border: `5px solid ${C.ink}`,
              borderRadius: 36,
              padding: "26px 34px",
              boxShadow: `0 14px 0 ${C.sky}`,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {[
              { id: "Partition 0", broker: "Broker-1", col: C.sky, hl: false },
              { id: "Partition 1", broker: "Broker-2", col: C.indigo, hl: showOrder },
              { id: "Partition 2", broker: "Broker-3", col: C.mint, hl: false },
            ].map((lane, lIdx) => (
              <div
                key={lane.id}
                style={{
                  background: lane.hl ? C.amberSoft : "#f8fafc",
                  border: `4px solid ${lane.hl ? C.amber : lane.col}`,
                  borderRadius: 24,
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: 250 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: lane.col }}>{lane.id}</div>
                  <div style={{ fontSize: 19, fontWeight: 700, color: C.sub }}>
                    {lane.broker} {lane.hl ? "· 🔑 Key=order_88" : ""}
                  </div>
                </div>

                {/* Numbered Offset Parcel Boxes */}
                <div style={{ display: "flex", gap: 16, flex: 1, justifyContent: "flex-start" }}>
                  {[0, 1, 2, 3, 4].map((off) => (
                    <div
                      key={off}
                      style={{
                        width: 145,
                        background: lane.hl ? C.amber : lane.col,
                        color: lane.hl ? C.ink : "#ffffff",
                        border: `3.5px solid ${C.ink}`,
                        borderRadius: 16,
                        padding: "10px 12px",
                        textAlign: "center",
                        fontFamily: "monospace",
                        fontSize: 21,
                        fontWeight: 700,
                        transform: `translateY(${Math.sin(frame * 0.2 + lIdx + off) * 3}px)`,
                      }}
                    >
                      Offset: {off}
                    </div>
                  ))}
                  <div style={{ alignSelf: "center", fontSize: 26, fontWeight: 700, color: lane.col }}>
                    ➔ 末尾追加
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showOrder && (
            <SpeechBubble bg={C.amberSoft} borderColor={C.amber} delay={ordCue.from + 20}>
              <div style={{ fontSize: 26, fontWeight: 700 }}>
                📌 考点牢记：仅单 Partition 内严格有序，跨 Partition 不保证全局有序！
              </div>
            </SpeechBubble>
          )}
        </div>
      )}

      <SceneWipeIn color={C.sky} />
    </KafkaStage>
  );
};
