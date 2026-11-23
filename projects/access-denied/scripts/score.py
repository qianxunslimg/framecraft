"""Original procedural score: D minor / Bbmaj7 / Fmaj9 / Csus.
24 kHz stereo, soft harmonic keys, pads, bass pulses, deterministic whooshes.
No samples, no third-party music, narration-aware ducking.
"""
from pathlib import Path
import argparse
import json
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter,sosfilt

P=Path(__file__).resolve().parents[1]
R=P.parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--timeline',type=Path,default=P/'source/timeline.json')
parser.add_argument('--narration',type=Path,default=R/'public/access-denied/external/audio/narration.wav')
parser.add_argument('--output-dir',type=Path,default=R/'public/access-denied/owned/audio')
parser.add_argument('--report',type=Path,default=P/'audio-report.json')
args=parser.parse_args()
T=json.loads(args.timeline.read_text())
SR=24000
N=T['duration']*SR//30
sr,voice=wavfile.read(args.narration)
voice=voice.astype(np.float32)/32768
assert sr==SR and len(voice)==N
music=np.zeros((N,2),np.float32)
rng=np.random.default_rng(718)

def add(sound,at,level=1,pan=0):
    i=int(at*SR)
    if i>=N:return
    n=min(len(sound),N-i)
    if n<=0:return
    sound=sound[:n]*level
    music[i:i+n,0]+=sound*np.sqrt((1-pan)/2)
    music[i:i+n,1]+=sound*np.sqrt((1+pan)/2)

def tone(midi,dur,kind='key'):
    t=np.arange(int(dur*SR),dtype=np.float32)/SR
    hz=440*2**((midi-69)/12)
    if kind=='pad':
        a=(np.sin(2*np.pi*hz*t)+.28*np.sin(2*np.pi*hz*1.002*t)+.18*np.sin(2*np.pi*hz*2*t))/1.46
        env=np.minimum(1,t/1.3)*np.minimum(1,(dur-t)/2.3)
        return (a*env).astype(np.float32)
    env=(1-np.exp(-t*100))*np.exp(-t/(1.1 if kind=='key' else .65))*np.minimum(1,(dur-t)/.05)
    a=np.sin(2*np.pi*hz*t)+.25*np.sin(2*np.pi*hz*2.001*t)*np.exp(-t*2)+.1*np.sin(2*np.pi*hz*3.998*t)*np.exp(-t*4)
    return (a*env).astype(np.float32)

BPM=82
beat=60/BPM
chords=[[50,57,60,64],[46,53,57,60],[41,53,57,60],[48,55,58,62]]
end=T['duration']/30
for k,at in enumerate(np.arange(0,end,beat*8)):
    ch=chords[k%4]
    for i,n in enumerate(ch):add(tone(n,beat*9,'pad'),at,.017,(i-1.5)*.3)
for k,at in enumerate(np.arange(0,end,beat)):
    ch=chords[(k//8)%4]
    active=1 if at<200 else .65
    if k%2==0 or 130<at<210:
        n=ch[[0,2,1,3,2,1,3,2][k%8]]+24
        note=tone(n,3)
        add(note,at,.028*active,(-.45 if k%2 else .45))
        add(note,at+beat*.75,.009*active,(.55 if k%2 else -.55))
    if k%4==0:add(tone(ch[0]-12,2.5,'bass'),at,.044)
    if 40<at<245 and k%2==0:
        t=np.arange(int(.13*SR))/SR
        pulse=np.sin(2*np.pi*(48*t+1.8*(1-np.exp(-t*26))))*np.exp(-t*28)
        add(pulse,at,.035)

# One sound cue for each chapter cut; a soft reverse-air transition, no harsh crash.
for scene in [s for s in T['scenes'][1:] if s['id']!='credits']:
    at=scene['from']/30
    n=int(.8*SR);t=np.arange(n)/SR
    hiss=sosfilt(butter(2,[300,2100],btype='bandpass',fs=SR,output='sos'),rng.standard_normal(n)).astype(np.float32)
    env=np.sin(np.pi*t/.8)**2
    add(hiss*env,max(0,at-.5),.022,-.25)
    add(tone(38,.9,'bass'),at,.035)

# Medium-term dynamic arc and a gentle fade through the final source credits.
times=np.arange(N)/SR
arc=np.interp(times,[0,10,70,150,220,285,end-5,end],[.4,.85,.7,1,.72,1.05,.5,0])
music*=arc[:,None]
bins=voice.reshape(-1,800)
rms=np.sqrt(np.mean(bins*bins,axis=1))
duck=np.interp(times,np.arange(len(rms))/30,np.where(rms>.016,.36,.88))
duck=sosfilt(butter(1,3,fs=SR,output='sos'),duck).astype(np.float32)
music*=duck[:,None]
music_peak=float(np.max(np.abs(music)))
# Very gentle narration high-pass; preserve natural pitch and pauses.
voice=sosfilt(butter(2,65,fs=SR,btype='highpass',output='sos'),voice).astype(np.float32)
vrms=float(np.sqrt(np.mean(voice[voice*voice>.0004]**2)))
gain=min(1.5,.16/max(vrms,.01))
voice*=gain
master=music+voice[:,None]
peak=float(np.max(np.abs(master)))
if peak>.93:master*=.93/peak
out=args.output_dir;out.mkdir(parents=True,exist_ok=True)
wavfile.write(out/'score.wav',SR,(np.clip(music,-1,1)*32767).astype(np.int16))
wavfile.write(out/'master.wav',SR,(np.clip(master,-1,1)*32767).astype(np.int16))
report={'durationSeconds':N/SR,'sampleRate':SR,'channels':2,'musicPeak':music_peak,'voiceGain':gain,'masterPeak':float(np.max(np.abs(master))),'clippedSamples':int(np.sum(np.abs(master)>=1)),'bpm':BPM,'key':'D minor','originalSynthesis':True}
args.report.write_text(json.dumps(report,indent=2)+'\n')
print(report)
