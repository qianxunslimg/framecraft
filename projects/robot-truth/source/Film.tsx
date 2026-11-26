import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timelineData from "./timeline.json";
import { ForensicSubtitles, SceneTiming } from "./ForensicStage";
import { Forensic12Act, Forensic34Act, FourMasksAct, HookAct } from "./scenes/Acts1To4";
import { CheatsheetAct, FinaleAct, PlotTwistAct, VlaBrainAct } from "./scenes/Acts5To8";

interface TimelineFile {
  fps: number;
  duration: number;
  scenes: SceneTiming[];
  captions: Array<{ from: number; duration: number; text: string; highlight: string }>;
}

const timeline = timelineData as TimelineFile;
export const ROBOT_TRUTH_DURATION_FRAMES = timeline.duration;

const renderAct = (scene: SceneTiming) => {
  switch (scene.id) {
    case "hook":
      return <HookAct scene={scene} />;
    case "fourMasks":
      return <FourMasksAct scene={scene} />;
    case "forensic12":
      return <Forensic12Act scene={scene} />;
    case "forensic34":
      return <Forensic34Act scene={scene} />;
    case "plotTwist":
      return <PlotTwistAct scene={scene} />;
    case "vlaBrain":
      return <VlaBrainAct scene={scene} />;
    case "cheatsheet":
      return <CheatsheetAct scene={scene} />;
    case "finale":
      return <FinaleAct scene={scene} />;
    default:
      return null;
  }
};

export const ProjectRobotTruth: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04070f" }}>
      <Audio src={staticFile("robot-truth/owned/audio/master.wav")} />
      {timeline.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.from}
          durationInFrames={scene.duration}
          name={`RobotTruth-${scene.id}`}
        >
          {renderAct(scene)}
        </Sequence>
      ))}
      <ForensicSubtitles captions={timeline.captions} />
    </AbsoluteFill>
  );
};
