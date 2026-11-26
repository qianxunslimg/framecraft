import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timelineData from "./timeline.json";
import { SceneTiming, TechSubtitles } from "./TechStage";
import { HookAct, PyramidAct, TrustChainAct, UnlockMagiskAct } from "./scenes/Acts1To4";
import { CatMouseAct, FinaleAct, PowersAct } from "./scenes/Acts5To7";

interface TimelineFile {
  fps: number;
  duration: number;
  scenes: SceneTiming[];
  captions: Array<{ from: number; duration: number; text: string; highlight: string }>;
}

const timeline = timelineData as TimelineFile;
export const PHONE_ROOT_DURATION_FRAMES = timeline.duration;

const renderAct = (scene: SceneTiming) => {
  switch (scene.id) {
    case "hook":
      return <HookAct scene={scene} />;
    case "pyramid":
      return <PyramidAct scene={scene} />;
    case "trustChain":
      return <TrustChainAct scene={scene} />;
    case "unlockMagisk":
      return <UnlockMagiskAct scene={scene} />;
    case "powers":
      return <PowersAct scene={scene} />;
    case "catMouse":
      return <CatMouseAct scene={scene} />;
    case "finale":
      return <FinaleAct scene={scene} />;
    default:
      return null;
  }
};

export const ProjectPhoneRoot: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04070f" }}>
      <Audio src={staticFile("phone-root/owned/audio/master.wav")} />
      {timeline.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.from}
          durationInFrames={scene.duration}
          name={`PhoneRoot-${scene.id}`}
        >
          {renderAct(scene)}
        </Sequence>
      ))}
      <TechSubtitles captions={timeline.captions} />
    </AbsoluteFill>
  );
};
