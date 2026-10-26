import { createGame, playableChapters, currentQuestion, chapterQuestions, strategies } from './engine.js?v=624f66693177';
import { questions } from '../data/questions.js?v=624f66693177';
import { puzzles } from '../data/puzzles.js?v=624f66693177';
export const SAVE_KEY = 'zijin-language-rpg:v2';
export const LEGACY_KEY = 'zijin-language-rpg:v1';
const integer = (x, min, max) => Number.isInteger(x) && x >= min && x <= max;
const validId = id => questions.some(q => q.id === id);
function validAttempt(a) {
  const q = questions.find(q => q.id === a?.questionId);
  return !!q && typeof a.correct === 'boolean' && typeof a.usedHint === 'boolean' &&
    !!strategies[a.strategy] && typeof a.expired === 'boolean' && Number.isFinite(a.at) &&
    integer(a.points, 0, 20) && (a.choiceId === null || q.choices.some(c => c.id === a.choiceId));
}
export function isValidSave(s) {
  if (!s || s.version !== 2 || !integer(s.hp, 0, 100) || !integer(s.hints, 0, 3) ||
    !['map', 'intro', 'explore', 'question', 'feedback', 'remediation', 'chapterComplete', 'ending'].includes(s.phase) ||
    !strategies[s.strategy] || !integer(s.score, 0, 1000000) || !integer(s.bossMind, 0, 100) ||
    !s.inventory || !['needle', 'paper', 'shield'].every(k => integer(s.inventory[k], 0, 2)) ||
    !integer(s.shieldsEarned, 0, 2) || s.inventory.shield > s.shieldsEarned ||
    !['timed', 'hintVisible', 'helped', 'paused'].every(k => typeof s[k] === 'boolean') ||
    typeof s.hintText !== 'string' || !Array.isArray(s.completed) || !Array.isArray(s.attempts) ||
    !Array.isArray(s.eliminated) || !Array.isArray(s.reviewQueue) || !Array.isArray(s.reviews) ||
    !Array.isArray(s.puzzleLog) || !validPuzzle(s.puzzle) ||
    s.puzzleLog.some(a => !a || !puzzles[a.chapterId] || !integer(a.tries,1,1000000) || !Number.isFinite(a.at)) ||
    !integer(s.chapterStart, 0, s.attempts.length) || !integer(s.corrections, 0, 2) ||
    !(s.deadline === null || Number.isFinite(s.deadline)) ||
    !(s.remainingMs === null || (Number.isFinite(s.remainingMs) && s.remainingMs > 0 && s.remainingMs <= 45000)) ||
    s.attempts.some(a => !validAttempt(a)) ||
    s.reviews.some(a => !a || !validId(a.questionId) || typeof a.correct !== 'boolean' || !Number.isFinite(a.at))) return false;
  const ids = playableChapters.map(c => c.id);
  if (s.completed.length > ids.length || s.completed.some((id, i) => id !== ids[i])) return false;
  if (s.phase !== 'question' && (s.deadline !== null || s.paused || s.remainingMs !== null)) return false;
  if (s.phase === 'map') return s.hp > 0 && s.questionId === null && s.completed.length < ids.length;
  if (s.phase === 'ending') return s.questionId === null && s.completed.length === 12 &&
    ['勤學補拙・端敬貴人策書', '文德定鼎・熹貴妃即位策書'].includes(s.ending) && Number.isFinite(s.completedAt);
  const q = currentQuestion(s);
  if (!q || new Set(s.eliminated).size !== s.eliminated.length ||
    s.eliminated.some(id => id === q.answerId || !q.choices.some(c => c.id === id))) return false;
  if (s.phase === 'chapterComplete') {
    const r = s.chapterResult;
    return !!r && r.chapterId === q.chapterId && typeof r.passed === 'boolean' &&
      typeof r.perfect === 'boolean' && typeof r.grantShield === 'boolean' &&
      integer(r.total, 1, questions.length) && integer(r.correct, 0, r.total) &&
      q.chapterId === ids[s.completed.length - (r.passed ? 1 : 0)];
  }
  if (q.chapterId !== ids[s.completed.length]) return false;
  if (s.phase === 'intro' || s.phase === 'explore') return s.hp > 0 && s.puzzle.chapterId === q.chapterId;
  if (!s.puzzle.solved || s.puzzle.chapterId !== q.chapterId) return false;
  if (s.phase === 'question') return s.hp > 0 && (s.paused
    ? s.deadline === null && (s.timed ? s.remainingMs !== null : s.remainingMs === null)
    : s.remainingMs === null && (s.timed ? Number.isFinite(s.deadline) : s.deadline === null));
  const f = s.feedback;
  if (!f || typeof f.correct !== 'boolean' || typeof f.expired !== 'boolean' ||
    typeof f.shielded !== 'boolean' || !integer(f.damage, 0, 30) || !integer(f.points, 0, 20) ||
    !(f.choiceId === null || q.choices.some(c => c.id === f.choiceId))) return false;
  if (s.phase === 'remediation') return s.hp === 0 && s.reviewQueue.length === 3 &&
    new Set(s.reviewQueue).size === 3 && s.reviewQueue.every(validId) &&
    (s.reviewFeedback === null || (s.reviewFeedback.questionId === s.reviewQueue[s.corrections] && typeof s.reviewFeedback.correct === 'boolean'));
  return true;
}
function validPuzzle(v) {
  if (!v || !Array.isArray(v.found) || !Array.isArray(v.order) || !Array.isArray(v.selected) ||
    !v.placements || typeof v.placements !== 'object' || Array.isArray(v.placements) ||
    !integer(v.dial,0,11) || !integer(v.tries,0,1000000) || typeof v.solved !== 'boolean' ||
    !(v.feedback === null || (typeof v.feedback.correct === 'boolean' && typeof v.feedback.message === 'string'))) return false;
  if (v.chapterId === null) return !v.solved && !v.found.length && !v.order.length && !v.selected.length && !Object.keys(v.placements).length;
  const p=puzzles[v.chapterId];
  return !!p && new Set(v.found).size === v.found.length && v.found.every(id=>p.clues.some(c=>c.id===id)) &&
    [v.order,v.selected].every(list=>new Set(list).size===list.length && list.every(id=>p.items.some(x=>x.id===id))) &&
    Object.entries(v.placements).every(([key,id])=>p.slots?.some(slot=>slot.id===key) && p.items.some(item=>item.id===id));
}
function migrateLegacy(old) {
  if (!old || old.version !== 1 || !Array.isArray(old.attempts) || !Array.isArray(old.completed)) return null;
  const s = createGame();
  s.attempts = old.attempts.filter(a => a && validId(a.questionId) && typeof a.correct === 'boolean' && Number.isFinite(a.at)).map(a => {
    const q = questions.find(q => q.id === a.questionId);
    return { ...a, usedHint: !!a.usedHint, strategy: 'gentle', expired: false, points: 0,
      choiceId: a.correct ? q.answerId : q.choices.find(c => c.id !== q.answerId).id };
  });
  s.timed = !!old.timed;
  for (const c of playableChapters) {
    if (old.completed.includes(c.id) && chapterQuestions(c.id).every(q => s.attempts.some(a => a.questionId === q.id))) s.completed.push(c.id);
    else break;
  }
  // 題庫擴充後，未作答的新題所屬關卡需重新完成；保留舊作答供歷程索引。
  return isValidSave(s) ? s : null;
}
export function loadGame(storage) {
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return isValidSave(s) ? { state: s, warning: '' } : { state: createGame(), warning: '存檔格式不相容，已開啟新進度；原存檔尚未覆寫。' };
    }
    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy) {
      const s = migrateLegacy(JSON.parse(legacy));
      if (s) return { state: s, warning: '已匯入舊版作答紀錄。題庫擴充後，尚未完成新增題目的關卡需重新挑戰。舊版存檔仍保留。' };
    }
    return { state: createGame(), warning: '' };
  } catch { return { state: createGame(), warning: '無法讀取存檔，本次將從新進度開始。' }; }
}
export function saveGame(storage, state) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(state)); return true; }
  catch { return false; }
}

