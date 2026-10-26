import test from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../src/data/questions.js';
import {kindOf,newDraft,readyTrial,evaluateTrial,argumentStamp} from '../src/game/trial-model.js';
function correctDraft(q){
  const d=newDraft(),p=q.interaction,k=kindOf(q);
  if(['sequence','couplet'].includes(k))d.order=[...p.solution];
  else if(k==='highlight')d.selected=[...p.targetIds];
  else if(k==='matching')d.matches=Object.fromEntries(p.pairs.map(x=>[x.id,x.id]));
  else if(k==='form')d.fields={...p.solution};
  else if(k==='timeline'){d.slider=p.ticks.findIndex(x=>x.id===p.solutionId);d.adjusted=true;}
  else if(k==='proofread'){d.targetId=p.targetId;d.choiceId=q.answerId;}
  else if(k==='prism'){d.index=q.choices.findIndex(x=>x.id===q.answerId);d.seen=[0,1,2];}
  else if(k==='argument'){d.choiceId=q.answerId;d.stamp=argumentStamp(q);}
  else d.choiceId=q.answerId;
  return d;
}
test('十二關各有不同正式闖關操作，28題互動資料不退回三選一',()=>{
  const kinds=[...new Set(questions.map(kindOf))];
  assert.equal(kinds.length,12);assert.ok(!kinds.includes('choice'));
  assert.equal(questions.filter(q=>q.interaction).length,28);
});
test('全47題的正確操作都映射至原答案，保留可匯出的真實操作摘要',()=>{
  for(const q of questions){
    const d=correctDraft(q);assert.ok(readyTrial(q,d),q.id);
    const result=evaluateTrial(q,d);assert.equal(result.correct,true,q.id);
    assert.equal(result.choiceId,q.answerId,q.id);assert.ok(result.response.summary,q.id);
    assert.equal(result.response.kind,kindOf(q));
  }
});
test('排序、圈選、配對、聯語、校勘、填表、時間軸的錯誤操作會被判錯',()=>{
  for(const kind of ['sequence','highlight','matching','couplet','proofread','form','timeline']){
    const q=questions.find(q=>kindOf(q)===kind),d=correctDraft(q),p=q.interaction;
    if(['sequence','couplet'].includes(kind))d.order.reverse();
    if(kind==='highlight')d.selected.push(p.segments.find(x=>!p.targetIds.includes(x.id)).id);
    if(kind==='matching'){const [a,b]=p.pairs;d.matches[a.id]=b.id;d.matches[b.id]=a.id;}
    if(kind==='proofread')d.targetId=p.segments.find(x=>x.id!==p.targetId).id;
    if(kind==='form')d.fields[p.fields[0].id]=p.tiles.find(x=>x.id!==p.solution[p.fields[0].id]).id;
    if(kind==='timeline')d.slider=(d.slider+1)%p.ticks.length;
    const result=evaluateTrial(q,d);assert.equal(result.correct,false,kind);assert.notEqual(result.choiceId,q.answerId,kind);
  }
});
test('原本選錯的詞牌紀錄保留實際選項，不換成另一個錯誤選項',()=>{
  const q=questions[0],d=newDraft();d.choiceId='c';
  const result=evaluateTrial(q,d);assert.equal(result.choiceId,'c');assert.equal(result.response.value,'c');
});
test('立體玉冊需要觀察三面，御前證據鏈同時檢查謬誤與反駁',()=>{
  const prism=questions.find(q=>kindOf(q)==='prism'),d=correctDraft(prism);
  d.seen=[0];assert.equal(readyTrial(prism,d),false);
  const q=questions.find(q=>kindOf(q)==='argument'),argument=correctDraft(q);
  argument.stamp='meaning';if(argumentStamp(q)==='meaning')argument.stamp='cause';
  assert.equal(evaluateTrial(q,argument).correct,false);
});
