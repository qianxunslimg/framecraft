import { bundle } from "@remotion/bundler";
import process from "node:process";
import console from "node:console";
import {
  openBrowser,
  selectComposition,
  renderStill,
} from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
const frames = process.argv.slice(2).length
  ? process.argv.slice(2).map(Number)
  : [
      180, 470, 680, 1020, 1360, 1475, 1610, 1800, 2000, 2160, 2630, 2810, 3115,
      3290, 3500, 3650, 3975, 4180, 4510, 4800, 5030,
    ];
const serveUrl = await bundle({
  entryPoint: "tools/remotion/index.ts",
  onProgress: () => {},
});
const browser = await openBrowser("chrome", { logLevel: "error" });
const composition = await selectComposition({
  serveUrl,
  id: "ProjectGreenlightArcade",
  puppeteerInstance: browser,
});
const dir = "out/greenlight-arcade/review";
await mkdir(dir, { recursive: true });
try {
  for (let i = 0; i < frames.length; i += 3) {
    await Promise.all(
      frames.slice(i, i + 3).map(async (frame) => {
        await renderStill({
          serveUrl,
          composition,
          puppeteerInstance: browser,
          frame,
          output: `${dir}/${String(frame).padStart(5, "0")}.png`,
          scale: 1,
          logLevel: "error",
        });
        console.log("Frame", frame);
      }),
    );
  }
} finally {
  await browser.close({ silent: true });
}
