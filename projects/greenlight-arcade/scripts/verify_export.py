"""Decode the delivered movie, inspect all lyric moments, and compare its soundtrack."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,hashlib,subprocess,sys,time,shutil
import numpy as np
from scipy.io import wavfile
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/(sys.argv[1] if len(sys.argv)>1 else 'out/greenlight-arcade/v001')
FF=ROOT/'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg'
VIDEO=OUT/'final.mp4'
REVIEW=OUT/'review';REVIEW.mkdir(exist_ok=True)
def run(args):
 r=subprocess.run([str(FF),'-hide_banner','-loglevel','error',*map(str,args)],capture_output=True)
 if r.returncode: raise RuntimeError(r.stderr.decode())
 return r
start=time.time()
run(['-i',VIDEO,'-c:v','rawvideo','-c:a','pcm_s16le','-f','null','-'])
print('All video and audio packets decoded',flush=True)
lyrics=json.loads((OUT/'source/projects/greenlight-arcade/source/lyrics.json').read_text())
frames=sorted(set([180,1900,2030,2190,2350,4520,4750,4950,5040]+[round(q['from']+(q['to']-q['from'])*.55) for q in lyrics]))
def extract(f):
 run(['-ss',str(f/30),'-i',VIDEO,'-frames:v','1','-y',REVIEW/f'{f:05}.png'])
with ThreadPoolExecutor(max_workers=3) as pool:list(pool.map(extract,frames))
print('Extracted',len(frames),'encoded frames',flush=True)
contact=Image.new('RGB',(1440,300*((len(frames)+2)//3)),'#262441');draw=ImageDraw.Draw(contact)
for i,f in enumerate(frames):
 im=Image.open(REVIEW/f'{f:05}.png').convert('RGB');im.thumbnail((480,270));x=i%3*480;y=i//3*300;contact.paste(im,(x,y));draw.text((x+12,y+280),f'{f} / {f/30:.2f}s',fill='#fff7df')
contact.save(REVIEW/'contact.jpg',quality=93)
run(['-i',VIDEO,'-vn','-ac','2','-ar','24000','-c:a','pcm_s16le','-y',REVIEW/'encoded-audio.wav'])
run(['-i',OUT/'source/public/greenlight-arcade/external/audio/song.mp3','-t','170.5','-ac','2','-ar','24000','-c:a','pcm_s16le','-y',REVIEW/'source-audio.wav'])
sr,a=wavfile.read(REVIEW/'encoded-audio.wav');_,b=wavfile.read(REVIEW/'source-audio.wav')
a=a.astype(np.float32)/32768;b=b.astype(np.float32)/32768
correlations=[]
for second in [3,15,34,46,63,77,91,106,120,136,151,164,169]:
 i=int(second*sr);j=i+sr
 correlations.append({'second':second,'correlation':float(np.corrcoef(a[i:j].ravel(),b[i:j].ravel())[0,1])})
report={'checkedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'fullDecode':'passed','frames':frames,'audio':{'sampleRate':sr,'decodedSamples':len(a),'sourceSamples':len(b),'peak':float(np.max(np.abs(a))),'correlations':correlations},'sha256':hashlib.sha256(VIDEO.read_bytes()).hexdigest(),'elapsedSeconds':round(time.time()-start,2),'limits':'Encoded frames reviewed visually. Soundtrack identity checked numerically; no human auditory playback claim.'}
(REVIEW/'technical-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
shutil.copy2(REVIEW/'00180.png',OUT/'cover.png')
print(json.dumps(report['audio'],indent=2),flush=True)
assert len(a)>=len(b),'Audio was truncated'
assert min(x['correlation'] for x in correlations)>.97,'Audio differs from the source track'
