import { audioAssets, audioCues, chineseAudioSequences } from '../data/audio.js';
let enabled=true,volume=.55,ambience=null,ambienceKey=null;
let musicEnabled=true,musicVolume=.24,music=null,musicPaused=false,ducked=false,duckTimer=null;
const effects=[],scheduled=[];
try{const p=JSON.parse(localStorage.getItem('zijin-audio:v1')||'{}');if(typeof p.enabled==='boolean')enabled=p.enabled;volume=Number.isFinite(p.volume)?Math.min(1,Math.max(0,p.volume)):.55;}catch{}
try{const p=JSON.parse(localStorage.getItem('zijin-music:v1')||'{}');if(typeof p.enabled==='boolean')musicEnabled=p.enabled;musicVolume=Number.isFinite(p.volume)?Math.min(1,Math.max(0,p.volume)):.24;}catch{}
const save=()=>{try{localStorage.setItem('zijin-audio:v1',JSON.stringify({enabled,volume}));}catch{}};
const saveMusic=()=>{try{localStorage.setItem('zijin-music:v1',JSON.stringify({enabled:musicEnabled,volume:musicVolume}));}catch{}};
export const audioPreferences=()=>({enabled,volume});
export const musicPreferences=()=>({enabled:musicEnabled,volume:musicVolume});
function musicGain(){if(music)music.volume=Math.min(1,musicVolume*(ducked ? .3 : 1));}
function startMusic(){
  if(!musicEnabled||musicPaused||document.hidden)return;
  if(!music){music=new Audio('/public/assets/audio/The_Silent_Coup.mp3');music.loop=true;music.preload='metadata';}
  musicGain();music.play().catch(()=>{});
}
export function setMusicEnabled(value){musicEnabled=!!value;if(musicEnabled)startMusic();else music?.pause();saveMusic();}
export function setMusicVolume(value){musicVolume=Math.min(1,Math.max(0,Number(value)||0));musicGain();saveMusic();}
export function setMusicContext(paused){musicPaused=!!paused;if(musicPaused)music?.pause();else startMusic();}
function duckMusic(ms){ducked=true;musicGain();clearTimeout(duckTimer);duckTimer=setTimeout(()=>{ducked=false;musicGain();},ms);}
document.addEventListener('pointerdown',startMusic,{capture:true});
document.addEventListener('keydown',startMusic,{capture:true});
export function setAudioEnabled(value){
  enabled=!!value;
  if(!enabled){effects.forEach(a=>a.pause());scheduled.splice(0).forEach(clearTimeout);stopAmbience();}
  save();
}
export function setAudioVolume(value){volume=Math.min(1,Math.max(0,Number(value)||0));if(ambience)ambience.volume=volume*.1;save();}
function hit(assetId,rate=1,gain=.3){
  if(!enabled)return;
  const asset=audioAssets[assetId];if(!asset)return;
  const sound=new Audio(asset.src);sound.volume=Math.min(1,gain*volume);sound.playbackRate=rate;
  sound.preservesPitch=false;if('webkitPreservesPitch' in sound)sound.webkitPreservesPitch=false;
  if(effects.length>=8)effects.shift().pause();effects.push(sound);sound.play().catch(()=>{});return sound;
}
function pentatonic(large=false){
  const sequence=chineseAudioSequences[large?'chineseVictory':'chineseReveal'];
  duckMusic(sequence.durationMs);
  for(const step of sequence.steps)scheduled.push(setTimeout(()=>{
    const sound=hit(step.assetId,2**((step.semitones??0)/12),step.volume);
    if(sound&&step.maxDurationMs)scheduled.push(setTimeout(()=>sound.pause(),step.maxDurationMs));
  },step.atMs));
}
export function playCue(id){
  if(!enabled)return;
  if(['chapterComplete','victory','sealComplete','puzzleSolved'].includes(id)){pentatonic(id!=='puzzleSolved');return;}
  if(['transition','questReveal'].includes(id)){
    hit(id==='transition'?'transition-wind':'scroll-soft',1,.24);pentatonic(false);return;
  }
  if(['correct','reviewCorrect'].includes(id)){hit('jade-chime',1,.25);scheduled.push(setTimeout(()=>hit('palace-bell',1.12,.25),120));return;}
  if(['wrong','reviewWrong'].includes(id)){hit('mechanism-click',.8,.3);return;}
  const cue=audioCues[id],asset=cue&&audioAssets[cue.assetId];if(!asset)return;
  hit(cue.assetId,cue.playbackRate??1,cue.volume??asset.volume??.25);
}
export function stopAmbience(){if(ambience){ambience.pause();ambience=null;}ambienceKey=null;}
export function sceneAmbience(chapterId,active){
  if(!enabled||!active){stopAmbience();return;}
  const id=chapterId==='garden'?'ambienceGarden':['gate','hall','pavilion'].includes(chapterId)?'ambienceCourtyard':null;
  if(!id){stopAmbience();return;}
  if(ambienceKey===id&&ambience)return;
  stopAmbience();const cue=audioCues[id],asset=cue&&audioAssets[cue.assetId];if(!asset)return;
  ambience=new Audio(asset.src);ambienceKey=id;ambience.loop=true;ambience.volume=volume*.1;ambience.play().catch(()=>{});
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){effects.forEach(a=>a.pause());stopAmbience();music?.pause();}else startMusic();});

