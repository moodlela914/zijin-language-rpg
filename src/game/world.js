/** 貼紙人物探索：遊戲世界使用即時更新，與可 seek 的過場動畫分離。 */
import { playCue } from './audio-player.js';
const held = new Set();
let active = null, gyro = false, origin = null, tilt = { x: 0, y: 0 }, latest = null;
let positions = {};
try { positions = JSON.parse(localStorage.getItem('zijin-world:v1') || '{}'); } catch { /* 禁止儲存時仍能移動 */ }
if (!positions || typeof positions !== 'object' || Array.isArray(positions)) positions = {};
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const editable = target => target?.closest('input,select,textarea,[contenteditable]');
window.addEventListener('keydown', event => {
  if (!active || editable(event.target)) return;
  const key = event.key.toLowerCase();
  if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
    event.preventDefault(); held.add(key);
  }
  if (key === 'e' && !event.repeat) { event.preventDefault(); active.interact(); }
  if (key === 'escape') { active.container.classList.remove('world-expanded'); document.body.classList.remove('world-is-expanded'); }
});
window.addEventListener('keyup', event => held.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => { held.clear(); tilt = {x:0,y:0}; });
function persist() {
  try { localStorage.setItem('zijin-world:v1', JSON.stringify(positions)); } catch { /* 非必要進度 */ }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) { held.clear();persist(); } });
function orientation(event) {
  if (!gyro || event.beta === null || event.gamma === null) return;
  const angle = screen.orientation?.angle ?? 0;
  let x = event.gamma, y = event.beta;
  if (angle === 90) [x,y] = [y,-x];
  else if (angle === 270 || angle === -90) [x,y] = [-y,x];
  else if (angle === 180) [x,y] = [-x,-y];
  latest = {x,y}; origin ??= {x,y};
  const axis = v => Math.abs(v) < 3 ? 0 : clamp(v / 18,-1,1);
  tilt = {x:axis(x-origin.x), y:axis(y-origin.y)};
}
window.addEventListener('deviceorientation', orientation);
export async function enableTilt() {
  if (!window.isSecureContext) return '傾斜移動需要 HTTPS 或本機安全環境，請先使用畫面方向鍵。';
  if (!window.DeviceOrientationEvent) return '裝置未提供姿態感測器，請使用畫面方向鍵。';
  try {
    if (typeof DeviceOrientationEvent.requestPermission === 'function' && await DeviceOrientationEvent.requestPermission() !== 'granted') return '尚未取得感測器權限，方向鍵仍可使用。';
    gyro = true; origin = latest; tilt = {x:0,y:0};
    return '已啟用傾斜移動；輕微傾斜即可移動。若沒有反應，請使用方向鍵。';
  } catch { return '無法啟用感測器，請使用畫面方向鍵。'; }
}
export function calibrateTilt() { origin = latest; tilt = {x:0,y:0}; }
export function unmountWorld() {
  if (active) { cancelAnimationFrame(active.frame); positions[active.key] = active.position; persist(); active=null; }
  held.clear();
  document.body.classList.remove('world-is-expanded');
}
export function mountWorld(container, { key, landmarks, onInteract }) {
  unmountWorld();
  const avatar = container.querySelector('.world-sticker'), status = container.querySelector('.world-status');
  const cached = positions[key];
  const position = cached && Number.isFinite(cached.x) && Number.isFinite(cached.y) ? {x:clamp(cached.x,5,95),y:clamp(cached.y,10,92)} : {x:50,y:87};
  let previous = null, nearest = null, waypoint = null, lastStep = 0, touch = {x:0,y:0};
  const instance = {key,position,container,frame:null,interact:()=>{ if(nearest)onInteract(nearest.id);else if(status)status.textContent='先靠近有標記的宮殿或線索，再按 E／互動。'; }};
  active = instance;
  const interact = container.querySelector('[data-world-interact]');
  interact?.addEventListener('click',instance.interact);
  container.querySelector('[data-world-expand]')?.addEventListener('click',event=>{
    const expanded=container.classList.toggle('world-expanded');document.body.classList.toggle('world-is-expanded',expanded);
    event.currentTarget.textContent=expanded?'縮回場景 · Esc':'放大探索';
  });
  container.querySelectorAll('[data-direction]').forEach(control=>{
    control.addEventListener('pointerdown',event=>{
      event.preventDefault();control.setPointerCapture(event.pointerId);
      touch={x:control.dataset.direction==='left'?-1:control.dataset.direction==='right'?1:0,y:control.dataset.direction==='up'?-1:control.dataset.direction==='down'?1:0};
    });
    const stop=()=>{touch={x:0,y:0};};
    control.addEventListener('pointerup',stop);control.addEventListener('pointercancel',stop);control.addEventListener('lostpointercapture',stop);
  });
  container.querySelectorAll('[data-landmark]').forEach(node=>node.addEventListener('click',()=>{
    if(node.disabled)return;
    if(nearest?.id===node.dataset.landmark)onInteract(nearest.id);
    else { waypoint=landmarks.find(p=>p.id===node.dataset.landmark);if(status)status.textContent='正在走向「'+node.dataset.label+'」；WASD 可接手移動。'; }
  }));
  function update(time) {
    if(active!==instance)return;
    const dt=previous===null?0:Math.min((time-previous)/1000,.05); previous=time;
    let x=(held.has('d')||held.has('arrowright')?1:0)-(held.has('a')||held.has('arrowleft')?1:0);
    let y=(held.has('s')||held.has('arrowdown')?1:0)-(held.has('w')||held.has('arrowup')?1:0);
    if(!x&&!y){x=touch.x||tilt.x;y=touch.y||tilt.y;}
    const rect=container.getBoundingClientRect();
    if(x||y)waypoint=null;
    else if(waypoint){
      const dx=(waypoint.x-position.x)*rect.width/100,dy=(waypoint.y-position.y)*rect.height/100,len=Math.hypot(dx,dy);
      x=dx/Math.max(len,1);y=dy/Math.max(len,1);
    }
    const length=Math.hypot(x,y);if(length>1){x/=length;y/=length;}
    if(length>.15 && time-lastStep>420){playCue('step');lastStep=time;}
    position.x=clamp(position.x+x*155*dt/Math.max(rect.width,1)*100,5,95);
    position.y=clamp(position.y+y*155*dt/Math.max(rect.height,1)*100,10,92);
    avatar.style.left=position.x+'%';avatar.style.top=position.y+'%';
    if(x!==0)avatar.classList.toggle('facing-left',x<0);
    let candidate=null,distance=Infinity;
    for(const point of landmarks){
      const d=Math.hypot((position.x-point.x)*rect.width/100,(position.y-point.y)*rect.height/100);
      if(d<distance){distance=d;candidate=point;}
    }
    const next=distance<Math.max(44,Math.min(78,rect.width*.12))?candidate:null;
    if(next?.id!==nearest?.id){
      nearest=next;
      container.querySelectorAll('[data-landmark]').forEach(node=>node.classList.toggle('nearby',node.dataset.landmark===nearest?.id));
      if(status)status.textContent=nearest?'已靠近 '+nearest.label+' · 按 E 或「互動」':'移動貼紙人物，靠近標記尋找線索。';
    }
    if(waypoint&&nearest?.id===waypoint.id){const id=waypoint.id;waypoint=null;onInteract(id);}
    if(active===instance)instance.frame=requestAnimationFrame(update);
  }
  instance.frame=requestAnimationFrame(update);
}
