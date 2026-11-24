import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MysqlDolphinBot, NiumaMascot } from "../characters";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, getCue, MysqlStage, SceneTopBar, SceneTiming } from "../stage";

/** Act 3: B+Tree Index Internals — 3-Level Height, Leaf Linked List, Clustered vs Secondary & Leftmost Prefix */
export const BtreeIndexScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leafCue = getCue(scene.cues, "leafList", 480);
  const clusterCue = getCue(scene.cues, "clusterCover", 880);
  const trapCue = getCue(scene.cues, "leftmostTrap", 1420);

  const phase =
    frame >= trapCue.from ? 2 : frame >= clusterCue.from ? 1 : 0;
  const showLeafLink = frame >= leafCue.from;

  return (
    <MysqlStage theme="arcade">
      <CanvasFXLayer
        mode="treeGrid"
        burstFrames={[14, leafCue.from, clusterCue.from, trapCue.from]}
        accent={C.orange}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.orange} dark />

      {/* Phase 0: 3-Level 16KB B+Tree + Leaf Doubly-Linked List vs Hash */}
      {phase === 0 && (
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
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <CandyPill text="🌳 3 层 B+Tree ≈ 2000 万行 · 最多 2～3 次磁盘 I/O!" bg={C.orange} color={C.ink} size={28} />
          </div>

          {/* Visual 3-level B+Tree Diagram */}
          <div
            style={{
              width: 1520,
              background: C.darkCard,
              border: `4.5px solid ${C.ocean}`,
              borderRadius: 34,
              padding: "24px 34px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            {/* Level 1: Root Page */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ fontSize: 21, fontWeight: 700, color: C.cyan, width: 170 }}>第 1 层 · 根页</span>
              <div
                style={{
                  background: "rgba(2,132,199,0.28)",
                  border: `3.5px solid ${C.cyan}`,
                  borderRadius: 16,
                  padding: "10px 28px",
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: "#ffffff",
                }}
              >
                [ 16KB 页：只存索引键 1 | 500万 | 1200万 + 页指针，不存整行！ ]
              </div>
            </div>

            <div style={{ fontSize: 22, color: C.orange, fontWeight: 700 }}>↙ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↘</div>

            {/* Level 2: Branch Pages */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, width: "100%", justifyContent: "center" }}>
              <span style={{ fontSize: 21, fontWeight: 700, color: C.orange, width: 170 }}>第 2 层 · 非叶子</span>
              <div style={{ display: "flex", gap: 22 }}>
                {["分支页 A [1..500万]", "分支页 B [500万..1200万]", "分支页 C [1200万..2000万]"].map((b) => (
                  <div
                    key={b}
                    style={{
                      background: "rgba(242,145,17,0.18)",
                      border: `3px solid ${C.orange}`,
                      borderRadius: 14,
                      padding: "10px 20px",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#fde68a",
                    }}
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 22, color: C.mint, fontWeight: 700 }}>↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↓</div>

            {/* Level 3: Leaf Pages with Doubly Linked List */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", justifyContent: "center" }}>
              <span style={{ fontSize: 21, fontWeight: 700, color: C.mint, width: 170 }}>第 3 层 · 叶子页</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {["叶子 1 [id=1..15 完整行]", "叶子 2 [id=16..30 完整行]", "叶子 3 [id=31..45 完整行]"].map((lf, idx) => (
                  <React.Fragment key={lf}>
                    <div
                      style={{
                        background: showLeafLink ? "rgba(16,185,129,0.25)" : "rgba(15,23,42,0.8)",
                        border: `3.5px solid ${C.mint}`,
                        borderRadius: 14,
                        padding: "12px 18px",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#ffffff",
                        boxShadow: showLeafLink ? `0 0 24px ${C.mint}55` : "none",
                      }}
                    >
                      {lf}
                    </div>
                    {idx < 2 && (
                      <span style={{ fontSize: 28, fontWeight: 700, color: showLeafLink ? C.orange : "#64748b" }}>⇄</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Comparison Strip: Why B+Tree beats Hash */}
          <div
            style={{
              width: 1520,
              background: showLeafLink ? "rgba(16,185,129,0.16)" : "rgba(24,34,56,0.5)",
              border: `3.5px solid ${showLeafLink ? C.mint : "#334155"}`,
              borderRadius: 22,
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: showLeafLink ? 1 : 0.35,
            }}
          >
            <span style={{ fontSize: 23, fontWeight: 700, color: "#6ee7b7" }}>
              🔗 叶子双向链表：查“最近 7 天订单”或排序分页，定位起点一路横扫！
            </span>
            <CandyPill text="vs Hash 索引：只能等值查，无法范围/排序" bg={C.rose} size={20} />
          </div>
        </div>
      )}

      {/* Phase 1: Clustered Index vs Secondary Index, Back-to-Table (回表) & Covering Index */}
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
            text="聚簇索引 · 二级索引 · 回表与覆盖索引!"
            size={52}
            color="#ffffff"
            shadowColor={C.cyan}
            startFrame={clusterCue.from}
          />

          <div style={{ display: "flex", gap: 28, width: 1540 }}>
            {/* Clustered Index */}
            <div
              style={{
                flex: 1,
                background: C.darkCard,
                border: `4.5px solid ${C.cyan}`,
                borderRadius: 30,
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <CandyPill text="🔑 聚簇索引（主键索引）" bg={C.cyan} color={C.ink} size={24} />
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.55 }}>
                • 叶子节点直接存<span style={{ color: C.cyan }}>整行完整数据</span><br />
                • 按主键 id 查询：查 1 棵树直接拿到全部字段<br />
                • 建议用自增主键，顺序追加写入少页分裂
              </div>
            </div>

            {/* Secondary Index + Back-to-Table */}
            <div
              style={{
                flex: 1.15,
                background: C.darkCard,
                border: `4.5px solid ${C.orange}`,
                borderRadius: 30,
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <CandyPill text="📇 二级索引（如手机号索引）" bg={C.orange} color={C.ink} size={24} />
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.55 }}>
                • 叶子节点只存：<span style={{ color: C.orange }}>索引列（手机号）+ 主键 id</span><br />
                • <span style={{ color: C.rose }}>回表</span>：查详情时先拿主键 id，再回主键树查整行（走 2 棵树！）<br />
                • <span style={{ color: C.mint }}>覆盖索引</span>：若只查 id 和手机号，二级索引里全齐，免回表直接返回！
              </div>
            </div>
          </div>

          <div
            style={{
              width: 1540,
              background: "rgba(16,185,129,0.18)",
              border: `4px solid ${C.mint}`,
              borderRadius: 22,
              padding: "16px 32px",
              textAlign: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#6ee7b7",
            }}
          >
            🚀 调优秘诀：生产查询尽量别写 SELECT *，只拿索引里已有的字段即可触发「覆盖索引」免回表提速！
          </div>
        </div>
      )}

      {/* Phase 2: Composite Index Leftmost Prefix + 3 Classic Index Invalidation Traps */}
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
          <ExtrudedTitle
            text="最左前缀原则 · 3 大索引失效红灯坑!"
            size={52}
            color="#ffffff"
            shadowColor={C.rose}
            startFrame={trapCue.from}
          />

          {/* Leftmost Prefix Bar */}
          <div
            style={{
              width: 1540,
              background: C.darkCard,
              border: `4.5px solid ${C.cyan}`,
              borderRadius: 28,
              padding: "22px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, color: C.cyan }}>
              联合索引 (城市, 年龄, 姓名)
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <CandyPill text="✅ 查 城市" bg={C.mint} size={21} />
              <CandyPill text="✅ 查 城市 + 年龄" bg={C.mint} size={21} />
              <CandyPill text="❌ 跳过城市只查年龄 → 失效!" bg={C.rose} size={21} />
            </div>
          </div>

          {/* 3 Index Invalidation Pitfalls */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, width: 1540 }}>
            {[
              {
                t: "❌ 坑 ① 索引列套函数/运算",
                bad: "WHERE YEAR(create_time) = 2026",
                fix: "改为范围比较：>= '2026-01-01'",
              },
              {
                t: "❌ 坑 ② LIKE 以 % 开头",
                bad: "WHERE name LIKE '%牛马'",
                fix: "前导通配无法走 B+Tree 前缀排序",
              },
              {
                t: "❌ 坑 ③ 隐式类型转换",
                bad: "WHERE phone = 13800138000",
                fix: "字符串列传数字会触发类型函数转换",
              },
            ].map((item, idx) => (
              <div
                key={item.t}
                style={{
                  background: "rgba(225,29,72,0.14)",
                  border: `4px solid ${C.rose}`,
                  borderRadius: 26,
                  padding: "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  transform: `scale(${spring({ frame: Math.max(0, frame - trapCue.from - idx * 12), fps, config: { damping: 11 } })})`,
                }}
              >
                <div style={{ fontSize: 25, fontWeight: 700, color: "#fda4af" }}>{item.t}</div>
                <div
                  style={{
                    background: "#0f172a",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontFamily: "monospace",
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.orange,
                  }}
                >
                  {item.bad}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>{item.fix}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SceneWipeIn color={C.orange} />
    </MysqlStage>
  );
};

/** Act 4: Transactions & ACID Mapped to Their Exact Underlying InnoDB Mechanisms */
export const TransactionsScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pillarsCue = getCue(scene.cues, "acidPillars", 360);
  const icCue = getCue(scene.cues, "acidIC", 820);
  const showAcid = frame >= pillarsCue.from;
  const showIC = frame >= icCue.from;

  return (
    <MysqlStage theme="amber">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[14, pillarsCue.from, icCue.from]}
        accent={C.amber}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.amber} />

      {!showAcid ? (
        /* Cue 1: Concrete Transfer Scenario — 500 RMB + Sudden Power Outage */
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
          <ExtrudedTitle text="转账 500 元突然断电怎么办？" size={58} color={C.ink} shadowColor="#ffffff" />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: 1480 }}>
            <div
              style={{
                width: 400,
                background: "#ffffff",
                border: `5px solid ${C.ocean}`,
                borderRadius: 32,
                padding: 28,
                textAlign: "center",
                boxShadow: `0 12px 0 ${C.ocean}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <NiumaMascot size={145} mood="panic" />
              <div style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>Step 1：小牛马账户</div>
              <CandyPill text="余额 -500 元 ✓" bg={C.rose} size={24} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 52 }}>⚡💥</div>
              <CandyPill text="此时机房突然断电!" bg={C.rose} size={22} />
            </div>

            <div
              style={{
                width: 400,
                background: "#ffffff",
                border: `5px dashed ${C.amber}`,
                borderRadius: 32,
                padding: 28,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <MysqlDolphinBot size={145} />
              <div style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>Step 2：朋友账户</div>
              <CandyPill text="余额 +500 元 ？（未执行）" bg={C.amber} color={C.ink} size={23} />
            </div>
          </div>

          <CandyPill
            text="📦 事务（Transaction）：把多条 SQL 捆成不可分割的整体，要么全成，要么全撤回！"
            bg="#182238"
            size={25}
          />
        </div>
      ) : (
        /* Cue 2 & 3: ACID 2x2 Matrix + Who Implements What */
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
            text="ACID 四大铁律 · 底层靠山一一对应!"
            size={54}
            color={C.ink}
            shadowColor="#ffffff"
            startFrame={pillarsCue.from}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, width: 1540 }}>
            {[
              {
                k: "A · 原子性（Atomicity）",
                desc: "事务内操作要么全成功，要么全部撤回原样",
                impl: "🛡️ 底层靠山：Undo Log 回滚日志",
                col: C.rose,
                show: true,
                start: pillarsCue.from,
              },
              {
                k: "D · 持久性（Durability）",
                desc: "一旦提交，就算立刻断电数据也永久生效不丢",
                impl: "🛡️ 底层靠山：Redo Log 重做日志",
                col: C.ocean,
                show: true,
                start: pillarsCue.from + 40,
              },
              {
                k: "I · 隔离性（Isolation）",
                desc: "多笔并发事务同时跑，互相隔离不串台",
                impl: "🛡️ 底层靠山：锁机制 + MVCC",
                col: C.mint,
                show: showIC,
                start: icCue.from,
              },
              {
                k: "C · 一致性（Consistency）",
                desc: "转账前后总金额永远守恒，业务约束不被破坏",
                impl: "🎯 终极目标：由 A、I、D 三大特性联手守护！",
                col: C.indigo,
                show: showIC,
                start: icCue.from + 40,
              },
            ].map((item) => (
              <div
                key={item.k}
                style={{
                  background: "#ffffff",
                  border: `5px solid ${item.show ? item.col : "#cbd5e1"}`,
                  borderRadius: 30,
                  padding: "24px 30px",
                  boxShadow: item.show ? `0 12px 0 ${item.col}` : "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  opacity: item.show ? 1 : 0.25,
                  transform: `scale(${item.show ? spring({ frame: Math.max(0, frame - item.start), fps, config: { damping: 11 } }) : 0.94})`,
                }}
              >
                <div style={{ fontSize: 31, fontWeight: 700, color: item.col }}>{item.k}</div>
                <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{item.desc}</div>
                <div
                  style={{
                    background: "#182238",
                    color: "#ffffff",
                    borderRadius: 14,
                    padding: "10px 18px",
                    fontSize: 22,
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  {item.impl}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SceneWipeIn color={C.amber} />
    </MysqlStage>
  );
};
