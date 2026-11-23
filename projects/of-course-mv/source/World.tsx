import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Shape } from "three";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, pop, useBeat } from "./design";

type Mode =
  | "hello"
  | "questions"
  | "catch"
  | "quiet"
  | "heart"
  | "trust"
  | "tunnel"
  | "orbit"
  | "final";
const rounded = (w: number, h: number, r: number) => {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

const Camera: React.FC<{ frame: number; mode: Mode }> = ({ frame, mode }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const tunnel = mode === "tunnel";
    const dist =
      mode === "quiet"
        ? 8.3
        : mode === "tunnel"
          ? 8.7
          : mode === "final"
            ? 9 + Math.max(0, frame - 70) * 0.018
            : 10;
    camera.position.set(
      Math.sin(frame * 0.014) * (tunnel ? 0.6 : mode === "catch" ? 0.65 : 0.27),
      tunnel ? Math.cos(frame * 0.018) * 0.3 : 0.15,
      dist,
    );
    camera.lookAt(0, -0.1, 0);
    camera.updateProjectionMatrix();
    if (tunnel) camera.rotation.z = Math.sin(frame * 0.025) * 0.09;
  }, [camera, frame, mode]);
  return null;
};

const Robot: React.FC<{
  f: number;
  beat: number;
  mode: Mode;
  small?: boolean;
}> = ({ f, beat, mode, small = false }) => {
  const visor = useMemo(() => rounded(1.62, 0.68, 0.25), []);
  const hello = mode === "hello";
  const opening = hello ? pop(f, 10) : 1;
  const fly = mode === "tunnel";
  const nod = beat * 0.07;
  const happy = mode === "heart" || mode === "final" || mode === "trust";
  const arm = happy ? 1.05 : mode === "catch" ? 0.86 + nod : 0.27;
  const turn = hello
    ? interpolate(f, [65, 91], [0, Math.PI * 2], clamp)
    : mode === "orbit"
      ? interpolate(f, [53, 84], [0, Math.PI * 2], clamp)
      : 0;
  return (
    <group
      position={[
        0,
        -1.05 +
          Math.sin(f * 0.045) * 0.1 +
          beat * (mode === "catch" ? 0.18 : 0.1),
        0.5,
      ]}
      rotation={[
        fly ? -0.16 : -0.03,
        turn + Math.sin(f * 0.023) * (fly ? 0.4 : 0.13),
        fly ? Math.sin(f * 0.027) * 0.25 : Math.sin(f * 0.019) * 0.035,
      ]}
      scale={(small ? 0.7 : 1) * opening}
    >
      <group scale={[1 + nod * 0.3, 1 - nod * 0.3, 1]}>
        <mesh position={[0, -0.61, 0]}>
          <capsuleGeometry args={[0.55, 0.55, 5, 24]} />
          <meshStandardMaterial
            color={C.cream}
            roughness={0.3}
            metalness={0.14}
          />
        </mesh>
        <mesh position={[0, 0.44, 0]} scale={[1.05, 0.85, 0.68]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial
            color={C.cream}
            roughness={0.25}
            metalness={0.18}
          />
        </mesh>
        <mesh position={[0, 0.53, 0.65]}>
          <extrudeGeometry
            args={[
              visor,
              {
                depth: 0.08,
                bevelEnabled: true,
                bevelSize: 0.035,
                bevelThickness: 0.025,
                bevelSegments: 3,
                steps: 1,
              },
            ]}
          />
          <meshStandardMaterial
            color={C.ink}
            roughness={0.25}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.4, 0.82]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.105, 0.018, 6, 24, Math.PI]} />
          <meshBasicMaterial color={C.lime} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh
              position={[side * 0.4, 0.55, 0.81]}
              rotation={[0, 0, happy ? side * -0.24 : 0]}
              scale={happy ? [1, 0.55, 1] : [1, 1, 1]}
            >
              <capsuleGeometry args={[0.066, 0.17, 4, 12]} />
              <meshBasicMaterial color={C.lime} />
            </mesh>
            <mesh
              position={[side * 1.02, 0.46, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.18, 0.18, 0.17, 20]} />
              <meshStandardMaterial
                color={C.blue}
                roughness={0.25}
                metalness={0.32}
              />
            </mesh>
            <group
              position={[side * 0.57, -0.35, 0.04]}
              rotation={[0, 0, side * arm]}
            >
              <mesh
                position={[side * 0.24, -0.3, 0]}
                rotation={[0, 0, side * 0.4]}
              >
                <capsuleGeometry args={[0.12, 0.4, 4, 12]} />
                <meshStandardMaterial color={C.blue} roughness={0.34} />
              </mesh>
              <mesh position={[side * 0.4, -0.66, 0.05]} scale={[1.2, 0.9, 1]}>
                <sphereGeometry args={[0.2, 16, 12]} />
                <meshStandardMaterial color={C.lime} roughness={0.32} />
              </mesh>
            </group>
            <mesh
              position={[side * 0.34, -1.4, 0.16]}
              scale={[0.9, 0.5, 1.5]}
              rotation={[0, side * 0.12, 0]}
            >
              <sphereGeometry args={[0.26, 20, 12]} />
              <meshStandardMaterial
                color={C.blue}
                roughness={0.22}
                metalness={0.12}
              />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.42, -0.05]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.03, 0.4, 3, 8]} />
          <meshStandardMaterial color={C.ink} metalness={0.5} roughness={0.2} />
        </mesh>
        <mesh position={[0.03, 1.69, -0.05]} scale={1 + beat * 0.15}>
          <sphereGeometry args={[0.115, 16, 12]} />
          <meshStandardMaterial
            color={C.lime}
            emissive={C.lime}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[0, -0.49, 0.51]}>
          <torusGeometry args={[0.1, 0.025, 8, 24]} />
          <meshStandardMaterial color={C.coral} />
        </mesh>
      </group>
    </group>
  );
};

const Trinket: React.FC<{ i: number; f: number; mode: Mode; beat: number }> = ({
  i,
  f,
  mode,
  beat,
}) => {
  const a = i * 2.399 + f * 0.008;
  const falling = mode === "catch" || mode === "final";
  const phase = ((f + i * 17) % 105) / 105;
  const x = falling
    ? Math.sin(i * 3.17) * 2.35
    : Math.cos(a) * (1.7 + (i % 3) * 0.22);
  const y = falling
    ? 3.7 -
      phase * 6.1 +
      (phase > 0.78 ? Math.sin(((phase - 0.78) / 0.22) * Math.PI) * 0.7 : 0)
    : Math.sin(a) * 2.55 - 0.2;
  const z = falling
    ? -0.6 + Math.cos(i) * 0.6
    : Math.sin(i * 1.71 + f * 0.013) * 1.15 - 1;
  const s = 0.15 + (i % 3) * 0.055 + beat * 0.015;
  const color = [C.blue, C.lime, C.coral, C.lavender][i % 4];
  return (
    <mesh
      position={[x, y, z]}
      scale={s}
      rotation={[f * 0.027 + i, f * 0.018, i + f * 0.013]}
    >
      {i % 3 === 0 ? (
        <boxGeometry args={[1.2, 1.2, 1.2]} />
      ) : i % 3 === 1 ? (
        <torusGeometry args={[0.65, 0.22, 8, 24]} />
      ) : (
        <icosahedronGeometry args={[0.8, 0]} />
      )}
      <meshStandardMaterial color={color} roughness={0.26} metalness={0.3} />
    </mesh>
  );
};

export const World: React.FC<{ mode: Mode; offset: number }> = ({
  mode,
  offset,
}) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { low } = useBeat(offset);
  const quiet = mode === "quiet";
  const tunnel = mode === "tunnel";
  const final = mode === "final";
  return (
    <ThreeCanvas
      width={width}
      height={height}
      dpr={1}
      camera={{ fov: 43, position: [0, 0.1, 10] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Camera frame={f} mode={mode} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[4, 6, 6]} intensity={3.5} color="#fff4db" />
      <directionalLight position={[-4, 1, 3]} intensity={2.3} color="#b9c8ff" />
      <pointLight position={[0, -2, 4]} intensity={12} color={C.lime} />
      {!tunnel && (
        <mesh
          position={[0, -2.61, -0.1]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1.45, 0.62, 1]}
        >
          <circleGeometry args={[1.25, 48]} />
          <meshBasicMaterial
            color={C.ink}
            transparent
            opacity={quiet ? 0.09 : 0.12}
          />
        </mesh>
      )}
      {(mode === "hello" || mode === "catch" || mode === "trust") && (
        <group
          position={[0, -2.58 + low * 0.04, 0]}
          rotation={[-Math.PI / 2, 0, f * 0.006]}
          scale={[1 + low * 0.04, 1 + low * 0.04, 0.6]}
        >
          <mesh>
            <torusGeometry args={[1.8, 0.115, 12, 64]} />
            <meshStandardMaterial
              color={mode === "trust" ? C.coral : C.blue}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        </group>
      )}
      {!quiet &&
        !tunnel &&
        Array.from({ length: final ? 17 : 10 }, (_, i) => (
          <Trinket key={i} i={i} f={f} mode={mode} beat={low} />
        ))}
      {(mode === "questions" ||
        mode === "heart" ||
        mode === "orbit" ||
        final) && (
        <group
          position={[0, -0.95, -1.8]}
          rotation={[0.4 + Math.sin(f * 0.012) * 0.12, f * 0.012, 0.35]}
          scale={final ? 0.65 + pop(f, 70) * 0.8 : 1}
        >
          {final && (
            <mesh>
              <sphereGeometry args={[1.62, 36, 24]} />
              <meshStandardMaterial
                color={C.blue}
                roughness={0.42}
                metalness={0.2}
              />
            </mesh>
          )}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              rotation={[(i * Math.PI) / 3, 0.3 + i * 0.5, i * 0.3]}
            >
              <torusGeometry args={[2.25 + i * 0.08, 0.048, 8, 64]} />
              <meshStandardMaterial
                color={[C.lime, C.coral, C.lavender][i]}
                roughness={0.22}
                metalness={0.3}
              />
            </mesh>
          ))}
        </group>
      )}
      {tunnel && (
        <group rotation={[0, 0, Math.sin(f * 0.013) * 0.18]}>
          {Array.from({ length: 12 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(i * 0.5) * 0.3,
                Math.cos(i * 0.8) * 0.25,
                -28 + ((i * 3.4 + f * 0.18) % 32),
              ]}
              rotation={[0, 0, i * 0.27 + f * 0.009]}
            >
              <torusGeometry args={[2.7, 0.09, 8, 4]} />
              <meshStandardMaterial
                color={[C.blue, C.lime, C.coral][i % 3]}
                roughness={0.3}
                metalness={0.25}
              />
            </mesh>
          ))}
        </group>
      )}
      <Robot f={f} beat={low} mode={mode} />
    </ThreeCanvas>
  );
};
