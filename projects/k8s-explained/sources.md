# 素材与音频来源说明（k8s-explained）

- **旁白配音（`narration.wav`）**：使用 Edge TTS `zh-CN-YunxiaNeural`（语速 `+5%`，自然原声 `+0Hz` 无变调），按 `script.json` 逐短句自然断句合成并精确帧对齐到 `source/timeline.json` 与 `subtitles.srt`（脚本：`scripts/voice.py`）。
- **原创背景音乐与卡点音效（`master.wav`）**：由 `scripts/bgm.py` 本地程序化合成 126 BPM 欢快电子芯片乐 BGM 与 14 组卡通卡点音效，不含任何外部采样，自动避让人声并混音输出 48 kHz 立体声母带。
