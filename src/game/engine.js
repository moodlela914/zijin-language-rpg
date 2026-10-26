import { chapters, ranks } from '../data/chapters.js?v=624f66693177';
import { questions } from '../data/questions.js?v=624f66693177';
import { puzzles } from '../data/puzzles.js?v=624f66693177';
export const strategies = {
  gentle: { label: '以柔克剛', damage: 15, score: 10, description: '答錯扣 15 氣血，答對得 10 文墨。' },
  direct: { label: '剛直批駁', damage: 30, score: 20, description: '答錯扣 30 氣血，答對得 20 文墨。' },
  classic: { label: '引經據典', damage: 20, score: 15, description: '答錯扣 20 氣血，答對得 15 文墨。' },
};
export const playableChapters = chapters.filter(c => questions.some(q => q.chapterId === c.id));
export const chapterQuestions = id => questions.filter(q => q.chapterId === id);
export const currentQuestion = s => questions.find(q => q.id === s.questionId);
export const remediationQuestion = s => questions.find(q => q.id === s.reviewQueue[s.corrections]);
export const rankOf = s => ranks[Math.min(Math.floor(s.completed.length * (ranks.length - 1) / 12), ranks.length - 1)];
export const createPuzzle = chapterId => ({ chapterId, found: [], placements: {}, order: [], selected: [], dial: 0, solved: false, tries: 0, feedback: null });
export function createGame() {
  return { version: 2, hp: 100, hints: 3, completed: [], questionId: null, phase: 'map',
    attempts: [], feedback: null, hintVisible: false, hintText: '', corrections: 0, timed: false,
    deadline: null, strategy: 'gentle', score: 0, inventory: { needle: 2, paper: 2, shield: 0 },
    eliminated: [], helped: false, paused: false, remainingMs: null, chapterStart: 0,
    bossMind: 100, reviewQueue: [], reviewFeedback: null, reviews: [], chapterResult: null,
    ending: null, completedAt: null, shieldsEarned: 0, puzzle: createPuzzle(null), puzzleLog: [] };
}
export function unlocked(s, id) {
  const i = playableChapters.findIndex(c => c.id === id);
  return i >= 0 && (i === 0 || s.completed.includes(playableChapters[i - 1].id));
}
function beginQuestion(s, q, now) {
  return { ...s, phase: 'question', questionId: q.id, feedback: null, hintVisible: false,
    hintText: '', helped: false, eliminated: [], paused: false, remainingMs: null,
    deadline: s.timed ? now + 45000 : null };
}
export function enterChapter(s, id, now = Date.now()) {
  if (s.phase !== 'map' || s.completed.includes(id) || !unlocked(s, id)) return s;
  return { ...s, phase: 'intro', questionId: chapterQuestions(id)[0].id, chapterStart: s.attempts.length,
    chapterResult: null, bossMind: 100, puzzle: createPuzzle(id), feedback: null, deadline: null };
}
export function finishIntro(s) { return s.phase === 'intro' ? { ...s, phase: 'explore' } : s; }
export function discoverClue(s, id) {
  if (s.phase !== 'explore' || s.puzzle.found.includes(id) || !puzzles[s.puzzle.chapterId].clues.some(c => c.id === id)) return s;
  return { ...s, puzzle: { ...s.puzzle, found: [...s.puzzle.found, id] } };
}
export function startTrial(s, now = Date.now()) {
  if(s.phase!=='explore'||s.puzzle.found.length!==puzzles[s.puzzle.chapterId].clues.length)return s;
  // Retain the saved readiness marker so existing v2 journeys remain readable.
  return beginQuestion({...s,puzzle:{...s.puzzle,solved:true,feedback:null}},chapterQuestions(s.puzzle.chapterId)[0],now);
}
export function setStrategy(s, strategy) {
  return s.phase === 'map' && strategies[strategy] ? { ...s, strategy } : s;
}
function removeWrong(s) {
  const q = currentQuestion(s);
  const wrong = q.choices.find(c => c.id !== q.answerId && !s.eliminated.includes(c.id));
  return wrong ? [...s.eliminated, wrong.id] : null;
}
export function useHint(s, ally = 'jinxi') {
  if (s.phase !== 'question' || s.paused || s.hints <= 0 || s.hintVisible || !['jinxi', 'jing', 'duan'].includes(ally)) return s;
  const q = currentQuestion(s), eliminated = ally === 'jing' ? removeWrong(s) : s.eliminated;
  if (!eliminated) return s;
  const text = ally === 'jing' ? '敬妃：避開這個誤判「' + q.choices.find(c=>c.id===eliminated.at(-1)).text + '」。請再核對線索。' : ally === 'duan' ? '端妃・概念拆解：' + q.correction : '槿汐・思考方向：' + q.hint;
  return { ...s, hints: s.hints - 1, hintVisible: true, helped: true, hintText: text, eliminated };
}
export function useItem(s, item) {
  if (s.phase !== 'question' || s.paused || !['needle', 'paper'].includes(item) || s.inventory[item] <= 0) return s;
  const eliminated = item === 'needle' ? removeWrong(s) : s.eliminated;
  if (!eliminated || (item === 'paper' && s.hintVisible)) return s;
  return { ...s, inventory: { ...s.inventory, [item]: s.inventory[item] - 1 }, helped: true,
    eliminated, hintVisible: item === 'paper' || s.hintVisible,
    hintText: item === 'paper' ? '菊花殘箋：' + currentQuestion(s).hint : s.hintText };
}
export function pauseGame(s, now = Date.now()) {
  if (s.phase !== 'question' || s.paused) return s;
  if (s.deadline !== null && now >= s.deadline) return answer(s, null, now);
  return { ...s, paused: true, remainingMs: s.deadline === null ? null : s.deadline - now, deadline: null };
}
export function resumeGame(s, now = Date.now()) {
  return s.phase === 'question' && s.paused ? { ...s, paused: false, deadline: s.remainingMs === null ? null : now + s.remainingMs, remainingMs: null } : s;
}
export function answer(s, choiceId, now = Date.now(), response = null) {
  const q = currentQuestion(s);
  if (s.phase !== 'question' || s.paused || !q) return s;
  const recordedResponse=response&&typeof response.kind==='string'&&typeof response.summary==='string'?response:null;
  if (choiceId !== null && (!q.choices.some(c => c.id === choiceId) || (s.eliminated.includes(choiceId)&&!recordedResponse))) return s;
  const expired = s.deadline !== null && now >= s.deadline;
  if (choiceId === null && !expired) return s;
  const correct = !expired && choiceId === q.answerId;
  const shielded = !correct && s.inventory.shield > 0;
  const damage = correct || shielded ? 0 : strategies[s.strategy].damage;
  const points = correct ? Math.floor(strategies[s.strategy].score * (s.helped ? 0.5 : 1)) : 0;
  return { ...s, phase: 'feedback', hp: Math.max(0, s.hp - damage), deadline: null,
    score: s.score + points, inventory: { ...s.inventory, shield: s.inventory.shield - (shielded ? 1 : 0) },
    bossMind: q.chapterId === 'final' && correct ? Math.max(0, s.bossMind - Math.ceil(100 / chapterQuestions('final').length)) : s.bossMind,
    feedback: { correct, expired, choiceId: expired ? null : choiceId, damage, points, shielded, response:expired?null:recordedResponse },
    attempts: [...s.attempts, { questionId: q.id, correct, usedHint: s.helped, strategy: s.strategy, choiceId: expired ? null : choiceId, expired, points, at: now, response:expired?null:recordedResponse }] };
}
export function advance(s, now = Date.now()) {
  if (s.phase !== 'feedback') return s;
  const q = currentQuestion(s);
  if (s.hp === 0) {
    const failed = [...new Set(s.attempts.filter(a => !a.correct).map(a => a.questionId))].reverse();
    const reviewQueue = [...new Set([q.id, ...failed, ...chapterQuestions(q.chapterId).map(q => q.id), ...questions.map(q => q.id)])].slice(0, 3);
    return { ...s, phase: 'remediation', corrections: 0, reviewQueue, reviewFeedback: null };
  }
  const list = chapterQuestions(q.chapterId), next = list[list.findIndex(item => item.id === q.id) + 1];
  if (next) return beginQuestion(s, next, now);
  const attempts = s.attempts.slice(s.chapterStart), correct = attempts.filter(a => a.correct).length;
  const perfect = attempts.length === list.length && attempts.every(a => a.correct && !a.usedHint);
  const passed = q.chapterId !== 'final' || s.bossMind === 0;
  const grantShield = passed && perfect && s.shieldsEarned < 2;
  return { ...s, phase: 'chapterComplete', chapterResult: { chapterId: q.chapterId, correct, total: attempts.length, perfect, passed, grantShield },
    completed: passed ? [...new Set([...s.completed, q.chapterId])] : s.completed,
    inventory: { ...s.inventory, shield: s.inventory.shield + (grantShield ? 1 : 0) },
    shieldsEarned: s.shieldsEarned + (grantShield ? 1 : 0),
    hp: passed ? Math.min(100, s.hp + 10) : s.hp };
}
export function continueJourney(s, now = Date.now()) {
  if (s.phase !== 'chapterComplete') return s;
  if (!s.chapterResult.passed) return beginQuestion({ ...s, bossMind: 100, chapterStart: s.attempts.length, chapterResult: null }, chapterQuestions('final')[0], now);
  if (s.chapterResult.chapterId === 'final') return { ...s, phase: 'ending', questionId: null, completedAt: now,
    ending: s.reviews.length ? '勤學補拙・端敬貴人策書' : '文德定鼎・熹貴妃即位策書' };
  return { ...s, phase: 'map', questionId: null, feedback: null, hintVisible: false, hintText: '', eliminated: [], helped: false };
}
export function correctionAnswer(s, choiceId, now = Date.now()) {
  const q = remediationQuestion(s);
  if (s.phase !== 'remediation' || s.reviewFeedback || !q || !q.choices.some(c => c.id === choiceId)) return s;
  const correct = choiceId === q.answerId;
  return { ...s, reviewFeedback: { correct, questionId: q.id }, reviews: [...s.reviews, { questionId: q.id, correct, at: now }] };
}
export function advanceCorrection(s) {
  if (s.phase !== 'remediation' || !s.reviewFeedback) return s;
  const count = s.reviewFeedback.correct ? s.corrections + 1 : 0;
  if (count >= s.reviewQueue.length) return { ...s, hp: 60, phase: 'feedback', corrections: 0, reviewQueue: [], reviewFeedback: null };
  return { ...s, corrections: count, reviewFeedback: null };
}
export function report(s) {
  const first = [...new Map([...s.attempts].reverse().map(a => [a.questionId, a])).values()];
  return { title: '紫禁語文弈・學習歷程', exportedAt: new Date().toISOString(), completed: s.completed,
    rank: rankOf(s), hp: s.hp, score: s.score, ending: s.ending,
    firstAttemptAccuracy: first.length ? Math.round(first.filter(a => a.correct).length / first.length * 100) : 0,
    concepts: [...new Set(questions.map(q => q.concept))].map(concept => {
      const attempts = first.filter(a => questions.find(q => q.id === a.questionId)?.concept === concept);
      return { concept, attempts: attempts.length, correct: attempts.filter(a => a.correct).length, hintsUsed: attempts.filter(a => a.usedHint).length };
    }), wrongQuestions: [...new Set(s.attempts.filter(a => !a.correct).map(a => a.questionId))].map(id => {
      const q = questions.find(q => q.id === id);
      return { id, chapterId: q.chapterId, concept: q.concept, prompt: q.prompt, answer: q.choices.find(c => c.id === q.answerId).text, explanation: q.explanation };
    }), attempts: s.attempts, reviews: s.reviews, puzzleLog: s.puzzleLog };
}
