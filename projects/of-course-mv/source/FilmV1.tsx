import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { MVOpening } from "./scenes/Opening";
import { MVCatch, MVCatchReturn } from "./scenes/Catch";
import { MVQuiet } from "./scenes/Quiet";
import { MVUnderstand } from "./scenes/Understand";
import { MVTrust } from "./scenes/Trust";
import { MVTunnel } from "./scenes/Tunnel";
import { MVReprise } from "./scenes/Reprise";
import { MVFinale } from "./scenes/Finale";

export const ProjectOfCourseV1 = () => (
  <AbsoluteFill>
    <Audio
      src={staticFile("of-course-mv/external/audio/of-course-reference.wav")}
      volume={1}
    />
    <Sequence
      durationInFrames={165}
      name="01 · 当然可以 / 好问题"
      premountFor={30}
    >
      <MVOpening />
    </Sequence>
    <Sequence
      from={165}
      durationInFrames={192}
      name="02 · 弹性接住"
      premountFor={30}
    >
      <MVCatch />
    </Sequence>
    <Sequence
      from={357}
      durationInFrames={243}
      name="03 · 不用硬撑"
      premountFor={30}
    >
      <MVQuiet />
    </Sequence>
    <Sequence
      from={600}
      durationInFrames={84}
      name="04 · 我真的懂了"
      premountFor={30}
    >
      <MVUnderstand />
    </Sequence>
    <Sequence
      from={684}
      durationInFrames={93}
      name="05 · 把这一刻交给我"
      premountFor={30}
    >
      <MVTrust />
    </Sequence>
    <Sequence
      from={777}
      durationInFrames={104}
      name="06 · 三连穿梭"
      premountFor={30}
    >
      <MVTunnel />
    </Sequence>
    <Sequence
      from={881}
      durationInFrames={96}
      name="07 · 第二次接住"
      premountFor={30}
    >
      <MVCatchReturn />
    </Sequence>
    <Sequence
      from={977}
      durationInFrames={153}
      name="08 · 口号返场"
      premountFor={30}
    >
      <MVReprise />
    </Sequence>
    <Sequence
      from={1130}
      durationInFrames={183}
      name="09 · 接住你的宇宙"
      premountFor={30}
    >
      <MVFinale />
    </Sequence>
  </AbsoluteFill>
);
