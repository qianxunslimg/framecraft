import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timelineData from "./timeline.json";
import { GlobalCaptionBar, SceneTiming } from "./stage";
import { DataTypesScene, OpeningScene } from "./scenes/Act1OpeningAndTypes";
import { PersistenceScene, WhyFastScene } from "./scenes/Act2SpeedAndPersist";
import { CacheTrapsScene, ClusterHaScene, FinalePanoramaScene } from "./scenes/Act3TrapsClusterFinale";

interface TimelineFile {
  fps: number;
  duration: number;
  scenes: SceneTiming[];
  captions: Array<{ from: number; duration: number; text: string; highlight: string }>;
}

const timeline = timelineData as TimelineFile;
export const REDIS_DURATION_FRAMES = timeline.duration;

const renderScene = (scene: SceneTiming) => {
  switch (scene.id) {
    case "opening":
      return <OpeningScene scene={scene} />;
    case "dataTypes":
      return <DataTypesScene scene={scene} />;
    case "whyFast":
      return <WhyFastScene scene={scene} />;
    case "persistence":
      return <PersistenceScene scene={scene} />;
    case "cacheTraps":
      return <CacheTrapsScene scene={scene} />;
    case "clusterHA":
      return <ClusterHaScene scene={scene} />;
    case "finale":
      return <FinalePanoramaScene scene={scene} />;
    default:
      return null;
  }
};

export const ProjectRedisExplained: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#121320" }}>
      <Audio src={staticFile("redis-explained/owned/audio/master.wav")} />
      {timeline.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.from}
          durationInFrames={scene.duration}
          name={`Redis-${scene.id}`}
        >
          {renderScene(scene)}
        </Sequence>
      ))}
      <GlobalCaptionBar captions={timeline.captions} />
    </AbsoluteFill>
  );
};
