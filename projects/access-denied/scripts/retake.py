"""Correct a polyphone while preserving the approved frame timing."""
import json, subprocess, tempfile
from pathlib import Path
import numpy as np
import soundfile as sf
import torch
from kokoro import KPipeline
from pronunciation import install_line_pronunciation
from pypinyin import load_phrases_dict
BASE=Path(__file__).resolve().parents[1];ROOT=BASE.parents[1]
OUT=ROOT/"public/access-denied/external/audio"
FF=ROOT/"node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg"
load_phrases_dict({"一行":[["yi1"],["hang2"]]})
torch.set_num_threads(2)
pipeline=KPipeline(lang_code="z",repo_id="hexgrad/Kokoro-82M-v1.1-zh",device="cpu",en_callable=lambda w:"")
install_line_pronunciation(pipeline)
script=json.loads((BASE/"script.json").read_text());report=[]
for sid,idx in [("punctuation",1),("punctuation",3)]:
 s=next(s for s in script if s["id"]==sid);text=s["lines"][idx]
 dest=OUT/f"{sid}-{idx:02d}.wav";old,sr=sf.read(dest);target=len(old)
 a=np.concatenate([r.audio.numpy() for r in pipeline(text,voice="zm_010",speed=1.0)])
 active=np.flatnonzero(abs(a)>.008);a=a[max(0,active[0]-1200):min(len(a),active[-1]+1800)]
 a*=min(1.8,.73/np.max(abs(a)));ratio=len(a)/target
 with tempfile.TemporaryDirectory(prefix="framecraft-retake-") as td:
  raw=Path(td)/"raw.wav";sf.write(raw,a,sr)
  subprocess.run([str(FF),"-loglevel","error","-i",str(raw),"-af",f"atempo={ratio},apad,atrim=end_sample={target}","-c:a","pcm_s16le","-y",str(dest)],check=True)
 result,_=sf.read(dest);assert len(result)==target
 report.append({"audio":dest.name,"text":text,"pronunciation":"一行 yi4 hang2","tempo":ratio,"samples":target})
 print(report[-1],flush=True)
(BASE/"retake-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
