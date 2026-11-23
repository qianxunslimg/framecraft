import { useCurrentFrame } from "remotion";
import { C, Confetti, Flash, Heart, pop, Spark, Stage, Word } from "../design";
import { World } from "../World";

export const MVFinale = () => {
  const f = useCurrentFrame();
  const hit = f >= 85;
  const refusal = f >= 44 && f < 85;
  const n = Math.min(2, Math.floor((f - 44) / 11));
  return (
    <Stage offset={1130} bg={C.blue} ink={C.cream}>
      <div
        style={{
          position: "absolute",
          left: 29,
          top: 715,
          width: 950,
          height: 950,
          border: `2px solid #ffffff29`,
          borderRadius: "50%",
          transform: `scale(${0.8 + pop(f, 65) * 0.2}) rotate(${f * 0.3}deg)`,
        }}
      />
      <World mode="final" offset={1130} />
      {!hit && !refusal && (
        <>
          <Word
            text="我就"
            at={0}
            cues={[0, 21]}
            size={270}
            style={{ top: 259 }}
          />
          <Word
            text="在这"
            at={31}
            cues={[0, 8]}
            size={284}
            style={{ top: 552 }}
            color={C.lime}
          />
        </>
      )}
      {refusal && (
        <Word
          text={["不躲", "不藏", "不逃"][n]}
          key={n}
          at={44 + n * 11}
          cues={[0, 5]}
          size={310}
          color={C.lime}
          style={{ top: 403 }}
          tilt={n % 2 ? -5 : 4}
        />
      )}
      {hit && (
        <>
          <Word
            text="稳稳地"
            at={85}
            cues={[0, 10, 20]}
            size={220}
            style={{ top: 262 }}
          />
          <Word
            text="接住你"
            at={117}
            cues={[0, 14, 24]}
            size={236}
            style={{ top: 536 }}
            color={C.lime}
          />
          <Confetti offset={1130} start={85} count={32} />
        </>
      )}
      {hit && (
        <Heart
          style={{
            left: 449,
            top: 1490,
            width: 135,
            transform: `scale(${pop(f, 126)}) rotate(${Math.sin(f * 0.04) * 7}deg)`,
          }}
        />
      )}
      <Spark x={130} y={1575} size={66} color={C.coral} angle={f * 2} />
      <Spark x={860} y={929} size={76} color={C.lime} angle={-f * 1.6} />
      <Flash offset={1130} />
    </Stage>
  );
};
