import test from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../src/data/questions.js';
import { chapters } from '../src/data/chapters.js';
import { createGame, chapterQuestions, currentQuestion, remediationQuestion, playableChapters, enterChapter as rawEnterChapter, answer, advance, continueJourney, useHint, useItem, setStrategy, pauseGame, resumeGame, correctionAnswer, advanceCorrection, report } from '../src/game/engine.js';
import { puzzles } from '../src/data/puzzles.js';
import { finishIntro, discoverClue, startTrial } from '../src/game/engine.js';
import { isValidSave, loadGame, saveGame, SAVE_KEY, LEGACY_KEY } from '../src/game/storage.js';
const wrong = q => q.choices.find(c => c.id !== q.answerId).id;
function solveScene(s) {
  s=finishIntro(s);const p=puzzles[s.puzzle.chapterId];
  for(const c of p.clues)s=discoverClue(s,c.id);
  assert.ok(isValidSave(s));
  return s;
}
function enterChapter(s,id,now=Date.now()){
  const next=rawEnterChapter(s,id,now);
  return next.phase==='intro'?startTrial(solveScene(next),now):next;
}

function completeChapter(s, id, shouldFail=false) {
  s=enterChapter(s,id);
  let index=0;
  while(s.phase==='question') {
    s=answer(s,shouldFail&&index++===0?wrong(currentQuestion(s)):currentQuestion(s).answerId);
    assert.ok(isValidSave(s),'valid feedback '+id);
    s=advance(s);
    assert.ok(isValidSave(s),'valid transition '+id);
  }
  assert.equal(s.phase,'chapterComplete');
  return s;
}
function beforeBoss() {
  let s=createGame();
  for(const c of chapters.slice(0,-1))s=continueJourney(completeChapter(s,c.id));
  return s;
}
test('十二關完整，題庫符合47題與關卡配額',()=>{
  assert.equal(playableChapters.length,12);
  assert.equal(questions.length,47);
  for(const c of chapters)assert.equal(chapterQuestions(c.id).length,c.id==='final'?3:4);
});
test('逐關解鎖、不可重複進關或對已結算題再次作答',()=>{
  const s=createGame();
  assert.equal(enterChapter(s,'hall'),s);
  assert.equal(enterChapter(s,'unknown'),s);
  const q=enterChapter(s,'gate');
  assert.equal(enterChapter(q,'gate'),q);
  assert.equal(answer(q,'unknown'),q);
  const r=answer(q,currentQuestion(q).answerId);
  assert.equal(answer(r,currentQuestion(r).answerId),r);
  assert.equal(r.attempts.length,1);
});
test('三種策略各有明確風險與獎勵；進關後不能換策略',()=>{
  for(const [strategy,damage,score] of [['gentle',15,10],['direct',30,20],['classic',20,15]]){
    const q=enterChapter(setStrategy(createGame(),strategy),'gate');
    assert.equal(setStrategy(q,'direct'),q);
    assert.equal(answer(q,wrong(currentQuestion(q))).hp,100-damage);
    assert.equal(answer(q,currentQuestion(q).answerId).score,score);
  }
});
test('密友共用三次，每題一次；排除不會刪掉正解，援助獎勵減半',()=>{
  const q=enterChapter(createGame(),'gate');
  const hinted=useHint(q,'jing');
  assert.equal(hinted.hints,2);
  assert.equal(hinted.eliminated.length,1);
  assert.ok(!hinted.eliminated.includes(currentQuestion(q).answerId));
  assert.equal(useHint(hinted),hinted);
  assert.equal(answer(hinted,hinted.eliminated[0]),hinted);
  assert.equal(answer(hinted,currentQuestion(q).answerId).score,5);
  const exhausted={...q,hints:0};assert.equal(useHint(exhausted),exhausted);
});
test('銀針與殘箋消耗、無可排除選項時不消耗、不能作答已排除選項',()=>{
  let q=enterChapter(createGame(),'gate');
  q=useItem(q,'needle');q=useItem(q,'needle');
  assert.equal(q.inventory.needle,0);assert.equal(q.eliminated.length,2);
  assert.equal(useItem(q,'needle'),q);
  const p=useItem(q,'paper');
  assert.equal(p.inventory.paper,1);assert.ok(p.hintVisible);
  assert.equal(useItem(p,'paper'),p);
  assert.equal(answer(p,currentQuestion(p).answerId).attempts[0].usedHint,true);
});
test('兩枚金牌是全場上限，使用後也不會額外補發',()=>{
  let s=continueJourney(completeChapter(createGame(),'gate'));
  s=continueJourney(completeChapter(s,'hall'));
  assert.equal(s.shieldsEarned,2);assert.equal(s.inventory.shield,2);
  s=enterChapter(s,'library');
  s=answer(s,wrong(currentQuestion(s)));
  assert.equal(s.hp,100);assert.ok(s.feedback.shielded);assert.equal(s.inventory.shield,1);
  s=advance(s);
  while(s.phase==='question')s=advance(answer(s,currentQuestion(s).answerId));
  s=continueJourney(s);
  s=completeChapter(s,'garden');
  assert.equal(s.shieldsEarned,2);assert.equal(s.inventory.shield,1);
  assert.equal(advance(s),s);
});
test('45秒截止即超時；重整不延長時間，未過期不能自發超時',()=>{
  const s=enterChapter({...createGame(),timed:true},'gate',1000);
  assert.equal(s.deadline,46000);
  assert.equal(answer(s,null,45000),s);
  assert.ok(answer(s,currentQuestion(s).answerId,46000).feedback.expired);
  assert.equal(answer(JSON.parse(JSON.stringify(s)),null,47000).hp,85);
});
test('暫停禁止作答與用道具、恢復保留秒數，過期後不能用暫停挽回',()=>{
  const s=enterChapter({...createGame(),timed:true},'gate',1000);
  const p=pauseGame(s,11000);assert.equal(p.remainingMs,35000);assert.ok(isValidSave(p));
  assert.equal(answer(p,currentQuestion(p).answerId),p);
  assert.equal(useItem(p,'needle'),p);assert.equal(useHint(p),p);
  const r=resumeGame(p,100000);assert.equal(r.deadline,135000);assert.ok(isValidSave(r));
  assert.ok(pauseGame(s,46000).feedback.expired);
});
test('氣血歸零後三道不同訂正題、錯誤歸零、回到原進度且不灌首次得分',()=>{
  let s=enterChapter({...createGame(),hp:15},'gate');
  s=advance(answer(s,wrong(currentQuestion(s))));
  assert.equal(s.phase,'remediation');assert.equal(new Set(s.reviewQueue).size,3);assert.ok(isValidSave(s));
  const original=s.questionId;
  s=advanceCorrection(correctionAnswer(s,remediationQuestion(s).answerId));
  assert.equal(s.corrections,1);
  s=advanceCorrection(correctionAnswer(s,wrong(remediationQuestion(s))));
  assert.equal(s.corrections,0);
  for(let i=0;i<3;i++){
    const r=correctionAnswer(s,remediationQuestion(s).answerId);
    assert.equal(correctionAnswer(r,remediationQuestion(s).answerId),r);
    s=advanceCorrection(r);assert.ok(isValidSave(s));
  }
  assert.equal(s.hp,60);assert.equal(s.questionId,original);assert.equal(s.phase,'feedback');
  assert.equal(s.score,0);assert.equal(s.attempts.length,1);assert.equal(s.reviews.length,5);
  assert.notEqual(advance(s).questionId,original);
});
test('全47題通關、十二碎片、終局心防歸零、策書與所有存檔階段有效',()=>{
  let s=createGame();assert.ok(isValidSave(s));
  for(const c of chapters){
    s=completeChapter(s,c.id);
    const completed=s.completed.length;
    assert.equal(advance(s),s);
    assert.equal(s.completed.length,completed);
    s=continueJourney(s);assert.ok(isValidSave(s));
  }
  assert.equal(s.phase,'ending');assert.equal(s.completed.length,12);assert.equal(s.bossMind,0);
  assert.equal(s.attempts.length,47);assert.equal(report(s).firstAttemptAccuracy,100);
  assert.match(s.ending,/文德定鼎/);
});
test('終局未全對需重試且保留十一關；首次錯誤不被重試正確覆蓋',()=>{
  let s=completeChapter(beforeBoss(),'final',true);
  assert.equal(s.chapterResult.passed,false);assert.equal(s.completed.length,11);assert.ok(isValidSave(s));
  s=continueJourney(s);assert.equal(s.bossMind,100);
  while(s.phase==='question')s=advance(answer(s,currentQuestion(s).answerId));
  assert.equal(s.completed.length,12);
  s=continueJourney(s);assert.equal(s.phase,'ending');
  assert.equal(report(s).firstAttemptAccuracy,98);
  assert.equal(report(s).wrongQuestions.length,1);
});
test('經過訂正的通關顯示勤學策書',()=>{
  const s={...beforeBoss(),reviews:[{questionId:questions[0].id,correct:true,at:1}]};
  assert.match(continueJourney(completeChapter(s,'final')).ending,/勤學補拙/);
});
test('舊版存檔保留作答紀錄，新增題目未做完的關卡需再完成',()=>{
  const legacy={version:1,completed:['gate'],attempts:chapterQuestions('gate').slice(0,2).map(q=>({questionId:q.id,correct:true,usedHint:false,at:1}))};
  const loaded=loadGame({getItem:key=>key===LEGACY_KEY?JSON.stringify(legacy):null});
  assert.equal(loaded.state.attempts.length,2);assert.equal(loaded.state.completed.length,0);assert.ok(isValidSave(loaded.state));
});
test('存檔讀寫錯誤容錯，無效資源、流程與題目會被拒絕',()=>{
  const q=enterChapter(createGame(),'gate');
  assert.ok(isValidSave(q));
  for(const patch of [{hp:-1},{inventory:{needle:-1,paper:2,shield:0}},{questionId:'missing'},{completed:['library']},{deadline:1},{shieldsEarned:3}])assert.equal(isValidSave({...q,...patch}),false);
  assert.equal(loadGame({getItem:()=>'{broken'}).state.phase,'map');
  assert.equal(loadGame({getItem:k=>k===SAVE_KEY?JSON.stringify(q):null}).state.questionId,q.questionId);
  assert.equal(saveGame({setItem(){throw Error('full');}},q),false);
});



test('All twelve chapters proceed from clues directly to formal trials',()=>{
  for(const c of chapters){
    const base={...createGame(),completed:chapters.slice(0,c.number-1).map(x=>x.id)};
    let state=finishIntro(rawEnterChapter(base,c.id));
    assert.equal(startTrial(state),state);
    for(const clue of puzzles[c.id].clues)state=discoverClue(state,clue.id);
    state=startTrial(state);
    assert.equal(state.phase,'question');assert.equal(state.score,0);assert.ok(isValidSave(state));
  }
});
