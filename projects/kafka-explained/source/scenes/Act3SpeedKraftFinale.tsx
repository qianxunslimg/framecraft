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
  getCue,
  usePulse,
} from "../stage";

/** Act 5 (SHOWSTOPPER): 4 Engineering Secrets Behind Kafka's Million-QPS Speed! */
export const WhySoFastScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c1 = getCue(scene.cues, "seqWrite", 14);
  const c2 = getCue(scene.cues, "pageCache", 260);
  const c3 = getCue(scene.cues, "zeroCopy", 470);
  const c4 = getCue(scene.cues, "batchCompress", 700);

  const activeIdx =
    frame >= c4.from ? 3 : frame >= c3.from ? 2 : frame >= c2.from ? 1 : 0;

  const secrets = [
    {
      idx: 0,
      start: c1.from,
      title: "① 顺序追加写磁盘",
      sub: "只往日志文件末尾写 · 告别磁头随机寻道",
      visual: "📝 [0][1][2][3][4] ➔ 极速顺序追加",
      color: C.cyan,
    },
    {
      idx: 1,
      start: c2.from,
      title: "② OS Page Cache 页缓存",
      sub: "直用 Linux 内核内存加速 · 绕开 JVM GC 卡顿",
      visual: "⚡ 内核页缓存直读直写 · 零堆内存抖动",
      color: C.mint,
    },
    {
      idx: 2,
      start: c3.from,
      title: "③ 零拷贝 Zero-Copy",
      sub: "调用 sendfile · 页缓存直通网卡，省掉多余拷贝",
      visual: "🚀 磁盘 → 内核缓存 ══sendfile══> 网卡",
      color: C.amber,
    },
    {
      idx: 3,
      start: c4.from,
      title: "④ 批量打包 + 压缩",
      sub: "多条小消息攒批 · LZ4 / Zstd 压缩一次发出",
      visual: "📦 [msg×500] → ⚡ LZ4 压缩包 → 极省带宽",
      color: C.lavender,
    },
  ];

  return (
    <KafkaStage theme="arcade">
      <CanvasFXLayer
        mode="speedGrid"
        burstFrames={[c1.from, c2.from, c3.from, c4.from]}
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
          width: 1580,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <KafkaBeltBot size={135} />
          <ExtrudedTitle
            text="百万级吞吐 · 四大极速黑科技！"
            size={60}
            color="#ffffff"
            shadowColor={C.cyan}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, width: 1540 }}>
          {secrets.map((s) => {
            const unlocked = activeIdx >= s.idx;
            const isCurrent = activeIdx === s.idx;
            const pop = spring({
              frame: Math.max(0, frame - s.start),
              fps,
              config: { damping: 11, stiffness: 200 },
            });
            return (
              <div
                key={s.title}
                style={{
                  background: unlocked ? C.darkCard : "rgba(27,32,54,0.5)",
                  border: `4.5px solid ${isCurrent ? s.color : unlocked ? "#475569" : "#28304a"}`,
                  borderRadius: 30,
                  padding: "24px 30px",
                  boxShadow: isCurrent ? `0 0 38px ${s.color}66` : "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  transform: `scale(${unlocked ? pop * (isCurrent ? 1.03 : 0.98) : 0.92})`,
                  opacity: unlocked ? (isCurrent ? 1 : 0.78) : 0.25,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.title}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0" }}>{s.sub}</div>
                <div
                  style={{
                    background: "rgba(15,23,42,0.85)",
                    border: `2.5px solid ${s.color}`,
                    borderRadius: 16,
                    padding: "12px 20px",
                    fontSize: 21,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "#ffffff",
                    marginTop: 4,
                  }}
                >
                  {s.visual}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SceneWipeIn color={C.cyan} />
    </KafkaStage>
  );
};

/** Act 6: Modern Kafka Evolution — Goodbye ZooKeeper, Welcome KRaft (Kafka 4.0!) */
export const KraftEvolutionScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kraftCue = getCue(scene.cues, "newKraft", 260);
  const showKraft = frame >= kraftCue.from;

  return (
    <KafkaStage theme="lavender">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[8, kraftCue.from]}
        accent={C.lavender}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.lavender} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          marginBottom: 42,
          width: 1560,
        }}
      >
        <ExtrudedTitle
          text="架构进化：告别 ZooKeeper，拥抱 KRaft！"
          size={58}
          color={C.indigo}
          shadowColor="#ffffff"
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: 1480 }}>
          {/* Old Architecture */}
          <div
            style={{
              width: 560,
              background: "#ffffff",
              border: `5px dashed ${C.coral}`,
              borderRadius: 34,
              padding: "30px 34px",
              opacity: showKraft ? 0.55 : 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <CandyPill text="🏚️ 旧架构（已过时）" bg={C.coral} size={26} />
            <div style={{ fontSize: 34, fontWeight: 700, color: C.ink }}>
              Kafka + 外挂 ZooKeeper
            </div>
            <div style={{ fontSize: 23, fontWeight: 700, color: C.sub }}>
              • 必须多运维一套分布式系统<br />
              • 百万分区元数据扩展有瓶颈
            </div>
          </div>

          <div style={{ fontSize: 56, fontWeight: 700, color: C.indigo }}>➔</div>

          {/* New KRaft Architecture */}
          <div
            style={{
              width: 640,
              background: "#181d31",
              color: "#ffffff",
              border: `5px solid ${C.mint}`,
              borderRadius: 34,
              padding: "30px 36px",
              boxShadow: showKraft ? `0 16px 0 ${C.mint}` : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
              transform: `scale(${showKraft ? spring({ frame: Math.max(0, frame - kraftCue.from), fps, config: { damping: 10 } }) * 1.03 : 0.9})`,
              opacity: showKraft ? 1 : 0.25,
            }}
          >
            <CandyPill text="🚀 现代架构：KRaft 模式" bg={C.mint} size={28} />
            <div style={{ fontSize: 34, fontWeight: 700, color: "#6ee7b7" }}>
              内置 Raft 共识 · 自己管元数据
            </div>
            <div style={{ fontSize: 23, fontWeight: 700, color: "#e2e8f0" }}>
              • Kafka 3.3 起生产就绪<br />
              • Kafka 4.0 已彻底移除 ZooKeeper！
            </div>
          </div>
        </div>
      </div>

      <SceneWipeIn color={C.lavender} />
    </KafkaStage>
  );
};

/** Act 7: Full Kafka Knowledge Blueprint + Golden Mantra + Niuma Off-Work Celebration */
export const FinalePanoramaScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { beat } = usePulse();

  const quoteCue = getCue(scene.cues, "quote", 360);
  const signCue = getCue(scene.cues, "signoff", 560);
  const phase = frame >= signCue.from ? 2 : frame >= quoteCue.from ? 1 : 0;

  return (
    <KafkaStage theme="cream">
      <CanvasFXLayer
        mode={phase >= 2 ? "confetti" : "sunburst"}
        burstFrames={[8, quoteCue.from, signCue.from]}
        accent={C.indigo}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.indigo} />

      {/* Phase 0: Bookmark-Worthy Kafka End-to-End Blueprint */}
      {phase === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            marginBottom: 42,
            width: 1600,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 700, color: C.ink }}>
            🗺️ 一图收藏 · Apache Kafka 核心全景架构
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 1560 }}>
            <div
              style={{
                width: 340,
                background: C.skySoft,
                border: `4.5px solid ${C.sky}`,
                borderRadius: 28,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 27, fontWeight: 700, color: "#0369a1" }}>① Producer 生产者</div>
              <CandyPill text="🔑 按 Key 路由保序" bg={C.sky} size={21} delay={6} />
              <CandyPill text="🛡️ acks = all 防丢" bg={C.sky} size={21} delay={14} />
              <CandyPill text="📦 批量打包 + LZ4" bg={C.sky} size={21} delay={22} />
            </div>

            <span style={{ fontSize: 38, fontWeight: 700, color: C.indigo }}>➔</span>

            <div
              style={{
                width: 520,
                background: C.indigoSoft,
                border: `5px solid ${C.indigo}`,
                borderRadius: 32,
                padding: "20px 26px",
                boxShadow: `0 12px 0 ${C.indigo}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                textAlign: "center",
              }}
            >
              <KafkaBeltBot size={140} />
              <div style={{ fontSize: 29, fontWeight: 700, color: C.indigo }}>② Kafka 集群（KRaft）</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: C.ink }}>
                Broker · Topic · 多 Partition 并行
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.sub }}>
                Leader + Follower + ISR 故障秒切 · 保留 7 天
              </div>
            </div>

            <span style={{ fontSize: 38, fontWeight: 700, color: C.mint }}>➔</span>

            <div
              style={{
                width: 440,
                background: C.mintSoft,
                border: `4.5px solid ${C.mint}`,
                borderRadius: 28,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 27, fontWeight: 700, color: "#047857" }}>③ Consumer Group</div>
              <CandyPill text="🔀 同组负载均衡（1对1）" bg={C.mint} size={21} delay={36} />
              <CandyPill text="📢 跨组独立广播消费" bg={C.mint} size={21} delay={44} />
              <CandyPill text="⏪ 拨回 Offset 随时回放" bg={C.mint} size={21} delay={52} />
            </div>
          </div>

          {/* Bottom 4 Speed Engines Strip */}
          <div
            style={{
              width: 1560,
              background: "#181d31",
              color: "#ffffff",
              border: `4px solid ${C.cyan}`,
              borderRadius: 24,
              padding: "16px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 23,
              fontWeight: 700,
            }}
          >
            <span style={{ color: C.cyan }}>⚡ 百万吞吐四大引擎：</span>
            <span>📝 顺序追加写磁盘</span>
            <span>⚡ OS Page Cache</span>
            <span>🚀 sendfile 零拷贝</span>
            <span>📦 批量压缩</span>
          </div>
        </div>
      )}

      {/* Phase 1: Golden Mantra */}
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
          <KafkaBeltBot size={175} />
          <div
            style={{
              background: "#ffffff",
              border: `6px solid ${C.ink}`,
              borderRadius: 42,
              padding: "40px 60px",
              boxShadow: `0 18px 0 ${C.indigo}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: C.sub }}>
              💡 一句口诀彻底记住 Kafka：
            </div>
            <ExtrudedTitle
              text="削峰解耦靠分区 · 高稳不丢靠副本"
              size={58}
              color={C.indigo}
              shadowColor={C.indigoSoft}
              startFrame={quoteCue.from + 6}
              stagger={2}
            />
            <ExtrudedTitle
              text="极速吞吐靠顺序写与零拷贝！"
              size={58}
              color={C.mint}
              shadowColor={C.mintSoft}
              startFrame={quoteCue.from + 38}
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
          <div style={{ display: "flex", alignItems: "flex-end", gap: 64 }}>
            <NiumaMascot
              size={305}
              mood="chill"
              prop="bag"
              jump={Math.abs(Math.sin(frame * 0.25)) * 30 + beat * 14}
            />
            <KafkaBeltBot size={275} jump={beat * 18} />
          </div>

          <ExtrudedTitle
            text="稳扛大促洪峰，小牛马准点下班！"
            size={64}
            color={C.ink}
            shadowColor={C.amber}
            startFrame={signCue.from}
            stagger={2}
          />

          <div style={{ display: "flex", gap: 24 }}>
            <CandyPill text="⚡ 一集搞懂 Kafka" bg={C.indigo} size={30} delay={signCue.from + 14} />
            <CandyPill text="⭐ 点赞收藏 · 随时复习" bg={C.mint} size={30} delay={signCue.from + 28} />
          </div>
        </div>
      )}

      <SceneWipeIn color={C.indigo} />
    </KafkaStage>
  );
};
