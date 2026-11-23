import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { SECTIONS, TOTAL_FRAMES } from "./lyrics";
import { GlobalLyricBar } from "./stage";
import {
  IntroScene,
  PreChorusScene,
  Verse1GreenBombScene,
  Verse1MorningScene,
} from "./scenes/Act1IntroAndVerse1";
import { ChorusScene, InterludeDanceScene } from "./scenes/Act2ChorusAndDrop";
import {
  BridgeGreatWallScene,
  Verse2CodingScene,
  Verse2ExplodeScene,
} from "./scenes/Act3Verse2AndBridge";
import {
  FinalArcadeCurtainScene,
  OutroSunsetScene,
} from "./scenes/Act4OutroAndCredits";

export { TOTAL_FRAMES };

export const ProjectGreenButNotReady: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Audio
        src={staticFile(
          "green-but-not-ready/external/audio/green-but-not-ready-song.mp3",
        )}
        volume={(f) =>
          interpolate(
            f,
            [0, 6, durationInFrames - 18, durationInFrames],
            [0, 0.95, 0.95, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />

      <Sequence durationInFrames={SECTIONS.intro.dur}>
        <IntroScene />
      </Sequence>
      <Sequence from={SECTIONS.verse1a.from} durationInFrames={SECTIONS.verse1a.dur}>
        <Verse1MorningScene />
      </Sequence>
      <Sequence from={SECTIONS.verse1b.from} durationInFrames={SECTIONS.verse1b.dur}>
        <Verse1GreenBombScene />
      </Sequence>
      <Sequence from={SECTIONS.preChorus.from} durationInFrames={SECTIONS.preChorus.dur}>
        <PreChorusScene />
      </Sequence>
      <Sequence from={SECTIONS.chorus1.from} durationInFrames={SECTIONS.chorus1.dur}>
        <ChorusScene globalOffset={SECTIONS.chorus1.from} />
      </Sequence>
      <Sequence from={SECTIONS.interlude.from} durationInFrames={SECTIONS.interlude.dur}>
        <InterludeDanceScene />
      </Sequence>
      <Sequence from={SECTIONS.verse2a.from} durationInFrames={SECTIONS.verse2a.dur}>
        <Verse2CodingScene />
      </Sequence>
      <Sequence from={SECTIONS.verse2b.from} durationInFrames={SECTIONS.verse2b.dur}>
        <Verse2ExplodeScene />
      </Sequence>
      <Sequence from={SECTIONS.bridge.from} durationInFrames={SECTIONS.bridge.dur}>
        <BridgeGreatWallScene />
      </Sequence>
      <Sequence from={SECTIONS.chorus2.from} durationInFrames={SECTIONS.chorus2.dur}>
        <ChorusScene globalOffset={SECTIONS.chorus2.from} festive />
      </Sequence>
      <Sequence from={SECTIONS.outroVocal.from} durationInFrames={SECTIONS.outroVocal.dur}>
        <OutroSunsetScene />
      </Sequence>
      <Sequence from={SECTIONS.curtainCall.from} durationInFrames={SECTIONS.curtainCall.dur}>
        <FinalArcadeCurtainScene />
      </Sequence>

      <GlobalLyricBar />
    </AbsoluteFill>
  );
};
