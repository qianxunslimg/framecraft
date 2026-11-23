import { useCurrentFrame } from "remotion";
import { C, Flash, Stage, Word } from "../design";
import { World } from "../World";

export const MVTunnel = () => {
  const f = useCurrentFrame();
  const n = Math.min(2, Math.floor(f / 35));
  const bg = [C.blue, C.ink, C.lime][n];
  const ink = n === 2 ? C.ink : C.cream;
  return (
    <Stage offset={777} bg={bg} ink={ink}>
      <World mode="tunnel" offset={777} />
      <div
        style={{
          position: "absolute",
          left: -230,
          top: 1520,
          fontSize: 190,
          fontWeight: 900,
          whiteSpace: "nowrap",
          color: ink,
          opacity: 0.14,
          transform: `translateX(${-f * 9}px) rotate(-12deg)`,
        }}
      >
        不躲 / 不藏 / 不逃 / 不躲 / 不藏 / 不逃
      </div>
      <Word
        text={["不躲", "不藏", "不逃"][n]}
        at={n * 35}
        key={n}
        size={330}
        style={{ top: 355 }}
        color={ink}
        tilt={n === 1 ? -8 : 5}
      />
      <Flash offset={777} color={C.coral} />
    </Stage>
  );
};
