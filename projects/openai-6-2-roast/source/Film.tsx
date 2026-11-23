import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import {
  BulletproofLunchScene,
  PoliteFactoryScene,
} from "./scenes/DefensiveAnswers";
import {
  BubbleWrapCodeScene,
  GreenTestMagicScene,
  PolitePunchlineFinale,
} from "./scenes/DefensiveCode";

export const TOTAL_FRAMES = 900;

export const ProjectOpenai62Roast: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("openai-6-2-roast/external/audio/gummy-bear-stampede.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 12, durationInFrames - fps * 1.5, durationInFrames],
            [0, 0.82, 0.82, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />

      <Sequence durationInFrames={165}>
        <BulletproofLunchScene />
      </Sequence>
      <Sequence from={165} durationInFrames={210}>
        <PoliteFactoryScene />
      </Sequence>
      <Sequence from={375} durationInFrames={200}>
        <BubbleWrapCodeScene />
      </Sequence>
      <Sequence from={575} durationInFrames={170}>
        <GreenTestMagicScene />
      </Sequence>
      <Sequence from={745} durationInFrames={155}>
        <PolitePunchlineFinale />
      </Sequence>
    </AbsoluteFill>
  );
};
