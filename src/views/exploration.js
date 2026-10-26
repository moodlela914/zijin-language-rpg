import { chapters } from '../data/chapters.js?v=7e7e8f105b06';
import { puzzles } from '../data/puzzles.js?v=7e7e8f105b06';
import { backgrounds, playerPortraits, extraArt, allArtwork } from '../data/assets.js?v=7e7e8f105b06';
import { strategies, playableChapters, unlocked, chapterQuestions, currentQuestion } from '../game/engine.js?v=7e7e8f105b06';
const e=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const mapPoints = [
  [15,83],[40,83],[64,83],[87,83],[87,53],[64,53],
  [40,53],[15,53],[15,24],[40,24],[64,24],[87,24],
].map(([x,y],i)=>({id:chapters[i].id,label:chapters[i].title,x,y}));
export const getMapPoints=()=>typeof window!=='undefined'&&matchMedia('(max-width:720px)').matches&&extraArt['EX-02']?mapPoints.map(p=>({...p,x:100-p.y,y:p.x})):mapPoints;
export function controls(){return '<button class="world-expander" data-world-expand>放大探索</button><div class="world-controls"><div class="dpad" aria-label="畫面方向鍵"><button data-direction="up" aria-label="向上移動">↑</button><button data-direction="left" aria-label="向左移動">←</button><button data-direction="down" aria-label="向下移動">↓</button><button data-direction="right" aria-label="向右移動">→</button></div><button class="interact-key" data-world-interact>E <span>互動</span></button></div><p class="world-status" role="status">WASD／方向鍵移動，靠近後按 E 互動。</p>';}
export function worldAvatar(){return '<div class="world-sticker"><img src="'+playerPortraits.neutral+'" alt="可移動的甄嬛貼紙人物"><span>我</span></div>';}
export function immersiveMap(s){
  const next=playableChapters.find(c=>!s.completed.includes(c.id));
  const points=getMapPoints();
  return '<section><div class="section-heading"><div><p class="eyebrow">THE FORBIDDEN CITY · EXPLORE</p><h2 tabindex="-1">紫禁皇城圖</h2></div><span class="small">鳳印 '+s.completed.length+' / 12</span></div><p class="intro">'+(next?'下一站：'+next.title+'。移動貼紙人物前往亮起的宮門。':'旅程已完成。')+'</p>'+
    '<div class="world world-map '+(extraArt['EX-02']?'illustrated':'')+'" data-world-key="palace"><img class="world-background" src="'+(extraArt['EX-02']??backgrounds.gate)+'" alt="宮城探索地圖底景"><div class="map-wash"></div><svg class="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="'+points.map(p=>p.x+','+p.y).join(' ')+'"/></svg><span class="map-region region-one">入宮試煉</span><span class="map-region region-two">內廷爭鋒</span><span class="map-region region-three">巔峰論辯</span>'+
    points.map((point,i)=>{const done=s.completed.includes(point.id),available=unlocked(s,point.id)&&!done&&playableChapters.some(c=>c.id===point.id);return '<button data-landmark="'+point.id+'" data-label="'+point.label+'" style="left:'+point.x+'%;top:'+point.y+'%" class="palace-node '+(done?'visited':available?'available':'locked')+'" '+(available?'':'disabled')+'><img src="'+backgrounds[point.id]+'" alt="" loading="lazy"><span class="node-index">'+String(i+1).padStart(2,'0')+'</span><strong>'+point.label+'</strong><small>'+(done?'已點亮':available?'可進入':'未解鎖')+'</small></button>';}).join('')+worldAvatar()+controls()+'</div>'+
    '<div class="motion-settings"><button data-action="tilt" class="quiet">啟用傾斜移動</button><button data-action="calibrate" class="quiet">重新校準</button><span class="small" id="sensor-status">手機需感測器支援與授權；也可使用畫面方向鍵。</span></div>'+
    '<details class="howto"><summary>初次入宮 · 探索與試煉說明</summary><p>在皇城圖移動到宮門，按 E 或互動進入。每殿先觀看短篇過場，接著找齊三處線索、閱讀線索冊，即可直接開始語文應答。探索不倒數，也不扣氣血。</p><p>答錯依策略扣氣血；每關通過恢復 10 氣血。氣血歸零時完成三道訂正可恢復 60 氣血。養心殿需同一輪三題皆對才能通關。</p><p>全場三次密友請益，銀針可排除誘答，殘箋可提供提示。有輔助的答對獎勵減半。無輔助全對通關可得免死金牌，全場最多兩枚。</p><p>答題可課堂暫停；地圖可選開啟 45 秒倒數。遊戲自動存檔於此瀏覽器。</p></details>'+
    '<div class="strategy-picker"><h3>下一關應答策略</h3><div>'+Object.entries(strategies).map(([id,v])=>'<button data-action="strategy" data-id="'+id+'" class="'+(s.strategy===id?'selected':'')+'" aria-pressed="'+(s.strategy===id)+'"><strong>'+v.label+'</strong><small>'+v.description+'</small></button>').join('')+'</div></div>'+collectionView()+'<p class="small">地圖為遊戲示意路線，非紫禁城歷史測繪。全 '+chapterQuestions('gate').length+' 題／關起，終局三回合。</p></section>';
}
export function introView(s){
  const c=chapters.find(c=>c.id===currentQuestion(s).chapterId);
  return '<section class="intro-panel"><p class="eyebrow">CHAPTER '+String(c.number).padStart(2,'0')+'</p><h2 tabindex="-1">'+c.title+' · 宮中往事</h2><div class="cinematic-host"><iframe id="cinematic-frame" title="'+c.title+'情境過場" src="/zijin-language-rpg/public/cinematics/'+c.id+'.html"></iframe></div><div class="actions"><button data-action="finish-intro" class="primary">進入場景／略過動畫 →</button><button data-action="replay-intro" class="quiet">重播過場</button><span class="small">圖片式短篇過場 · 不佔作答時間</span></div></section>';
}
export function exploreView(s,activeClue){
  const p=puzzles[s.puzzle.chapterId],c=chapters.find(c=>c.id===s.puzzle.chapterId),v=s.puzzle;
  const read=p.clues.find(clue=>clue.id===(activeClue??v.found.at(-1))&&v.found.includes(clue.id));
  return '<section><div class="section-heading"><div><p class="eyebrow">PALACE EXPLORATION · '+c.topic+'</p><h2 tabindex="-1">'+c.title+' · '+p.title+'</h2></div><span class="seal">探索</span></div><div class="quest-card"><span>當前任務</span><p>'+e(p.mission)+'</p></div>'+
    '<div class="world world-room" data-world-key="'+c.id+'"><img class="world-background" src="'+backgrounds[c.id]+'" alt="'+c.title+'探索場景">'+p.clues.map(point=>'<button data-landmark="'+point.id+'" data-label="'+point.label+'" style="left:'+point.x+'%;top:'+point.y+'%" class="hotspot '+(v.found.includes(point.id)?'found':'')+'"><span>'+(v.found.includes(point.id)?'✓':'?')+'</span><strong>'+point.label+'</strong></button>').join('')+worldAvatar()+controls()+'</div>'+
    (read?'<div class="clue-reveal" role="status"><strong>線索入冊 · '+e(read.label)+'</strong><p>'+e(read.text)+'</p><small>'+(v.found.length===p.clues.length?'線索已齊，閱讀線索冊後即可開始應答。':'繼續尋找場景中的其他標記。')+'</small></div>':'')+
    '<div class="motion-settings"><button data-action="tilt" class="quiet">啟用傾斜移動</button><button data-action="calibrate" class="quiet">重新校準</button><span class="small" id="sensor-status">WASD／畫面方向鍵；靠近線索後互動。</span></div>'+
    '<div class="clue-book"><h3>線索冊 <small>'+v.found.length+' / '+p.clues.length+'</small></h3><div>'+p.clues.map(point=>'<article class="'+(v.found.includes(point.id)?'discovered':'undiscovered')+'"><strong>'+point.label+'</strong><p>'+(v.found.includes(point.id)?e(point.text):'尚未找到，走近場景標記探索。')+'</p></article>').join('')+'</div></div>'+
    (v.found.length<p.clues.length?'<div class="notice">再尋找 '+(p.clues.length-v.found.length)+' 處線索，即可開始本殿應答。</div>':'<div class="actions exploration-ready"><button data-action="start-trial" class="primary">線索已齊 · 開始應答 →</button><span class="small">可隨時回看上方線索冊。</span></div>')+'</section>';
}
function collectionView(){return '<details class="collection"><summary>宮中人物與信物圖鑑 · 已完成美術</summary><div class="collection-grid">'+allArtwork.filter(a=>a.id.endsWith('-neutral')||a.category==='PR').map(a=>'<figure><img src="'+a.src+'" alt="'+e(a.name)+'" loading="lazy"><figcaption>'+e(a.name.replace('・平常',''))+'</figcaption></figure>').join('')+'</div></details>';}
