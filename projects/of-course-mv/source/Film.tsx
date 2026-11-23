import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  RemixImpact,
  RemixMachine,
  RemixPortals,
  RemixTrampoline,
} from "./remix/ActOne";
import {
  RemixParticles,
  RemixUnfold,
  RemixUnderstand,
  RemixLetter,
} from "./remix/ActTwo";
import {
  RemixRace,
  RemixGravity,
  RemixReprise,
  RemixUniverse,
} from "./remix/ActThree";

export const ProjectOfCourseMV = () => (
  <AbsoluteFill>
    <Audio
      src={staticFile("of-course-mv/external/audio/of-course-reference.wav")}
      volume={1}
    />
    <Sequence durationInFrames={95} premountFor={30} name="符号大爆炸">
      <RemixImpact />
    </Sequence>
    <Sequence
      from={95}
      durationInFrames={70}
      premountFor={30}
      name="会唱歌的键盘"
    >
      <RemixMachine />
    </Sequence>
    <Sequence
      from={165}
      durationInFrames={78}
      premountFor={30}
      name="问号传送门"
    >
      <RemixPortals />
    </Sequence>
    <Sequence
      from={243}
      durationInFrames={114}
      premountFor={30}
      name="括号弹床"
    >
      <RemixTrampoline />
    </Sequence>
    <Sequence
      from={357}
      durationInFrames={129}
      premountFor={30}
      name="心事是标点拼的"
    >
      <RemixParticles />
    </Sequence>
    <Sequence
      from={486}
      durationInFrames={114}
      premountFor={30}
      name="把解释折成纸飞机"
    >
      <RemixUnfold />
    </Sequence>
    <Sequence
      from={600}
      durationInFrames={84}
      premountFor={30}
      name="问号变成两颗心"
    >
      <RemixUnderstand />
    </Sequence>
    <Sequence
      from={684}
      durationInFrames={93}
      premountFor={30}
      name="寄出这一刻"
    >
      <RemixLetter />
    </Sequence>
    <Sequence
      from={777}
      durationInFrames={104}
      premountFor={30}
      name="不躲不藏不逃"
    >
      <RemixRace />
    </Sequence>
    <Sequence
      from={881}
      durationInFrames={96}
      premountFor={30}
      name="翻转重力接住你"
    >
      <RemixGravity />
    </Sequence>
    <Sequence
      from={977}
      durationInFrames={153}
      premountFor={30}
      name="无限问题游乐场"
    >
      <RemixReprise />
    </Sequence>
    <Sequence
      from={1130}
      durationInFrames={183}
      premountFor={30}
      name="把世界藏进问号"
    >
      <RemixUniverse />
    </Sequence>
  </AbsoluteFill>
);
