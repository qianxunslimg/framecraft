import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  useCurrentFrame,
} from "remotion";
import "../../../tools/remotion/fonts";
import { C, caption, sweep, lyric, ease, type Pen } from "./draw";
export type Paint = (c: Pen, f: number, g: number, duration: number) => void;
export function Stage({
  paint,
  offset,
  duration,
  lyrics = true,
}: {
  paint: Paint;
  offset: number;
  duration: number;
  lyrics?: boolean;
}) {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const [handle] = useState(() => delayRender("Loading local MV fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all([
      document.fonts.load('700 120px "Framecraft Sans"'),
      document.fonts.load('400 50px "Framecraft Sans"'),
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
    c.clearRect(0, 0, 1920, 1080);
    c.save();
    if (lyrics) {
      const cue = lyric(frame + offset);
      const zooms = [1.03, 1.09, 1.14, 1.04, 1.05, 1.08, 1.07, 1.1];
      const base = zooms[Math.max(0, cue.i) % zooms.length];
      const z = base + 0.027 * ease(cue.local / 70);
      c.translate(960, 500);
      c.scale(z, z);
      c.translate(-960, -500 + Math.sin(frame * 0.009) * 5);
    }
    paint(c, frame, frame + offset, duration);
    c.restore();
    if (lyrics) caption(c, frame + offset);
    if (offset > 0)
      sweep(c, frame, offset === 4455 ? 100000 : duration, C.lime);
    continueRender(handle);
  }, [frame, ready, paint, offset, duration, lyrics, handle]);
  return (
    <canvas
      ref={ref}
      width={1920}
      height={1080}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
