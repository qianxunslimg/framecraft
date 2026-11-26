import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timelineData from "./timeline.json";
import { CinemaCaptionBar, SceneTiming } from "./hud";
import { IntroScene, LevelsScene, SensorsScene } from "./scenes/Acts1To3";
import { EvoMapBevScene, LocalizationScene, PncControlScene } from "./scenes/Acts4To6";
import { EvoE2eVlaScene, FinaleScene, LongTailScene } from "./scenes/Acts7To9";

interface TimelineFile {
  fps: number;
  duration: number;
  scenes: SceneTiming[];
  captions: Array<{ from: number; duration: number; text: string; highlight: string }>;
}

const timeline = timelineData as TimelineFile;
export const AUTODRIVE_DURATION_FRAMES = timeline.duration;

const renderScene = (scene: SceneTiming) => {
  switch (scene.id) {
    case "intro":
      return <IntroScene scene={scene} />;
    case "levels":
      return <LevelsScene scene={scene} />;
    case "sensors":
      return <SensorsScene scene={scene} />;
    case "localization":
      return <LocalizationScene scene={scene} />;
    case "pncControl":
      return <PncControlScene scene={scene} />;
    case "evoMapBev":
      return <EvoMapBevScene scene={scene} />;
    case "evoE2eVla":
      return <EvoE2eVlaScene scene={scene} />;
    case "longTail":
      return <LongTailScene scene={scene} />;
    case "finale":
      return <FinaleScene scene={scene} />;
    default:
      return null;
  }
};

export const ProjectAutodriveExplained: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#03060f" }}>
      <Audio src={staticFile("autodrive-explained/owned/audio/master.wav")} />
      {timeline.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.from}
          durationInFrames={scene.duration}
          name={`AutoDrive-${scene.id}`}
        >
          {renderScene(scene)}
        </Sequence>
      ))}
      <CinemaCaptionBar captions={timeline.captions} />
    </AbsoluteFill>
  );
};
