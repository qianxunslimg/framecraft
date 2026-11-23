"""Analyze the supplied song. Saves deterministic beat and band envelopes at 30 fps."""
from pathlib import Path
import subprocess
import json
import io
import numpy as np
from scipy.io import wavfile
from scipy.signal import stft, find_peaks

ROOT = Path(__file__).resolve().parents[3]
SR = 24000
FPS = 30
FRAMES = 5115
raw = subprocess.check_output([
    str(ROOT/'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg'),
    '-v','error','-i',str(ROOT/'public/greenlight-arcade/external/audio/song.mp3'),
    '-t','170.5','-ac','1','-ar',str(SR),'-c:a','pcm_s16le','-f','wav','-'
])
_,samples=wavfile.read(io.BytesIO(raw))
x = samples.astype(np.float32)/32768
freq,t,z=stft(x,SR,nperseg=1024,noverlap=784)
mag=np.abs(z)
flux=np.maximum(np.diff(np.log1p(mag*100),axis=1),0).mean(axis=0)
tt=t[1:]
flux/=max(np.percentile(flux,98),1e-6)
peaks,_=find_peaks(flux,distance=23,prominence=.12)
onsets=tt[peaks]
# Grid fitting over the fully orchestrated song, with half/double tempo handled
# by restricting to a danceable 85-155 bpm range.
grid=[]
for bpm in np.arange(85,155,.05):
    period=60/bpm
    for phase in np.arange(0,period,.01):
        beats=np.arange(phase,167,period)
        valid=beats[(beats>11)&(beats<164)]
        energy=np.interp(valid,tt,flux)
        grid.append((float(np.mean(energy)),float(bpm),float(phase)))
score,bpm,phase=max(grid)
period=60/bpm
beats=np.arange(phase,170.5,period)
# Snap a grid marker to nearby acoustic onset; retain a regular pulse in gaps.
snapped=[]
for beat in beats:
    around=onsets[np.abs(onsets-beat)<.075]
    if len(around):
        beat=around[np.argmax(np.interp(around,tt,flux))]
    snapped.append(round(float(beat)*FPS))
target=np.arange(FRAMES)/FPS
def envelope(lo,hi):
    y=np.sqrt(np.mean(mag[(freq>=lo)&(freq<hi)]**2,axis=0))
    y=np.interp(target,t,y)
    return np.round(np.clip(y/max(np.percentile(y,97),1e-6),0,1),3).tolist()
result={'fps':FPS,'frames':FRAMES,'bpm':round(bpm,2),'phaseSeconds':phase,
        'beatFrames':snapped,'bass':envelope(40,180),'high':envelope(2500,10000),
        'energy':envelope(40,10000),'method':'STFT spectral-flux grid fitting plus local onset snapping'}
path=ROOT/'projects/greenlight-arcade/source/rhythm.json'
path.write_text(json.dumps(result,separators=(',',':'))+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ('bass','high','energy','beatFrames')},indent=2))
print('beat markers',len(snapped),'first',snapped[:20])
