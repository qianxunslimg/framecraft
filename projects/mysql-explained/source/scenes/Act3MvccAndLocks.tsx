import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CanvasFXLayer, ExtrudedTitle, SceneWipeIn } from "../fx";
import { C, CandyPill, getCue, MysqlStage, SceneTopBar, SceneTiming } from "../stage";

/** Act 5: Concurrency Anomalies -> 4 Isolation Levels -> MVCC Undo Chain & Read View */
export const MvccScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isoCue = getCue(scene.cues, "isolationLevels", 500);
  const mvccCue = getCue(scene.cues, "mvccMagic", 980);
  const rvCue = getCue(scene.cues, "readViewDiff", 1420);

  const phase = frame >= mvccCue.from ? 2 : frame >= isoCue.from ? 1 : 0;
  const showRvDiff = frame >= rvCue.from;

  return (
    <MysqlStage theme="mint">
      <CanvasFXLayer
        mode="dataFlow"
        burstFrames={[14, isoCue.from, mvccCue.from, rvCue.from]}
        accent={C.mint}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.mint} />

      {/* Phase 0: 3 Concurrency Anomalies */}
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
          <ExtrudedTitle text="不管控并发，就会闹出三大怪事!" size={56} color={C.ink} shadowColor={C.mintSoft} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, width: 1540 }}>
            {[
              {
                icon: "🧪",
                title: "① 脏读（Dirty Read）",
                col: C.rose,
                soft: C.roseSoft,
                body: "事务 B 读到了事务 A 修改完但还没提交的余额，随后 A 回滚，B 拿了个根本不存在的假数字！",
                delay: 6,
              },
              {
                icon: "🔄",
                title: "② 不可重复读",
                col: C.amber,
                soft: C.amberSoft,
                body: "同一个对账事务里前后查两次同一行，中间被别人改并提交，两次查出的金额居然对不上！",
                delay: 18,
              },
              {
                icon: "👻",
                title: "③ 幻读（Phantom）",
                col: C.indigo,
                soft: C.indigoSoft,
                body: "按范围查今天订单本来只有 5 条，一秒后再查突然多出 1 条别人刚插进来的“幽灵新单”！",
                delay: 30,
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#ffffff",
                  border: `5px solid ${item.col}`,
                  borderRadius: 30,
                  padding: "26px 28px",
                  boxShadow: `0 12px 0 ${item.col}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transform: `scale(${spring({ frame: Math.max(0, frame - item.delay), fps, config: { damping: 11 } })})`,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 700, color: item.col }}>
                  {item.icon} {item.title}
                </div>
                <div
                  style={{
                    background: item.soft,
                    borderRadius: 18,
                    padding: "16px 18px",
                    fontSize: 22,
                    fontWeight: 700,
                    color: C.ink,
                    lineHeight: 1.55,
                  }}
                >
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 1: 4 Isolation Levels Comparison Table */}
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
            text="SQL 四大隔离级别 · InnoDB 默认可重复读!"
            size={50}
            color={C.ink}
            shadowColor="#ffffff"
            startFrame={isoCue.from}
          />

          <div
            style={{
              width: 1520,
              background: "#ffffff",
              border: `5px solid ${C.ink}`,
              borderRadius: 32,
              padding: "24px 32px",
              boxShadow: `0 14px 0 ${C.mint}`,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {[
              { name: "1. 读未提交（Read Uncommitted）", d: "❌ 脏读", nr: "❌ 不可重复读", ph: "❌ 幻读", note: "太危险，生产不用", highlight: false },
              { name: "2. 读已提交（Read Committed · RC）", d: "✅ 防住", nr: "❌ 仍可能", ph: "❌ 仍可能", note: "Oracle 等常用默认", highlight: false },
              { name: "3. 可重复读（Repeatable Read · RR）", d: "✅ 防住", nr: "✅ 防住", ph: "🛡️ InnoDB 大幅防住", note: "⭐ MySQL InnoDB 默认!", highlight: true },
              { name: "4. 串行化（Serializable）", d: "✅ 防住", nr: "✅ 防住", ph: "✅ 彻底防住", note: "读写全排队，极慢", highlight: false },
            ].map((row, idx) => (
              <div
                key={row.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.1fr 0.9fr 1fr 1.25fr 1.4fr",
                  alignItems: "center",
                  background: row.highlight ? "#182238" : idx % 2 === 0 ? "#f8fafc" : "#ffffff",
                  color: row.highlight ? "#ffffff" : C.ink,
                  border: row.highlight ? `4px solid ${C.mint}` : "2px solid #e2e8f0",
                  borderRadius: 18,
                  padding: "16px 22px",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                <span style={{ color: row.highlight ? C.mint : C.ink }}>{row.name}</span>
                <span>{row.d}</span>
                <span>{row.nr}</span>
                <span style={{ color: row.highlight ? C.amber : undefined }}>{row.ph}</span>
                <span style={{ color: row.highlight ? "#6ee7b7" : C.sub, textAlign: "right" }}>{row.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: MVCC Undo Log Version Chain + Read View (RC vs RR Essence) */}
      {phase === 2 && (
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
          <CandyPill text="✨ MVCC 黑科技：读不阻塞写 · 写不阻塞读！" bg="#182238" size={29} />

          {/* Version Chain Visual */}
          <div
            style={{
              width: 1540,
              background: "#182238",
              color: "#ffffff",
              border: `5px solid ${C.mint}`,
              borderRadius: 32,
              padding: "24px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ fontSize: 25, fontWeight: 700, color: C.mint }}>
              🔗 每行数据背后的 Undo Log 历史版本链（类似 Git 历史）：
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {[
                { ver: "最新行（修改中未提交）", val: "余额 = 500 元", meta: "trx_id = 20（活跃中）", col: C.rose },
                { ver: "Undo Log 历史版本 1", val: "余额 = 1000 元", meta: "trx_id = 10（已提交 ✓）", col: C.mint },
                { ver: "Undo Log 历史版本 2", val: "余额 = 1500 元", meta: "trx_id = 5（更早历史）", col: C.ocean },
              ].map((node, idx) => (
                <React.Fragment key={node.ver}>
                  <div
                    style={{
                      width: 440,
                      background: "rgba(15,23,42,0.88)",
                      border: `4px solid ${node.col}`,
                      borderRadius: 22,
                      padding: "16px 22px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 700, color: node.col }}>{node.ver}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#ffffff" }}>{node.val}</div>
                    <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "monospace", color: "#cbd5e1" }}>
                      {node.meta}
                    </div>
                  </div>
                  {idx < 2 && <span style={{ fontSize: 34, color: C.orange, fontWeight: 700 }}>➔</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* RC vs RR Read View Essence */}
          <div
            style={{
              display: "flex",
              gap: 24,
              width: 1540,
              opacity: showRvDiff ? 1 : 0.28,
              transform: `scale(${showRvDiff ? spring({ frame: Math.max(0, frame - rvCue.from), fps, config: { damping: 11 } }) : 0.95})`,
            }}
          >
            <div
              style={{
                flex: 1,
                background: "#ffffff",
                border: `4.5px solid ${C.ocean}`,
                borderRadius: 24,
                padding: "18px 26px",
                boxShadow: `0 10px 0 ${C.ocean}`,
              }}
            >
              <div style={{ fontSize: 25, fontWeight: 700, color: C.ocean }}>📸 读已提交（RC）</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: C.ink, marginTop: 6 }}>
                每次 SELECT 都重拍一张新 Read View → 能看见别人最新提交的改动！
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "#ffffff",
                border: `4.5px solid ${C.mint}`,
                borderRadius: 24,
                padding: "18px 26px",
                boxShadow: `0 10px 0 ${C.mint}`,
              }}
            >
              <div style={{ fontSize: 25, fontWeight: 700, color: C.mint }}>📸 可重复读（RR · InnoDB 默认）</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: C.ink, marginTop: 6 }}>
                整个事务只拍一次 Read View 并反复复用 → 前后怎么查结果都纹丝不动！
              </div>
            </div>
          </div>
        </div>
      )}

      <SceneWipeIn color={C.mint} />
    </MysqlStage>
  );
};

/** Act 6: MySQL Lock Mechanisms — Table vs Row, S/X, Record/Gap/Next-Key & Production Nightmares */
export const LocksScene: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typesCue = getCue(scene.cues, "rowLockTypes", 480);
  const trapsCue = getCue(scene.cues, "lockTraps", 960);

  const phase = frame >= trapsCue.from ? 2 : frame >= typesCue.from ? 1 : 0;

  return (
    <MysqlStage theme="rose">
      <CanvasFXLayer
        mode="sunburst"
        burstFrames={[14, typesCue.from, trapsCue.from]}
        accent={C.rose}
      />
      <SceneTopBar badge={scene.badge} title={scene.title} accent={C.rose} />

      {/* Phase 0: Table vs Row Lock + S Lock vs X Lock */}
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
          <ExtrudedTitle text="写写并发靠锁排队：粒度与模式!" size={54} color={C.ink} shadowColor="#ffffff" />

          <div style={{ display: "flex", gap: 28, width: 1520 }}>
            <div
              style={{
                flex: 1,
                background: "#ffffff",
                border: `5px solid ${C.ocean}`,
                borderRadius: 32,
                padding: "26px 32px",
                boxShadow: `0 12px 0 ${C.ocean}`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <CandyPill text="📏 按颗粒度：表级锁 vs 行级锁" bg={C.ocean} size={24} />
              <div style={{ fontSize: 23, fontWeight: 700, color: C.ink, lineHeight: 1.65 }}>
                • <span style={{ color: C.rose }}>表级锁</span>：一锁锁整张表，冲突大、并发极低<br />
                • <span style={{ color: C.mint }}>行级锁（InnoDB 王牌）</span>：抢购商品 A 时只锁商品 A 那 1 行，买商品 B 完全不卡顿！
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "#182238",
                color: "#ffffff",
                border: `5px solid ${C.rose}`,
                borderRadius: 32,
                padding: "26px 32px",
                boxShadow: `0 12px 0 ${C.rose}`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <CandyPill text="🔐 按读写权限：共享锁(S) vs 排他锁(X)" bg={C.rose} size={24} />
              <div style={{ fontSize: 23, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.65 }}>
                • <span style={{ color: C.cyan }}>共享锁（S 读锁）</span>：大家一起看互不冲突，但不准改<br />
                • <span style={{ color: C.orange }}>排他锁（X 写锁）</span>：修改数据时独占，其他读写全排队！
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 1: 3 Faces of InnoDB Row Locks */}
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
            text="InnoDB 行锁三副面孔：锁行 · 锁空隙!"
            size={52}
            color={C.ink}
            shadowColor="#ffffff"
            startFrame={typesCue.from}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, width: 1540 }}>
            {[
              {
                t: "① Record Lock",
                cn: "记录锁",
                col: C.ocean,
                tag: "精确锁单条索引记录",
                demo: "🔒 只锁 [id = 10]",
                desc: "抢最后 1 件库存时，精准锁住商品 10 这一行，防止超卖！",
                d: 0,
              },
              {
                t: "② Gap Lock",
                cn: "间隙锁",
                col: C.amber,
                tag: "锁记录之间的开区间空隙",
                demo: "🚧 锁住 (10, 20) 空隙",
                desc: "可重复读级别下禁止别人在中间插队新行，专门堵死幻读！",
                d: 14,
              },
              {
                t: "③ Next-Key Lock",
                cn: "临键锁（默认）",
                col: C.rose,
                tag: "记录锁 + 间隙锁",
                demo: "🔐 锁住 (10, 20] 区间",
                desc: "左开右闭区间，既锁住当前记录又锁住前面空隙，默认基本单位！",
                d: 28,
              },
            ].map((item) => (
              <div
                key={item.t}
                style={{
                  background: item.col === C.rose ? "#182238" : "#ffffff",
                  color: item.col === C.rose ? "#ffffff" : C.ink,
                  border: `5px solid ${item.col}`,
                  borderRadius: 30,
                  padding: "24px 26px",
                  boxShadow: `0 12px 0 ${item.col}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  transform: `scale(${spring({ frame: Math.max(0, frame - typesCue.from - item.d), fps, config: { damping: 11 } })})`,
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 700, color: item.col }}>{item.t}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: item.col === C.rose ? "#fda4af" : C.sub, marginTop: -6 }}>
                  {item.cn} · {item.tag}
                </div>
                <div
                  style={{
                    background: item.col === C.rose ? "rgba(225,29,72,0.22)" : "#182238",
                    color: "#ffffff",
                    borderRadius: 14,
                    padding: "10px 16px",
                    fontSize: 21,
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  {item.demo}
                </div>
                <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: Two Production Disasters — No-Index Table Lock & Deadlock */}
      {phase === 2 && (
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
            text="线上两大血泪锁惨案 · 一定要避开!"
            size={54}
            color={C.rose}
            shadowColor="#ffffff"
            startFrame={trapsCue.from}
          />

          <div style={{ display: "flex", gap: 28, width: 1540 }}>
            {/* Disaster 1: No-Index UPDATE locks whole table */}
            <div
              style={{
                flex: 1,
                background: "#182238",
                color: "#ffffff",
                border: `5px solid ${C.rose}`,
                borderRadius: 32,
                padding: "28px 32px",
                boxShadow: `0 14px 0 ${C.rose}`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <CandyPill text="💥 血坑 ①：行锁是加在索引上的!" bg={C.rose} size={24} />
              <div
                style={{
                  background: "rgba(225,29,72,0.20)",
                  borderRadius: 14,
                  padding: "12px 18px",
                  fontFamily: "monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fda4af",
                }}
              >
                UPDATE orders SET status=1 WHERE note=&apos;加急&apos;
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.6 }}>
                • 若 WHERE 条件<span style={{ color: C.orange }}>没有命中索引</span>，InnoDB 会全表扫描给每一条记录都加上锁！<br />
                • <span style={{ color: "#fda4af" }}>后果：等效整张表瞬间锁死，全站接口雪崩！</span>
              </div>
            </div>

            {/* Disaster 2: Deadlock */}
            <div
              style={{
                flex: 1,
                background: "#ffffff",
                border: `5px solid ${C.indigo}`,
                borderRadius: 32,
                padding: "28px 32px",
                boxShadow: `0 14px 0 ${C.indigo}`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <CandyPill text="💥 血坑 ②：死锁（Deadlock）" bg={C.indigo} size={24} />
              <div
                style={{
                  background: C.indigoSoft,
                  borderRadius: 14,
                  padding: "12px 18px",
                  fontSize: 21,
                  fontWeight: 700,
                  color: C.indigo,
                }}
              >
                事务 1（锁 A 等 B） ⇄ 事务 2（锁 B 等 A）互相死等！
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.6 }}>
                • InnoDB 会自动死锁检测并回滚代价较小的一方<br />
                • <span style={{ color: C.mint }}>防身铁律：不同业务按统一固定顺序加锁 + 拆短事务快提交！</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <SceneWipeIn color={C.rose} />
    </MysqlStage>
  );
};
