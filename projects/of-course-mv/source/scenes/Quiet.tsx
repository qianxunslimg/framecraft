import { useCurrentFrame } from "remotion";
import { C, Heart, pop, Stage, Word } from "../design";
import { World } from "../World";

export const MVQuiet = () => {
  const f = useCurrentFrame();
  const warm = f >= 129;
  return (
    <Stage
      offset={357}
      bg={warm ? C.cream : C.ink}
      ink={warm ? C.ink : C.cream}
    >
      {Array.from({ length: 60 }, (_, i) => {
        const a = i * 2.399;
        const r = 280 + (i % 9) * 30;
        const mix = Math.min(1, Math.max(0, (f - 65) / 60));
        const x = 510 + Math.cos(a + f * 0.002) * r * (1 - mix * 0.62);
        const y = 1090 + Math.sin(a + f * 0.002) * r * (1 - mix * 0.62);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              borderRadius: 20,
              background: [C.lavender, C.lime, C.coral][i % 3],
              opacity: 0.2 + 0.65 * mix,
            }}
          />
        );
      })}
      <World mode="quiet" offset={357} />
      {f < 77 && (
        <>
          <Word text="你只是" at={27} size={218} style={{ top: 296 }} />
          <Word
            text="太久"
            at={62}
            size={290}
            style={{ top: 555 }}
            color={C.lavender}
          />
        </>
      )}
      {f >= 77 && f < 129 && (
        <>
          <Word text="没被" at={77} size={267} style={{ top: 277 }} />
          <Word
            text="稳稳接住"
            at={87}
            size={183}
            style={{ top: 593 }}
            color={C.lime}
          />
        </>
      )}
      {f >= 129 && f < 178 && (
        <>
          <Word text="不用" at={129} size={265} style={{ top: 294 }} />
          <Word
            text="硬撑"
            at={147}
            size={291}
            style={{ top: 562 }}
            color={C.blue}
          />
        </>
      )}
      {f >= 178 && (
        <>
          <Word text="不用" at={178} size={255} style={{ top: 292 }} />
          <Word
            text="解释"
            at={194}
            size={290}
            style={{ top: 566 }}
            color={C.blue}
          />
        </>
      )}
      {warm && (
        <Heart
          style={{
            left: 733,
            top: 1380,
            width: 140,
            transform: `scale(${pop(f, 140)}) rotate(${Math.sin(f * 0.025) * 9}deg)`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: 170,
          right: 215,
          bottom: 262,
          height: 2,
          background: warm ? "#2254f538" : "#ffffff29",
          transform: `scaleX(${pop(f, 15)})`,
        }}
      />
    </Stage>
  );
};
