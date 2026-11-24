# 一集彻底搞懂 Apache Kafka（运维小牛马高并发篇）

- **项目 ID**：`kafka-explained`
- **画幅 / 帧率**：`1920 × 1080`（16:9 横屏），`30 fps`
- **定位**：100% 独立成篇，零基础也能看懂，同时经得起资深后端工程师检验的 Kafka 核心原理动画。
- **核心覆盖**：秒杀洪峰与削峰解耦 → Broker / Topic / Partition / Offset 与单分区有序性（同 Key 哈希）→ Consumer Group 负载均衡、多余消费者空闲、多组广播与日志保留回放 → 副本机制（Leader / Follower / ISR / 故障切换 / acks=0,1,all）→ 百万级吞吐四大黑科技（顺序写磁盘 / OS Page Cache / sendfile 零拷贝 / 批量压缩）→ 架构进化（告别 ZooKeeper，拥抱 KRaft，Kafka 4.0 已彻底移除 ZooKeeper）→ 全景总图。
