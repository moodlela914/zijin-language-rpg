import { chapters } from './data/chapters.js';
import { questions } from './data/questions.js';
import { backgrounds, portraits, playerPortraits, noblePortraits, characters, needleIcon, propIcons, uiArt, extraArt, allArtwork } from './data/assets.js';
import { createGame, currentQuestion, remediationQuestion, playableChapters, rankOf, strategies, setStrategy, unlocked, enterChapter, useHint, useItem, pauseGame, resumeGame, answer, advance, correctionAnswer, advanceCorrection, continueJourney, chapterQuestions, report } from './game/engine.js';
import { renderTrial, renderTrialFeedback, mountTrial, unmountTrial, clearTrialDrafts } from './game/trial-interactions.js';
import { puzzles } from './data/puzzles.js';
import { immersiveMap, exploreView, introView, getMapPoints } from './views/exploration.js';
import { mountWorld, unmountWorld, enableTilt, calibrateTilt } from './game/world.js';
import { playCinematic, stopCinematic, animateEntrance } from './game/cinematic-player.js';
import { playCue, audioPreferences, setAudioEnabled, setAudioVolume, sceneAmbience, musicPreferences, setMusicEnabled, setMusicVolume, setMusicContext } from './game/audio-player.js';
import { finishIntro, discoverClue, placePuzzle, togglePuzzle, rotatePuzzle, checkPuzzle, startTrial } from './game/engine.js';
import { loadGame, saveGame } from './game/storage.js';
const app = document.querySelector('#app');
const storage = { getItem: k => localStorage.getItem(k), setItem: (k,v) => localStorage.setItem(k,v) };
const loaded = loadGame(storage);
let state = loaded.state, warning = loaded.warning, resetting = false, tab = 'journey', selectedTile = null, activeClue = null, viewIdentity = '', lastTick = null;
const e = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const b = (action,label,attrs='') => '<button data-action="'+action+'" '+attrs+'>'+label+'</button>';
const chapter = id => chapters.find(c=>c.id===id);
const prefetched = new Set();
function preloadScene(id){
  if(prefetched.has(id))return;prefetched.add(id);
  for(const src of new Set([backgrounds[id],...Object.values(portraits[id]??{}),...Object.values(playerPortraits),...Object.values(noblePortraits)])){
    const image=new Image();image.src=src;
  }
}
function commit(next) {
  if(next===state)return;
  const previous=state, oldPhase=state.phase, oldQuestion=state.questionId;
  state=next;
  if(state.phase==='feedback'&&oldPhase==='question')playCue(state.feedback.shielded?'itemShield':state.feedback.expired?'timeout':state.feedback.correct?(currentQuestion(state).chapterId==='final'?'bossHit':'correct'):'wrong');
  else if(state.phase==='intro')playCue('transition');
  else if(state.phase==='explore'&&oldPhase==='intro')playCue('questReveal');
  else if(state.puzzleLog.length>previous.puzzleLog.length)playCue('puzzleSolved');
  else if(state.phase==='explore'&&state.puzzle.found.length>previous.puzzle.found.length)playCue('clue');
  else if(state.phase==='explore'&&state.puzzle!==previous.puzzle)playCue(state.puzzle.feedback?.correct===false?'wrong':'puzzleOperate');
  else if(state.phase==='chapterComplete')playCue(state.chapterResult.passed?'chapterComplete':'retry');
  else if(state.phase==='ending')playCue('victory');
  else if(previous.paused!==state.paused)playCue(state.paused?'pause':'resume');
  else if(state.phase==='question'&&!state.paused)playCue('dialogue');
  else if(state.reviewFeedback&&!previous.reviewFeedback)playCue(state.reviewFeedback.correct?'reviewCorrect':'reviewWrong');
  if(!saveGame(storage,state))warning='此瀏覽器無法儲存進度；關閉頁面前請先匯出歷程。';
  render();
  if((state.phase==='feedback'&&oldPhase==='question') || (state.reviewFeedback&&!previous.reviewFeedback)) {
    const feedback=app.querySelector('.notice[role="status"]');
    feedback?.setAttribute('tabindex','-1');feedback?.focus({preventScroll:true});feedback?.scrollIntoView({behavior:'instant',block:'center'});
  } else if(oldPhase!==state.phase || oldQuestion!==state.questionId || previous.paused!==state.paused) {
    const heading=app.querySelector('.content h2');
    heading?.focus({preventScroll:true});
    heading?.scrollIntoView({behavior:'instant',block:'start'});
  }
}
function scene(id, mood='neutral', reviewing=false) {
  const location=reviewing?'prison':id;
  const npc=portraits[id]?.[mood];
  return '<div class="scene game-scene"><img class="scene-background" src="'+backgrounds[location]+'" alt="'+e(chapter(location).title)+'場景">'+
    (npc?'<img class="sprite npc" src="'+npc+'" alt="'+e(chapter(id).npc)+'">'+ '<span class="actor-tag npc-tag">'+e(chapter(id).npc)+'</span>':'<div class="actor-plaque">'+e(chapter(id).npc)+'<small>守關人物</small></div>')+
    '<img class="sprite player" src="'+(state.completed.length>=8?noblePortraits:playerPortraits)[mood]+'" alt="玩家甄嬛"><span class="actor-tag player-tag">甄嬛 · '+rankOf(state)+'</span>'+
    '<div class="scene-caption">'+chapter(location).title+' / '+(reviewing?'訂正修習':'文墨試煉')+'</div></div>';
}
function mapView(){return immersiveMap(state);}
function questionView() {
  const reviewing=state.phase==='remediation', q=reviewing?remediationQuestion(state):currentQuestion(state);
  const original=currentQuestion(state), c=chapter(original.chapterId);
  const list=chapterQuestions(c.id), index=list.findIndex(x=>x.id===original.id);
  if(state.paused)return '<section class="pause-panel"><p class="eyebrow">CLASSROOM DISCUSSION</p><h2 tabindex="-1">課堂暫停</h2><p>題目已收起，燃香暫停。準備好時再繼續。</p>'+b('resume','繼續試煉 →','class="primary"')+'</section>';
  const feedback=reviewing?state.reviewFeedback:state.phase==='feedback'?state.feedback:null;
  const mood=feedback?(feedback.correct?'resolved':'tense'):'neutral';
  return '<section><div class="section-heading"><div><p class="eyebrow">CHAPTER '+String(c.number).padStart(2,'0')+' · '+e(q.concept)+'</p><h2 tabindex="-1">'+(reviewing?'慎刑司 · 訂正修習':c.title)+'</h2></div><span class="seal">'+(reviewing?'修習':c.id==='final'?'論辯':'試煉')+'</span></div>'+
    '<p class="intro">'+(reviewing?'依序通過三道不同的辨析題；答錯會回到第一道，先看解析再繼續。':c.description)+'</p>'+
    scene(c.id,mood,reviewing)+
    (c.id==='final'&&!reviewing?'<div class="boss-meter"><span>威權心防</span><progress value="'+state.bossMind+'" max="100" aria-label="威權心防">'+state.bossMind+'</progress><strong>'+state.bossMind+' / 100</strong><small>同一輪三次正確駁論，讓心防歸零。</small></div>':'')+
    '<div class="dialogue"><span class="speaker">'+e(reviewing?'訂正辨析':c.npc)+'<small>'+(reviewing?'第 '+(state.corrections+1)+' / 3 道': '第 '+(index+1)+' / '+list.length+' 題 · '+strategies[state.strategy].label)+'</small></span><p>'+e(q.prompt)+'</p></div>'+
    (!reviewing&&state.phase==='question'?renderTrial(q,state):!reviewing&&state.feedback?.response?renderTrialFeedback(q,state):('<div class="choices">'+q.choices.map((choice,i)=>{
      const removed=!reviewing&&state.eliminated.includes(choice.id);
      const correct=feedback&&choice.id===q.answerId;
      const wrong=feedback&&!feedback.correct&&!reviewing&&state.feedback.choiceId===choice.id;
      return b(reviewing?'correct':'answer','<span>'+String.fromCharCode(65+i)+'</span>'+e(choice.text)+(removed?'<small>已排除</small>':correct?'<small>正確答案</small>':''),'data-id="'+choice.id+'" class="choice '+(correct?'correct ':'')+(wrong?'incorrect ':'')+(removed?'eliminated':'')+'" '+(feedback||removed?'disabled':''));
    }).join('')+'</div>'))+
    (!reviewing&&state.eliminated.length?'<div class="notice"><strong>已排除的誤判</strong><p>'+q.choices.filter(c=>state.eliminated.includes(c.id)).map(c=>e(c.text)).join('；')+'</p></div>':'')+
    (state.hintVisible&&!reviewing?'<div class="notice">'+e(state.hintText)+'</div>':'')+
    (feedback?'<div class="notice '+(feedback.correct?'success':'error')+'" role="status"><strong>'+(reviewing?(feedback.correct?'辨析正確':'再想一想'):feedback.correct?'應答得宜 · 文墨 +'+state.feedback.points:state.feedback.shielded?'金牌護身 · 本次免扣氣血':state.feedback.expired?'燃香已盡 · 氣血 −'+state.feedback.damage:'應答有失 · 氣血 −'+state.feedback.damage)+'</strong><p>'+e(q.explanation)+'</p>'+(q.sourceUrl?'<a class="source-link" href="'+e(q.sourceUrl)+'" target="_blank" rel="noopener noreferrer">查閱知識來源 ↗</a>':'')+'</div><div class="actions">'+b(reviewing?'review-next':'next',reviewing?(state.corrections===2&&feedback.correct?'返回原關卡 →':'繼續訂正 →'):state.hp===0?'前往慎刑司訂正 →':'繼續前行 →','class="primary"')+'</div>':
    reviewing?'<p class="small">訂正不扣氣血，也不計入首次答題正確率。</p>':
    '<div class="support-panel"><div><strong>密友請益 <small>全場剩餘 '+state.hints+' 次</small></strong><div class="actions">'+
    ['jinxi','jing','duan'].map((id,i)=>b('hint',['槿汐 · 方向','敬妃 · 排除','端妃 · 概念'][i],'data-id="'+id+'" class="quiet" '+(state.hints<=0||state.hintVisible?'disabled':''))).join('')+'</div></div>'+
    '<div><strong>東宮百寶箱</strong><div class="actions">'+b('item','銀針 · '+state.inventory.needle,'data-id="needle" class="quiet" '+(state.inventory.needle<=0?'disabled':''))+b('item','殘箋 · '+state.inventory.paper,'data-id="paper" class="quiet" '+(state.inventory.paper<=0||state.hintVisible?'disabled':''))+'</div></div></div><div class="actions">'+b('pause','暫停／課堂討論','class="quiet"')+'<span class="small">'+strategies[state.strategy].description+' 使用輔助後獎勵減半。</span></div>')+'</section>';
}
function chapterResultView() {
  const r=state.chapterResult,c=chapter(r.chapterId);
  return '<section class="result-panel" data-passed="'+r.passed+'"><p class="eyebrow">'+(r.passed?'CHAPTER COMPLETE':'TRY AGAIN')+'</p><h2 tabindex="-1">'+(r.passed?c.title+' · 試煉完成':'養心殿 · 論辯未竟')+'</h2><div class="celebration-emblem"><img src="'+propIcons['PR-18']+'" alt="鳳印玉璽"><div class="celebration-sparks">'+Array.from({length:14},()=>'<i></i>').join('')+'</div></div><img class="result-scene" src="'+backgrounds[c.id]+'" alt="'+c.title+'"><div class="result-numbers"><div><strong>'+r.correct+' / '+r.total+'</strong><span>本輪答對</span></div><div><strong>'+state.completed.length+' / 12</strong><span>鳳印碎片</span></div><div><strong>'+state.score+'</strong><span>累積文墨</span></div></div><p>'+(r.passed?'你已掌握這一段旅程的線索。通關恢復 10 點氣血。':'心防尚餘 '+state.bossMind+'，請再讀一次錯題解析，重新完成三次正確駁論。已有十一關進度會保留。')+'</p>'+(r.grantShield?'<div class="notice success">無輔助全對通關，獲得一枚免死金牌！下一次答錯會自動抵銷扣血。</div>':'')+'<div class="actions">'+b('continue',r.passed?(c.id==='final'?'領取通關策書 →':'返回紫禁地圖 →'):'再試三回合 →','class="primary"')+'</div></section>';
}
function reportView(ending=false) {
  const r=report(state);
  return '<section class="'+(ending?'certificate-report':'')+'" style="'+(ending?'--certificate-art:url('+extraArt[state.reviews.length?'EX-04':'EX-03']+')':'')+'"><p class="eyebrow">'+(ending?'A JOURNEY COMPLETED':'LEARNING RECORD')+'</p><h2 tabindex="-1">'+(ending?e(state.ending):'文墨修習錄')+'</h2>'+(ending?'<div class="notice success"><strong>十二殿通關 · 鳳印集成</strong><p>你已用學識走完這段旅程。把錯題與推理留下，下一次會更從容。</p></div>':'')+
    '<div class="result-numbers"><div><strong>'+r.firstAttemptAccuracy+'%</strong><span>首次作答正確率</span></div><div><strong>'+state.completed.length+' / 12</strong><span>完成關卡</span></div><div><strong>'+state.score+'</strong><span>累積文墨</span></div></div>'+
    '<div class="concepts">'+r.concepts.map(c=>'<div><span>'+e(c.concept)+'</span><strong>'+(c.attempts?c.correct+' / '+c.attempts:'尚未修習')+'</strong><progress value="'+c.correct+'" max="'+(c.attempts||1)+'" aria-label="'+e(c.concept)+'答對數"></progress></div>').join('')+'</div><p class="small">概念數字為首次答對／已作答題數。後續重試不覆蓋首次表現；訂正另列歷程。</p>'+
    '<div class="actions">'+b('export','匯出 JSON 歷程','class="primary"')+b('print','列印／儲存 PDF','class="quiet"')+'</div><h3 class="review-title">錯題索引 · '+r.wrongQuestions.length+' 題</h3>'+
    (r.wrongQuestions.length?r.wrongQuestions.map(q=>'<details class="wrong-question"><summary>'+chapter(q.chapterId).title+' · '+e(q.concept)+'</summary><p>'+e(q.prompt)+'</p><strong>正解：'+e(q.answer)+'</strong><p>'+e(q.explanation)+'</p></details>').join(''):'<p class="small">目前沒有錯題紀錄。</p>')+'</section>';
}
function render() {
  unmountWorld();stopCinematic();unmountTrial();
  const onMap=state.phase==='map', ending=state.phase==='ending';
  const left=state.deadline?Math.max(0,Math.ceil((state.deadline-Date.now())/1000)):null;
  const view=tab==='record'&&onMap?reportView():onMap?mapView():ending?reportView(true):state.phase==='chapterComplete'?chapterResultView():state.phase==='intro'?introView(state):state.phase==='explore'?exploreView(state,selectedTile,activeClue):questionView();
  app.innerHTML='<div class="shell"><header class="topbar"><a class="brand" href="/zijin-language-rpg/" aria-label="紫禁語文弈首頁"><span class="brand-mark">弈</span><div>紫禁語文弈<small>以文載道 · 以智破局</small></div></a><nav>'+b('toggle-music',musicPreferences().enabled?'背景音樂：開':'背景音樂：關','class="quiet"')+'<label class="volume-control">樂 <input id="music-volume" aria-label="背景音樂音量" type="range" min="0" max="100" value="'+Math.round(musicPreferences().volume*100)+'"></label>'+b('toggle-audio',audioPreferences().enabled?'音效：開':'音效：關','class="quiet"')+'<label class="volume-control">音量 <input id="audio-volume" aria-label="音效音量" type="range" min="0" max="100" value="'+Math.round(audioPreferences().volume*100)+'"></label>'+b('journey','遊戲旅程','class="quiet" '+(!onMap?'disabled':''))+b('record','學習歷程','class="quiet" '+(!onMap&&!ending?'disabled':''))+'<a class="quiet" href="/zijin-language-rpg/public/playtest.html" target="_blank" rel="noopener">玩法試玩台 ↗</a><a class="quiet" href="/zijin-language-rpg/public/assets/gallery.html" target="_blank" rel="noopener">素材畫廊 ↗</a></nav></header>'+
    '<main><aside class="sidebar"><div class="sidebar-top"><p class="eyebrow">A PALACE OF WORDS</p><h1>一字之間，<br><em>扭轉萬千局。</em></h1><p>國中語文 × 宮廷對話 RPG</p></div><div class="player-card"><span class="small">當前宮階</span><strong>'+rankOf(state)+'</strong><div class="hp-label"><label for="hp">氣血儀態</label><span>'+state.hp+' / 100</span></div><div class="hp-art"><progress id="hp" value="'+state.hp+'" max="100">'+state.hp+'</progress><img src="'+uiArt['UI-03']+'" alt=""></div><div class="fragment"><span>鳳印碎片</span><strong>'+state.completed.length+'<small> / 12</small></strong></div><div class="fragment"><span>累積文墨</span><strong>'+state.score+'</strong></div><div class="inventory-summary"><img src="'+needleIcon+'" alt=""><span>銀針 '+state.inventory.needle+' · 殘箋 '+state.inventory.paper+'<br>免死金牌 '+state.inventory.shield+' 枚</span></div></div>'+
    '<div class="settings"><label><input type="checkbox" id="timed" '+(state.timed?'checked':'')+' '+(!onMap?'disabled':'')+'> 御前燃香 · 每題 45 秒</label><p class="small">地圖調整；預設不限時。</p><div class="timer" role="timer" aria-label="剩餘作答秒數"><img class="incense-icon" src="'+uiArt['UI-02']+'" alt="">'+(state.paused?'已暫停':left!==null?'燃香尚餘 <span id="seconds">'+left+'</span> 秒':'靜心思量，從容應答')+'</div></div>'+b('reset','重新開始','class="quiet reset"')+'<p class="small">自動存檔於此瀏覽器<br>離開前可匯出學習歷程</p></aside>'+
    '<div class="content">'+(warning?'<div class="notice error" role="alert">'+e(warning)+'</div>':'')+(resetting?'<div class="notice" role="alert"><strong>要建立新旅程嗎？</strong><p>目前進度會被取代，可先匯出歷程。</p><div class="actions">'+b('confirm-reset','清除並重新開始','class="primary"')+b('cancel-reset','保留進度','class="quiet"')+b('export','匯出歷程','class="quiet"')+'</div></div>':'')+view+'</div></main><footer>紫禁語文弈 · 探索試玩版 v0.3<span>十二關 · '+questions.length+' 題 · <a href="/zijin-language-rpg/public/assets/audio/audition.html" target="_blank" rel="noopener">音效來源／試聽</a></span></footer></div>';
  const world=app.querySelector('.world');
  if(world&&onMap&&tab==='journey')mountWorld(world,{key:'palace',landmarks:getMapPoints().filter(p=>unlocked(state,p.id)&&!state.completed.includes(p.id)),onInteract:id=>{selectedTile=null;commit(enterChapter(state,id));}});
  if(world&&state.phase==='explore')mountWorld(world,{key:state.puzzle.chapterId,landmarks:puzzles[state.puzzle.chapterId].clues,onInteract:id=>{activeClue=id;const next=discoverClue(state,id);if(next===state)render();else commit(next);}});
  const trialRoot=app.querySelector('#trial-interactive');
  if(trialRoot&&state.phase==='question'&&!state.paused)mountTrial(trialRoot,currentQuestion(state),state,{onSubmit:(id,response)=>commit(answer(state,id,Date.now(),response)),onOperate:()=>playCue('chineseMechanism')});
  const frame=app.querySelector('#cinematic-frame');
  if(frame)playCinematic(frame,()=>{if(state.phase==='intro')commit(finishIntro(state));});
  const identity=state.phase+':'+state.questionId+':'+tab;
  const currentChapter=currentQuestion(state)?.chapterId;
  if(currentChapter)preloadScene(currentChapter);
  app.style.setProperty('--dialogue-frame',uiArt['UI-01']?'url("'+uiArt['UI-01']+'")':'none');
  if(identity!==viewIdentity){animateEntrance(app);viewIdentity=identity;}
  app.style.setProperty('--cover-art',extraArt['EX-01']?'url("'+extraArt['EX-01']+'")':'none');
  sceneAmbience(currentQuestion(state)?.chapterId??'gate',['intro','explore','question','feedback'].includes(state.phase)&&!state.paused);
  setMusicContext(state.paused);
}
app.addEventListener('click',event=>{
  const target=event.target.closest('button[data-action]');
  if(!target||target.disabled)return;
  const id=target.dataset.id;
  switch(target.dataset.action){
    case 'toggle-music':setMusicEnabled(!musicPreferences().enabled);target.textContent=musicPreferences().enabled?'背景音樂：開':'背景音樂：關';break;
    case 'toggle-audio':setAudioEnabled(!audioPreferences().enabled);target.textContent=audioPreferences().enabled?'音效：開':'音效：關';playCue('uiOpen');sceneAmbience(currentQuestion(state)?.chapterId??'gate',['intro','explore','question','feedback'].includes(state.phase)&&!state.paused);break;
    case 'tilt':enableTilt().then(message=>{const status=app.querySelector('#sensor-status');if(status)status.textContent=message;});break;
    case 'calibrate':calibrateTilt();{const status=app.querySelector('#sensor-status');if(status)status.textContent='已重新校準，請輕微傾斜移動。';}break;
    case 'finish-intro':commit(finishIntro(state));break;
    case 'replay-intro':render();break;
    case 'puzzle-item':if(puzzles[state.puzzle.chapterId].slots){selectedTile=selectedTile===id?null:id;playCue('puzzleOperate');render();}else commit(togglePuzzle(state,id));break;
    case 'puzzle-slot':{const item=selectedTile;selectedTile=null;commit(placePuzzle(state,id,item));break;}
    case 'puzzle-turn':commit(rotatePuzzle(state,Number(id)));break;
    case 'check-puzzle':commit(checkPuzzle(state));break;
    case 'start-trial':commit(startTrial(state));break;
    case 'open-puzzle':app.querySelector('.puzzle-board')?.scrollIntoView({behavior:'smooth',block:'start'});break;
    case 'enter':tab='journey';commit(enterChapter(state,id));break;
    case 'strategy':commit(setStrategy(state,id));break;
    case 'answer':commit(answer(state,id));break;
    case 'hint':{const next=useHint(state,id);if(next!==state)playCue(id==='jing'?'hintJing':id==='duan'?'hintDuan':'hintJinxi');commit(next);break;}
    case 'item':{const next=useItem(state,id);if(next!==state)playCue(id==='needle'?'itemNeedle':'itemPaper');commit(next);break;}
    case 'pause':commit(pauseGame(state));break;
    case 'resume':commit(resumeGame(state));break;
    case 'next':commit(advance(state));break;
    case 'correct':commit(correctionAnswer(state,id));break;
    case 'review-next':commit(advanceCorrection(state));break;
    case 'continue':commit(continueJourney(state));break;
    case 'journey':tab='journey';render();break;
    case 'record':tab='record';render();break;
    case 'reset':resetting=true;if(state.phase==='question')commit(pauseGame(state));render();break;
    case 'cancel-reset':resetting=false;render();break;
    case 'confirm-reset':clearTrialDrafts();resetting=false;tab='journey';warning='';commit(createGame());break;
    case 'print':window.print();break;
    case 'export':{
      const url=URL.createObjectURL(new Blob([JSON.stringify(report(state),null,2)],{type:'application/json'}));
      const a=document.createElement('a');a.href=url;a.download='紫禁語文弈-學習歷程.json';a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);break;
    }
  }
});
app.addEventListener('change',event=>{
  if(event.target.id==='music-volume')setMusicVolume(Number(event.target.value)/100);
  if(event.target.id==='audio-volume')setAudioVolume(Number(event.target.value)/100);
  if(event.target.id==='timed'&&state.phase==='map')commit({...state,timed:event.target.checked});
});
function tick(){
  if(state.phase!=='question'||state.paused||state.deadline===null)return;
  const remaining=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));
  const counter=document.querySelector('#seconds');if(counter)counter.textContent=remaining;
  if(remaining>0&&remaining<=5&&remaining!==lastTick)playCue('countdown');lastTick=remaining;
  if(remaining===0)commit(answer(state,null));
}
render();tick();setInterval(tick,250);document.addEventListener('visibilitychange',tick);

