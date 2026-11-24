import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timelineData from "./timeline.json";
import { GlobalCaptionBar, SceneTiming } from "./stage";
import { OpeningScene, StageNodesPodsScene } from "./scenes/Act1OpeningAndStage";
import {
  DeploymentHpaScene,
  NetworkServiceIngressScene,
} from "./scenes/Act2DeploymentAndNetwork";
import {
  BrainRelayScene,
  ConfigStorageScene,
  FinalePanoramaScene,
} from "./scenes/Act3ConfigBrainAndFinale";

const scenes = timelineData.scenes as SceneTiming[];
export const K8S_DURATION_FRAMES = timelineData.duration;

const findScene = (id: string): SceneTiming => {
  const s = scenes.find((item) => item.id === id);
  if (!s) throw new Error(`Missing scene timing: ${id}`);
  return s;
};

export const ProjectK8sExplained: React.FC = () => {
  const sOpening = findScene("opening");
  const sStage = findScene("stage");
  const sDeploy = findScene("deployment");
  const sNet = findScene("network");
  const sConfig = findScene("configStorage");
  const sBrain = findScene("brain");
  const sFinale = findScene("finale");

  return (
    <AbsoluteFill>
      <Audio src={staticFile("k8s-explained/owned/audio/master.wav")} />

      <Sequence from={sOpening.from} durationInFrames={sOpening.duration}>
        <OpeningScene scene={sOpening} />
      </Sequence>
      <Sequence from={sStage.from} durationInFrames={sStage.duration}>
        <StageNodesPodsScene scene={sStage} />
      </Sequence>
      <Sequence from={sDeploy.from} durationInFrames={sDeploy.duration}>
        <DeploymentHpaScene scene={sDeploy} />
      </Sequence>
      <Sequence from={sNet.from} durationInFrames={sNet.duration}>
        <NetworkServiceIngressScene scene={sNet} />
      </Sequence>
      <Sequence from={sConfig.from} durationInFrames={sConfig.duration}>
        <ConfigStorageScene scene={sConfig} />
      </Sequence>
      <Sequence from={sBrain.from} durationInFrames={sBrain.duration}>
        <BrainRelayScene scene={sBrain} />
      </Sequence>
      <Sequence from={sFinale.from} durationInFrames={sFinale.duration}>
        <FinalePanoramaScene scene={sFinale} />
      </Sequence>

      <GlobalCaptionBar captions={timelineData.captions} />
    </AbsoluteFill>
  );
};
