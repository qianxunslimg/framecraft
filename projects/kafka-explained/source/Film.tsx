import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timelineData from "./timeline.json";
import { GlobalCaptionBar, SceneTiming } from "./stage";
import { CoreModelScene, OpeningScene } from "./scenes/Act1OpeningAndCore";
import { ConsumerGroupScene, HaReplicationScene } from "./scenes/Act2ConsumerAndHA";
import {
  FinalePanoramaScene,
  KraftEvolutionScene,
  WhySoFastScene,
} from "./scenes/Act3SpeedKraftFinale";

const scenes = timelineData.scenes as SceneTiming[];
export const KAFKA_DURATION_FRAMES = timelineData.duration;

const findScene = (id: string): SceneTiming => {
  const s = scenes.find((item) => item.id === id);
  if (!s) throw new Error(`Missing scene timing: ${id}`);
  return s;
};

export const ProjectKafkaExplained: React.FC = () => {
  const sOpen = findScene("opening");
  const sCore = findScene("coreModel");
  const sCons = findScene("consumerGroup");
  const sHa = findScene("haReplication");
  const sFast = findScene("whySoFast");
  const sKraft = findScene("kraft");
  const sFin = findScene("finale");

  return (
    <AbsoluteFill>
      <Audio src={staticFile("kafka-explained/owned/audio/master.wav")} />

      <Sequence from={sOpen.from} durationInFrames={sOpen.duration}>
        <OpeningScene scene={sOpen} />
      </Sequence>
      <Sequence from={sCore.from} durationInFrames={sCore.duration}>
        <CoreModelScene scene={sCore} />
      </Sequence>
      <Sequence from={sCons.from} durationInFrames={sCons.duration}>
        <ConsumerGroupScene scene={sCons} />
      </Sequence>
      <Sequence from={sHa.from} durationInFrames={sHa.duration}>
        <HaReplicationScene scene={sHa} />
      </Sequence>
      <Sequence from={sFast.from} durationInFrames={sFast.duration}>
        <WhySoFastScene scene={sFast} />
      </Sequence>
      <Sequence from={sKraft.from} durationInFrames={sKraft.duration}>
        <KraftEvolutionScene scene={sKraft} />
      </Sequence>
      <Sequence from={sFin.from} durationInFrames={sFin.duration}>
        <FinalePanoramaScene scene={sFin} />
      </Sequence>

      <GlobalCaptionBar captions={timelineData.captions} />
    </AbsoluteFill>
  );
};
