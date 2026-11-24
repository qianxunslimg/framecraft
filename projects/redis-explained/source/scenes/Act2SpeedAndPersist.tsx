import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NiumaMascot, RedisCubeBot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, getCue, RedisStage, SceneTopBar, SceneTiming } from "../stage";

/** Act 3: Why Redis Is Blazing Fast — 4 Hardcore Engineering Secrets (incl. Redis 6.0+ I/O Threading nuance) */
export const WhyFastScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c1 = getCue(scene.cues, "inMemory", 14);
  const c2 = getCue(scene.cues, "singleThread", 350);
  const c3 = getCue(scene.cues, "epoll", 780);
  const c4 = getCue(scene.cues, "dataStruct", 1120);

  const activeIdx =
    frame >= c4.from ? 3 : frame >= c3.from ? 2 : frame >= c2.from ? 1 : 0;

  const secrets = [
    {
      idx: 0,
      start: c1.from,
      title: "① 纯内存读写（In-Memory）",
      sub: "数据驻留 RAM 内存条 · 彻底避开磁盘随机寻道",
      visual: "⚡ RAM 直接读写 ➔ 纳秒 / 亚毫秒级响应",
      color: C.crimson,
    },
    {
      idx: 1,
      start: c2.from,
      title: "② 核心单线程执行（无锁竞争）",
      sub: "无切换与加锁内耗（6.0+ 网络 I/O 多线程，命令仍单线程！）",
      visual: "🧵 网络 I/O 可多线程 ➔ 核心命令单线程顺序稳跑",
      color: C.amber,
    },
    {
      idx: 2,
      start: c3.from,
      title: "③ I/O 多路复用（epoll）",
      sub: "单个事件循环高效盯住成千上万个客户端连接",
      visual: "📡 1 个 epoll 循环 ➔ 并发服务 10,000+ 连接",
      color: C.cyan,
    },
    {
      idx: 3,
      start: c4.from,
      title: "④ 极致底层数据结构",
      sub: "SDS 动态字符串 · 哈希表 · SkipList 跳表",
      visual: "🧩 省内存 + O(1) / O(log N) 极速检索",
      color: C.mint,
    },
  ];

  return (
    <RedisStage theme="arcade">
      <CanvasFXLayer
        mode="speedGrid"
        burstFrames={[c1.from, c2.from, c3.from, c4.from]}
        accent={C.crimson}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.crimson} dark />

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
          <RedisCubeBot size={135} />
          <ExtrudedTitle
            text="单机十万 QPS · 四大极速黑科技!"
            size={58}
            color="#ffffff"
            shadowColor={C.crimson}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, width: 1560 }}>
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
                  background: unlocked ? C.darkCard : "rgba(27,29,48,0.48)",
                  border: `4.5px solid ${isCurrent ? s.color : unlocked ? "#475569" : "#28304a"}`,
                  borderRadius: 30,
                  padding: "22px 28px",
                  boxShadow: isCurrent ? `0 0 38px ${s.color}66` : "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                  transform: `scale(${unlocked ? pop * (isCurrent ? 1.025 : 0.98) : 0.92})`,
                  opacity: unlocked ? (isCurrent ? 1 : 0.78) : 0.24,
                }}
              >
                <div style={{ fontSize: 31, fontWeight: 700, color: s.color }}>{s.title}</div>
                <div style={{ fontSize: 21, fontWeight: 700, color: "#e2e8f0" }}>{s.sub}</div>
                <div
                  style={{
                    background: "rgba(15,23,42,0.88)",
                    border: `2.5px solid ${s.color}`,
                    borderRadius: 16,
                    padding: "11px 18px",
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

      <SceneWipeIn color={C.crimson} />
    </RedisStage>
  );
};

/** Act 4: Persistence — RDB Snapshot vs AOF Append Log + Redis 4.0+ Hybrid Persistence */
export const PersistenceScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rdbCue = getCue(scene.cues, "rdb", 14);
  const aofCue = getCue(scene.cues, "aof", 480);
  const hybCue = getCue(scene.cues, "hybrid", 940);

  const showAof = frame >= aofCue.from;
  const showHybrid = frame >= hybCue.from;

  return (
    <RedisStage theme="amber">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[rdbCue.from, aofCue.from, hybCue.from]}
        accent={C.amber}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.amber} />

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
        <div style={{ display: "flex", alignItems: "center", gap: 26, width: 1540 }}>
          {/* Card 1: RDB Snapshot */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              border: `5px solid ${!showAof ? C.sky : C.sky}`,
              borderRadius: 32,
              padding: "24px 30px",
              boxShadow: !showAof && !showHybrid ? `0 12px 0 ${C.sky}` : "0 8px 0 rgba(28,32,48,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              transform: `scale(${spring({ frame: Math.max(0, frame - rdbCue.from), fps, config: { damping: 11 } }) * (!showAof ? 1.02 : 0.98)})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 33, fontWeight: 700, color: C.sky }}>📸 RDB 内存快照</span>
              <CandyPill text="dump.rdb" bg={C.sky} size={20} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.5 }}>
              • 定时 <span style={{ color: C.indigo }}>fork 子进程</span> 把内存打成压缩二进制文件<br />
              • <span style={{ color: C.mint }}>优点：</span>文件小、宕机重启恢复速度极快<br />
              • <span style={{ color: C.crimson }}>缺点：</span>可能丢失最后一次快照后的几分钟数据
            </div>
          </div>

          {/* Card 2: AOF Append-Only File */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              border: `5px solid ${showAof ? C.mint : "#cbd5e1"}`,
              borderRadius: 32,
              padding: "24px 30px",
              boxShadow: showAof && !showHybrid ? `0 12px 0 ${C.mint}` : "0 8px 0 rgba(28,32,48,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              opacity: showAof ? 1 : 0.32,
              transform: `scale(${showAof ? spring({ frame: Math.max(0, frame - aofCue.from), fps, config: { damping: 11 } }) * (!showHybrid ? 1.02 : 0.98) : 0.94})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 33, fontWeight: 700, color: C.mint }}>📝 AOF 追加日志</span>
              <CandyPill text="appendonly.aof" bg={C.mint} size={20} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.5 }}>
              • 把每条写命令按顺序追加进磁盘日志文件<br />
              • <span style={{ color: C.mint }}>优点：</span>默认 <span style={{ color: C.indigo }}>everysec</span> 每秒刷盘，最多丢 1 秒<br />
              • <span style={{ color: C.amber }}>瘦身：</span>文件过大时自动触发 AOF Rewrite 重写
            </div>
          </div>
        </div>

        {/* Bottom Star Banner: Redis 4.0+ Hybrid Persistence */}
        <div
          style={{
            width: 1540,
            background: "#181d31",
            color: "#ffffff",
            border: `5px solid ${showHybrid ? C.amber : "#475569"}`,
            borderRadius: 32,
            padding: "24px 34px",
            boxShadow: showHybrid ? `0 14px 0 ${C.amber}` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: showHybrid ? 1 : 0.25,
            transform: `scale(${showHybrid ? spring({ frame: Math.max(0, frame - hybCue.from), fps, config: { damping: 10 } }) * 1.02 : 0.94})`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <CandyPill text="👑 生产最佳实践 · Redis 4.0+ 混合持久化" bg={C.amber} color={C.ink} size={24} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 23, fontWeight: 700, marginTop: 4 }}>
              <span style={{ background: C.sky, padding: "8px 18px", borderRadius: 14, whiteSpace: "nowrap" }}>
                📦 前半段：RDB 全量快照（秒级加载）
              </span>
              <span style={{ color: C.amber, fontSize: 28 }}>+</span>
              <span style={{ background: C.mint, padding: "8px 18px", borderRadius: 14, whiteSpace: "nowrap" }}>
                📝 后半段：AOF 增量写命令（最多丢 1 秒）
              </span>
            </div>
          </div>
          <NiumaMascot size={145} mood={showHybrid ? "wow" : "happy"} />
        </div>
      </div>

      <SceneWipeIn color={C.amber} />
    </RedisStage>
  );
};
