import { useCurrentFrame } from "remotion";
import { C, Confetti, Flash, pop, Slip, Stage, Word } from "../design";
import { World } from "../World";

export const MVReprise = () => {
  const f = useCurrentFrame();
  const second = f >= 88;
  const local = second ? f - 88 : f;
  return (
    <Stage
      offset={977}
      bg={second ? C.blue : C.cream}
      ink={second ? C.cream : C.ink}
    >
      <World mode="orbit" offset={977} />
      <Word
        text="当然可以"
        at={second ? 88 : 0}
        cues={second ? [0, 9, 17, 26] : [0, 8, 12, 20]}
        key={second ? 1 : 0}
        size={214}
        color={second ? C.cream : C.ink}
        style={{ top: 290 }}
        tilt={second ? 3 : -3}
      />
      <Word
        text="好问题"
        at={second ? 120 : 26}
        cues={[0, 10, 19]}
        key={second ? 3 : 2}
        size={240}
        color={second ? C.lime : C.blue}
        style={{ top: 568 }}
      />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 + f * 0.019;
        const r = 390;
        return (
          <Slip
            key={i}
            text={["!", "?", "♡", "✦"][i % 4]}
            x={465 + Math.cos(a) * r}
            y={1140 + Math.sin(a) * r * 0.7}
            angle={f * 0.45 + i * 12}
            color={[C.lime, C.coral, C.lavender, C.cream][i % 4]}
            scale={pop(local, i * 2) * 0.58}
          />
        );
      })}
      <Confetti offset={977} start={second ? 88 : 0} count={18} />
      <Flash offset={977} />
    </Stage>
  );
};
