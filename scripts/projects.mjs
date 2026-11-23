import { mkdir, readFile, rm, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { assertId, fail, loadProject, root, writeJson } from "./workspace.mjs";

export async function createProject(base, id, title) {
  assertId(id);
  const dir = resolve(base, "projects", id);
  if (existsSync(dir)) throw new Error(`作品 ${id} 已存在，不会覆盖。`);
  if (!title?.trim() || title.length > 120)
    throw new Error("标题需为 1–120 个字符。");
  const entry = resolve(base, "tools/remotion/Root.tsx");
  const original = await readFile(entry, "utf8");
  const imports = "// framecraft:imports";
  const compositions = "{/* framecraft:compositions */}";
  if (
    original.split(imports).length !== 2 ||
    original.split(compositions).length !== 2
  ) {
    throw new Error(
      "Root.tsx 缺少唯一注册标记。请保留 framecraft:imports / framecraft:compositions。没有修改文件。",
    );
  }
  const component = `Project${id
    .split("-")
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("")}`;
  if (
    original.includes(`id="${component}"`) ||
    original.includes(`{ ${component} }`)
  ) {
    throw new Error(`Composition ${component} 已被使用，请换一个作品 ID。`);
  }
  const updated = original
    .replace(
      imports,
      `import { ${component} } from "../../projects/${id}/source/Film";\n${imports}`,
    )
    .replace(
      compositions,
      `<Composition\n        id="${component}"\n        component={${component}}\n        durationInFrames={180}\n        fps={30}\n        width={1920}\n        height={1080}\n      />\n      ${compositions}`,
    );
  await mkdir(resolve(dir, "source"), { recursive: true });
  try {
    await writeJson(resolve(dir, "project.json"), {
      schemaVersion: 1,
      id,
      title,
      production: { tool: "remotion", options: { compositionId: component } },
    });
    await writeFile(
      resolve(dir, "brief.md"),
      `# ${title}\n\n6 秒，1920 × 1080，30 fps。纯代码文字动画，无音乐，无外部素材获取步骤。\n\n根据实际需求修改 source/Film.tsx，并在 tools/remotion/Root.tsx 调整作品时长和画幅。\n`,
    );
    await writeFile(
      resolve(dir, "source/Film.tsx"),
      `import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../../../tools/remotion/fonts";

export const ${component} = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18 } });
  const fade = interpolate(frame, [durationInFrames - fps / 2, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#101b27", color: "#f1f5e8", fontFamily: font, justifyContent: "center", padding: 140 }}>
      <div style={{ opacity: fade, transform: \`translateY(\${(1 - enter) * 80}px)\` }}>
        <div style={{ fontSize: 25, letterSpacing: 8, color: "#bdea6c", marginBottom: 40 }}>FRAMECRAFT / ${id.toUpperCase()}</div>
        <div style={{ fontSize: 124, fontWeight: 700, lineHeight: 1.3 }}>{${JSON.stringify(title)}}</div>
        <div style={{ marginTop: 50, height: 6, background: "#bdea6c", width: interpolate(frame, [0, fps * 2], [0, 600], { extrapolateRight: "clamp" }) }} />
      </div>
    </AbsoluteFill>
  );
};
`,
    );
    await writeFile(entry, updated);
  } catch (error) {
    await rm(dir, { recursive: true, force: true });
    throw error;
  }
  return { id, compositionId: component, dir };
}

async function main() {
  const { positionals, values } = parseArgs({
    options: { title: { type: "string" } },
    allowPositionals: true,
  });
  const [command, id] = positionals;
  if (command === "list") {
    for (const entry of (await readdir(resolve(root, "projects"))).sort()) {
      if (!existsSync(resolve(root, "projects", entry, "project.json")))
        continue;
      const project = await loadProject(root, entry);
      console.log(
        `${project.id.padEnd(24)} ${project.production.tool.padEnd(10)} ${project.title}`,
      );
    }
  } else if (command === "new") {
    const result = await createProject(root, id, values.title ?? id);
    console.log(
      `已创建 ${result.id} → ${result.compositionId}\n预览：npm run dev\n导出：npm run render -- ${result.id}`,
    );
  } else {
    throw new Error(
      "用法：npm run projects；npm run new -- <作品ID> --title <标题>",
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch(fail);
}
