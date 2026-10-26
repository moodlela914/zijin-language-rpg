# 十二關題庫歸檔與調度索引

本輪一次完成十二關 **47 題**：第一至十一關各 4 題，養心殿 3 題。原有六題 ID 保留，題幹與選項已升級為情境修補／辨析。題目採國中中等難度設計，尚未經學生試作校準，也尚未獲教師審核。

其中七關共 **28 題**附正式試煉互動 payload：御花園排序、碎玉軒圈選、翊坤宮配對、延禧宮聯語排列、太醫院校勘、景仁宮書信組裝、慈寧宮時間軸。這些題目的題幹、正解摘要、提示與解析都與實際操作任務一致。

## 與場景探索機關的關係

這 47 題是本機遊戲「場景探索、蒐集線索、解開機關，再進入語文試煉」流程中的正式題庫配套。每殿的探索機關資料由主 agent 維護於 `src/data/puzzles.js`，本資料夾保存的是後續試煉題目與可供未來調度的線索 metadata，兩者不重複計為題目數。

探索關卡可先教會判讀規則，再讓試煉題檢查玩家是否能遷移到新情境；完整遊戲的互動是否接線完成，以主程式驗收為準。本輪未把機關線索本身當成獨立測驗分數，仍需避免讓「找到提示」等同「已證明能力掌握」。

## 唯一來源與再生方式

- 執行時唯一來源：`src/data/questions.js`，遊戲不讀取本資料夾。
- 歸檔入口：`docs/question-bank/index.json`。
- 每關 JSON 包含完整題目與答案、解析、提示、修正概念、來源、解謎適配資訊。
- 本輪快照：`2026-10-26-v2-interactions`；索引記錄原始題庫 SHA-256，便於確認版本。
- 更新題庫後：`node scripts/archive-questions.mjs`。
- 只檢查同步：`node scripts/archive-questions.mjs --check`。

## 關卡清單

| 關卡 | 地點 | 考點 | 題數 | 場景互動適配 | 正式題目互動 |
|---|---|---|---:|---|---|
| 01 | 大清門外 | 敬謙詞 | 4 | 敬謙詞書札修補 | renderer-derived-from-choices |
| 02 | 太和殿前 | 六書 | 4 | 六書字牌分類 | renderer-derived-from-choices |
| 03 | 文淵閣 | 四部分類 | 4 | 經史子集歸架 | renderer-derived-from-choices |
| 04 | 御花園 | 節令民俗、節令詩詞 | 4 | 節令詩詞配對與排序 | sequence |
| 05 | 碎玉軒 | 修辭辨析 | 4 | 修辭線索辨識 | highlight |
| 06 | 翊坤宮 | 題辭辨析 | 4 | 題辭送禮配對 | matching |
| 07 | 延禧宮 | 對聯格律 | 4 | 上下聯排序與結構修補 | couplet |
| 08 | 太醫院 | 字形與成語 | 4 | 字形校勘與成語詞義核對 | proofread |
| 09 | 景仁宮 | 書信稱謂 | 4 | 書信組裝 | form |
| 10 | 慈寧宮 | 年齡與干支 | 4 | 年齡時辰排序與循環推算 | timeline |
| 11 | 慎刑司 | 文體與史書 | 4 | 文體史書整理 | renderer-derived-from-choices |
| 12 | 養心殿 | 語言邏輯 | 3 | 論證謬誤證據鏈 | renderer-derived-from-choices |

## 主 agent 如何調度

1. 先按 `index.chapters[].chapterId` 找關卡，取得題目 ID、概念、學習目標、`puzzle.mode` 與快照檔案。
2. 按題目 ID 反查：`index.byQuestionId[questionId]` 可直接取得關卡及檔案位置。
3. 遊戲程式仍直接匯入 `questions.js`，可用 `questions.filter(q => q.chapterId === chapterId)` 選關。
4. `difficulty: 'medium'` 是設計目標；`skill` 是應用／分析。`puzzle.evidence` 為線索字串陣列，供未來探索與出題索引使用。
5. 探索機關由主 agent 的獨立場景模組負責；此處只記錄題目與互動適配，不宣稱互動已實作。

## 正式題目 interaction 契約

- `sequence`、`couplet`：`tokens: [{id,text}]`，`solution: id[]` 包含全部牌卡且不得重複。排序題三至四牌，聯語二至四牌。
- `highlight`：`segments: [{id,text}]` 依序連接成完整短文，`targetIds` 精確指出一至兩處應圈選的片段。
- `matching`：`pairs: [{id,left,right}]`，每題二至三組，左右文字各自唯一。renderer 可打亂右側，不能把正解摘要直接顯示為已配好的答案。
- `proofread`：`segments` 是完整待校稿文字，`targetId` 只指一處誤寫或詞義錯誤；圈選後再由既有三個選項選修補。
- `form`：`fields: [{id,label}]`、`tiles: [{id,text}]`，`solution` 是欄位 ID 對詞牌 ID；每題二至三欄、三至五詞牌，正解不重用詞牌。
- `timeline`：`ticks: [{id,text}]` 按題目所述時序排列，至少六個刻度，`solutionId` 指向應標記的刻度。跨日時間軸有明示起訖，不把零年當成「再過」的正整數年數。
- 操作正確時映射到原有 `q.answerId`，不正確時映射到其他選項 ID，判分仍由主引擎執行。三選項保留作為報表與結果摘要；除校勘第二步外，七關正式介面不必將原三選項直接顯示給玩家。
- `index.byQuestionId` 額外提供 `interactionKind`、`interactionInstruction`、`interactionPayloadLocation`、`correctAnswerId`，便於未來調度。
- 自動歸檔會校驗各種正解引用、ID 唯一、排序完整、配對詞唯一、欄位正解完備與時間軸刻度數；語文正確性與教學難度仍需教師驗收。

## 資料來源與審核狀態

情境及選項為本專案原創，知識查閱以教育部辭典、官方學校教材與大學圖書館資料為主。以下是已實際查閱或在搜尋結果核對的參考資料；部分頁面僅支持其中的概念，不代表每道題及其所有誘答都獲來源逐字背書。各題有連結者標記 `reference-linked`，未逐題連結者標記 `teacher-review-needed`；所有題目均保留 `draft-teacher-review`。

- [教育部《國語辭典簡編本》：家父](https://dict.concised.moe.edu.tw/dictView.jsp?ID=21808)
- [教育部《國語辭典簡編本》：寒舍](https://dict.concised.moe.edu.tw/dictView.jsp?ID=19676)
- [教育部《重編國語辭典修訂本》：指事](https://dict.revised.moe.edu.tw/dictView.jsp?ID=113996)
- [教育部《重編國語辭典修訂本》：形聲](https://dict.revised.moe.edu.tw/dictView.jsp?ID=110679)
- [國立成功大學圖書館：文淵閣四庫全書電子版介紹](https://libapp.lib.ncku.edu.tw/libref/chinese/single/oldbook2.htm)
- [教育部《國語辭典簡編本》附錄：親屬稱謂表](https://dict.concised.moe.edu.tw/appendix.jsp?ID=32&deg=1&la=2)
- [教育部《國語辭典簡編本》：不吝賜教](https://dict.concised.moe.edu.tw/dictView.jsp?ID=2007)
- [教育部《國語辭典簡編本》：弄瓦](https://dict.concised.moe.edu.tw/dictView.jsp?ID=13082)
- [教育部《重編國語辭典修訂本》：弄璋](https://dict.revised.moe.edu.tw/dictView.jsp?ID=58782)
- [教育部《國語辭典簡編本》：壽比南山](https://dict.concised.moe.edu.tw/dictView.jsp?ID=34367)
- [國立臺灣師範大學 APCS：七言對聯題本範例（平仄規則）](https://apcs.csie.ntnu.edu.tw/wp-content/uploads/2025/08/01_APCS-%E7%A8%8B%E5%BC%8F%E5%AF%A6%E4%BD%9C%E5%88%9D%E7%B4%9A%E9%A1%8C%E6%9C%AC%E7%AF%84%E4%BE%8B.pdf)
- [教育部《國語辭典簡編本》：名列前茅](https://dict.concised.moe.edu.tw/dictView.jsp?ID=4807)
- [教育部《重編國語辭典修訂本》：差強人意](https://dict.revised.moe.edu.tw/dictView.jsp?ID=121497)
- [教育部《國語辭典簡編本》：首當其衝](https://dict.concised.moe.edu.tw/dictView.jsp?ID=34266)
- [教育部《國語辭典簡編本》：汗牛充棟](https://dict.concised.moe.edu.tw/dictView.jsp?ID=19701)
- [教育部《重編國語辭典修訂本》：膝下](https://dict.revised.moe.edu.tw/dictView.jsp?ID=104596)
- [新竹縣內思工業高級中等學校：劉玉瑞老師應用文教學資料](https://www.savs.hcc.edu.tw/ischool/publish_page/198/?cid=10325)
- [教育部《重編國語辭典修訂本》：及笄](https://dict.revised.moe.edu.tw/dictView.jsp?ID=87862)
- [教育部臺灣台語常用詞辭典：子（子時）](https://sutian.moe.edu.tw/zh-hant/su/192/)
- [教育部《重編國語辭典修訂本》：六十甲子](https://dict.revised.moe.edu.tw/dictView.jsp?ID=63847)
- [教育部《重編國語辭典修訂本》：編年體](https://dict.revised.moe.edu.tw/dictView.jsp?ID=18667)
- [教育部《重編國語辭典修訂本》：五律](https://dict.revised.moe.edu.tw/dictView.jsp?ID=159521)

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
