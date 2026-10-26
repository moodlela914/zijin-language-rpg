import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,enterChapter,finishIntro,discoverClue,startTrial} from '../src/game/engine.js';
import {puzzles} from '../src/data/puzzles.js';
import {isValidSave} from '../src/game/storage.js';

test('集齊線索即可直接答題，取消機關檢驗及額外加分，存檔仍有效',()=>{
  let s=finishIntro(enterChapter({...createGame(),timed:true},'gate',1000));
  assert.equal(startTrial(s),s);
  for(const clue of puzzles.gate.clues)s=discoverClue(s,clue.id);
  assert.equal(s.puzzle.tries,0);
  const next=startTrial(s,2000);
  assert.equal(next.phase,'question');
  assert.equal(next.deadline,47000);
  assert.equal(next.score,0);
  assert.equal(next.puzzleLog.length,0);
  assert.ok(isValidSave(next));
  assert.equal(startTrial(next),next);
});
