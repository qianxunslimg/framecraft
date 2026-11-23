import { useCurrentFrame } from "remotion";
import { C, Confetti, Flash, pop, Spark, Stage, Word } from "../design";
import { World } from "../World";

export const MVOpening = () => {
  const f = useCurrentFrame();
  const second = f >= 95;
  const local = second ? f - 95 : f;
  const blue = second;
  return (
    <Stage offset={0} bg={blue ? C.blue : C.cream} ink={blue ? C.cream : C.ink}>
      <World mode={second ? "questions" : "hello"} offset={0} />
      <Word
        text="当然可以"
        at={second ? 95 : 0}
        cues={second ? [0, 18, 23, 27] : [0, 9, 22, 27]}
        size={215}
        style={{ top: 286 }}
        color={blue ? C.cream : C.ink}
      />
      <Word
        text="好问题"
        at={second ? 128 : 31}
        cues={[0, 11, 21]}
        size={246}
        color={blue ? C.lime : C.blue}
        style={{ top: 555 }}
        tilt={-3}
      />
      <div
        style={{
          position: "absolute",
          left: 156,
          top: 1480,
          width: 690,
          height: 120,
          borderRadius: 70,
          background: C.lime,
          color: C.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 25,
          fontSize: 60,
          fontWeight: 800,
          transform: `scale(${pop(local, 6)}) rotate(${-2 + Math.sin(f * 0.08) * 2}deg)`,
          boxShadow: `0 12px 0 ${blue ? "#1534ab" : "#182744"}`,
        }}
      >
        <span>✓</span>全部接住
      </div>
      {f < 32 && (
        <svg
          width="110"
          height="160"
          viewBox="0 0 110 160"
          style={{
            position: "absolute",
            left: 780 - f * 3,
            top: 1430 + Math.sin(f * 0.13) * 30,
            transform: "rotate(-22deg)",
          }}
        >
          <path
            d="M15 5L93 98L61 103L82 144L58 156L38 114L15 137Z"
            fill={C.cream}
            stroke={C.ink}
            strokeWidth="7"
          />
        </svg>
      )}
      {second && <Confetti offset={0} start={95} count={18} />}
      <Spark
        x={80}
        y={760}
        size={92}
        color={blue ? C.coral : C.lime}
        angle={f * 2}
      />
      <Spark
        x={860}
        y={233}
        size={62}
        color={blue ? C.lime : C.coral}
        angle={-f * 2}
      />
      <Flash offset={0} />
    </Stage>
  );
};
