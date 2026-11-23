import { useCurrentFrame } from "remotion";
import { C, Confetti, Heart, pop, Stage, Word } from "../design";
import { World } from "../World";

export const MVUnderstand = () => {
  const f = useCurrentFrame();
  const really = f >= 35;
  return (
    <Stage offset={600} bg={C.blue} ink={C.cream}>
      <Heart
        color={C.lime}
        style={{
          left: 208,
          top: 786,
          width: 610,
          transform: `scale(${0.8 + pop(f, 3) * 0.2}) rotate(${Math.sin(f * 0.045) * 7}deg)`,
          opacity: 0.95,
        }}
      />
      <World mode="heart" offset={600} />
      <Word
        text={really ? "真的" : "这次"}
        key={really ? 1 : 0}
        at={really ? 35 : 0}
        size={266}
        style={{ top: 263 }}
      />
      <Word
        text="我懂了"
        at={13}
        size={229}
        color={C.lime}
        style={{ top: 568 }}
      />
      <Confetti offset={600} count={20} />
    </Stage>
  );
};
