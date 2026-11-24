import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NiumaMascot, RedisCubeBot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, getCue, RedisStage, SceneTopBar, SceneTiming } from "../stage";

/** Act 1: MySQL Disk Overload -> Redis Sub-ms In-Memory Rescue + Multi-Scenario Superpowers */
export const OpeningScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cacheCue = getCue(scene.cues, "cachePower", 380);
  const multiCue = getCue(scene.cues, "multiUse", 780);
  const phase = frame >= multiCue.from ? 2 : frame >= cacheCue.from ? 1 : 0;

  return (
    <RedisStage theme="night" shake={phase === 0 && frame < 110 ? 5 : 0}>
      <CanvasFXLayer
        mode="memorySparks"
        burstFrames={[14, cacheCue.from, multiCue.from]}
        accent={C.crimson}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.crimson} dark />

      {/* Phase 0: Traffic hammers MySQL disk directly */}
      {phase === 0 && (
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
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <CandyPill text="🔥 热点查询直打磁盘 · CPU 100%!" bg={C.crimson} size={30} />
            <ExtrudedTitle text="一集彻底搞懂 Redis!" size={66} color="#ffffff" shadowColor={C.crimson} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: 1440 }}>
            <div
              style={{
                width: 410,
                background: "rgba(225,29,72,0.16)",
                border: `4px dashed ${C.crimson}`,
                borderRadius: 30,
                padding: 26,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 700, color: "#fda4af" }}>🌊 海量并发查询</div>
              {["🛍️ 热门商品详情", "🔥 实时热搜排行", "👤 登录态高频校验"].map((txt, i) => (
                <div
                  key={txt}
                  style={{
                    width: "100%",
                    background: C.crimson,
                    borderRadius: 16,
                    padding: "11px 18px",
                    fontSize: 23,
                    fontWeight: 700,
                    color: "#ffffff",
                    textAlign: "center",
                    transform: `translateX(${Math.sin(frame * 0.35 + i) * 7}px)`,
                  }}
                >
                  {txt}
                </div>
              ))}
            </div>

            <div style={{ fontSize: 54, color: C.crimson, fontWeight: 700 }}>💥➔</div>

            <div
              style={{
                width: 390,
                background: C.darkCard,
                border: `5px solid ${C.crimson}`,
                borderRadius: 34,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 0 40px rgba(225,29,72,0.4)",
              }}
            >
              <div style={{ fontSize: 64 }}>🗄️⏳</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#ffffff" }}>MySQL 磁盘库</div>
              <CandyPill text="磁盘 I/O 飙满 · 50ms+ 卡死!" bg={C.crimson} size={22} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <NiumaMascot size={225} mood="panic" prop="coffee" />
              <CandyPill text="快请 Redis 救场!" bg={C.amber} color={C.ink} size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Phase 1: Redis sub-millisecond in-memory shield */}
      {phase === 1 && (
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
          <CandyPill text="⚡ 内存缓存救星：0.5ms 极速响应 · 单机 10 万+ QPS!" bg={C.crimson} size={32} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 1520 }}>
            <div
              style={{
                width: 320,
                background: C.darkCard,
                border: `4px solid ${C.cyan}`,
                borderRadius: 28,
                padding: 26,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 52 }}>📱</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#ffffff" }}>10 万 QPS 请求</div>
              <CandyPill text="高频读取热点" bg={C.cyan} color={C.ink} size={21} />
            </div>

            <div style={{ fontSize: 48, color: C.amber, fontWeight: 700 }}>➔</div>

            <div
              style={{
                width: 500,
                background: "rgba(220,38,38,0.18)",
                border: `5px solid ${C.crimson}`,
                borderRadius: 34,
                padding: "24px 30px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 0 46px rgba(225,29,72,0.42)",
                transform: `scale(${spring({ frame: Math.max(0, frame - cacheCue.from), fps, config: { damping: 11 } })})`,
              }}
            >
              <RedisCubeBot size={165} />
              <div style={{ fontSize: 32, fontWeight: 700, color: "#ffffff" }}>Redis 内存缓存</div>
              <CandyPill text="拦下 95% 流量 · 亚毫秒直出 ✓" bg={C.mint} size={22} />
            </div>

            <div style={{ fontSize: 44, color: C.mint, fontWeight: 700 }}>➔</div>

            <div
              style={{
                width: 340,
                background: C.darkCard,
                border: `4px solid ${C.mint}`,
                borderRadius: 28,
                padding: 26,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 52 }}>🗄️😌</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#ffffff" }}>MySQL 数据库</div>
              <CandyPill text="仅剩 5% 回源 · 稳如老狗" bg={C.mint} size={20} />
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Beyond caching — Swiss army knife scenarios */}
      {phase === 2 && (
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
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <RedisCubeBot size={150} />
            <ExtrudedTitle text="不止是缓存 · 高并发全能神器!" size={58} color="#ffffff" shadowColor={C.amber} startFrame={multiCue.from} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20, width: 1540 }}>
            {[
              { icon: "⚡", title: "热点缓存", sub: "扛住十万级读", col: C.crimson },
              { icon: "🔒", title: "分布式锁", sub: "防超卖防并发", col: C.amber },
              { icon: "🏆", title: "实时排行榜", sub: "热搜与战力榜", col: C.cyan },
              { icon: "🚦", title: "接口限流", sub: "防刷保护后端", col: C.mint },
              { icon: "🎫", title: "会话共享", sub: "集群统一登录", col: C.lavender },
            ].map((item, idx) => (
              <div
                key={item.title}
                style={{
                  background: C.darkCard,
                  border: `4px solid ${item.col}`,
                  borderRadius: 28,
                  padding: "26px 18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "center",
                  boxShadow: `0 0 28px ${item.col}33`,
                  transform: `scale(${spring({ frame: Math.max(0, frame - multiCue.from - idx * 8), fps, config: { damping: 10 } })})`,
                }}
              >
                <div style={{ fontSize: 54 }}>{item.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: item.col, whiteSpace: "nowrap" }}>{item.title}</div>
                <div style={{ fontSize: 21, fontWeight: 700, color: "#cbd5e1", whiteSpace: "nowrap" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SceneWipeIn color={C.crimson} />
    </RedisStage>
  );
};

/** Act 2: Five Core Redis Data Structures — String, Hash, List, Set, Sorted Set (ZSet) */
export const DataTypesScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c1 = getCue(scene.cues, "stringHash", 14);
  const c2 = getCue(scene.cues, "listSet", 500);
  const c3 = getCue(scene.cues, "zset", 960);

  const stage = frame >= c3.from ? 2 : frame >= c2.from ? 1 : 0;

  const cards = [
    {
      name: "1. String",
      cn: "字符串",
      col: C.red,
      soft: C.redSoft,
      use: "缓存 · 分布式锁 · INCR 计数",
      demo: "INCR views ➔ 102,488",
      unlockAt: c1.from,
      active: stage === 0,
    },
    {
      name: "2. Hash",
      cn: "哈希表",
      col: C.sky,
      soft: C.skySoft,
      use: "用户信息 · 购物车局部改字段",
      demo: "user:1 { vip:1, cart:3 }",
      unlockAt: c1.from + Math.round(c1.duration * 0.45),
      active: stage === 0,
    },
    {
      name: "3. List",
      cn: "双向列表",
      col: C.indigo,
      soft: C.indigoSoft,
      use: "最新消息流 · 轻量任务队列",
      demo: "[新] ➔ [msg2] ➔ [msg1]",
      unlockAt: c2.from,
      active: stage === 1,
    },
    {
      name: "4. Set",
      cn: "无序集合",
      col: C.mint,
      soft: C.mintSoft,
      use: "防重复点赞 · 抽奖 · 共同好友",
      demo: "{A,B,C} ∩ {B,C,D} = {B,C}",
      unlockAt: c2.from + Math.round(c2.duration * 0.42),
      active: stage === 1,
    },
  ];

  const zsetUnlocked = stage >= 2;
  const zsetPop = spring({
    frame: Math.max(0, frame - c3.from),
    fps,
    config: { damping: 10, stiffness: 190 },
  });

  return (
    <RedisStage theme="sky">
      <CanvasFXLayer
        mode="dataFlow"
        burstFrames={[c1.from, c2.from, c3.from]}
        accent={C.sky}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.sky} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          marginBottom: 42,
          width: 1580,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, width: 1540 }}>
          {cards.map((card) => {
            const unlocked = frame >= card.unlockAt;
            const pop = spring({
              frame: Math.max(0, frame - card.unlockAt),
              fps,
              config: { damping: 11, stiffness: 200 },
            });
            return (
              <div
                key={card.name}
                style={{
                  background: "#ffffff",
                  border: `4.5px solid ${card.active ? card.col : "#cbd5e1"}`,
                  borderRadius: 28,
                  padding: "20px 28px",
                  boxShadow: card.active ? `0 10px 0 ${card.col}` : "0 6px 0 rgba(28,32,48,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  transform: `scale(${unlocked ? pop * (card.active ? 1.02 : 0.98) : 0.92})`,
                  opacity: unlocked ? (card.active ? 1 : 0.78) : 0.22,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 31, fontWeight: 700, color: card.col }}>
                    {card.name}（{card.cn}）
                  </span>
                  <span
                    style={{
                      background: card.soft,
                      color: card.col,
                      fontSize: 20,
                      fontWeight: 700,
                      padding: "4px 14px",
                      borderRadius: 999,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {card.use}
                  </span>
                </div>
                <div
                  style={{
                    background: "#181d31",
                    color: "#ffffff",
                    borderRadius: 14,
                    padding: "10px 18px",
                    fontSize: 22,
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  {card.demo}
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlighted 5th Card: Sorted Set (ZSet) Leaderboard Star */}
        <div
          style={{
            width: 1540,
            background: zsetUnlocked ? "#181d31" : "#ffffff",
            color: zsetUnlocked ? "#ffffff" : C.ink,
            border: `5px solid ${zsetUnlocked ? C.amber : "#cbd5e1"}`,
            borderRadius: 30,
            padding: "22px 32px",
            boxShadow: zsetUnlocked ? `0 12px 0 ${C.amber}` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `scale(${zsetUnlocked ? zsetPop * 1.02 : 0.94})`,
            opacity: zsetUnlocked ? 1 : 0.25,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 33, fontWeight: 700, color: C.amber }}>
              🏆 5. Sorted Set（ZSet 有序集合 · 排行榜王者）
            </div>
            <div style={{ fontSize: 23, fontWeight: 700, color: zsetUnlocked ? "#e2e8f0" : C.sub }}>
              每个元素绑定 Score 分数自动实时排序 · 热搜榜与游戏战力榜秒查前十！
            </div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <CandyPill text="🥇 小牛马 9980" bg={C.amber} color={C.ink} size={22} delay={c3.from + 12} />
            <CandyPill text="🥈 架构师 9420" bg={C.cyan} color={C.ink} size={22} delay={c3.from + 20} />
            <CandyPill text="🥉 程序员 8910" bg={C.lavender} size={22} delay={c3.from + 28} />
          </div>
        </div>
      </div>

      <SceneWipeIn color={C.sky} />
    </RedisStage>
  );
};
