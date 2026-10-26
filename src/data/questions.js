/** 十二關教學題庫。選項以穩定 id 判分；情境原創，正式教學前仍須教師審題。 */
export const questions = [
  {
    id: 'courtesy-father', chapterId: 'gate', concept: '敬謙詞',
    prompt: '康祿海翻開名冊：「說說妳父親吧。對外介紹自己的父親，該用哪個稱呼？」',
    choices: [{ id: 'a', text: '家父' }, { id: 'b', text: '令尊' }, { id: 'c', text: '尊翁' }], answerId: 'a',
    hint: '先分清楚：你在稱呼自己的親人，還是在尊稱對方的親人？',
    explanation: '「家父」是對別人謙稱自己的父親；「令尊」及「尊翁」用來尊稱他人的父親。',
    correction: '向別人介紹自己的父親，應使用「家父」。',
  },
  {
    id: 'courtesy-home', chapterId: 'gate', concept: '敬謙詞',
    prompt: '「若請學士到自己家中作客，哪一句最得體？」康祿海又問。',
    choices: [{ id: 'a', text: '敬請光臨貴府。' }, { id: 'b', text: '敬請光臨寒舍。' }, { id: 'c', text: '敬請光臨尊府。' }], answerId: 'b',
    hint: '自己的居所用謙詞，對方的居所用敬詞。',
    explanation: '「寒舍」是謙稱自己的住處；「貴府」「尊府」是尊稱他人的府邸。',
    correction: '邀請他人到自己家中，可說「敬請光臨寒舍」。',
  },
  {
    id: 'character-blade', chapterId: 'hall', concept: '六書',
    prompt: '禮官指著玉冊上的「刃」：「在刀鋒處加上一點，標示刀口所在，屬於哪一種造字法？」',
    choices: [{ id: 'a', text: '象形' }, { id: 'b', text: '形聲' }, { id: 'c', text: '指事' }], answerId: 'c',
    hint: '這一點是指示位置的記號，並不是表示讀音的聲符。',
    explanation: '「刃」在「刀」上加指示符號，標明刀鋒的位置，屬於指事。',
    correction: '「刃」以記號指出刀口位置，屬於指事。',
  },
  {
    id: 'character-river', chapterId: 'hall', concept: '六書',
    prompt: '「江」字左邊的水表示意義，右邊的工提示古時讀音。禮官要妳辨認它的造字法。',
    choices: [{ id: 'a', text: '會意' }, { id: 'b', text: '形聲' }, { id: 'c', text: '指事' }], answerId: 'b',
    hint: '一部分表示意義，一部分提示聲音。',
    explanation: '「江」以水為形符、工為聲符，是形聲字。聲符反映造字時的語音，不一定與現代讀音完全相同。',
    correction: '「江」有形符「水」與聲符「工」，屬於形聲。',
  },
  {
    id: 'books-shiji', chapterId: 'library', concept: '四部分類',
    prompt: '學士遞來《史記》：「此書以人物傳記為主，記載歷史。依四部分類，應收入哪一部？」',
    choices: [{ id: 'a', text: '史部' }, { id: 'b', text: '子部' }, { id: 'c', text: '集部' }], answerId: 'a',
    hint: '先看書籍的性質：這是史書、諸子著作，還是詩文集？',
    explanation: '《史記》是紀傳體史書，在經、史、子、集四部分類中屬於史部。',
    correction: '《史記》是史書，歸入史部。',
  },
  {
    id: 'books-zhuangzi', chapterId: 'library', concept: '四部分類',
    prompt: '「《莊子》寓言精采，卻不能只因文采而當作詩文集。」學士問：「該放在哪一部？」',
    choices: [{ id: 'a', text: '經部' }, { id: 'b', text: '集部' }, { id: 'c', text: '子部' }], answerId: 'c',
    hint: '莊子屬於先秦諸子，道家著作如何分類？',
    explanation: '《莊子》是道家著作，歸入子部。分類要看書籍性質，不能單憑文筆優美就歸入集部。',
    correction: '《莊子》為道家著作，歸入子部。',
  },
];

// 下列 helper 僅用於維持題庫格式一致；執行時仍輸出完整、獨立的題目物件。
const makeQuestion = (id, chapterId, concept, prompt, options, answerId, hint, explanation, correction, source = null) => ({
  id, chapterId, concept, prompt,
  choices: options.map((text, index) => ({ id: ['a', 'b', 'c'][index], text })),
  answerId, hint, explanation, correction,
  ...(source ? { sourceTitle: source[0], sourceUrl: source[1] } : {}),
  reviewStatus: 'draft-teacher-review',
  difficulty: 'medium',
  skill: '應用',
});

const sources = {
  family: ['教育部《國語辭典簡編本》附錄：親屬稱謂表', 'https://dict.concised.moe.edu.tw/appendix.jsp?ID=32&deg=1&la=2'],
  father: ['教育部《國語辭典簡編本》：家父', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=21808'],
  home: ['教育部《國語辭典簡編本》：寒舍', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=19676'],
  advice: ['教育部《國語辭典簡編本》：不吝賜教', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=2007'],
  indicative: ['教育部《重編國語辭典修訂本》：指事', 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=113996'],
  phono: ['教育部《重編國語辭典修訂本》：形聲', 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=110679'],
  books: ['國立成功大學圖書館：文淵閣四庫全書電子版介紹', 'https://libapp.lib.ncku.edu.tw/libref/chinese/single/oldbook2.htm'],
  daughter: ['教育部《國語辭典簡編本》：弄瓦', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=13082'],
  son: ['教育部《重編國語辭典修訂本》：弄璋', 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=58782'],
  couplet: ['國立臺灣師範大學 APCS：七言對聯題本範例（平仄規則）', 'https://apcs.csie.ntnu.edu.tw/wp-content/uploads/2025/08/01_APCS-%E7%A8%8B%E5%BC%8F%E5%AF%A6%E4%BD%9C%E5%88%9D%E7%B4%9A%E9%A1%8C%E6%9C%AC%E7%AF%84%E4%BE%8B.pdf'],
  idiom: ['教育部《重編國語辭典修訂本》：差強人意', 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=121497'],
  danger: ['教育部《國語辭典簡編本》：首當其衝', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=34266'],
  manyBooks: ['教育部《國語辭典簡編本》：汗牛充棟', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=19701'],
  parents: ['教育部《重編國語辭典修訂本》：膝下', 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=104596'],
  letter: ['新竹縣內思工業高級中等學校：劉玉瑞老師應用文教學資料', 'https://www.savs.hcc.edu.tw/ischool/publish_page/198/?cid=10325'],
  hairpin: ['教育部《重編國語辭典修訂本》：及笄', 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=87862'],
  cycle: ['教育部《重編國語辭典修訂本》：六十甲子', 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=63847'],
  hour: ['教育部臺灣台語常用詞辭典：子（子時）', 'https://sutian.moe.edu.tw/zh-hant/su/192/'],
  annals: ['教育部《重編國語辭典修訂本》：編年體', 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=18667'],
  poem: ['教育部《重編國語辭典修訂本》：五律', 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=159521'],
};

questions.push(
  makeQuestion('courtesy-mother', 'gate', '敬謙詞',
    '康祿海要妳問候學士的母親。以下哪句稱呼對象正確？',
    ['家母近日安好嗎？', '令堂近日安好嗎？', '舍妹近日安好嗎？'], 'b',
    '要問候的是「對方的母親」，用敬稱。',
    '「令堂」尊稱對方母親；「家母」稱自己的母親，「舍妹」謙稱自己的妹妹，對象不同。',
    '稱自己的母親用「家母」，尊稱對方母親用「令堂」。', sources.family),
  makeQuestion('courtesy-advice', 'gate', '敬謙詞',
    '妳把新寫的文章呈給學士，想謙恭請他指出不足，哪句最合宜？',
    ['此文已無可挑剔，請勿修改。', '請收下你的拙作。', '這是晚輩的拙作，敬請不吝賜教。'], 'c',
    '「拙作」指誰的作品？「賜教」是請誰指教？',
    '「拙作」是謙稱自己的作品，「不吝賜教」是請人多加指教的客套話。把他人的作品稱作「拙作」不合此處敬謙關係。',
    '介紹自己的作品可用「拙作」，請人指導可用「不吝賜教」。', sources.advice),

  makeQuestion('character-sun', 'hall', '六書',
    '禮官展示「日」的古字形：像太陽的輪廓。依傳統六書分類，這種依物體形狀造字的方法是？',
    ['象形', '形聲', '假借'], 'a',
    '觀察字形與事物外形的關係，不需要尋找聲符。',
    '「日」的古字形描繪太陽形象，傳統上歸為象形；形聲須有表示義類與聲音的部分，假借則是借已有字記錄其他詞。',
    '依物體外形描畫而造字，稱為象形。'),
  makeQuestion('character-rest', 'hall', '六書',
    '禮官說：「休」把人與木組合，表示人倚樹休息。依這個傳統解釋，它是哪種造字法？',
    ['指事', '會意', '形聲'], 'b',
    '兩個部分合起來表達一個意思，並非其中一個只提示讀音。',
    '依題目指定的傳統解釋，「人」與「木」合義表達休息，屬於會意；不能只因有兩個部分就判為形聲。',
    '將不同構件的意義組合成新義，是會意造字的常見方式。'),

  makeQuestion('books-analects', 'library', '四部分類',
    '學士找到《論語》：「這部儒家經典，在經、史、子、集的四部分類中，應歸哪一部？」',
    ['史部', '集部', '經部'], 'c',
    '不要把所有討論思想的書都放進子部，先辨認儒家經典。',
    '《論語》屬於儒家經典，四部分類歸入經部；史部以史籍為主，集部以詩文集等為主。',
    '四部分類中，《論語》歸經部。'),
  makeQuestion('books-poetry-collection', 'library', '四部分類',
    '學士把一本《陶淵明集》放到妳面前，內容是作者的詩文。應歸入哪一部？',
    ['集部', '史部', '子部'], 'a',
    '分類看書籍性質：這是個人詩文集，不是人物傳記。',
    '個人詩文集屬集部的別集；不能因作者是古人，就把其詩文集歸史部。',
    '個人的詩文別集歸入集部。'),

  makeQuestion('festival-dragon-boat', 'garden', '節令民俗',
    '御花園備妥粽子、艾草與菖蒲，河上還要舉行龍舟競賽。齊妃問這是哪個節日？',
    ['中秋節', '端午節', '重陽節'], 'b',
    '將粽子、艾草、菖蒲、龍舟一起判讀。',
    '這些都是端午節常見的傳統節俗線索；中秋以賞月等活動著稱，重陽常與登高、茱萸相關。',
    '粽子、艾草、菖蒲和龍舟是辨認端午的常見線索。'),
  makeQuestion('festival-double-ninth', 'garden', '節令詩詞',
    '園中讀到王維詩句「遍插茱萸少一人」。富察貴人問：這個節俗最接近哪個節日？',
    ['元宵節', '七夕', '重陽節'], 'c',
    '抓住「茱萸」與登高的節俗，而非只看到思念親人。',
    '王維〈九月九日憶山東兄弟〉寫重陽思親，插茱萸、登高是相關節俗；思親並非中秋才有。',
    '重陽節的常見文學線索有登高、菊花與茱萸。'),
  makeQuestion('festival-lantern', 'garden', '節令民俗',
    '宮中正月十五晚掛起花燈、讓眾人猜燈謎。這場節慶活動應標作？',
    ['元宵節', '清明節', '中秋節'], 'a',
    '題目同時給了農曆日期與花燈活動。',
    '農曆正月十五為元宵節，又稱上元節；清明主要與掃墓踏青相關，中秋為農曆八月十五。',
    '農曆正月十五的元宵節，又稱上元節。'),
  makeQuestion('season-lotus', 'garden', '節令詩詞',
    '齊妃吟「接天蓮葉無窮碧，映日荷花別樣紅」。依詩中盛放荷花的典型意象，最適合哪個季節？',
    ['冬季', '夏季', '深秋'], 'b',
    '判讀的是古典詩歌中荷花的典型季節，不是所有地區實際花期。',
    '這兩句出自楊萬里〈曉出淨慈寺送林子方〉，以蓮葉與荷花寫夏日景色；題目考典型詩歌意象，不把花期當成跨地區的絕對規則。',
    '古典詩歌中，盛開的荷花常是夏季意象。'),

  makeQuestion('rhetoric-personification', 'pavilion', '修辭辨析',
    '槿汐指著新稿：「海棠垂下頭，悄悄聽我們說話。」把海棠寫成會聆聽的人，主要用了哪種修辭？',
    ['設問', '擬人', '引用'], 'b',
    '注意植物是否被賦予人的動作與能力。',
    '讓海棠像人一樣「聽我們說話」，是擬人。句中沒有自問自答，也沒有借用他人的語句作為論據。',
    '把非人的事物賦予人的動作、情感或能力，稱為擬人。'),
  makeQuestion('rhetoric-hyperbole', 'pavilion', '修辭辨析',
    '浣碧笑說：「才等一刻鐘，我卻覺得等了一百年！」她明知不是實際百年，這裡主要運用了？',
    ['誇飾', '借代', '倒裝'], 'a',
    '比較真實等待時間與故意放大的感受。',
    '把短時間說成一百年，是故意超越實際情況以強化感受的誇飾；沒有以相關事物代替本體，也不是句子成分倒置。',
    '故意放大或縮小程度來強化感受，是誇飾。'),
  makeQuestion('rhetoric-metonymy', 'pavilion', '修辭辨析',
    '槿汐問：「何以解憂？唯有杜康。」句中以傳說中的造酒者「杜康」代指酒，屬於哪種修辭？',
    ['排比', '譬喻', '借代'], 'c',
    '「杜康」與酒是相關聯的事物，不是憑外形相似作比較。',
    '以與酒有關的「杜康」來代指酒，屬於借代。判讀依據是關聯，而非以兩者相似之處構成譬喻。',
    '借代用有關聯的事物名稱代替原來要說的事物。'),
  makeQuestion('rhetoric-pun', 'pavilion', '修辭辨析',
    '浣碧讀劉禹錫詩「道是無晴卻有晴」，題目提示「晴」與「情」同音。這種一語兼含兩意的效果是？',
    ['層遞', '諧音雙關', '頂真'], 'b',
    '從聲音相同、意義不同的兩個字思考。',
    '句中的「晴」兼帶「情」的意思，運用同音關係形成諧音雙關；並非程度逐步推進，也不是前句末詞接後句開頭。',
    '利用同音或近音使一句話兼含兩意，稱為諧音雙關。'),

  makeQuestion('inscription-daughter', 'yikun', '題辭辨析',
    '華妃命人為新生女兒備賀帖。依傳統題辭用語，以下哪一項與生女最相合？',
    ['弄瓦之喜', '弄璋之喜', '壽比南山'], 'a',
    '「弄璋」與「弄瓦」在傳統用語中分別指不同的出生賀事。',
    '傳統用語「弄瓦」指生女，「弄璋」指生男，「壽比南山」用來祝壽。這是辨認歷史用語，不代表現代應有性別價值差別。',
    '傳統題辭：弄瓦賀生女，弄璋賀生男。', sources.daughter),
  makeQuestion('inscription-son', 'yikun', '題辭辨析',
    '頌芝把賀生子的卡片與祝壽卡混在一起。依傳統用語，哪張應放入生子賀禮？',
    ['福如東海', '弄璋之喜', '懿範長存'], 'b',
    '先確認場合是出生、壽誕，還是哀悼。',
    '「弄璋之喜」傳統上賀生男；「福如東海」多用於祝壽，「懿範長存」屬哀輓。不可只因字面吉祥就混用場合。',
    '「弄璋之喜」是傳統賀生子的用語。', sources.son),
  makeQuestion('inscription-wedding', 'yikun', '題辭辨析',
    '宮中為新人籌辦婚禮，需要一則祝賀家庭和睦的題辭。哪一項最合適？',
    ['駕鶴西歸', '弄璋之喜', '宜室宜家'], 'c',
    '「室」「家」在這個祝辭中與新婚家庭相關。',
    '「宜室宜家」用來祝賀婚姻與家庭和諧；「駕鶴西歸」用於死亡，「弄璋之喜」賀生子，都與此處婚禮場合不符。',
    '「宜室宜家」是婚嫁賀辭。'),
  makeQuestion('inscription-birthday', 'yikun', '題辭辨析',
    '華妃壽宴的賀禮題辭，哪一項符合祝壽場合？',
    ['壽比南山', '懿範長存', '之子于歸'], 'a',
    '用語要直接對應長壽，而非哀輓或婚嫁。',
    '「壽比南山」祝人長壽；「懿範長存」用於哀悼，「之子于歸」與女子出嫁相關。祝辭須配合實際用途。',
    '壽宴可用「壽比南山」，不可混入哀輓題辭。'),

  makeQuestion('couplet-equal-length', 'yanxi', '對聯格律',
    '安陵容整理楹聯。只檢查「上下聯字數相等」這一項，哪組符合？（標點不計）',
    ['春風入院／明月照', '春風入院／明月照窗', '春風／明月照窗'], 'b',
    '先逐字數一數；本題不要求檢查整套平仄格律。',
    '「春風入院」「明月照窗」各四字，字數相等；其他選項分別為四對三、二對四。本題通過字數檢查，不等於已驗收全部對聯規則。',
    '上下聯字數通常須相等；單一條件通過不等於全聯合格。'),
  makeQuestion('couplet-ending-tones', 'yanxi', '對聯格律',
    '安陵容已查好古典聲韻：甲聯末字為仄聲，乙聯末字為平聲。按一般正格「上仄下平」，順序應為？',
    ['甲上聯、乙下聯', '乙上聯、甲下聯', '末字聲調與順序完全無關'], 'a',
    '本題已提供平仄，不需要用現代國語一二三四聲猜。',
    '按題目採用的一般正格，上聯仄聲收尾、下聯平聲收尾，故甲上乙下。古典平仄不能直接一律以現代國語聲調替換。',
    '一般正格對聯上聯仄收、下聯平收；古音需另查。', sources.couplet),
  makeQuestion('couplet-parts-of-speech', 'yanxi', '對聯格律',
    '安陵容要依名詞對名詞的原則，替上聯位置中的「明月」選相對詞語。只看詞性與結構，何者最接近？',
    ['緩緩地', '閱讀', '清風'], 'c',
    '「明月」是修飾語加名詞所成的名詞性結構。',
    '「清風」與「明月」都是修飾語加名詞的名詞性結構；「緩緩地」是副詞性用法，「閱讀」在此為動作詞。本題只檢查指定位置的詞性與結構。',
    '對仗常要求相應位置詞性相合、結構相稱。'),
  makeQuestion('couplet-structure', 'yanxi', '對聯格律',
    '宮門上聯暫寫「花開迎客」。只檢查「名詞＋動詞＋動詞＋名詞」結構，哪一句相對最整齊？',
    ['悄悄的春風', '鳥語送春', '春天非常美麗'], 'b',
    '把「花／開／迎／客」逐一分解，再找相對位置。',
    '「鳥／語／送／春」與題目指定的結構相應，這裡「語」作鳴叫之動詞；其他選項結構不同。本題不宣稱這一組已符合完整聲律。',
    '檢查對仗時，可先逐一比對相對位置的詞性和結構。'),

  makeQuestion('idiom-rank', 'medicine', '字形與成語',
    '溫實初校對診療考核名冊。要表示成績居前，哪個寫法正確？',
    ['名列前矛', '名列前茅', '名列前毛'], 'b',
    '留意這個成語固定用字的草字頭。',
    '正確寫法是「名列前茅」，表示名次列在前面；「矛」「毛」都是形音相近造成的誤寫。',
    '表示名次居前，寫作「名列前茅」。'),
  makeQuestion('idiom-satisfactory', 'medicine', '字形與成語',
    '溫實初在紀錄上寫「此次整理差強人意」。依這個成語的現代常見義，他的意思是？',
    ['勉強還能令人滿意', '差得完全不能接受', '每一處都完美無缺'], 'a',
    '不要只看到「差」就判斷是極差，也不是毫無缺點。',
    '「差強人意」現代常見義是大體上尚能令人勉強滿意；既非完全不能接受，也非完美無缺。',
    '「差強人意」常指大體上尚能令人勉強滿意。', sources.idiom),
  makeQuestion('idiom-first-hit', 'medicine', '字形與成語',
    '溫實初說：「暴雨襲來，低窪藥房首當其衝。」這裡「首當其衝」的意思是？',
    ['第一個受到表揚', '率先完成工作', '首先遭到災害衝擊'], 'c',
    '要看這個成語是否包含受攻擊、遇災害的意思。',
    '「首當其衝」指首先受到攻擊或遭遇災難；不能把它當作一般的「第一個做某事」。',
    '「首當其衝」指首先受到攻擊或災難。', sources.danger),
  makeQuestion('idiom-many-books', 'medicine', '字形與成語',
    '藥房旁的書庫藏書極多。哪一句最適合使用「汗牛充棟」？',
    ['院中侍從汗牛充棟，人聲鼎沸。', '醫書汗牛充棟，需要分類整理。', '藥材汗牛充棟，香氣濃郁。'], 'b',
    '這個成語的使用對象是大量書籍。',
    '「汗牛充棟」形容書籍極多，適用於醫書；不能不加區別地形容人多或藥材多。',
    '「汗牛充棟」形容書籍極多。', sources.manyBooks),

  makeQuestion('letter-parents', 'jingren', '書信稱謂',
    '皇后要妳替遊學的子女寫信給父母。依傳統書信格式，稱謂後的提稱語以何者最相合？',
    ['膝下', '函丈', '同窗'], 'a',
    '辨認收信人是父母，並區分提稱語與一般稱呼。',
    '「膝下」是子女對父母、祖父母的傳統書信提稱語；「函丈」用於師長，「同窗」是同學的稱呼。',
    '傳統書信對父母或祖父母，可用提稱語「膝下」。', sources.parents),
  makeQuestion('letter-teacher', 'jingren', '書信稱謂',
    '妳寫信向授業老師請益。以下哪個傳統提稱語與受信人的師長身分最相合？',
    ['膝下', '硯右', '函丈'], 'c',
    '「函丈」與授業師長有關，並非只看字面是否恭敬。',
    '「函丈」可作對師長的提稱語；「膝下」用於父母或祖父母，「硯右」常用於同學，與此處授業師長的關係不合。',
    '對授業師長的傳統提稱語可用「函丈」。', sources.letter),
  makeQuestion('letter-envelope', 'jingren', '書信稱謂',
    '依本課採用的傳統書信規範，寫給一般長輩的信封，哪組啟封詞最合宜？',
    ['某某長輩 敬啟', '某某長輩 鈞啟', '某某長輩 敬上'], 'b',
    '區分請受信人開信的啟封詞，與寄信人的署名敬辭。',
    '此處用「鈞啟」尊請長輩開信；「敬啟」「敬上」用於寄信人自表恭敬的語境，不宜照搬成信封啟封詞。這是傳統格式用法，不把誤用描述為刑責或道德罪過。',
    '傳統格式中，給一般長輩的信封啟封詞可用「鈞啟」。', sources.letter),
  makeQuestion('letter-self-signature', 'jingren', '書信稱謂',
    '學子寫給授業老師的信末要署名。哪一項能清楚表示自己與老師的關係？',
    ['學生 某某 敬上', '令師 某某 敬上', '家師 某某 敬上'], 'a',
    '署名是在說「寫信的自己是誰」，不是稱呼收信人。',
    '學子以「學生」自稱，與老師的關係清楚；「令師」指對方老師，「家師」指自己的老師，都不是學子的自署身分。',
    '署名的自稱應符合寫信人與收信人的關係。', sources.letter),

  makeQuestion('age-coming-of-age', 'cining', '年齡與干支',
    '太后查看古籍中的成年禮記錄。按傳統語文常識，「女子及笄」通常指幾歲？',
    ['十三歲', '十五歲', '二十歲'], 'b',
    '把「及笄」與「豆蔻」分開記憶；題目考古代用語。',
    '傳統上以女子十五歲加笄表示成年，故「及笄」通常指十五歲；這不是現代法律對成年年齡的規定。',
    '古代年齡用語「及笄」通常指女子十五歲。', sources.hairpin),
  makeQuestion('age-standing', 'cining', '年齡與干支',
    '壽宴名冊有人寫「年屆而立」。太后問：依《論語》衍生的年齡代稱，這通常表示幾歲？',
    ['二十歲', '四十歲', '三十歲'], 'c',
    '回想「三十而立，四十而不惑」。',
    '「而立」通常代稱三十歲，「不惑」代稱四十歲；不可只按「能獨立」的字面意思推算個人的成年歲數。',
    '年齡代稱「而立」通常指三十歲。'),
  makeQuestion('time-midnight', 'cining', '年齡與干支',
    '太后要將「子時值夜」換成現代時間。依一般時辰對照，子時約是哪一段？',
    ['晚上十一時至翌日凌晨一時', '上午十一時至下午一時', '清晨五時至七時'], 'a',
    '「子」與夜半相關；一個時辰約相當於兩小時。',
    '一般對照中，子時為晚上二十三時至翌日一時；上午十一時至下午一時為午時，清晨五時至七時為卯時。',
    '子時一般對照晚上 23:00 至翌日 01:00。', sources.hour),
  makeQuestion('cycle-sexagenary', 'cining', '年齡與干支',
    '太后指著甲子、乙丑等紀年：「十天干與十二地支依序配合，要多久才完整重複一輪？」',
    ['十二年', '六十年', '一百二十年'], 'b',
    '不是把十與十二直接相乘；找兩個循環同時回到起點的最小週期。',
    '天干十個、地支十二個依序同時循環，最小共同週期為六十，稱六十甲子；十二年只回到相同地支，天干未必相同。',
    '干支紀年以六十年為一個完整循環。', sources.cycle),

  makeQuestion('history-chronological', 'prison', '文體與史書',
    '慎刑司的舊檔案借《資治通鑑》的方式，按年月先後記錄事件。這種史書體裁稱為？',
    ['紀傳體', '國別體', '編年體'], 'c',
    '題目強調按年代先後安排，而不是以人物或國家分篇。',
    '編年體按年代先後記事，《資治通鑑》屬此類；紀傳體以人物傳記等為組織主軸，國別體按國家分述。',
    '《資治通鑑》是編年體史書。', sources.annals),
  makeQuestion('history-biographical', 'prison', '文體與史書',
    '妳從《史記》的本紀、世家、列傳等安排中辨認它的體例。它通常被歸為哪一種史書？',
    ['紀傳體', '編年體', '純粹的詩歌總集'], 'a',
    '留意這部書以人物傳記等組織史事的特色。',
    '《史記》是紀傳體通史，具有本紀、表、書、世家、列傳等體例；不能因書中記事涉及年代，就直接歸為編年體。',
    '《史記》是紀傳體通史。'),
  makeQuestion('poetry-five-regulated', 'prison', '文體與史書',
    '牆上抄著一首完整的五言律詩。按一般定型格式，它應有幾句、每句幾字？',
    ['四句，每句五字', '八句，每句五字', '八句，每句七字'], 'b',
    '「五言」說每句字數；「律詩」與四句的絕句不同。',
    '一般五言律詩為八句、每句五字；四句五字是五言絕句，八句七字是七言律詩。此處不把十句以上的排律混入。',
    '一般五言律詩八句，每句五字。', sources.poem),
  makeQuestion('literature-periods', 'prison', '文體與史書',
    '舊稿要介紹不同朝代代表性文學風尚。哪一組先後順序正確？（不表示其他文體從此消失）',
    ['宋詞 → 唐詩 → 元曲', '元曲 → 宋詞 → 唐詩', '唐詩 → 宋詞 → 元曲'], 'c',
    '先判斷唐、宋、元三個朝代的時間順序。',
    '唐、宋、元依序在前後，常以唐詩、宋詞、元曲說明代表性文學成就。這是教學概括，不表示詩只在唐、詞只在宋、曲只在元出現。',
    '代表性文學風尚可依序記作唐詩、宋詞、元曲，但各文體有延續。'),

  makeQuestion('logic-false-dilemma', 'final', '語言邏輯',
    '皇帝說：「妳若不贊成我這項藏書方案，就一定是反對所有人讀書。」哪個回應最能指出問題？',
    ['不同意一個方案，仍可能支持讀書，還有修改方案等選擇。', '皇帝身分尊貴，所以推論必定正確。', '只要把語氣放輕，推論就會自動成立。'], 'a',
    '檢查「贊成這項方案」與「支持讀書」是否真是只有兩種互斥選擇。',
    '原話把「贊成特定方案」與「反對所有讀書」硬分成僅有的兩端，忽略支持目標但建議其他方法的可能，是假兩難；權位與語氣不能補足推論。',
    '假兩難把其實有其他可能的情況，說成只有兩種選擇。'),
  makeQuestion('logic-causal-leap', 'final', '語言邏輯',
    '皇帝說：「昨夜換了新宮燈，今晨藏書受潮，可見一定是新宮燈造成受潮。」哪個反駁最有根據？',
    ['先發生的事情，必然是後來事情的唯一原因。', '兩件事先後發生，還不足以證明因果，應查漏雨、濕度等證據。', '只要多說幾次，原因就能確定。'], 'b',
    '把「在這之後」與「因為這件事」分開。',
    '時間先後不等於因果成立，仍需查驗漏雨、濕度等其他可能因素。這裡缺乏證據便斷言新宮燈是原因，是草率建立因果關係。',
    '先後發生不等於因果已被證明；因果判斷需要證據。'),
  makeQuestion('logic-equivocation', 'final', '語言邏輯',
    '皇帝說：「人人都應守信。妳手裡拿的是一封信，所以妳應守著這封信整夜不睡。」哪個回應指出了關鍵？',
    ['同一個字的不同意思，可以不加區別地互相替換。', '只要兩句都含「信」，結論就必然成立。', '前句的「信」是信用，後句的「信」是書信，推論偷換了詞義。'], 'c',
    '分別解釋「守信」的信與「一封信」的信。',
    '「守信」指遵守承諾、重信用，「一封信」指書信。將同形字的不同詞義當成同一概念推論，構成詞義偷換；不是有效的理由。',
    '論證中的關鍵詞必須保持相同意義，不能偷換詞義。'),
);

// 原型六題補上來源及審核標記；穩定 ID 與答案 ID 保留，題幹可於下方升級為應用題。
for (const [id, source] of [
  ['courtesy-father', sources.father], ['courtesy-home', sources.home],
  ['character-blade', sources.indicative], ['character-river', sources.phono],
  ['books-shiji', sources.books], ['books-zhuangzi', sources.books],
]) {
  Object.assign(questions.find(q => q.id === id), {
    sourceTitle: source[0], sourceUrl: source[1], reviewStatus: 'draft-teacher-review',
  });
}

// 探索解謎用的中等難度版本：須合併身分、用途或規則判斷，不以稀僻字提高難度。
const refinements = {
  'courtesy-father': {
    prompt: '名冊寫著「令尊靠教書維生，家母善於織布」，兩處都是妳向別人介紹自己的雙親。康祿海說其中一個稱呼用錯了。「令尊」應改為哪個稱呼？',
    choices: [{ id: 'a', text: '家父：因為在介紹自己的父親' }, { id: 'b', text: '令尊：介紹自己父親仍可照用' }, { id: 'c', text: '尊翁：只要語氣尊敬就適用於自己父親' }],
  },
  'courtesy-home': {
    prompt: '妳要邀學士到自己家中，草稿卻寫「敬請光臨貴府」。書札旁註提醒「自己的居所用謙詞」。哪一修補符合寫信人的身分與目的？',
    choices: [{ id: 'a', text: '保留「敬請光臨貴府」，因為客人身分尊貴' }, { id: 'b', text: '改成「敬請光臨寒舍」，謙稱自己的居所' }, { id: 'c', text: '改成「敬請光臨尊府」，避免使用謙詞' }],
  },
  'courtesy-mother': {
    prompt: '書札的收信人是學士，內文要問候「學士的母親」，不是自己的母親或妹妹。請挑出稱呼對象與敬謙關係都正確的修補句。',
    choices: [{ id: 'a', text: '家母近日安好嗎？——用來問對方母親' }, { id: 'b', text: '令堂近日安好嗎？——尊稱對方母親' }, { id: 'c', text: '舍妹近日安好嗎？——尊稱對方母親' }],
  },
  'courtesy-advice': {
    prompt: '待修書札原寫「請指教你的拙作」，但妳真正要做的是把自己的文章交給學士，請他指出不足。哪個版本同時修正作品歸屬與請益語氣？',
  },
  'character-blade': {
    prompt: '玉冊有「刀」「刃」兩張字牌。「刃」是在刀鋒位置加記號，另一張提示又說它沒有用聲符提示讀音。應把「刃」放到哪一分類？',
    choices: [{ id: 'a', text: '象形：只要字中看得到刀形就一律算象形' }, { id: 'b', text: '形聲：凡是多加一筆就算聲符' }, { id: 'c', text: '指事：新增的記號是在指出刀口位置' }],
  },
  'character-river': {
    prompt: '字牌「江」旁有兩份線索：左邊的水指出義類，右邊的工提示造字時的聲音；現代兩字的讀音卻不完全相同。哪個歸類理由正確？',
    choices: [{ id: 'a', text: '會意：工一定表示工人在河邊工作' }, { id: 'b', text: '形聲：以水取義、以工表聲，聲符不保證與現代讀音完全相同' }, { id: 'c', text: '指事：現代讀音不同就不能算形聲' }],
  },
  'character-sun': {
    prompt: '禮官要妳為「日」選分類籤。線索一是古字像太陽輪廓；線索二是它沒有另一個部件專門提示讀音。哪張分類籤的理由最完整？',
    choices: [{ id: 'a', text: '象形：古字依太陽的外形描畫' }, { id: 'b', text: '形聲：字中每一筆都可當成聲符' }, { id: 'c', text: '假借：只要字形古老，就是借別字來用' }],
  },
  'character-rest': {
    prompt: '兩張字牌都由構件組成：「江」是一部分表義、一部分表聲；「休」依傳統解釋是人倚樹休息。要把「休」從「江」所在的分類移出，哪個理由正確？',
    choices: [{ id: 'a', text: '指事：兩個構件都只是位置記號' }, { id: 'b', text: '會意：人與木在這個解釋中合起來表達休息之意' }, { id: 'c', text: '形聲：凡是有兩個構件就一定和江同類' }],
  },
  'books-shiji': {
    prompt: '歸架單把《史記》放在「集部」，理由是它文筆生動；另一張書介卻說它以人物傳記等體例記載歷史。依四部分類，應改放哪一架？',
    choices: [{ id: 'a', text: '史部：按史書性質歸類，不能只看文采' }, { id: 'b', text: '子部：只要談人的行為就屬諸子著作' }, { id: 'c', text: '集部：凡是文筆優美的書都放在此處' }],
  },
  'books-zhuangzi': {
    prompt: '《莊子》的歸架卡上有兩條資訊：「先秦道家著作」「寓言精采」。有人只依第二條就把它放進集部。應如何更正？',
    choices: [{ id: 'a', text: '移至經部，因為只要古老就是儒家經典' }, { id: 'b', text: '留在集部，分類只看文筆好壞' }, { id: 'c', text: '移至子部，依其道家著作性質分類' }],
  },
  'books-analects': {
    prompt: '書架的規則是「儒家經典歸經部，諸子著作歸子部」。《論語》的書介寫著「儒家經典」，整理員卻因它談思想而放到子部。哪個修正合理？',
    choices: [{ id: 'a', text: '移到史部，凡有古人言行都是史書' }, { id: 'b', text: '移到集部，凡有語句都是詩文集' }, { id: 'c', text: '移到經部，依儒家經典的性質分類' }],
  },
  'books-poetry-collection': {
    prompt: '妳要替《陶淵明集》補上歸架籤。線索說「一位作者的詩文匯編」，旁邊的錯誤籤卻寫「作者是古人，所以歸史部」。哪個修補正確？',
    choices: [{ id: 'a', text: '集部：這是個人的詩文別集' }, { id: 'b', text: '史部：凡是古人的書都屬史部' }, { id: 'c', text: '子部：凡非儒家經典都屬子部' }],
  },
  'festival-dragon-boat': {
    prompt: '兩張活動卡被混放：「賞月、桂花」與「艾草、菖蒲、龍舟」。宮宴已確定要包粽子，請把與它相合的一組活動及節名配回去。',
    choices: [{ id: 'a', text: '中秋：賞月、桂花' }, { id: 'b', text: '端午：艾草、菖蒲、龍舟' }, { id: 'c', text: '重陽：賞月、桂花' }],
  },
  'festival-double-ninth': {
    prompt: '園中一首思親詩被誤貼「中秋」標籤，正文卻有「遍插茱萸少一人」，活動簿也記著登高。應如何更正節名，理由才充分？',
    choices: [{ id: 'a', text: '元宵：所有思親詩都只寫元宵' }, { id: 'b', text: '七夕：只要詩中少一人就是七夕' }, { id: 'c', text: '重陽：茱萸與登高共同指向重陽節俗' }],
  },
  'festival-lantern': {
    prompt: '節慶卷軸有三個空位。妳找到的活動記錄寫著「農曆正月十五、夜間花燈、燈謎」，哪個節名能同時符合日期與活動？',
    choices: [{ id: 'a', text: '元宵節：正月十五，與花燈活動相合' }, { id: 'b', text: '清明節：凡是春季活動都可歸清明' }, { id: 'c', text: '中秋節：只要是十五日就是中秋' }],
  },
  'season-lotus': {
    prompt: '四季卷軸的詩卡被打亂。詩卡寫「接天蓮葉無窮碧，映日荷花別樣紅」，另一線索註明「西湖六月」。應放進哪個季節區？',
    choices: [{ id: 'a', text: '冬季：只要寫水面就表示結冰' }, { id: 'b', text: '夏季：六月與盛放荷花兩項線索相合' }, { id: 'c', text: '深秋：紅色花瓣只能表示秋天' }],
  },
  'rhetoric-personification': {
    prompt: '修辭稿要區分「把物寫成人」與「拿相似事物作比較」。句子「海棠垂下頭，悄悄聽我們說話」沒有用人與海棠比較，而讓花能聆聽。應貼哪張主要修辭籤？',
    choices: [{ id: 'a', text: '設問：因為花沒有回答問題' }, { id: 'b', text: '擬人：讓非人的海棠有人的聆聽能力' }, { id: 'c', text: '引用：因為說話一定是在引用古人' }],
  },
  'rhetoric-hyperbole': {
    prompt: '漏刻記錄只過一刻鐘，浣碧卻說「我等了一百年」。修辭記錄要依她明知不實、故意加重感受的表達判讀，何者合理？',
    choices: [{ id: 'a', text: '誇飾：把等待時間故意放大' }, { id: 'b', text: '借代：用一百年作某個人的姓名' }, { id: 'c', text: '倒裝：句子中的主詞移到了句末' }],
  },
  'rhetoric-metonymy': {
    prompt: '槿汐給出兩條線索：「杜康是傳說中的造酒者」「詩句以杜康指酒，並非說酒長得像人」。替「何以解憂？唯有杜康」選修辭分類時，哪個理由正確？',
    choices: [{ id: 'a', text: '排比：只要連寫兩句就是排比' }, { id: 'b', text: '譬喻：因為酒與杜康外形完全相似' }, { id: 'c', text: '借代：用與酒有關聯的人名代指酒' }],
  },
  'rhetoric-pun': {
    prompt: '詩卡寫「道是無晴卻有晴」，旁註把末字連向「情」，使天氣與情意同時成立。妳要把這項語音線索與修辭效果連起來，何者合理？',
    choices: [{ id: 'a', text: '層遞：句中程度一定逐層升高' }, { id: 'b', text: '諧音雙關：晴與情同音，使語句兼含兩意' }, { id: 'c', text: '頂真：前句末詞接成後句開頭' }],
  },
  'inscription-daughter': {
    prompt: '禮物簿確認是「賀生女」，可用題辭卡卻混有出生與祝壽用途。哪張卡同時符合事件與傳統用語？',
    choices: [{ id: 'a', text: '弄瓦之喜——傳統賀生女' }, { id: 'b', text: '弄璋之喜——只要是新生兒一律適用' }, { id: 'c', text: '壽比南山——用來區分新生兒性別' }],
  },
  'inscription-son': {
    prompt: '頌芝要把三張題辭卡分送到「賀生子、祝壽、哀悼」三份禮物。哪張應送到已確認生男的家庭？',
    choices: [{ id: 'a', text: '福如東海——因為它專指生男' }, { id: 'b', text: '弄璋之喜——依傳統用語賀生男' }, { id: 'c', text: '懿範長存——因為它是所有喜事的通用語' }],
  },
  'inscription-wedding': {
    prompt: '禮物簿記著「兩位新人完婚，盼家庭和睦」，但匾額旁混入哀輓與生子題辭。應選哪張才能符合事件與祝賀目標？',
    choices: [{ id: 'a', text: '駕鶴西歸——婚嫁通用語' }, { id: 'b', text: '弄璋之喜——家庭和睦的專用語' }, { id: 'c', text: '宜室宜家——祝賀婚姻與家庭和諧' }],
  },
  'inscription-birthday': {
    prompt: '壽宴禮簿列明「長輩健在，今日賀壽」。三張匾額卡中，哪張用途與對象狀態都相符？',
    choices: [{ id: 'a', text: '壽比南山——祝人長壽' }, { id: 'b', text: '懿範長存——與健在長輩祝壽相同' }, { id: 'c', text: '之子于歸——凡長輩喜事都通用' }],
  },
  'couplet-equal-length': {
    prompt: '安陵容要先修復字數，再交給禮官另查聲律。只以「上下各四字」為此次驗收條件，哪組應留下？（標點不計）',
  },
  'couplet-ending-tones': {
    prompt: '兩條聯紙標籤掉落。查音卡已確認甲聯末字為仄、乙聯末字為平；門邊規則採一般正格「上仄下平」。應如何還原？',
  },
  'couplet-parts-of-speech': {
    prompt: '對仗檢查表要求「相應位置詞性與結構相稱」。上聯的「明月」是修飾語加名詞，若只修補這個位置，哪個詞最相合？',
  },
  'couplet-structure': {
    prompt: '妳在聯紙下找到「花／開／迎／客」四格分析，規則指定依「名詞＋動詞＋動詞＋名詞」配對。只檢查這個結構，哪張下聯卡最相稱？',
  },
  'idiom-rank': {
    prompt: '考核名冊寫「醫術名列前矛」，旁邊另有「名次列在前面」的詞義籤。溫實初要妳保留原意，只修正誤字，哪個版本正確？',
    choices: [{ id: 'a', text: '名列前矛：因為矛是兵器，所以代表成績好' }, { id: 'b', text: '名列前茅：使用成語的固定用字' }, { id: 'c', text: '名列前毛：只要同音就可以替換' }],
  },
  'idiom-satisfactory': {
    prompt: '醫案旁兩張評語卡互相矛盾：正文寫「整理結果差強人意」，抄手卻註「完全不能接受」。依成語的現代常見義，應如何修正註解？',
    choices: [{ id: 'a', text: '改成「大體上尚能令人勉強滿意」，與正文相合' }, { id: 'b', text: '維持「完全不能接受」，因為看到差字就是極差' }, { id: 'c', text: '改成「每一處都完美」，因為凡能滿意就是完美' }],
  },
  'idiom-first-hit': {
    prompt: '醫案原寫「暴雨襲來，低窪藥房首當其衝」，抄手把它改解為「藥房第一個修復完工」。比對災情情境後，哪個詞義才對？',
    choices: [{ id: 'a', text: '第一個受到表揚' }, { id: 'b', text: '率先完成工作' }, { id: 'c', text: '首先遭到災害衝擊' }],
  },
  'idiom-many-books': {
    prompt: '校勘規則提醒「汗牛充棟有特定的使用對象，不是任何東西多都可用」。請從藥房記錄挑出不必修改的一句。',
  },
  'letter-parents': {
    prompt: '信箋稱謂寫「父母親大人」，署名寫「女兒某某」。提稱語卡卻混入師長與同學用語，哪張能與雙方關係配合？',
    choices: [{ id: 'a', text: '膝下——子女對父母或祖父母' }, { id: 'b', text: '函丈——直接套用師長提稱語' }, { id: 'c', text: '同窗——把親子關係改成同學關係' }],
  },
  'letter-teacher': {
    prompt: '信箋內文是請授業老師指導文章，信末自署「學生某某」。哪個傳統提稱語能與師生關係相合，而不誤用父母用語？',
    choices: [{ id: 'a', text: '膝下——使用親子書信的提稱語' }, { id: 'b', text: '硯右——使用同學書信的提稱語' }, { id: 'c', text: '函丈——用於授業師長' }],
  },
  'letter-envelope': {
    prompt: '信封要交給一般長輩，信箋末已有寄信人「某某敬上」。依本課採用的傳統格式，信封上請受信人開信的用語應選哪組？',
  },
  'letter-self-signature': {
    prompt: '妳正在組裝一封「學子向授業老師請益」的信。稱謂與內文已就位，哪個署名能保留師生關係，而不把自己誤寫成老師？',
  },
  'age-coming-of-age': {
    prompt: '古代禮簿分別記「甲女十三歲，乙女十五歲，丙男二十歲」。只按傳統「女子及笄」的常見年齡用語，應把哪個年齡卡移到及笄欄？',
    choices: [{ id: 'a', text: '十三歲：因為與豆蔻完全相同' }, { id: 'b', text: '十五歲：與女子加笄的傳統用語相合' }, { id: 'c', text: '二十歲：因為所有成年禮都同歲' }],
  },
  'age-standing': {
    prompt: '壽宴座次要由小到大排。名冊有「弱冠、而立、不惑」三張年齡卡，其中而立必須放在二十與四十之間。應配上哪張歲數卡？',
    choices: [{ id: 'a', text: '二十歲：與弱冠放在同一格' }, { id: 'b', text: '四十歲：與不惑放在同一格' }, { id: 'c', text: '三十歲：與而立的年齡代稱相合' }],
  },
  'time-midnight': {
    prompt: '值夜簿上的子時標籤脫落，另兩張時間卡分別屬午時與卯時。要還原夜半兩小時的輪值區間，哪張應配回子時？',
  },
  'cycle-sexagenary': {
    prompt: '紀年轉盤每年讓十天干、十二地支各前進一格。現在兩盤同在甲子，不能只看地支回到子，必須兩盤一起回到起點。最少再過幾年？',
  },
  'history-chronological': {
    prompt: '舊檔案每頁依年月先後記事，沒有以人物或國家分篇；旁邊的範例書是《資治通鑑》。這兩項線索應連到哪個體裁籤？',
    choices: [{ id: 'a', text: '紀傳體——以人物傳記為組織主軸' }, { id: 'b', text: '國別體——按不同國家分述' }, { id: 'c', text: '編年體——依年代先後記事' }],
  },
  'history-biographical': {
    prompt: '書架把《史記》與《資治通鑑》混放在同一「編年體」籤下。《史記》目錄卻列有本紀、世家、列傳等。應為它另配哪個體裁籤？',
    choices: [{ id: 'a', text: '紀傳體——人物傳記等是其組織特色' }, { id: 'b', text: '編年體——只要提到年代就必屬此類' }, { id: 'c', text: '詩歌總集——只要文筆生動就屬詩集' }],
  },
  'poetry-five-regulated': {
    prompt: '牆上詩稿有八個完整句格，每格五字，第三四句、第五六句並排成對仗聯。若先按一般定型句數與字數歸類，它最符合？',
    choices: [{ id: 'a', text: '五言絕句：四句，每句五字' }, { id: 'b', text: '五言律詩：八句，每句五字' }, { id: 'c', text: '七言律詩：八句，每句七字' }],
  },
  'literature-periods': {
    prompt: '文學卷軸三格由早至晚排列，朝代籤已排成唐、宋、元。要把代表性文學風尚卡配回去，哪一組既符合順序，也不誤稱其他文體從此消失？',
  },
};

for (const question of questions) {
  if (refinements[question.id]) Object.assign(question, refinements[question.id]);
  const additionalSources = {
    'idiom-rank': ['教育部《國語辭典簡編本》：名列前茅', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=4807'],
    'inscription-birthday': ['教育部《國語辭典簡編本》：壽比南山', 'https://dict.concised.moe.edu.tw/dictView.jsp?ID=34367'],
  };
  if (additionalSources[question.id]) {
    [question.sourceTitle, question.sourceUrl] = additionalSources[question.id];
  }
  question.difficulty = 'medium';
  question.skill = ['gate', 'garden', 'yikun', 'jingren', 'cining'].includes(question.chapterId) ? '應用' : '分析';
  question.reviewStatus = 'draft-teacher-review';
  question.sourceStatus = question.sourceUrl ? 'reference-linked' : 'teacher-review-needed';
}

// 探索資料是題目適配線索，不代表場景互動程式已實作。
const puzzleProfiles = {
  gate: ['letter-repair', '敬謙詞書札修補', ['稱呼需先確認是自己的親人，還是對方的親人。', '請益用語要分清作品歸屬、寄信人與收信人的關係。'], '比對書札身分、錯誤稱呼與修補卡，再提交修訂。'],
  hall: ['character-sort', '六書字牌分類', ['同樣有構件，不代表一定是形聲；應看構件功能。', '描畫外形、加指示符號、合義、表義加表聲，是不同的判讀線索。'], '查看古字形與構件功能，再將字牌移入分類欄。'],
  library: ['book-shelving', '經史子集歸架', ['分類依書籍性質，不只依作者年代或文筆優美。', '儒家經典、史書、諸子著作與詩文集，對應不同書架。'], '先讀書介卡與書架規則，再修正歸架位置。'],
  garden: ['season-order', '節令詩詞配對與排序', ['同樣是十五日，還需要確認農曆月份與活動。', '思親不是某個節日專有，需合併植物、日期及節俗線索。'], '把節慶與詩卡配到合適的日期或四季位置。'],
  pavilion: ['rhetoric-evidence', '修辭線索辨識', ['判讀修辭要指出語句中的實際作用，不能只憑華麗程度。', '物像人、故意誇大、關聯替代、同音兼義，是不同線索。'], '標出關鍵詞與作用，再把證據連到修辭籤。'],
  yikun: ['gift-matching', '題辭送禮配對', ['先確定事件是出生、婚嫁、壽誕或哀悼。', '傳統賀辭有特定適用場合，不能只看字面是否吉祥。'], '對照禮物簿，將題辭卡配到正確事件。'],
  yanxi: ['couplet-order', '上下聯排序與結構修補', ['本輪各題只驗收指定條件，不把單項合格當作全聯合格。', '平仄採題目給定的古典聲類，不直接把現代國語聲調一律代入。'], '先查字數和相對結構，再依已給的平仄還原上下聯。'],
  medicine: ['text-proofreading', '字形校勘與成語詞義核對', ['成語固定用字與適用對象都要核對。', '詞義不能只由單一字猜測；需與醫案的上下文一致。'], '對照原稿、詞義籤與抄手註解，再留下正確版本。'],
  jingren: ['letter-assembly', '書信組裝', ['稱謂、提稱語、啟封詞與署名敬辭位於不同位置。', '用語須符合寄信人、收信人的關係及信封／信箋用途。'], '按對象與位置組裝信封和信箋，避免把署名敬辭搬到啟封詞。'],
  cining: ['age-time-order', '年齡時辰排序與循環推算', ['年齡代稱屬古代語文習慣，不能當作現代法律成年規則。', '干支兩個轉盤要同時回原點；時辰要確認跨日與晝夜。'], '把歲數、代稱、時段配回位置，再核對干支循環。'],
  prison: ['literature-sort', '文體史書整理', ['史書分類看組織方式：依人、依年、依國各不同。', '詩體要合併句數與字數；代表性文學風尚不等於某文體只存於一朝。'], '查看目錄、句格與朝代線索，再整理體裁與文學卷軸。'],
  final: ['argument-chain', '論證謬誤證據鏈', ['支持目標不代表必須同意某一個特定方案。', '時間先後不能代替因果證據；同字不同義也不能任意替換。'], '把原話、缺漏前提與有效反駁連成證據鏈，再提出結論。'],
};
for (const question of questions) {
  const [mode, objective, evidence, interactionHint] = puzzleProfiles[question.chapterId];
  question.puzzle = { mode, objective, evidence: [...evidence, question.hint], interactionHint };
}

// 正式試煉互動資料：renderer 將操作結果映射回穩定 answerId，再由遊戲引擎判定。
const token = (id, text) => ({ id, text });
const field = (id, label) => ({ id, label });
function interactive(id, patch) {
  const q = questions.find(item => item.id === id);
  const { correct, wrong, ...content } = patch;
  let wrongIndex = 0;
  Object.assign(q, content, {
    choices: ['a', 'b', 'c'].map(choiceId => ({ id: choiceId, text: choiceId === q.answerId ? correct : wrong[wrongIndex++] })),
  });
  q.puzzle.evidence[2] = q.hint;
}

interactive('festival-dragon-boat', {
  prompt: '御花園的全年節慶卷軸被打亂。請依同一年由早到晚，排出元宵、清明、端午、重陽的先後。清明採常見國曆節氣時序，其餘為農曆節日。',
  interaction: { kind: 'sequence', instruction: '將四張節慶牌依一年先後排列，排好後提交。',
    tokens: [token('double', '重陽・登高賞菊'), token('dragon', '端午・艾草龍舟'), token('lantern', '元宵・花燈'), token('qingming', '清明・掃墓踏青')],
    solution: ['lantern', 'qingming', 'dragon', 'double'] },
  correct: '元宵 → 清明 → 端午 → 重陽',
  wrong: ['清明 → 元宵 → 端午 → 重陽', '元宵 → 端午 → 重陽 → 清明'],
  hint: '先辨認春季的兩個節日，再把端午與秋季重陽放回位置。',
  explanation: '元宵在農曆正月十五，清明一般在國曆四月初，端午在農曆五月初五，重陽在農曆九月初九，所以依序是元宵、清明、端午、重陽。清明不是固定農曆日期。',
  correction: '四節先後：元宵、清明、端午、重陽；清明依節氣判讀。',
});
interactive('festival-double-ninth', {
  prompt: '三張秋季節慶卡分別記錄乞巧、八月十五賞月、九月九日登高。請把對應的七夕、中秋、重陽依同一年先後排列。',
  interaction: { kind: 'sequence', instruction: '依節慶在同一年中的先後排列三張活動卡。',
    tokens: [token('double', '重陽・登高插茱萸'), token('qixi', '七夕・乞巧'), token('moon', '中秋・賞月')],
    solution: ['qixi', 'moon', 'double'] },
  correct: '七夕 → 中秋 → 重陽', wrong: ['中秋 → 七夕 → 重陽', '重陽 → 中秋 → 七夕'],
  hint: '依農曆七月、八月、九月的月份遞進判斷。',
  explanation: '七夕是農曆七月初七，中秋是八月十五，重陽是九月初九。思親不專屬於中秋，茱萸與登高則是辨認重陽的常見線索。',
  correction: '農曆節慶順序：七夕、中秋、重陽。',
});
interactive('festival-lantern', {
  prompt: '宮宴的跨年三張活動牌脫落了：舊年最後一天團聚、次年正月初一賀歲、次年正月十五觀燈。請還原這一段跨年的活動先後。',
  interaction: { kind: 'sequence', instruction: '從舊年年末排到次年正月，還原三張節慶牌。',
    tokens: [token('lantern', '元宵・正月十五觀燈'), token('eve', '除夕・舊年年末團聚'), token('newyear', '春節・正月初一賀歲')],
    solution: ['eve', 'newyear', 'lantern'] },
  correct: '舊年除夕 → 次年春節 → 次年元宵', wrong: ['次年元宵 → 舊年除夕 → 次年春節', '舊年除夕 → 次年元宵 → 次年春節'],
  hint: '先找年末，再比較正月初一與正月十五。',
  explanation: '題目指定從舊年跨入次年，所以先是舊年除夕，接次年正月初一的春節，再到正月十五的元宵；不能把不同年份的除夕混入同一年排序。',
  correction: '跨年順序須先釐清年份：舊年除夕、次年春節、次年元宵。',
});
interactive('season-lotus', {
  prompt: '四季詩箋要從春天開始排滿一輪。卡片分別標記春柳、夏荷、秋菊與冬梅，請依季節先後還原；本題採古典詩歌的典型意象。',
  interaction: { kind: 'sequence', instruction: '從春季開始，把四張物候牌排成一年的季節順序。',
    tokens: [token('autumn', '秋・菊花傲霜'), token('summer', '夏・映日荷花'), token('winter', '冬・寒梅映雪'), token('spring', '春・柳枝新綠')],
    solution: ['spring', 'summer', 'autumn', 'winter'] },
  correct: '春柳 → 夏荷 → 秋菊 → 冬梅', wrong: ['春柳 → 秋菊 → 夏荷 → 冬梅', '冬梅 → 夏荷 → 春柳 → 秋菊'],
  hint: '先依春夏秋冬定位置，再比對每張卡片的季節意象。',
  explanation: '由春季開始，一年季序是春、夏、秋、冬。春柳、夏荷、秋菊、冬梅是本題指定的典型詩歌意象，不表示各地植物實際花期完全相同。',
  correction: '典型四季意象可依春柳、夏荷、秋菊、冬梅排列。',
});

interactive('rhetoric-personification', {
  prompt: '槿汐要妳在短詩中圈出兩處「讓非人的事物具備人的行為或能力」的語句。請依實際文字標記擬人線索。',
  interaction: { kind: 'highlight', instruction: '圈出短詩中兩處明確的擬人語句。',
    segments: [token('wind', '晨風'), token('wake', '催我們起床'), token('flower', '，海棠'), token('listen', '悄悄聽我們說話'), token('end', '。')],
    targetIds: ['wake', 'listen'] },
  correct: '圈出「催我們起床」「悄悄聽我們說話」兩處擬人語句',
  wrong: ['只圈「晨風」「海棠」，事物名稱本身就等於擬人', '只圈標點，擬人不需要指出人的行為'],
  hint: '不只找出植物或風的名稱，要找它們被賦予了什麼人的能力。',
  explanation: '風被寫成會催人起床，海棠被寫成能聽人說話，兩處都賦予非人事物以人的行為或能力。僅有「晨風」「海棠」兩個名稱，還不能證明使用擬人。',
  correction: '擬人的證據在被賦予的人的行為或能力，而不只在事物名稱。',
});
interactive('rhetoric-hyperbole', {
  prompt: '漏刻證實只過一刻鐘，浣碧明知如此，仍故意把等待感受誇大。請圈出短句中超出實際時間的詞。',
  interaction: { kind: 'highlight', instruction: '圈出一處故意誇大等待時間的詞。',
    segments: [token('first', '我等了'), token('actual', '一刻鐘'), token('middle', '，卻覺得已經等了'), token('exaggeration', '一百年'), token('end', '。')],
    targetIds: ['exaggeration'] },
  correct: '圈出「一百年」：故意放大等待時間的誇飾',
  wrong: ['圈出「一刻鐘」：真實經過的時間就是誇飾', '圈出「我等了」：只要主詞是我就構成誇飾'],
  hint: '比較漏刻證明的時間，與說話者故意放大的時間。',
  explanation: '真實時間是一刻鐘，故意說成一百年來強化等待的漫長感，誇飾的關鍵詞是一百年。實際時間與主詞都不是此處誇大的證據。',
  correction: '找誇飾時，要指出故意超越實際程度的文字。',
});
interactive('rhetoric-metonymy', {
  prompt: '詩箋旁註說：席上沒有這位造酒者本人，只有杯中的酒。請圈出短句中以相關人名代指酒的一處詞語。',
  interaction: { kind: 'highlight', instruction: '圈出短句中以相關人名代指酒的詞。',
    segments: [token('start', '今晚不談'), token('documents', '公文'), token('pour', '，且斟一杯'), token('wine', '杜康'), token('end', '。')],
    targetIds: ['wine'] },
  correct: '圈出「杜康」：以與造酒有關的人名借代酒',
  wrong: ['圈出「公文」：它在此句必定代指酒', '圈出「一杯」：容器數量就是造酒者的人名'],
  hint: '先區分現場真正存在的酒，與句中使用的人名。',
  explanation: '「杜康」是傳說中的造酒者，此處不指本人而代指酒，是依關聯形成借代。公文是句中一般事物名稱，「一杯」也不是人名。',
  correction: '「杜康」借代酒，判讀依據是相關聯，而非外形相似。',
});
interactive('rhetoric-pun', {
  prompt: '劉禹錫詩句把天氣與情意交織，旁註提示「晴」與「情」同音。請圈出兩處兼含這兩層意思的詞組。',
  interaction: { kind: 'highlight', instruction: '圈出兩處透過同音而兼含情意的詞組。',
    segments: [token('sky', '東邊日出西邊雨，道是'), token('no-clear', '無晴'), token('turn', '卻'), token('clear', '有晴'), token('end', '。')],
    targetIds: ['no-clear', 'clear'] },
  correct: '圈出「無晴」「有晴」：兼帶「無情」「有情」的諧音雙關',
  wrong: ['只圈「東邊日出西邊雨」：位置詞本身即形成晴與情的諧音', '只圈「卻」：轉折詞本身同時表示晴天與情意'],
  hint: '找實際含有「晴」字的兩處詞組，而不是只找轉折詞。',
  explanation: '無晴、有晴藉「晴」「情」同音，兼帶無情、有情的意思。兩處詞組共同形成晴雨與情意交疊的雙關效果。',
  correction: '諧音雙關需要指出同音詞及其兼含的另一層意義。',
});

interactive('inscription-daughter', {
  prompt: '三份禮單分別是賀生女、賀生男與賀長輩壽誕。請依傳統用語把三張題辭各送到合宜場合，每張只用一次。',
  interaction: { kind: 'matching', instruction: '為每份禮單配上一張最合宜的傳統題辭。',
    pairs: [{ id: 'girl', left: '賀生女', right: '弄瓦之喜' }, { id: 'boy', left: '賀生男', right: '弄璋之喜' }, { id: 'birthday', left: '賀壽誕', right: '壽比南山' }] },
  correct: '生女配弄瓦之喜；生男配弄璋之喜；壽誕配壽比南山',
  wrong: ['生女配弄璋之喜；生男配弄瓦之喜；壽誕配壽比南山', '生女配壽比南山；生男配弄璋之喜；壽誕配弄瓦之喜'],
  hint: '先按出生與壽誕分組，再辨認兩種出生賀辭的傳統對象。',
  explanation: '傳統用語弄瓦賀生女、弄璋賀生男，壽比南山祝人長壽。這裡辨認歷史用語，不代表現代有性別價值差別。',
  correction: '傳統配對：生女弄瓦、生男弄璋、祝壽壽比南山。',
});
interactive('inscription-son', {
  prompt: '頌芝把賀生男、女子出嫁及祝壽三份禮物的題辭混在一起。請按禮物用途重新配對，不能只挑字面吉祥的詞。',
  interaction: { kind: 'matching', instruction: '依三份禮物的用途，配回對應題辭。',
    pairs: [{ id: 'boy', left: '賀生男', right: '弄璋之喜' }, { id: 'bride', left: '賀女子出嫁', right: '之子于歸' }, { id: 'birthday', left: '賀長輩壽誕', right: '壽比南山' }] },
  correct: '生男配弄璋之喜；女子出嫁配之子于歸；壽誕配壽比南山',
  wrong: ['生男配之子于歸；女子出嫁配弄璋之喜；壽誕配壽比南山', '生男配壽比南山；女子出嫁配之子于歸；壽誕配弄璋之喜'],
  hint: '先區分新生兒、出嫁新人與賀壽長輩三種對象。',
  explanation: '弄璋之喜是傳統賀生男用語，之子于歸與女子出嫁相關，壽比南山則用來祝長壽。三份禮物不能只依「都是喜事」互換題辭。',
  correction: '題辭要同時配合事件與祝賀對象。',
});
interactive('inscription-wedding', {
  prompt: '禮簿有「新人完婚，盼家庭和睦」「添女」「長輩壽誕」三條記錄。請完成題辭配對，每則題辭只能送出一次。',
  interaction: { kind: 'matching', instruction: '依事件與祝賀目標，將題辭配給三份禮物。',
    pairs: [{ id: 'wedding', left: '賀婚嫁、祝家庭和睦', right: '宜室宜家' }, { id: 'girl', left: '賀添女', right: '弄瓦之喜' }, { id: 'birthday', left: '賀壽誕', right: '壽比南山' }] },
  correct: '婚嫁配宜室宜家；添女配弄瓦之喜；壽誕配壽比南山',
  wrong: ['婚嫁配弄瓦之喜；添女配宜室宜家；壽誕配壽比南山', '婚嫁配宜室宜家；添女配壽比南山；壽誕配弄瓦之喜'],
  hint: '辨認家庭和睦的婚嫁祝辭，與出生、長壽的用語分開。',
  explanation: '宜室宜家祝婚姻與家庭和諧，弄瓦之喜傳統上賀生女，壽比南山祝長壽。要同時符合事件與祝賀目標。',
  correction: '婚嫁、出生與壽誕題辭不可混用。',
});
interactive('inscription-birthday', {
  prompt: '壽宴禮物旁又混入新婚與賀生男的題辭卡。請把「健在長輩賀壽、新婚、添男」三種場合完整配回去。',
  interaction: { kind: 'matching', instruction: '辨認三種喜事，為每份禮物配上合宜題辭。',
    pairs: [{ id: 'birthday', left: '健在長輩賀壽', right: '壽比南山' }, { id: 'wedding', left: '賀新婚', right: '宜室宜家' }, { id: 'boy', left: '賀添男', right: '弄璋之喜' }] },
  correct: '賀壽配壽比南山；新婚配宜室宜家；添男配弄璋之喜',
  wrong: ['賀壽配宜室宜家；新婚配壽比南山；添男配弄璋之喜', '賀壽配弄璋之喜；新婚配宜室宜家；添男配壽比南山'],
  hint: '先將長壽、婚姻與出生三種祝賀目標分開。',
  explanation: '壽比南山祝長壽，宜室宜家賀新婚，弄璋之喜傳統上賀生男。每張題辭有特定適用場合。',
  correction: '題辭判讀先看場合，再看語詞的傳統適用對象。',
});

interactive('couplet-equal-length', {
  prompt: '請用四張片段組成上下各七字的聯語。上聯由「春風送暖」起筆，下聯由「瑞氣迎祥」起筆；本題已查明秀為仄、新為平，採上仄下平，只驗收字數、指定起句及末字聲類。',
  interaction: { kind: 'couplet', instruction: '先組上聯、再組下聯；每聯由四字起句接三字結尾，並符合題目指定聲類。',
    tokens: [token('l-end', '萬戶新'), token('u-start', '春風送暖'), token('l-start', '瑞氣迎祥'), token('u-end', '千山秀')],
    solution: ['u-start', 'u-end', 'l-start', 'l-end'] },
  correct: '上聯：春風送暖千山秀；下聯：瑞氣迎祥萬戶新',
  wrong: ['上聯：春風送暖萬戶新；下聯：瑞氣迎祥千山秀', '上聯：千山秀春風送暖；下聯：萬戶新瑞氣迎祥'],
  hint: '先固定兩聯的起句，再用秀與新的已知平仄決定結尾。',
  explanation: '每聯需四字起句加三字結尾，共七字。指定春風起上聯、瑞氣起下聯，且秀仄收、新平收，因此順序唯一；本題沒有宣稱已檢查全部古典聲律。',
  correction: '聯語修補須同時滿足題目指定字數、起句與末字平仄。',
});
interactive('couplet-ending-tones', {
  prompt: '兩條完整聯紙擺反了。查音卡已確認「秀」為仄聲、「新」為平聲；依本題採用的一般正格，請排成上聯在前、下聯在後。',
  interaction: { kind: 'couplet', instruction: '依已給的末字平仄，排成「上聯 → 下聯」。',
    tokens: [token('lower', '福到人間萬戶新'), token('upper', '春回大地千山秀')], solution: ['upper', 'lower'] },
  correct: '上聯：春回大地千山秀；下聯：福到人間萬戶新',
  wrong: ['上聯：福到人間萬戶新；下聯：春回大地千山秀', '兩條都是上聯，不需要安排下聯'],
  hint: '本題提供了古典聲類，不用把現代國語四聲一律代入。',
  explanation: '本題採上聯仄收、下聯平收，故秀收尾的句子為上聯，新收尾為下聯。兩句各七字，這裡不混入實際門柱左右的擺法。',
  correction: '一般正格上仄下平；須依題目指定或查明的聲類判讀。',
});
interactive('couplet-parts-of-speech', {
  prompt: '請依詩意「明月穿簾驚醒宿鳥，清風入院送來花香」組聯。上聯起「明月」、下聯起「清風」；本題指定鳥仄、香平，只檢查語意配合、指定起句與末字聲類。',
  interaction: { kind: 'couplet', instruction: '依題目詩意還原片段，再按上聯、下聯的順序排列。',
    tokens: [token('l-end', '送花香'), token('l-start', '清風入院'), token('u-end', '驚宿鳥'), token('u-start', '明月穿簾')],
    solution: ['u-start', 'u-end', 'l-start', 'l-end'] },
  correct: '上聯：明月穿簾驚宿鳥；下聯：清風入院送花香',
  wrong: ['上聯：明月穿簾送花香；下聯：清風入院驚宿鳥', '上聯：驚宿鳥明月穿簾；下聯：送花香清風入院'],
  hint: '把題目指定的月與鳥、風與香先配起來，再查句尾。',
  explanation: '題意把明月與驚宿鳥相連，把清風與送花香相連；鳥仄收、香平收，配合指定起句可得唯一順序。本題僅檢查明列條件，不宣稱完整平仄逐字合律。',
  correction: '片段排列需同時保留原意、指定結構與本題聲類條件。',
});
interactive('couplet-structure', {
  prompt: '聯稿已指定上聯以「花開」起句、下聯以「鳥語」起句。請接上兩張結尾卡，讓兩句都是名詞、動詞、動詞、名詞結構；題目查音另明示客仄、春平。',
  interaction: { kind: 'couplet', instruction: '保留指定的上下聯起句，組成對稱結構，依上聯、下聯順序排列。',
    tokens: [token('l-end', '送春'), token('u-start', '花開'), token('l-start', '鳥語'), token('u-end', '迎客')],
    solution: ['u-start', 'u-end', 'l-start', 'l-end'] },
  correct: '上聯：花開迎客；下聯：鳥語送春',
  wrong: ['上聯：花開送春；下聯：鳥語迎客', '上聯：迎客花開；下聯：送春鳥語'],
  hint: '先固定花開、鳥語兩個起句，再以已知的句尾聲類檢查。',
  explanation: '花／開／迎／客與鳥／語／送／春，符合題目指定的名詞、動詞、動詞、名詞結構；再由客仄、春平確定結尾。只有結構相似還不足以取代其他指定條件。',
  correction: '對仗排列要兼顧指定起句、相應詞性與題目給定平仄。',
});

interactive('idiom-rank', {
  prompt: '先圈出考核脈案中唯一需要校正的用字，再選擇能保留「成績居前」原意的修補方式。',
  interaction: { kind: 'proofread', instruction: '圈出一處誤寫，再從修補方案中選擇正確版本。',
    segments: [token('start', '醫官考核記：此人讀書勤勉，'), token('typo', '名列前矛'), token('end', '，其餘記錄另附。')], targetId: 'typo' },
  correct: '把「名列前矛」改為「名列前茅」，保留成績居前的意思',
  wrong: ['保留「名列前矛」，只要同音就可替換固定用字', '改為「名列前毛」，以常見字替代成語用字'],
  hint: '要核對整個成語的固定寫法，不能只依同音字猜。',
  explanation: '應圈出名列前矛，將矛改為茅。正確成語名列前茅表示名次居前；矛與毛都不能因音近而任意替換。',
  correction: '成績居前的固定寫法是「名列前茅」。',
});
interactive('idiom-satisfactory', {
  prompt: '原評語是「差強人意」，抄手卻在脈案裡另加錯誤註解。請圈出那一處註解，再選符合成語現代常見義的修補。',
  interaction: { kind: 'proofread', instruction: '圈出抄手誤解的詞義註解，再選正確修補。',
    segments: [token('start', '整理評語：差強人意。抄手註：意思是'), token('gloss', '完全不能接受'), token('end', '。')], targetId: 'gloss' },
  correct: '把「完全不能接受」改為「大體上尚能令人勉強滿意」',
  wrong: ['保留「完全不能接受」，因為「差」一定代表極差', '把註解改為「所有細節都完美無缺」'],
  hint: '不要把差強人意理解成極差，也不要把尚可滿意理解成完美。',
  explanation: '錯誤在抄手的完全不能接受。差強人意的現代常見義是大體上尚能令人勉強滿意，並非全盤否定，也不是毫無缺點。',
  correction: '「差強人意」的現代常見義是大體上尚能勉強滿意。',
});
interactive('idiom-first-hit', {
  prompt: '這份脈案要表達「文書整理比各房早完工」，並沒有攻擊或災害。先圈出不合語境的成語，再選修補方式。',
  interaction: { kind: 'proofread', instruction: '圈出一處與工作進度語境不合的成語，再選正確修補。',
    segments: [token('start', '本房本月文書整理'), token('misuse', '首當其衝'), token('end', '，比各房都早完工，且未遇任何災損。')], targetId: 'misuse' },
  correct: '把「首當其衝」改為「率先完成」，符合一般工作領先完工的語境',
  wrong: ['不必修改，首當其衝適用於所有一般的第一名', '改成「汗牛充棟」，用來表示工作完成得快'],
  hint: '先檢查句子有沒有受攻擊或遇災害，再判斷成語是否適用。',
  explanation: '首當其衝指首先受到攻擊或遭遇災難，不能泛指一般工作領先；這裡應改為率先完成。汗牛充棟形容書籍極多，與完工速度無關。',
  correction: '「首當其衝」不等於一般的率先做完。',
});
interactive('idiom-many-books', {
  prompt: '庫存脈案把形容大量書籍的成語用在藥材上。請圈出唯一誤用處，再選能保留「藥材很多」原意的修補。',
  interaction: { kind: 'proofread', instruction: '圈出一處成語適用對象錯誤的語句，再選正確修補。',
    segments: [token('start', '醫書另置書庫。庫存記載：'), token('misuse', '藥材汗牛充棟'), token('end', '，須分類保存。')], targetId: 'misuse' },
  correct: '把「藥材汗牛充棟」改為「藥材堆積如山」；汗牛充棟應形容書籍',
  wrong: ['保留原句，汗牛充棟可以形容任何東西多', '改成「藥材首當其衝」，用來表示庫存充足'],
  hint: '除了詞義，也要核對成語慣用的對象。',
  explanation: '汗牛充棟形容書籍極多，不能直接套用藥材。改為藥材堆積如山可保留數量很多的意思；首當其衝則涉及攻擊或災害。',
  correction: '成語使用須核對適用對象：「汗牛充棟」形容書籍極多。',
});

interactive('letter-parents', {
  prompt: '女兒要寫信向自己的父母請安。請按傳統課堂書信格式，組裝稱謂、提稱語與寫信人的署名；每張詞牌最多用一次。',
  interaction: { kind: 'form', instruction: '依親子關係，將詞牌放入三個書信欄位。',
    fields: [field('title', '信首：對父母的稱謂'), field('address', '稱謂後：提稱語'), field('signature', '信末：女兒署名')],
    tiles: [token('teacher', '函丈'), token('parents', '父母親大人'), token('daughter', '女兒某某敬上'), token('knees', '膝下'), token('peer', '台鑒')],
    solution: { title: 'parents', address: 'knees', signature: 'daughter' } },
  correct: '稱謂用父母親大人；提稱語用膝下；署名用女兒某某敬上',
  wrong: ['稱謂用父母親大人；提稱語用函丈；署名用女兒某某敬上', '稱謂用膝下；提稱語用台鑒；署名用父母親大人'],
  hint: '區分對父母的稱呼、提請父母察閱的用語，以及女兒的自署。',
  explanation: '父母親大人是稱謂，膝下是傳統親子書信提稱語，女兒某某敬上是寫信人的署名。函丈適用師長關係，不能直接搬來代替親子提稱語。',
  correction: '稱謂、提稱語與署名功能不同，須配合親子關係組裝。',
});
interactive('letter-teacher', {
  prompt: '學子要向王老師請益文章。請組裝信首稱謂、傳統提稱語與學生自署，不要混入親子書信用語。',
  interaction: { kind: 'form', instruction: '依師生關係，把詞牌放進三個合宜的書信欄位。',
    fields: [field('title', '信首：稱呼授業老師'), field('address', '稱謂後：師長提稱語'), field('signature', '信末：學生自署')],
    tiles: [token('knees', '膝下'), token('student', '學生某某敬上'), token('teacher', '王老師'), token('parents', '父母親大人'), token('mentor', '函丈')],
    solution: { title: 'teacher', address: 'mentor', signature: 'student' } },
  correct: '稱謂用王老師；提稱語用函丈；署名用學生某某敬上',
  wrong: ['稱謂用王老師；提稱語用膝下；署名用學生某某敬上', '稱謂用父母親大人；提稱語用函丈；署名用王老師'],
  hint: '先分清收信的老師與寄信的學生，再配合傳統師長提稱語。',
  explanation: '收信人是王老師，提稱語可用函丈，寫信人以學生自署。膝下用於父母或祖父母，不能只因老師也值得尊敬就直接混用。',
  correction: '師生書信可用老師稱謂、函丈提稱語及學生自署。',
});
interactive('letter-envelope', {
  prompt: '晚輩寄信給一般長輩，要分別完成「信封啟封詞」與「信末寄信人署名」。依本課採用的傳統格式，請把用語放在正確位置。',
  interaction: { kind: 'form', instruction: '分清信封與信箋功能，將兩張合宜詞牌放入欄位。',
    fields: [field('opening', '給一般長輩的信封：啟封詞'), field('signature', '信箋末尾：晚輩自署')],
    tiles: [token('respect-sign', '晚輩某某敬上'), token('respect-open', '鈞啟'), token('mentor', '函丈'), token('wrong-open', '敬啟'), token('parents', '膝下')],
    solution: { opening: 'respect-open', signature: 'respect-sign' } },
  correct: '長輩信封啟封詞用鈞啟；信末自署用晚輩某某敬上',
  wrong: ['長輩信封啟封詞用敬啟；信末自署用晚輩某某敬上', '長輩信封啟封詞用函丈；信末自署用膝下'],
  hint: '啟封詞是請收信人開信，署名敬辭則是寫信人自表敬意。',
  explanation: '依本課傳統格式，鈞啟可尊請一般長輩開信；晚輩某某敬上放在信末署名。敬啟不宜直接當作信封啟封詞，函丈與膝下則是不同對象的提稱語。',
  correction: '啟封詞與署名敬辭不可因都帶敬意就任意互換。',
});
interactive('letter-self-signature', {
  prompt: '一封給授業老師的請益信只剩三欄待組裝。妳是寫信的學生，收信人是王老師；請選能保持雙方身分的完整方案。',
  interaction: { kind: 'form', instruction: '依寄信人與收信人身分，組裝稱謂、提稱語與署名。',
    fields: [field('title', '收信人稱謂'), field('address', '稱謂後提稱語'), field('signature', '寄信人自署')],
    tiles: [token('own-teacher', '家師某某敬上'), token('mentor', '函丈'), token('teacher', '王老師'), token('other-teacher', '令師某某敬上'), token('student', '學生某某敬上')],
    solution: { title: 'teacher', address: 'mentor', signature: 'student' } },
  correct: '收信稱謂王老師；提稱語函丈；寄信自署學生某某敬上',
  wrong: ['收信稱謂王老師；提稱語函丈；寄信自署家師某某敬上', '收信稱謂函丈；提稱語王老師；寄信自署令師某某敬上'],
  hint: '家師是自己的老師、令師是對方的老師，兩者都不是學生自己的身分。',
  explanation: '王老師是受信人稱謂，函丈是師長提稱語，學生某某敬上才是寄信人的自署。家師與令師指老師，不能用作學生自稱。',
  correction: '署名必須表示寄信人的身分，不能把家師、令師當成學生自稱。',
});

interactive('age-coming-of-age', {
  prompt: '傳統禮簿以「女子及笄」標示一項古代年齡用語。請把標記移到對應歲數；本題不涉及現代法定成年規定。',
  interaction: { kind: 'timeline', instruction: '移動年齡標記，選定符合「及笄」的歲數刻度。',
    ticks: [token('age10', '10歲'), token('age13', '13歲'), token('age15', '15歲'), token('age20', '20歲'), token('age30', '30歲'), token('age40', '40歲'), token('age50', '50歲'), token('age60', '60歲')], solutionId: 'age15' },
  correct: '標記15歲：符合古代「及笄」的常見年齡用語',
  wrong: ['標記13歲：把及笄與豆蔻混為一談', '標記20歲：把不同古代成年禮的歲數全部混同'],
  hint: '及笄與女子加笄禮相關，要與豆蔻、弱冠分開。',
  explanation: '傳統語文常識中，女子十五歲加笄表示成年，所以及笄通常對應十五歲。這是古代用語，不是現代法定成年歲數。',
  correction: '及笄通常對應古代女子十五歲。',
});
interactive('age-standing', {
  prompt: '壽宴座次記錄有人「年屆而立」。請把標記放到年齡軸上的對應歲數，並與弱冠、不惑等稱呼區分。',
  interaction: { kind: 'timeline', instruction: '移動年齡標記，選定符合「而立」的歲數刻度。',
    ticks: [token('age10', '10歲'), token('age15', '15歲'), token('age20', '20歲'), token('age30', '30歲'), token('age40', '40歲'), token('age50', '50歲'), token('age60', '60歲'), token('age70', '70歲')], solutionId: 'age30' },
  correct: '標記30歲：與「而立」的年齡代稱相合',
  wrong: ['標記20歲：把而立誤當成弱冠', '標記40歲：把而立誤當成不惑'],
  hint: '回想三十而立、四十而不惑的先後。',
  explanation: '而立通常代稱三十歲；弱冠通常指男子二十歲，不惑通常指四十歲。要按慣用代稱判讀，而非猜某個人何時能獨立。',
  correction: '而立通常指三十歲，不惑通常指四十歲。',
});
interactive('time-midnight', {
  prompt: '值夜簿的「子時」標籤脫落。時間軸跨越夜晚到翌日晚間，請把標記移到子時的一般現代時段，並與午時、卯時區分。',
  interaction: { kind: 'timeline', instruction: '在十二個依序排列的時段中，標出子時所在的位置。',
    ticks: [token('zi', '23:00–翌日01:00'), token('chou', '01:00–03:00'), token('yin', '03:00–05:00'), token('mao', '05:00–07:00'), token('chen', '07:00–09:00'), token('si', '09:00–11:00'), token('wu', '11:00–13:00'), token('wei', '13:00–15:00'), token('shen', '15:00–17:00'), token('you', '17:00–19:00'), token('xu', '19:00–21:00'), token('hai', '21:00–23:00')], solutionId: 'zi' },
  correct: '標記23:00至翌日01:00：對應一般子時時段',
  wrong: ['標記11:00至13:00：把子時與午時混淆', '標記05:00至07:00：把子時與卯時混淆'],
  hint: '子時與夜半相關，一個傳統時辰約相當於兩個現代小時。',
  explanation: '一般時辰對照中，子時為晚上二十三時至翌日一時，午時為十一時至十三時，卯時為五時至七時。本題時間軸以子時為起點，不是以午夜零時切開。',
  correction: '子時一般對應23:00至翌日01:00，須留意跨日。',
});
interactive('cycle-sexagenary', {
  prompt: '十天干與十二地支每年各前進一格，目前同在甲子。請把標記移到「最少再過多少個正整數年，兩盤才一起回到原配對」的位置。0代表現在，不是再過的年數。',
  interaction: { kind: 'timeline', instruction: '在年數軸選定兩個循環同時首次回到起點的正整數年數。',
    ticks: [token('year0', '現在0年'), token('year12', '再過12年'), token('year24', '再過24年'), token('year36', '再過36年'), token('year48', '再過48年'), token('year60', '再過60年'), token('year72', '再過72年')], solutionId: 'year60' },
  correct: '標記再過60年：天干與地支第一次同時回到原配對',
  wrong: ['標記再過12年：只確認地支回原位，未核對天干', '標記再過24年：兩輪地支仍不能保證天干回原位'],
  hint: '找十與十二兩個循環同時回到起點的最小正整數週期。',
  explanation: '十與十二的最小公倍數是六十，因此最少再過六十年才同時回到甲子；十二、二十四年只讓地支回到原位，不能保證天干也相同。',
  correction: '干支完整循環為六十年，不能只計十二地支。',
});

// 2026-10-26 全題編輯審查：保留穩定 ID、答案 ID 與互動契約，降低閱讀障礙並改善誘答。
function reviewQuestion(id, prompt, options, explanation, changes, distractorPrinciple) {
  const q = questions.find(item => item.id === id);
  Object.assign(q, {
    prompt,
    choices: options.map((text, index) => ({ id: ['a', 'b', 'c'][index], text })),
    explanation,
    editorialReview: {
      date: '2026-10-26', changes, distractorPrinciple,
      audience: '國小高年級教師引導／國中學習',
      difficultyTarget: 'medium', studentCalibration: 'pending', teacherApproval: 'pending',
    },
  });
}

reviewQuestion('courtesy-father',
  '康祿海要核對入宮名冊。妳向學士介紹自己的雙親，稿上卻寫「令尊教書，家母織布」。請保留說話人的身分，修正父親的稱呼。',
  ['家父', '令尊', '尊翁'],
  '這裡談自己的父親，要用「家父」；「令尊」「尊翁」都是尊稱對方父親。不能只因敬重自己的父親，就把對別人的敬稱搬過來。',
  '補上核對名冊的任務；選項縮成同長度稱呼，避免正解靠附帶解釋露出。', '兩個誘答都是真實敬稱，檢查是否分清自己與對方。');
reviewQuestion('courtesy-home',
  '入宮前，妳要請學士到自己家中看文章。邀請札寫著「敬請光臨貴府」。請選一種修法，使客人知道要到妳家，而不是回他自己的家。',
  ['保留「敬請光臨貴府」。', '改為「敬請光臨寒舍」。', '改為「敬請光臨尊府」。'],
  '寒舍謙稱自己的住處，貴府、尊府尊稱對方的住處。本題是在邀學士到妳家，所以應寫光臨寒舍。',
  '把抽象敬謙關係改成明確拜訪目的。', '貴府、尊府都與住宅相關，但說話角度不符。');
reviewQuestion('courtesy-mother',
  '學士託人帶來家書，妳要回札問候「學士的母親」。回札的空格是「＿＿近日安好嗎？」請選對稱呼，避免問成自己的母親或對方的妹妹。',
  ['家母', '令堂', '令妹'],
  '令堂尊稱對方的母親；家母是自己的母親，令妹是對方的妹妹。要同時看親屬關係與誰在說話。',
  '改為回札問候的任務，換掉與場景距離較大的誘答。', '一項混淆說話角度，一項混淆親屬關係。');
reviewQuestion('courtesy-advice',
  '康祿海准妳把自己的文章交給學士，請他指出不足。草稿把誰的作品、誰來指導寫混了。哪句能把兩件事都說清楚？',
  ['這是您的拙作，敬請您指教。', '這是晚輩的拙作，請容晚輩賜教。', '這是晚輩的拙作，敬請您指教。'],
  '拙作是謙稱自己的作品；請您指教，是請對方來指導。第一句把對方作品叫拙作，第二句把請益的方向倒轉，只有第三句同時正確。',
  '刪除一眼可排除的自誇語，改成作品歸屬與指導方向兩項判讀。', '兩個誘答各只錯一個敬謙關係。');

reviewQuestion('character-blade',
  '禮官要修復玉冊分類。字形註解說：「刃」是在「刀」上加記號，指出刀口。妳應依這個記號的作用，把字牌放到哪一格？',
  ['象形：重點在描畫刀的外形。', '會意：重點在人與物的意思合起來。', '指事：重點在用記號指出位置。'],
  '依題目採用的傳統分析，刀上新增的記號用來指出刀口，因此刃歸指事。刀形會讓人聯想到象形，但判讀刃時要看新增記號的功能。',
  '移除「凡多一筆就是聲符」等荒謬斷言；三項都使用真實六書概念。', '象形誘答來自只看刀形，會意誘答來自只看到組合而未看記號功能。');
reviewQuestion('character-river',
  '禮官要替「江」補分類籤。玉冊說，左邊的水表示與水有關，右邊的工提示造字時的讀音。妳應按哪一種構造歸類？',
  ['會意：水與工的意思合起來。', '形聲：一部分表示意思，一部分提示聲音。', '指事：以一個記號指出水流的位置。'],
  '江以水取義、以工表聲，屬形聲。不能把工在這個字中的作用解成工人；聲符提示古時聲音，不要求與現代讀音完全相同。',
  '把義類、構件等詞換成意思與讀音；解析保留古今音差提醒。', '誘答分別誤讀構件的意義與指示功能。');
reviewQuestion('character-sun',
  '玉冊上一張古字牌像圓形太陽，後來寫成「日」。禮官要妳說明這張字牌靠什麼方法表示意思，才能放回正確分類。',
  ['象形：依太陽的外形描畫。', '指事：用位置記號表示上下。', '會意：把兩個字的意思組合。'],
  '題目給的古字形描畫太陽輪廓，傳統上歸象形。指事重在象徵記號，會意重在不同構件合義，都不符合本題的外形線索。',
  '移除假借等非本輪必要概念，讓三個選項可直接用已學規則比較。', '誘答都是真實造字法，錯在與題目線索不合。');
reviewQuestion('character-rest',
  '妳發現「江」與「休」都被放進形聲格。註解把休解作「人倚著樹休息」，沒有把人或木當聲音提示。依這個傳統解釋，休應移到哪格？',
  ['象形：直接畫出一棵樹的外形。', '會意：人與木合起來表達休息。', '形聲：木表意思，人提示讀音。'],
  '依本題傳統解釋，人與木共同表達休息的意思，屬會意。雖然休有木的形，但不只是描畫樹；也沒有題目所說的形符、聲符分工。',
  '用錯放字牌帶出比較任務，避免只問定義。', '一項只看木形，一項套用上一題形聲的分工。');

reviewQuestion('books-shiji',
  '學士要妳修正書架。《史記》的書介寫「記錄歷史人物與事件」，抄手卻因它文筆生動而放到集部。按經史子集，應移去哪一部？',
  ['史部：以記錄歷史為主要性質。', '子部：以討論各家思想為主要性質。', '集部：以彙集個人詩文為主要性質。'],
  '分類先看書的主要性質。史記是史書，歸史部；文筆生動不能直接當成集部的判準。子部與集部在選項中的說明雖有各自依據，卻不符合這部書。',
  '三個選項都用正確分類概念，學生須對照書介決定。', '誘答來自混淆思想著作、詩文集與史書，而非荒謬通則。');
reviewQuestion('books-zhuangzi',
  '文淵閣要整理一冊「道家思想著作，常用寓言說理」的《莊子》。學士提醒，不能只因故事好看就放進詩文集。請替它選書架。',
  ['經部：儒家經典書架。', '集部：詩文作品彙編書架。', '子部：諸子思想著作書架。'],
  '莊子是道家著作，四部分類歸子部。寓言精采是表達特色，不能把主要性質改成詩文集；它也不是本題所指的儒家經典。',
  '把先秦等非必要背景移開，用寓言與思想兩條線索判讀。', '集部誘答利用故事文采，經部誘答利用古代思想經典的概括印象。');
reviewQuestion('books-analects',
  '《論語》的書介寫著「儒家重要經典，記錄孔子與弟子的言行」。學士要妳在「經典、史事、諸子」三架中選主架，不能只憑書裡有人物對話判斷。',
  ['史部：依古人的言行記錄來判斷。', '子部：依討論思想與做人來判斷。', '經部：依儒家經典的書籍性質判斷。'],
  '論語在四部分類中歸經部。記錄人物言行、討論做人都可能讓人想到史部或子部，但在此分類制度中，要以其儒家經典的性質為主。',
  '保留四部分類的實際判準，讓兩個誘答都來自真實書介特徵。', '比較表面內容特徵與分類上的主要身分。');
reviewQuestion('books-poetry-collection',
  '書庫搬來《陶淵明集》，書介寫「收錄陶淵明一人的詩與文章」。學士要妳把它與史書、道家思想書分開，應放哪一架？',
  ['集部：同一位作者的詩文集。', '史部：記錄人物事蹟的史書。', '子部：討論諸子思想的著作。'],
  '這是一位作者的詩文集，歸集部。作者生活在古代，不表示他的作品集就是史書；文章中有想法，也不因此變成諸子著作。',
  '用一人詩文集代替未解釋的別集術語。', '誘答比較作者作品、人物事蹟與思想著作三種不同書籍性質。');

reviewQuestion('history-chronological',
  '舊卷藏著尋找下一份證據的年代線索。它像《資治通鑑》一樣，依年月先後記錄事件，而不是按人物或國家分篇。妳應把它歸到哪類？',
  ['紀傳體：以人物傳記等來組織史事。', '國別體：按不同國家分述史事。', '編年體：按年代先後記錄史事。'],
  '本題的關鍵是依年月先後記事，所以是編年體。紀傳體與國別體也是合理的史書分類，但組織順序不同，不能只因都記史事就混在一起。',
  '連結舊卷證據任務，保留三個正確體例說明供比較。', '三項都是真實史書體例，以組織方式區辨。');
reviewQuestion('history-biographical',
  '引導者要妳找出《史記》與《資治通鑑》書籤混放的原因。史記目錄有本紀、世家、列傳等部分，許多史事隨人物敘寫。應為它補哪張籤？',
  ['紀傳體：以人物傳記等組織史事。', '編年體：依年月先後連續記事。', '國別體：把不同國家的史事分開。'],
  '史記是紀傳體通史。題目所列本紀、世家、列傳，及隨人物敘寫的特色，能與按年代記事的編年體、按國家分述的國別體區別。',
  '移除把史書說成詩集的明顯錯項。', '三個誘答方向都屬史書體例，須閱讀目錄線索。');
reviewQuestion('poetry-five-regulated',
  '舊卷的詩稿要放回詩體架。它共有八句，每句五字，中間兩聯成對仗。先依句數與字數判讀，應放在哪格？',
  ['五言絕句：四句，每句五字。', '五言律詩：八句，每句五字。', '七言律詩：八句，每句七字。'],
  '五言說每句五字，一般律詩為八句；兩條線索一起看，得到五言律詩。五言絕句只符合字數，七言律詩只符合句數。',
  '保留兩條條件整合的任務，解釋聯為兩句而不額外考術語。', '兩個誘答各滿足一半條件，不能只看字數或句數。');
reviewQuestion('literature-periods',
  '舊卷的三枚文學暗碼必須由早到晚排好，才能接上下一段線索。書架提示：唐、宋、元是這三種文學風尚的代表時期。請選順序。',
  ['唐詩 → 元曲 → 宋詞', '宋詞 → 唐詩 → 元曲', '唐詩 → 宋詞 → 元曲'],
  '唐、宋、元的先後，對應唐詩、宋詞、元曲。這是代表性成就的概括，不是說詩、詞、曲只存在於一個朝代，也不是它們完全互相取代。',
  '把辨析題接到文學暗碼任務；誘答只交換相鄰時期。', '兩個誘答各錯一段朝代先後，避免完全倒序的過易排除。');

reviewQuestion('logic-false-dilemma',
  '養心殿要決定藏書方案。皇帝說：「妳若不贊成這個方案，就一定反對大家讀書。」妳要保留支持讀書的目標，又指出這句話漏掉的可能，該怎麼回應？',
  ['可以支持大家讀書，同時要求修改這個方案。', '先調查藏書數量，再在全盤贊成與反對讀書之間選一邊。', '先停止讀書活動，等新方案完成後再支持讀書。'],
  '第一項指出另一種可能：支持目標，也能修改做法。第二項仍接受只有兩邊可選，第三項也把讀書與單一方案綁住；都未補回被忽略的選擇。',
  '把假兩難改寫成學生熟悉的目標與做法之別，移除只憑皇權或語氣的荒謬誘答。', '誘答採看似可行的調查或暫停方案，但仍未解除錯誤二分。');
reviewQuestion('logic-causal-leap',
  '皇帝要找出藏書受潮的原因：「昨夜換了新宮燈，今晨書就濕了，所以一定是新燈造成的。」妳要提出可檢驗的處理方式，哪項最合理？',
  ['既然換燈在前，就先把新燈列為已確定的原因。', '先查漏雨、濕度等情況，再檢查是否有足夠證據連到宮燈。', '先換回舊燈；只要隔天沒受潮，就能確認新燈是唯一原因。'],
  '先後發生不等於已證明因果。應查漏雨、濕度等其他因素；換回舊燈後若剛好天氣也變乾，單看一天結果仍不足以確認唯一原因。',
  '把反駁改成調查證據任務，移除重複說話就能成立的誘答。', '一項把先後當因果，一項忽略實驗時其他條件也可能改變。');
reviewQuestion('logic-equivocation',
  '皇帝要用一句話決定妳是否能離開養心殿：「人人應守信；妳拿著一封信，所以應守著信件整夜不睡。」妳要檢查理由與結論是否相接，哪項抓到問題？',
  ['先把守信件的時間縮成一個時辰，就能修好整段推理。', '先查看信件是否重要，再決定妳是否需要遵守承諾。', '守信是遵守承諾，一封信是書信，兩種意思不能直接互換。'],
  '關鍵不是守多久，也不是信件是否重要，而是信的意思被換了：守信談信用，一封信談書信。前提中的信用，不能直接推出要守著信件不睡。',
  '將學術詞義偷換換成理由與結論是否相接，保留易懂的兩種詞義。', '誘答分別修改時間與信件重要性，卻沒有處理關鍵詞換義。');

const reviewed = id => questions.find(q => q.id === id);
reviewQuestion('festival-dragon-boat',
  '齊妃要把御花園的年度活動簿重新裝訂。四張節慶牌的日期掉了，請依同一年先後排好，讓下一場活動不會提前或遲辦。',
  ['清明 → 元宵 → 端午 → 重陽', '元宵 → 清明 → 端午 → 重陽', '元宵 → 端午 → 清明 → 重陽'],
  '元宵在農曆正月，清明一般在國曆四月初，端午在農曆五月，重陽在農曆九月。依一年先後是元宵、清明、端午、重陽；清明不是固定的農曆日期。',
  '不在題幹直接列出正序；補上裝訂活動簿的目的。', '各交換一對容易混淆的春季或春夏節日。');
reviewQuestion('festival-double-ninth',
  '秋宴過後，三張活動卡混在一起：登高插茱萸、乞巧、賞月。齊妃要妳將七夕、中秋、重陽依同一年先後排回園中日誌。',
  ['中秋 → 七夕 → 重陽', '七夕 → 重陽 → 中秋', '七夕 → 中秋 → 重陽'],
  '七夕在農曆七月初七，中秋在八月十五，重陽在九月初九。要把活動連到月份再排序，不是只依卡片擺放順序；插茱萸、登高是重陽線索。',
  '用活動回填日誌連接故事，移除完全倒序的過易誘答。', '各交換七夕與中秋、或中秋與重陽。');
reviewQuestion('festival-lantern',
  '御花園要準備一段從舊年年末到新年正月的慶典。請把團圓守歲、賀歲、觀燈三張牌排好；題目中的除夕屬舊年，其餘兩節屬次年。',
  ['舊年除夕 → 次年春節 → 次年元宵', '次年春節 → 舊年除夕 → 次年元宵', '舊年除夕 → 次年元宵 → 次年春節'],
  '舊年最後一天是除夕，接次年正月初一的春節，再到正月十五的元宵。要留意跨年邊界，不能把舊年除夕當成次年年末。',
  '明定跨年年份，不在牌面附日期讓玩家直接讀數字排序。', '一項混淆除夕與春節先後，一項混淆正月內兩節順序。');
reviewQuestion('season-lotus',
  '宮中畫師請妳整理御花園四季畫冊。請從春天開始，依古典詩歌常見意象排好柳枝、荷花、菊花與寒梅，讓畫冊能連成完整的一年。',
  ['春柳 → 秋菊 → 夏荷 → 冬梅', '春柳 → 夏荷 → 秋菊 → 冬梅', '春柳 → 夏荷 → 冬梅 → 秋菊'],
  '本題採典型意象：春柳、夏荷、秋菊、冬梅，所以依春夏秋冬排列。植物花期會因地點與品種不同，不能把詩歌線索當作所有地方都一樣的自然規律。',
  '移除牌面直接標出的季節，保留物候判讀而非讀標籤排序。', '各混淆夏秋或秋冬相鄰季節。');

reviewQuestion('rhetoric-personification',
  '槿汐要將妳的短詩收入宮中詩冊。請圈出兩處把風或花寫得像人一樣的語句，讓校稿者看得出擬人的依據。',
  ['圈出「晨風」「海棠」兩個被描寫的事物。', '圈出「催我們起床」「悄悄聽我們說話」兩處人的行為。', '圈出「海棠」「悄悄聽我們說話」，只保留花的例子。'],
  '催人起床、聽人說話是人的行為，分別被用來寫晨風與海棠，兩處都是擬人。只圈事物名稱還不夠；只標海棠的一例又漏掉晨風。',
  '刪除只圈標點的荒謬選項，改為圈錯範圍或漏掉一例。', '分別混淆主體與證據、以及只找到部分目標。');
reviewQuestion('rhetoric-hyperbole',
  '浣碧等候傳話，漏刻只過一刻鐘，她卻故意把感受說得很長。槿汐請妳圈出短句裡最直接表現誇飾的那一處，供詩冊作註。',
  ['圈出「一百年」，是故意放大的等待時間。', '圈出「一刻鐘」，是用來比較的實際時間。', '圈出「卻覺得已經等了」，是引出感受的轉折。'],
  '一百年直接超出實際等待時間，是誇飾的文字證據。一刻鐘是實況，轉折語幫助比較；兩者都重要，但不是被故意放大的部分。',
  '改用句內真實線索作誘答，避免主詞自動構成誇飾的說法。', '區分實況、連接語與誇大內容。');
reviewQuestion('rhetoric-metonymy',
  '槿汐在宮宴詩箋旁寫道：「杜康是傳說中的造酒者，這裡席上只有酒，沒有那個人。」請圈出詩箋中借用人名來指酒的詞。',
  ['圈出「公文」，把話題中的物品當成酒。', '圈出「且斟一杯」，找到斟酒動作與數量。', '圈出「杜康」，以與造酒有關的人名代指酒。'],
  '杜康在這裡不指本人，而代指酒，是依關聯形成借代。斟一杯幫助確認正在談酒，但不是題目指定的人名；公文也不是此處代稱酒的詞。',
  '補足人名背景，以主題詞與相鄰動作作誘答。', '區分理解語境的線索與真正承擔借代作用的詞。');
reviewQuestion('rhetoric-pun',
  '槿汐請妳替劉禹錫的詩補閱讀註記。旁註提醒晴與情同音，詩人借天氣寫心意。請圈出短句中兩處同時連到晴雨與情意的詞組。',
  ['圈出「東邊日出西邊雨」，找到晴雨對比的背景。', '圈出「無晴」「有晴」，同時連到無情與有情。', '圈出「無晴」「卻」，找到第一個晴字與轉折。'],
  '無晴、有晴透過晴與情同音，兼帶無情、有情。開頭的日雨景象提供背景，但沒有包含題目要的兩個雙關詞；只圈無晴與卻則漏掉有晴。',
  '以詩句背景與漏標作誘答，刪除位置詞本身能諧音的錯誤說法。', '區分背景對比、完整目標與只標到一半的結果。');

reviewQuestion('inscription-daughter',
  '華妃要核對三份宮中賀禮，禮簿記著生女、生男與長輩賀壽。請把傳統題辭分送到正確場合，避免只因都是喜事就交換使用。',
  ['生女配弄瓦之喜；生男配弄璋之喜；壽誕配壽比南山', '生女配弄璋之喜；生男配弄瓦之喜；壽誕配壽比南山', '生女配壽比南山；生男配弄璋之喜；壽誕配弄瓦之喜'],
  '傳統上，弄瓦賀生女、弄璋賀生男，壽比南山祝長壽。這裡是在辨認歷史用語，不表示男女出生有價值高低。',
  '補核對賀禮的故事目的，保留三組配對與完整摘要。', '交換兩種出生賀辭，或把出生與長壽混用。');
reviewQuestion('inscription-son',
  '頌芝將三份賀禮送錯桌了：一桌賀生男，一桌賀女子出嫁，一桌賀長輩生日。妳要依禮簿重新配對題辭，讓收禮人收到合宜祝福。',
  ['生男配之子于歸；女子出嫁配弄璋之喜；壽誕配壽比南山', '生男配弄璋之喜；女子出嫁配之子于歸；壽誕配壽比南山', '生男配壽比南山；女子出嫁配之子于歸；壽誕配弄璋之喜'],
  '弄璋之喜傳統上賀生男，之子于歸與女子出嫁相關，壽比南山用來祝長壽。三則都有祝賀意思，卻不是所有喜事都能互換。',
  '以送錯禮桌作任務，維持真實題辭用途的比較。', '分別交換出生與出嫁、出生與賀壽。');
reviewQuestion('inscription-wedding',
  '華妃要妳替新婚、添女、賀壽三份禮物補卡。新婚禮特別希望新人建立和睦家庭，請把三則傳統題辭完整配回去。',
  ['婚嫁配弄瓦之喜；添女配宜室宜家；壽誕配壽比南山', '婚嫁配宜室宜家；添女配壽比南山；壽誕配弄瓦之喜', '婚嫁配宜室宜家；添女配弄瓦之喜；壽誕配壽比南山'],
  '宜室宜家祝婚姻與家庭和諧，弄瓦之喜傳統上賀生女，壽比南山祝長壽。可先抓家庭和睦這條線索，再區分出生與壽誕。',
  '用家庭和睦作需整合的祝賀目標，維持一對一配對。', '兩項各保留一組正確配對，需完成全套核對。');
reviewQuestion('inscription-birthday',
  '壽宴將開始，頌芝請妳最後核對健在長輩賀壽、新婚、添男三桌的卡片。請讓每桌都得到符合事件的祝賀題辭。',
  ['賀壽配壽比南山；新婚配宜室宜家；添男配弄璋之喜', '賀壽配宜室宜家；新婚配壽比南山；添男配弄璋之喜', '賀壽配弄璋之喜；新婚配宜室宜家；添男配壽比南山'],
  '壽比南山對應長壽，宜室宜家對應婚姻和睦，弄璋之喜傳統上對應生男。要逐桌核對，不能只看其中一張是否合適。',
  '明定長輩健在、宴前核對的目的。', '各只交換一對場合，避免以無關詞湊數。');

reviewQuestion('couplet-equal-length',
  '安陵容要在宮門換上兩句各七字的聯語。上句已定從「春風送暖」開始，下句從「瑞氣迎祥」開始。查音卡說秀為仄、新為平，請接好片段，讓上句仄收、下句平收。',
  ['上聯：春風送暖萬戶新；下聯：瑞氣迎祥千山秀', '上聯：春風送暖千山秀；下聯：瑞氣迎祥萬戶新', '上聯：瑞氣迎祥千山秀；下聯：春風送暖萬戶新'],
  '上聯保留春風送暖起句，接仄聲秀收尾；下聯保留瑞氣迎祥起句，接平聲新收尾。每句四字加三字成七字。其他排列分別錯在句尾聲類、或指定起句。',
  '用上句、下句解釋上聯下聯，刪去聲類驗收等術語。', '兩項都能組成通順七字句，各只違反一個指定條件。');
reviewQuestion('couplet-ending-tones',
  '安陵容取下宮門聯紙後忘了次序。查音卡已標出秀是仄聲、新是平聲；本次採上聯仄收、下聯平收。請將兩條聯紙排成上聯在前、下聯在後。',
  ['上聯：春回大地千山秀；下聯：福到人間萬戶新', '上聯：福到人間萬戶新；下聯：春回大地千山秀', '兩句順序都可：只看字數相同與意思通順。'],
  '秀仄、新平，依題目規則，秀收尾者是上聯，新收尾者是下聯。兩句字數相同、意思通順，仍不能省略本題指定的末字平仄條件。',
  '刪去不需要下聯的荒謬選項，改為漏查一項規則。', '一項倒置順序，一項只查字數句意而漏掉平仄。');
reviewQuestion('couplet-parts-of-speech',
  '安陵容的聯稿寫著「明月驚醒宿鳥，清風送來花香」。請用四張片段還原這個意思：上句明月起筆、下句清風起筆；鳥為仄聲、香為平聲，上句仄收、下句平收。',
  ['上聯：明月穿簾送花香；下聯：清風入院驚宿鳥', '上聯：清風入院驚宿鳥；下聯：明月穿簾送花香', '上聯：明月穿簾驚宿鳥；下聯：清風入院送花香'],
  '原稿將月光與驚宿鳥相連、清風與花香相連。再保留明月為上句起筆、清風為下句起筆，並以鳥仄、香平檢查句尾，可得唯一排列。本題只檢查說明過的條件。',
  '以白話詩意代替未解釋的詞性分析，錯序仍能讀成完整句。', '一項換錯語意搭配，一項連上下聯指定起句也交換。');
reviewQuestion('couplet-structure',
  '宮門的小聯要保留上句「花開」、下句「鳥語」兩個開頭，再各接一個動作與對象。查音卡說客為仄、春為平，請讓上句仄收、下句平收。',
  ['上聯：花開送春；下聯：鳥語迎客', '上聯：花開迎客；下聯：鳥語送春', '上聯：鳥語迎客；下聯：花開送春'],
  '花開迎客、鳥語送春保留指定起句，結尾分別是客仄、春平。花、鳥是事物，開、語、迎、送在此表示動作，兩句結構相稱；只顧結構會漏掉起句與句尾要求。',
  '把名詞動詞術語換成事物、動作與對象。', '一項只錯末字聲類，一項只錯指定起句。');

reviewQuestion('idiom-rank',
  '溫實初要交出醫官考核記，不能讓誤字影響名冊。請先圈出一處用字錯誤，再選能保留「成績排在前面」意思的修補。',
  ['保留「名列前矛」，將它理解為名次排在前面。', '改為「名列前茅」，表示名次排在前面。', '改為「名列前列」，將相近說法拼合成一句。'],
  '正確成語是名列前茅，表示名次居前。矛與茅形音接近，容易寫混；名列前列則把名列前茅與名次前列等相近說法混接，仍不如正確成語合宜。',
  '刪除前毛誘答，改成近義說法混接。', '一項保留形近誤字，一項混接近義短語。');
reviewQuestion('idiom-satisfactory',
  '溫實初正在核對整理工作的評語。原稿寫「差強人意」，抄手又加了一句意思說明。請圈出誤解原意的註解，再選合宜修法。',
  ['把註解改為「大體上還能讓人勉強滿意」。', '保留「完全不能接受」，把它理解為表現不佳。', '把註解改為「令人十分滿意，沒有需要改進的地方」。'],
  '差強人意的現代常見義是大體上還能令人勉強滿意。看到差就判成完全不能接受，是常見誤解；它也沒有達到十分滿意、完全不用改進的程度。',
  '將三項放在同一滿意程度比較。', '一項過度負面，一項過度正面，檢查詞義程度。');
reviewQuestion('idiom-first-hit',
  '醫官報告想說本房比各房早完成整理。溫實初發現文中可能用了不合場合的成語，請先圈出，再選最準確保留原意的修補。',
  ['保留「首當其衝」，表示首先完成工作。', '改為「率先動工」，表示最早開始整理。', '改為「率先完成」，表示完工時間比別房早。'],
  '首當其衝指首先受攻擊或遭災害，不是一般工作領先。率先動工只說開始得早，未必完成得早；原報告要交代已先完工，因此率先完成最準確。',
  '以真實的開始與完成之別取代完全不相干成語。', '一項誤解成語，一項把先開始當成先完成。');
reviewQuestion('idiom-many-books',
  '藥房要依庫存記錄搬運藥材。溫實初請妳圈出用在對象上不合宜的成語，再選最能保留「堆放的藥材很多」意思的修法。',
  ['保留「藥材汗牛充棟」，表示藥材數量很多。', '改為「藥材堆積如山」，表示堆放的藥材很多。', '改為「藥材種類繁多」，表示藥材有許多不同類別。'],
  '汗牛充棟慣用來形容書籍極多，不宜直接寫藥材。堆積如山保留原稿堆放數量多的意思；種類繁多說類別多，並未說明每類數量或整體堆放情況，不能直接當作相同意思。',
  '改用數量與種類的合理差異，刪去首當其衝誘答。', '一項忽略成語適用對象，一項把數量多改成種類多。');

reviewQuestion('letter-parents',
  '皇后要妳替一位離家的女兒完成請安信。請依本課傳統格式，放好對父母的稱呼、稱呼後的提稱語，以及女兒在信末的署名。',
  ['稱謂父母親大人；提稱語膝下；署名女兒某某敬上。', '稱謂父母親大人；提稱語函丈；署名女兒某某敬上。', '稱謂父母親大人；提稱語台鑒；署名女兒某某敬上。'],
  '父母親大人表明收信對象，膝下是傳統親子書信提稱語，女兒某某敬上表明寄信人。函丈常用於師長，台鑒常用於平輩，都不如膝下符合本題親子格式。',
  '說明提稱語位置，三方案只差要辨析的關係。', '師長或平輩的真實敬語與親子關係不符。');
reviewQuestion('letter-teacher',
  '皇后交給妳一封學生向王老師請教文章的信。請組裝老師稱謂、提稱語與學生署名，讓收信人看得出雙方的師生關係。',
  ['稱謂王老師；提稱語膝下；署名學生某某敬上。', '稱謂王老師；提稱語硯右；署名學生某某敬上。', '稱謂王老師；提稱語函丈；署名學生某某敬上。'],
  '本課採用的師長提稱語是函丈。膝下用於父母或祖父母，硯右常用於同學；不能只因都是有禮貌的古式用語就互換。',
  '三方案保留相同稱謂與署名，只比較提稱語。', '父母、同學與師長的傳統用語互相混淆。');
reviewQuestion('letter-envelope',
  '皇后要寄信給一位一般長輩。請分清信封上請人開信的啟封詞，以及信末寄信人自己的署名，完成兩個欄位。',
  ['信封用敬啟；信末用晚輩某某敬上。', '信封用鈞啟；信末用晚輩某某敬上。', '信封用函丈；信末用晚輩某某敬上。'],
  '依本課傳統格式，鈞啟是尊請一般長輩開信的啟封詞，晚輩某某敬上放在信末。敬啟不能只因帶敬字就當成啟封詞，函丈則是師長提稱語，功能也不同。',
  '在題幹解釋啟封詞功能，三方案只改信封用語。', '把寄信人敬語或信內提稱語搬到啟封詞位置。');
reviewQuestion('letter-self-signature',
  '皇后請妳核對學生寄給王老師的請益信。三個欄位要分別表示收信人、請老師察閱的用語，以及寄信學生的身分，請完成組裝。',
  ['收信稱謂王老師；提稱語函丈；自署學生某某敬上。', '收信稱謂王老師；提稱語函丈；自署家師某某敬上。', '收信稱謂王老師；提稱語函丈；自署令師某某敬上。'],
  '學生某某敬上才是寫信人的自署；家師指自己的老師，令師指對方的老師，都不是學生自己的身分。稱謂與提稱語即使放對，署名仍須另查。',
  '三方案保留相同稱謂與提稱語，聚焦自署。', '分清學生、自己的老師與對方老師，不以亂換欄位作誘答。');

reviewQuestion('age-coming-of-age',
  '太后要將一份古代女子的禮簿放回年齡檔。書上只寫「及笄」，請標出這個傳統稱呼常指的歲數；不按今天的法律成年年齡判斷。',
  ['標記13歲。', '標記15歲。', '標記20歲。'],
  '傳統上，及笄通常指女子十五歲。十三歲常與豆蔻相關，二十歲常與男子弱冠相關，都是容易混淆的年齡線索，但不適用本題。',
  '刪掉選項自帶的錯誤原因，保留年齡軸判讀。', '十三與二十均有其他傳統稱呼，不用無關數字湊選項。');
reviewQuestion('age-standing',
  '壽宴席單把一位賓客的年齡寫成「而立」。太后要妳補上歲數，好讓座次資料一致；請把年齡軸標記放到合適位置。',
  ['標記20歲。', '標記40歲。', '標記30歲。'],
  '而立通常代稱三十歲。二十歲的弱冠、四十歲的不惑是另外的年齡稱呼，不能因都是成人就當成相同歲數。',
  '將歲數回填接到席單任務，不在選項旁提示混淆原因。', '以相鄰的常見年齡代稱作誘答。');
reviewQuestion('time-midnight',
  '太后要妳安排夜間傳信。值夜簿寫「子時交接」，但鐘點欄空了。請在跨夜時間軸上，標出一般子時對應的兩小時時段。',
  ['標記23:00至翌日01:00。', '標記11:00至13:00。', '標記05:00至07:00。'],
  '子時一般對應二十三時到翌日一時；十一時到十三時是午時，五時到七時是卯時。要區分夜半、中午與清晨，不能只因都長兩小時就視為相同。',
  '補夜間交接任務，去掉選項已標明混淆的字樣。', '以午時、卯時的真實時段測試晝夜與時辰對應。');
reviewQuestion('cycle-sexagenary',
  '太后要核對兩次同名干支紀年的間隔。十天干每10年一輪，十二地支每12年一輪；現在同在甲子。請標出最少再過幾年，兩盤會同時回到原配對。0是現在，不算再過。',
  ['標記再過12年。', '標記再過60年。', '標記再過24年。'],
  '要找10與12兩個循環共同回到起點的最少年數。12、24、36、48都還不是10的整數倍，60才同時符合兩個循環，因此最少再過六十年。',
  '以兩輪同時回原點解釋循環，解析可逐一核對倍數，不先要求會最小公倍數術語。', '十二與二十四都讓地支回原位，卻未讓天干一起回原位。');

reviewed('courtesy-mother').hint = '先找對方的母親，再區分家母與令堂的說話角度。';
reviewed('character-blade').choices.find(c => c.id === 'b').text = '會意：刀與另一部分的意思合起來。';
reviewed('character-blade').explanation = '依題目採用的傳統分析，刀上新增的記號用來指出刀口，因此刃歸指事。這個記號是在指位置，不是另一個完整的字來與刀合義；也不能只看到刀形就忽略新增記號。';
reviewed('courtesy-advice').hint = '分別問兩件事：文章是誰寫的？妳想請誰指導？';
reviewed('courtesy-advice').correction = '拙作謙稱自己的作品；請對方指導可用「敬請指教」。';
reviewed('festival-lantern').interaction.tokens.forEach(t => {
  t.text = { lantern: '元宵・觀燈', eve: '除夕・團聚守歲', newyear: '春節・賀歲' }[t.id];
});
reviewed('season-lotus').interaction.tokens.forEach(t => {
  t.text = { autumn: '菊花傲霜', summer: '映日荷花', winter: '寒梅映雪', spring: '柳枝新綠' }[t.id];
});
reviewed('season-lotus').hint = '先找回暖的新綠與寒冷的雪景，再安排其間的兩種花。';
reviewed('couplet-equal-length').interaction.instruction = '每句用四字開頭接三字結尾。保留指定開頭，排成上聯在前、下聯在後。';
reviewed('couplet-parts-of-speech').interaction.instruction = '先照原稿的意思接好兩句，再排成上聯在前、下聯在後。';
reviewed('couplet-structure').interaction.instruction = '保留花開、鳥語兩個指定開頭，檢查句尾規則，再排好兩句。';
reviewed('letter-teacher').interaction.tiles.find(t => t.id === 'parents').text = '硯右';
reviewed('age-coming-of-age').interaction.instruction = '移動年齡標記，選出及笄通常對應的歲數。';
reviewed('age-standing').interaction.instruction = '移動年齡標記，補出席單上而立對應的歲數。';
reviewed('cycle-sexagenary').interaction.instruction = '選出最少再過多少年，兩個轉盤會一起回到原來的配對。';
reviewed('cycle-sexagenary').hint = '逐一看12的倍數，找第一個也是10的倍數的年數。';
for (const q of questions) q.puzzle.evidence[2] = q.hint;
