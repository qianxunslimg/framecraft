import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  useCurrentFrame,
} from "remotion";
import "../../../../tools/remotion/fonts";
import energy from "../audio-energy.json";
import type { Pen } from "./draw";

export type Painter = (
  ctx: Pen,
  frame: number,
  bass: number,
  onset: number,
) => void;
export const CanvasShot: React.FC<{ paint: Painter; offset: number }> = ({
  paint,
  offset,
}) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() =>
    delayRender("Load local typography for motion canvas"),
  );
  useEffect(() => {
    let alive = true;
    document.fonts.ready
      .then(() => document.fonts.load('700 120px "Framecraft Sans"'))
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
    const e = energy[Math.min(1312, Math.max(0, frame + offset))];
    c.resetTransform();
    c.globalAlpha = 1;
    c.clearRect(0, 0, 1080, 1920);
    c.save();
    paint(c, frame, e.low, e.onset);
    c.restore();
    continueRender(handle);
  }, [ready, frame, paint, offset, handle]);
  return (
    <canvas
      ref={ref}
      width={1080}
      height={1920}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
