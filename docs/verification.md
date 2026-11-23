# 第一版实际验证

日期：2026-10-09。环境：Linux，Node.js 20.20.1，Remotion 4.0.534，使用随附 Chrome Headless Shell 与 FFmpeg/FFprobe。

## 作品与交付

| 作品           | 本次版本 | 视频                               | 音轨 | 容器时长  | 浏览器完整播放           |
| -------------- | -------- | ---------------------------------- | ---- | --------- | ------------------------ |
| hello-motion   | v001     | H.264，1920 × 1080，30 fps，180 帧 | 无   | 6.000 秒  | 到达 ended，readyState 4 |
| web-music-demo | v001     | H.264，1920 × 1080，30 fps，360 帧 | AAC  | 12.011 秒 | 到达 ended，readyState 4 |
| idea-to-motion | v002     | H.264，1920 × 1080，30 fps，540 帧 | AAC  | 18.005 秒 | 到达 ended，readyState 4 |

三支成片均通过完整 FFmpeg 解码、成片指纹和逐个输入快照指纹检查。已查看关键帧中的中文排版、图形和署名。原小样从 v001 再导出 v002，验证了版本目录递增且 v001 保留；原始 `out/idea-to-motion.mp4` 也保留。

浏览器验证使用可见视频页面、静音播放，从起点实际推进至结束，并记录时长与画幅。这是技术播放验证，不包含人的完整音乐试听或主观节奏评价。

## 网页音乐与恢复

原始网页与下载依据见 [Pixelland 来源记录](../projects/web-music-demo/music-source.md)。取得的 MP3 为 7,483,713 bytes，实测 233.796 秒，SHA-256：

```text
889fd6f06fd077689d512d4169a0efc4a61b717af73ac64ecca361eb5a4c4b7d
```

将原曲与配乐成片分别解码为 16 kHz 单声道 PCM，比较中段音频：相关度 `0.999908`，偏移 `0 ms`，幅度比例 `0.478489`，与源码设定的 0.48 音量及 AAC 编码相符。完整 12 秒输出的 RMS 为 `0.051568`，峰值为 `0.387024`，确认指定音乐已实际接入且没有整体静音或削波。淡入淡出参数由源码控制；未声称完成人耳试听。

在隔离临时工作区复制已登记的作品记录、不复制音乐文件，再从原站真实恢复下载；恢复指纹与原记录一致。第三方音乐与 out 产物均被 Git 忽略，来源和源码可以单独保存。

## 代码与命令

- `npm run lint`：ESLint、TypeScript 与 Node 脚本语法检查通过。
- `npm test`：5 项测试通过，覆盖作品隔离、重复 ID、路径与注册标记、真实媒体探测、本地 HTTP 下载、无效内容清理、缺失素材、用途记录、文件篡改以及恢复时上游内容改变。
- `npm run projects`：正确列出三支作品。
- `npm run new`：实际生成 hello-motion 并可预览、导出。
- `npm run assets:check -- web-music-demo`：真实下载素材检查通过。
- `npm run build`：使用 `--out-dir=out/bundle` 打包成功。
- 三支作品的统一 render 命令均成功，保存 MP4、关键帧、快照与 delivery；检查详情写入各版本 delivery.json。

单元测试的 HTTP 来源是本地服务器，另有上述原始音乐网站的真实下载及恢复检查，二者区分记录。模型 API、配音、字幕、其他动画引擎与跨工具合成尚未接入，也没有声称验证。

## 重复检查成片

```sh
npm run lint
npm test
npm run assets:check -- web-music-demo
npx remotion ffprobe -v error -show_format -show_streams -of json out/web-music-demo/v001/final.mp4
npx remotion ffmpeg -hide_banner -loglevel error -i out/web-music-demo/v001/final.mp4 -c:v libx264 -preset ultrafast -c:a pcm_s16le -f null -
```

当前随附 FFmpeg 是裁剪版本；完整解码命令指定可用编码器，不能假设有 `wrapped_avframe`、`select`、`tile` 或所有后期过滤器。更新制作工具时应重新核对所需能力。
