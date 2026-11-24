# 素材与音频来源说明（prometheus-grafana）

- **旁白配音（`narration.wav`）**：使用 Edge TTS `zh-CN-YunxiaNeural`（语速 `+5%`，自然原声 `+0Hz` 无变调），按 `script.json` 逐短句自然断句合成并精确帧对齐到 `source/timeline.json` 与 `subtitles.srt`（脚本：`scripts/voice.py`），合成后经本地 `faster-whisper` ASR 逐句核对发音与多音字。
- **原创背景音乐与卡点音效（`master.wav`）**：由 `scripts/bgm.py` 本地程序化合成 124 BPM 轻快科技电子 BGM 与 14 组贴合画面的卡通音效（心电图心跳声、Pull 抓取气泡音、告警合并清脆提示音、Grafana 仪表盘点亮和弦、三驾马车联动音阶等），不含任何外部采样。
