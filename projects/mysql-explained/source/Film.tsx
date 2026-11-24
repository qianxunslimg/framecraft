import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timelineData from "./timeline.json";
import { GlobalCaptionBar, SceneTiming } from "./stage";
import { ArchitectureScene, EnginesScene, IntroOverviewScene } from "./scenes/Act1ArchAndEngines";
import { BtreeIndexScene, TransactionsScene } from "./scenes/Act2IndexAndTx";
import { LocksScene, MvccScene } from "./scenes/Act3MvccAndLocks";
import { FinalePanoramaScene, LogsBufferScene } from "./scenes/Act4LogsAndFinale";

interface TimelineFile {
  fps: number;
  duration: number;
  scenes: SceneTiming[];
  captions: Array<{ from: number; duration: number; text: string; highlight: string }>;
}

const timeline = timelineData as TimelineFile;
export const MYSQL_DURATION_FRAMES = timeline.duration;

const renderScene = (scene: SceneTiming) => {
  switch (scene.id) {
    case "intro":
      return <IntroOverviewScene scene={scene} />;
    case "architecture":
      return <ArchitectureScene scene={scene} />;
    case "engines":
      return <EnginesScene scene={scene} />;
    case "btreeIndex":
      return <BtreeIndexScene scene={scene} />;
    case "transactions":
      return <TransactionsScene scene={scene} />;
    case "mvcc":
      return <MvccScene scene={scene} />;
    case "locks":
      return <LocksScene scene={scene} />;
    case "logsBuffer":
      return <LogsBufferScene scene={scene} />;
    case "finale":
      return <FinalePanoramaScene scene={scene} />;
    default:
      return null;
  }
};

export const ProjectMysqlExplained: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Audio src={staticFile("mysql-explained/owned/audio/master.wav")} />
      {timeline.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.from}
          durationInFrames={scene.duration}
          name={`MySQL-${scene.id}`}
        >
          {renderScene(scene)}
        </Sequence>
      ))}
      <GlobalCaptionBar captions={timeline.captions} />
    </AbsoluteFill>
  );
};
