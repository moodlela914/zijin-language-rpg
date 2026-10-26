import { mkdir, writeFile } from 'node:fs/promises';
import { chapters } from '../src/data/chapters.js';
import { puzzles } from '../src/data/puzzles.js';
import { backgrounds, portraits } from '../src/data/assets.js';
const e=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=new URL('../public/cinematics/',import.meta.url);
await mkdir(root,{recursive:true});
for(const c of chapters){
  const p=puzzles[c.id],npc=portraits[c.id]?.neutral;
  const html=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${c.title} · 情境過場</title><style>
html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#172d29;color:#f1e8d6;font-family:serif}*{box-sizing:border-box}#root{width:100%;height:100%;position:relative;overflow:hidden}.clip{position:absolute;inset:0}.backdrop{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.shade{position:absolute;inset:0;background:linear-gradient(0deg,#132d2ce8,transparent 75%)}.letterbox{position:absolute;inset:0;border-top:18px solid #172d29;border-bottom:18px solid #172d29;pointer-events:none}.chapter-title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-shadow:0 2px 30px #000;background:#17362b33}.chapter-title small{font-family:sans-serif;font-size:clamp(11px,1.9vw,24px);letter-spacing:5px}.chapter-title h1{font-size:clamp(28px,7.2vw,88px);font-weight:400;letter-spacing:12px;margin:14px 0}.character{position:absolute;bottom:-8%;left:8%;height:93%;width:40%;object-fit:contain;object-position:bottom;filter:drop-shadow(0 4px 12px #132d2c55)}.dialogue{position:absolute;left:7%;right:7%;bottom:8%;padding:20px 26px;background:#17352cf0;border:1px solid #c2a364;box-shadow:0 10px 40px #0005}.dialogue strong{font-family:sans-serif;font-size:clamp(12px,2vw,24px);font-weight:400;color:#d9c08c;letter-spacing:3px}.dialogue p{font-size:clamp(15px,2.7vw,34px);line-height:1.65;margin:12px 0 0}.mission{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:7%;background:#16332be8;text-align:center}.mission small{font:clamp(11px,1.6vw,20px) sans-serif;color:#c2a364;letter-spacing:5px}.mission h2{font-size:clamp(24px,4.3vw,54px);font-weight:400;letter-spacing:5px;margin:20px 0}.mission p{max-width:900px;font-size:clamp(14px,2.2vw,28px);line-height:1.9;margin:0}
</style></head><body><div id="root" data-composition-id="intro-${c.id}" data-width="1280" data-height="720" data-duration="11.2"><section class="clip" data-start="0" data-duration="11.2" data-track-index="0"><img class="backdrop" src="${backgrounds[c.id]}" alt="${c.title}"><div class="shade"></div></section><section class="clip" data-start="0" data-duration="11.2" data-track-index="1"><div class="chapter-title"><small>紫禁語文弈 · 第 ${String(c.number).padStart(2,'0')} 殿</small><h1>${c.title}</h1></div>${npc?`<img class="character" src="${npc}" alt="${c.npc}">`:''}<div class="dialogue"><strong>${c.npc}</strong><p>${e(p.dialogue[0])}</p></div><div class="mission"><small>任務揭示</small><h2>${e(p.title)}</h2><p>${e(p.mission)}</p></div></section><div class="letterbox"></div></div><script>
// HyperFrames WAAPI adapter: finite, synchronously created, paused, seekable.
const duration=11200;
function motion(selector,keyframes,options={}){const element=document.querySelector(selector);if(!element)return;const animation=element.animate(keyframes,{duration,fill:'both',iterations:1,easing:'linear',...options});animation.pause();}
motion('.backdrop',[{transform:'scale(1.035)'},{transform:'scale(1)'}]);
motion('.chapter-title',[{opacity:0,offset:0},{opacity:1,offset:.08},{opacity:1,offset:.23},{opacity:0,offset:.31},{opacity:0,offset:1}]);
motion('.character',[{opacity:0,transform:'translateY(14px)',offset:0},{opacity:0,transform:'translateY(14px)',offset:.2},{opacity:1,transform:'translateY(0)',offset:.29},{opacity:1,offset:.63},{opacity:0,offset:.7},{opacity:0,offset:1}]);
motion('.dialogue',[{opacity:0,transform:'translateY(12px)',offset:0},{opacity:0,transform:'translateY(12px)',offset:.25},{opacity:1,transform:'translateY(0)',offset:.32},{opacity:1,offset:.62},{opacity:0,offset:.68},{opacity:0,offset:1}]);
motion('.mission',[{opacity:0,offset:0},{opacity:0,offset:.64},{opacity:1,offset:.72},{opacity:1,offset:.98},{opacity:0,offset:1}]);
window.cinematicDuration=duration;
</script></body></html>`;
  await writeFile(new URL(c.id+'.html',root),html,'utf8');
}
await writeFile(new URL('README.md',root),'# 圖片式過場\n\n十二個可 seek 的 HyperFrames WAAPI HTML composition，每個 11.2 秒。根元素為 1280×720，動畫皆有限、fill both、初始化後暫停；遊戲播放器負責播放。沒有遠端依賴，不包含配音或預先轉碼的 MP4。可略過、重播，減少動態效果設定下改為靜態閱讀。\n\n重建：node scripts/build-cinematics.mjs。檢查入口：public/cinematics/gate.html。\n','utf8');
console.log('已建立十二段 11.2 秒情境過場。');
