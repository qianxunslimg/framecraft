import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NiumaMascot, RedisCubeBot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, getCue, RedisStage, SceneTopBar, SceneTiming, usePulse } from "../stage";

/** Act 5: Three Legendary Cache Disasters — Penetration, Breakdown, Avalanche & Cures */
export const CacheTrapsScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c1 = getCue(scene.cues, "penetration", 14);
  const c2 = getCue(scene.cues, "breakdown", 500);
  const c3 = getCue(scene.cues, "avalanche", 980);

  const activeIdx = frame >= c3.from ? 2 : frame >= c2.from ? 1 : 0;

  const traps = [
    {
      idx: 0,
      start: c1.from,
      col: C.crimson,
      soft: C.crimsonSoft,
      icon: "🕳️",
      title: "坑 ① 缓存穿透",
      en: "Cache Penetration",
      cause: "恶意疯狂查不存在的数据（如 id = -1），缓存和数据库全没有，每次直穿 DB！",
      cures: ["🧱 缓存空对象（短 TTL）", "🛡️ Bloom Filter 布隆过滤器提前拦截"],
    },
    {
      idx: 1,
      start: c2.from,
      col: C.amber,
      soft: C.amberSoft,
      icon: "🎯",
      title: "坑 ② 缓存击穿",
      en: "Cache Breakdown",
      cause: "某 1 个超级热点 Key 恰好过期瞬间，海量请求同时砸穿数据库！",
      cures: ["🔒 Mutex 互斥锁（放 1 个回源重建）", "♻️ 热点数据逻辑过期 · 后台异步刷新"],
    },
    {
      idx: 2,
      start: c3.from,
      col: C.indigo,
      soft: C.indigoSoft,
      icon: "🏔️",
      title: "坑 ③ 缓存雪崩",
      en: "Cache Avalanche",
      cause: "大批 Key 在同一秒集体过期，或 Redis 节点整体宕机，瞬间压垮后端！",
      cures: ["🎲 过期时间加随机 TTL 抖动打散", "🚦 集群高可用 + 接口限流降级兜底"],
    },
  ];

  return (
    <RedisStage theme="mint">
      <CanvasFXLayer
        mode="dataFlow"
        burstFrames={[c1.from, c2.from, c3.from]}
        accent={C.mint}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.mint} />

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
        <ExtrudedTitle
          text="面试必考 · 缓存三大经典大坑与解药!"
          size={54}
          color={C.ink}
          shadowColor={C.mintSoft}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, width: 1560 }}>
          {traps.map((t) => {
            const unlocked = activeIdx >= t.idx;
            const isCurrent = activeIdx === t.idx;
            const pop = spring({
              frame: Math.max(0, frame - t.start),
              fps,
              config: { damping: 11, stiffness: 195 },
            });
            return (
              <div
                key={t.title}
                style={{
                  background: "#ffffff",
                  border: `5px solid ${isCurrent ? t.col : unlocked ? "#94a3b8" : "#cbd5e1"}`,
                  borderRadius: 32,
                  padding: "24px 26px",
                  boxShadow: isCurrent ? `0 14px 0 ${t.col}` : "0 8px 0 rgba(28,32,48,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transform: `scale(${unlocked ? pop * (isCurrent ? 1.03 : 0.97) : 0.92})`,
                  opacity: unlocked ? (isCurrent ? 1 : 0.72) : 0.24,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: t.col }}>
                    {t.icon} {t.title}
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.sub, fontFamily: "monospace", marginTop: -8 }}>
                  {t.en}
                </div>

                <div
                  style={{
                    background: t.soft,
                    borderRadius: 18,
                    padding: "14px 16px",
                    fontSize: 21,
                    fontWeight: 700,
                    color: C.ink,
                    lineHeight: 1.45,
                    minHeight: 118,
                  }}
                >
                  {t.cause}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.mint }}>✅ 终极解药：</div>
                  {t.cures.map((cure) => (
                    <div
                      key={cure}
                      style={{
                        background: "#181d31",
                        color: "#ffffff",
                        borderRadius: 14,
                        padding: "10px 14px",
                        fontSize: 20,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cure}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SceneWipeIn color={C.mint} />
    </RedisStage>
  );
};

/** Act 6: Memory Eviction (TTL + maxmemory LRU/LFU) & High Availability Trio (Master-Replica / Sentinel / 16384 Cluster) */
export const ClusterHaScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const evictCue = getCue(scene.cues, "eviction", 14);
  const haCue = getCue(scene.cues, "sentinelCluster", 540);
  const showHA = frame >= haCue.from;

  return (
    <RedisStage theme="lavender">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[evictCue.from, haCue.from]}
        accent={C.lavender}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.lavender} />

      {!showHA ? (
        /* Cue 1: TTL Expiration + maxmemory Eviction */
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
            text="内存快满了怎么办？过期清理 + 智能淘汰!"
            size={54}
            color={C.indigo}
            shadowColor="#ffffff"
          />

          <div style={{ display: "flex", gap: 30, width: 1500 }}>
            <div
              style={{
                flex: 1,
                background: "#ffffff",
                border: `5px solid ${C.sky}`,
                borderRadius: 34,
                padding: "30px 34px",
                boxShadow: `0 14px 0 ${C.sky}`,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <CandyPill text="⏱️ 防线 ① TTL 过期删除" bg={C.sky} size={26} />
              <div style={{ fontSize: 25, fontWeight: 700, color: C.ink, lineHeight: 1.6 }}>
                • <span style={{ color: C.sky }}>惰性删除</span>：下次访问到才顺手删掉<br />
                • <span style={{ color: C.indigo }}>定期删除</span>：后台每隔一阵随机抽检清理<br />
                • 两者配合，省 CPU 又防内存长期泄漏！
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "#181d31",
                color: "#ffffff",
                border: `5px solid ${C.crimson}`,
                borderRadius: 34,
                padding: "30px 34px",
                boxShadow: `0 14px 0 ${C.crimson}`,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <CandyPill text="🧹 防线 ② maxmemory 内存淘汰" bg={C.crimson} size={26} />
              <div style={{ fontSize: 24, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.65 }}>
                • 触发条件：内存触及 <span style={{ color: C.amber }}>maxmemory</span> 上限<br />
                • <span style={{ color: C.cyan }}>allkeys-lru</span>：优先淘汰最久没用过的冷 Key<br />
                • <span style={{ color: C.mint }}>allkeys-lfu</span>：优先淘汰访问频次最少的 Key
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Cue 2: High Availability Trio: Master-Replica -> Sentinel -> Redis Cluster 16384 Hash Slots */
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
            text="高可用与水平扩容 · 经典三件套!"
            size={56}
            color={C.indigo}
            shadowColor="#ffffff"
            startFrame={haCue.from}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 1540 }}>
            {[
              {
                step: "① 主从复制",
                badge: "Master ➔ Replica",
                col: C.sky,
                lines: ["Master 主节点负责写", "Replica 从节点同步读", "读写分离 + 异机热备份"],
                delay: 0,
              },
              {
                step: "② Sentinel 哨兵",
                badge: "自动故障转移",
                col: C.amber,
                lines: ["实时监控主节点心跳", "主挂了自动投票选新主", "秒级切换，高可用不掉线"],
                delay: 14,
              },
              {
                step: "③ Redis Cluster",
                badge: "16384 个 Hash Slot",
                col: C.crimson,
                lines: ["数据按 16384 哈希槽分片", "多台主节点水平横向扩容", "彻底打破单机内存天花板"],
                delay: 28,
              },
            ].map((item, idx) => (
              <React.Fragment key={item.step}>
                <div
                  style={{
                    width: 465,
                    background: idx === 2 ? "#181d31" : "#ffffff",
                    color: idx === 2 ? "#ffffff" : C.ink,
                    border: `5px solid ${item.col}`,
                    borderRadius: 32,
                    padding: "26px 28px",
                    boxShadow: `0 14px 0 ${item.col}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    textAlign: "center",
                    transform: `scale(${spring({ frame: Math.max(0, frame - haCue.from - item.delay), fps, config: { damping: 10 } })})`,
                  }}
                >
                  <div style={{ fontSize: 32, fontWeight: 700, color: item.col }}>{item.step}</div>
                  <CandyPill
                    text={item.badge}
                    bg={item.col}
                    color={item.col === C.amber ? C.ink : "#ffffff"}
                    size={22}
                  />
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: idx === 2 ? "#e2e8f0" : C.ink,
                      lineHeight: 1.6,
                      marginTop: 4,
                    }}
                  >
                    {item.lines[0]}<br />
                    {item.lines[1]}<br />
                    {item.lines[2]}
                  </div>
                </div>
                {idx < 2 && (
                  <span style={{ fontSize: 40, fontWeight: 700, color: C.indigo }}>➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <SceneWipeIn color={C.lavender} />
    </RedisStage>
  );
};

/** Act 7: Full Redis Knowledge Panorama + Golden Mantra + Niuma & RedisCubeBot Off-Work Finale */
export const FinalePanoramaScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { beat } = usePulse();

  const quoteCue = getCue(scene.cues, "quote", 400);
  const signCue = getCue(scene.cues, "signoff", 660);
  const phase = frame >= signCue.from ? 2 : frame >= quoteCue.from ? 1 : 0;

  return (
    <RedisStage theme="cream">
      <CanvasFXLayer
        mode={phase >= 2 ? "confetti" : "sunburst"}
        burstFrames={[8, quoteCue.from, signCue.from]}
        accent={C.crimson}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.crimson} />

      {/* Phase 0: Bookmark-Worthy Redis Full Knowledge Blueprint */}
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
            🗺️ 一图收藏 · Redis 核心知识全景架构
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 1560 }}>
            <div
              style={{
                width: 390,
                background: C.skySoft,
                border: `4.5px solid ${C.sky}`,
                borderRadius: 28,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 27, fontWeight: 700, color: "#0369a1" }}>① 五大核心数据结构</div>
              <CandyPill text="📝 String / Hash 缓存对象" bg={C.sky} size={20} delay={6} />
              <CandyPill text="📦 List 队列 · Set 去除重复" bg={C.sky} size={20} delay={14} />
              <CandyPill text="🏆 ZSet Score 实时排行榜" bg={C.amber} color={C.ink} size={20} delay={22} />
            </div>

            <span style={{ fontSize: 38, fontWeight: 700, color: C.crimson }}>➔</span>

            <div
              style={{
                width: 500,
                background: C.redSoft,
                border: `5px solid ${C.crimson}`,
                borderRadius: 32,
                padding: "18px 24px",
                boxShadow: `0 12px 0 ${C.crimson}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                textAlign: "center",
              }}
            >
              <RedisCubeBot size={140} />
              <div style={{ fontSize: 29, fontWeight: 700, color: C.crimson }}>② Redis 极速引擎</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: C.ink }}>
                纯内存 · 单线程核心 · epoll · SDS/跳表
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.sub }}>
                RDB + AOF 混合持久化 · TTL + LRU/LFU
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
              <div style={{ fontSize: 27, fontWeight: 700, color: "#047857" }}>③ 线上三大防坑护盾</div>
              <CandyPill text="🛡️ 穿透：空值 / 布隆过滤" bg={C.mint} size={20} delay={36} />
              <CandyPill text="🔒 击穿：互斥锁 / 逻辑过期" bg={C.mint} size={20} delay={44} />
              <CandyPill text="🎲 雪崩：随机 TTL + 限流" bg={C.mint} size={20} delay={52} />
            </div>
          </div>

          {/* Bottom High Availability Strip */}
          <div
            style={{
              width: 1560,
              background: "#181d31",
              color: "#ffffff",
              border: `4px solid ${C.amber}`,
              borderRadius: 24,
              padding: "16px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 23,
              fontWeight: 700,
            }}
          >
            <span style={{ color: C.amber }}>🚀 高可用三件套：</span>
            <span>🔄 Master-Replica 主从复制</span>
            <span>🛡️ Sentinel 哨兵秒切</span>
            <span>🧩 Cluster 16384 哈希槽分片</span>
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
          <RedisCubeBot size={175} />
          <div
            style={{
              background: "#ffffff",
              border: `6px solid ${C.ink}`,
              borderRadius: 42,
              padding: "38px 56px",
              boxShadow: `0 18px 0 ${C.crimson}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              textAlign: "center",
              transform: `scale(${1 + beat * 0.018})`,
            }}
          >
            <CandyPill text="✨ Redis 终极记忆口诀 ✨" bg={C.crimson} size={28} />
            <div style={{ fontSize: 44, fontWeight: 700, color: C.ink, lineHeight: 1.5 }}>
              <span style={{ color: C.crimson }}>纯内存多结构</span>扛并发 ·{" "}
              <span style={{ color: C.sky }}>快照加日志</span>保不丢
              <br />
              <span style={{ color: C.mint }}>防穿防击防雪崩</span> ·{" "}
              <span style={{ color: C.indigo }}>哨兵分片稳如泰山！</span>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Niuma & RedisCubeBot Sign-Off */}
      {phase === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            marginBottom: 42,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 46 }}>
            <NiumaMascot size={265} mood="chill" prop="bag" jump={beat * 18} />
            <RedisCubeBot size={265} jump={beat * 18} />
          </div>
          <ExtrudedTitle
            text="接口响应 0.5ms，小牛马准点下班!"
            size={62}
            color={C.ink}
            shadowColor={C.amber}
            startFrame={signCue.from}
          />
          <div style={{ display: "flex", gap: 22 }}>
            <CandyPill text="⚡ 一集搞懂 Redis" bg={C.crimson} size={30} delay={signCue.from + 12} />
            <CandyPill text="⭐ 点赞收藏 · 随时复习" bg={C.mint} size={30} delay={signCue.from + 22} />
          </div>
        </div>
      )}

      <SceneWipeIn color={C.crimson} />
    </RedisStage>
  );
};
