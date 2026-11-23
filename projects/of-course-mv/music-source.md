# 指定音乐与本地制作范围

用户明确选择“十元钱钱那条对比视频里的音乐版本”。原始页面：https://www.douyin.com/video/7690228850878746107 。作者页面展示为十元钱钱，标题为 Opus 5.5 vs Astra 的动画比较。

通过原页面实际播放器核对并取得视频，原视频为 H.264、576 × 1024、30 fps、1313 帧。AAC 音轨为 44100 Hz 立体声。抽取音轨时不剪辑、不加速、不另换版本，解码为 48000 Hz 立体声 PCM。解码后时长为 43.771020833 秒，视频时间轴为 43.766666667 秒；差异约 4.35 毫秒，小于一帧，音频随完整视频时间轴自然结束。

本地文件：`public/of-course-mv/external/reference.mp4`（来源核对用）、`public/of-course-mv/external/song.wav`（抽取与分析中间文件）。`npm run asset:add` 已将实际使用的音轨登记至 `public/of-course-mv/external/audio/of-course-reference.wav`，指纹与中间文件一致。所有第三方文件忽略 Git。临时 CDN 下载链接不进入可提交文件。

资产用途状态只核实“用户指定音源，用于本地创作、可编辑预览与 MP4 审阅”这一范围。未查得这首音乐的公开再分发许可证，不把公开可播放等同于获得商业或平台上传授权；未进行上传发布。资产 origin 记录为来自已下载参考文件的音频抽取，保留原始 pageUrl、原文件 SHA-256 和抽取命令。`CREDITS.txt` 提供音源出处。

提取命令：`node_modules/.bin/remotion ffmpeg -y -i public/of-course-mv/external/reference.mp4 -vn -c:a pcm_s16le -ar 48000 public/of-course-mv/external/song.wav`。

音频分析：2048 点 STFT，240 样本步长；谱变化用于起音、180 Hz 以下频带能量用于鼓点细节。强节拍周期约 0.405 秒（约 148 BPM），歌词起点结合本地 Whisper base 转写及参考视频字面校正，逐段保存在 `timing.json`。动画使用源音频的每帧能量；不新增配乐、不将节奏换成程序合成 120 BPM。
