import console from "node:console";
import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  selectComposition,
  renderStill,
} from "@remotion/renderer";
import { readFile, mkdir } from "node:fs/promises";
const timeline = JSON.parse(
  await readFile("projects/access-denied/source/timeline.json", "utf8"),
);
const serveUrl = await bundle({
  entryPoint: "tools/remotion/index.ts",
  onProgress: () => {},
});
const browser = await openBrowser("chrome", { logLevel: "error" });
const composition = await selectComposition({
  serveUrl,
  id: "ProjectAccessDenied",
  puppeteerInstance: browser,
});
await mkdir("out/access-preview", { recursive: true });
const frames = timeline.scenes.map((s) => ({
  id: s.id,
  frame: s.from + Math.min(s.duration - 30, Math.round(s.duration * 0.47)),
}));
for (let i = 0; i < frames.length; i += 3) {
  await Promise.all(
    frames.slice(i, i + 3).map(async ({ id, frame }) => {
      await renderStill({
        serveUrl,
        composition,
        puppeteerInstance: browser,
        frame,
        output: `out/access-preview/${id}.png`,
        scale: 0.5,
        logLevel: "error",
      });
      console.log(id, frame);
    }),
  );
}
await browser.close({ silent: true });
