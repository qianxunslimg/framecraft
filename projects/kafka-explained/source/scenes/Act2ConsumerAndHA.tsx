import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NiumaMascot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import {
  C,
  CandyPill,
  KafkaStage,
  SceneTiming,
  SceneTopBar,
  getCue,
} from "../stage";

/** Act 3: Consumer Group Golden Rules (1-to-1 Load Balance, Idle Extra Consumer, Multi-Group Broadcast & Replay) */
export const ConsumerGroupScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const idleCue = getCue(scene.cues, "idleWorker", 220);
  const multiCue = getCue(scene.cues, "multiGroup", 440);
  const showIdle = frame >= idleCue.from && frame < multiCue.from;
  const showMulti = frame >= multiCue.from;

  return (
    <KafkaStage theme="mint">
      <CanvasFXLayer
        mode="beltTracks"
        burstFrames={[8, idleCue.from, multiCue.from]}
        accent={C.mint}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.mint} />

      {!showMulti ? (
        /* Cue 1 & 2: Same Consumer Group 1-to-1 + Comic 4th Idle Consumer */
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
          <CandyPill
            text={
              showIdle
                ? "⚠️ 避坑：3 个分区塞进 4 个消费者 → 第 4 个只能空闲摸鱼！"
                : "👥 同一个消费者组内：1 个分区同一时刻只给 1 个消费者读"
            }
            bg={showIdle ? C.coral : C.mint}
            size={32}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: 1480,
            }}
          >
            {/* Left: 3 Partitions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 380 }}>
              {["Partition 0", "Partition 1", "Partition 2"].map((p, i) => (
                <div
                  key={p}
                  style={{
                    background: "#ffffff",
                    border: `4.5px solid ${[C.sky, C.indigo, C.mint][i]}`,
                    borderRadius: 24,
                    padding: "20px 28px",
                    fontSize: 28,
                    fontWeight: 700,
                    textAlign: "center",
                    boxShadow: `0 10px 0 ${[C.sky, C.indigo, C.mint][i]}44`,
                  }}
                >
                  📦 {p} ➔
                </div>
              ))}
            </div>

            {/* Right: Consumer Group Box */}
            <div
              style={{
                width: 780,
                background: "rgba(255,255,255,0.94)",
                border: `5px dashed ${C.mint}`,
                borderRadius: 36,
                padding: "24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: "#047857" }}>
                🏷️ Consumer Group：order-group（分工负载均衡）
              </div>
              {[
                { name: "Consumer A", part: "专责 Partition 0", col: C.sky, idle: false },
                { name: "Consumer B", part: "专责 Partition 1", col: C.indigo, idle: false },
                { name: "Consumer C", part: "专责 Partition 2", col: C.mint, idle: false },
              ].map((c) => (
                <div
                  key={c.name}
                  style={{
                    background: C.mintSoft,
                    border: `3.5px solid ${c.col}`,
                    borderRadius: 20,
                    padding: "14px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 25,
                    fontWeight: 700,
                  }}
                >
                  <span>🤖 {c.name}</span>
                  <span style={{ color: c.col }}>✅ {c.part}</span>
                </div>
              ))}

              {/* 4th Idle Consumer */}
              {showIdle && (
                <div
                  style={{
                    background: C.coralSoft,
                    border: `4px dashed ${C.coral}`,
                    borderRadius: 20,
                    padding: "14px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 25,
                    fontWeight: 700,
                    color: C.coral,
                    transform: `scale(${spring({ frame: Math.max(0, frame - idleCue.from), fps, config: { damping: 10 } })})`,
                  }}
                >
                  <span>😴 Consumer D（第 4 个）</span>
                  <span>💤 无分区可分 · 空闲摸鱼！</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Cue 3: Different Consumer Groups Broadcasting + 7-Day Disk Retention & Replay */
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
          <ExtrudedTitle
            text="不同组独立广播 · 消息保留 7 天可回放！"
            size={56}
            color={C.ink}
            shadowColor={C.mintSoft}
            startFrame={multiCue.from}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: 1520,
            }}
          >
            {/* Left: Persistent Topic Log */}
            <div
              style={{
                width: 520,
                background: "#181d31",
                color: "#ffffff",
                border: `5px solid ${C.mint}`,
                borderRadius: 32,
                padding: "26px 26px",
                boxShadow: `0 14px 0 ${C.ink}`,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 700, color: C.mint, whiteSpace: "nowrap" }}>
                💾 Topic 磁盘日志（读完不删！）
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div
                    key={n}
                    style={{
                      flex: 1,
                      background: C.indigo,
                      borderRadius: 10,
                      padding: "12px 0",
                      textAlign: "center",
                      fontFamily: "monospace",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <CandyPill text="⏱️ 默认保留 7 天 · 可拨回 Offset 回放 ⏪" bg={C.amber} color={C.ink} size={20} />
            </div>

            <div style={{ fontSize: 44, fontWeight: 700, color: C.mint }}>➔</div>

            {/* Right: 3 Independent Consumer Groups */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 880 }}>
              {[
                { g: "🎁 积分消费组（Group A）", off: "Offset = 10", col: C.indigo },
                { g: "🛡️ 风控消费组（Group B）", off: "Offset = 8", col: C.coral },
                { g: "📊 数仓统计组（Group C）", off: "Offset = 4（正在回溯重读）", col: C.sky },
              ].map((row, idx) => (
                <div
                  key={row.g}
                  style={{
                    background: "#ffffff",
                    border: `4.5px solid ${row.col}`,
                    borderRadius: 24,
                    padding: "18px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: `0 10px 0 ${row.col}44`,
                    transform: `scale(${spring({ frame: Math.max(0, frame - multiCue.from - idx * 14), fps, config: { damping: 11 } })})`,
                  }}
                >
                  <span style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{row.g}</span>
                  <CandyPill text={`🔖 独立书签 ${row.off}`} bg={row.col} size={21} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SceneWipeIn color={C.mint} />
    </KafkaStage>
  );
};

/** Act 4: High Availability — Leader / Follower / ISR Failover + acks=0 / 1 / all */
export const HaReplicationScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isrCue = getCue(scene.cues, "isrFailover", 240);
  const acksCue = getCue(scene.cues, "acks", 520);

  const showAcks = frame >= acksCue.from;
  const isrLocal = frame - isrCue.from;
  const leaderCrashed = isrLocal >= Math.round(isrCue.duration * 0.30);
  const newLeaderUp = isrLocal >= Math.round(isrCue.duration * 0.62);

  return (
    <KafkaStage theme="amber">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[8, isrCue.from + Math.round(isrCue.duration * 0.62), acksCue.from]}
        accent={C.amber}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.amber} />

      {!showAcks ? (
        /* Cue 1 & 2: Leader/Follower Replication + Live ISR Failover! */
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
          <CandyPill
            text={
              newLeaderUp
                ? "👑 ISR 选举完成：Broker-2 接班成为新 Leader，数据零丢失！"
                : leaderCrashed
                  ? "💥 突发故障：Broker-1（原 Leader）断电宕机！"
                  : "🛡️ Partition 0 三副本架构：1 Leader 对外读写 + 2 Follower 同步备份"
            }
            bg={newLeaderUp ? C.mint : leaderCrashed ? C.coral : C.indigo}
            size={30}
          />

          <div style={{ display: "flex", gap: 36, width: 1520 }}>
            {[
              {
                name: "Broker-1",
                dead: leaderCrashed,
                role: leaderCrashed ? "💥 宕机离线" : "👑 Leader（对外读写）",
                isr: !leaderCrashed,
              },
              {
                name: "Broker-2",
                dead: false,
                role: newLeaderUp ? "👑 新 Leader 顶上！" : "📋 Follower（同步备份）",
                isr: true,
              },
              {
                name: "Broker-3",
                dead: false,
                role: "📋 Follower（同步备份）",
                isr: true,
              },
            ].map((b) => {
              const isLeader = (!leaderCrashed && b.name === "Broker-1") || (newLeaderUp && b.name === "Broker-2");
              return (
                <div
                  key={b.name}
                  style={{
                    flex: 1,
                    background: b.dead ? "rgba(244,63,94,0.12)" : "#ffffff",
                    border: `5px ${b.dead ? "dashed" : "solid"} ${b.dead ? C.coral : isLeader ? C.amber : C.mint}`,
                    borderRadius: 34,
                    padding: "28px 26px",
                    boxShadow: b.dead ? "none" : `0 14px 0 ${isLeader ? C.amber : C.mint}`,
                    opacity: b.dead ? 0.55 : 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 32, fontWeight: 700, color: C.ink }}>🖥️ {b.name}</div>
                  <CandyPill
                    text={b.role}
                    bg={b.dead ? C.coral : isLeader ? C.amber : C.sky}
                    color={isLeader ? C.ink : "#ffffff"}
                    size={23}
                  />
                  <div
                    style={{
                      background: b.isr ? C.mintSoft : C.coralSoft,
                      color: b.isr ? "#047857" : C.coral,
                      padding: "8px 20px",
                      borderRadius: 99,
                      fontSize: 21,
                      fontWeight: 700,
                    }}
                  >
                    {b.isr ? "✅ 在 ISR 健康同步名单内" : "✕ 移出 ISR 名单"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Cue 3: Producer acks=0 / 1 / all Comparison */
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
          <ExtrudedTitle
            text="生产者 acks 参数：速度 vs 安全"
            size={60}
            color={C.ink}
            shadowColor="#ffffff"
            startFrame={acksCue.from}
          />

          <div style={{ display: "flex", gap: 30, width: 1540 }}>
            {[
              {
                val: "acks = 0",
                tag: "🚀 最快 · 可能丢消息",
                desc: "发出去就不管，不等任何确认\n适合允许少量丢失的普通日志",
                col: C.coral,
                bg: C.coralSoft,
              },
              {
                val: "acks = 1",
                tag: "⚖️ 折中平衡（常用）",
                desc: "等 Leader 写完磁盘就返回成功\n极少数切换瞬间仍有丢失风险",
                col: C.amber,
                bg: C.amberSoft,
              },
              {
                val: "acks = all (-1)",
                tag: "🛡️ 最稳妥 · 核心业务首选",
                desc: "必须等所有 ISR 副本全部同步完成\n金融、支付与订单系统标配！",
                col: C.mint,
                bg: C.mintSoft,
              },
            ].map((card, i) => (
              <div
                key={card.val}
                style={{
                  flex: 1,
                  background: "#ffffff",
                  border: `5px solid ${card.col}`,
                  borderRadius: 34,
                  padding: "28px 26px",
                  boxShadow: `0 14px 0 ${card.col}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  textAlign: "center",
                  transform: `scale(${spring({ frame: Math.max(0, frame - acksCue.from - i * 16), fps, config: { damping: 11 } })})`,
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "monospace", color: card.col }}>
                  {card.val}
                </div>
                <CandyPill
                  text={card.tag}
                  bg={card.col}
                  color={card.col === C.amber ? C.ink : "#ffffff"}
                  size={22}
                />
                <div
                  style={{
                    background: card.bg,
                    borderRadius: 18,
                    padding: "14px 18px",
                    fontSize: 22,
                    fontWeight: 700,
                    color: C.ink,
                    whiteSpace: "pre-line",
                    lineHeight: 1.5,
                  }}
                >
                  {card.desc}
                </div>
              </div>
            ))}
          </div>
          <NiumaMascot size={140} mood="wow" />
        </div>
      )}

      <SceneWipeIn color={C.amber} />
    </KafkaStage>
  );
};
