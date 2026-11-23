import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Carnival } from "./acts/Carnival";
import { ChorusOne, ChorusTwo } from "./acts/Chorus";
import { Gates } from "./acts/Gates";
import { Intro } from "./acts/Intro";
import { OffWork } from "./acts/OffWork";
import { Pinball } from "./acts/Pinball";
import { TestDrive } from "./acts/TestDrive";
import { Workday } from "./acts/Workday";
import { Workshop } from "./acts/Workshop";
export const ProjectGreenlightArcade = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#fff7df" }}>
      <Sequence
        name="开园 · 灯变成乐园"
        durationInFrames={308}
        premountFor={fps}
      >
        <Intro />
      </Sequence>
      <Sequence
        name="早班 · 火箭与装甲"
        from={308}
        durationInFrames={582}
        premountFor={fps}
      >
        <Workday />
      </Sequence>
      <Sequence
        name="闯关 · 四重关卡"
        from={890}
        durationInFrames={309}
        premountFor={fps}
      >
        <Gates />
      </Sequence>
      <Sequence
        name="副歌 · 语法游乐设施"
        from={1199}
        durationInFrames={676}
        premountFor={fps}
      >
        <ChorusOne />
      </Sequence>
      <Sequence
        name="间奏 · 节拍弹珠"
        from={1875}
        durationInFrames={556}
        premountFor={fps}
      >
        <Pinball />
      </Sequence>
      <Sequence
        name="午后 · 防御工厂"
        from={2431}
        durationInFrames={582}
        premountFor={fps}
      >
        <Workshop />
      </Sequence>
      <Sequence
        name="桥段 · 实车闯关"
        from={3013}
        durationInFrames={375}
        premountFor={fps}
      >
        <TestDrive />
      </Sequence>
      <Sequence
        name="副歌 · 夜场升级"
        from={3388}
        durationInFrames={690}
        premountFor={fps}
      >
        <ChorusTwo />
      </Sequence>
      <Sequence
        name="尾唱 · 下班门口"
        from={4078}
        durationInFrames={377}
        premountFor={fps}
      >
        <OffWork />
      </Sequence>
      <Sequence
        name="尾奏 · 游园巡游"
        from={4455}
        durationInFrames={660}
        premountFor={fps}
      >
        <Carnival />
      </Sequence>
      <Audio
        src={staticFile("greenlight-arcade/external/audio/song.mp3")}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};
