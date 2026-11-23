# Framecraft

个人 AI 动画创作工作区。每支作品保存需求、原生源码、素材来源和成片；AI 根据需求选择制作步骤。当前画面制作使用 Remotion，音乐可从本地导入、网页下载或程序生成。其他制作工具按实际作品接入。

本仓库由原来的 `remotion-lab` 本地小样演进，保留原 Git 历史。GitHub 仓库为 [qianxunslimg/framecraft](https://github.com/qianxunslimg/framecraft)，当前设为私有，本地 origin 已连接。

## 开始使用

需要 Node.js 20 或更新版本。

```sh
npm ci
npm run dev
```

打开终端打印的 Studio 地址，选择作品，空格播放。现有作品：

| 作品 ID          | Studio Composition   | 内容                          | 素材获取                 |
| ---------------- | -------------------- | ----------------------------- | ------------------------ |
| `idea-to-motion` | `IdeaToMotion`       | 18 秒中文动态排版，四幕与转场 | 原创合成音乐已随仓库保存 |
| `web-music-demo` | `WebMusicDemo`       | 12 秒像素节拍短片             | 网页音乐默认仅保存在本地 |
| `hello-motion`   | `ProjectHelloMotion` | 6 秒简单文字动画              | 无音乐，无下载步骤       |
| `web-journey`    | `ProjectWebJourney`  | 64 秒竖屏科普：网页如何诞生    | 优雅钢琴配乐 + 原创细节音效 |
| `web-beat`       | `ProjectWebBeat`     | 24 秒原创卡点样片：一次点击    | 原创 120 BPM 立体声配乐 |
| `of-course-mv` | `ProjectOfCourseMV` | 43.77 秒全段音乐 MV：当然可以，好问题 | 用户指定的十元钱钱对比视频音源 |

`Scenes` 中可以单独预览原小样的四个分镜。中文字体为完整的 Noto Sans CJK SC 本地 WOFF2，不依赖运行时字体服务，许可见 `public/shared/fonts/LICENSE.txt`。

《你打开一个网页，背后发生了什么？》以一束金色信号串起 DNS、TCP / TLS、HTTP、资源与浏览器绘制。作品采用 1080 × 1920 竖屏、独立的七幕和封面，详见 [创作说明](projects/web-journey/brief.md)。在 `WebJourney-Scenes` 可以逐幕预览，`WebJourneyCover` 是封面。恢复配乐与导出：

```sh
npm run assets:restore -- web-journey projects/web-journey/music-request.json
npm run render -- web-journey
```

[发布文案](projects/web-journey/publish.md) 包含音乐署名与内容参考。

《一次点击，世界回应你》是 24 秒竖屏节奏样片，音乐和六幕动作共用 120 BPM 时间轴。选择 `ProjectWebBeat` 预览；`WebBeat-Scenes` 支持逐幕编辑。[制作过程](projects/web-beat/production-notes.md) 区分抖音作者公开说明与本仓库实现，并保留可复用提示词。导出：`npm run render -- web-beat`。

## 最简单的创作流程

《当然可以，好问题 · 接住你的宇宙》是原创 3D 机器人与动态文字 MV，完整覆盖指定对比视频所用的 43.77 秒音源。在 `ProjectOfCourseMV` 播放，在 `OfCourse-Scenes` 单独编辑九幕。[制作说明](projects/of-course-mv/brief.md) 与[音源记录](projects/of-course-mv/music-source.md)保留这版音源和时间轴依据。音乐文件只在本地 external 目录，不随 Git 分发。导出：`npm run render -- of-course-mv`。

```sh
npm run new -- my-first-film --title '我的第一支动画'
npm run dev
npm run render -- my-first-film
```

新建命令生成一支可预览的 6 秒文字动画，并注册独立 Composition。编辑 `projects/my-first-film/source/Film.tsx`；画幅、帧率和时长在 `tools/remotion/Root.tsx` 中设置。需求明确时，直接让 AI 修改这些文件即可。

无音乐的作品只需 `brief.md`、`project.json` 和源码，不必创建素材记录、配置模型 API 或填通用流水线。

## 从网页找音乐

可以直接对 AI 说：“为这支片找一首无歌词、轻快的背景音乐，从原网站下载并接入。”AI 使用当前客户端的搜索和浏览器核实曲目与用途，然后调用仓库下载脚本。脚本负责下载、媒体探测、SHA-256 和来源登记，搜索与选曲由 AI 完成。

本仓库已实际使用作者网站上的 [Pixelland — Kevin MacLeod](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1500076)，署名要求及选择依据见 [来源记录](projects/web-music-demo/music-source.md)。音乐原文件在 `public/web-music-demo/external/audio/pixelland.mp3`，默认忽略 Git。

新 clone 或文件缺失时恢复音乐：

```sh
npm run assets:restore -- web-music-demo projects/web-music-demo/music-request.json
npm run assets:check -- web-music-demo
npm run render -- web-music-demo
```

恢复会比对已登记指纹，已有正确文件会直接复用。首次登记新素材使用：

```sh
npm run asset:add -- <作品ID> <素材请求JSON>
```

请求格式参考 `music-request.json`；本地导入用 `source.file` 替代 `source.url`，文件路径相对作品目录。当前脚本支持音频和视频。图片、字体和生成素材可使用同一 `assets.json` 记录格式，由对应工具保存本地文件。

缺失的网页音乐会在 Studio 中显示提示，正式导出会停止并给出具体缺失项。未知许可保留 `unverified`；用途核实需要来源说明，脚本不会自动判断许可。替换音乐使用新素材 ID，保留旧文件和已交付版本。详见 [音乐获取流程](docs/music-sourcing.md)。

## 导出与检查

```sh
npm run projects
npm run lint
npm test
npm run render -- idea-to-motion
```

每次导出创建新版本，不覆盖旧成片：

```text
out/<作品ID>/v001/
├── final.mp4          # H.264；有音乐时包含 AAC
├── keyframes/         # 三张关键帧
├── delivery.json      # 实际媒体信息、指纹、依赖、检查状态
├── CREDITS.txt        # 需要的音乐署名
├── render.log
└── source/            # 本次使用的源码、本地素材和依赖锁文件快照
```

渲染从本次快照读取创作输入，因此未提交的源码也随成片保留。快照不含 `node_modules`；需要重做时进入快照目录执行 `npm ci`，再使用原生命令或统一入口。浏览器和平台变化仍可能影响编码结果，不承诺跨环境二进制相同。

媒体探测通过后，`visualReview` 和 `playbackReview` 仍保持 `pending`，实际查看关键帧、播放成片后再填写检查结果。只有音轨存在不代表完成了试听。

第一次导出由 Remotion 下载 Chrome Headless Shell，并使用其随附的 FFmpeg/FFprobe。无需另装动画引擎或完整后期套件。原小样的 `out/idea-to-motion.mp4` 仍保留。

`npm run audio` 可重新生成原小样的确定性合成音乐；`npm run build` 打包当前 Remotion 入口到 `out/bundle`。

## 结构与扩展

```text
projects/<id>/         作品需求、身份、素材记录和原生 source
public/shared/         共用字体等本地素材
public/<id>/owned/     自有素材
public/<id>/external/  下载或导入的第三方素材，默认忽略 Git
tools/remotion/        Remotion 入口、作品注册及共用字体
scripts/               新建、下载、检查和导出命令
docs/                  架构与创作流程
out/                   按作品与版本保存的交付
```

新增网站或模型时，输出本地文件与来源记录；新增制作工具时，在 `tools/<工具>` 加原生入口，在作品 `production` 声明工具。当前统一新建与导出命令只实现 Remotion。跨工具片段合成、配音、字幕和网页管理界面按需求加入，边界见 [仓库设计](docs/repository-design.md)。

AI 工作规范见 [AGENTS.md](AGENTS.md)。本机已安装官方 Remotion skills；这些是 AI 编程指南，仓库运行不依赖 skill 安装。官方入口：[Remotion Agent Skills](https://www.remotion.dev/docs/ai/skills)。

实际验收结果、成片版本与验证边界见 [第一版验证](docs/verification.md)。
