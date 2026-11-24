# 素材来源与技术核验记录（mysql-explained）

## 技术准确性核验清单（MySQL 8.0 + InnoDB 官方语义）
- **架构分层**：Server 层（连接器、解析器、优化器、执行器）+ 插件式存储引擎层；准确指出 **MySQL 8.0 已彻底移除查询缓存（Query Cache）**。
- **存储引擎**：InnoDB（5.5 起默认，支持事务 ACID、行锁、MVCC、外键、崩溃恢复、聚簇索引）vs MyISAM（不支持事务与崩溃恢复、仅表级锁）vs Memory（内存临时表）。
- **B+Tree 索引**：InnoDB 默认页大小 16KB；非叶子节点只存键值与页指针，叶子节点存完整行（聚簇索引）或主键 ID（二级索引），叶子节点由双向链表串联支持高效范围扫描；典型 3 层 B+Tree 可容纳约千万级（~2000 万）行，定位仅需约 3 次磁盘 I/O（根页常驻内存时更少）；覆盖索引可免回表；联合索引遵循最左前缀匹配原则；索引列套函数/算术运算、前导 `%` 模糊查询、隐式类型转换会导致索引失效。
- **事务 ACID 与底层实现**：Atomicity（Undo Log）、Consistency（最终守恒目标）、Isolation（锁 + MVCC）、Durability（Redo Log）。
- **隔离级别与 MVCC**：脏读、不可重复读、幻读；Read Uncommitted / Read Committed / Repeatable Read（InnoDB 默认）/ Serializable；MVCC 基于隐藏字段 `trx_id`、`roll_pointer` + Undo Log 版本链 + Read View（RC 每次快照读生成新 Read View，RR 在事务首次快照读生成并复用同一 Read View）。
- **锁机制**：表锁 vs 行锁；共享锁（S）与排他锁（X）；InnoDB 行锁加在索引记录上（Record Lock、Gap Lock、Next-Key Lock），若 `UPDATE`/`DELETE` 的 `WHERE` 条件无法命中索引，InnoDB 会扫描并锁定全表聚簇索引记录，等效锁整表；死锁由循环等待引起，InnoDB 默认开启死锁检测并回滚 Undo 量较小的事务，工程最佳实践为按统一顺序加锁并缩短事务。
- **Buffer Pool 与三大日志**：Buffer Pool 缓存 16KB 数据页并异步刷脏；WAL（Write-Ahead Logging）先顺序写 Redo Log 再异步刷盘；Redo Log（InnoDB 物理日志，保持久性）、Undo Log（InnoDB 逻辑日志，保回滚与 MVCC）、Binlog（Server 层逻辑归档日志，用于主从复制与按时间点恢复）；两阶段提交（Redo Log Prepare → 写 Binlog → Redo Log Commit）确保崩溃恢复与主从一致性。

## 音频与画面归属
- **配音**：Edge TTS `zh-CN-YunxiaNeural` 本地脚本生成（`scripts/voice.py`），合成前预听所有术语、合成后逐段实听整条音轨。
- **配乐与音效**：本地 Python 合成（`scripts/bgm.py`），124 BPM F 大调原创电音与 18 处音效。
- **视觉与角色**：`source/characters.tsx`、`source/fx.tsx`、`source/scenes/*.tsx` 全代码原创绘制。
