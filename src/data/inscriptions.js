// 第六關單一資料來源。題目與答案 ID 保留，四批禮單各練習不同場合。
const entry = (id, concept, answerId, prompt, pairs, hint, explanation, sources) => {
  const summary = order => pairs.map((pair, i) => `${pair.left}配${pairs[order[i]].right}`).join('；');
  const alternatives = [[0, 1, 2], [1, 0, 2], [2, 1, 0]];
  const correctIndex = ['a', 'b', 'c'].indexOf(answerId);
  const choices = ['a', 'b', 'c'].map((choiceId, i) => ({
    id: choiceId, text: summary(i === correctIndex ? alternatives[0] : alternatives[1 + (i < correctIndex ? i : i - 1)]),
  }));
  return {
    id, chapterId: 'yikun', concept, prompt, choices, answerId, hint, explanation,
    correction: `先讀卡片的主要用意，再配題辭：${summary(alternatives[0])}。`,
    sourceTitle: sources[0].title, sourceUrl: sources[0].url, sources,
    difficulty: 'medium', skill: '應用', reviewStatus: 'draft-teacher-review',
    sourceStatus: 'reference-linked',
    interaction: { kind: 'matching', instruction: '閱讀每張禮單的主要用意，把三張題辭卡分別配回去。', pairs },
    editorialReview: {
      date: '2026-10-26', changes: '改為四批連續禮單之一，十二張題辭跨題不重複；明定每張卡片的主要用意。',
      distractorPrinciple: '兩個誘答各交換一對真實題辭；其中一組配對仍正確，必須核對完整三組。',
      audience: '國小高年級教師引導／國中學習', difficultyTarget: 'medium', studentCalibration: 'pending', teacherApproval: 'pending',
    },
  };
};
const source = (title, url) => ({ title, url });
const revised = (title, id) => source(`教育部《重編國語辭典修訂本》：${title}`, `https://dict.revised.moe.edu.tw/dictView.jsp?ID=${id}`);
export const inscriptionQuestions = [
  entry('inscription-daughter', '新生與新婚賀辭', 'a',
    '華妃交給妳第一批家族喜事禮單：兩家分別添女、添男，另一對新人剛成婚。新婚卡的主要用意是祝夫妻長久和睦，不是祝賀出生。請配好三張題辭。',
    [{ id: 'girl', left: '祝賀添女', right: '弄瓦之喜' }, { id: 'boy', left: '祝賀添男', right: '弄璋之喜' }, { id: 'birthday', left: '祝新婚夫妻長久和睦', right: '百年好合' }],
    '兩張出生卡要辨認傳統男女賀辭；另一張的重點是夫妻長久相處。',
    '弄瓦之喜傳統上賀生女，弄璋之喜賀生男；百年好合祝夫妻感情長久。前兩者同為出生賀辭，仍要核對禮單對象；新婚卡談的是夫妻關係。這是辨認傳統用語，不代表男女價值有高低。',
    [source('教育部《國語辭典簡編本》：弄瓦之喜', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=13082'), revised('弄璋之喜', 58782), revised('百年好合', 14206)]),
  entry('inscription-son', '婚嫁遷居與開業題辭', 'b',
    '頌芝送來第二批禮單：女子今日出嫁、一家今日遷入新居、商店今日新開。三張卡分別要點明出嫁、搬家、開業，請依事件配好題辭。',
    [{ id: 'boy', left: '點明女子出嫁之喜', right: '之子于歸' }, { id: 'bride', left: '點明遷入新居之喜', right: '喬遷之喜' }, { id: 'birthday', left: '點明商店新開之喜', right: '駿業宏開' }],
    '不要只找吉祥字；先把出嫁、遷居與開業三件事分開。',
    '之子于歸用來祝賀女子出嫁；喬遷之喜可賀遷居，也可賀升官，本題明定搬入新居；駿業宏開列於商店開業題辭。三者都是喜慶語，卻不能只憑好聽就交換場合。',
    [source('教育部《重編國語辭典修訂本》附錄：常用題辭表（商店開業）', 'https://dict.revised.moe.edu.tw/appendix.jsp?ID=11&SN=&page=9'), revised('喬遷之喜', 99813), source('教育部《重編國語辭典修訂本》附錄：常用題辭表', 'https://dict.revised.moe.edu.tw/appendix.jsp?ID=11')]),
  entry('inscription-wedding', '學業師恩與送行題辭', 'c',
    '第三批禮單送到宮中書房：學子已考中、老師多年教出眾多學生、另一位學子即將遠行求學。卡片依序要賀錄取、謝育才、祝未來前程，請逐一配對。',
    [{ id: 'wedding', left: '祝賀已考中錄取', right: '金榜題名' }, { id: 'girl', left: '讚老師教出眾多學生', right: '桃李滿門' }, { id: 'birthday', left: '送別學子並祝前程遠大', right: '鵬程萬里' }],
    '分清已經取得的成果、老師育才的成就，以及對未來的祝願。',
    '金榜題名指考試被錄取；桃李滿門比喻學生眾多；鵬程萬里比喻前程遠大，常作臨別贈語。鵬程萬里也能祝福考中者，但本次卡片明定主要用意：賀已錄取用金榜題名，送行祝未來用鵬程萬里。',
    [revised('金榜題名', 93973), revised('桃李滿門', 50186), revised('鵬程萬里', 24221)]),
  entry('inscription-birthday', '壽誕退休與追思題辭', 'a',
    '最後一批卡片不能送錯：健在長輩過生日，要祝長壽；老臣完成職責後告老退休，要讚圓滿退任；故人已逝，要表達追思。請核對三張題辭後再封卡。',
    [{ id: 'birthday', left: '祝健在長輩生日長壽', right: '壽比南山' }, { id: 'wedding', left: '讚完成職責後告老退任', right: '功成身退' }, { id: 'boy', left: '追念已逝故人的聲音容貌', right: '音容宛在' }],
    '先確認對象是否健在，再分清祝長壽、讚退任與追思的用意。',
    '壽比南山祝長壽；功成身退指功業成就後退休歸隱，本題特別交代老臣已完成職責；音容宛在形容聲音容貌彷彿仍在眼前，多用於追念逝者。退休不等於去世，追思語也不能當生日祝福。',
    [source('教育部《國語辭典簡編本》：壽比南山', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=34367'), revised('功成身退', 74988), revised('音容宛在', 156314)]),
];
