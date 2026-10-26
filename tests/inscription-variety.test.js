import test from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../src/data/questions.js';
import {newDraft,evaluateTrial} from '../src/game/trial-model.js';

test('第六關四題各有不同任務與題辭，十二張配對卡不跨題重複',()=>{
  const list=questions.filter(q=>q.chapterId==='yikun');
  assert.equal(list.length,4);
  assert.equal(new Set(list.map(q=>q.concept)).size,4);
  const phrases=list.flatMap(q=>q.interaction.pairs.map(p=>p.right));
  assert.equal(new Set(phrases).size,12);
  for(const q of list){
    assert.equal(new Set(q.choices.map(c=>c.text)).size,3);
    const d=newDraft();d.matches=Object.fromEntries(q.interaction.pairs.map(p=>[p.id,p.id]));
    assert.equal(evaluateTrial(q,d).correct,true);
    assert.equal(evaluateTrial(q,d).choiceId,q.answerId);
    const [a,b]=q.interaction.pairs;d.matches[a.id]=b.id;d.matches[b.id]=a.id;
    assert.equal(evaluateTrial(q,d).correct,false);
  }
});
