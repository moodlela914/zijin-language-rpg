import assert from 'node:assert/strict';
import { chapters } from '../src/data/chapters.js';
import { questions } from '../src/data/questions.js';
assert.equal(chapters.length, 12);
for (const list of [chapters, questions]) assert.equal(new Set(list.map(x => x.id)).size, list.length, 'ID 必須唯一');
for (const q of questions) {
  assert.ok(chapters.some(c => c.id === q.chapterId), `未知關卡：${q.id}`);
  assert.ok(q.prompt && q.explanation && q.hint && q.correction && q.concept, `內容缺漏：${q.id}`);
  assert.ok(q.choices.length >= 2);
  assert.equal(new Set(q.choices.map(c => c.id)).size, q.choices.length);
  assert.ok(q.choices.every(c => c.text));
  assert.equal(q.choices.filter(c => c.id === q.answerId).length, 1, `答案無效：${q.id}`);
}
console.log(`內容檢查通過：${chapters.length} 個關卡、${questions.length} 道示範題。`);
