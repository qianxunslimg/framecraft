import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timelineData from "./timeline.json";
import { GlobalCaptionBar, SceneTiming } from "./stage";
import { OpeningScene, TsdbAndMetricsScene } from "./scenes/Act1OpeningAndTsdb";
import { PromqlAlertingScene, ScrapePullScene } from "./scenes/Act2ScrapeAndAlerting";
import {
  FinaleBlueprintScene,
  GrafanaDashboardScene,
  ThreePillarsScene,
} from "./scenes/Act3GrafanaPillarsFinale";

const scenes = timelineData.scenes as SceneTiming[];
export const PG_DURATION_FRAMES = timelineData.duration;

const findScene = (id: string): SceneTiming => {
  const s = scenes.find((item) => item.id === id);
  if (!s) throw new Error(`Missing scene timing: ${id}`);
  return s;
};

export const ProjectPrometheusGrafana: React.FC = () => {
  const sOpen = findScene("opening");
  const sTsdb = findScene("tsdb");
  const sScrape = findScene("scrape");
  const sAlert = findScene("alerting");
  const sGraf = findScene("grafana");
  const sPillars = findScene("pillars");
  const sFinale = findScene("finale");

  return (
    <AbsoluteFill>
      <Audio src={staticFile("prometheus-grafana/owned/audio/master.wav")} />

      <Sequence from={sOpen.from} durationInFrames={sOpen.duration}>
        <OpeningScene scene={sOpen} />
      </Sequence>
      <Sequence from={sTsdb.from} durationInFrames={sTsdb.duration}>
        <TsdbAndMetricsScene scene={sTsdb} />
      </Sequence>
      <Sequence from={sScrape.from} durationInFrames={sScrape.duration}>
        <ScrapePullScene scene={sScrape} />
      </Sequence>
      <Sequence from={sAlert.from} durationInFrames={sAlert.duration}>
        <PromqlAlertingScene scene={sAlert} />
      </Sequence>
      <Sequence from={sGraf.from} durationInFrames={sGraf.duration}>
        <GrafanaDashboardScene scene={sGraf} />
      </Sequence>
      <Sequence from={sPillars.from} durationInFrames={sPillars.duration}>
        <ThreePillarsScene scene={sPillars} />
      </Sequence>
      <Sequence from={sFinale.from} durationInFrames={sFinale.duration}>
        <FinaleBlueprintScene scene={sFinale} />
      </Sequence>

      <GlobalCaptionBar captions={timelineData.captions} />
    </AbsoluteFill>
  );
};
