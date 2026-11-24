# 素材与音频来源说明（kafka-explained）

- **旁白配音（`narration.wav`）**：使用 Edge TTS `zh-CN-YunxiaNeural`（语速 `+5%`，自然原声 `+0Hz` 无变调），按 `script.json` 逐短句自然断句合成并经 `faster-whisper` ASR 逐句核验发音与多音字，精确帧对齐到 `source/timeline.json` 与 `subtitles.srt`（脚本：`scripts/voice.py`）。
- **原创背景音乐与卡点音效（`master.wav`）**：由 `scripts/bgm.py` 本地程序化合成 128 BPM 轻快律动科技电子 BGM 与 14 组贴合画面的卡通音效（秒杀洪峰警报、传送带包裹弹跳、副本选举登基和弦、零拷贝光速滑音、KRaft 切换音效、准点下班欢呼和弦），不含任何外部采样。
