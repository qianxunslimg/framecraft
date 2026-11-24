# 素材来源与技术核验记录（redis-explained）

## 技术准确性核验清单（Redis 6.x / 7.x 官方语义）
- **定位与性能**：Redis（Remote Dictionary Server）是基于内存的键值数据结构存储，典型延迟亚毫秒级，单机轻松支撑 10 万级 QPS。
- **五大核心数据结构**：String（缓存/分布式锁/INCR 计数）、Hash（对象局部字段修改）、List（双向列表/简单队列）、Set（无序集合/去除重复/交集共同好友）、Sorted Set / ZSet（按 Score 排序的排行榜）。
- **线程模型严谨表述**：Redis 并非“全局绝对单线程”——**核心命令执行保持单线程**（避免锁竞争与上下文切换），但 **Redis 6.0 起引入了多线程处理网络 I/O 读写**，持久化/异步释放也由后台线程或 fork 子进程完成；配合 Linux `epoll` I/O 多路复用及 SDS、哈希表、跳表（SkipList）实现极致速度。
- **持久化**：RDB（基于 `fork` 写时复制生成压缩快照，恢复快但有窗口丢数风险）、AOF（追加写命令日志，默认 `everysec` 最多丢 1 秒，支持 AOF Rewrite）、Redis 4.0+ 混合持久化（RDB 头 + AOF 尾）。
- **三大缓存问题**：穿透（查询根本不存在的数据 → 缓存空值 / Bloom Filter）、击穿（单个热点 Key 过期瞬间高并发回源 → Mutex 互斥锁 / 逻辑过期）、雪崩（大量 Key 同时过期或节点宕机 → 随机 TTL 抖动 + 集群高可用/限流降级）。
- **过期与淘汰**：惰性删除 + 定期删除；达到 `maxmemory` 触发淘汰（生产常用 `allkeys-lru` 或 `allkeys-lfu`）。
- **高可用与扩展**：Master-Replica 主从复制 → Sentinel 哨兵自动故障转移 → Redis Cluster 采用固定 **16384 个哈希槽（Hash Slot）** 水平分片。

## 音频与画面素材归属
- **配音**：Edge TTS `zh-CN-YunxiaNeural` 本地脚本生成（`scripts/voice.py`），渲染前逐词实听核验全部专业术语发音。
- **配乐与音效**：本地 Python 合成（`scripts/bgm.py`），130 BPM G 大调原创合成器节奏与 15 处定制音效。
- **角色与图形**：全部由 `source/characters.tsx`、`source/fx.tsx`、`source/scenes/*.tsx` 原创矢量与 Canvas 代码绘制。
