import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { addAsset } from "../scripts/assets.mjs";
import { createProject } from "../scripts/projects.mjs";
import {
  checkAssets,
  loadProject,
  probeMedia,
  readJson,
  sha256,
  within,
  writeJson,
} from "../scripts/workspace.mjs";

async function workspace(t) {
  const base = await mkdtemp(resolve(tmpdir(), "framecraft-test-"));
  t.after(() => rm(base, { recursive: true, force: true }));
  await mkdir(resolve(base, "tools/remotion"), { recursive: true });
  await writeFile(
    resolve(base, "tools/remotion/Root.tsx"),
    `import { Composition } from "remotion";\n// framecraft:imports\nexport const Root = () => <>{/* manual content */}{/* framecraft:compositions */}</>;\n`,
  );
  return base;
}

function wav() {
  const rate = 8000;
  const data = Buffer.alloc(rate * 2);
  for (let n = 0; n < rate; n++)
    data.writeInt16LE(
      Math.round(Math.sin((n * 2 * Math.PI * 440) / rate) * 4000),
      n * 2,
    );
  const header = Buffer.alloc(44);
  header.write("RIFF");
  header.writeUInt32LE(data.length + 36, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

async function recipe(base, name, fields = {}) {
  const path = resolve(base, `${name}.json`);
  await writeJson(path, {
    id: name,
    type: "audio",
    role: "background-music",
    source: { file: "input.wav" },
    origin: { kind: "local", title: "Test tone" },
    usage: { status: "unverified" },
    ...fields,
  });
  return path;
}

test("new work is isolated, preserves hand-written entry content, and rejects duplicate IDs", async (t) => {
  const base = await workspace(t);
  const first = await createProject(base, "first-film", '中文 "标题"');
  const firstCode = await readFile(
    resolve(first.dir, "source/Film.tsx"),
    "utf8",
  );
  await createProject(base, "second-film", "Second");
  assert.equal(
    await readFile(resolve(first.dir, "source/Film.tsx"), "utf8"),
    firstCode,
  );
  const entry = await readFile(
    resolve(base, "tools/remotion/Root.tsx"),
    "utf8",
  );
  assert.match(entry, /manual content/);
  assert.match(entry, /id="ProjectFirstFilm"/);
  assert.match(entry, /id="ProjectSecondFilm"/);
  assert.equal(entry.split("framecraft:imports").length, 2);
  await assert.rejects(
    createProject(base, "first-film", "Replacement"),
    /已存在/,
  );
  assert.equal(
    await readFile(resolve(base, "tools/remotion/Root.tsx"), "utf8"),
    entry,
  );
  const project = await loadProject(base, "first-film");
  assert.deepEqual(await checkAssets(base, project, { delivery: true }), []);
});

test("invalid IDs and missing registration markers do not create half a project", async (t) => {
  const base = await workspace(t);
  await assert.rejects(createProject(base, "../escape", "Escape"), /ID/);
  assert.throws(() => within(base, "../escape"), /超出/);
  await writeFile(
    resolve(base, "tools/remotion/Root.tsx"),
    "// hand-written root without markers\n",
  );
  await assert.rejects(createProject(base, "safe", "Safe"), /注册标记/);
  await assert.rejects(readFile(resolve(base, "projects/safe/project.json")), {
    code: "ENOENT",
  });
});

test("local import records real media, blocks unknown usage at delivery, and detects modified files", async (t) => {
  const base = await workspace(t);
  const work = await createProject(base, "local-film", "Local");
  await writeFile(resolve(work.dir, "input.wav"), wav());
  const asset = await addAsset(base, work.id, await recipe(base, "tone"));
  const file = resolve(work.dir, asset.path);
  assert.equal(asset.sha256, await sha256(file));
  assert.equal(asset.media.durationSeconds, 1);
  assert.equal(asset.media.streams[0].channels, 1);
  const project = await loadProject(base, work.id);
  await assert.rejects(
    checkAssets(base, project, { delivery: true }),
    /用途尚未核实/,
  );
  await writeFile(file, Buffer.from("changed"));
  await assert.rejects(checkAssets(base, project), /SHA-256/);
  await assert.rejects(
    addAsset(base, work.id, await recipe(base, "tone")),
    /已登记/,
  );
});

test("web download saves playable bytes and provenance; HTML and invalid media leave no manifest entries", async (t) => {
  const base = await workspace(t);
  const work = await createProject(base, "web-film", "Web");
  const payload = wav();
  const server = createServer((req, res) => {
    if (req.url === "/tone.wav") {
      res.setHeader("Content-Type", "audio/wav");
      res.end(payload);
    } else if (req.url === "/html.mp3") {
      res.setHeader("Content-Type", "text/html");
      res.end("<html>login</html>");
    } else {
      res.setHeader("Content-Type", "audio/mpeg");
      res.end("invalid media");
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const url = `http://127.0.0.1:${server.address().port}`;
  const origin = {
    kind: "web",
    pageUrl: `${url}/source`,
    title: "Actual tone",
    creator: "Test",
  };
  await writeFile(
    resolve(work.dir, "evidence.md"),
    "Self-authored test tone, permission for test use.\n",
  );
  const usage = {
    status: "verified",
    evidencePath: "evidence.md",
    licenseUrl: `${url}/license`,
    attribution: "Test tone by Test",
  };
  const asset = await addAsset(
    base,
    work.id,
    await recipe(base, "web-tone", {
      source: { url: `${url}/tone.wav` },
      origin,
      usage,
    }),
  );
  assert.equal(asset.origin.pageUrl, `${url}/source`);
  assert.equal(asset.bytes, wav().length);
  assert.equal(
    (await probeMedia(resolve(work.dir, asset.path))).durationSeconds,
    1,
  );
  assert.equal(
    (
      await checkAssets(base, await loadProject(base, work.id), {
        delivery: true,
      })
    ).length,
    1,
  );
  await rm(resolve(work.dir, asset.path));
  const restored = await addAsset(
    base,
    work.id,
    await recipe(base, "web-tone", {
      source: { url: `${url}/tone.wav` },
      origin,
      usage,
    }),
    { restore: true },
  );
  assert.equal(restored.sha256, asset.sha256);
  assert.ok(restored.restoredAt);
  await assert.rejects(
    addAsset(
      base,
      work.id,
      await recipe(base, "html", {
        source: { url: `${url}/html.mp3` },
        origin,
      }),
    ),
    /返回网页/,
  );
  await assert.rejects(
    addAsset(
      base,
      work.id,
      await recipe(base, "invalid", {
        source: { url: `${url}/invalid.mp3` },
        origin,
      }),
    ),
  );
  assert.equal(
    (await readJson(resolve(work.dir, "assets.json"))).assets.length,
    1,
  );
  assert.deepEqual(
    await readdir(resolve(base, "public/web-film/external/audio")),
    ["web-tone.wav"],
  );
  await rm(resolve(work.dir, asset.path));
  payload[46] ^= 1;
  await assert.rejects(
    addAsset(
      base,
      work.id,
      await recipe(base, "web-tone", {
        source: { url: `${url}/tone.wav` },
        origin,
        usage,
      }),
      { restore: true },
    ),
    /指纹不符/,
  );
  assert.deepEqual(
    await readdir(resolve(base, "public/web-film/external/audio")),
    [],
  );
  assert.equal(
    (await readJson(resolve(work.dir, "assets.json"))).assets[0].sha256,
    asset.sha256,
  );
});

test("verified web usage requires local evidence; missing assets cannot be delivered", async (t) => {
  const base = await workspace(t);
  const work = await createProject(base, "missing-film", "Missing");
  await assert.rejects(
    addAsset(
      base,
      work.id,
      await recipe(base, "no-evidence", {
        source: { url: "https://example.com/track.mp3" },
        origin: { kind: "web", pageUrl: "https://example.com/track" },
        usage: {
          status: "verified",
          licenseUrl: "https://example.com/license",
        },
      }),
    ),
    /证据路径/,
  );
  await writeJson(resolve(work.dir, "assets.json"), {
    schemaVersion: 1,
    assets: [
      {
        id: "missing",
        type: "audio",
        role: "background-music",
        origin: { kind: "local" },
        path: "../../public/missing-film/external/missing.mp3",
        usage: { status: "verified" },
      },
    ],
  });
  await assert.rejects(
    checkAssets(base, await loadProject(base, work.id), { delivery: true }),
    /缺少素材/,
  );
});
