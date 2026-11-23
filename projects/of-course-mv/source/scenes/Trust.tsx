import { useCurrentFrame } from "remotion";
import { C, Heart, pop, Slip, Stage, Word } from "../design";
import { World } from "../World";

export const MVTrust = () => {
  const f = useCurrentFrame();
  const thanks = f >= 53;
  return (
    <Stage offset={684}>
      <World mode="trust" offset={684} />
      {!thanks && (
        <>
          <Word text="把这一刻" at={0} size={177} style={{ top: 279 }} />
          <Word
            text="交给我"
            at={31}
            size={227}
            color={C.blue}
            style={{ top: 540 }}
          />
        </>
      )}
      {thanks && (
        <>
          <Word text="我很" at={53} size={270} style={{ top: 276 }} />
          <Word
            text="感激"
            at={66}
            size={295}
            color={C.coral}
            style={{ top: 572 }}
          />
        </>
      )}
      <div
        style={{
          position: "absolute",
          left: 115 + f * 3,
          top: 1500 - f * 3.1,
          transform: `rotate(${-22 + f * 0.22}deg) scale(${pop(f, 4) * 0.8})`,
        }}
      >
        <svg width="350" height="245" viewBox="0 0 350 245">
          <rect x="6" y="6" width="338" height="233" rx="25" fill={C.blue} />
          <path
            d="M10 21L175 144L340 21"
            fill="none"
            stroke={C.cream}
            strokeWidth="7"
          />
          <path
            d="M9 231L112 129M341 231L238 129"
            stroke="#ffffff33"
            strokeWidth="6"
          />
        </svg>
        <Heart style={{ left: 120, top: 100, width: 96 }} />
      </div>
      <Slip
        text="♡"
        x={748}
        y={1270 - Math.sin(f * 0.047) * 80}
        angle={13}
        color={C.lime}
        scale={pop(f, 22) * 0.7}
      />
    </Stage>
  );
};
