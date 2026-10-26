import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { questions } from '../src/data/questions.js';
import { chapters } from '../src/data/chapters.js';

// 執行時唯一來源仍是 questions.js；本腳本只產生可供查找與歸檔的快照。
const root = fileURLToPath(new URL('../', import.meta.url));
const directory = resolve(root, 'docs/question-bank');
const checkOnly = process.argv.includes('--check');
const sourcePath = 'src/data/questions.js';
const sha256 = createHash('sha256').update(await readFile(resolve(root, sourcePath))).digest('hex');
const snapshotVersion = '2026-10-26-v3-reviewed';
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const interactionKinds = {
  garden: 'sequence', pavilion: 'highlight', yikun: 'matching', yanxi: 'couplet',
  medicine: 'proofread', jingren: 'form', cining: 'timeline',
};

function validateInteraction(q) {
  const data = q.interaction;
  if (!data) {
    assert.ok(!interactionKinds[q.chapterId], `${q.id}: 缺少正式互動 payload`);
    return;
  }
  if (interactionKinds[q.chapterId]) assert.equal(data.kind, interactionKinds[q.chapterId], q.id);
  assert.ok(data.instruction?.trim(), `${q.id}: instruction`);
  const validateItems = (items, label = 'text') => {
    assert.ok(Array.isArray(items) && items.length > 0, q.id);
    assert.equal(new Set(items.map(item => item.id)).size, items.length, `${q.id}: 重複 id`);
    assert.ok(items.every(item => typeof item.id === 'string' && item.id && typeof item[label] === 'string' && item[label].trim()), `${q.id}: 牌卡或欄位格式`);
    return new Set(items.map(item => item.id));
  };
  const validateReferences = (references, ids) => {
    assert.ok(Array.isArray(references) && references.length > 0, q.id);
    assert.equal(new Set(references).size, references.length, `${q.id}: 正解引用重複`);
    assert.ok(references.every(id => ids.has(id)), `${q.id}: 正解引用不存在`);
  };
  switch (data.kind) {
    case 'sequence':
    case 'couplet': {
      const ids = validateItems(data.tokens);
      assert.ok(data.tokens.length >= (data.kind === 'sequence' ? 3 : 2) && data.tokens.length <= 4, q.id);
      validateReferences(data.solution, ids);
      assert.equal(data.solution.length, data.tokens.length, `${q.id}: 排序不可漏牌`);
      break;
    }
    case 'highlight': {
      const ids = validateItems(data.segments);
      validateReferences(data.targetIds, ids);
      assert.ok(data.targetIds.length >= 1 && data.targetIds.length <= 2, q.id);
      break;
    }
    case 'matching': {
      validateItems(data.pairs, 'left');
      assert.ok(data.pairs.length >= 2 && data.pairs.length <= 3, q.id);
      assert.equal(new Set(data.pairs.map(p => p.left)).size, data.pairs.length, q.id);
      assert.equal(new Set(data.pairs.map(p => p.right)).size, data.pairs.length, `${q.id}: 右側題辭須唯一`);
      assert.ok(data.pairs.every(p => typeof p.right === 'string' && p.right.trim()), q.id);
      break;
    }
    case 'proofread': {
      const ids = validateItems(data.segments);
      assert.ok(typeof data.targetId === 'string' && ids.has(data.targetId), `${q.id}: targetId`);
      break;
    }
    case 'form': {
      const fields = validateItems(data.fields, 'label');
      const tiles = validateItems(data.tiles);
      assert.ok(data.fields.length >= 2 && data.fields.length <= 3, q.id);
      assert.ok(data.tiles.length >= 3 && data.tiles.length <= 5, q.id);
      assert.deepEqual(Object.keys(data.solution).sort(), [...fields].sort(), `${q.id}: 所有欄位必須有正解`);
      validateReferences(Object.values(data.solution), tiles);
      break;
    }
    case 'timeline': {
      const ids = validateItems(data.ticks);
      assert.ok(data.ticks.length >= 6, q.id);
      assert.ok(typeof data.solutionId === 'string' && ids.has(data.solutionId), `${q.id}: solutionId`);
      break;
    }
    default: assert.fail(`${q.id}: 未知互動種類 ${data.kind}`);
  }
}

assert.equal(questions.length, 47, '本輪必須完整歸檔 47 題');
assert.equal(chapters.length, 12);
assert.equal(new Set(questions.map(q => q.id)).size, questions.length, '題目 ID 不可重複');
for (const q of questions) {
  assert.ok(chapters.some(c => c.id === q.chapterId), q.id);
  assert.equal(q.choices.length, 3, q.id);
  assert.equal(new Set(q.choices.map(c => c.id)).size, 3, q.id);
  assert.equal(new Set(q.choices.map(c => c.text)).size, 3, q.id);
  assert.equal(q.choices.filter(c => c.id === q.answerId).length, 1, q.id);
  for (const key of ['prompt', 'concept', 'hint', 'explanation', 'correction']) assert.ok(q[key]?.trim(), `${q.id}:${key}`);
  assert.equal(q.difficulty, 'medium', q.id);
  assert.ok(['應用', '分析'].includes(q.skill), q.id);
  assert.ok(q.puzzle?.mode && q.puzzle?.objective && q.puzzle?.evidence.length >= 2, q.id);
  assert.equal(q.reviewStatus, 'draft-teacher-review', q.id);
  if (q.sourceUrl) assert.ok(q.sourceUrl.startsWith('https://'), q.id);
  validateInteraction(q);
}

const archiveFiles = new Map();
const chapterIndex = chapters.map(chapter => {
  const items = questions.filter(q => q.chapterId === chapter.id);
  assert.equal(items.length, chapter.id === 'final' ? 3 : 4, chapter.id);
  const filename = `${String(chapter.number).padStart(2, '0')}-${chapter.id}.json`;
  const sources = [...new Map(items.filter(q => q.sourceUrl).map(q => [q.sourceUrl, {
    title: q.sourceTitle, url: q.sourceUrl, status: 'reference-linked',
  }])).values()];
  const entry = {
    chapterId: chapter.id,
    number: chapter.number,
    title: chapter.title,
    topic: chapter.topic,
    concepts: [...new Set(items.map(q => q.concept))],
    questionCount: items.length,
    questionIds: items.map(q => q.id),
    file: `docs/question-bank/${filename}`,
    difficulty: 'medium',
    skills: [...new Set(items.map(q => q.skill))],
    interactionKinds: [...new Set(items.map(q => q.interaction?.kind ?? 'renderer-derived-from-choices'))],
    interactionQuestionIds: items.filter(q => q.interaction).map(q => q.id),
    interactionCount: items.filter(q => q.interaction).length,
    interactionPayloadLocation: '本關 JSON 快照 questions[].interaction',
    learningObjectives: [items[0].puzzle.objective, `能在${chapter.title}的語境中整合線索、比較誘答，並說明選擇理由。`],
    puzzle: {
      mode: items[0].puzzle.mode,
      objective: items[0].puzzle.objective,
      interactionHint: items[0].puzzle.interactionHint,
      evidenceFields: 'questions[].puzzle.evidence（字串陣列）',
      implementationStatus: 'metadata-only-runtime-owned-by-main-agent',
    },
    sources,
    sourceCoverage: { linked: items.filter(q => q.sourceUrl).length, total: items.length },
    unlinkedQuestionIds: items.filter(q => !q.sourceUrl).map(q => q.id),
    reviewStatus: 'draft-teacher-review',
  };
  archiveFiles.set(filename, serialize({
    schemaVersion: 1, snapshotVersion, sourcePath, sourceSha256: sha256,
    chapter: entry, questions: items,
  }));
  return entry;
});

const index = {
  schemaVersion: 1,
  snapshotVersion,
  sourcePath,
  sourceSha256: sha256,
  runtimeDependsOnArchive: false,
  chapterCount: chapterIndex.length,
  questionCount: questions.length,
  interactionQuestionCount: questions.filter(q => q.interaction).length,
  interactionKinds: [...new Set(questions.filter(q => q.interaction).map(q => q.interaction.kind))],
  editorialReview: {
    date: '2026-10-26',
    reviewedQuestionCount: questions.filter(q => q.editorialReview?.date === '2026-10-26').length,
    report: 'docs/question-bank/REVIEW-2026-10-26.md',
    teacherApproval: 'pending', studentCalibration: 'pending',
  },
  intendedDifficulty: 'medium',
  difficultyValidation: 'design-target-not-student-calibrated',
  reviewStatus: 'draft-teacher-review',
  chapters: chapterIndex,
  byQuestionId: Object.fromEntries(chapterIndex.flatMap(c => c.questionIds.map(id => [id, {
    chapterId: c.chapterId, file: c.file,
    concept: questions.find(q => q.id === id).concept,
    puzzleMode: c.puzzle.mode,
    interactionKind: questions.find(q => q.id === id).interaction?.kind ?? 'renderer-derived-from-choices',
    interactionInstruction: questions.find(q => q.id === id).interaction?.instruction ?? null,
    interactionPayloadLocation: `${c.file} → questions[id=${id}].interaction`,
    correctAnswerId: questions.find(q => q.id === id).answerId,
  }]))),
};
archiveFiles.set('index.json', serialize(index));

const allSources = [...new Map(questions.filter(q => q.sourceUrl).map(q => [q.sourceUrl, {
  title: q.sourceTitle, url: q.sourceUrl,
}])).values()];
const readme = `# 十二關題庫歸檔與調度索引

本輪一次完成十二關 **47 題**：第一至十一關各 4 題，養心殿 3 題。原有六題 ID 保留，題幹與選項已升級為情境修補／辨析。題目採國中中等難度設計，尚未經學生試作校準，也尚未獲教師審核。

其中七關共 **28 題**附正式試煉互動 payload：御花園排序、碎玉軒圈選、翊坤宮配對、延禧宮聯語排列、太醫院校勘、景仁宮書信組裝、慈寧宮時間軸。這些題目的題幹、正解摘要、提示與解析都與實際操作任務一致。

## 與場景探索機關的關係

這 47 題是本機遊戲「場景探索、蒐集三處線索，再進入正式互動試煉」流程中的題庫配套；探索後不再另設前置機關考試。場景線索資料由主 agent 維護於 \`src/data/puzzles.js\`，本資料夾保存正式試煉題目與未來調度的線索 metadata，兩者不重複計為題目數。

探索可先教會判讀規則，再讓正式互動試煉檢查玩家是否能運用到新情境；互動接線是否完成，以主程式驗收為準。找到線索本身不等同已證明掌握。全 47 題的故事、閱讀負荷與誘答審查見 \`docs/question-bank/REVIEW-2026-10-26.md\`。

## 唯一來源與再生方式

- 執行時唯一來源：\`src/data/questions.js\`，遊戲不讀取本資料夾。
- 歸檔入口：\`docs/question-bank/index.json\`。
- 每關 JSON 包含完整題目與答案、解析、提示、修正概念、來源、解謎適配資訊。
- 本輪快照：\`${snapshotVersion}\`；索引記錄原始題庫 SHA-256，便於確認版本。
- 更新題庫後：\`node scripts/archive-questions.mjs\`。
- 只檢查同步：\`node scripts/archive-questions.mjs --check\`。

## 關卡清單

| 關卡 | 地點 | 考點 | 題數 | 場景互動適配 | 正式題目互動 |
|---|---|---|---:|---|---|
${chapterIndex.map(c => `| ${String(c.number).padStart(2, '0')} | ${c.title} | ${c.concepts.join('、')} | ${c.questionCount} | ${c.puzzle.objective} | ${c.interactionKinds.join('、')} |`).join('\n')}

## 主 agent 如何調度

1. 先按 \`index.chapters[].chapterId\` 找關卡，取得題目 ID、概念、學習目標、\`puzzle.mode\` 與快照檔案。
2. 按題目 ID 反查：\`index.byQuestionId[questionId]\` 可直接取得關卡及檔案位置。
3. 遊戲程式仍直接匯入 \`questions.js\`，可用 \`questions.filter(q => q.chapterId === chapterId)\` 選關。
4. \`difficulty: 'medium'\` 是設計目標；\`skill\` 是應用／分析。\`puzzle.evidence\` 為線索字串陣列，供未來探索與出題索引使用。
5. 探索機關由主 agent 的獨立場景模組負責；此處只記錄題目與互動適配，不宣稱互動已實作。

## 正式題目 interaction 契約

- \`sequence\`、\`couplet\`：\`tokens: [{id,text}]\`，\`solution: id[]\` 包含全部牌卡且不得重複。排序題三至四牌，聯語二至四牌。
- \`highlight\`：\`segments: [{id,text}]\` 依序連接成完整短文，\`targetIds\` 精確指出一至兩處應圈選的片段。
- \`matching\`：\`pairs: [{id,left,right}]\`，每題二至三組，左右文字各自唯一。renderer 可打亂右側，不能把正解摘要直接顯示為已配好的答案。
- \`proofread\`：\`segments\` 是完整待校稿文字，\`targetId\` 只指一處誤寫或詞義錯誤；圈選後再由既有三個選項選修補。
- \`form\`：\`fields: [{id,label}]\`、\`tiles: [{id,text}]\`，\`solution\` 是欄位 ID 對詞牌 ID；每題二至三欄、三至五詞牌，正解不重用詞牌。
- \`timeline\`：\`ticks: [{id,text}]\` 按題目所述時序排列，至少六個刻度，\`solutionId\` 指向應標記的刻度。跨日時間軸有明示起訖，不把零年當成「再過」的正整數年數。
- 操作正確時映射到原有 \`q.answerId\`，不正確時映射到其他選項 ID，判分仍由主引擎執行。三選項保留作為報表與結果摘要；除校勘第二步外，七關正式介面不必將原三選項直接顯示給玩家。
- \`index.byQuestionId\` 額外提供 \`interactionKind\`、\`interactionInstruction\`、\`interactionPayloadLocation\`、\`correctAnswerId\`，便於未來調度。
- 自動歸檔會校驗各種正解引用、ID 唯一、排序完整、配對詞唯一、欄位正解完備與時間軸刻度數；語文正確性與教學難度仍需教師驗收。

## 資料來源與審核狀態

情境及選項為本專案原創，知識查閱以教育部辭典、官方學校教材與大學圖書館資料為主。以下是已實際查閱或在搜尋結果核對的參考資料；部分頁面僅支持其中的概念，不代表每道題及其所有誘答都獲來源逐字背書。各題有連結者標記 \`reference-linked\`，未逐題連結者標記 \`teacher-review-needed\`；所有題目均保留 \`draft-teacher-review\`。

${allSources.map(s => `- [${s.title}](${s.url})`).join('\n')}

## 知識限制與教師驗收

- 六書採國中常見的傳統分析，題目用「依傳統解釋」界定範圍，不宣稱每個字源分析都沒有學術異說。
- 四部分類按書籍性質；大學圖書館介紹支持四部分類背景，但不是逐題分類專論，正式課堂可另以教材或古籍目錄覆核。
- 題辭與書信屬傳統應用語文，會隨時代、對象與教材規範不同；不將「敬啟」誤用說成刑責，不宣稱所有現代信件都必須沿用古式。
- 年齡代稱及出生賀辭是歷史用語，不能當成現代法定成年規定或性別價值判斷。
- 對聯題清楚限定每題只檢查字數、詞性、結構或已給定的平仄；不以現代國語一二聲／三四聲取代古音完整判讀，也不把單項通過說成全聯合格。
- 節令意象以指定詩句、日期與常見節俗判讀，不把植物花期視為所有地區的絕對規則。
- 唐詩宋詞元曲是代表性成就的概括，不表示其他文體消失。
- 終局三題是原創推理情境，分辨假兩難、未經證成的因果與詞義偷換；未採用原企劃中論證不足的聖旨例句。
- 每題仍保留三個選項作為判分與報表摘要；七關正式試煉另有不同互動 payload，前置探索機關則由主程式獨立呈現。題庫資料本身不是完整場景遊戲。
`;
archiveFiles.set('README.md', readme);

if (!checkOnly) await mkdir(directory, { recursive: true });
for (const [name, content] of archiveFiles) {
  const path = resolve(directory, name);
  if (checkOnly) {
    assert.equal(await readFile(path, 'utf8'), content, `${name} 歸檔已過期，請重新執行歸檔腳本`);
  } else {
    await writeFile(path, content, 'utf8');
  }
}
console.log(`${checkOnly ? '歸檔同步檢查通過' : '已完整歸檔'}：12 關、47 題，入口 docs/question-bank/index.json`);
