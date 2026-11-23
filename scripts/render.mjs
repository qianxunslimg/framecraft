import { existsSync, createWriteStream } from "node:fs";
import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { ensureBrowser } from "@remotion/renderer";
import {
  checkAssets,
  execute,
  fail,
  filesUnder,
  loadProject,
  probeMedia,
  readJson,
  remotion,
  root,
  sha256,
  writeJson,
} from "./workspace.mjs";

async function allocateVersion(id) {
  const dir = resolve(root, "out", id);
  await mkdir(dir, { recursive: true });
  for (let number = 1; number <= 9999; number++) {
    const version = `v${String(number).padStart(3, "0")}`;
    const path = resolve(dir, version);
    try {
      await mkdir(path);
      return { version, path };
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }
  throw new Error("版本目录已超过 9999。");
}

async function snapshotInputs(destination, assets, project) {
  const files = new Set();
  for (const dir of ["projects", "tools", "scripts", "public/shared"]) {
    for (const file of await filesUnder(resolve(root, dir))) files.add(file);
  }
  // Root imports every registered composition. Their module-level font loads
  // need owned assets even when a different composition is being exported.
  for (const item of await readdir(resolve(root, "public"), {
    withFileTypes: true,
  })) {
    if (!item.isDirectory() || item.name === "shared") continue;
    for (const file of await filesUnder(
      resolve(root, "public", item.name, "owned"),
    ))
      files.add(file);
  }
  for (const name of [
    "package.json",
    "package-lock.json",
    "remotion.config.ts",
    "tsconfig.json",
    "eslint.config.mjs",
    ".prettierrc",
    "AGENTS.md",
  ]) {
    if (existsSync(resolve(root, name))) files.add(resolve(root, name));
  }
  for (const asset of assets) files.add(resolve(project.dir, asset.path));
  const inputs = [];
  for (const source of [...files].sort()) {
    const path = relative(root, source);
    const target = resolve(destination, path);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(source, target);
    inputs.push({
      path: path.split("\\").join("/"),
      sha256: await sha256(target),
    });
  }
  const captured = new Map(inputs.map((input) => [input.path, input.sha256]));
  for (const asset of assets) {
    const path = relative(root, resolve(project.dir, asset.path))
      .split("\\")
      .join("/");
    if (captured.get(path) !== asset.sha256) {
      throw new Error(
        `素材 ${asset.id} 在检查与快照之间发生改变，尚未开始渲染。`,
      );
    }
  }
  return inputs;
}

function runNative(args, cwd, log) {
  return new Promise((success, reject) => {
    const output = createWriteStream(log, { flags: "a" });
    const child = spawn(remotion, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.pipe(output, { end: false });
    child.stderr.pipe(output, { end: false });
    child.on("error", (error) => {
      output.end();
      reject(error);
    });
    child.on("close", (code) => {
      output.end(() =>
        code === 0
          ? success()
          : reject(new Error(`Remotion 返回 ${code}，日志：${log}`)),
      );
    });
  });
}

async function gitState() {
  const get = async (args) => {
    try {
      return (await execute("git", args, { cwd: root })).stdout.trim();
    } catch {
      return null;
    }
  };
  return {
    commit: await get(["rev-parse", "HEAD"]),
    status: await get(["status", "--short"]),
  };
}

async function main() {
  const [id, ...extra] = process.argv.slice(2);
  if (!id || extra.length) throw new Error("用法：npm run render -- <作品ID>");
  const project = await loadProject(root, id);
  if (project.production.tool !== "remotion") {
    throw new Error(
      `工具 ${project.production.tool} 尚无导出脚本。按 docs/repository-design.md 接入它的原生入口。`,
    );
  }
  const compositionId = project.production.options?.compositionId;
  if (!/^[a-zA-Z0-9-]+$/.test(compositionId ?? ""))
    throw new Error("Composition ID 无效。");
  const assets = await checkAssets(root, project, { delivery: true });
  // Resolve the cached renderer before entering the version snapshot, whose
  // package.json would otherwise create a new, empty browser cache each time.
  const { path: browserExecutable } = await ensureBrowser({ logLevel: "error" });
  const { version, path: dir } = await allocateVersion(id);
  const startedAt = new Date().toISOString();
  const source = resolve(dir, "source");
  const final = resolve(dir, "final.mp4");
  const report = resolve(dir, "delivery.json");
  const log = resolve(dir, "render.log");
  const pkg = await readJson(resolve(root, "package.json"));
  const concurrency = Number(process.env.FRAMECRAFT_RENDER_CONCURRENCY ?? 2);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 8) {
    throw new Error("FRAMECRAFT_RENDER_CONCURRENCY 必须是 1 到 8 的整数。");
  }
  let delivery = {
    schemaVersion: 1,
    projectId: id,
    title: project.title,
    version,
    status: "rendering",
    startedAt,
    production: project.production,
    output: "final.mp4",
    sourceSnapshot: "source/",
    sourceGit: await gitState(),
    runtime: { node: process.version, remotion: pkg.dependencies.remotion },
    assets: assets.map((a) => ({
      id: a.id,
      path: a.path,
      sha256: a.sha256,
      origin: a.origin,
      usage: a.usage,
    })),
    renderOptions: { codec: "h264", crf: 18, concurrency, browserExecutable },
  };
  try {
    delivery.inputs = await snapshotInputs(source, assets, project);
    await writeJson(report, delivery);
    console.log(
      `${id} / ${version}：从本次源码与素材快照渲染，日志 ${relative(root, log)}`,
    );
    // Dependencies resolve from the workspace's node_modules; all creative inputs
    // and public assets are read from this version's snapshot, even with dirty Git.
    await runNative(
      [
        "render",
        "tools/remotion/index.ts",
        compositionId,
        final,
        "--codec=h264",
        "--crf=18",
        `--concurrency=${concurrency}`,
        `--browser-executable=${browserExecutable}`,
        "--log=error",
      ],
      source,
      log,
    );
    const media = await probeMedia(final);
    const video = media.streams.find((s) => s.type === "video");
    if (!video || media.durationSeconds <= 0)
      throw new Error("成片没有有效视频轨道。");
    if (
      assets.some((a) => a.type === "audio") &&
      !media.streams.some((s) => s.type === "audio")
    ) {
      throw new Error("作品登记了音频素材，但成片没有音轨；请检查时间轴接入。");
    }
    const frameCount =
      video.frames ??
      Math.round(
        media.durationSeconds *
          video.frameRate.split("/").reduce((a, b) => Number(a) / Number(b)),
      );
    const frames = [
      ...new Set([
        Math.min(30, frameCount - 1),
        Math.floor(frameCount / 2),
        Math.max(0, frameCount - 30),
      ]),
    ];
    await mkdir(resolve(dir, "keyframes"));
    for (let i = 0; i < frames.length; i++) {
      await runNative(
        [
          "still",
          "tools/remotion/index.ts",
          compositionId,
          resolve(dir, `keyframes/${i + 1}.png`),
          `--frame=${frames[i]}`,
          "--image-format=png",
          `--browser-executable=${browserExecutable}`,
          "--log=error",
        ],
        source,
        log,
      );
    }
    const credits = assets
      .filter((a) => a.usage.attribution)
      .map(
        (a) =>
          `${a.usage.attribution}\n来源：${a.origin.pageUrl ?? a.origin.kind}\n许可：${a.usage.licenseUrl ?? "见作品来源说明"}`,
      )
      .join("\n\n");
    const { writeFile } = await import("node:fs/promises");
    await writeFile(
      resolve(dir, "CREDITS.txt"),
      credits
        ? `${credits}\n`
        : "无要求署名的第三方音乐。字体许可见 source/public/shared/fonts/LICENSE.txt。\n",
    );
    delivery = {
      ...delivery,
      status: "complete",
      completedAt: new Date().toISOString(),
      media,
      sha256: await sha256(final),
      keyframes: frames.map((frame, i) => ({
        frame,
        path: `keyframes/${i + 1}.png`,
      })),
      credits: "CREDITS.txt",
      checks: {
        assets: "passed",
        mediaProbe: "passed",
        visualReview: "pending",
        playbackReview: "pending",
      },
    };
    await writeJson(report, delivery);
    console.log(
      `已导出 ${relative(root, final)}\n${video.width} × ${video.height}，${media.durationSeconds.toFixed(3)} 秒，${media.streams.map((s) => s.codec).join(" + ")}\n关键帧和 delivery.json 已保存；视觉及播放检查需实际执行后填写。`,
    );
  } catch (error) {
    await writeJson(report, {
      ...delivery,
      status: "failed",
      failedAt: new Date().toISOString(),
      error: error.message,
    });
    if (existsSync(log))
      console.error((await readFile(log, "utf8")).slice(-2000));
    throw error;
  }
}

main().catch(fail);
