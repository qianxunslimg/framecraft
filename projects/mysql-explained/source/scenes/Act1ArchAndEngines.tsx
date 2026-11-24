import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MysqlDolphinBot, NiumaMascot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, getCue, MysqlStage, SceneTopBar, SceneTiming } from "../stage";

/** Act 1: Popular-Science Intro — What is MySQL, Why Not Excel/Files, and Real-World App Scenarios */
export const IntroOverviewScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const excelCue = getCue(scene.cues, "whyNotExcel", 420);
  const scenCue = getCue(scene.cues, "realScenarios", 1040);
  const phase = frame >= scenCue.from ? 2 : frame >= excelCue.from ? 1 : 0;

  return (
    <MysqlStage theme="sky">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[14, excelCue.from, scenCue.from]}
        accent={C.ocean}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.ocean} />

      {/* Phase 0: Everyday Apps -> MySQL "Super Electronic Ledger" */}
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
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <CandyPill text="🐬 一集彻底搞懂" bg={C.orange} color={C.ink} size={30} />
            <ExtrudedTitle text="MySQL 到底是干啥的？" size={64} color={C.ink} shadowColor="#ffffff" />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: 1500 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: 470 }}>
              {[
                { icon: "🥡", label: "点外卖下单" },
                { icon: "💸", label: "微信好友转账" },
                { icon: "🛒", label: "逛电商查订单" },
                { icon: "🎮", label: "打游戏存装备" },
              ].map((app, i) => (
                <div
                  key={app.label}
                  style={{
                    background: "#ffffff",
                    border: `4px solid ${C.ocean}`,
                    borderRadius: 24,
                    padding: "18px 16px",
                    textAlign: "center",
                    boxShadow: `0 8px 0 ${C.ocean}33`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    transform: `scale(${spring({ frame: Math.max(0, frame - i * 8), fps, config: { damping: 10 } })})`,
                  }}
                >
                  <div style={{ fontSize: 42 }}>{app.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, whiteSpace: "nowrap" }}>{app.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 48, fontWeight: 700, color: C.ocean }}>➔</div>

            <div
              style={{
                width: 540,
                background: "#182238",
                color: "#ffffff",
                border: `5px solid ${C.orange}`,
                borderRadius: 36,
                padding: "24px 30px",
                boxShadow: `0 16px 0 ${C.orange}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                textAlign: "center",
              }}
            >
              <MysqlDolphinBot size={160} />
              <div style={{ fontSize: 34, fontWeight: 700, color: C.cyan }}>MySQL 关系型数据库</div>
              <CandyPill text="全球最流行 · 永不掉线的超级电子账本！" bg={C.orange} color={C.ink} size={21} />
            </div>

            <NiumaMascot size={210} mood="wow" prop="coffee" />
          </div>
        </div>
      )}

      {/* Phase 1: Why Not Just Use Excel or Local Files? */}
      {phase === 1 && (
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
            text="都是存表格 · 为什么不用 Excel 或本地文件？"
            size={50}
            color={C.ink}
            shadowColor="#ffffff"
            startFrame={excelCue.from}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, width: 1540 }}>
            {[
              {
                title: "① 高并发读写不撞车",
                bad: "❌ 文件：几千人同时改直接撞车损坏",
                good: "✅ MySQL：成千上万并发读写井然有序",
                col: C.ocean,
                d: 0,
              },
              {
                title: "② 千万数据毫秒秒查",
                bad: "❌ Excel：几十万条记录就卡死转圈",
                good: "✅ MySQL：靠索引千万条照样毫秒秒查",
                col: C.orange,
                d: 14,
              },
              {
                title: "③ 关系严谨 + 绝不错账",
                bad: "❌ 普通文件：断电或报错数据易残缺",
                good: "✅ MySQL：严谨关联 + 事务绝不丢钱",
                col: C.mint,
                d: 28,
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#ffffff",
                  border: `5px solid ${card.col}`,
                  borderRadius: 30,
                  padding: "24px 26px",
                  boxShadow: `0 12px 0 ${card.col}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transform: `scale(${spring({ frame: Math.max(0, frame - excelCue.from - card.d), fps, config: { damping: 11 } })})`,
                }}
              >
                <div style={{ fontSize: 29, fontWeight: 700, color: card.col }}>{card.title}</div>
                <div
                  style={{
                    background: C.roseSoft,
                    borderRadius: 16,
                    padding: "12px 16px",
                    fontSize: 21,
                    fontWeight: 700,
                    color: C.rose,
                    lineHeight: 1.45,
                  }}
                >
                  {card.bad}
                </div>
                <div
                  style={{
                    background: "#182238",
                    borderRadius: 16,
                    padding: "12px 16px",
                    fontSize: 21,
                    fontWeight: 700,
                    color: "#6ee7b7",
                    lineHeight: 1.45,
                  }}
                >
                  {card.good}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: Real-World Architecture Position & 4 Classic Scenarios */}
      {phase === 2 && (
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
          {/* Architecture Chain Strip */}
          <div
            style={{
              width: 1540,
              background: "#182238",
              color: "#ffffff",
              border: `4.5px solid ${C.ocean}`,
              borderRadius: 28,
              padding: "18px 34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            <span>📱 手机 App / 网页</span>
            <span style={{ color: C.orange }}>➔</span>
            <span>🖥️ 业务后端程序</span>
            <span style={{ color: C.orange }}>➔ SQL ➔</span>
            <CandyPill text="🐬 MySQL（核心数据大本营）" bg={C.ocean} size={25} />
          </div>

          {/* 4 Classic Core Scenarios */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22, width: 1540 }}>
            {[
              { icon: "🛒", title: "电商订单与库存", sub: "下单、扣库存、查物流", col: C.ocean },
              { icon: "💳", title: "支付与金融账务", sub: "转账、余额、流水对账", col: C.orange },
              { icon: "👤", title: "用户账号与权限", sub: "注册、资料、角色管理", col: C.mint },
              { icon: "🏢", title: "企业财务与后台", sub: "进销存、报表、核心台账", col: C.indigo },
            ].map((s, idx) => (
              <div
                key={s.title}
                style={{
                  background: "#ffffff",
                  border: `4.5px solid ${s.col}`,
                  borderRadius: 28,
                  padding: "26px 20px",
                  boxShadow: `0 12px 0 ${s.col}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "center",
                  transform: `scale(${spring({ frame: Math.max(0, frame - scenCue.from - idx * 10), fps, config: { damping: 10 } })})`,
                }}
              >
                <div style={{ fontSize: 52 }}>{s.icon}</div>
                <div style={{ fontSize: 27, fontWeight: 700, color: s.col, whiteSpace: "nowrap" }}>{s.title}</div>
                <div style={{ fontSize: 21, fontWeight: 700, color: C.sub, whiteSpace: "nowrap" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <CandyPill text="👇 接下来直接钻进 MySQL 内部：架构 · 引擎 · 索引 · 事务 · MVCC · 锁 · 三大日志！" bg="#182238" size={23} />
        </div>
      )}

      <SceneWipeIn color={C.ocean} />
    </MysqlStage>
  );
};

/** Act 2: Anatomy of an SQL Query — Server Layer (4 Stages) vs Storage Engine Layer + MySQL 8.0 Note */
export const ArchitectureScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepsCue = getCue(scene.cues, "fourSteps", 340);
  const noQcCue = getCue(scene.cues, "noQueryCache", 860);
  const phase = frame >= stepsCue.from ? 1 : 0;
  const showNoQc = frame >= noQcCue.from;

  return (
    <MysqlStage theme="night">
      <CanvasFXLayer
        mode="dataStreams"
        burstFrames={[14, stepsCue.from, noQcCue.from]}
        accent={C.ocean}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.ocean} dark />

      {phase === 0 ? (
        /* Cue 1: 2-Layer Overview — Server Layer vs Pluggable Storage Engine Layer */
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
            <CandyPill text="🐬 MySQL 8.0 底层解剖" bg={C.orange} color={C.ink} size={28} />
            <ExtrudedTitle text="一条 SQL 的内部旅程!" size={64} color="#ffffff" shadowColor={C.ocean} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: 1480 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <NiumaMascot size={215} mood="happy" prop="coffee" />
              <CandyPill text="SELECT / UPDATE ..." bg={C.ocean} size={22} />
            </div>

            <div style={{ fontSize: 48, color: C.orange, fontWeight: 700 }}>➔</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 780 }}>
              <div
                style={{
                  background: "rgba(2,132,199,0.20)",
                  border: `4.5px solid ${C.cyan}`,
                  borderRadius: 28,
                  padding: "24px 32px",
                  boxShadow: "0 0 34px rgba(6,182,212,0.28)",
                }}
              >
                <div style={{ fontSize: 31, fontWeight: 700, color: C.cyan }}>
                  🧠 上层 · Server 层（大脑）
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginTop: 8 }}>
                  连接鉴权 · 语法解析 · 优化器挑索引 · 执行器调度 · Binlog 归档
                </div>
              </div>

              <div style={{ textAlign: "center", fontSize: 26, fontWeight: 700, color: C.orange }}>
                ⇅ 标准存储引擎接口（可插拔）
              </div>

              <div
                style={{
                  background: "rgba(242,145,17,0.16)",
                  border: `4.5px solid ${C.orange}`,
                  borderRadius: 28,
                  padding: "24px 32px",
                  boxShadow: "0 0 34px rgba(242,145,17,0.24)",
                }}
              >
                <div style={{ fontSize: 31, fontWeight: 700, color: C.orange }}>
                  ⚙️ 下层 · 存储引擎层（手脚）
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginTop: 8 }}>
                  负责真实数据落盘、索引结构、事务与行锁（默认主力：InnoDB）
                </div>
              </div>
            </div>

            <MysqlDolphinBot size={215} />
          </div>
        </div>
      ) : (
        /* Cue 2 & 3: 4-Stage Server Pipeline + MySQL 8.0 Query Cache Removed Callout */
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
          <CandyPill text="🚀 Server 层四大核心流水线（一条 SQL 这样跑通）" bg={C.ocean} size={30} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 1540 }}>
            {[
              {
                n: "① 连接器",
                tag: "鉴权 · 连接池",
                desc: "校验账号权限，线上务必用连接池复用长连接",
                col: C.cyan,
                d: 0,
              },
              {
                n: "② 解析器",
                tag: "词法 · 语法",
                desc: "检查 SQL 拼写与表字段是否存在，错则直接报错",
                col: C.ocean,
                d: 14,
              },
              {
                n: "③ 优化器",
                tag: "最核心大脑！",
                desc: "估算成本选最快索引与连接顺序（EXPLAIN 看这里）",
                col: C.orange,
                d: 28,
              },
              {
                n: "④ 执行器",
                tag: "调引擎取数",
                desc: "校验表权限，调用 InnoDB 接口逐行读写数据",
                col: C.mint,
                d: 42,
              },
            ].map((s, idx) => (
              <React.Fragment key={s.n}>
                <div
                  style={{
                    width: 345,
                    background: C.darkCard,
                    border: `4.5px solid ${s.col}`,
                    borderRadius: 28,
                    padding: "24px 22px",
                    boxShadow: idx === 2 ? `0 0 36px ${C.orange}55` : "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                    textAlign: "center",
                    transform: `scale(${spring({ frame: Math.max(0, frame - stepsCue.from - s.d), fps, config: { damping: 10 } })})`,
                  }}
                >
                  <div style={{ fontSize: 30, fontWeight: 700, color: s.col }}>{s.n}</div>
                  <CandyPill text={s.tag} bg={s.col} color={s.col === C.orange || s.col === C.cyan ? C.ink : "#ffffff"} size={20} />
                  <div style={{ fontSize: 21, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.5 }}>
                    {s.desc}
                  </div>
                </div>
                {idx < 3 && <span style={{ fontSize: 34, fontWeight: 700, color: C.orange }}>➔</span>}
              </React.Fragment>
            ))}
          </div>

          {/* MySQL 8.0 Query Cache Removed Notice */}
          <div
            style={{
              width: 1540,
              background: showNoQc ? "rgba(225,29,72,0.18)" : "rgba(24,34,56,0.5)",
              border: `4px solid ${showNoQc ? C.rose : "#334155"}`,
              borderRadius: 24,
              padding: "18px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: showNoQc ? 1 : 0.25,
              transform: `scale(${showNoQc ? spring({ frame: Math.max(0, frame - noQcCue.from), fps, config: { damping: 11 } }) : 0.95})`,
            }}
          >
            <div style={{ fontSize: 25, fontWeight: 700, color: "#fda4af" }}>
              ⚠️ 新版避坑：MySQL 8.0 已彻底移除「查询缓存（Query Cache）」！
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0" }}>
              原因：表一更新缓存整片失效，高并发下得不偿失
            </div>
          </div>
        </div>
      )}

      <SceneWipeIn color={C.ocean} />
    </MysqlStage>
  );
};

/** Act 2: Pluggable Storage Engines — InnoDB vs MyISAM (+ Memory note) */
export const EnginesScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vsCue = getCue(scene.cues, "innodbVsMyisam", 260);
  const takeCue = getCue(scene.cues, "engineTakeaway", 820);
  const showVs = frame >= vsCue.from;
  const showTake = frame >= takeCue.from;

  return (
    <MysqlStage theme="sky">
      <CanvasFXLayer
        mode="dataFlow"
        burstFrames={[14, vsCue.from, takeCue.from]}
        accent={C.ocean}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.ocean} />

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
          text="插件式存储引擎：InnoDB 完胜 MyISAM!"
          size={54}
          color={C.ink}
          shadowColor={C.oceanSoft}
        />

        <div style={{ display: "flex", alignItems: "stretch", gap: 30, width: 1520 }}>
          {/* InnoDB Winner Card */}
          <div
            style={{
              flex: 1.15,
              background: "#182238",
              color: "#ffffff",
              border: `5px solid ${C.ocean}`,
              borderRadius: 34,
              padding: "28px 34px",
              boxShadow: `0 14px 0 ${C.ocean}`,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              transform: `scale(${showVs ? spring({ frame: Math.max(0, frame - vsCue.from), fps, config: { damping: 10 } }) * 1.02 : 0.98})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: C.cyan }}>👑 InnoDB（默认主力）</span>
              <CandyPill text="MySQL 5.5+ 默认" bg={C.mint} size={20} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 23, fontWeight: 700, color: "#e2e8f0" }}>
              <div>✅ <span style={{ color: C.mint }}>完整 ACID 事务</span>：转账下单绝不半途丢数据</div>
              <div>✅ <span style={{ color: C.mint }}>精细行级锁 + MVCC</span>：高并发改不同行互不阻塞</div>
              <div>✅ <span style={{ color: C.mint }}>崩溃安全恢复</span>：断电重启靠 Redo Log 自动恢复</div>
              <div>✅ <span style={{ color: C.mint }}>聚簇索引 + 外键</span>：主键查询与数据完整性拉满</div>
            </div>
          </div>

          {/* MyISAM Legacy Card */}
          <div
            style={{
              flex: 0.95,
              background: "#ffffff",
              border: `5px dashed ${C.rose}`,
              borderRadius: 34,
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              opacity: showVs ? 0.88 : 0.5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 34, fontWeight: 700, color: C.rose }}>🏚️ MyISAM（老引擎）</span>
              <CandyPill text="核心业务已淘汰" bg={C.rose} size={20} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 23, fontWeight: 700, color: C.ink }}>
              <div>❌ <span style={{ color: C.rose }}>不支持事务</span>：改一半宕机极易损坏数据</div>
              <div>❌ <span style={{ color: C.rose }}>只有表级锁</span>：改 1 行锁整张表，全员干等</div>
              <div>❌ <span style={{ color: C.rose }}>不支持崩溃恢复</span>：异常断电后表易损坏</div>
              <div style={{ color: C.sub }}>ℹ️ 仅在极少数历史只读统计表中偶见</div>
            </div>
          </div>
        </div>

        {/* Bottom Takeaway + Memory Note */}
        <div
          style={{
            width: 1520,
            background: "#ffffff",
            border: `4.5px solid ${showTake ? C.orange : "#cbd5e1"}`,
            borderRadius: 26,
            padding: "18px 32px",
            boxShadow: showTake ? `0 10px 0 ${C.orange}` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: showTake ? 1 : 0.3,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>
            💡 <span style={{ color: C.ocean }}>Memory 引擎</span>：全存内存、重启清空，偶用于极小临时计算表
          </span>
          <CandyPill text="🎯 实战结论：线上业务无脑认准 InnoDB!" bg={C.orange} color={C.ink} size={24} />
        </div>
      </div>

      <SceneWipeIn color={C.ocean} />
    </MysqlStage>
  );
};
