import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,enterChapter,finishIntro,discoverClue,startTrial,currentQuestion,answer,advance,continueJourney,report} from '../src/game/engine.js';
import {puzzles} from '../src/data/puzzles.js';
import {isValidSave,SAVE_KEY} from '../src/game/storage.js';
import {createHistoryExport,parseHistoryImport,applyHistoryImport,HISTORY_BACKUP_KEY} from '../src/game/history-transfer.js';

function begin(timed=false){let s=finishIntro(enterChapter({...createGame(),timed},'gate'));for(const c of puzzles.gate.clues)s=discoverClue(s,c.id);return startTrial(s,1000);}
test('新版歷程可完整匯回，倒數以暫停的剩餘時間保存且不改變原旅程',()=>{
  const s=begin(true),data=createHistoryExport(s,2000),restored=parseHistoryImport(JSON.stringify(data),900000);
  assert.equal(restored.mode,'full');assert.ok(isValidSave(restored.state));
  assert.equal(restored.state.questionId,s.questionId);assert.equal(restored.state.remainingMs,44000);
  assert.equal(restored.state.paused,true);assert.equal(restored.state.deadline,null);assert.equal(s.paused,false);
});
test('舊版學習摘要可恢復作答與已完成關卡，從地圖續玩',()=>{
  let s=begin();while(s.phase==='question')s=advance(answer(s,currentQuestion(s).answerId));s=continueJourney(s);
  const restored=parseHistoryImport(JSON.stringify(report(s)));
  assert.equal(restored.mode,'legacy');assert.equal(restored.state.phase,'map');
  assert.deepEqual(restored.state.completed,['gate']);assert.equal(restored.state.attempts.length,4);assert.equal(restored.state.score,s.score);
});
test('拒絕壞檔、其他遊戲、未知題目、無效資源及不支援的版本',()=>{
  for(const input of ['{bad','{}',JSON.stringify({title:'other',attempts:[],completed:[]}),JSON.stringify({...createHistoryExport(createGame()),formatVersion:999}),JSON.stringify({...createHistoryExport(createGame()),state:{...createGame(),hp:-1}}),JSON.stringify({...report(createGame()),attempts:[{questionId:'unknown'}]})])assert.throws(()=>parseHistoryImport(input));
});
test('確認匯入前先備份；寫入失敗時原存檔維持原狀',()=>{
  const current=createGame(),incoming={...createGame(),score:70},values=new Map([[SAVE_KEY,JSON.stringify(current)]]);
  const storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
  assert.equal(applyHistoryImport(storage,current,incoming).ok,true);
  assert.deepEqual(JSON.parse(values.get(HISTORY_BACKUP_KEY)),current);
  assert.equal(JSON.parse(values.get(SAVE_KEY)).score,70);
  const before=values.get(SAVE_KEY);
  assert.equal(applyHistoryImport({getItem:storage.getItem,setItem(){throw Error('quota');}},incoming,current).ok,false);
  assert.equal(values.get(SAVE_KEY),before);
  const previousBackup=values.get(HISTORY_BACKUP_KEY);
  assert.equal(applyHistoryImport({getItem:storage.getItem,setItem(k,v){if(k===SAVE_KEY)throw Error('quota');values.set(k,v);}},incoming,current).ok,false);
  assert.equal(values.get(HISTORY_BACKUP_KEY),previousBackup);
});
test('其他分頁更新旅程後，舊分頁不可用匯入覆蓋較新進度',()=>{
  const current=createGame(),newer={...createGame(),score:20};
  const values=new Map([[SAVE_KEY,JSON.stringify(newer)]]);
  const result=applyHistoryImport({getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)},current,createGame());
  assert.equal(result.ok,false);assert.equal(JSON.parse(values.get(SAVE_KEY)).score,20);
});
test('匯入視窗只在記憶體暫停，確認時可對照開窗前的存檔',()=>{
  const original=begin(true),snapshot=JSON.stringify(original),paused={...original,paused:true,remainingMs:44000,deadline:null};
  const values=new Map([[SAVE_KEY,snapshot]]);
  const result=applyHistoryImport({getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)},paused,createGame(),{expectedSerialized:snapshot});
  assert.equal(result.ok,true);assert.equal(JSON.parse(values.get(HISTORY_BACKUP_KEY)).paused,true);
});
