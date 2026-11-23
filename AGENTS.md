# Framecraft AI 创作规范

先看 README 与目标作品的 brief、project、已有源码和素材记录，再执行用户要求。日常用中文沟通，说明实际作品路径与验证结果。清晰的请求直接制作，简单作品可跳过素材、配音或独立合成。

## 作品与制作

- 一支作品归 `projects/<id>/`，保持其他作品不受干扰。
- 当前新建：`npm run new -- <id> --title '<标题>'`。这是可运行的无音乐起点，后续按需求改画面。
- 当前预览：`npm run dev`，选择对应 Composition。
- Remotion 使用帧驱动动画、原生 Composition 和时间轴；保留 `Root.tsx` 中两个 `framecraft:` 注册标记。每个独立 Composition 用明确 JSX 注册，Studio 可直接调整配置。
- 时长、画幅与 fps 的执行值归原生制作入口；brief 记录目标，delivery 记录实测结果。
- 新工具保留原生源码，接入 `tools/<tool>/`。当前只实现 Remotion 的新建和导出；需要其他工具时，先完成实际入口与例子，再声明支持。

## 素材获取

- 用户指定音乐来源时遵守指定来源。允许网页选曲时，使用当前 AI 客户端搜索和浏览器，进入原始曲目页核实作者、下载入口与用途。
- 网站名字、可下载、可用于作品是不同事实；未知信息不猜测。没有实际听到音乐时，报告播放或音频分析结果，不声称主观试听。
- 为新素材写请求 JSON，参考 `projects/web-music-demo/music-request.json`。URL 来自网站实际下载入口；不在可提交文件保存凭据、临时签名链接。
- `npm run asset:add -- <id> <请求JSON>` 下载或导入音视频并登记实际媒体信息。已有记录的缺失文件用 `npm run assets:restore -- <id> <请求JSON>`，恢复比对原指纹。
- 素材保存在本地 public，登记 `assets.json`。第三方文件默认放 external、忽略 Git。用于正式交付的 usage 需有实际核对依据；要署名的素材在视频或交付说明中署名。
- AI 图片、配音、程序合成也使用本地文件与 origin 记录；工具与提示词/参数随生成结果保存。只在用到时加入模型依赖或脚本。
- 替换素材用新 ID。逐帧渲染不搜索、下载或生成素材。

## 验证与交付

- 代码修改后按范围运行 `npm run lint`。修改下载、新建或检查命令时运行 `npm test`；这些测试使用临时作品、真实媒体探测和本地 HTTP 下载，不能当作真实音乐网站验收。
- 正式导出：`npm run assets:check -- <id>`、`npm run render -- <id>`。无素材作品自动跳过获取。
- 每次导出保存新版本、输入快照、媒体探测、关键帧和来源署名。失败状态保留真实原因，不能写成已交付。
- 查看关键帧、实际播放视频；有音乐时检查音轨确实来自选定曲目及剪辑音量。不能仅凭导出成功声称完整检查。
- 检查结果填入该版本 delivery 的 checks，保留方式和时间。源代码修改不会更新已交付版本。
- 交付说明指出现有实现、未接入的扩展和未验证的部分。提交、推送、发布按用户请求执行。

<!-- CODEGRAPH_START -->

## CodeGraph

If a `.codegraph/` directory exists at the repository root, use CodeGraph before grep/find or reading files to understand or locate code. Prefer `codegraph_explore` (MCP) or `codegraph explore "<question>"`. If no `.codegraph/` exists, skip it; indexing is the user's decision.

<!-- CODEGRAPH_END -->
