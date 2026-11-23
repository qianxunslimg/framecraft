"""Verify the encoded MP4, preserve evidence and extract actual encoded frames."""
import json, hashlib, subprocess, sys, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from scipy.io import wavfile
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT / (sys.argv[1] if len(sys.argv)>1 else "out/access-denied/v001")
FF=ROOT/"node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg"
video=OUT/"final.mp4"
t=json.loads((OUT/"source/projects/access-denied/source/timeline.json").read_text())
review=OUT/"review";review.mkdir(exist_ok=True)
def run(args):
 r=subprocess.run([str(FF),"-hide_banner","-loglevel","error",*map(str,args)],capture_output=True)
 if r.returncode: raise RuntimeError(r.stderr.decode())
 return r
started=time.time()
run(["-i",video,"-c:v","rawvideo","-c:a","pcm_s16le","-f","null","-"])
print("Full video/audio decode passed",flush=True)
frames=[{"id":s["id"],"frame":s["from"]+round(s["duration"]*.47)} for s in t["scenes"]]
frames += [{"id":"cover","frame":round(t["scenes"][0]["duration"]*.84)}]
for sid,ci in [("opening",0),("opening",2),("accounts",2),("numbers",0),("numbers",1),("numbers",2),("regions",0),("career",0),("career",2),("distillation",2),("response",3),("punctuation",1),("finale",3)]:
 s=next(s for s in t["scenes"] if s["id"]==sid);q=s["cues"][ci]
 frames.append({"id":f"{sid}-cue-{ci}","frame":s["from"]+q["from"]+round(q["duration"]*.5)})
def extract(item):
 run(["-ss",str(item["frame"]/30),"-i",video,"-frames:v","1","-y",review/f"{item['id']}.png"])
 return item
with ThreadPoolExecutor(max_workers=2) as pool: list(pool.map(extract,frames))
print(f"Extracted {len(frames)} encoded keyframes",flush=True)
thumbs=Image.new("RGB",(1440,300*((len(frames)+2)//3)),"#111820")
d=ImageDraw.Draw(thumbs)
for i,x in enumerate(frames):
 im=Image.open(review/f"{x['id']}.png").convert("RGB");im.thumbnail((480,270))
 xx=(i%3)*480;yy=(i//3)*300
 thumbs.paste(im,(xx,yy));d.text((xx+10,yy+278),f"{x['id']} / {x['frame']/30:.2f}s",fill="white")
thumbs.save(review/"contact.jpg",quality=94)
Image.open(review/"cover.png").save(OUT/"cover.png")
run(["-i",video,"-vn","-ac","2","-ar","24000","-c:a","pcm_s16le","-y",review/"decoded-audio.wav"])
sr,a=wavfile.read(review/"decoded-audio.wav")
_,b=wavfile.read(OUT/"source/public/access-denied/owned/audio/master.wav")
a=a.astype(np.float32)/32768;b=b.astype(np.float32)/32768
n=min(len(a),len(b));correlations=[]
for s in [(v["from"]+v["cues"][0]["from"]+15)/30 for v in t["scenes"] if v["cues"]]:
 start=int(s*sr);end=min(n,start+sr)
 correlations.append({"time":s,"correlation":float(np.corrcoef(a[start:end].ravel(),b[start:end].ravel())[0,1])})
report={"checkedAt":time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime()),"mp4Sha256":hashlib.sha256(video.read_bytes()).hexdigest(),"decode":"passed: all audio and video packets decoded with ffmpeg", "encodedFrames":frames,"frameContactSheet":"review/contact.jpg","audio":{"sampleRate":sr,"channels":a.shape[1],"decodedSamples":len(a),"expectedSamples":len(b),"peak":float(abs(a).max()),"clips":int(np.sum(abs(a)>=1)),"rms":float(np.sqrt(np.mean(a*a))),"alignedMasterCorrelations":correlations},"limits":"No GUI playback or human auditory review. Keyframes require visual inspection; ASR is supplementary.","elapsedSeconds":round(time.time()-started,2)}
(review/"technical-check.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
print(json.dumps(report["audio"],ensure_ascii=False),flush=True)
assert min(x["correlation"] for x in correlations)>.98,"Output audio differs from master or timing shifted"
assert len(a)>=len(b),"Audio truncated"
