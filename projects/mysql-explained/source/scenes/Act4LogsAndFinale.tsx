import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MysqlDolphinBot, NiumaMascot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, getCue, MysqlStage, SceneTopBar, SceneTiming, usePulse } from "../stage";

/** Act 7: Buffer Pool + WAL + Redo / Undo / Binlog Distinction + Two-Phase Commit (2PC) */
export const LogsBufferScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logsCue = getCue(scene.cues, "threeLogs", 540);
  const tpcCue = getCue(scene.cues, "twoPhaseCommit", 1160);

  const phase = frame >= tpcCue.from ? 2 : frame >= logsCue.from ? 1 : 0;

  return (
    <MysqlStage theme="lavender">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[14, logsCue.from, tpcCue.from]}
        accent={C.lavender}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.lavender} />

      {/* Phase 0: Buffer Pool + WAL (Fast Memory Update + Sequential Redo Log) */}
      {phase === 0 && (
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
          <ExtrudedTitle text="UPDATE 为什么又快又断电不丢？" size={54} color={C.indigo} shadowColor="#ffffff" />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 1520 }}>
            <div
              style={{
                width: 480,
                background: "#ffffff",
                border: `5px solid ${C.ocean}`,
                borderRadius: 32,
                padding: "26px 30px",
                boxShadow: `0 12px 0 ${C.ocean}`,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <CandyPill text="① Buffer Pool 内存缓冲池" bg={C.ocean} size={24} />
              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.55 }}>
                • 把热点 16KB 数据页缓存进内存<br />
                • 改数据先改内存页（标为脏页），毫秒返回<br />
                • 后台线程空闲时慢慢刷回磁盘！
              </div>
            </div>

            <span style={{ fontSize: 44, fontWeight: 700, color: C.indigo }}>+</span>

            <div
              style={{
                width: 520,
                background: "#182238",
                color: "#ffffff",
                border: `5px solid ${C.orange}`,
                borderRadius: 32,
                padding: "26px 30px",
                boxShadow: `0 12px 0 ${C.orange}`,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <CandyPill text="② WAL · 先顺序写 Redo Log" bg={C.orange} color={C.ink} size={24} />
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.55 }}>
                • 改完内存立刻往磁盘<span style={{ color: C.orange }}>顺序追加</span>一条极小日志<br />
                • 随机写磁盘变顺序写日志，速度暴涨！<br />
                • 就算立刻断电，重启按 Redo Log 重放零丢失！
              </div>
            </div>

            <span style={{ fontSize: 44, fontWeight: 700, color: C.mint }}>➔</span>

            <div
              style={{
                width: 340,
                background: C.mintSoft,
                border: `5px solid ${C.mint}`,
                borderRadius: 32,
                padding: "26px 24px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 52 }}>⚡🛡️</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#047857" }}>快稳双赢！</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: C.ink }}>内存级写入速度<br />+ 崩溃零丢失</div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 1: Redo Log vs Undo Log vs Binlog Crystal-Clear Trio */}
      {phase === 1 && (
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
            text="一屏彻底分清 MySQL 三大核心日志!"
            size={54}
            color={C.indigo}
            shadowColor="#ffffff"
            startFrame={logsCue.from}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, width: 1540 }}>
            {[
              {
                t: "1. Redo Log",
                sub: "重做日志 · InnoDB 引擎层",
                col: C.orange,
                role: "🛡️ 保崩溃恢复与持久性（D）",
                lines: ["记录数据页做了什么物理修改", "固定空间循环覆盖写入", "断电重启靠它找回未刷盘脏页"],
                d: 0,
              },
              {
                t: "2. Undo Log",
                sub: "回滚日志 · InnoDB 引擎层",
                col: C.rose,
                role: "⏪ 保原子性（A）+ 支撑 MVCC",
                lines: ["记录修改之前的逻辑旧值", "事务失败时靠它一键回滚原样", "串成历史版本链给 MVCC 快照读"],
                d: 14,
              },
              {
                t: "3. Binlog",
                sub: "归档日志 · Server 层（通用）",
                col: C.ocean,
                role: "🔄 主从复制 + 误删表恢复",
                lines: ["所有存储引擎通用，只追加不覆盖", "同步给从库实现读写分离高可用", "误删表后可按时间点救回数据！"],
                d: 28,
              },
            ].map((item) => (
              <div
                key={item.t}
                style={{
                  background: "#ffffff",
                  border: `5px solid ${item.col}`,
                  borderRadius: 30,
                  padding: "24px 26px",
                  boxShadow: `0 12px 0 ${item.col}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  transform: `scale(${spring({ frame: Math.max(0, frame - logsCue.from - item.d), fps, config: { damping: 11 } })})`,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 700, color: item.col }}>{item.t}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.sub, marginTop: -6 }}>{item.sub}</div>
                <div
                  style={{
                    background: "#182238",
                    color: "#ffffff",
                    borderRadius: 14,
                    padding: "10px 14px",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {item.role}
                </div>
                <div style={{ fontSize: 21, fontWeight: 700, color: C.ink, lineHeight: 1.6 }}>
                  • {item.lines[0]}<br />
                  • {item.lines[1]}<br />
                  • {item.lines[2]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: Two-Phase Commit (2PC) keeping Redo Log & Binlog 100% consistent */}
      {phase === 2 && (
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
            text="两阶段提交（2PC）：主从与崩溃绝不分裂!"
            size={50}
            color={C.indigo}
            shadowColor="#ffffff"
            startFrame={tpcCue.from}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 1520 }}>
            {[
              { step: "第 1 步 · Prepare", desc: "改完 Buffer Pool 后\nRedo Log 先写入并标为 Prepare", col: C.orange },
              { step: "第 2 步 · 写 Binlog", desc: "Server 层生成 Binlog\n并稳稳刷入磁盘留档", col: C.ocean },
              { step: "第 3 步 · Commit", desc: "InnoDB 把 Redo Log\n正式改为 Commit 完成提交！", col: C.mint },
            ].map((s, idx) => (
              <React.Fragment key={s.step}>
                <div
                  style={{
                    width: 440,
                    background: "#182238",
                    color: "#ffffff",
                    border: `5px solid ${s.col}`,
                    borderRadius: 30,
                    padding: "28px 28px",
                    boxShadow: `0 14px 0 ${s.col}`,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    transform: `scale(${spring({ frame: Math.max(0, frame - tpcCue.from - idx * 16), fps, config: { damping: 10 } })})`,
                  }}
                >
                  <CandyPill text={s.step} bg={s.col} color={s.col === C.orange ? C.ink : "#ffffff"} size={24} />
                  <div style={{ fontSize: 23, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {s.desc}
                  </div>
                </div>
                {idx < 2 && <span style={{ fontSize: 42, fontWeight: 700, color: C.indigo }}>➔</span>}
              </React.Fragment>
            ))}
          </div>

          <CandyPill
            text="✅ 哪怕中途任意一步断电，重启核对两份日志，主库与从库永远严丝合缝！"
            bg={C.mint}
            size={24}
          />
        </div>
      )}

      <SceneWipeIn color={C.lavender} />
    </MysqlStage>
  );
};

/** Act 8: Full MySQL Architecture Blueprint + Engineering Checklist + Niuma & DolphinBot Sign-Off */
export const FinalePanoramaScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { beat } = usePulse();

  const quoteCue = getCue(scene.cues, "quote", 560);
  const signCue = getCue(scene.cues, "signoff", 860);
  const phase = frame >= signCue.from ? 2 : frame >= quoteCue.from ? 1 : 0;

  return (
    <MysqlStage theme="cream">
      <CanvasFXLayer
        mode={phase >= 2 ? "confetti" : "sunburst"}
        burstFrames={[8, quoteCue.from, signCue.from]}
        accent={C.ocean}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.ocean} />

      {/* Phase 0: Bookmark-Worthy MySQL Full Architecture Blueprint */}
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
            🗺️ 一图收藏 · MySQL 8.0 底层核心全景架构
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 1560 }}>
            <div
              style={{
                width: 390,
                background: C.oceanSoft,
                border: `4.5px solid ${C.ocean}`,
                borderRadius: 28,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 27, fontWeight: 700, color: C.teal }}>① Server 层（大脑）</div>
              <CandyPill text="🔌 连接池 · 词法语法解析" bg={C.ocean} size={20} delay={6} />
              <CandyPill text="🧭 优化器选索引（EXPLAIN）" bg={C.ocean} size={20} delay={14} />
              <CandyPill text="📜 Binlog 主从复制与恢复" bg={C.orange} color={C.ink} size={20} delay={22} />
            </div>

            <span style={{ fontSize: 38, fontWeight: 700, color: C.ocean }}>➔</span>

            <div
              style={{
                width: 500,
                background: C.orangeSoft,
                border: `5px solid ${C.orange}`,
                borderRadius: 32,
                padding: "18px 24px",
                boxShadow: `0 12px 0 ${C.orange}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                textAlign: "center",
              }}
            >
              <MysqlDolphinBot size={140} />
              <div style={{ fontSize: 29, fontWeight: 700, color: C.teal }}>② InnoDB 主力引擎</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: C.ink }}>
                3 层 B+Tree 索引 · 聚簇 / 覆盖索引
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.sub }}>
                Buffer Pool + WAL · Redo / Undo + 2PC
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
              <div style={{ fontSize: 27, fontWeight: 700, color: "#047857" }}>③ 并发与事务守护</div>
              <CandyPill text="🛡️ ACID（默认可重复读）" bg={C.mint} size={20} delay={36} />
              <CandyPill text="📸 MVCC 版本链 + Read View" bg={C.mint} size={20} delay={44} />
              <CandyPill text="🔐 行锁 · 间隙锁 · 临键锁" bg={C.rose} size={20} delay={52} />
            </div>
          </div>

          {/* Bottom Production Pitfall Strip */}
          <div
            style={{
              width: 1560,
              background: "#182238",
              color: "#ffffff",
              border: `4px solid ${C.cyan}`,
              borderRadius: 24,
              padding: "16px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            <span style={{ color: C.orange }}>⚡ 线上避坑铁律：</span>
            <span>🔍 守最左前缀少回表</span>
            <span>🚨 UPDATE 必走索引防锁表</span>
            <span>🔄 固定顺序加锁 + 短事务防死锁</span>
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
          <MysqlDolphinBot size={175} />
          <div
            style={{
              background: "#ffffff",
              border: `6px solid ${C.ink}`,
              borderRadius: 42,
              padding: "38px 54px",
              boxShadow: `0 18px 0 ${C.ocean}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              textAlign: "center",
              transform: `scale(${1 + beat * 0.018})`,
            }}
          >
            <CandyPill text="✨ MySQL 线上防身口诀 ✨" bg={C.ocean} size={28} />
            <div style={{ fontSize: 40, fontWeight: 700, color: C.ink, lineHeight: 1.55 }}>
              <span style={{ color: C.ocean }}>查询看计划</span>守最左前缀 ·{" "}
              <span style={{ color: C.rose }}>更新必走索引</span>防锁整表
              <br />
              <span style={{ color: C.mint }}>读写靠 MVCC</span> / 写写靠行锁 ·{" "}
              <span style={{ color: C.indigo }}>短事务顺序加锁远死锁！</span>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Niuma & MysqlDolphinBot Celebration Sign-Off */}
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
            <MysqlDolphinBot size={265} jump={beat * 18} />
          </div>
          <ExtrudedTitle
            text="零慢查、零死锁，小牛马准点下班!"
            size={60}
            color={C.ink}
            shadowColor={C.orange}
            startFrame={signCue.from}
          />
          <div style={{ display: "flex", gap: 22 }}>
            <CandyPill text="🐬 一集搞懂 MySQL" bg={C.ocean} size={30} delay={signCue.from + 12} />
            <CandyPill text="⭐ 点赞收藏 · 随时复盘" bg={C.mint} size={30} delay={signCue.from + 22} />
          </div>
        </div>
      )}

      <SceneWipeIn color={C.ocean} />
    </MysqlStage>
  );
};
