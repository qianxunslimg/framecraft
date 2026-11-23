import { useCurrentFrame } from "remotion";
import { C, Flash, Slip, Spark, Stage, useBeat, Word } from "../design";
import { World } from "../World";

const CatchScene: React.FC<{ offset: number; repeat?: boolean }> = ({
  offset,
  repeat = false,
}) => {
  const f = useCurrentFrame();
  const { low } = useBeat(offset);
  const catchAt = repeat ? 45 : 77;
  const catching = f >= catchAt;
  const refusal = !repeat && f >= 39 && f < 77;
  const noIndex = Math.min(2, Math.floor((f - 39) / 10));
  return (
    <Stage
      offset={offset}
      bg={
        refusal ? [C.blue, C.lime, C.ink][noIndex] : repeat ? C.blue : C.cream
      }
      ink={
        refusal ? (noIndex === 1 ? C.ink : C.cream) : repeat ? C.cream : C.ink
      }
    >
      <World mode={refusal ? "tunnel" : "catch"} offset={offset} />
      {!catching && !refusal && (
        <>
          <Word
            text="我就"
            at={0}
            cues={[0, 13]}
            style={{ top: 236 }}
            size={270}
          />
          <Word
            text="在这"
            at={repeat ? 18 : 25}
            cues={[0, 8]}
            style={{ top: 525 }}
            size={286}
            color={repeat ? C.lime : C.blue}
          />
        </>
      )}
      {refusal && (
        <Word
          key={noIndex}
          text={["不躲", "不藏", "不逃"][noIndex]}
          at={39 + noIndex * 10}
          cues={[0, 5]}
          size={320}
          style={{ top: 445 }}
          color={noIndex === 1 ? C.ink : C.cream}
          tilt={noIndex === 1 ? -6 : 3}
        />
      )}
      {catching && (
        <>
          <Word
            text="稳稳地"
            at={catchAt}
            cues={[0, 15, 24]}
            size={224}
            style={{ top: 263 }}
          />
          <Word
            text="接住你"
            at={catchAt + (repeat ? 31 : 33)}
            cues={[0, 11, 22]}
            size={232}
            style={{
              top: 525,
              transform: `translateY(${low * -10}px) rotate(-3deg)`,
            }}
            color={repeat ? C.lime : C.blue}
          />
          {["?", "♡", "✦", "!"].map((s, i) => {
            const age = Math.max(0, f - catchAt - i * 15);
            const t = age % 64;
            const y =
              t < 32
                ? 760 + t * t * 0.47
                : 1240 - Math.sin(((t - 32) / 32) * Math.PI) * 185;
            return (
              <Slip
                key={i}
                text={s}
                x={120 + i * 211}
                y={y}
                angle={age * (i % 2 ? -2 : 2)}
                color={[C.lavender, C.coral, C.lime, C.cream][i]}
                scale={0.78}
              />
            );
          })}
        </>
      )}
      <svg
        width="1040"
        height="240"
        viewBox="0 0 1040 240"
        style={{
          position: "absolute",
          left: 5,
          top: 1490,
          opacity: catching ? 1 : 0.3,
        }}
      >
        <path
          d={`M20 42 Q520 ${150 + low * 42} 1015 42`}
          fill="none"
          stroke={repeat ? C.lime : C.blue}
          strokeWidth="18"
          strokeLinecap="round"
        />
        <circle cx="20" cy="42" r="22" fill={C.coral} />
        <circle cx="1015" cy="42" r="22" fill={C.coral} />
      </svg>
      <Spark
        x={840}
        y={785}
        size={66 + low * 25}
        angle={f * 1.4}
        color={C.coral}
      />
      <Flash offset={offset} />
    </Stage>
  );
};
export const MVCatch = () => <CatchScene offset={165} />;
export const MVCatchReturn = () => <CatchScene offset={881} repeat />;
