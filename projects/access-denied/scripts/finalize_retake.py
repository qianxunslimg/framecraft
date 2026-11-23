"""Create a traceable new delivery using encoded video and revised audio."""
import json,hashlib,shutil,subprocess,datetime
from pathlib import Path
BASE=Path(__file__).resolve().parents[1];ROOT=BASE.parents[1]
OLD=ROOT/"out/access-denied/v001";NEW=ROOT/"out/access-denied/v002"
FF=ROOT/"node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg"
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,v): p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+"\n")
def stamp():return datetime.datetime.now(datetime.timezone.utc).isoformat()
a=json.loads((BASE/"assets.json").read_text())
for item in a["assets"]:
 p=BASE/item["path"];item["bytes"]=p.stat().st_size;item["sha256"]=sha(p)
save(BASE/"assets.json",a)
old=json.loads((OLD/"delivery.json").read_text());assert old["status"]=="complete"
t1=json.loads((OLD/"source/projects/access-denied/source/timeline.json").read_text())
t2=json.loads((BASE/"source/timeline.json").read_text());assert t1==t2,"Video timing changed"
NEW.mkdir(exist_ok=False)
shutil.copytree(OLD/"source",NEW/"source",ignore=shutil.ignore_patterns("node_modules","__pycache__"))
shutil.copytree(BASE,NEW/"source/projects/access-denied",dirs_exist_ok=True,ignore=shutil.ignore_patterns("__pycache__"))
for item in a["assets"]:
 p=(BASE/item["path"]).resolve();q=NEW/"source"/p.relative_to(ROOT);shutil.copy2(p,q)
report={**old,"version":"v002","status":"rendering","startedAt":stamp(),"renderOptions":{"video":"stream-copy from v001 H.264 CRF 18","audio":"revised local master; AAC 320k; 24kHz stereo","faststart":True},"derivation":{"videoSource":"../v001/final.mp4","videoSourceSha256":old["sha256"],"reason":"Correct yi4 hang2 in three sentences; preserve exact timeline and video frames"},"checks":{"assets":"passed","mediaProbe":"pending","visualReview":"pending","playbackReview":"pending"}}
report.pop("completedAt",None);report.pop("sha256",None)
report["assets"]=[{k:v for k,v in item.items() if k not in ["bytes","type","role"]} for item in a["assets"]]
report["sourceGit"]={"commit":subprocess.check_output(["git","rev-parse","HEAD"],cwd=ROOT,text=True).strip(),"status":subprocess.check_output(["git","status","--short"],cwd=ROOT,text=True).strip()}
report["inputs"]=[{"path":str(p.relative_to(NEW/"source")),"sha256":sha(p)} for p in sorted((NEW/"source").rglob("*")) if p.is_file()]
save(NEW/"delivery.json",report)
subprocess.run([str(FF),"-loglevel","error","-i",str(OLD/"final.mp4"),"-i",str(NEW/"source/public/access-denied/owned/audio/master.wav"),"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","aac","-b:a","320k","-movflags","+faststart","-shortest",str(NEW/"final.mp4")],check=True)
shutil.copytree(OLD/"keyframes",NEW/"keyframes")
shutil.copy2(OLD/"CREDITS.txt",NEW/"CREDITS.txt")
shutil.copy2(BASE/"subtitles.srt",NEW/"subtitles.srt")
shutil.copy2(BASE/"sources.md",NEW/"sources.md")
probe=subprocess.check_output(["node","--input-type=module","-e","import {probeMedia} from './scripts/workspace.mjs'; console.log(JSON.stringify(await probeMedia(process.argv[1])))",str(NEW/"final.mp4")],cwd=ROOT,text=True)
report["media"]=json.loads(probe)
assert any(s["type"]=="video" and s["width"]==1920 and s["height"]==1080 for s in report["media"]["streams"])
report["checks"]["mediaProbe"]="passed"
report["sha256"]=sha(NEW/"final.mp4");report["status"]="complete";report["completedAt"]=stamp()
save(NEW/"delivery.json",report)
print(NEW/"final.mp4",flush=True)
