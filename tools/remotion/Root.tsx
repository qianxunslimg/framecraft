import { Composition, Folder } from "remotion";
import { ProjectOfCourseMV } from "../../projects/of-course-mv/source/Film";
import { MVOpening } from "../../projects/of-course-mv/source/scenes/Opening";
import {
  MVCatch,
  MVCatchReturn,
} from "../../projects/of-course-mv/source/scenes/Catch";
import { MVQuiet } from "../../projects/of-course-mv/source/scenes/Quiet";
import { MVUnderstand } from "../../projects/of-course-mv/source/scenes/Understand";
import { MVTrust } from "../../projects/of-course-mv/source/scenes/Trust";
import { MVTunnel } from "../../projects/of-course-mv/source/scenes/Tunnel";
import { MVReprise } from "../../projects/of-course-mv/source/scenes/Reprise";
import { MVFinale } from "../../projects/of-course-mv/source/scenes/Finale";
import {
  RemixImpact,
  RemixMachine,
  RemixPortals,
  RemixTrampoline,
} from "../../projects/of-course-mv/source/remix/ActOne";
import {
  RemixParticles,
  RemixUnfold,
  RemixUnderstand,
  RemixLetter,
} from "../../projects/of-course-mv/source/remix/ActTwo";
import {
  RemixRace,
  RemixGravity,
  RemixReprise,
  RemixUniverse,
} from "../../projects/of-course-mv/source/remix/ActThree";
import { ProjectAccessDenied } from "../../projects/access-denied/source/Film";
import accessTiming from "../../projects/access-denied/source/timeline.json";
import { Opening as AccessOpening } from "../../projects/access-denied/source/scenes/Opening";
import { Portrait as AccessPortrait } from "../../projects/access-denied/source/scenes/Portrait";
import { Career as AccessCareer } from "../../projects/access-denied/source/scenes/Career";
import { Regions as AccessRegions } from "../../projects/access-denied/source/scenes/Regions";
import { Accounts as AccessAccounts } from "../../projects/access-denied/source/scenes/Accounts";
import { Numbers as AccessNumbers } from "../../projects/access-denied/source/scenes/Numbers";
import { Ownership as AccessOwnership } from "../../projects/access-denied/source/scenes/Ownership";
import { Adversary as AccessAdversary } from "../../projects/access-denied/source/scenes/Adversary";
import { Distillation as AccessDistillation } from "../../projects/access-denied/source/scenes/Distillation";
import { Timezone as AccessTimezone } from "../../projects/access-denied/source/scenes/Timezone";
import { Punctuation as AccessPunctuation } from "../../projects/access-denied/source/scenes/Punctuation";
import { Response as AccessResponse } from "../../projects/access-denied/source/scenes/Response";
import { Timeline as AccessTimeline } from "../../projects/access-denied/source/scenes/Timeline";
import { Future as AccessFuture } from "../../projects/access-denied/source/scenes/Future";
import { Power as AccessPower } from "../../projects/access-denied/source/scenes/Power";
import { Finale as AccessFinale } from "../../projects/access-denied/source/scenes/Finale";
import { Credits as AccessCredits } from "../../projects/access-denied/source/scenes/Credits";
import { ProjectOpenai62Roast } from "../../projects/openai-6-2-roast/source/Film";
import { ProjectGreenButNotReady } from "../../projects/green-but-not-ready/source/Film";
import { ProjectGreenlightArcade } from "../../projects/greenlight-arcade/source/Film";
import { Intro as ArcadeIntro } from "../../projects/greenlight-arcade/source/acts/Intro";
import { Workday as ArcadeWorkday } from "../../projects/greenlight-arcade/source/acts/Workday";
import { Gates as ArcadeGates } from "../../projects/greenlight-arcade/source/acts/Gates";
import { ChorusOne as ArcadeChorusOne } from "../../projects/greenlight-arcade/source/acts/Chorus";
import { Pinball as ArcadePinball } from "../../projects/greenlight-arcade/source/acts/Pinball";
import { Workshop as ArcadeWorkshop } from "../../projects/greenlight-arcade/source/acts/Workshop";
import { TestDrive as ArcadeTestDrive } from "../../projects/greenlight-arcade/source/acts/TestDrive";
import { ChorusTwo as ArcadeChorusTwo } from "../../projects/greenlight-arcade/source/acts/Chorus";
import { OffWork as ArcadeOffWork } from "../../projects/greenlight-arcade/source/acts/OffWork";
import { Carnival as ArcadeCarnival } from "../../projects/greenlight-arcade/source/acts/Carnival";
import {
  K8S_DURATION_FRAMES,
  ProjectK8sExplained,
} from "../../projects/k8s-explained/source/Film";
import {
  PG_DURATION_FRAMES,
  ProjectPrometheusGrafana,
} from "../../projects/prometheus-grafana/source/Film";
import {
  KAFKA_DURATION_FRAMES,
  ProjectKafkaExplained,
} from "../../projects/kafka-explained/source/Film";
import {
  REDIS_DURATION_FRAMES,
  ProjectRedisExplained,
} from "../../projects/redis-explained/source/Film";
import {
  MYSQL_DURATION_FRAMES,
  ProjectMysqlExplained,
} from "../../projects/mysql-explained/source/Film";
import {
  AUTODRIVE_DURATION_FRAMES,
  ProjectAutodriveExplained,
} from "../../projects/autodrive-explained/source/Film";
import {
  PHONE_ROOT_DURATION_FRAMES,
  ProjectPhoneRoot,
} from "../../projects/phone-root/source/Film";
import {
  ROBOT_TRUTH_DURATION_FRAMES,
  ProjectRobotTruth,
} from "../../projects/robot-truth/source/Film";
// framecraft:imports

const accessSceneDuration = (id: string) => {
  const scene = accessTiming.scenes.find((item) => item.id === id);
  if (!scene) throw new Error(`Missing access-denied scene: ${id}`);
  return scene.duration;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Scenes"></Folder>

      <Folder name="WebJourney-Scenes"></Folder>

      <Folder name="WebBeat-Scenes"></Folder>
      <Composition
        id="ProjectOfCourseMV"
        component={ProjectOfCourseMV}
        durationInFrames={1313}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="OfCourse-V1-Scenes">
        <Composition
          id="OfCourse-Opening"
          component={MVOpening}
          durationInFrames={165}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="OfCourse-Catch"
          component={MVCatch}
          durationInFrames={192}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="OfCourse-Quiet"
          component={MVQuiet}
          durationInFrames={243}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="OfCourse-Understand"
          component={MVUnderstand}
          durationInFrames={84}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="OfCourse-Trust"
          component={MVTrust}
          durationInFrames={93}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="OfCourse-Tunnel"
          component={MVTunnel}
          durationInFrames={104}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="OfCourse-CatchReturn"
          component={MVCatchReturn}
          durationInFrames={96}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="OfCourse-Reprise"
          component={MVReprise}
          durationInFrames={153}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="OfCourse-Finale"
          component={MVFinale}
          durationInFrames={183}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="OfCourse-Remix">
        <Composition
          id="Remix-Impact"
          component={RemixImpact}
          durationInFrames={95}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Machine"
          component={RemixMachine}
          durationInFrames={70}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Portals"
          component={RemixPortals}
          durationInFrames={78}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Trampoline"
          component={RemixTrampoline}
          durationInFrames={114}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Particles"
          component={RemixParticles}
          durationInFrames={129}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Unfold"
          component={RemixUnfold}
          durationInFrames={114}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Understand"
          component={RemixUnderstand}
          durationInFrames={84}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Letter"
          component={RemixLetter}
          durationInFrames={93}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Race"
          component={RemixRace}
          durationInFrames={104}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Gravity"
          component={RemixGravity}
          durationInFrames={96}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Reprise"
          component={RemixReprise}
          durationInFrames={153}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Remix-Universe"
          component={RemixUniverse}
          durationInFrames={183}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Composition
        id="ProjectAccessDenied"
        component={ProjectAccessDenied}
        durationInFrames={accessTiming.duration}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Access-Denied-Scenes">
        <Composition
          id="Access-Opening"
          component={AccessOpening}
          durationInFrames={accessSceneDuration("opening")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Portrait"
          component={AccessPortrait}
          durationInFrames={accessSceneDuration("portrait")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Career"
          component={AccessCareer}
          durationInFrames={accessSceneDuration("career")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Regions"
          component={AccessRegions}
          durationInFrames={accessSceneDuration("regions")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Accounts"
          component={AccessAccounts}
          durationInFrames={accessSceneDuration("accounts")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Numbers"
          component={AccessNumbers}
          durationInFrames={accessSceneDuration("numbers")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Ownership"
          component={AccessOwnership}
          durationInFrames={accessSceneDuration("ownership")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Adversary"
          component={AccessAdversary}
          durationInFrames={accessSceneDuration("adversary")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Distillation"
          component={AccessDistillation}
          durationInFrames={accessSceneDuration("distillation")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Timezone"
          component={AccessTimezone}
          durationInFrames={accessSceneDuration("timezone")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Punctuation"
          component={AccessPunctuation}
          durationInFrames={accessSceneDuration("punctuation")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Response"
          component={AccessResponse}
          durationInFrames={accessSceneDuration("response")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Timeline"
          component={AccessTimeline}
          durationInFrames={accessSceneDuration("timeline")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Future"
          component={AccessFuture}
          durationInFrames={accessSceneDuration("future")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Power"
          component={AccessPower}
          durationInFrames={accessSceneDuration("power")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Finale"
          component={AccessFinale}
          durationInFrames={accessSceneDuration("finale")}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Access-Credits"
          component={AccessCredits}
          durationInFrames={accessSceneDuration("credits")}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Composition
        id="ProjectOpenai62Roast"
        component={ProjectOpenai62Roast}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectGreenButNotReady"
        component={ProjectGreenButNotReady}
        durationInFrames={5115}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectGreenlightArcade"
        component={ProjectGreenlightArcade}
        durationInFrames={5115}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Greenlight-Arcade-Scenes">
        <Composition
          id="Arcade-Intro"
          component={ArcadeIntro}
          durationInFrames={308}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Arcade-Workday"
          component={ArcadeWorkday}
          durationInFrames={582}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Arcade-Gates"
          component={ArcadeGates}
          durationInFrames={309}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Arcade-ChorusOne"
          component={ArcadeChorusOne}
          durationInFrames={676}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Arcade-Pinball"
          component={ArcadePinball}
          durationInFrames={556}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Arcade-Workshop"
          component={ArcadeWorkshop}
          durationInFrames={582}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Arcade-TestDrive"
          component={ArcadeTestDrive}
          durationInFrames={375}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Arcade-ChorusTwo"
          component={ArcadeChorusTwo}
          durationInFrames={690}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Arcade-OffWork"
          component={ArcadeOffWork}
          durationInFrames={377}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Arcade-Carnival"
          component={ArcadeCarnival}
          durationInFrames={660}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Composition
        id="ProjectK8sExplained"
        component={ProjectK8sExplained}
        durationInFrames={K8S_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectPrometheusGrafana"
        component={ProjectPrometheusGrafana}
        durationInFrames={PG_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectKafkaExplained"
        component={ProjectKafkaExplained}
        durationInFrames={KAFKA_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectRedisExplained"
        component={ProjectRedisExplained}
        durationInFrames={REDIS_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectMysqlExplained"
        component={ProjectMysqlExplained}
        durationInFrames={MYSQL_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectAutodriveExplained"
        component={ProjectAutodriveExplained}
        durationInFrames={AUTODRIVE_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectPhoneRoot"
        component={ProjectPhoneRoot}
        durationInFrames={PHONE_ROOT_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectRobotTruth"
        component={ProjectRobotTruth}
        durationInFrames={ROBOT_TRUTH_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* framecraft:compositions */}
    </>
  );
};
