import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Opening } from "./scenes/Opening";
import { Portrait } from "./scenes/Portrait";
import { Career } from "./scenes/Career";
import { Regions } from "./scenes/Regions";
import { Accounts } from "./scenes/Accounts";
import { Numbers } from "./scenes/Numbers";
import { Ownership } from "./scenes/Ownership";
import { Adversary } from "./scenes/Adversary";
import { Distillation } from "./scenes/Distillation";
import { Timezone } from "./scenes/Timezone";
import { Punctuation } from "./scenes/Punctuation";
import { Response } from "./scenes/Response";
import { Timeline } from "./scenes/Timeline";
import { Future } from "./scenes/Future";
import { Power } from "./scenes/Power";
import { Finale } from "./scenes/Finale";
import { Credits } from "./scenes/Credits";
import timing from "./timeline.json";

const scenes = {
  opening: Opening,
  portrait: Portrait,
  career: Career,
  regions: Regions,
  accounts: Accounts,
  numbers: Numbers,
  ownership: Ownership,
  adversary: Adversary,
  distillation: Distillation,
  timezone: Timezone,
  punctuation: Punctuation,
  response: Response,
  timeline: Timeline,
  future: Future,
  power: Power,
  finale: Finale,
  credits: Credits,
};

export const ProjectAccessDenied = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#090e14" }}>
      {timing.scenes.map((scene) => {
        const Component = scenes[scene.id as keyof typeof scenes];
        if (!Component) throw new Error(`Missing scene component: ${scene.id}`);
        return (
          <Sequence
            key={scene.id}
            name={scene.chapter}
            from={scene.from}
            durationInFrames={scene.duration}
            premountFor={fps}
          >
            <Component />
          </Sequence>
        );
      })}
      <Audio
        src={staticFile("access-denied/owned/audio/master.wav")}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};
