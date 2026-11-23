import { existsSync, createWriteStream } from "node:fs";
import { copyFile, mkdir, rename, rm, stat } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { pathToFileURL } from "node:url";
import { setDefaultResultOrder } from "node:dns";
import { setDefaultAutoSelectFamily } from "node:net";
import {
  assertId,
  checkAssets,
  fail,
  loadAssets,
  loadProject,
  probeMedia,
  readJson,
  root,
  sha256,
  within,
  writeJson,
} from "./workspace.mjs";

const extensions = {
  audio: [".mp3", ".wav", ".m4a", ".ogg", ".flac"],
  video: [".mp4", ".webm", ".mov"],
};

// Prefer IPv4 when both families exist. Node 20's short family-selection
// timeout can fail on otherwise reachable public music hosts.
setDefaultResultOrder("ipv4first");
setDefaultAutoSelectFamily(false);

export async function addAsset(
  base,
  projectId,
  recipePath,
  { restore = false } = {},
) {
  const project = await loadProject(base, projectId);
  const recipe = await readJson(recipePath);
  assertId(recipe.id);
  const data = await loadAssets(project);
  const existing = data.assets.find((a) => a.id === recipe.id);
  if (existing && !restore)
    throw new Error(
      `素材 ${recipe.id} 已登记，不会覆盖。恢复缺失文件请使用 npm run assets:restore。`,
    );
  if (!extensions[recipe.type])
    throw new Error(
      "当前下载/导入脚本支持 audio 和 video；其他素材可按同一记录格式接入。",
    );
  if (!recipe.role || !recipe.origin?.kind || !recipe.usage)
    throw new Error("缺少 role、origin 或 usage。");
  const sources = [recipe.source?.url, recipe.source?.file].filter(Boolean);
  if (sources.length !== 1)
    throw new Error("source 必须指定一个 url 或 file。");
  const web = Boolean(recipe.source.url);
  const url = web ? new URL(recipe.source.url) : null;
  if (
    web &&
    (!["https:", "http:"].includes(url.protocol) ||
      recipe.origin.kind !== "web" ||
      !recipe.origin.pageUrl)
  ) {
    throw new Error("网页素材需有 HTTP(S) 下载链接和原始来源页面。");
  }
  if (recipe.usage.status === "verified") {
    if (!recipe.usage.evidencePath)
      throw new Error("verified 用途需附证据路径，不会自动推断许可。");
    await stat(within(project.dir, recipe.usage.evidencePath));
    if (web && !recipe.usage.licenseUrl)
      throw new Error("网页素材缺少 licenseUrl。");
  } else if (recipe.usage.status !== "unverified") {
    throw new Error("usage.status 只能是 verified 或 unverified。");
  }
  const ext = extname(web ? url.pathname : recipe.source.file).toLowerCase();
  if (!extensions[recipe.type].includes(ext))
    throw new Error("下载/导入地址没有受支持的媒体扩展名。");
  const dir = resolve(base, "public", projectId, "external", recipe.type);
  const target = resolve(dir, `${recipe.id}${ext}`);
  if (existing && resolve(project.dir, existing.path) !== target)
    throw new Error("恢复请求与原素材路径不符，使用新 ID 导入替换素材。");
  if (existsSync(target)) {
    if (restore && existing && (await sha256(target)) === existing.sha256)
      return existing;
    throw new Error(
      `目标文件已存在：${recipe.id}${ext}。换新 ID，保留旧素材。`,
    );
  }
  await mkdir(dir, { recursive: true });
  const temp = `${target}.${process.pid}.part`;
  let published = false;
  try {
    if (web) {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(60_000),
      });
      if (!response.ok || !response.body)
        throw new Error(`下载失败：HTTP ${response.status}`);
      if (
        /text\/html|application\/json/.test(
          response.headers.get("content-type") ?? "",
        )
      ) {
        throw new Error("下载入口返回网页/JSON，未保存为音频。");
      }
      let bytes = 0;
      const limit = new Transform({
        transform(chunk, _encoding, done) {
          bytes += chunk.length;
          done(
            bytes > 128 * 1024 * 1024
              ? new Error("素材超过 128 MB；请使用本地导入。")
              : null,
            chunk,
          );
        },
      });
      await pipeline(
        Readable.fromWeb(response.body),
        limit,
        createWriteStream(temp, { flags: "wx" }),
      );
    } else {
      await copyFile(resolve(project.dir, recipe.source.file), temp);
    }
    const media = await probeMedia(temp);
    if (!media.streams.some((s) => s.type === recipe.type))
      throw new Error(`取得的文件不含 ${recipe.type} 轨道。`);
    let asset = {
      id: recipe.id,
      type: recipe.type,
      role: recipe.role,
      path: relative(project.dir, target).split("\\").join("/"),
      origin: recipe.origin,
      usage: recipe.usage,
      acquiredAt: new Date().toISOString(),
      bytes: (await stat(temp)).size,
      sha256: await sha256(temp),
      media,
    };
    if (existing) {
      if (asset.sha256 !== existing.sha256)
        throw new Error(
          "下载内容与原素材指纹不符；未恢复。为新内容使用新 ID。",
        );
      asset = { ...existing, restoredAt: new Date().toISOString() };
    }
    await rename(temp, target);
    published = true;
    await writeJson(resolve(project.dir, "assets.json"), {
      ...data,
      assets: existing
        ? data.assets.map((a) => (a.id === asset.id ? asset : a))
        : [...data.assets, asset],
    });
    return asset;
  } catch (error) {
    await rm(temp, { force: true });
    if (published) await rm(target, { force: true });
    throw error;
  }
}

async function main() {
  const [command, id, recipe] = process.argv.slice(2);
  if ((command === "add" || command === "restore") && recipe) {
    const asset = await addAsset(root, id, resolve(recipe), {
      restore: command === "restore",
    });
    console.log(
      `已登记 ${asset.id}：${asset.media.durationSeconds.toFixed(2)} 秒，${asset.bytes} bytes\nSHA-256 ${asset.sha256}`,
    );
  } else if (command === "check") {
    const project = await loadProject(root, id);
    const assets = await checkAssets(root, project, { delivery: true });
    console.log(
      `${id}：${assets.length} 个素材通过文件、指纹、媒体信息和用途记录检查。`,
    );
  } else {
    throw new Error(
      "用法：npm run asset:add -- <作品ID> <请求JSON>；npm run assets:restore -- <作品ID> <请求JSON>；npm run assets:check -- <作品ID>",
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch(fail);
}
