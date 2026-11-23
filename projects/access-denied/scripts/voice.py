"""Local, resumable Kokoro narration. No API key, no cloud inference."""
import json
import math
import re
import time
from pathlib import Path
import numpy as np
import soundfile as sf
import torch
from kokoro import KPipeline
from pronunciation import install_line_pronunciation
from pypinyin import load_phrases_dict

# In this script 一行 means one line, not a travelling party.
load_phrases_dict({"一行": [["yi1"], ["hang2"]]})

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE.parents[1]
OUT = ROOT / 'public/access-denied/external/audio'
OUT.mkdir(parents=True, exist_ok=True)
SR = 24000
FPS = 30
VOICE = 'zm_010'
MODEL = 'hexgrad/Kokoro-82M-v1.1-zh'
torch.set_num_threads(4)
pronunciations = {'Claude': 'klˈɔd', 'Claude Code': 'klˈɔd kˈOd', 'Codex': 'kˈOdɛks', 'OpenAI': 'ˈOpən ˌAˈI', 'Anthropic': 'ænθɹˈɑpɪk'}
pipeline = KPipeline(lang_code='z', repo_id=MODEL, device='cpu', en_callable=lambda word: pronunciations.get(word, ''))
install_line_pronunciation(pipeline)
script = json.loads((BASE / 'script.json').read_text())
timeline = []
caption_lines = []
cursor = 0
all_audio = []

def pad(frames):
    return np.zeros(frames * SR // FPS, dtype=np.float32)

for scene in script:
    # Long holds are intentionally reserved for evidence and ending questions.
    intro = 20 if scene['id'] != 'opening' else 25
    parts = [pad(intro)]
    local = intro
    captions = []
    for i, text in enumerate(scene['lines']):
        name = f"{scene['id']}-{i:02d}.wav"
        file = OUT / name
        if file.exists():
            audio, _ = sf.read(file, dtype='float32')
        else:
            start = time.time()
            audio = np.concatenate([r.audio.numpy() for r in pipeline(text, voice=VOICE, speed=1.00)])
            # Keep 50ms leading/trailing room while removing excessive model silence.
            active = np.flatnonzero(np.abs(audio) > 0.008)
            if active.size:
                audio = audio[max(0, active[0]-1200):min(len(audio), active[-1]+1800)]
            peak = np.max(np.abs(audio))
            if peak > 0:
                audio *= min(1.8, .73 / peak)
            sf.write(file, audio, SR)
            print(scene['id'], i, round(len(audio)/SR,2), 'sec, generated',round(time.time()-start,1),flush=True)
        frames = math.ceil(len(audio) / SR * FPS)
        padded = np.pad(audio, (0, frames*SR//FPS-len(audio)))
        parts.append(padded)
        display = scene.get('displayLines',scene['lines'])[i]
        captions.append({'text':display,'from':local,'duration':frames,'audio':name})
        # Phrase captions are partitioned at punctuation; precise sentence boundaries
        # come from generated audio, interior splits are proportional and labeled.
        phrases = [p for p in re.split(r'(?<=[，；。？！])',display) if p]
        merged=[]
        for p in phrases:
            if merged and len(merged[-1])+len(p)<=25:
                merged[-1]+=p
            else:
                merged.append(p)
        total=sum(len(p) for p in merged)
        at=local
        for k,p in enumerate(merged):
            n=frames-(at-local) if k==len(merged)-1 else round(frames*len(p)/total)
            caption_lines.append({'from':cursor+at,'duration':n,'text':p})
            at+=n
        local += frames
        gap = 13 if scene['id']!='postscript' else 20
        parts.append(pad(gap))
        local += gap
    tail = 30 if scene['id'] not in ['finale','credits','postscript'] else {'finale':75,'credits':210,'postscript':65}[scene['id']]
    parts.append(pad(tail))
    local += tail
    timeline.append({**scene,'from':cursor,'duration':local,'cues':captions})
    all_audio.extend(parts)
    cursor += local
    print('SCENE',scene['id'],local, 'frames, total',round(cursor/FPS,1),flush=True)
sf.write(OUT/'narration.wav',np.concatenate(all_audio),SR)
result={'fps':FPS,'duration':cursor,'scenes':timeline,'captions':caption_lines,'voice':{'model':MODEL,'voice':VOICE,'speed':1.0,'sampleRate':SR,'captionInteriorAlignment':'proportional within exact sentence audio boundaries'}}
(BASE/'source/timeline.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
def srt_time(f):
    ms=round(f*1000/FPS)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(BASE/'subtitles.srt').write_text('\n\n'.join(f"{i+1}\n{srt_time(c['from'])} --> {srt_time(c['from']+c['duration'])}\n{c['text']}" for i,c in enumerate(caption_lines))+'\n')
print('DONE',cursor,'frames',cursor/FPS,'seconds',flush=True)
