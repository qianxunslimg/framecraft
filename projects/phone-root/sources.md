# 技术核验与素材来源（phone-root v002 电影重制版）

## 技术严谨核验清单（Android / Linux 安全架构）
- **Linux 权限与沙盒模型**：Android 基于 Linux 内核，通过独立 UID/GID 隔离每个 App 进程，并叠加 SELinux（Enforcing 模式）强制访问控制；`uid=0`（root）位于权限体系顶端。
- **安全启动信任链（Verified Boot / AVB 2.0）**：SoC 芯片出厂固化只读 BootROM，通电后以硬件信任根逐级校验 Bootloader、`boot.img`/`init_boot.img` 及 `system`/`vendor` 分区（结合 dm-verity 块级哈希校验）。
- **解锁 Bootloader 与反盗机制**：解开 Bootloader 锁自动触发 `userdata` 全盘清空，防止物理窃取设备后直接提取本地数据。
- **现代 Root 架构**：Magisk（修补 `init_boot.img` + Systemless OverlayFS 虚拟挂载，原版 `/system` 纹丝不动）与 KernelSU（直接进驻 Linux Ring 0 内核白名单控制）。
- **硬件级隔离与代价**：ARM TrustZone / TEE 独立硬件保险箱与硬件级证明（Play Integrity / Key Attestation），以及误授恶意软件 Root 带来的沙盒瓦解与变砖风险。

## 音频与电影级视觉资产归属
- **配音**：Edge TTS `zh-CN-YunxiaNeural`（+14% 语速）本地脚本分段合成并全篇实听验收。
- **配乐与音效**：本地 Python 原创合成（`scripts/bgm.py`），128 BPM D 小调赛博电子配乐 + 帧同步解锁、激光扫描、告警与低音冲击 SFX。
- **13 组 16:9 照片级 3D CGI 电影母镜**：由内置 `image-generator` 原创生成，存放于 `public/phone-root/owned/plates/` 并在 `assets.json` 逐一登记 SHA-256 指纹与用途，搭配 `CinemaEngine.tsx` 实时电影运镜、浅景深拉焦、火花/光束/粒子 VFX 与 2.35:1 电影画幅合成输出。
