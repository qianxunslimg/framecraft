import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "../../../tools/remotion/fonts";
import timing from "./timeline.json";
import { C, H, W, line, text, clamp } from "./draw";
import type { Pen } from "./draw";

export type Scene = (typeof timing.scenes)[number];
export type Paint = (
  c: Pen,
  f: number,
  scene: Scene,
  images: Record<string, HTMLImageElement>,
) => void;
export function stage(scene: Scene, f: number) {
  let i = 0;
  scene.cues.forEach((q, n) => {
    if (f >= q.from) i = n;
  });
  return { index: i, frame: f - (scene.cues[i]?.from ?? 0) };
}
const imageCache: Record<string, HTMLImageElement> = {};
export function Shot({ id, paint }: { id: string; paint: Paint }) {
  const f = useCurrentFrame(),
    ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() =>
    delayRender("Local fonts and editorial portrait"),
  );
  const scene = timing.scenes.find((s) => s.id === id)!;
  useEffect(() => {
    let alive = true;
    const images = imageCache.dario
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            imageCache.dario = img;
            resolve();
          };
          img.onerror = () => reject(new Error("Portrait failed to load"));
          img.src = staticFile("access-denied/external/images/dario.jpg");
        });
    Promise.all([
      document.fonts.ready.then(() =>
        document.fonts.load('700 90px "Framecraft Sans"'),
      ),
      images,
    ])
      .then(() => {
        if (alive) setReady(true);
      })
      .catch(cancelRender);
    return () => {
      alive = false;
      continueRender(handle);
    };
  }, [handle]);
  useLayoutEffect(() => {
    if (!ready || !ref.current) return;
    const c = ref.current.getContext("2d")!;
    c.resetTransform();
    c.globalAlpha = 1;
    c.clearRect(0, 0, W, H);
    c.save();
    paint(c, f, scene, imageCache);
    c.restore();
    if (id !== "postscript") {
      // Fixed editorial labels, kept out of the explanatory action and captions.
      const g = c.createLinearGradient(0, 0, 0, 145);
      g.addColorStop(0, "rgba(6,10,15,.85)");
      g.addColorStop(1, "rgba(6,10,15,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, W, 145);
      text(c, scene.chapter, 84, 62, 25, C.paper, 400);
      text(c, "ACCESS / DENIED", 1836, 62, 22, C.muted, 400, "right");
      if (scene.source) {
        text(c, scene.source, 84, 1040, 21, C.muted);
      }
      line(c, 84, 1008, 1836, 1008, "#293440", 1);
      line(
        c,
        84,
        1008,
        84 + 1752 * clamp((scene.from + f) / timing.duration),
        1008,
        C.orange,
        2,
      );
    }
    const caption = timing.captions.find(
      (q) => scene.from + f >= q.from && scene.from + f < q.from + q.duration,
    );
    if (caption && id !== "postscript") {
      c.font = '400 41px "Framecraft Sans"';
      const width = c.measureText(caption.text).width;
      c.fillStyle = "rgba(6,10,15,.9)";
      c.beginPath();
      c.roundRect((W - width) / 2 - 26, 925, width + 52, 68, 8);
      c.fill();
      text(c, caption.text, 960, 959, 41, C.white, 400, "center");
    }
    // Subtle motivated shutter on the cut, not a long fade between slides.
    if (f < 7) {
      c.fillStyle = C.ink;
      c.fillRect(0, 0, W, H * (1 - f / 7));
    }
    continueRender(handle);
  }, [f, ready, paint, scene, handle, id]);
  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
