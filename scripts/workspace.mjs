import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const execute = promisify(execFile);
export const remotion = resolve(root, "node_modules/.bin/remotion");

export function assertId(id) {
  if (typeof id !== "string" || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(id)) {
    throw new Error(
      "ID 必须为 1–64 位小写字母、数字或连字符，首字符不能是连字符。",
    );
  }
  return id;
}

export function within(base, path) {
  const target = resolve(base, path);
  const rel = relative(base, target);
  if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error(`路径超出工作区：${path}`);
  }
  return target;
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

export async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  const temp = `${path}.${process.pid}.part`;
  await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`);
  await rename(temp, path);
}

export async function loadProject(base, id) {
  assertId(id);
  const dir = resolve(base, "projects", id);
  if (!existsSync(resolve(dir, "project.json"))) {
    throw new Error(
      `作品 ${id} 不存在。先运行 npm run projects 查看已有作品。`,
    );
  }
  const project = await readJson(resolve(dir, "project.json"));
  if (
    project.schemaVersion !== 1 ||
    project.id !== id ||
    !project.production?.tool
  ) {
    throw new Error(`${id}/project.json 的版本、ID 或制作入口无效。`);
  }
  return { ...project, dir };
}

export async function loadAssets(project) {
  const path = resolve(project.dir, "assets.json");
  if (!existsSync(path)) return { schemaVersion: 1, assets: [] };
  const data = await readJson(path);
  if (data.schemaVersion !== 1 || !Array.isArray(data.assets)) {
    throw new Error(`${project.id}/assets.json 格式无效。`);
  }
  const ids = new Set();
  for (const asset of data.assets) {
    assertId(asset.id);
    if (
      typeof asset.path !== "string" ||
      !asset.path ||
      isAbsolute(asset.path) ||
      !asset.type ||
      !asset.role ||
      !asset.origin?.kind
    ) {
      throw new Error(`素材 ${asset.id} 缺少类型、角色、来源或相对路径。`);
    }
    if (ids.has(asset.id)) throw new Error(`重复素材 ID：${asset.id}`);
    ids.add(asset.id);
  }
  return data;
}

export async function sha256(path) {
  return createHash("sha256")
    .update(await readFile(path))
    .digest("hex");
}

export async function probeMedia(path) {
  const { stdout } = await execute(
    remotion,
    [
      "ffprobe",
      "-v",
      "error",
      "-show_format",
      "-show_streams",
      "-of",
      "json",
      path,
    ],
    { timeout: 30_000, maxBuffer: 2 * 1024 * 1024 },
  );
  const data = JSON.parse(stdout);
  const durationSeconds = Number(data.format?.duration);
  if (!(durationSeconds > 0) || !data.streams?.length) {
    throw new Error("媒体没有有效时长或音视频轨道。");
  }
  return {
    durationSeconds,
    streams: data.streams.map((s) => ({
      type: s.codec_type,
      codec: s.codec_name,
      ...(s.codec_type === "audio"
        ? { sampleRate: Number(s.sample_rate), channels: s.channels }
        : {}),
      ...(s.codec_type === "video"
        ? {
            width: s.width,
            height: s.height,
            frameRate: s.r_frame_rate,
            frames: Number(s.nb_frames) || null,
          }
        : {}),
    })),
  };
}

export async function checkAssets(base, project, { delivery = false } = {}) {
  const { assets } = await loadAssets(project);
  const publicDir = resolve(base, "public");
  for (const asset of assets) {
    const file = within(
      publicDir,
      relative(publicDir, resolve(project.dir, asset.path)),
    );
    if (!existsSync(file) || !(await stat(file)).isFile()) {
      throw new Error(
        `缺少素材 ${asset.id}：${asset.path}。请先下载/导入该素材。`,
      );
    }
    if (!asset.sha256 || (await sha256(file)) !== asset.sha256) {
      throw new Error(
        `素材 ${asset.id} 的 SHA-256 不匹配；重新登记实际使用的文件。`,
      );
    }
    if (delivery && asset.usage?.status !== "verified") {
      throw new Error(
        `素材 ${asset.id} 的用途尚未核实；补充 usage 和来源证据后再交付。`,
      );
    }
    if (delivery && asset.origin?.kind === "web") {
      if (
        !asset.origin.pageUrl ||
        !asset.usage?.licenseUrl ||
        !asset.usage?.evidencePath
      ) {
        throw new Error(`网页素材 ${asset.id} 缺少来源、许可证或证据路径。`);
      }
      await stat(within(project.dir, asset.usage.evidencePath));
    }
    if (asset.type === "audio" || asset.type === "video") {
      const media = await probeMedia(file);
      if (!media.streams.some((s) => s.type === asset.type)) {
        throw new Error(`素材 ${asset.id} 不是有效的 ${asset.type} 文件。`);
      }
    }
  }
  return assets;
}

export async function filesUnder(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, item.name);
    if (item.isDirectory()) files.push(...(await filesUnder(path)));
    else if (item.isFile()) files.push(path);
    else throw new Error(`快照不支持符号链接：${path}`);
  }
  return files.sort();
}

export function fail(error) {
  console.error(`Framecraft: ${error.message}`);
  process.exitCode = 1;
}
